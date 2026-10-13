"use client";
import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
export default function Account() {
  const [user,setUser] = useState<User|null>(null);
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [phone,setPhone] = useState("");
  const [otp,setOtp] = useState("");
  const [otpTarget,setOtpTarget] = useState<"email"|"phone"|null>(null);
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
  async function social(provider:"google"|"apple"){
    if(!supabase)return;setBusy(true);setMessage("");
    const {error}=await supabase.auth.signInWithOAuth({provider,options:{redirectTo:window.location.origin+"/account"}});
    if(error){setMessage(error.message);setBusy(false)}
  }
  async function sendCode(target:"email"|"phone"){
    if(!supabase)return;setBusy(true);setMessage("");
    const value=target==="email"?email.trim():phone.trim();
    if(target==="email"&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)){setMessage("Enter a valid email.");setBusy(false);return}
    if(target==="phone"&&!/^\+[1-9]\d{7,14}$/.test(value)){setMessage("Use international format, e.g. +2547XXXXXXXX.");setBusy(false);return}
    const {error}=await supabase.auth.signInWithOtp(target==="email"?{email:value,options:{shouldCreateUser:true}}:{phone:value,options:{shouldCreateUser:true}});
    setBusy(false);if(error){setMessage(error.message);return}
    setOtpTarget(target);setMessage("If supported by your configured provider, a verification code has been sent.");
  }
  async function verifyCode(e:FormEvent){
    e.preventDefault();if(!supabase||!otpTarget)return;setBusy(true);setMessage("");
    const result=await supabase.auth.verifyOtp(otpTarget==="email"?{email:email.trim(),token:otp.trim(),type:"email"}:{phone:phone.trim(),token:otp.trim(),type:"sms"});
    setBusy(false);setMessage(result.error?.message??"Verification successful.");if(!result.error){setOtpTarget(null);setOtp("")}
  }
  async function save(e:FormEvent){
    e.preventDefault();if(!supabase||!user)return;setBusy(true);setMessage("");
    const {error}=await supabase.from("profiles").upsert({id:user.id,display_name:name.trim().slice(0,100),style_goal:styleGoal,updated_at:new Date().toISOString()},{onConflict:"id"});
    setBusy(false);setMessage(error?.message??"Your preferences have been saved.");
  }
  return <main className="account-page"><div className="account-shell"><Link href="/" className="brand"><span className="brand-mark">✦</span> VISIORA</Link><h1>Your style, your space.</h1><p>Build a personal style profile. Your photos are not uploaded here.</p>{!supabase?<div role="alert" className="account-alert">Account services are not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY and apply the database migration.</div>:user?<><p>Signed in as <strong>{user.email}</strong></p><form onSubmit={save}><label htmlFor="name">Display name</label><input id="name" value={name} maxLength={100} onChange={e=>setName(e.target.value)}/><label htmlFor="style-goal">Style goal</label><select id="style-goal" value={styleGoal} onChange={e=>setStyleGoal(e.target.value)}><option>Everyday confidence</option><option>Work & professional</option><option>Date night</option><option>Special event</option></select><button disabled={busy} type="submit">Save profile</button></form><button className="secondary-action" onClick={async()=>{await supabase.auth.signOut();setMessage("Signed out.")}}>Sign out</button></>:<><div className="auth-providers"><button disabled={busy} type="button" onClick={()=>social("google")}>Continue with Google</button><button disabled={busy} type="button" onClick={()=>social("apple")}>Continue with Apple</button></div><p className="auth-divider">Or use email / phone</p><div className="auth-otp"><label htmlFor="otp-email">Email address</label><input id="otp-email" type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)}/><button disabled={busy} type="button" onClick={()=>sendCode("email")}>Email me a code</button><label htmlFor="otp-phone">Phone number (international format)</label><input id="otp-phone" type="tel" autoComplete="tel" placeholder="+2547XXXXXXXX" value={phone} onChange={e=>setPhone(e.target.value)}/><button disabled={busy} type="button" onClick={()=>sendCode("phone")}>Text me a code</button></div>{otpTarget&&<form onSubmit={verifyCode}><label htmlFor="otp-code">Verification code sent to {otpTarget}</label><input id="otp-code" autoComplete="one-time-code" inputMode="numeric" required value={otp} onChange={e=>setOtp(e.target.value)}/><button disabled={busy} type="submit">Verify and continue</button></form>}<p className="auth-divider">Or use a password</p><div className="account-switch"><button type="button" aria-pressed={mode==="sign-up"} onClick={()=>setMode("sign-up")}>Create account</button><button type="button" aria-pressed={mode==="sign-in"} onClick={()=>setMode("sign-in")}>Sign in</button></div><form onSubmit={authenticate}><label htmlFor="email">Email</label><input id="email" type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)}/><label htmlFor="password">Password</label><input id="password" type="password" required minLength={8} autoComplete={mode==="sign-up"?"new-password":"current-password"} value={password} onChange={e=>setPassword(e.target.value)}/><button disabled={busy} type="submit">{busy?"Please wait…":mode==="sign-up"?"Create account":"Sign in"}</button></form></>}{message&&<p role="status" className="account-alert">{message}</p>}<Link href="/">← Back to studio</Link></div></main>;
}
