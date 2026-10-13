import {createClient} from "@supabase/supabase-js";
import type {PlanId} from "@/lib/plan-catalog";
export type Entitlement={plan:PlanId;verifiedPaid:boolean};
export async function getEntitlement(token:string):Promise<Entitlement|null>{
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
 const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if(!url||!key)return null;
 const client=createClient(url,key,{global:{headers:{Authorization:`Bearer ${token}`}},auth:{persistSession:false,autoRefreshToken:false}});
 const {data,error}=await client.from("visiora_subscriptions").select("plan,status,current_period_end").maybeSingle();
 if(error)return null;
 if(!data)return {plan:"free",verifiedPaid:false};
 if(data.plan==="free")return {plan:"free",verifiedPaid:false};
 if(data.plan!=="basic"&&data.plan!=="premium")return null;
 const valid=typeof data.current_period_end==="string"&&Date.parse(data.current_period_end)>Date.now();
 if(!valid||!["active","trialing"].includes(data.status))return {plan:"free",verifiedPaid:false};
 return {plan:data.plan,verifiedPaid:true};
}
