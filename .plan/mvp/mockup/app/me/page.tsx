"use client";
import Link from "next/link";
import { useState } from "react";
import "./me.css";
import Page from "@/components/Page";
import Avatar from "@/components/Avatar";
import { useToast } from "@/components/Toast";
import { Eye } from "@/components/Icons";
import { club, me, positionsFor, positionLabel } from "@/lib/data";
const visibilities = [["public", "Public", "Anyone with your card link can see it, and signed-in members can find you in the directory."], ["card-only", "Card only", "Only people who tap your card or have the link. Hidden from the directory."], ["inactive", "Inactive", "Your link shows a neutral page. Nothing is deleted; you can switch back."]] as const;
export default function Me() {
  const toast = useToast(); const [vis, setVis] = useState(me.visibility); const [busy, setBusy] = useState(false); const [dirty, setDirty] = useState(false); const pos = positionsFor(me.id);
  const save = (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); setBusy(true); setTimeout(() => { setBusy(false); setDirty(false); toast("Profile saved"); }, 700); };
  const status = <span className={dirty ? "status status-warning" : "status status-muted"} aria-live="polite">{dirty ? "Unsaved changes" : "All changes saved"}</span>;
  return (<Page>
    <div className="me">
      <header className="me-head">
        <div className="who">
          <p className="signed">Signed in as <span className="mono">{me.email}</span></p>
          <h1>Your profile</h1>
          <p className="lead">This is what a tap of your card shows. Keep it current.</p>
          <p className="me-url"><span>Card URL</span><span className="mono">https://{club.domain}/p/{me.canonicalId}</span><span>Permanent. <span className="mono">/@{me.handle}</span> redirects here.</span></p>
        </div>
        <div className="me-actions">
          {status}
          <Link href={`/p/${me.canonicalId}`} className="btn btn-secondary"><Eye width={16} height={16} /> Preview</Link>
          <button form="profile-form" className={`btn btn-primary ${busy ? "is-busy" : ""}`} disabled={busy || !dirty} aria-busy={busy}>Save profile</button>
        </div>
      </header>
      <form id="profile-form" className="form-sheet" onChange={() => setDirty(true)} onSubmit={save}>
        <section className="fs" aria-labelledby="h-identity">
          <h2 id="h-identity">Identity</h2>
          <div className="grid grid-2">
            <div className="field"><label htmlFor="name">Display name</label><input id="name" className="input" defaultValue={me.displayName} /></div>
            <div className="field"><label htmlFor="handle">Handle</label><div style={{ position: "relative" }}><span style={{ position: "absolute", left: 14, top: 12, color: "var(--fg-faint)" }}>@</span><input id="handle" className="input" style={{ paddingLeft: 30 }} defaultValue={me.handle} /></div><span className="help">Changeable. Your card URL never changes.</span></div>
            <div className="field"><label htmlFor="headline">Headline</label><input id="headline" className="input" defaultValue={me.headline} /><span className="help">Course and year, or whatever people should see first.</span></div>
            <div className="field"><label>Position</label><div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap", paddingTop: ".4rem" }}>{pos.map((p) => <span key={p.title} className="badge">{positionLabel(p)}</span>)}</div><span className="help">Set by the club for the current term.</span></div>
          </div>
          <div className="field"><label htmlFor="bio">Bio</label><textarea id="bio" className="textarea" defaultValue={me.bio} maxLength={400} /><span className="help">Up to 400 characters.</span></div>
          <div className="field"><label>Photo</label><div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}><Avatar name={me.displayName} size="lg" /><button type="button" className="btn btn-secondary btn-sm" onClick={() => toast("Photo upload is mocked")}>Upload photo</button><span className="help" style={{ flexBasis: "100%" }}>JPG, PNG, or WebP up to 2 MB. We resize it to 512px.</span></div></div>
        </section>
        <section className="fs" aria-labelledby="h-links">
          <h2 id="h-links">Links</h2>
          <div className="grid grid-2">
            {[["LinkedIn", "linkedinUrl"], ["Facebook", "facebookUrl"], ["GitHub", "githubUrl"], ["Website", "websiteUrl"]].map(([label, key]) => <div className="field" key={key}><label htmlFor={key}>{label}</label><input id={key} className="input" type="url" defaultValue={(me as unknown as Record<string, string>)[key] ?? ""} placeholder="https://" /></div>)}
          </div>
        </section>
        <section className="fs" aria-labelledby="h-contact">
          <h2 id="h-contact">Save-contact fields <small>Optional. Only in the vCard.</small></h2>
          <div className="grid grid-2">
            <div className="field"><label htmlFor="cemail">Contact email</label><input id="cemail" className="input" type="email" defaultValue={me.contactEmail ?? ""} /><span className="help">Different from your login email. Leave empty to omit.</span></div>
            <div className="field"><label htmlFor="cphone">Phone</label><input id="cphone" className="input" type="tel" placeholder="+63 9xx xxx xxxx" /></div>
          </div>
        </section>
        <section className="fs" aria-labelledby="h-vis">
          <h2 id="h-vis">Visibility</h2>
          <div role="radiogroup" aria-labelledby="h-vis" style={{ display: "grid", gap: ".75rem" }}>
            {visibilities.map(([v, l, d]) => <label key={v} className={`choice ${vis === v ? "is-on" : ""}`}><input type="radio" name="vis" checked={vis === v} onChange={() => setVis(v)} /><span><b>{l}</b><span>{d}</span></span></label>)}
          </div>
        </section>
        <div className="me-foot"><button className={`btn btn-primary ${busy ? "is-busy" : ""}`} disabled={busy || !dirty} aria-busy={busy}>Save profile</button>{status}</div>
      </form>
    </div>
  </Page>);
}
