import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { readSession } from '@/lib/auth';
export async function GET(){const s=await readSession('admin_session');if(s?.role!=='admin')return NextResponse.json({error:'Unauthorized'},{status:401});const d=await db();const orders=await d.collection('orders').find({}).sort({createdAt:-1}).limit(200).toArray();return NextResponse.json({orders:orders.map(o=>({...o,_id:String(o._id),courseId:String(o.courseId)}))});}
