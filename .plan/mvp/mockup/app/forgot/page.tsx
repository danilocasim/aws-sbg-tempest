"use client";
import Link from "next/link";
import { useState } from "react";
import AuthShell from "@/app/login/AuthShell";
import { Check, Mail } from "@/components/Icons";
export default function Forgot() {
  const [sent, setSent] = useState(false); const [email, setEmail] = useState("");
  return (<AuthShell>
    {sent ? (
      <div className="sent" aria-live="polite">
        <span className="mark"><Check width={20} height={20} strokeWidth={2.5} /></span>
        <div className="intro"><h1>Check your inbox</h1><p>If <span className="mono" style={{ color: "var(--fg)" }}>{email}</span> belongs to a member, a reset link is on its way. It works once and expires in an hour.</p></div>
        <div className="auth-alt"><Link href="/login" className="btn btn-secondary">Back to sign in</Link></div>
      </div>
    ) : (
      <form className="fields" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
        <div className="intro"><h1>Reset your password</h1><p>Enter your login email. We&apos;ll send a one-time link.</p></div>
        <div className="field"><label htmlFor="email">Email</label><input id="email" className="input" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <button className="btn btn-primary btn-block"><Mail width={18} height={18} /> Send reset link</button>
        <p className="auth-foot"><Link href="/login">Back to sign in</Link></p>
      </form>
    )}
  </AuthShell>);
}
