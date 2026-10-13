import { createClient } from "@supabase/supabase-js";
export const AI_LIMITS={text:10,photo:3} as const;
export function isConfigured(){
 return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL&&process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY&&process.env.OPENAI_API_KEY);
}
export async function consumeAiQuota(token:string,kind:keyof typeof AI_LIMITS):Promise<"allowed"|"limited"|"unavailable">{
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if(!url||!key)return "unavailable";
 const client=createClient(url,key,{global:{headers:{Authorization:`Bearer ${token}`}},auth:{persistSession:false,autoRefreshToken:false}});
 const {data,error}=await client.rpc("consume_ai_quota",{quota_kind:kind});
 if(error)return "unavailable";
 return data===true?"allowed":"limited";
}
export function logAiEvent(event:string,properties:Record<string,string|number|boolean>={}){
 console.info(JSON.stringify({component:"visiora-ai",event,at:new Date().toISOString(),...properties}));
}
