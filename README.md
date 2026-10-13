# VISIORA

Mobile-first personal styling studio. V1.1 includes a Supabase-backed account and preference profile.

## Local development

Node.js 22+, npm:

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Create a Supabase project, configure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` using its project URL and publishable/anon key, and apply `supabase/migrations/20261013_profiles.sql` in the Supabase SQL editor or migrations CLI. Configure Auth email confirmation and production site URL/redirects in Supabase. The service-role key must never be exposed to client code.

Visit `/account` to register, sign in and save a style goal. The database has row-level security restricting access to each authenticated user's own profile. The homepage styling demo remains predefined, not AI-driven, and photos remain browser-local.

## Status and next milestones

- [x] Mobile-first marketing page and local-only styling preview
- [x] Auth UI and Supabase authentication integration (requires external configuration)
- [x] Profile schema and row-level security
- [x] CI workflow for lint, typecheck and build
- [ ] Private image storage, retention/deletion, and consent audit
- [ ] AI service, evaluation and safety tests
- [ ] M-Pesa sandbox and subscription entitlement enforcement
- [ ] Integration tests, security audit and production deployment

Do not collect production photographs until secure storage, consent and deletion controls are implemented and tested.
