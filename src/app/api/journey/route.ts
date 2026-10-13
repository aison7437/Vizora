import {NextResponse} from "next/server";
import {createClient} from "@supabase/supabase-js";
import {getSupabaseServerUser} from "@/lib/server-auth";
import {getEntitlement} from "@/lib/subscription-entitlements";
import {AGENT_IDS} from "@/lib/agents/registry";
import type {AgentId} from "@/lib/agents/registry";
import {planJourney} from "@/lib/agents/journey";
import {POST as executeAppearance} from "@/app/api/appearance/route";
import {EXECUTABLE_AGENT_SPECIALISTS} from "@/lib/agents/executable-specialists";
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
 if(input.execute!==undefined&&typeof input.execute!=="boolean")
  return NextResponse.json({error:"Invalid execution flag."},{status:400});
 if(input.execute===true){
  if(decision.status!=="ready")return NextResponse.json({decision,error:decision.reason},{status:403,headers:{"Cache-Control":"no-store"}});
  const specialist=EXECUTABLE_AGENT_SPECIALISTS[decision.agent as keyof typeof EXECUTABLE_AGENT_SPECIALISTS];
  if(!specialist)return NextResponse.json({decision,error:"This agent has no execution adapter."},{status:501,headers:{"Cache-Control":"no-store"}});
  if(input.useSavedStyle!==undefined&&typeof input.useSavedStyle!=="boolean")
   return NextResponse.json({error:"Invalid saved-style preference."},{status:400});
  if(typeof input.preferences!=="string"||input.preferences.length>500)
   return NextResponse.json({error:"Preferences must be a string of at most 500 characters."},{status:400});
  const result=await executeAppearance(new Request(request.url,{
   method:"POST",headers:{"authorization":auth??"","content-type":"application/json"},
   body:JSON.stringify({specialist,goal:input.intent.slice(0,200),preferences:input.preferences,useSavedStyle:input.useSavedStyle===true})
  }));
  const responseHeaders=new Headers(result.headers);
  responseHeaders.set("Cache-Control","no-store");
  return new Response(result.body,{status:result.status,headers:responseHeaders});
 }
 return NextResponse.json({decision,plan:entitlement.plan,execution:"not-started"},{headers:{"Cache-Control":"no-store"}});
}
