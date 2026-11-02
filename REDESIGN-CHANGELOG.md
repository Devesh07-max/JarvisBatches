# JARVIS Batches UI redesign

## What changed
- Rebuilt the public homepage to follow the supplied light blue/white JARVIS Batches reference composition.
- Added responsive navigation for Home, Courses, Tutorials, About, Contact, Telegram support, and My Purchases.
- Added a two-column hero with the official logo already in the project and a mascot artwork crop from the user-supplied reference screenshot.
- Restyled the live MongoDB-backed course catalogue, search, category filter, course cards, price and enrollment CTA.
- Added a benefits strip, purchase/how-it-works CTA, optional admin-managed tutorial video section, and a navy footer.
- Added mobile/tablet layouts, visible focus-friendly native controls, semantic sections, and reduced-motion support.
- Kept course data dynamic; no sample courses, fake reviews, student counts, or ratings were added.

## Preserved
- Existing API routes, MongoDB collections and settings storage.
- Razorpay checkout, verification and webhook routes.
- Telegram access/invite logic and My Purchases recovery.
- Admin course, orders and settings pages/components.
- Existing course images, Special Notes, tutorial settings, and support URL fields.
- Existing environment variable names and `MONGODB_DB=jarvis_batches` in `.env.example`.

## Files changed/added
- `src/app/page.tsx`
- `src/app/globals.css`
- `src/components/SiteHeader.tsx`
- `src/components/CourseCatalogue.tsx`
- `public/jarvis-hero-art.png` (cropped from the user-provided visual reference)

## Validation
- Source and existing routes were inspected before editing.
- `npm ci --no-audit --no-fund` was attempted but timed out in this environment, so dependencies were not installed and `npx tsc --noEmit` / `npm run build` could not be run here.
- This ZIP is a source redesign package, not a verified production deployment. Run the checks below in the project environment before deployment.

## Local validation
```bash
npm ci
npx tsc --noEmit
npm run build
npm start
```

Then visually inspect at desktop, tablet and phone widths. Test course search/category filter, course checkout, Razorpay test payment, Telegram access, My Purchases recovery, and admin settings.
