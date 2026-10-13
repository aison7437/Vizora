import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const source=readFileSync("src/app/api/journey/route.ts","utf8");
for(const requirement of ["getSupabaseServerUser","getEntitlement","photo_consents","planJourney","Cache-Control","execution:\"not-started\""])assert.ok(source.includes(requirement),requirement);
assert.doesNotMatch(source,/input\.photoConsent|input\.verifiedPaid/);
assert.match(source,/if\(error\)return NextResponse\.json/);
console.log("PASS authenticated journey static boundary checks");
