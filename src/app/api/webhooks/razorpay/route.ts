import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/razorpay';
import { db } from '@/lib/db';
import { finalizeCapturedPayment } from '@/lib/finalize-payment';
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get('x-razorpay-signature') || '';
  const eventId = request.headers.get('x-razorpay-event-id') || '';
  try {
    if (!verifyWebhookSignature(rawBody,signature)) return NextResponse.json({error:'Invalid webhook signature'},{status:400});
    const event = JSON.parse(rawBody);
    if (!eventId) return NextResponse.json({error:'Missing webhook event ID'},{status:400});
    const database = await db();
    try { await database.collection('webhookEvents').insertOne({eventId,eventType:event.event,receivedAt:new Date(),status:'processing'}); }
    catch (e:any) {
      if (e?.code!==11000) throw e;
      const prior = await database.collection('webhookEvents').findOne({eventId});
      if (prior?.status==='processed' || prior?.status==='processing') return NextResponse.json({ok:true,duplicate:true});
      await database.collection('webhookEvents').updateOne({eventId},{$set:{status:'processing',retryAt:new Date(),eventType:event.event}});
    }
    try {
      if (event.event==='payment.captured') {
        const payment = event.payload?.payment?.entity;
        if (payment?.order_id && payment?.id) await finalizeCapturedPayment({razorpayOrderId:payment.order_id,razorpayPaymentId:payment.id,source:'webhook'});
      }
      await database.collection('webhookEvents').updateOne({eventId},{$set:{status:'processed',processedAt:new Date()}});
      return NextResponse.json({ok:true});
    } catch (e) {
      await database.collection('webhookEvents').updateOne({eventId},{$set:{status:'failed',error:e instanceof Error?e.message:'Unknown error',failedAt:new Date()}});
      return NextResponse.json({error:'Webhook processing failed; retry required.'},{status:500});
    }
  } catch (e) { return NextResponse.json({error:e instanceof Error?e.message:'Webhook failed'},{status:400}); }
}
