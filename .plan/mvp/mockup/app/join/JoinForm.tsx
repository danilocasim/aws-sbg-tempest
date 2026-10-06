"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { useToast } from "@/components/Toast";
import { Check } from "@/components/Icons";
export type Receipt = { fullName: string; email: string; course: string; year: string };
type Values = Receipt & { motivation: string; consent: boolean };
type Key = keyof Values;
const courses = ["BS Computer Science", "BS Information Technology", "BS Multimedia Arts", "BS Business Administration", "BS Accountancy", "Other"];
const years = ["1st year", "2nd year", "3rd year", "4th year"];
const MIN = 40, MAX = 1000;
const validate = (v: Values) => {
  const e: Partial<Record<Key, string>> = {};
  if (!v.fullName.trim()) e.fullName = "Enter your full name.";
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.email.trim())) e.email = "Enter a valid email address.";
  if (!v.course) e.course = "Select your course.";
  if (v.motivation.trim().length < MIN) e.motivation = `A little more, please. At least ${MIN} characters.`;
  if (!v.consent) e.consent = "We need your consent to process the application.";
  return e;
};
/** Validates on blur, clears as you type, locks the button width while sending, and hands a receipt up on success. */
export default function JoinForm({ closes, receipt, onDone }: { closes: string; receipt: Receipt | null; onDone: (r: Receipt) => void }) {
  const toast = useToast(); const form = useRef<HTMLFormElement>(null);
  const [v, setV] = useState<Values>({ fullName: "", email: "", course: "", year: years[0], motivation: "", consent: false });
  const [touched, setTouched] = useState<Partial<Record<Key, boolean>>>({}); const [tried, setTried] = useState(false); const [busy, setBusy] = useState(false);
  const errors = validate(v); const show = (k: Key) => (touched[k] || tried ? errors[k] : undefined);
  const set = (k: Key) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setV((p) => ({ ...p, [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value }));
  const a = (k: Key) => ({ "aria-invalid": show(k) ? true : undefined, "aria-describedby": `${k}-msg`, onBlur: () => setTouched((p) => ({ ...p, [k]: true })) });
  const grow = (el: HTMLTextAreaElement) => { el.style.height = "auto"; el.style.height = el.scrollHeight + "px"; };
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setTried(true);
    const first = (Object.keys(errors) as Key[])[0];
    if (first) { form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus(); return; }
    // Deliberately no "already a member" branch: a public form must not reveal who is a member (ADR-0006). Duplicates are handled in admin.
    setBusy(true); setTimeout(() => { setBusy(false); toast("Application received"); onDone({ fullName: v.fullName.trim(), email: v.email.trim(), course: v.course, year: v.year }); }, 900);
  };
  const plmun = /@plmun\.edu\.ph$/i.test(v.email.trim()); const len = v.motivation.length;

  if (receipt) return (<div className="form-sheet done" aria-live="polite">
    <span className="status status-success pop"><Check width={16} height={16} strokeWidth={2.5} /> Application received</span>
    <h2>Thanks, {receipt.fullName.split(" ")[0]}. Check your inbox.</h2>
    <p className="muted">We sent a confirmation to <span className="mono" style={{ color: "var(--fg)" }}>{receipt.email}</span>. Directors review after the window closes on {closes}. You&apos;ll hear from us either way.</p>
    <dl className="receipt"><dt>Name</dt><dd>{receipt.fullName}</dd><dt>Course</dt><dd>{receipt.course} · {receipt.year}</dd></dl>
    <p className="faint" style={{ fontSize: "var(--fs-small)" }}>If this email already belongs to a member, we&apos;ll send a sign-in link instead.</p>
    <div className="row" style={{ flexWrap: "wrap", gap: ".75rem", marginTop: ".5rem" }}><Link href="/events" className="btn btn-secondary">See upcoming events</Link><Link href="/" className="btn btn-ghost">Back to home</Link></div>
  </div>);

  return (<form ref={form} className="form-sheet" onSubmit={submit} noValidate>
    <div className="grid grid-2">
      <div className="field"><label htmlFor="fullName">Full name</label><input id="fullName" name="fullName" className={`input ${show("fullName") ? "is-error" : ""}`} autoComplete="name" value={v.fullName} onChange={set("fullName")} {...a("fullName")} /><span id="fullName-msg" className="error">{show("fullName") ?? ""}</span></div>
      <div className="field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" inputMode="email" className={`input ${show("email") ? "is-error" : ""}`} autoComplete="email" placeholder="you@plmun.edu.ph" value={v.email} onChange={set("email")} {...a("email")} /><span id="email-msg" className={show("email") ? "error" : "help is-good"}>{show("email") ?? (plmun ? "PLMUN email. Fastest to verify." : "")}</span></div>
      <div className="field"><label htmlFor="course">Course</label><select id="course" name="course" className={`select ${show("course") ? "is-error" : ""}`} value={v.course} onChange={set("course")} {...a("course")}><option value="" disabled>Select your course</option>{courses.map((c) => <option key={c}>{c}</option>)}</select><span id="course-msg" className={show("course") ? "error" : "help"}>{show("course") ?? ""}</span></div>
      <div className="field"><label htmlFor="year">Year level</label><select id="year" name="year" className="select" value={v.year} onChange={set("year")}>{years.map((y) => <option key={y}>{y}</option>)}</select></div>
    </div>
    <div className="field">
      <label htmlFor="motivation">Why do you want to join Tempest?</label>
      <div className="textarea-wrap"><textarea id="motivation" name="motivation" className={`textarea ${show("motivation") ? "is-error" : ""}`} rows={4} maxLength={MAX} placeholder="What do you want to build, learn, or be part of?" value={v.motivation} onChange={(e) => { set("motivation")(e); grow(e.target); }} onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") form.current?.requestSubmit(); }} {...a("motivation")} /><span className={`counter ${len > MAX - 100 ? "is-warn" : ""}`} aria-live="polite">{len} / {MAX}</span></div>
      <span id="motivation-msg" className="error">{show("motivation") ?? ""}</span>
    </div>
    <div className="form-sheet-foot">
      <div className="field"><label className="check"><input type="checkbox" name="consent" checked={v.consent} onChange={set("consent")} {...a("consent")} /><span>I consent to Tempest storing this application and contacting me about it. <Link href="/privacy" className="link" style={{ textDecoration: "underline" }}>Privacy notice</Link>.</span></label><span id="consent-msg" className="error">{show("consent") ?? ""}</span></div>
      <div><button className={`btn btn-primary ${busy ? "is-busy" : ""}`} disabled={busy} aria-busy={busy}>Submit application</button></div>
    </div>
  </form>);
}
