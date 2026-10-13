# VISIORA V3.4 — Personalization and wardrobe persistence

Apply `supabase/migrations/20261016_wardrobe_preferences.sql` to the staging Supabase database. The new tables use owner-only RLS and explicit authenticated grants for each operation. No photos are stored in wardrobe records.

Authenticated endpoints:
- `GET /api/wardrobe` returns up to 100 of the current user's items.
- `POST /api/wardrobe` creates an item with `name,category,color,notes`.
- `DELETE /api/wardrobe?id=<uuid>` deletes only an owned item.
- `GET /api/style-preferences` reads saved colors and style notes.
- `PUT /api/style-preferences` saves `preferred_colors,avoid_colors,style_notes`.

These are persistent data foundations for agents 8 and 10. They do not yet automatically inject preferences or wardrobe contents into LLM prompts. Database migrations, RLS cross-user tests and live staging acceptance remain necessary. CI static assertions are not substitutes for integration tests.
