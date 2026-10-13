# VISIORA V1.4 staging operations

## Environment
- Use a separate Supabase staging project; never reuse production users or photos.
- Configure `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` and **server-only** `OPENAI_API_KEY` as encrypted deployment environment variables.
- Apply migrations in filename order including `20261013_ai_quotas.sql`; verify permissions as two independent users.
- Set monthly OpenAI spending limits and provider usage alerts. Daily per-user limits are 10 text and 3 photo requests; **these are not global budget caps**.
- Configure deployment HTTPS, error collection, uptime checks on `/api/health` and `/api/ready`, and incident escalation.

## Verification
1. Run `npm run typecheck && npm run lint && npm run build` on CI.
2. Confirm `GET /api/health` returns 200 even when integrations are absent.
3. Confirm `GET /api/ready` returns 503 until all required configuration is present, then 200.
4. Test unauthenticated AI requests (401), valid authenticated requests, and quota enforcement (text: 10/day; photo: 3/day).
5. Confirm no AI key, auth bearer token, raw image, or user prompt is included in logs.
6. Follow `docs/photo-acceptance.md` for consent, private storage, overwrite, deletion, and cross-user access.
7. Confirm that external AI failures return sanitized errors and that failed requests may still consume quota.
8. Verify billing alerts, alert routing, rollback procedure, data-retention policy, and backup/recovery.

## Outstanding blockers
- Real Supabase and OpenAI credentials and live end-to-end staging tests are not provided by GitHub.
- No distributed IP throttling, abuse prevention, billing reconciliation, or automated data-retention job.
- Binary photo content validation and privacy/legal review are required before public launch.
- Health readiness checks **configuration presence**, not external service reachability.
