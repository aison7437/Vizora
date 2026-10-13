# VISIORA photo integration acceptance protocol

This is an **operator-run** acceptance protocol. GitHub Actions cannot validate Supabase configuration without a test project and test credentials.

## Provisioning
1. Create a Supabase staging project. Configure Auth site URL and email verification.
2. Apply the SQL migrations in filename order: `20261013_profiles.sql`, `20261013_private_photos.sql`, `20261013_photo_storage_hardening.sql`.
3. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and server-only `OPENAI_API_KEY` in the staging deployment. Never commit real secrets.
4. Use two distinct confirmed staging users (A and B), each with a separate browser session.

## Authorization and privacy checks
- Without authentication, the photo endpoint returns 401.
- Without active consent, uploading must fail and analysis must return 403.
- After A consents, uploading a JPG under 5 MB to A's canonical path succeeds.
- Replacing A's photo using the UI succeeds; verify that the object was actually replaced.
- A can download/delete A's photo, but B cannot read, overwrite or delete A's object.
- An arbitrary filename or a path under B's user ID cannot be uploaded by A.
- Oversize images and disallowed MIME types are rejected.
- After A revokes consent, further uploads/overwrites fail; the photo is deleted.
- Three successful quota consumptions on the same UTC day are allowed; the fourth returns 429.
- The AI endpoint responds 503 without the server-side OpenAI key, without leaking credentials.
- A valid consented photo and AI key produce text styling advice, not identity or sensitive-attribute guesses.
- Test concurrent quota requests and verify no more than 3 are accepted.

## Operational caveats
- Image analysis is billed to the configured AI account; budget alerts and provider retention review are required.
- The daily quota is currently consumed before upstream model success, so failed model calls can consume quota.
- Client-side file type checks are not sufficient to validate binary contents; add server-side content inspection before public launch.
- This implementation does not implement IP rate limiting, abuse controls, automated privacy retention, or production monitoring.
- Deletion from the app does not necessarily erase copies retained by an external AI provider.
- Do not mark the system production-ready based solely on GitHub CI.
