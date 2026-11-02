import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'JARVIS Batches | Learn · Practice · Grow', description: 'Explore JARVIS Batches, discover online courses, complete secure checkout and access your course through Telegram.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
