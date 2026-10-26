import Link from 'next/link';
import {redirect} from 'next/navigation';
import {readSession} from '@/lib/auth';
import AdminCourseManager from '@/components/AdminCourseManager';import AdminSiteSettings from '@/components/AdminSiteSettings';
export const dynamic='force-dynamic';
export default async function AdminCoursesPage(){const s=await readSession('admin_session');if(s?.role!=='admin')redirect('/admin/login');return <main className="container"><nav className="nav"><Link className="logo" href="/">JARVIS Batches Admin</Link><div className="row"><Link className="btn secondary" href="/admin/orders">Orders</Link><Link className="btn secondary" href="/">View website</Link></div></nav><div className="admin-layout"><aside className="sidebar"><b>Admin panel</b><Link href="/admin/courses">Courses</Link><Link href="/admin/orders">Orders & sales</Link><Link href="/admin/settings">Website settings</Link><p className="small">Do not share admin access.</p></aside><div><h1>Course management</h1><p className="muted">Add existing Telegram channels and groups to the relevant course.</p><AdminCourseManager/><div style={{marginTop:24}}><AdminSiteSettings/></div></div></div></main>}
