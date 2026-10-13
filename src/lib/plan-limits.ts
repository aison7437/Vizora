export const DAILY_PLAN_LIMITS={
 free:{text:10,photo:3},
 basic:{text:30,photo:10},
 premium:{text:100,photo:30}
} as const;
// UI/reference only. The authoritative limits are enforced atomically by
// supabase/migrations/20261015_plan_quotas.sql, not by this client-readable object.
