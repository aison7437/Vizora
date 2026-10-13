-- Subscription records are billing-authoritative, never user writable.
create table if not exists public.visiora_subscriptions (
 user_id uuid primary key references auth.users(id) on delete cascade,
 plan text not null check (plan in ('free','basic','premium')),
 status text not null check (status in ('active','trialing','past_due','canceled','expired')),
 current_period_end timestamptz,
 provider text,
 provider_subscription_id text,
 updated_at timestamptz not null default now(),
 constraint paid_period_required check (plan='free' or current_period_end is not null)
);
alter table public.visiora_subscriptions enable row level security;
revoke all on public.visiora_subscriptions from anon, authenticated;
grant select on public.visiora_subscriptions to authenticated;
create policy "Subscribers read only their own entitlement"
 on public.visiora_subscriptions for select to authenticated
 using ((select auth.uid()) = user_id);
-- No insert/update/delete policies or grants for client roles.
-- Future billing webhooks must verify provider signatures and update rows
-- using a separate, tightly scoped server-side authority.
