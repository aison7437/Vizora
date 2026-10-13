"use client";
import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
export default function Account() {
  const [user,setUser] = useState<User|null>(null);
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [name,setName] = useState("");
  const [styleGoal,setStyleGoal] = useState("Everyday confidence");
  const [mode,setMode] = useState<"sign-in"|"sign-up">("sign-up");
  const [message,setMessage] = useState("");
  const [busy,setBusy] = useState(false);
  const supabase = getSupabase();
  useEffect(()=>{
    if(!supabase) return;
    let active = true;
    supabase.auth.getUser().then(({data})=>{if(active)setUser(data.user)});
    const {data:{subscription}} = supabase.auth.onAuthStateChange((_event,session)=>{if(active)setUser(session?.user??null)});
    return ()=>{active=false;subscription.unsubscribe()};
  },[supabase]);
  useEffect(()=>{
    if(!supabase||!user)return;
    let active=true;
    supabase.from("profiles").select("display_name,style_goal").eq("id",user.id).maybeSingle().then(({data})=>{if(active&&data){setName(data.display_name??"");setStyleGoal(data.style_goal??"Everyday confidence")}});
    return ()=>{active=false};
  },[supabase,user]);
  async function authenticate(e:FormEvent){
    e.preventDefault();if(!supabase)return;setBusy(true);setMessage("");
    const result = mode==="sign-up"?await supabase.auth.signUp({email,password}):await supabase.auth.signInWithPassword({email,password});
    setBusy(false);setMessage(result.error?.message??(mode==="sign-up"?"Check your inbox to confirm your email if confirmation is enabled.":"Signed in."));
  }
  async function save(e:FormEvent){
    e.preventDefault();if(!supabase||!user)return;setBusy(true);setMessage("");
    const {error}=await supabase.from("profiles").upsert({id:user.id,display_name:name.trim().slice(0,100),style_goal:styleGoal,updated_at:new Date().toISOString()},{onConflict:"id"});
    setBusy(false);setMessage(error?.message??"Your preferences have been saved.");
  }
  return <main className="account-page"><div className="account-shell"><Link href="/" className="brand"><span className="brand-mark">✦</span> VISIORA</Link><h1>Your style, your space.</h1><p>Build a personal style profile. Your photos are not uploaded here.</p>{!supabase?<div role="alert" className="account-alert">Account services are not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY and apply the database migration.</div>:user?<><p>Signed in as <strong>{user.email}</strong></p><form onSubmit={save}><label htmlFor="name">Display name</label><input id="name" value={name} maxLength={100} onChange={e=>setName(e.target.value)}/><label htmlFor="style-goal">Style goal</label><select id="style-goal" value={styleGoal} onChange={e=>setStyleGoal(e.target.value)}><option>Everyday confidence</option><option>Work & professional</option><option>Date night</option><option>Special event</option></select><button disabled={busy} type="submit">Save profile</button></form><button className="secondary-action" onClick={async()=>{await supabase.auth.signOut();setMessage("Signed out.")}}>Sign out</button></>:<><div className="account-switch"><button type="button" aria-pressed={mode==="sign-up"} onClick={()=>setMode("sign-up")}>Create account</button><button type="button" aria-pressed={mode==="sign-in"} onClick={()=>setMode("sign-in")}>Sign in</button></div><form onSubmit={authenticate}><label htmlFor="email">Email</label><input id="email" type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)}/><label htmlFor="password">Password</label><input id="password" type="password" required minLength={8} autoComplete={mode==="sign-up"?"new-password":"current-password"} value={password} onChange={e=>setPassword(e.target.value)}/><button disabled={busy} type="submit">{busy?"Please wait…":mode==="sign-up"?"Create account":"Sign in"}</button></form></>}{message&&<p role="status" className="account-alert">{message}</p>}<Link href="/">← Back to studio</Link></div></main>;
}
