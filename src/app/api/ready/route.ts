import { NextResponse } from "next/server";
import { isConfigured } from "@/lib/ai-controls";
export const runtime="nodejs";
export function GET(){
 const ready=isConfigured();
 return NextResponse.json({status:ready?"ready":"configuration_required",dependencies:{supabase:Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL&&process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),ai:Boolean(process.env.OPENAI_API_KEY)}},{status:ready?200:503,headers:{"Cache-Control":"no-store"}});
}
