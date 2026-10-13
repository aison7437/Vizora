import type {AgentId} from "@/lib/agents/registry";
import type {Specialist} from "@/lib/appearance-orchestrator";
// Only the five authenticated text specialists are executable.
// This is a strict allowlist; billing, privacy and planned agents cannot
// be invoked as arbitrary model prompts.
export const EXECUTABLE_AGENT_SPECIALISTS={
 "hair-intelligence":"hair",
 "grooming-intelligence":"grooming",
 "makeup-intelligence":"makeup",
 "fashion-intelligence":"fashion",
 "occasion-intelligence":"occasion"
} as const satisfies Partial<Record<AgentId,Specialist>>;
