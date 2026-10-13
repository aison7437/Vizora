# VISIORA

VISIORA is a mobile-first personal styling application under development.

## Development

Requires Node.js 22+.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Configure a Supabase project and apply `supabase/migrations/20261013_profiles.sql`. Set the Supabase project URL and publishable/anon key in `.env.local`. Configure email confirmation and permitted redirects in Supabase Auth.

For the AI Style Advisor at `/stylist`, configure `OPENAI_API_KEY` **server-side only**. The advisor requires a valid Supabase session, accepts a goal and up to 500 characters of preferences, and generates text-only suggestions. It does **not** analyze photos. API credentials must never be placed in `NEXT_PUBLIC_*` variables.

## Features

- Responsive landing page and browser-local optional photo preview (no uploads).
- Supabase email/password authentication and row-level-security-backed user style profile.
- Authenticated, text-only AI styling endpoint and interface (requires external credentials).
- GitHub Actions CI for typechecking, linting and building.

## Production blockers

Before launch: rate limiting and abuse protection on AI endpoints, usage metering and quotas, private image storage with explicit consent/deletion controls, end-to-end tests, accessibility/security audits, payment integration and production monitoring. The current version is **not production-ready**.
