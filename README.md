# VISIORA

VISIORA is a mobile-first personal styling application under active development.

## Run

Requires Node.js 22+. Run `npm install`, copy `.env.example` to `.env.local`, then `npm run dev`.

Configure Supabase Auth and apply **all three** SQL migrations in `supabase/migrations/` in filename order. See [photo acceptance protocol](docs/photo-acceptance.md) before enabling staging uploads. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Set server-only `OPENAI_API_KEY` to enable AI services. Never expose secret keys via `NEXT_PUBLIC_`.

- `/`: landing page and browser-local demo photo picker (no upload)
- `/account`: email/password authentication and personal style preferences
- `/stylist`: authenticated text-only AI style advice
- `/photos`: explicit consent, private photo upload/delete and AI vision styling (3 analyses/day/user)

## Photo privacy

Photos are stored in the private `visiora-private` Supabase Storage bucket at `<user-id>/style-photo`. Storage policies limit access to the authenticated owner; uploads require an active consent record. Only one current photo per user is supported. Photo analysis reads the private photo server-side and sends it to the configured AI provider when explicitly requested. Deleting the photo removes it from storage; revocation records the consent change. Provider retention policies may apply independently. Photos are not public or used to identify users.

## Before production

The photo endpoint has an atomic per-user daily quota, but **global IP abuse protection, cost monitoring, image content moderation, end-to-end tests, deletion/retention audits, deployment configuration and legal/privacy review** are still required. Text-only AI endpoint also needs quotas. This is not a production launch approval.


## V1.4 staging readiness

Apply `supabase/migrations/20261013_ai_quotas.sql` after the existing migrations. The authenticated AI endpoints now use atomic daily limits (text 10, photo 3). `/api/health` reports application liveness; `/api/ready` reports whether required environment variables are present, **not** provider connectivity. Follow [the staging runbook](docs/staging-runbook.md). Production integration remains unverified.


## V1.5 staging acceptance

Run `npm run test:static` for migration structure checks. Once staging is deployed, set GitHub Environment `staging` variable `VISIORA_STAGING_URL` to its HTTPS origin and manually trigger the **VISIORA Staging Smoke** workflow. See [V1.5 acceptance protocol](docs/v1-5-acceptance.md). This workflow does not substitute for real Supabase RLS, AI billing, and consent testing.


## V1.6 deployment gate

Run `npm run test:deployment` to validate the repository's deployment contract. Follow [V1.6 deployment instructions](docs/v1-6-deployment.md). No live staging deployment or external integration is implied by passing CI.
