# JARVIS Batches — Telegram course sales website

Next.js + TypeScript + MongoDB Atlas + Razorpay + Telegram Bot API. Students can purchase without creating an account. After server-side payment verification, the purchase page displays **Click to Join** and **Copy Link** buttons.

## Telegram invite link behavior

For each paid purchase, the website generates and saves one invite link per configured course destination. The Telegram Bot API request uses `member_limit: 1` and intentionally omits `expire_date`, so there is no fixed time expiry and the link allows one successful join. The bot must be an administrator of each channel/group with permission to create invite links. A forwarded link can be used first by anyone who receives it; Telegram invite links cannot guarantee the payer is the first person to use it. Do not enable `join_request` mode for this one-use-link behavior.

## Requirements

- Node.js 20+
- MongoDB Atlas database
- Razorpay account (start in Test Mode)
- Telegram bot from @BotFather, administrator in each course destination
- Optional Cloudinary account for uploading course images

## Local setup

1. Copy `.env.example` to `.env.local` and fill the variables.
2. Use a strong `ADMIN_PASSWORD` and an `AUTH_SECRET` of at least 32 characters.
3. Run `npm install`, then `npm run dev`.
4. Visit `http://localhost:3000`; admin login is at `/admin/login`.
5. Add courses in `/admin/courses`, using each private channel/group numeric chat ID (usually starts with `-100`).

## Vercel setup

1. Upload the project to a private GitHub repository.
2. Import it at https://vercel.com/new.
3. Add all required `.env.example` values in Vercel → Project Settings → Environment Variables. Never commit `.env.local` or secrets.
4. Set `NEXT_PUBLIC_SITE_URL` to your final HTTPS domain.
5. Deploy. The `jarvisbatches.vercel.app` subdomain is only available if the project name is available in Vercel.
6. In Razorpay Test Mode, add webhook URL `https://YOUR-DOMAIN/api/webhooks/razorpay`, subscribe to `payment.captured`, and set `RAZORPAY_WEBHOOK_SECRET` to the matching secret.
7. Test a successful payment, failed payment, duplicate webhook, link generation, copy link and one successful Telegram join before accepting live payments.

## Course images

You can paste a public image URL into the admin course form. For file uploads, configure `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`; uploaded images are stored in Cloudinary rather than the temporary Vercel filesystem.

## Admin and security

- Student login/signup is not used.
- `/admin/login` remains password-protected with an HTTP-only signed session.
- The purchase page uses a long random access key; only its hash is stored with the order. Keep the purchase URL private because it acts as a bearer access credential.
- Keep Razorpay, MongoDB, Telegram and Cloudinary credentials in server-side environment variables.
- The webhook verifies Razorpay's HMAC signature and payment finalization is idempotent by Razorpay payment ID.
- Before launch, replace the placeholder support contact and policy text, configure rate limiting/monitoring, and perform a security review.

## Main routes

- `/` — public course catalogue
- `/checkout/[slug]` — payment checkout
- `/purchase/[orderId]?key=...` — verified purchase access
- `/admin/login` — admin sign-in
- `/admin/courses` — add/deactivate courses and configure images/destinations
- `/admin/orders` — orders and revenue
- `/api/orders` — create Razorpay order
- `/api/payments/verify` — verify checkout signature and captured payment
- `/api/webhooks/razorpay` — Razorpay payment webhook
- `/api/purchases/:id/access` — create/retrieve purchase-specific Telegram invite links

## Course search
The homepage includes instant client-side search across course name, category/subject, and description, plus a category dropdown and clear-filters action. It uses the active course catalogue loaded from MongoDB, so newly added active courses are searchable without maintaining a separate search index.
