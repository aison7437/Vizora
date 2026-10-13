import {NextResponse} from "next/server";
import {wardrobeContext} from "@/lib/agents/wardrobe-context";
export const runtime="nodejs";
export async function GET(request:Request){
 const context=await wardrobeContext(request.headers.get("authorization"));
 if(!context)return NextResponse.json({error:"Sign in required or identity service unavailable."},{status:401});
 const {data,error}=await context.client.from("visiora_style_preferences").select("preferred_colors,avoid_colors,style_notes,updated_at").eq("user_id",context.userId).maybeSingle();
 if(error)return NextResponse.json({error:"Preferences unavailable."},{status:503});
 return NextResponse.json({preferences:data??{preferred_colors:[],avoid_colors:[],style_notes:""}},{headers:{"Cache-Control":"no-store"}});
}
export async function PUT(request:Request){
 const context=await wardrobeContext(request.headers.get("authorization"));
 if(!context)return NextResponse.json({error:"Sign in required or identity service unavailable."},{status:401});
 let body:unknown;try{body=await request.json()}catch{return NextResponse.json({error:"Invalid JSON."},{status:400})}
 if(!body||typeof body!=="object")return NextResponse.json({error:"Invalid preferences."},{status:400});
 const x=body as Record<string,unknown>;
 const colors=(value:unknown)=>Array.isArray(value)&&value.length<=12&&value.every(c=>typeof c==="string"&&c.length<=40);
 if(!colors(x.preferred_colors)||!colors(x.avoid_colors)||typeof x.style_notes!=="string"||x.style_notes.length>500)
  return NextResponse.json({error:"Invalid preference fields."},{status:400});
 const {data,error}=await context.client.from("visiora_style_preferences").upsert({user_id:context.userId,preferred_colors:x.preferred_colors,avoid_colors:x.avoid_colors,style_notes:x.style_notes,updated_at:new Date().toISOString()},{onConflict:"user_id"}).select("preferred_colors,avoid_colors,style_notes,updated_at").single();
 if(error)return NextResponse.json({error:"Could not save preferences."},{status:503});
 return NextResponse.json({preferences:data},{headers:{"Cache-Control":"no-store"}});
}
