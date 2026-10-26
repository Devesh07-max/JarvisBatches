import { NextRequest, NextResponse } from 'next/server';
import { verifyCheckoutSignature, razorpay } from '@/lib/razorpay';
import { finalizeCapturedPayment } from '@/lib/finalize-payment';
import { db } from '@/lib/db';
import { createHash, timingSafeEqual } from 'crypto';
import { errorResponse } from '@/lib/http';
export async function POST(request: NextRequest) {
  try {
    const {razorpay_order_id,razorpay_payment_id,razorpay_signature,accessKey} = await request.json();
    if (![razorpay_order_id,razorpay_payment_id,razorpay_signature,accessKey].every(v=>typeof v==='string'&&v.length>0)) return NextResponse.json({error:'Missing payment details.'},{status:400});
    if (!verifyCheckoutSignature(razorpay_order_id,razorpay_payment_id,razorpay_signature)) return NextResponse.json({error:'Payment signature verification failed.'},{status:400});
    const database=await db();const order=await database.collection('orders').findOne({razorpayOrderId:razorpay_order_id});
    if(!order||!order.accessKeyHash)return NextResponse.json({error:'Order not found.'},{status:404});
    const incoming=createHash('sha256').update(accessKey).digest();const saved=Buffer.from(order.accessKeyHash,'hex');if(incoming.length!==saved.length||!timingSafeEqual(incoming,saved))return NextResponse.json({error:'Invalid purchase access key.'},{status:403});
    const payment:any = await razorpay().payments.fetch(razorpay_payment_id);
    if (payment.order_id!==razorpay_order_id || payment.status!=='captured') return NextResponse.json({error:'Payment is not captured yet. Please refresh in a moment.'},{status:409});
    await finalizeCapturedPayment({razorpayOrderId:razorpay_order_id,razorpayPaymentId:razorpay_payment_id,source:'checkout'});
    return NextResponse.json({ok:true,purchaseUrl:`/purchase/${encodeURIComponent(razorpay_order_id)}?key=${encodeURIComponent(accessKey)}`});
  } catch(e) { return errorResponse(e,500); }
}
