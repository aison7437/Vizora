# VISIORA V1.7 — Staging safety and external deployment handoff

## Exact migration dependency order
The original same-date SQL filenames do **not** sort in dependency order. Apply them to a fresh staging project in this sequence:

1. `20261013_profiles.sql`
2. `20261013_private_photos.sql`
3. `20261013_photo_storage_hardening.sql`
4. `20261013_ai_quotas.sql`

Do not assume alphabetical filename order is safe. Inspect the SQL and verify the policies and RPCs against your staging Supabase project before launch.

## External handoff
- Connect a Vercel deployment to `aison7437/Vizora`; set the staging environment variables documented in `.env.example`.
- Apply migrations using the dependency order above.
- Configure the GitHub `staging` environment variable `VISIORA_STAGING_URL` to a **clean HTTPS origin** (no path, credentials, query or fragment).
- Run the `VISIORA Staging Smoke` workflow. Its checks are black-box probes only; they do not validate RLS isolation or actual AI output.
- Perform and record the two-account manual tests in `docs/v1-5-acceptance.md`.

## Release blockers
No production launch until real provider integration, private photo access isolation, consent revocation, rate limiting, privacy and AI cost controls are demonstrated. Repository-only automation cannot deploy without the external account configuration.
