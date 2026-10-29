'use client';
import Link from 'next/link';
import {useState} from 'react';
export default function SiteHeader({supportUrl='https://t.me/',compact=false}:{supportUrl?:string;compact?:boolean}){
 const [open,setOpen]=useState(false);
 return <>
  <header className="site-header">
   <Link className="brand-lockup" href="/" aria-label="Jarvis Batches home"><img src="/jarvis-batches-logo.webp" alt="Jarvis Batches logo"/><span><b>JARVIS</b><strong>BATCHES</strong></span></Link>
   <div className="desktop-nav"><Link href="/#courses">All Courses</Link><Link href="/my-purchases">My Purchases</Link><a className="support-button" href={supportUrl} target="_blank" rel="noreferrer"><span className="telegram-mark">➤</span> Contact &amp; Support</a></div>
   <a className="support-button mobile-support-button" href={supportUrl} target="_blank" rel="noreferrer" aria-label="Contact and Support"><span className="telegram-mark">➤</span><span className="mobile-support-label">Contact</span></a>
   <button className="menu-toggle" type="button" aria-label="Open navigation menu" aria-expanded={open} onClick={()=>setOpen(v=>!v)}>{open?'✕':'☰'}<span>Menu</span></button>
  </header>
  {open&&<><button className="drawer-scrim" aria-label="Close menu" onClick={()=>setOpen(false)}/><aside className="mobile-drawer"><div className="drawer-title">JARVIS <span>BATCHES</span></div><Link href="/" onClick={()=>setOpen(false)}>⌂ &nbsp; Home</Link><Link href="/#courses" onClick={()=>setOpen(false)}>▦ &nbsp; All Courses</Link><Link href="/my-purchases" onClick={()=>setOpen(false)}>▣ &nbsp; My Purchases</Link><a href={supportUrl} target="_blank" rel="noreferrer" onClick={()=>setOpen(false)}><span className="telegram-mark">➤</span> &nbsp; Contact &amp; Support</a><div className="drawer-bottom">Learn Today · Build Your Tomorrow</div></aside></>}
 </>;
}
