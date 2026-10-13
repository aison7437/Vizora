import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const sql=readFileSync("supabase/migrations/20261016_wardrobe_preferences.sql","utf8");
for(const table of ["visiora_style_preferences","visiora_wardrobe_items"]){
 assert.match(sql,new RegExp("alter table public\\."+table+" enable row level security"));
 assert.match(sql,new RegExp("revoke all on public\\."+table+" from anon,authenticated"));
}
for(const op of ["select","insert","update","delete"])assert.equal([...sql.matchAll(new RegExp("for "+op+" to authenticated","g"))].length,2);
for(const file of ["src/app/api/wardrobe/route.ts","src/app/api/style-preferences/route.ts"]){
 const s=readFileSync(file,"utf8");assert.match(s,/wardrobeContext/);assert.match(s,/Cache-Control/);
}
assert.match(readFileSync("src/app/api/wardrobe/route.ts","utf8"),/\.eq\("user_id",context\.userId\)/);
console.log("PASS V3.4 wardrobe/preference schema and owner boundary static checks");
