import type { RequestHandler } from 'express';
import crypto from 'node:crypto';
import nodemailer from 'nodemailer';
import { checkPassword, dbUserOperations, type User } from './db';
import { createSessionToken, rateLimited, userFromRequest } from './session';

const OTP_TTL_MS = 10 * 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;

type OTPData = { otp: string; timestamp: number; attempts: number };
const otpStore: Record<string, OTPData> = {};

const getEmailTransporter = () => {
  const port = parseInt(process.env.HOSTINGER_PORT || '465');
  return nodemailer.createTransport({
    host: process.env.HOSTINGER_SMTP || 'smtp.hostinger.com',
    port,
    secure: port === 465,
    auth: {
      user: process.env.HOSTINGER_EMAIL,
      pass: process.env.HOSTINGER_PASSWORD,
    },
  });
};

const generateOTP = () => crypto.randomInt(100000, 1000000).toString();
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isPhone = (v: string) => /^\d{10}$/.test(v);

const publicUser = (u: User) => ({ fullName: u.fullName, email: u.email, phoneNumber: u.phoneNumber });
const loginSuccess = (u: User) => ({
  message: 'Login successful',
  token: createSessionToken(u.id),
  user: publicUser(u),
});

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

// Protects SMS credits and the mailbox: per recipient 1/min and 5/hour, per IP 10/hour.
function otpSendBlocked(target: string, ip: string): string | null {
  if (rateLimited('otp-ip', ip, 10, HOUR)) return 'Too many OTP requests. Please try again in an hour.';
  if (rateLimited('otp-min', target, 1, MINUTE)) return 'Please wait a minute before requesting another OTP.';
  if (rateLimited('otp-hour', target, 5, HOUR)) return 'Too many OTP requests for this account. Please try again in an hour.';
  return null;
}

// Current session → user (used by the site to confirm a stored login is still valid)
export const me: RequestHandler = (req, res) => {
  const user = userFromRequest(req);
  if (!user) {
    res.status(401).json({ error: 'Not logged in' });
    return;
  }
  res.status(200).json({ user: publicUser(user) });
};

function checkOTP(key: string, otp: string): string | null {
  const stored = otpStore[key];
  if (!stored) return 'OTP expired or not sent';
  if (Date.now() - stored.timestamp > OTP_TTL_MS) {
    delete otpStore[key];
    return 'OTP expired';
  }
  if (stored.otp !== otp) {
    stored.attempts += 1;
    if (stored.attempts >= MAX_OTP_ATTEMPTS) {
      delete otpStore[key];
      return 'Too many wrong attempts. Please request a new OTP.';
    }
    return 'Invalid OTP';
  }
  delete otpStore[key];
  return null;
}

// Password Login
export const verifyPassword: RequestHandler = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password required' });
    return;
  }
  if (rateLimited('pw', String(email).toLowerCase(), 10, 15 * MINUTE)) {
    res.status(429).json({ error: 'Too many login attempts. Please try again in 15 minutes or use OTP login.' });
    return;
  }
  const user = dbUserOperations.findByEmail(email);
  if (!user) {
    res.status(401).json({ error: 'Account not found. Please sign up first.' });
    return;
  }
  if (!checkPassword(user, password)) {
    res.status(401).json({ error: 'Invalid password' });
    return;
  }
  res.status(200).json(loginSuccess(user));
};

// Send Email OTP for Login
export const sendEmailOTP: RequestHandler = async (req, res) => {
  const { email } = req.body;
  if (!email || !isEmail(email)) {
    res.status(400).json({ error: 'Valid email required' });
    return;
  }
  const user = dbUserOperations.findByEmail(email);
  if (!user) {
    res.status(401).json({ error: 'Account not found. Please sign up first.' });
    return;
  }

  const key = user.email!;
  const blocked = otpSendBlocked(key, req.ip || 'unknown');
  if (blocked) {
    res.status(429).json({ error: blocked });
    return;
  }
  const otp = generateOTP();
  otpStore[key] = { otp, timestamp: Date.now(), attempts: 0 };

  try {
    await getEmailTransporter().sendMail({
      from: `"Agrovista" <${process.env.HOSTINGER_EMAIL}>`,
      to: key,
      subject: 'Your Agrovista login OTP',
      text: `Your Agrovista OTP is ${otp}. It is valid for 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #065f46;">AGROVISTA</h2>
          <p>Your One-Time Password (OTP) for login is:</p>
          <h1 style="color: #b45309; letter-spacing: 5px; font-size: 32px; margin: 20px 0;">${otp}</h1>
          <p style="color: #666;">This OTP is valid for 10 minutes. Do not share it with anyone.</p>
          <p style="color: #999; font-size: 12px;">Pure Jaggery &amp; Natural Honey — agrovista.shop</p>
        </div>
      `,
    });
    res.status(200).json({ message: 'OTP sent to your email. Check your inbox.' });
  } catch (error) {
    console.error('Email OTP send failed:', error);
    delete otpStore[key];
    res.status(500).json({ error: 'Could not send OTP email. Please try again.' });
  }
};

