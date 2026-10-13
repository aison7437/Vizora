-- Atomic authenticated per-user daily quota across both AI endpoints.
create table if not exists public.ai_usage_by_kind (
 user_id uuid not null references auth.users(id) on delete cascade,
 usage_day date not null,
 kind text not null check(kind in ('text','photo')),
 used integer not null default 0 check(used>=0),
 primary key(user_id,usage_day,kind)
);
alter table public.ai_usage_by_kind enable row level security;
revoke all on public.ai_usage_by_kind from anon,authenticated;
create or replace function public.consume_ai_quota(quota_kind text)
returns boolean language plpgsql security definer set search_path=public as $$
declare current_used integer;
declare max_uses integer;
begin
 if auth.uid() is null then return false; end if;
 max_uses:=case quota_kind when 'text' then 10 when 'photo' then 3 else null end;
 if max_uses is null then return false; end if;
 insert into public.ai_usage_by_kind(user_id,usage_day,kind,used)
 values(auth.uid(),(now() at time zone 'utc')::date,quota_kind,1)
 on conflict(user_id,usage_day,kind) do update
 set used=public.ai_usage_by_kind.used+1
 where public.ai_usage_by_kind.used < max_uses
 returning used into current_used;
 return current_used is not null;
end $$;
revoke all on function public.consume_ai_quota(text) from public,anon;
grant execute on function public.consume_ai_quota(text) to authenticated;
