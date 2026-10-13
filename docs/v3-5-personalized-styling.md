# VISIORA V3.5 — Opt-in personalized styling

Authenticated POST /api/appearance accepts optional `useSavedStyle: true`. The existing /api/journey execution adapter forwards the same optional flag. The backend fetches the current user's saved style preferences and up to 20 wardrobe items through their authenticated Supabase token and owner-filtered RLS queries. The context is bounded to 4,000 characters and included as **untrusted data** in the existing specialist prompt. The default is off; requests without explicit opt-in do not fetch or send saved wardrobe details to the AI provider.

Failure to read saved context returns 503 rather than silently providing unpersonalized output. The existing text quota and provider calls remain authoritative. This change does not send wardrobe photos, perform image transformations, or introduce new agent types.

Apply V3.4 migrations before using this feature. Staging must test opt-in/off, cross-user isolation, revoked credentials, quota exhaustion, and provider failures. Static checks are not end-to-end validation.
