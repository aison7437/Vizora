-- V2.2: enforce tier-specific quotas atomically inside Postgres.
-- Free: 10 text / 3 photo daily; Basic: 30 / 10; Premium: 100 / 30.
-- These are provisional usage allowances, subject to cost testing.
-- Paid tier is derived from the protected subscription table, NEVER caller input.
create or replace function public.consume_ai_quota(quota_kind text)
returns boolean language plpgsql security definer
set search_path = '' as $$
declare
  current_used integer;
  max_uses integer;
  effective_plan text := 'free';
begin
  if (select auth.uid()) is null then return false; end if;
  if quota_kind not in ('text','photo') then return false; end if;
  select s.plan into effective_plan
  from public.visiora_subscriptions s
  where s.user_id = (select auth.uid())
    and s.status in ('active','trialing')
    and s.current_period_end > now()
    and s.plan in ('basic','premium');
  effective_plan := coalesce(effective_plan,'free');
  max_uses := case
    when quota_kind='text' and effective_plan='premium' then 100
    when quota_kind='text' and effective_plan='basic' then 30
    when quota_kind='text' then 10
    when quota_kind='photo' and effective_plan='premium' then 30
    when quota_kind='photo' and effective_plan='basic' then 10
    else 3 end;
  insert into public.ai_usage_by_kind(user_id,usage_day,kind,used)
  values((select auth.uid()),(now() at time zone 'utc')::date,quota_kind,1)
  on conflict(user_id,usage_day,kind) do update
  set used=public.ai_usage_by_kind.used+1
  where public.ai_usage_by_kind.used < max_uses
  returning used into current_used;
  return current_used is not null;
end $$;
revoke all on function public.consume_ai_quota(text) from public,anon;
grant execute on function public.consume_ai_quota(text) to authenticated;
