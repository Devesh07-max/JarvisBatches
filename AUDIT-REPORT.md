# JARVIS Batches — Audit & Fix Report

## Applied in this package
1. MongoDB database fallback changed from `course_sales` to `jarvis_batches`.
   - `.env.example` already specifies `MONGODB_DB=jarvis_batches`.
   - This prevents an accidental connection to a different database if the environment variable is missing.
2. Existing reference redesign is retained: homepage, header, catalogue, responsive styles, hero artwork and changelog.
3. Existing checkout, payment verification, webhook, Telegram invite, My Purchases and admin routes/components are retained in the complete project archive.

## Important staging safeguards
- Set `MONGODB_DB=jarvis_batches` explicitly only if staging is intended to use the existing production database. Prefer a separate staging database/cluster for testing.
- Use Razorpay TEST keys and a separate webhook secret on staging.
- Use a separate Telegram test bot and test channel/group for staging.
- Do not change Vercel DNS, production Razorpay webhook URL, production Telegram webhook URL, or production environment variables during staging.
- Keep Vercel available for rollback.

## Validation status
- Source archive structure and key route/component references were inspected.
- `npm ci --no-audit --no-fund` did not complete in the available environment (dependency installation timed out).
- Therefore TypeScript, Next.js production build, browser rendering, payment, webhook and Telegram live tests remain NOT VERIFIED.
- Do not treat this archive as production-ready until those checks pass on the user's machine or a staging environment.

## Visual limitations to address during browser comparison
- The reference includes a student stories/testimonials section. The current source has no confirmed testimonials content/model. No fake testimonials are added; connect real approved content if available.
- Reference includes specific course art/cards. Current catalogue correctly uses live MongoDB course images, names and prices; appearance depends on actual course records and image quality.
- Search icon navigates to the search input; course catalogue remains data-driven.
