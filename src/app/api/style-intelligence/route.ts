import {NextResponse} from "next/server";
import {wardrobeContext} from "@/lib/agents/wardrobe-context";
import {buildStyleIntelligence, type WardrobeItem} from "@/lib/style-intelligence";
export const runtime="nodejs";
export async function GET(request:Request){
 const context=await wardrobeContext(request.headers.get("authorization"));
 if(!context)return NextResponse.json({error:"Authentication required."},{status:401});
 const url=new URL(request.url);
 const occasion=url.searchParams.get("occasion")??"everyday";
 const budgetText=url.searchParams.get("budget")??"0";
 if(!["everyday","work","date","event"].includes(occasion)||!/^(0|[1-9]\d{0,6})$/.test(budgetText))
  return NextResponse.json({error:"Invalid occasion or budget (KSh 0–9,999,999)."},{status:400});
 const [p,w]=await Promise.all([
  context.client.from("visiora_style_preferences").select("preferred_colors,avoid_colors,style_notes").eq("user_id",context.userId).maybeSingle(),
  context.client.from("visiora_wardrobe_items").select("id,name,category,color").eq("user_id",context.userId).order("created_at",{ascending:false}).limit(100)
 ]);
 if(p.error||w.error)return NextResponse.json({error:"Style data temporarily unavailable."},{status:503});
 const result=buildStyleIntelligence({occasion,budgetKsh:Number(budgetText),preferences:p.data??{preferred_colors:[],avoid_colors:[],style_notes:""},items:(w.data??[]) as WardrobeItem[]});
 return NextResponse.json(result,{headers:{"Cache-Control":"no-store"}});
}
