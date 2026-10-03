import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export type User = {
  id: number;
  fullName: string;
  email: string | null;
  phoneNumber: string | null;
  passwordHash: string;
  createdAt: string;
};

const dbPath = path.join(process.cwd(), 'users.json');

function load(): User[] {
  try {
    return JSON.parse(fs.readFileSync(dbPath, 'utf8')) as User[];
  } catch {
    return [];
  }
}

function save(users: User[]) {
  fs.writeFileSync(dbPath, JSON.stringify(users, null, 2));
}

function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function checkPassword(user: User, password: string) {
  const [salt, hash] = user.passwordHash.split(':');
  const candidate = crypto.scryptSync(password, salt, 64);
  return crypto.timingSafeEqual(candidate, Buffer.from(hash, 'hex'));
}

export const dbUserOperations = {
  create: (fullName: string, email: string | null, phoneNumber: string | null, password: string) => {
    const users = load();
    const normalizedEmail = email ? email.trim().toLowerCase() : null;
    if (normalizedEmail && users.some((u) => u.email === normalizedEmail)) {
      return { success: false as const, error: 'Email already registered' };
    }
    if (phoneNumber && users.some((u) => u.phoneNumber === phoneNumber)) {
      return { success: false as const, error: 'Phone number already registered' };
    }
    const user: User = {
      id: users.reduce((max, u) => Math.max(max, u.id), 0) + 1,
      fullName: fullName.trim(),
      email: normalizedEmail,
      phoneNumber,
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    save(users);
    return { success: true as const, user };
  },

  findByEmail: (email: string) => {
    const normalized = email.trim().toLowerCase();
    return load().find((u) => u.email === normalized);
  },

  findByPhone: (phoneNumber: string) => load().find((u) => u.phoneNumber === phoneNumber),

  findById: (id: number) => load().find((u) => u.id === id),
};
