-- VISIORA private photos: explicit consent, private bucket and owner-only access.
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('visiora-private','visiora-private',false,5242880,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public=false,file_size_limit=5242880,allowed_mime_types=array['image/jpeg','image/png','image/webp'];

create table if not exists public.photo_consents (
  user_id uuid primary key references auth.users(id) on delete cascade,
  accepted_at timestamptz not null default now(),
  consent_version text not null default 'v1',
  revoked_at timestamptz
);
alter table public.photo_consents enable row level security;
grant select,insert,update,delete on public.photo_consents to authenticated;
drop policy if exists "photo_consent_self_select" on public.photo_consents;
create policy "photo_consent_self_select" on public.photo_consents for select to authenticated using (user_id=(select auth.uid()));
drop policy if exists "photo_consent_self_insert" on public.photo_consents;
create policy "photo_consent_self_insert" on public.photo_consents for insert to authenticated with check (user_id=(select auth.uid()));
drop policy if exists "photo_consent_self_update" on public.photo_consents;
create policy "photo_consent_self_update" on public.photo_consents for update to authenticated using (user_id=(select auth.uid())) with check (user_id=(select auth.uid()));
drop policy if exists "photo_consent_self_delete" on public.photo_consents;
create policy "photo_consent_self_delete" on public.photo_consents for delete to authenticated using (user_id=(select auth.uid()));

drop policy if exists "visiora_photo_read" on storage.objects;
create policy "visiora_photo_read" on storage.objects for select to authenticated
using (bucket_id='visiora-private' and (storage.foldername(name))[1]=(select auth.uid())::text);
drop policy if exists "visiora_photo_insert" on storage.objects;
create policy "visiora_photo_insert" on storage.objects for insert to authenticated
with check (bucket_id='visiora-private' and (storage.foldername(name))[1]=(select auth.uid())::text
and exists(select 1 from public.photo_consents where user_id=(select auth.uid()) and revoked_at is null));
drop policy if exists "visiora_photo_delete" on storage.objects;
create policy "visiora_photo_delete" on storage.objects for delete to authenticated
using (bucket_id='visiora-private' and (storage.foldername(name))[1]=(select auth.uid())::text);

-- Atomic daily quota for authenticated image analyses; protected by row-level identity check.
create table if not exists public.ai_usage_daily (
  user_id uuid not null references auth.users(id) on delete cascade,
  usage_day date not null,
  used integer not null default 0 check (used >= 0),
  primary key (user_id,usage_day)
);
alter table public.ai_usage_daily enable row level security;
revoke all on public.ai_usage_daily from anon,authenticated;
create or replace function public.consume_photo_analysis_quota()
returns boolean language plpgsql security definer set search_path=public as $$
declare current_used integer;
begin
  if auth.uid() is null then return false; end if;
  insert into public.ai_usage_daily(user_id,usage_day,used)
  values(auth.uid(),(now() at time zone 'utc')::date,1)
  on conflict (user_id,usage_day) do update
  set used=public.ai_usage_daily.used+1
  where public.ai_usage_daily.used < 3
  returning used into current_used;
  return current_used is not null;
end $$;
revoke all on function public.consume_photo_analysis_quota() from public,anon;
grant execute on function public.consume_photo_analysis_quota() to authenticated;
