#!/usr/bin/env node
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
const required=["NEXT_PUBLIC_SUPABASE_URL","NEXT_PUBLIC_SUPABASE_ANON_KEY","OPENAI_API_KEY"];
const envExample=readFileSync(".env.example","utf8");
for(const key of required)assert.match(envExample,new RegExp("^"+key+"=","m"),"Missing example variable "+key);
assert.ok(!envExample.includes("sk-proj-"),"Never include API secrets in example config");
for(const file of ["src/app/api/health/route.ts","src/app/api/ready/route.ts","scripts/staging-smoke.mjs","docs/v1-5-acceptance.md"]){assert.ok(existsSync(file),"Missing deployment prerequisite "+file);}
const workflow=readFileSync(".github/workflows/staging-smoke.yml","utf8");
assert.match(workflow,/VISIORA_STAGING_URL/);
assert.match(workflow,/workflow_dispatch/);
console.log("PASS deployment contract checks (static only)");
