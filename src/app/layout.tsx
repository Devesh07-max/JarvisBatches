import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'JARVIS Batches | Online Courses', description: 'Explore batches, pay securely, and get your Telegram course link.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
