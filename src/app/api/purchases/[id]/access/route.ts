import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createInviteLink } from '@/lib/telegram';
import { createHash, timingSafeEqual } from 'crypto';
export async function GET(request:NextRequest,{params}:{params:{id:string}}) {
  try {
    const key=request.nextUrl.searchParams.get('key')||'';
    if(key.length<32)return NextResponse.json({error:'Purchase access key is missing or invalid.'},{status:403});
    const database = await db();
    const orders=database.collection('orders');
    const order = await orders.findOne({razorpayOrderId:params.id,status:'paid'});
    if (!order || !order.accessKeyHash) return NextResponse.json({error:'No verified paid purchase was found.'},{status:403});
    const incoming=createHash('sha256').update(key).digest();const saved=Buffer.from(order.accessKeyHash,'hex');if(incoming.length!==saved.length||!timingSafeEqual(incoming,saved))return NextResponse.json({error:'Purchase access key is invalid.'},{status:403});
    if(Array.isArray(order.inviteLinks)&&order.inviteLinks.length)return NextResponse.json({courseName:order.courseName,links:order.inviteLinks});
    const course = await database.collection('courses').findOne({_id:order.courseId});
    if (!course || !Array.isArray(course.destinations) || !course.destinations.length) return NextResponse.json({error:'Course Telegram destinations are not configured yet. Please contact support.'},{status:503});
    const links=[];
    for (const destination of course.destinations) {
      if (!destination.chatId || !destination.title) continue;
      const generated = await createInviteLink(String(destination.chatId));
      links.push({title:destination.title,type:destination.type,inviteLink:generated.inviteLink});
    }
    if (!links.length) return NextResponse.json({error:'No valid Telegram destinations configured.'},{status:503});
    await orders.updateOne({_id:order._id,status:'paid',inviteLinks:{$exists:false}},{$set:{inviteLinks:links,inviteLinksCreatedAt:new Date()}});
    const latest=await orders.findOne({_id:order._id});
    return NextResponse.json({courseName:order.courseName,links:latest?.inviteLinks||links});
  } catch(e) { return NextResponse.json({error:e instanceof Error?e.message:'Could not create course access.'},{status:500}); }
}
