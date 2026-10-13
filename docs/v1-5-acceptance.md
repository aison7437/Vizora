# VISIORA V1.5 staging acceptance

## Automated gates
- CI: TypeScript, ESLint, Next.js production build, and static SQL structure assertions.
- Staging smoke: separate manually triggered GitHub Actions workflow (environment: `staging`) checks liveness, readiness and anonymous API rejection against a deployed HTTPS staging URL.
- Staging workflow requires GitHub Environment variable `VISIORA_STAGING_URL`. It intentionally **fails** if not configured; never silently skips staging verification.
- No production keys or user credentials are stored in this repository.

## Manual acceptance with two staging identities
1. Create two verified test accounts and run migrations in the correct order.
2. Test sign-in and profile RLS; account B must not read account A's profile.
3. Upload a photo with A after consent; verify overwrite, download, and deletion.
4. Ensure B cannot access A's photo and A cannot upload to B's path.
5. Revoke consent; verify further upload and AI analysis are blocked.
6. Run 10 text requests and 3 photo requests for A; the next request of each type must return 429.
7. Check the same quota under parallel requests; the database must not allow oversubscription.
8. Validate real OpenAI success, invalid credentials, timeout handling, and sanitized error messages.
9. Confirm no photos, bearer tokens, email addresses, or AI keys are logged.
10. Confirm usage/billing alerts, privacy retention requirements, and rollback plan.

## Deployment release gate
Do not release to real users until all manual checks are signed off. A passing GitHub CI or staging smoke workflow does not prove authorization policies or external integration correctness.
