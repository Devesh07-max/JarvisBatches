import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { razorpay } from '@/lib/razorpay';
import { errorResponse } from '@/lib/http';
import { randomBytes, randomUUID, createHash } from 'crypto';
export async function POST(request: NextRequest) {
  try {
    const {slug} = await request.json();
    if (typeof slug !== 'string') return NextResponse.json({error:'Invalid course.'},{status:400});
    const database = await db();
    const course = await database.collection('courses').findOne({slug,active:true});
    if (!course || !Number.isInteger(course.pricePaise) || course.pricePaise < 100) return NextResponse.json({error:'Course is unavailable or has an invalid price.'},{status:404});
    const receipt = `jb_${randomUUID().replace(/-/g,'').slice(0,24)}`;
    const accessKey = randomBytes(32).toString('hex');
    const order = await razorpay().orders.create({amount:course.pricePaise,currency:'INR',receipt,notes:{courseId:String(course._id),courseSlug:course.slug,brand:'Jarvis Batches'}});
    await database.collection('orders').insertOne({courseId:course._id,courseName:course.name,courseSlug:course.slug,amountPaise:course.pricePaise,currency:'INR',accessKeyHash:createHash('sha256').update(accessKey).digest('hex'),razorpayOrderId:order.id,status:'created',createdAt:new Date(),updatedAt:new Date()});
    return NextResponse.json({orderId:order.id,amount:order.amount,currency:order.currency,keyId:process.env.RAZORPAY_KEY_ID,courseName:course.name,accessKey});
  } catch (e) { return errorResponse(e,500); }
}
