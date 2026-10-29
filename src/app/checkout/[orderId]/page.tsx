
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import Checkout from '@/components/Checkout';
import SiteHeader from '@/components/SiteHeader';

export const dynamic = 'force-dynamic';

type SiteSettings = {
  _id: string;
  supportUrl?: string;
  tutorialVideoUrl?: string;
};

export default async function CheckoutPage({
  params,
}: {
  params: { orderId: string };
}) {
  const database = await db();

  const settingsCollection =
    database.collection<SiteSettings>('settings');

  const [course, settings] = await Promise.all([
    database.collection('courses').findOne({
      slug: params.orderId,
      active: true,
    }),
    settingsCollection.findOne({ _id: 'site' }),
  ]);

  if (!course) {
    notFound();
  }

  return (
    <main className="container">
      <SiteHeader
        supportUrl={settings?.supportUrl || 'https://t.me/'}
      />

      <div
        style={{ maxWidth: 760, margin: '30px auto' }}
        className="card stack course-detail-card"
      >
        {course.imageUrl && (
          <img
            className="checkout-image"
            src={course.imageUrl}
            alt={course.name}
          />
        )}

        <span className="pill">SECURE CHECKOUT</span>

        <h1>{course.name}</h1>

        <p className="muted course-description">
          {course.description ||
            'Course access will be delivered through Telegram after your payment is verified.'}
        </p>

        {course.specialNotes && (
          <section className="special-notes">
            <div className="special-notes-title">
              ✦ Batch Highlights &amp; Special Notes
            </div>

            <div className="special-notes-content">
              {String(course.specialNotes)
                .split('\n')
                .map((line: string, i: number) => (
                  <p key={i}>{line}</p>
                ))}
            </div>
          </section>
        )}

        {Array.isArray(course.demoImages) && course.demoImages.length > 0 && (
          <section className="demo-section stack">
            <div>
              <span className="pill">PREVIEW</span>
              <h2>Demo Screenshots</h2>
              <p className="muted">Swipe to explore sample screenshots from this batch.</p>
            </div>
            <div className="demo-gallery" aria-label="Batch demo screenshots">
              {course.demoImages.slice(0, 4).map((url: string, index: number) => (
                <a className="demo-gallery-item" href={url} target="_blank" rel="noreferrer" key={`${url}-${index}`}>
                  <img src={url} alt={`${course.name} demo screenshot ${index + 1}`} loading="lazy" />
                  <span>{index + 1} / {Math.min(course.demoImages.length, 4)}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        {settings?.tutorialVideoUrl && (
          <section className="tutorial-section stack">
            <div>
              <span className="pill">NEED HELP?</span>
              <h2>How to purchase this batch</h2>
              <p className="muted">
                Watch this short guide before checkout.
              </p>
            </div>

            <video
              className="tutorial-video"
              src={settings.tutorialVideoUrl}
              controls
              playsInline
              preload="metadata"
            />
          </section>
        )}

        <div className="price">
          ₹{(course.pricePaise / 100).toLocaleString('en-IN')}
        </div>

        <Checkout slug={course.slug} />

        <p className="small checkout-assurance">
          Need help? Use Contact &amp; Support in the menu. Your access
          link is shown only after payment verification.
        </p>
      </div>
    </main>
  );
              }
