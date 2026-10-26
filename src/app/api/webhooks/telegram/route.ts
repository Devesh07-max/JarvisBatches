import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { safeEqualString } from '@/lib/http';
export async function POST(request:NextRequest){
  const expected=process.env.TELEGRAM_WEBHOOK_SECRET||'';
  const supplied=request.headers.get('x-telegram-bot-api-secret-token')||'';
  if(!expected||!safeEqualString(expected,supplied))return NextResponse.json({error:'Unauthorized'},{status:401});
  const update=await request.json();
  const chatMessage=update.message || update.channel_post;
  if(chatMessage?.chat?.id && /^\/chatid(@\w+)?$/i.test(String(chatMessage.text||'').trim())){
    const token=process.env.TELEGRAM_BOT_TOKEN!;
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({chat_id:chatMessage.chat.id,text:`Chat ID: ${chatMessage.chat.id}\nType: ${chatMessage.chat.type}`}),cache:'no-store'});
    return NextResponse.json({ok:true});
  }
  const join=update.chat_join_request;
  if(!join?.chat?.id||!join?.from?.id)return NextResponse.json({ok:true});
  try{
    const database=await db();
    const telegramUserId=Number(join.from.id);const chatId=String(join.chat.id);
    const courses=await database.collection('courses').find({destinations:{$elemMatch:{chatId}}},{projection:{_id:1}}).toArray();
    let entitled=false;
    for(const course of courses){const record=await database.collection('entitlements').findOne({courseId:course._id,telegramUserId,status:'active'});if(record){entitled=true;break;}}
    if(!entitled)return NextResponse.json({ok:true,approved:false});
    const token=process.env.TELEGRAM_BOT_TOKEN!;
    const response=await fetch(`https://api.telegram.org/bot${token}/approveChatJoinRequest`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({chat_id:chatId,user_id:telegramUserId}),cache:'no-store'});
    const result=await response.json();
    if(!result.ok)throw new Error(result.description||'Telegram approval failed');
    return NextResponse.json({ok:true,approved:true});
  }catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Could not process join request'},{status:500});}
}
