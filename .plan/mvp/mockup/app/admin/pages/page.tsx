"use client";
import { useToast } from "@/components/Toast";
import { club, departments } from "@/lib/data";
export default function AdminPages() {
  const toast = useToast();
  const slots = [{ slug: "about", body: club.about }, { slug: "mission", body: club.mission }, { slug: "join", body: "Membership is free. You need a laptop, a PLMUN email, and a problem you want to solve." }, ...departments.map((d) => ({ slug: `department:${d.slug}`, body: d.description }))];
  return (<>
    <div className="admin-head"><div><span className="eyebrow">Markdown slots</span><h1>Pages</h1></div></div>
    <div className="grid grid-2">{slots.map((s) => <form key={s.slug} className="card" style={{ display: "flex", flexDirection: "column", gap: ".75rem" }} onSubmit={(e) => { e.preventDefault(); toast(`Saved ${s.slug}`); }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span className="mono" style={{ color: "var(--fg)" }}>{s.slug}</span><span className="faint">edited 01 Oct by Kiko Ramirez</span></div><textarea className="textarea" defaultValue={s.body} style={{ minHeight: 140, fontFamily: "var(--font-mono)", fontSize: ".8rem" }} /><div><button className="btn btn-primary btn-sm">Save</button></div></form>)}</div>
  </>);
}
