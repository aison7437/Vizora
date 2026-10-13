export const PLAN_CATALOG={
 free:{label:"Free",monthlyKes:0},
 basic:{label:"Basic",monthlyKes:499},
 premium:{label:"Premium",monthlyKes:799}
} as const;
export type PlanId=keyof typeof PLAN_CATALOG;
export function isPlanId(value:unknown):value is PlanId{
 return typeof value==="string"&&Object.prototype.hasOwnProperty.call(PLAN_CATALOG,value);
}
// Display catalog only. Paid entitlements must come from server-verified billing,
// never a user-supplied plan field or an unverified payment callback.
