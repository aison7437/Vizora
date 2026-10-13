import { NextResponse } from "next/server";
export const runtime="nodejs";
export function GET(){
 return NextResponse.json({status:"ok",service:"visiora",timestamp:new Date().toISOString()},{headers:{"Cache-Control":"no-store"}});
}
