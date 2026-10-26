import { NextResponse } from 'next/server';
export function errorResponse(error: unknown, status = 400) {
  const message = error instanceof Error ? error.message : 'Unexpected error';
  return NextResponse.json({ error: message }, { status });
}
export function safeEqualString(a: string, b: string) {
  const crypto = require('crypto') as typeof import('crypto');
  const aa = Buffer.from(a); const bb = Buffer.from(b);
  return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
}
