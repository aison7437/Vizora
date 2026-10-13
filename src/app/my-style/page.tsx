"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import {getSupabase} from "@/lib/supabase";
type Result={occasion:string;styleDNA:{preferredColors:string[];avoidColors:string[];notes:string;wardrobeItemCount:number};wardrobeRemix:{outfit:{id:string;name:string;category:string;color:string}[];complete:boolean;missingCategories:string[]};budget:{currency:string;maximum:number;estimatedSpend:number;verifiedRetailPrices:boolean};budgetGuidance:string;transparency:string};
export default function MyStyle(){
 const [occasion,setOccasion]=useState("everyday");
 const [budget,setBudget]=useState("2500");
 const [result,setResult]=useState<Result|null>(null);
 const [error,setError]=useState("");
 const [busy,setBusy]=useState(false);
 const [signedIn,setSignedIn]=useState(false);
 const [ready,setReady]=useState(false);
 useEffect(()=>{let active=true;const client=getSupabase();if(!client){setReady(true);return}client.auth.getUser().then(({data})=>{if(active){setSignedIn(Boolean(data.user));setReady(true)}});return()=>{active=false}},[]);
 async function explore(){
  setBusy(true);setError("");setResult(null);
  try{
   const client=getSupabase();if(!client)throw new Error("Account services are not configured.");
   const {data:{session}}=await client.auth.getSession();
   if(!session?.access_token){setSignedIn(false);throw new Error("Please sign in to explore your private wardrobe.")}
   const response=await fetch(`/api/style-intelligence?occasion=${encodeURIComponent(occasion)}&budget=${encodeURIComponent(budget)}`,{headers:{Authorization:`Bearer ${session.access_token}`},cache:"no-store"});
   const data=await response.json();if(!response.ok)throw new Error(data.error??"Could not load your style.");
   setResult(data as Result);
  }catch(e){setError(e instanceof Error?e.message:"Unable to load your style.")}finally{setBusy(false)}
 }
 return <main className="account-page"><div className="account-shell" style={{maxWidth:780}}><Link href="/" className="brand"><span className="brand-mark">✦</span> VISIORA</Link><h1>Your personal style studio</h1><p>Remix your saved wardrobe, discover your Style DNA and keep spending within your chosen budget. No new photos required.</p>
 {!ready?<p role="status">Checking your account…</p>:!signedIn?<p role="status">Sign in to access your private wardrobe. <Link href="/account">Go to account →</Link></p>:<><form onSubmit={e=>{e.preventDefault();void explore()}}><label htmlFor="occasion">Style for</label><select id="occasion" value={occasion} onChange={e=>setOccasion(e.target.value)}><option value="everyday">Everyday</option><option value="work">Work</option><option value="date">Date night</option><option value="event">Special event</option></select><label htmlFor="budget">Maximum shopping budget (KSh)</label><input id="budget" type="number" min="0" max="9999999" step="1" required value={budget} onChange={e=>setBudget(e.target.value)}/><button disabled={busy} type="submit">{busy?"Preparing your look…":"Remix my wardrobe"}</button></form>{error&&<p role="alert" className="account-alert">{error}</p>}{result&&<section aria-live="polite"><h2>Your Style DNA</h2><p>Saved wardrobe items: {result.styleDNA.wardrobeItemCount}</p><p>Favorite colors: {result.styleDNA.preferredColors.join(", ")||"Not set"}</p><p>Colors to avoid: {result.styleDNA.avoidColors.join(", ")||"None saved"}</p><h2>Your wardrobe remix</h2>{result.wardrobeRemix.outfit.length?<ul>{result.wardrobeRemix.outfit.map(item=><li key={item.id}>{item.name} — {item.category}{item.color?` · ${item.color}`:""}</li>)}</ul>:<p>No matching wardrobe pieces yet. Add items through your saved wardrobe tools.</p>}<p>{result.wardrobeRemix.complete?"Your outfit has the essential categories.":`Missing essentials: ${result.wardrobeRemix.missingCategories.join(", ")}`}</p><h2>Smart Style Budget</h2><p>Maximum: KSh {result.budget.maximum.toLocaleString("en-KE")}. No purchases recommended automatically.</p><p>{result.budgetGuidance}</p><small>{result.transparency}</small></section>}</>}<p><Link href="/account">Manage account →</Link></p><p><Link href="/">← Back to VISIORA</Link></p></div></main>;
}
