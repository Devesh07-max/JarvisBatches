import Link from 'next/link';
import { db, SiteSettings } from '@/lib/db';
import CourseCatalogue from '@/components/CourseCatalogue';
import SiteHeader from '@/components/SiteHeader';

export const dynamic='force-dynamic';

export default async function Home(){
 const database=await db();
 const [courses,settings]=await Promise.all([
  database.collection('courses').find({active:true}).sort({createdAt:-1}).toArray(),
  database.collection<SiteSettings>('settings').findOne({_id:'site'})
 ]);
 const safeCourses=courses.map((course:any)=>({
  _id:String(course._id),name:String(course.name),slug:String(course.slug),
  description:course.description?String(course.description):'',
  category:course.category?String(course.category):'',
  imageUrl:course.imageUrl?String(course.imageUrl):'',
  pricePaise:Number(course.pricePaise||0)
 }));
 const supportUrl=settings?.supportUrl||'https://t.me/';
 const tutorialUrl=settings?.tutorialVideoUrl||'';
 return <main className="site-shell" id="home">
  <div className="container">
   <SiteHeader supportUrl={supportUrl}/>
   <section className="hero hero-light">
    <div className="hero-copy">
     <span className="eyebrow"><span>🚀</span> Learn · Prepare · Excel</span>
     <h1>JARVIS <span>Batches</span></h1>
     <h2>Your Ultimate Learning Partner<br/>in <span>Telegram</span> Batches</h2>
     <p>Discover quality course content, focused preparation resources and convenient access — all in one place.</p>
     <div className="hero-actions">
      <Link className="btn btn-gradient" href="#courses"><span>➤</span> Explore Courses <b>→</b></Link>
      {tutorialUrl ? <a className="btn btn-outline" href="#tutorial-media"><span className="play-icon">▶</span> Watch Tutorial</a> : <Link className="btn btn-outline" href="#tutorial"><span className="play-icon">▶</span> How It Works</Link>}
     </div>
     <div className="hero-trust"><span className="trust-icon">✦</span><div><b>Learn at your own pace</b><small>Browse batches · Secure checkout · Telegram access after verified payment</small></div></div>
    </div>
    <div className="hero-art-wrap"><div className="hero-glow"/><img className="hero-art" src="/jarvis-hero-art.png" alt="JARVIS friendly robot mascot with graduation cap and Telegram learning theme"/></div>
    <div className="hero-spark spark-one"/><div className="hero-spark spark-two"/>
   </section>

   <div className="section-divider"><span>✦</span><b>OUR COURSES</b><span>✦</span></div>
   <section id="courses" className="courses-section">
    <div className="section-heading"><div><span className="section-kicker">CHOOSE YOUR NEXT STEP</span><h2>Popular <span>Batches</span></h2><p>Explore available batches and find the right course for your preparation.</p></div><a className="view-all" href="#course-list">View All Courses <b>→</b></a></div>
    <div id="course-list">{safeCourses.length?<CourseCatalogue courses={safeCourses}/>:<div className="empty-courses"><div className="empty-book">▤</div><h3>New batches are on the way</h3><p>There are no active courses listed right now. Please check back soon.</p></div>}</div>
   </section>

   <section className="benefits-strip" id="about" aria-label="Platform benefits">
    <div><span className="benefit-icon">⚡</span><p><b>Instant Checkout</b><small>Simple and secure payment</small></p></div>
    <i/>
    <div><span className="benefit-icon">✦</span><p><b>Focused Learning</b><small>Course content in one place</small></p></div>
    <i/>
    <div><span className="benefit-icon">▶</span><p><b>Learn Your Way</b><small>Access through Telegram</small></p></div>
    <i/>
    <div><span className="benefit-icon">◉</span><p><b>Student Support</b><small>Contact our Telegram support</small></p></div>
   </section>

   <section className="tutorial-cta" id="tutorial">
    <div className="tutorial-copy"><span className="section-kicker">START IN A FEW STEPS</span><h2>Ready to start learning?</h2><p>Choose a batch, complete the secure checkout and get your Telegram access after payment verification.</p></div>
    <div className="tutorial-actions">{tutorialUrl?<Link className="btn btn-outline" href="#tutorial-media" aria-label="Jump to the purchase tutorial video">Watch Tutorial ↓</Link>:<a className="btn btn-outline" href={supportUrl} target="_blank" rel="noreferrer">Need Help? Contact Us</a>}<Link className="btn btn-gradient" href="#courses">Explore Batches <b>→</b></Link></div>
   </section>
   {tutorialUrl&&<section className="tutorial-media" id="tutorial-media"><div><span className="section-kicker">PURCHASE GUIDE</span><h2>Watch Tutorial</h2><p>Follow the steps to complete your purchase and access your batch.</p></div><video className="tutorial-video" src={tutorialUrl} controls playsInline preload="metadata"/></section>}
  </div>
  <footer className="footer footer-premium">
   <div className="footer-main"><div className="footer-brand-block"><div className="footer-brand"><img src="/jarvis-batches-logo.webp" alt="JARVIS Batches logo"/><span><b>JARVIS</b><strong>Batches</strong></span></div><p>Empowering aspirants. Building success.</p></div>
    <div><h3>Quick Links</h3><Link href="/#home">⌂ &nbsp; Home</Link><Link href="/#courses">▣ &nbsp; Courses</Link><Link href="/#tutorial">▶ &nbsp; Tutorials</Link><Link href="/my-purchases">♛ &nbsp; My Purchases</Link><Link className="footer-admin-link" href="/admin/login">✦ &nbsp; Admin Panel</Link></div>
    <div><h3>Support</h3><a href={supportUrl} target="_blank" rel="noreferrer">◉ &nbsp; Contact Us</a><Link href="/terms">▤ &nbsp; Terms &amp; Conditions</Link><Link href="/privacy">▣ &nbsp; Privacy Policy</Link><Link href="/refunds">↩ &nbsp; Refund Policy</Link></div>
    <div><h3>Connect With Us</h3><a className="footer-social" href={supportUrl} target="_blank" rel="noreferrer"><span>➤</span> Telegram</a></div>
   </div>
   <div className="footer-bottom"><span>© {new Date().getFullYear()} JARVIS Batches. All rights reserved.</span><span>Made with <b>♥</b> for aspirants</span></div>
  </footer>
 </main>;
}
