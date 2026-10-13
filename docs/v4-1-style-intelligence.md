# VISIORA V4.1 — Style DNA, Wardrobe Remix and Budget Guardrails

Authenticated GET /api/style-intelligence?occasion=everyday&budget=2500
Authorization: Bearer <Supabase access token>

Returns a deterministic, explainable style snapshot using existing user-owned wardrobe and style-preference tables. The engine prioritizes liked colors, excludes avoided colors, chooses available wardrobe categories, and identifies missing essentials. A dress counts as both upper and lower clothing. The budget field is an upper limit only: estimated spending remains zero, with no invented shopping prices.

Requires applying the existing V3.4 Supabase migration. RLS and explicit user filters are retained. No service-role credentials, image analysis, paid shopping integration, or new agents.

Future follow-ups: a customer-facing interactive wardrobe remix page; opt-in occasion/weather context; saved style timeline; visual transformations only with explicit photo consent; private Style Circle sharing with independent access controls.
