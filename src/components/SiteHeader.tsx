'use client';
import Link from 'next/link';
import {useState} from 'react';

export default function SiteHeader({supportUrl='https://t.me/',compact=false}:{supportUrl?:string;compact?:boolean}){
 const [open,setOpen]=useState(false);
 return <>
  <header className="site-header">
   <Link className="brand-lockup" href="/" aria-label="JARVIS Batches home">
    <img src="/jarvis-batches-logo.webp" alt="JARVIS Batches logo"/>
    <span><b>JARVIS</b><strong>Batches</strong></span>
   </Link>
   <nav className="desktop-nav" aria-label="Main navigation">
    <Link className="nav-active" href="/#home">⌂ <span>Home</span></Link>
    <Link href="/#courses">▣ <span>Courses</span></Link>
    <Link href="/#tutorial">▶ <span>Tutorials</span></Link>
    <Link href="/#about">♙ <span>About</span></Link>
    <a href={supportUrl} target="_blank" rel="noreferrer">◉ <span>Contact</span></a>
   </nav>
   <div className="header-actions">
    <Link className="icon-action" href="/#course-search" aria-label="Search courses">⌕</Link>
    <a className="telegram-button" href={supportUrl} target="_blank" rel="noreferrer"><span>➤</span> Join Telegram</a>
    <Link className="purchases-button" href="/my-purchases">♛ My Purchases</Link>
   </div>
   <button className="menu-toggle" type="button" aria-label="Open navigation menu" aria-expanded={open} onClick={()=>setOpen(v=>!v)}>{open?'✕':'☰'}</button>
  </header>
  {open&&<><button className="drawer-scrim" aria-label="Close menu" onClick={()=>setOpen(false)}/><aside className="mobile-drawer"><div className="drawer-title">JARVIS <span>Batches</span></div><Link href="/#home" onClick={()=>setOpen(false)}>⌂ &nbsp; Home</Link><Link href="/#courses" onClick={()=>setOpen(false)}>▣ &nbsp; Courses</Link><Link href="/#tutorial" onClick={()=>setOpen(false)}>▶ &nbsp; Tutorials</Link><Link href="/#about" onClick={()=>setOpen(false)}>♙ &nbsp; About</Link><a href={supportUrl} target="_blank" rel="noreferrer" onClick={()=>setOpen(false)}>◉ &nbsp; Contact / Join Telegram</a><Link href="/my-purchases" onClick={()=>setOpen(false)}>♛ &nbsp; My Purchases</Link><div className="drawer-bottom">LEARN · PRACTICE · GROW</div></aside></>}
 </>;
}
