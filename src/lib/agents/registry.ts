export const AGENT_IDS=[
 "journey-orchestrator","appearance-intelligence","hair-intelligence",
 "grooming-intelligence","makeup-intelligence","fashion-intelligence",
 "virtual-transformation","personalization-intelligence","occasion-intelligence",
 "wardrobe-intelligence","shopping-intelligence","subscription-monetization",
 "trust-privacy-safety","support-recovery","quality-optimization"
] as const;
export type AgentId=typeof AGENT_IDS[number];
export type AgentKind="orchestrator"|"ai-specialist"|"deterministic-service"|"planned-integration";
export type AgentDefinition={id:AgentId;kind:AgentKind;description:string;enabled:boolean};
export const AGENT_REGISTRY:readonly AgentDefinition[]=[
 {id:"journey-orchestrator",kind:"orchestrator",description:"Coordinates specialist routing and guarded execution",enabled:true},
 {id:"appearance-intelligence",kind:"planned-integration",description:"Consent-controlled image interpretation",enabled:false},
 {id:"hair-intelligence",kind:"ai-specialist",description:"Hair styling advice",enabled:true},
 {id:"grooming-intelligence",kind:"ai-specialist",description:"Grooming advice",enabled:true},
 {id:"makeup-intelligence",kind:"ai-specialist",description:"Makeup advice",enabled:true},
 {id:"fashion-intelligence",kind:"ai-specialist",description:"Fashion advice",enabled:true},
 {id:"virtual-transformation",kind:"planned-integration",description:"Image-generation transformations",enabled:false},
 {id:"personalization-intelligence",kind:"planned-integration",description:"Style preferences and history",enabled:false},
 {id:"occasion-intelligence",kind:"ai-specialist",description:"Occasion-based styling",enabled:true},
 {id:"wardrobe-intelligence",kind:"planned-integration",description:"Wardrobe inventory and combinations",enabled:false},
 {id:"shopping-intelligence",kind:"planned-integration",description:"Merchant product discovery",enabled:false},
 {id:"subscription-monetization",kind:"deterministic-service",description:"Protected billing and quotas",enabled:true},
 {id:"trust-privacy-safety",kind:"deterministic-service",description:"Consent and policy enforcement",enabled:true},
 {id:"support-recovery",kind:"deterministic-service",description:"Safe recovery guidance",enabled:true},
 {id:"quality-optimization",kind:"deterministic-service",description:"Non-sensitive health and usage metrics",enabled:true}
] as const;
export function getAgent(id:AgentId):AgentDefinition{
 const agent=AGENT_REGISTRY.find(item=>item.id===id);
 if(!agent)throw new Error("Unknown VISIORA agent");
 return agent;
}
