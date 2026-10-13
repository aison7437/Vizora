import {NextResponse} from "next/server";
import {createClient} from "@supabase/supabase-js";
import {getSupabaseServerUser} from "@/lib/server-auth";
import {getEntitlement} from "@/lib/subscription-entitlements";
import {AGENT_IDS} from "@/lib/agents/registry";
import type {AgentId} from "@/lib/agents/registry";
import {planJourney} from "@/lib/agents/journey";
export const runtime="nodejs";
export async function POST(request:Request){
 const auth=request.headers.get("authorization");
 const userId=await getSupabaseServerUser(auth);
 if(!userId)return NextResponse.json({error:"Sign in required."},{status:401});
 const token=auth?.match(/^Bearer ([A-Za-z0-9._~-]+)$/)?.[1];
 if(!token)return NextResponse.json({error:"Sign in required."},{status:401});
 let body:unknown;
 try{body=await request.json()}catch{return NextResponse.json({error:"Invalid JSON."},{status:400})}
 if(!body||typeof body!=="object")return NextResponse.json({error:"Invalid request."},{status:400});
 const input=body as Record<string,unknown>;
 if(typeof input.intent!=="string"||input.intent.length<1||input.intent.length>300)
  return NextResponse.json({error:"Intent must be 1–300 characters."},{status:400});
 if(input.requestedAgent!==undefined&&(typeof input.requestedAgent!=="string"||!AGENT_IDS.includes(input.requestedAgent as AgentId)))
  return NextResponse.json({error:"Invalid agent."},{status:400});
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if(!url||!key)return NextResponse.json({error:"Identity service unavailable."},{status:503});
 const entitlement=await getEntitlement(token);
 if(!entitlement)return NextResponse.json({error:"Subscription service unavailable."},{status:503});
 const client=createClient(url,key,{global:{headers:{Authorization:`Bearer ${token}`}},auth:{persistSession:false,autoRefreshToken:false}});
 const {data:consent,error}=await client.from("photo_consents").select("revoked_at").eq("user_id",userId).maybeSingle();
 if(error)return NextResponse.json({error:"Consent service unavailable."},{status:503});
 const decision=planJourney({intent:input.intent,requestedAgent:input.requestedAgent as AgentId|undefined,
  photoConsent:Boolean(consent&&!consent.revoked_at),verifiedPaid:entitlement.verifiedPaid});
 return NextResponse.json({decision,plan:entitlement.plan,execution:"not-started"},{headers:{"Cache-Control":"no-store"}});
}
