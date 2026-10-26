import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import Checkout from '@/components/Checkout';
export const dynamic='force-dynamic';
export default async function CheckoutPage({params}:{params:{orderId:string}}){const database=await db();const course=await database.collection('courses').findOne({slug:params.orderId,active:true});if(!course)notFound();return <main className="container"><nav className="nav"><Link className="logo" href="/">⚡ JARVIS <span style={{color:'var(--brand)'}}>Batches</span></Link><Link href="/" className="btn secondary">← Back to courses</Link></nav><div style={{maxWidth:700,margin:'30px auto'}} className="card stack">{course.imageUrl&&<img className="checkout-image" src={course.imageUrl} alt={course.name}/>}<span className="pill">SECURE CHECKOUT</span><h1>{course.name}</h1><p className="muted">{course.description||'Course access will be delivered through Telegram after your payment is verified.'}</p><div className="price">₹{(course.pricePaise/100).toLocaleString('en-IN')}</div><Checkout slug={course.slug}/></div></main>}
