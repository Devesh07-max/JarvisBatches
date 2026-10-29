import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { readSession } from '@/lib/auth';

const DEFAULTS = { supportUrl: 'https://t.me/', tutorialVideoUrl: '', universalChannelName: '', universalChannelId: '' };
type SiteSettings = { _id: string; supportUrl?: string; tutorialVideoUrl?: string; universalChannelName?: string; universalChannelId?: string; updatedAt?: Date };

export async function GET() {
  const session = await readSession('admin_session');
  if (session?.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const database = await db();
  const saved = await database.collection<SiteSettings>('settings').findOne({ _id: 'site' });
  return NextResponse.json({
    ...DEFAULTS, ...saved,
    supportUrl: typeof saved?.supportUrl === 'string' ? saved.supportUrl : DEFAULTS.supportUrl,
    tutorialVideoUrl: typeof saved?.tutorialVideoUrl === 'string' ? saved.tutorialVideoUrl : DEFAULTS.tutorialVideoUrl,
    universalChannelName: typeof saved?.universalChannelName === 'string' ? saved.universalChannelName : '',
    universalChannelId: typeof saved?.universalChannelId === 'string' ? saved.universalChannelId : '',
  });
}

export async function POST(request: NextRequest) {
  const session = await readSession('admin_session');
  if (session?.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await request.json();
    const supportUrl = String(body.supportUrl || '').trim();
    const tutorialVideoUrl = String(body.tutorialVideoUrl || '').trim();
    const universalChannelName = String(body.universalChannelName || '').trim().slice(0, 120);
    const universalChannelId = String(body.universalChannelId || '').trim();
    if (!/^https:\/\//i.test(supportUrl)) return NextResponse.json({ error: 'Support URL must start with https://' }, { status: 400 });
    if (tutorialVideoUrl && !/^https:\/\//i.test(tutorialVideoUrl)) return NextResponse.json({ error: 'Tutorial video URL must start with https://' }, { status: 400 });
    if ((universalChannelName && !universalChannelId) || (!universalChannelName && universalChannelId)) return NextResponse.json({ error: 'Enter both the universal channel name and numeric chat ID, or leave both empty to disable it.' }, { status: 400 });
    if (universalChannelId && !/^-?\d+$/.test(universalChannelId)) return NextResponse.json({ error: 'Universal channel ID must be a numeric Telegram chat ID, usually starting with -100.' }, { status: 400 });
    const database = await db();
    await database.collection<SiteSettings>('settings').updateOne(
      { _id: 'site' },
      { $set: { supportUrl, tutorialVideoUrl, universalChannelName, universalChannelId, updatedAt: new Date() } },
      { upsert: true },
    );
    return NextResponse.json({ ok: true, supportUrl, tutorialVideoUrl, universalChannelName, universalChannelId });
  } catch {
    return NextResponse.json({ error: 'Could not save settings.' }, { status: 400 });
  }
}