// Verify Email OTP for Login
export const verifyEmailOTP: RequestHandler = (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    res.status(400).json({ error: 'Email and OTP required' });
    return;
  }
  const user = dbUserOperations.findByEmail(email);
  if (!user) {
    res.status(401).json({ error: 'Account not found. Please sign up first.' });
    return;
  }
  const err = checkOTP(user.email!, String(otp));
  if (err) {
    res.status(401).json({ error: err });
    return;
  }
  res.status(200).json(loginSuccess(user));
};

// Send Phone OTP for Login
export const sendPhoneOTP: RequestHandler = async (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber || !isPhone(phoneNumber)) {
    res.status(400).json({ error: 'Valid 10-digit phone number required' });
    return;
  }
  const user = dbUserOperations.findByPhone(phoneNumber);
  if (!user) {
    res.status(401).json({ error: 'Account not found. Please sign up first.' });
    return;
  }

  const blocked = otpSendBlocked(phoneNumber, req.ip || 'unknown');
  if (blocked) {
    res.status(429).json({ error: blocked });
    return;
  }
  const otp = generateOTP();
  otpStore[phoneNumber] = { otp, timestamp: Date.now(), attempts: 0 };

  try {
    const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        authorization: process.env.FAST2SMS_API_KEY || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        route: 'otp',
        var_id: '221249',
        numbers: phoneNumber,
        variables_values: otp,
      }),
    });
    const data = (await response.json()) as { return?: boolean };
    if (data.return === true) {
      res.status(200).json({ message: 'OTP sent to your phone' });
    } else {
      console.error('Fast2SMS error:', data);
      delete otpStore[phoneNumber];
      res.status(500).json({ error: 'Failed to send OTP' });
    }
  } catch (error) {
    console.error('Phone OTP send error:', error);
    delete otpStore[phoneNumber];
    res.status(500).json({ error: 'Error sending OTP' });
  }
};

// Verify Phone OTP for Login
export const verifyPhoneOTP: RequestHandler = (req, res) => {
  const { phoneNumber, otp } = req.body;
  if (!phoneNumber || !otp) {
    res.status(400).json({ error: 'Phone number and OTP required' });
    return;
  }
  const user = dbUserOperations.findByPhone(phoneNumber);
  if (!user) {
    res.status(401).json({ error: 'Account not found. Please sign up first.' });
    return;
  }
  const err = checkOTP(phoneNumber, String(otp));
  if (err) {
    res.status(401).json({ error: err });
    return;
  }
  res.status(200).json(loginSuccess(user));
};

// Signup with Email
export const signupEmail: RequestHandler = (req, res) => {
  const { fullName, email, password, phoneNumber } = req.body;
  if (!fullName || !email || !password) {
    res.status(400).json({ error: 'Full name, email, and password required' });
    return;
  }
  if (!isEmail(email)) {
    res.status(400).json({ error: 'Invalid email address' });
    return;
  }
  if (phoneNumber && !isPhone(phoneNumber)) {
    res.status(400).json({ error: 'Invalid phone number' });
    return;
  }
  if (String(password).length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters' });
    return;
  }
  const result = dbUserOperations.create(fullName, email, phoneNumber || null, password);
  if (!result.success) {
    res.status(400).json({ error: result.error });
    return;
  }
  res.status(201).json({ ...loginSuccess(result.user), message: 'Account created successfully' });
};

// Signup with Phone
export const signupPhone: RequestHandler = (req, res) => {
  const { fullName, phoneNumber, password } = req.body;
  if (!fullName || !phoneNumber || !password) {
    res.status(400).json({ error: 'Full name, phone, and password required' });
    return;
  }
  if (!isPhone(phoneNumber)) {
    res.status(400).json({ error: 'Invalid phone number' });
    return;
  }
  if (String(password).length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters' });
    return;
  }
  const result = dbUserOperations.create(fullName, null, phoneNumber, password);
  if (!result.success) {
    res.status(400).json({ error: result.error });
    return;
  }
  res.status(201).json({ ...loginSuccess(result.user), message: 'Account created successfully' });
};
