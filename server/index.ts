import 'dotenv/config';
import express from 'express';
import {
  verifyPassword,
  sendEmailOTP,
  verifyEmailOTP,
  sendPhoneOTP,
  verifyPhoneOTP,
  signupEmail,
  signupPhone,
  me,
} from './auth';
import { placeOrder } from './orders';
import { sendEnquiry } from './enquiry';

export function createServer() {
  const app = express();
  app.set('trust proxy', 'loopback');
  app.use(express.json());

  // Auth routes - Login
  app.post('/api/auth/verify-password', verifyPassword);
  app.post('/api/auth/send-email-otp', sendEmailOTP);
  app.post('/api/auth/verify-email-otp', verifyEmailOTP);
  app.post('/api/auth/send-phone-otp', sendPhoneOTP);
  app.post('/api/auth/verify-phone-otp', verifyPhoneOTP);

  // Auth routes - Signup
  app.post('/api/auth/signup-email', signupEmail);
  app.post('/api/auth/signup-phone', signupPhone);

  app.get('/api/auth/me', me);

  // Orders (requires login)
  app.post('/api/orders', placeOrder);

  // Quick Enquiry form
  app.post('/api/enquiry', sendEnquiry);

  return app;
}
