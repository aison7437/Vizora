# VISIORA V3 — Fixed 15-agent system

The immutable catalog is defined in `src/lib/agents/registry.ts`; `src/lib/agents/journey.ts` implements a pure, deterministic intent planner with guarded decisions. It does **not** execute user requests or accept client consent/payment flags as authoritative. The existing authenticated styling API continues to execute four specialists; existing billing/quota SQL and photo controls remain the enforcement boundaries.

Enabled entries reflect existing basic capabilities or routing contracts, **not** full production-ready autonomous agents. Disabled entries explicitly mark missing image generation, product feeds, wardrobe persistence, appearance analysis integration, and preference history. The occasion instruction is scaffolded but not wired to an API.

Do not expose a client-callable journey planner without authenticating the user and retrieving consent and entitlements server-side. Do not activate virtual transformations until provider integration, consent verification, image storage lifecycle and cost controls are tested. A fixed agent count does not imply all capabilities are complete.

Follow-on phases: authenticated orchestrator execution; appearance and occasion specialists; wardrobe/personalization data; image-generation previews; shopping integrations; support observability; staging acceptance and payment integration.
