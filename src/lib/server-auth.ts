import { createClient } from "@supabase/supabase-js";
export async function getSupabaseServerUser(authorization:string|null):Promise<string|null>{
  const token=authorization?.match(/^Bearer ([A-Za-z0-9._~-]+)$/)?.[1];
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if(!token||!url||!key)return null;
  const supabase=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
  const {data,error}=await supabase.auth.getUser(token);
  if(error||!data.user)return null;
  return data.user.id;
}
