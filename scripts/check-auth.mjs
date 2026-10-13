import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const page=readFileSync("src/app/account/page.tsx","utf8");
for(const marker of ['signInWithOAuth','signInWithOtp','verifyOtp','"google"','"apple"','"phone"','"email"','Sign out','onAuthStateChange'])assert.ok(page.includes(marker),marker);
assert.match(page,/^\s*if\(target==="phone"&&/m);
assert.doesNotMatch(page,/service_role|SUPABASE_SERVICE_ROLE/);
console.log("PASS V3.6 auth provider and OTP UI contracts");
