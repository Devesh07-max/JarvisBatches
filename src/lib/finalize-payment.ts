import { db } from '@/lib/db';
export async function finalizeCapturedPayment(input:{razorpayOrderId:string;razorpayPaymentId:string;source:string}) {
  const database = await db();
  const orders = database.collection('orders');
  const payments = database.collection('payments');
  const order = await orders.findOne({razorpayOrderId:input.razorpayOrderId});
  if (!order) throw new Error('Order not found.');
  await payments.updateOne({razorpayPaymentId:input.razorpayPaymentId},{$setOnInsert:{razorpayPaymentId:input.razorpayPaymentId,razorpayOrderId:input.razorpayOrderId,status:'captured',capturedAt:new Date(),source:input.source}},{upsert:true});
  await orders.updateOne({razorpayOrderId:input.razorpayOrderId},{$set:{status:'paid',razorpayPaymentId:input.razorpayPaymentId,paidAt:order.paidAt||new Date(),updatedAt:new Date()}});
  return order;
}
