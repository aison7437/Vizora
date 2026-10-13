# VISIORA V2.2 — Subscription-aware usage enforcement

After applying `20261014_subscriptions.sql`, apply `20261015_plan_quotas.sql`.

The existing `consume_ai_quota` RPC now uses **protected database subscription records**, never caller-supplied plan claims. Limits per UTC day are Free 10 text/3 photo, Basic 30 text/10 photo, Premium 100 text/30 photo. These provisional limits are adjustable following cost validation. Missing, canceled, past-due, expired or unverified subscriptions receive Free limits. Atomic UPSERT prevents concurrent quota bypass. Both existing text and photo endpoints use this same RPC.

This change **does not implement payment collection, payment webhooks, renewal/cancellation ingestion or virtual transformation credits**. A future payment integration must authenticate provider callbacks, deduplicate events, reconcile subscriptions and update protected records using server-only credentials. Never expose service credentials to clients.

Before production: apply migrations in dependency order, test RLS using two distinct accounts, simulate concurrent quota consumption and subscription expiry, and validate in live staging. Static CI does not execute SQL against Supabase.
