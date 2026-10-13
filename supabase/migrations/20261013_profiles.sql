-- Apply using Supabase migrations; never expose the service-role key to browsers.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '' check (char_length(display_name) <= 100),
  style_goal text not null default 'Everyday confidence' check (style_goal in ('Everyday confidence','Work & professional','Date night','Special event')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
revoke all on public.profiles from anon;
grant select,insert,update,delete on public.profiles to authenticated;
drop policy if exists "profile_select_own" on public.profiles;
create policy "profile_select_own" on public.profiles for select to authenticated using ((select auth.uid()) = id);
drop policy if exists "profile_insert_own" on public.profiles;
create policy "profile_insert_own" on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
drop policy if exists "profile_update_own" on public.profiles;
create policy "profile_update_own" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
drop policy if exists "profile_delete_own" on public.profiles;
create policy "profile_delete_own" on public.profiles for delete to authenticated using ((select auth.uid()) = id);
