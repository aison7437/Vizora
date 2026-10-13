# V3.1 Authenticated Journey Planning

POST /api/journey accepts {intent,requestedAgent?} with a Supabase Bearer token. It validates the user, loads the paid entitlement from protected subscription records, checks photo consent from the authenticated user's database record, and returns the planner decision. Client-submitted consent or billing flags are never trusted. Failed entitlement or consent lookups fail closed.

This endpoint **plans only**; it never invokes a model, makes a payment, uploads a photo or executes a transformation. The four existing styling specialists remain available via /api/appearance. Do not mistake a ready routing status for completed execution. Before production, add integration tests against real Supabase RLS and monitor abusive request volume.
