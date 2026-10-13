# VISIORA V3.6 — Passwordless authentication UI

The existing /account page now offers Google and Apple OAuth plus email and phone OTP using the current Supabase browser client. Existing email/password signup, login, sign-out and profile editing remain available.

## External configuration required
- Enable Google and Apple in Supabase Auth and configure provider client IDs/secrets.
- Configure Supabase Site URL and permitted redirect URLs including `https://YOUR_DOMAIN/account`; test OAuth redirects on staging and production.
- Configure email delivery/templates for OTP codes (not only magic links), and an SMS provider with delivery and abuse controls for phone OTP.
- Enable rate limiting/CAPTCHA as appropriate; test account linking, expired OTPs, redirects, recovery, and concurrent sessions.
- Do not infer photo consent from signing in. Never embed provider secrets in NEXT_PUBLIC variables.

This PR provides client flows; no provider account, SMS service, production deployment, passkey registration, or account-linking policy is configured by code alone.
