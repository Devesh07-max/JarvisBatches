import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
export async function GET() {
  const database = await db();
  const courses = await database.collection('courses').find({active:true},{projection:{name:1,slug:1,description:1,category:1,imageUrl:1,pricePaise:1}}).sort({createdAt:-1}).toArray();
  return NextResponse.json({courses:courses.map(c=>({...c,_id:String(c._id)}))});
}
