import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) throw new Error('AUTH_SECRET must be at least 32 characters');
  return new TextEncoder().encode(value);
}
export type TelegramIdentity = { id: number; first_name?: string; last_name?: string; username?: string; photo_url?: string };
export async function setSession(payload: Record<string, unknown>, cookieName = 'student_session', hours = 24) {
  const token = await new SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime(`${hours}h`).sign(secret());
  cookies().set(cookieName, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: hours * 3600 });
}
export async function readSession(cookieName = 'student_session') {
  const token = cookies().get(cookieName)?.value;
  if (!token) return null;
  try { const { payload } = await jwtVerify(token, secret()); return payload; } catch { return null; }
}
export async function requireAdmin() {
  const session = await readSession('admin_session');
  return session?.role === 'admin' ? session : null;
}
export function verifyTelegramLogin(data: Record<string, string | number>) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) throw new Error('Missing TELEGRAM_BOT_TOKEN');
  const crypto = require('crypto') as typeof import('crypto');
  const hash = String(data.hash || '');
  const authDate = Number(data.auth_date || 0);
  if (!hash || !authDate || Math.abs(Date.now() / 1000 - authDate) > 600) return false;
  const checkString = Object.keys(data).filter(k => k !== 'hash' && data[k] !== undefined).sort().map(k => `${k}=${data[k]}`).join('\n');
  const secretKey = crypto.createHash('sha256').update(botToken).digest();
  const expected = crypto.createHmac('sha256', secretKey).update(checkString).digest('hex');
  try { return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(expected, 'hex')); } catch { return false; }
}
