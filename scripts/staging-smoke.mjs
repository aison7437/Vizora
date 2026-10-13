#!/usr/bin/env node
// Black-box staging smoke tests. Never print tokens or credentials.
import assert from "node:assert/strict";
const base=process.env.VISIORA_STAGING_URL;
if(!base||!/^https:\/\//.test(base)){console.error("VISIORA_STAGING_URL must be an HTTPS URL");process.exit(2)}
const origin=new URL(base).origin;
let failed=0;
async function check(name,fn){
 try{await fn();console.log("PASS",name)}
 catch(e){failed++;console.error("FAIL",name,e instanceof Error?e.message:"unexpected error")}
}
async function request(path,options={}){
 const response=await fetch(new URL(path,origin),{...options,signal:AbortSignal.timeout(12000),redirect:"manual"});
 return response;
}
await check("liveness",async()=>{
 const r=await request("/api/health");assert.equal(r.status,200);
 const body=await r.json();assert.equal(body.status,"ok");assert.equal(body.service,"visiora");
});
await check("readiness shape",async()=>{
 const r=await request("/api/ready");assert.ok([200,503].includes(r.status));
 const body=await r.json();assert.ok(["ready","configuration_required"].includes(body.status));
 if(process.env.VISIORA_EXPECT_READY==="true")assert.equal(r.status,200);
});
for(const path of ["/api/style","/api/photo-style"]){
 await check(`anonymous ${path} denied`,async()=>{
  const r=await request(path,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({goal:"Everyday confidence",preferences:"Neutral colors"})});
  assert.equal(r.status,401);
 });
}
await check("no arbitrary redirects on health",async()=>{
 const r=await request("/api/health");assert.equal(r.status,200);
});
console.log(failed===0?"Staging smoke checks passed.":"Staging smoke checks failed.");
process.exitCode=failed?1:0;
