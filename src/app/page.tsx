import Link from 'next/link';
import { db } from '@/lib/db';
import CourseCatalogue from '@/components/CourseCatalogue';
export const dynamic = 'force-dynamic';
export default async function Home() {
  const database = await db();
  const courses = await database.collection('courses').find({ active: true }).sort({ createdAt: -1 }).toArray();
  const safeCourses = courses.map((course: any) => ({
    _id: String(course._id), name: String(course.name), slug: String(course.slug),
    description: course.description ? String(course.description) : '',
    category: course.category ? String(course.category) : '',
    imageUrl: course.imageUrl ? String(course.imageUrl) : '',
    pricePaise: Number(course.pricePaise || 0),
  }));
  return <main className="container">
    <nav className="nav"><Link className="logo" href="/">⚡ JARVIS <span style={{color:'var(--brand)'}}>Batches</span></Link><div className="row"><a className="btn secondary" href="https://telegram.org/" target="_blank" rel="noreferrer">Telegram</a><Link className="btn" href="#courses">All Courses</Link></div></nav>
    <section className="hero"><span className="pill">LEARN · PRACTICE · GROW</span><h1>Your Future,<br/><span style={{color:'var(--brand)'}}>Our Batches.</span></h1><p>Explore premium courses and batches. Pay securely and get your Telegram course invite link after your payment is verified.</p><div className="row"><span className="small">✓ Secure payments</span><span className="small">✓ Instant access after verification</span><span className="small">✓ No student account required</span></div><p style={{marginTop:24}}><Link className="btn" href="#courses">Explore Courses →</Link></p></section>
    <div id="courses" className="section-title"><div><p className="pill" style={{display:'inline-block'}}>COURSE CATALOGUE</p><h2>Popular Batches</h2><p className="muted">Choose a course and start learning.</p></div><span className="muted">{courses.length} available</span></div>
    {safeCourses.length ? <CourseCatalogue courses={safeCourses} /> : <div className="card"><h2>Courses coming soon</h2><p className="muted">New batches will be listed here shortly.</p></div>}
    <footer className="footer"><b>⚡ JARVIS Batches</b><p>Learn Today · Build Your Tomorrow</p><Link href="/terms">Terms</Link> · <Link href="/privacy">Privacy</Link> · <Link href="/refunds">Refunds</Link> · <Link href="/admin/login">Admin</Link><p>Support: update your support contact before launch.</p></footer>
  </main>;
}
