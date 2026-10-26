# JARVIS Batches patch notes

## Apply this patch
1. Extract this ZIP into the root of the existing `jarvis-batches` GitHub repository.
2. Keep the folder paths exactly as provided; replace matching files and add new ones.
3. Commit and push. Vercel should build/deploy the changes through the existing GitHub connection.
4. After deployment, open `/admin/settings` and set your real Telegram support URL, upload the common purchase tutorial video from your phone, and save.
5. For each course, open `/admin/courses` → Edit and add the batch-specific Special Notes / Key Points, then save.

## Cloudinary video upload
The tutorial upload uses the existing Cloudinary environment variables (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`). The UI currently limits a video to 100 MB, and Cloudinary account/plan limits also apply. The video is uploaded directly from the browser to Cloudinary; it is not stored on Vercel's temporary filesystem.

## UPI in Razorpay Test Mode
Checkout now explicitly lists UPI, netbanking, cards and wallets in the Standard Checkout payment configuration. This cannot override methods disabled or unavailable on the Razorpay account. If UPI is still missing after deployment, check Razorpay Dashboard → Account & Settings → Payment Methods in Test Mode and confirm UPI is enabled for the account. Razorpay's documentation says available payment methods are controlled by the account/dashboard; code cannot force-enable an account-level method.

## Telegram invite link status
The Telegram webhook route now records a link as used when Telegram sends a `chat_member` update containing the invite link. To receive these updates, the webhook's `allowed_updates` must include `chat_member` as well as the update types already needed by your bot. A one-use Telegram link is still limited by `member_limit: 1`; this status update is for showing the correct message on My Purchases/access pages.

## My Purchases limitations
The list and access key are saved in browser local storage, so recovery works in the same browser/device only. Clearing browser data or changing devices can remove the list. MongoDB remains the source of truth for payment status. Links are not regenerated automatically; an admin can authorize recovery in Admin → Orders & Sales for used links or a failed link-generation attempt.

## Testing note
I inspected the supplied source and ran a TypeScript check, but a full Next.js build could not be completed in this environment because installing the project's npm dependencies timed out. Please check the Vercel deployment/build log after pushing and test a successful/failed payment in Razorpay Test Mode before accepting live payments.
