import Link from "next/link";
import Page from "@/components/Page";
import Reveal from "@/components/Reveal";
import Avatar from "@/components/Avatar";
import { byId, departments, positions, terms } from "@/lib/data";
import "@/app/landing.css";
export const metadata = { title: "Past officers" };
export default function Archive() {
  const past = terms.filter((t) => !t.isCurrent);
  return (<Page>
    <Reveal className="section-head"><span className="eyebrow">Archive</span><h1>Past officers</h1><p>Everyone who held a position in a previous academic year. Thank you.</p></Reveal>
    {past.map((t) => { const ps = positions.filter((p) => p.term === t.id); return (<section key={t.id} style={{ marginBottom: "3rem" }}>
      <h2 style={{ fontSize: "var(--fs-h3)", marginBottom: "1rem" }}>{t.label}</h2>
      <Reveal stagger={60} className="grid grid-4" data-glow>{ps.map((p) => { const m = byId(p.memberId); const inner = <div style={{ display: "flex", gap: ".9rem", alignItems: "center" }}><Avatar name={m.displayName} size="md" /><div><div style={{ fontWeight: 600, color: "var(--fg)" }}>{m.displayName}</div><div className="subtle" style={{ fontSize: "var(--fs-small)" }}>{p.title}{p.department ? ` · ${departments.find((d) => d.slug === p.department)?.name}` : ""}</div></div></div>; return m.visibility === "public" ? <Link key={p.memberId + p.title} href={`/p/${m.canonicalId}`} className="card card-interactive reveal" style={{ padding: "1rem" }}>{inner}</Link> : <div key={p.memberId + p.title} className="card reveal" style={{ padding: "1rem" }}>{inner}</div>; })}</Reveal>
    </section>); })}
  </Page>);
}
