# JARVIS Batches — Telegram course sales website

Next.js + TypeScript + MongoDB Atlas + Razorpay + Telegram Bot API. Students can purchase without creating an account. After server-side payment verification, the purchase page displays **Click to Join** and **Copy Link** buttons. The same browser can use **My Purchases** to reopen saved orders.

## Telegram invite link behavior

For each paid purchase, the website generates and saves one invite link per configured course destination. The Telegram Bot API request uses `member_limit: 1` and intentionally omits `expire_date`, so there is no fixed time expiry and the link allows one successful join. The bot must be an administrator of each channel/group with permission to create invite links. To display a used-link status in the website, configure the Telegram webhook to include the `chat_member` update type (along with the update types your existing flow uses). A forwarded link can be used first by anyone who receives it; Telegram invite links cannot guarantee the payer is the first person to use it. Do not enable `join_request` mode for this one-use-link behavior.

## Requirements

- Node.js 20+
- MongoDB Atlas database
- Razorpay account (start in Test Mode)
- Telegram bot from @BotFather, administrator in each course destination
- Cloudinary account for course images and the shared purchase tutorial video

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

## Course images and purchase tutorial

You can paste a public image URL into the admin course form. Configure `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` for direct uploads. Admin → Website settings lets you upload one shared purchase tutorial video from a phone Gallery/Files picker; it appears on every course checkout page and can be replaced without redeploying. The current upload UI accepts videos up to 100 MB, subject to your Cloudinary account limits. Each course has editable Special Notes / Key Points in the course manager.

The same Website settings page lets an admin change the Contact & Support Telegram URL. These settings are stored in MongoDB.

## Admin and security

- Student login/signup is not used.
- `/admin/login` remains password-protected with an HTTP-only signed session.
- The purchase page uses a long random access key; only its hash is stored with the order. The My Purchases list stores the access key in browser local storage so the same browser can recover a paid purchase; do not use this as cross-device recovery. Keep the purchase URL private because it acts as a bearer access credential. Access links are generated once and are not automatically regenerated after use/failure. An admin can explicitly authorize recovery from Orders & Sales.
- Keep Razorpay, MongoDB, Telegram and Cloudinary credentials in server-side environment variables.
- The webhook verifies Razorpay's HMAC signature and payment finalization is idempotent by Razorpay payment ID.
- Before launch, replace the placeholder support contact and policy text, configure rate limiting/monitoring, and perform a security review.

## Main routes

- `/` — public course catalogue
- `/checkout/[slug]` — payment checkout
- `/purchase/[orderId]?key=...` — verified purchase access
- `/my-purchases` — purchases saved in the current browser/device
- `/admin/login` — admin sign-in
- `/admin/courses` — add/deactivate courses, edit special notes and configure images/destinations
- `/admin/settings` — change support URL and shared tutorial video
- `/admin/orders` — orders and revenue
- `/api/orders` — create Razorpay order
- `/api/payments/verify` — verify checkout signature and captured payment
- `/api/webhooks/razorpay` — Razorpay payment webhook
- `/api/purchases/:id/access` — create/retrieve purchase-specific Telegram invite links
- `/api/purchases/:id/status` — verify a browser-saved purchase reference

## Course search
The homepage includes instant client-side search across course name, category/subject, and description, plus a category dropdown and clear-filters action. It uses the active course catalogue loaded from MongoDB, so newly added active courses are searchable without maintaining a separate search index.
