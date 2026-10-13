# VISIORA V1.6 — Deployment and integration gate

## Status
This document prepares staging deployment; it does **not** certify that any staging environment has been deployed.

## Recommended low-friction deployment
1. Import GitHub repository `aison7437/Vizora` into a Vercel project.
2. Configure the project framework as Next.js and connect the default `main` branch.
3. Use a separate Supabase **staging** project and OpenAI project/key for non-production testing.
4. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` for the deployment's build environment; these are public client configuration values.
5. Add `OPENAI_API_KEY` as a server-only sensitive environment variable. Never use the `NEXT_PUBLIC_` prefix for this secret.
6. Apply all SQL migrations in `supabase/migrations` to the staging project, in the documented dependency order.
7. Deploy a preview branch, obtain the HTTPS preview URL and configure the GitHub Environment `staging` variable `VISIORA_STAGING_URL` to point at it.
8. Manually trigger `VISIORA Staging Smoke` in GitHub Actions. A missing staging URL must fail the workflow.
9. Complete the manual acceptance protocol in `docs/v1-5-acceptance.md` with two test accounts. Confirm RLS isolation, consent revocation, overwrite, deletion, AI provider errors and concurrent quotas.
10. Do not point production domains at this app or accept paying customers until security, privacy, billing, rate limiting and observability acceptance is signed off.

## Deployment verification
- `GET /api/health` returns 200 for application liveness.
- `GET /api/ready` returns 200 only when required configuration values are present; this **does not** prove external provider reachability.
- Run `node scripts/check-deployment.mjs` for static deployment contract checks.
- Inspect GitHub Actions results for the exact commit deployed.
- Ensure a rollback path exists and retain the last known-good deployment.

## Critical blockers
No Vercel project, Supabase credentials, OpenAI credentials or live staging URL is available to this GitHub-only workflow. Deployment, provider connectivity and data policy tests require external access and cannot be truthfully marked complete from repository checks.
