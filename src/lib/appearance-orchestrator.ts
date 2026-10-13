export const SPECIALISTS=["hair","grooming","makeup","fashion","virtual-transformation"] as const;
export type Specialist=(typeof SPECIALISTS)[number];
export type AppearanceIntent={goal:string;requestedSpecialist?:Specialist};
export type AgentRoute={specialist:Specialist;requiresPhoto:boolean;requiresExplicitConsent:boolean;requiresPaidEntitlement:boolean};
const ROUTES:Record<Specialist,AgentRoute>={
 hair:{specialist:"hair",requiresPhoto:false,requiresExplicitConsent:false,requiresPaidEntitlement:false},
 grooming:{specialist:"grooming",requiresPhoto:false,requiresExplicitConsent:false,requiresPaidEntitlement:false},
 makeup:{specialist:"makeup",requiresPhoto:false,requiresExplicitConsent:false,requiresPaidEntitlement:false},
 fashion:{specialist:"fashion",requiresPhoto:false,requiresExplicitConsent:false,requiresPaidEntitlement:false},
 "virtual-transformation":{specialist:"virtual-transformation",requiresPhoto:true,requiresExplicitConsent:true,requiresPaidEntitlement:true}
};
export function routeAppearanceIntent(input:AppearanceIntent):AgentRoute{
 if(input.requestedSpecialist)return ROUTES[input.requestedSpecialist];
 const goal=input.goal.toLowerCase();
 if(/hair|haircut|hairstyle/.test(goal))return ROUTES.hair;
 if(/beard|shav|groom/.test(goal))return ROUTES.grooming;
 if(/makeup|cosmetic/.test(goal))return ROUTES.makeup;
 // Do not infer virtual-transformation authorization from free text.
 return ROUTES.fashion;
}
export type AgentExecutionContext={userId:string;photoConsent:boolean;paidEntitlementVerified:boolean};
export function authorizeRoute(route:AgentRoute,ctx:AgentExecutionContext):boolean{
 return (!route.requiresPhoto||ctx.photoConsent)&&(!route.requiresPaidEntitlement||ctx.paidEntitlementVerified);
}
// Routing and authorization contracts only; no specialist inference is executed here.
