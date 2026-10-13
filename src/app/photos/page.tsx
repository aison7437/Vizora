"use client";
import { useEffect,useState } from "react";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
const bucket="visiora-private";
export default function Photos(){
  const supabase=getSupabase();
  const [user,setUser]=useState<User|null>(null);
  const [consented,setConsented]=useState(false);
  const [photoPath,setPhotoPath]=useState<string|null>(null);
  const [file,setFile]=useState<File|null>(null);
  const [goal,setGoal]=useState("Everyday confidence");
  const [result,setResult]=useState("");
  const [message,setMessage]=useState("");
  const [busy,setBusy]=useState(false);
  useEffect(()=>{
    if(!supabase)return;
    let active=true;
    async function load(){
      const {data:{user:current}}=await supabase!.auth.getUser();
      if(!active||!current)return;
      setUser(current);
      const [{data:consent},{data:items}]=await Promise.all([
        supabase!.from("photo_consents").select("revoked_at").eq("user_id",current.id).maybeSingle(),
        supabase!.storage.from(bucket).list(current.id,{limit:20})
      ]);
      if(!active)return;
      setConsented(Boolean(consent&&!consent.revoked_at));
      const latest=items?.find(item=>item.name==="style-photo");
      if(latest)setPhotoPath(`${current.id}/style-photo`);
    }
    void load();return ()=>{active=false};
  },[supabase]);
  async function accept(){
    if(!supabase||!user)return;setBusy(true);setMessage("");
    const {error}=await supabase.from("photo_consents").upsert({user_id:user.id,consent_version:"v1",accepted_at:new Date().toISOString(),revoked_at:null});
    setBusy(false);if(error)setMessage(error.message);else setConsented(true);
  }
  async function upload(){
    if(!supabase||!user||!consented||!file)return;
    if(!["image/jpeg","image/png","image/webp"].includes(file.type)||file.size>5*1024*1024){setMessage("Select a JPG, PNG or WebP image up to 5 MB.");return;}
    setBusy(true);setMessage("");setResult("");
    const path=`${user.id}/style-photo`;
    const {error}=await supabase.storage.from(bucket).upload(path,file,{upsert:true,contentType:file.type,cacheControl:"0"});
    setBusy(false);if(error)setMessage(error.message);else{setPhotoPath(path);setMessage("Photo saved privately. You can delete it at any time.");setFile(null);}
  }
  async function analyze(){
    if(!supabase||!photoPath)return;setBusy(true);setMessage("");setResult("");
    try{
      const {data:{session}}=await supabase.auth.getSession();
      if(!session)throw new Error("Please sign in.");
      const response=await fetch("/api/photo-style",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${session.access_token}`},body:JSON.stringify({goal})});
      const data=await response.json();if(!response.ok)throw new Error(data.error||"Analysis unavailable.");
      setResult(data.suggestion);
    }catch(e){setMessage(e instanceof Error?e.message:"Analysis unavailable.");}finally{setBusy(false);}
  }
  async function remove(revoke=false){
    if(!supabase||!user)return;setBusy(true);setMessage("");setResult("");
    if(photoPath){const {error}=await supabase.storage.from(bucket).remove([photoPath]);if(error){setBusy(false);setMessage(error.message);return;}}
    setPhotoPath(null);
    if(revoke){
      const {error}=await supabase.from("photo_consents").update({revoked_at:new Date().toISOString()}).eq("user_id",user.id);
      if(error){setMessage("Photo deleted, but consent revocation failed: "+error.message);setBusy(false);return;}
      setConsented(false);
    }
    setMessage(revoke?"Photo deleted and consent revoked.":"Photo deleted.");setBusy(false);
  }
  return <main className="account-page"><div className="account-shell"><Link href="/" className="brand">✦ VISIORA</Link><h1>Private Photo Studio</h1><p>Optional photo-based outfit and grooming inspiration. Your photo is kept in private storage until you delete it; AI analysis sends the photo to the configured AI provider.</p>{!supabase?<p role="alert">Configure Supabase to continue.</p>:!user?<p><Link href="/account">Sign in to continue</Link>.</p>:<><label className="consent"><input type="checkbox" checked={consented} disabled={busy||consented} onChange={e=>{if(e.target.checked)void accept()}}/><span>I consent to storing one photo privately and sending it to the AI provider when I request analysis. I can delete my photo and revoke consent.</span></label>{consented&&<><label className="field-label" htmlFor="photo-upload">Choose your photo (JPG, PNG, WebP; max 5 MB)</label><input id="photo-upload" type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={e=>setFile(e.target.files?.[0]??null)}/><button className="submit" disabled={busy||!file} onClick={()=>void upload()}>Save private photo</button>{photoPath&&<><label className="field-label" htmlFor="photo-goal">Your style goal</label><select id="photo-goal" value={goal} onChange={e=>setGoal(e.target.value)}><option>Everyday confidence</option><option>Work & professional</option><option>Date night</option><option>Special event</option></select><button className="submit" disabled={busy} onClick={()=>void analyze()}>Analyze my style (3/day)</button><button className="secondary-action" disabled={busy} onClick={()=>void remove(false)}>Delete photo</button></>}<button className="secondary-action" disabled={busy} onClick={()=>void remove(true)}>Delete photo & revoke consent</button></>}{message&&<p role="status" className="account-alert">{message}</p>}{result&&<section className="account-alert" aria-live="polite"><h2 style={{fontSize:26}}>Style inspiration</h2><p style={{whiteSpace:"pre-wrap"}}>{result}</p></section>}</>}<p><Link href="/stylist">Text-only styling</Link></p></div></main>;
}
