import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';
export async function POST(request:NextRequest) {
  const {password} = await request.json();
  if (!process.env.ADMIN_PASSWORD || !process.env.AUTH_SECRET || process.env.AUTH_SECRET.length<32) return NextResponse.json({error:'Admin secrets are not configured.'},{status:500});
  if (typeof password!=='string' || password!==process.env.ADMIN_PASSWORD) return NextResponse.json({error:'Incorrect password.'},{status:401});
  const token = await new SignJWT({role:'admin'}).setProtectedHeader({alg:'HS256'}).setIssuedAt().setExpirationTime('8h').sign(new TextEncoder().encode(process.env.AUTH_SECRET));
  const response = NextResponse.json({ok:true});
  response.cookies.set('admin_session',token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',maxAge:28800});
  return response;
}
