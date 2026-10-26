import Link from 'next/link';
import PurchaseAccess from '@/components/PurchaseAccess';
export const dynamic='force-dynamic';
export default async function PurchasePage({params,searchParams}:{params:{orderId:string};searchParams:{key?:string}}){return <main className="container"><nav className="nav"><Link className="logo" href="/">⚡ JARVIS <span style={{color:'var(--brand)'}}>Batches</span></Link><Link className="btn secondary" href="/">All courses</Link></nav><div style={{maxWidth:700,margin:'30px auto'}}><span className="pill">PURCHASE CONFIRMATION</span><h1>Your course link</h1><p className="muted">Your payment is checked securely before the Telegram invite link is shown.</p><PurchaseAccess orderId={params.orderId} accessKey={searchParams.key||''}/></div></main>}
