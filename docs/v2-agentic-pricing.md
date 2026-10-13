# VISIORA V2 — Pricing and agentic contracts

## Confirmed pricing
Free KSh 0/month; Basic KSh 499/month; Premium KSh 799/month. Prices are displayed as **planned**: no payment provider, subscription lifecycle or paid entitlement verification has been implemented.

## Agent routing
`src/lib/appearance-orchestrator.ts` defines typed routing for hair, grooming, makeup, fashion and virtual transformations. The virtual-transformation route requires both explicit photo consent and a server-verified paid entitlement. This is a routing/authorization contract only: specialist inference, image generation, provider selection, payment callbacks, billing state and persistence are not implemented.

## Security and rollout
Do not accept a client-provided subscription tier as evidence of payment. Keep premium transformations disabled until a server-side payment authority, verified provider callbacks, and billing reconciliation are implemented and tested. Existing styling and photo APIs remain unchanged; do not assume they enforce the new subscription catalog. Complete live staging verification before release.
