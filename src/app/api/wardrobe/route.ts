import {NextResponse} from "next/server";
import {wardrobeContext} from "@/lib/agents/wardrobe-context";
export const runtime="nodejs";
export async function GET(request:Request){
 const context=await wardrobeContext(request.headers.get("authorization"));
 if(!context)return NextResponse.json({error:"Sign in required or identity service unavailable."},{status:401});
 const {data,error}=await context.client.from("visiora_wardrobe_items").select("id,name,category,color,notes,created_at").eq("user_id",context.userId).order("created_at",{ascending:false}).limit(100);
 if(error)return NextResponse.json({error:"Wardrobe unavailable."},{status:503});
 return NextResponse.json({items:data},{headers:{"Cache-Control":"no-store"}});
}
export async function POST(request:Request){
 const context=await wardrobeContext(request.headers.get("authorization"));
 if(!context)return NextResponse.json({error:"Sign in required or identity service unavailable."},{status:401});
 let body:unknown;try{body=await request.json()}catch{return NextResponse.json({error:"Invalid JSON."},{status:400})}
 if(!body||typeof body!=="object")return NextResponse.json({error:"Invalid item."},{status:400});
 const x=body as Record<string,unknown>;
 if(typeof x.name!=="string"||x.name.trim().length<1||x.name.length>100||typeof x.category!=="string"||!["top","bottom","dress","outerwear","footwear","accessory","other"].includes(x.category)||typeof x.color!=="string"||x.color.length>40||typeof x.notes!=="string"||x.notes.length>300)
  return NextResponse.json({error:"Invalid wardrobe fields."},{status:400});
 const {data,error}=await context.client.from("visiora_wardrobe_items").insert({user_id:context.userId,name:x.name.trim(),category:x.category,color:x.color,notes:x.notes}).select("id,name,category,color,notes,created_at").single();
 if(error)return NextResponse.json({error:"Could not save wardrobe item."},{status:503});
 return NextResponse.json({item:data},{status:201,headers:{"Cache-Control":"no-store"}});
}
export async function DELETE(request:Request){
 const context=await wardrobeContext(request.headers.get("authorization"));
 if(!context)return NextResponse.json({error:"Sign in required or identity service unavailable."},{status:401});
 const id=new URL(request.url).searchParams.get("id");
 if(!id||!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id))return NextResponse.json({error:"Valid item ID required."},{status:400});
 const {data,error}=await context.client.from("visiora_wardrobe_items").delete().eq("id",id).eq("user_id",context.userId).select("id").maybeSingle();
 if(error)return NextResponse.json({error:"Could not delete item."},{status:503});
 if(!data)return NextResponse.json({error:"Item not found."},{status:404});
 return NextResponse.json({deleted:true},{headers:{"Cache-Control":"no-store"}});
}
