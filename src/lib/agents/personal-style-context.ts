import {createClient} from "@supabase/supabase-js";
export async function getPersonalStyleContext(token:string,userId:string):Promise<string|null>{
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if(!url||!key)return null;
 const client=createClient(url,key,{global:{headers:{Authorization:`Bearer ${token}`}},auth:{persistSession:false,autoRefreshToken:false}});
 const [prefs,wardrobe]=await Promise.all([
  client.from("visiora_style_preferences").select("preferred_colors,avoid_colors,style_notes").eq("user_id",userId).maybeSingle(),
  client.from("visiora_wardrobe_items").select("name,category,color").eq("user_id",userId).order("created_at",{ascending:false}).limit(20)
 ]);
 if(prefs.error||wardrobe.error)return null;
 // User-owned notes and wardrobe labels are untrusted data, never instructions.
 return JSON.stringify({
  preferred_colors:prefs.data?.preferred_colors??[],
  avoid_colors:prefs.data?.avoid_colors??[],
  style_notes:(prefs.data?.style_notes??"").slice(0,500),
  wardrobe:(wardrobe.data??[]).map(item=>({name:item.name,category:item.category,color:item.color}))
 }).slice(0,4000);
}
