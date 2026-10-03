import crypto from 'node:crypto';
import type { RequestHandler } from 'express';
import { dbUserOperations, type User } from './db';

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error('AUTH_SECRET is not set in .env');
  return s;
}

const sign = (payload: string) => crypto.createHmac('sha256', secret()).update(payload).digest('base64url');

// Stateless signed token: base64url({uid, exp}).signature
export function createSessionToken(userId: number) {
  const payload = Buffer.from(JSON.stringify({ uid: userId, exp: Date.now() + SESSION_TTL_MS })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string): User | null {
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return null;
  const expected = sign(payload);
  if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    const { uid, exp } = JSON.parse(Buffer.from(payload, 'base64url').toString()) as { uid: number; exp: number };
    if (Date.now() > exp) return null;
    return dbUserOperations.findById(uid) ?? null;
  } catch {
    return null;
  }
}

export function userFromRequest(req: Parameters<RequestHandler>[0]): User | null {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  return token ? verifySessionToken(token) : null;
}

// Simple in-memory sliding-window rate limiter.
const hits: Record<string, number[]> = {};

export function rateLimited(bucket: string, key: string, limit: number, windowMs: number) {
  const id = `${bucket}:${key}`;
  const now = Date.now();
  hits[id] = (hits[id] || []).filter((t) => now - t < windowMs);
  if (hits[id].length >= limit) return true;
  hits[id].push(now);
  return false;
}
