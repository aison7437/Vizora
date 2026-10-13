# VISIORA

VISIORA is a mobile-first personal styling application under active development.

## Run

Requires Node.js 22+. Run `npm install`, copy `.env.example` to `.env.local`, then `npm run dev`.

Configure Supabase Auth and apply **both** SQL migrations in `supabase/migrations/` in order. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Set server-only `OPENAI_API_KEY` to enable AI services. Never expose secret keys via `NEXT_PUBLIC_`.

- `/`: landing page and browser-local demo photo picker (no upload)
- `/account`: email/password authentication and personal style preferences
- `/stylist`: authenticated text-only AI style advice
- `/photos`: explicit consent, private photo upload/delete and AI vision styling (3 analyses/day/user)

## Photo privacy

Photos are stored in the private `visiora-private` Supabase Storage bucket at `<user-id>/style-photo`. Storage policies limit access to the authenticated owner; uploads require an active consent record. Only one current photo per user is supported. Photo analysis reads the private photo server-side and sends it to the configured AI provider when explicitly requested. Deleting the photo removes it from storage; revocation records the consent change. Provider retention policies may apply independently. Photos are not public or used to identify users.

## Before production

The photo endpoint has an atomic per-user daily quota, but **global IP abuse protection, cost monitoring, image content moderation, end-to-end tests, deletion/retention audits, deployment configuration and legal/privacy review** are still required. Text-only AI endpoint also needs quotas. This is not a production launch approval.
