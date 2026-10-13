# V2.1 specialist API and read-only subscriptions

`POST /api/appearance` accepts authenticated JSON `{specialist:"hair"|"grooming"|"makeup"|"fashion",goal:string,preferences:string}`. It routes to a dedicated specialist instruction, consumes the existing shared 10/day text quota and returns a bounded suggestion.

`visiora_subscriptions` is readable only by its owner under RLS. Clients cannot create or modify billing records. The server treats missing or expired subscriptions as Free; database failures fail closed. Paid entitlements cannot be created until a payment provider and signature-verified server-side billing handler are added. The API currently permits the same four text specialists on all tiers; tier-specific allowances and paid features are not yet enforced.

Virtual transformation deliberately returns 501 until explicit consent, server-verified billing and image generation are implemented. These features require real Supabase migration and OpenAI staging verification. Do not describe this PR as completing payments or virtual transformations.
