# VISIORA V3.3 — Authenticated specialist execution

POST /api/journey with a valid Bearer token and JSON `{ "intent": "wedding guest look", "preferences": "navy, budget-conscious", "execute": true }` executes an allowed text specialist selected by the Journey Orchestrator. Optional `requestedAgent` selects one of the fixed agent IDs.

The route derives consent and paid entitlements server-side, refuses non-ready decisions, and invokes the existing authenticated /api/appearance handler in-process. That handler **re-authenticates, enforces the atomic database text quota and calls the configured model**. Five specialists are allowlisted: hair, grooming, makeup, fashion, occasion. Planned agents and billing/privacy service roles are never dispatched as LLM prompts.

Omitting `execute` retains the V3.1 planning-only response. Execution responses preserve the styling endpoint status codes (401/429/502/503). No public server-to-server HTTP call, new credential, or client-supplied payment/consent authority is introduced.

Before production: apply migrations, validate identity/consent/quota behavior in staging, run concurrent quota tests, and add endpoint-level mocked/integration tests. Static CI checks cannot verify Supabase or OpenAI availability.
