-- V3.4: private wardrobe and personal style preferences.
create table if not exists public.visiora_style_preferences (
 user_id uuid primary key references auth.users(id) on delete cascade,
 preferred_colors text[] not null default '{}'::text[] check (cardinality(preferred_colors)<=12),
 avoid_colors text[] not null default '{}'::text[] check (cardinality(avoid_colors)<=12),
 style_notes text not null default '' check (char_length(style_notes)<=500),
 updated_at timestamptz not null default now()
);
create table if not exists public.visiora_wardrobe_items (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 name text not null check (char_length(name) between 1 and 100),
 category text not null check (category in ('top','bottom','dress','outerwear','footwear','accessory','other')),
 color text not null default '' check (char_length(color)<=40),
 notes text not null default '' check (char_length(notes)<=300),
 created_at timestamptz not null default now()
);
create index if not exists visiora_wardrobe_owner_created on public.visiora_wardrobe_items(user_id,created_at desc);
alter table public.visiora_style_preferences enable row level security;
alter table public.visiora_wardrobe_items enable row level security;
revoke all on public.visiora_style_preferences from anon,authenticated;
revoke all on public.visiora_wardrobe_items from anon,authenticated;
grant select,insert,update,delete on public.visiora_style_preferences to authenticated;
grant select,insert,update,delete on public.visiora_wardrobe_items to authenticated;
drop policy if exists "style_preferences_select_self" on public.visiora_style_preferences;
create policy "style_preferences_select_self" on public.visiora_style_preferences for select to authenticated using (user_id=(select auth.uid()));
drop policy if exists "style_preferences_insert_self" on public.visiora_style_preferences;
create policy "style_preferences_insert_self" on public.visiora_style_preferences for insert to authenticated with check (user_id=(select auth.uid()));
drop policy if exists "style_preferences_update_self" on public.visiora_style_preferences;
create policy "style_preferences_update_self" on public.visiora_style_preferences for update to authenticated using (user_id=(select auth.uid())) with check (user_id=(select auth.uid()));
drop policy if exists "style_preferences_delete_self" on public.visiora_style_preferences;
create policy "style_preferences_delete_self" on public.visiora_style_preferences for delete to authenticated using (user_id=(select auth.uid()));
drop policy if exists "wardrobe_select_self" on public.visiora_wardrobe_items;
create policy "wardrobe_select_self" on public.visiora_wardrobe_items for select to authenticated using (user_id=(select auth.uid()));
drop policy if exists "wardrobe_insert_self" on public.visiora_wardrobe_items;
create policy "wardrobe_insert_self" on public.visiora_wardrobe_items for insert to authenticated with check (user_id=(select auth.uid()));
drop policy if exists "wardrobe_update_self" on public.visiora_wardrobe_items;
create policy "wardrobe_update_self" on public.visiora_wardrobe_items for update to authenticated using (user_id=(select auth.uid())) with check (user_id=(select auth.uid()));
drop policy if exists "wardrobe_delete_self" on public.visiora_wardrobe_items;
create policy "wardrobe_delete_self" on public.visiora_wardrobe_items for delete to authenticated using (user_id=(select auth.uid()));
