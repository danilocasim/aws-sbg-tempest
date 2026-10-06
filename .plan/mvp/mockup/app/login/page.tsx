"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import AuthShell from "./AuthShell";
import { ArrowRight, Check, Mail } from "@/components/Icons";
type Step = "email" | "password" | "sent";
/** Identifier-first sign-in: email, then password for that email, with a one-time sign-in link as the alternative. */
export default function Login() {
  const r = useRouter();
  const [step, setStep] = useState<Step>("email"); const [email, setEmail] = useState(""); const [pw, setPw] = useState(""); const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  const pwRef = useRef<HTMLInputElement>(null); const emailRef = useRef<HTMLInputElement>(null);
  useEffect(() => { if (step === "password") pwRef.current?.focus(); if (step === "email") emailRef.current?.focus(); }, [step]);
  const valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim());
  const next = (e: React.FormEvent) => { e.preventDefault(); if (!valid) { setErr("Enter the email you signed up with."); return; } setErr(""); setStep("password"); };
  const signIn = (e: React.FormEvent) => { e.preventDefault(); if (!pw) { setErr("Enter your password."); return; } setErr(""); setBusy(true); setTimeout(() => r.push("/me"), 700); };
  const sendLink = () => { setBusy(true); setTimeout(() => { setBusy(false); setStep("sent"); }, 600); };
  return (<AuthShell>
    {step === "sent" ? (
      <div className="sent" aria-live="polite">
        <span className="mark"><Check width={20} height={20} strokeWidth={2.5} /></span>
        <div className="intro"><h1>Check your inbox</h1><p>If <span className="mono" style={{ color: "var(--fg)" }}>{email}</span> belongs to a member, a sign-in link is on its way. It works once and expires in 15 minutes.</p></div>
        <div className="auth-alt"><button type="button" className="btn btn-secondary" onClick={() => setStep("password")}>Use a password instead</button></div>
      </div>
    ) : (
      <form className="fields" onSubmit={step === "email" ? next : signIn} noValidate>
        <div className="intro"><h1>{step === "email" ? "Sign in" : "Welcome back"}</h1><p>{step === "email" ? "Members only. Use the email on your membership." : "Enter your password to continue."}</p></div>
        {step === "email" ? (
          <div className="field step" key="email"><label htmlFor="email">Email</label><input ref={emailRef} id="email" className={`input ${err ? "is-error" : ""}`} type="email" inputMode="email" autoComplete="username" placeholder="you@plmun.edu.ph" value={email} onChange={(e) => { setEmail(e.target.value); setErr(""); }} aria-invalid={err ? true : undefined} aria-describedby="email-msg" /><span id="email-msg" className="error">{err}</span></div>
        ) : (
          <div className="fields step" key="password">
            <div className="ident"><span>{email}</span><button type="button" className="btn btn-ghost btn-sm" onClick={() => { setStep("email"); setErr(""); }}>Change</button></div>
            <div className="field"><div className="field-head"><label htmlFor="pw">Password</label><Link href="/forgot">Forgot password?</Link></div><div className="pw"><input ref={pwRef} id="pw" className={`input ${err ? "is-error" : ""}`} type={showPw ? "text" : "password"} autoComplete="current-password" value={pw} onChange={(e) => { setPw(e.target.value); setErr(""); }} aria-invalid={err ? true : undefined} aria-describedby="pw-msg" /><button type="button" className="toggle" onClick={() => setShowPw((s) => !s)} aria-pressed={showPw}>{showPw ? "Hide" : "Show"}</button></div><span id="pw-msg" className="error">{err}</span></div>
          </div>
        )}
        <button className={`btn btn-primary btn-block ${busy ? "is-busy" : ""}`} disabled={busy} aria-busy={busy}>{step === "email" ? <>Continue <ArrowRight className="arrow" /></> : "Sign in"}</button>
        {step === "password" && <div className="auth-alt"><span className="or">or</span><button type="button" className="btn btn-secondary btn-block" onClick={sendLink} disabled={busy}><Mail width={18} height={18} /> Email me a sign-in link</button></div>}
        <p className="auth-foot">Not a member yet? <Link href="/join">Apply for membership</Link>. Applications are free.</p>
      </form>
    )}
  </AuthShell>);
}
