import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { readSession } from '@/lib/auth';

const DEFAULTS = {
  supportUrl: 'https://t.me/',
  tutorialVideoUrl: '',
};

type SiteSettings = {
  _id: string;
  supportUrl?: string;
  tutorialVideoUrl?: string;
  updatedAt?: Date;
};

export async function GET() {
  const session = await readSession('admin_session');

  if (session?.role !== 'admin') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const database = await db();
  const settingsCollection =
    database.collection<SiteSettings>('settings');

  const saved = await settingsCollection.findOne({ _id: 'site' });

  return NextResponse.json({
    ...DEFAULTS,
    ...saved,
    supportUrl:
      typeof saved?.supportUrl === 'string'
        ? saved.supportUrl
        : DEFAULTS.supportUrl,
    tutorialVideoUrl:
      typeof saved?.tutorialVideoUrl === 'string'
        ? saved.tutorialVideoUrl
        : DEFAULTS.tutorialVideoUrl,
  });
}

export async function POST(request: NextRequest) {
  const session = await readSession('admin_session');

  if (session?.role !== 'admin') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const supportUrl = String(body.supportUrl || '').trim();
    const tutorialVideoUrl = String(
      body.tutorialVideoUrl || ''
    ).trim();

    if (!/^https:\/\//i.test(supportUrl)) {
      return NextResponse.json(
        { error: 'Support URL must start with https://' },
        { status: 400 }
      );
    }

    if (
      tutorialVideoUrl &&
      !/^https:\/\//i.test(tutorialVideoUrl)
    ) {
      return NextResponse.json(
        { error: 'Tutorial video URL must start with https://' },
        { status: 400 }
      );
    }

    const database = await db();
    const settingsCollection =
      database.collection<SiteSettings>('settings');

    await settingsCollection.updateOne(
      { _id: 'site' },
      {
        $set: {
          supportUrl,
          tutorialVideoUrl,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({
      ok: true,
      supportUrl,
      tutorialVideoUrl,
    });
  } catch {
    return NextResponse.json(
      { error: 'Could not save settings.' },
      { status: 400 }
    );
  }
          }
