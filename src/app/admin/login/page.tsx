import Link from 'next/link';
import AdminLoginForm from '@/components/AdminLoginForm';
export default function AdminLoginPage(){return <main className="container"><nav className="nav"><Link className="logo" href="/">JARVIS Batches</Link><Link className="btn secondary" href="/">View website</Link></nav><div style={{maxWidth:440,margin:'55px auto'}}><AdminLoginForm/></div></main>}
