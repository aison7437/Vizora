import {createClient} from "@supabase/supabase-js";
import {getSupabaseServerUser} from "@/lib/server-auth";
export async function wardrobeContext(authorization:string|null){
 const userId=await getSupabaseServerUser(authorization);
 if(!userId)return null;
 const token=authorization?.match(/^Bearer ([A-Za-z0-9._~-]+)$/)?.[1];
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if(!token||!url||!key)return null;
 const client=createClient(url,key,{global:{headers:{Authorization:`Bearer ${token}`}},auth:{persistSession:false,autoRefreshToken:false}});
 return {client,userId};
}
