"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";
export default function Stylist(){
  const [goal,setGoal]=useState("Everyday confidence");
  const [preferences,setPreferences]=useState("");
  const [result,setResult]=useState("");
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  async function submit(e:FormEvent){
    e.preventDefault();setBusy(true);setResult("");setError("");
    try {
      const supabase=getSupabase();
      if(!supabase)throw new Error("Account services are not configured.");
      const {data:{session}}=await supabase.auth.getSession();
      if(!session)throw new Error("Please sign in before requesting AI styling.");
      const response=await fetch("/api/style",{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${session.access_token}`},body:JSON.stringify({goal,preferences})});
      const payload=await response.json();
      if(!response.ok)throw new Error(payload.error||"Unable to generate advice.");
      setResult(payload.suggestion);
    }catch(err){setError(err instanceof Error?err.message:"Unable to generate advice.");}
    finally{setBusy(false);}
  }
  return <main className="account-page"><div className="account-shell"><Link className="brand" href="/">✦ VISIORA</Link><h1>AI Style Advisor</h1><p>Get styling suggestions based on what you tell us. No photo analysis is performed.</p><form onSubmit={submit}><label htmlFor="stylist-goal">Your goal</label><select id="stylist-goal" value={goal} onChange={e=>setGoal(e.target.value)}><option>Everyday confidence</option><option>Work & professional</option><option>Date night</option><option>Special event</option></select><label htmlFor="preferences">Style preferences (optional)</label><textarea id="preferences" maxLength={500} rows={5} value={preferences} onChange={e=>setPreferences(e.target.value)} placeholder="Colors you like, clothing budget, climate, preferred style..."/><button type="submit" disabled={busy}>{busy?"Creating suggestions…":"Get my suggestions"}</button></form>{error&&<p role="alert" className="account-alert">{error}</p>}{result&&<section aria-live="polite" className="account-alert"><h2 style={{fontSize:26}}>Your suggestions</h2><p style={{whiteSpace:"pre-wrap"}}>{result}</p></section>}<Link href="/account">Manage account</Link></div></main>;
}
