import {getAgent} from "@/lib/agents/registry";
import type {AgentId} from "@/lib/agents/registry";
export type JourneyRequest={intent:string;requestedAgent?:AgentId;photoConsent:boolean;verifiedPaid:boolean};
export type JourneyDecision={agent:AgentId;status:"ready"|"unavailable"|"consent-required"|"subscription-required";reason:string};
const rules:Array<{match:RegExp;agent:AgentId}>=[
 {match:/transform|virtual try|preview my look/i,agent:"virtual-transformation"},
 {match:/photo|selfie|appearance analysis/i,agent:"appearance-intelligence"},
 {match:/hair|haircut/i,agent:"hair-intelligence"},
 {match:/beard|shav|groom/i,agent:"grooming-intelligence"},
 {match:/makeup|cosmetic/i,agent:"makeup-intelligence"},
 {match:/wedding|occasion|event|date night/i,agent:"occasion-intelligence"},
 {match:/wardrobe|closet/i,agent:"wardrobe-intelligence"},
 {match:/buy|shop|product/i,agent:"shopping-intelligence"},
 {match:/subscription|billing|payment/i,agent:"subscription-monetization"},
 {match:/support|error|failed/i,agent:"support-recovery"}
];
export function planJourney(request:JourneyRequest):JourneyDecision{
 const id=request.requestedAgent??rules.find(rule=>rule.match.test(request.intent))?.agent??"fashion-intelligence";
 const agent=getAgent(id);
 if((id==="appearance-intelligence"||id==="virtual-transformation")&&!request.photoConsent)
  return {agent:id,status:"consent-required",reason:"Explicit photo consent required."};
 if(id==="virtual-transformation"&&!request.verifiedPaid)
  return {agent:id,status:"subscription-required",reason:"Verified paid entitlement required."};
 if(!agent.enabled)return {agent:id,status:"unavailable",reason:"Integration not yet enabled."};
 return {agent:id,status:"ready",reason:"Route available; backend authorization still required."};
}
// This is a pure routing planner, NOT a user-authenticated execution gateway.
// Do not accept client-provided verifiedPaid or consent flags as authority.
