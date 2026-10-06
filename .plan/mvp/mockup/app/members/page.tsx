"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import Page from "@/components/Page";
import Avatar from "@/components/Avatar";
import { Search } from "@/components/Icons";
import { departments, members, positionsFor, positionLabel } from "@/lib/data";
export default function Directory() {
  const [q, setQ] = useState(""); const [dept, setDept] = useState<string | null>(null); const search = useRef<HTMLInputElement>(null);
  useEffect(() => { const k = (e: KeyboardEvent) => { if (e.key === "/" && !(e.target as HTMLElement).closest("input,textarea")) { e.preventDefault(); search.current?.focus(); } }; addEventListener("keydown", k); return () => removeEventListener("keydown", k); }, []);
  const list = useMemo(() => members.filter((m) => m.visibility === "public").filter((m) => !q || (m.displayName + " " + m.headline).toLowerCase().includes(q.toLowerCase())).filter((m) => !dept || positionsFor(m.id).some((p) => p.department === dept)), [q, dept]);
  return (<Page>
    <div className="section-head"><span className="eyebrow">Members only</span><h1>Directory</h1><p>Everyone who chose to be listed. Tap a card to open a profile, same as the NFC card would.</p></div>
    <div style={{ display: "flex", flexWrap: "wrap", gap: ".75rem", alignItems: "center", marginBottom: "1.5rem" }}>
      <div style={{ position: "relative", flex: "1 1 260px", maxWidth: 420 }}><Search style={{ position: "absolute", left: 14, top: 14, color: "var(--fg-faint)" }} /><input ref={search} className="input" style={{ paddingLeft: 44, paddingRight: 44 }} placeholder="Search name or course" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search members" /><kbd className="faint" style={{ position: "absolute", right: 12, top: 13, fontFamily: "var(--font-mono)", fontSize: ".75rem", border: "1px solid var(--border)", borderRadius: 4, padding: "1px 6px" }} aria-hidden>/</kbd></div>
      <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}><button className="chip" aria-pressed={dept === null} onClick={() => setDept(null)}>All</button>{departments.map((d) => <button key={d.slug} className="chip" aria-pressed={dept === d.slug} onClick={() => setDept(dept === d.slug ? null : d.slug)}>{d.name}</button>)}</div>
    </div>
    <p className="faint" style={{ fontSize: "var(--fs-small)", marginBottom: "1rem" }}>{list.length} of {members.filter((m) => m.visibility === "public").length} listed members</p>
    <div className="grid grid-3 list-in" data-glow key={`${q}|${dept}`}>{list.map((m, i) => { const pos = positionsFor(m.id)[0]; return (<Link key={m.id} href={`/p/${m.canonicalId}`} className="card card-interactive tilt" style={{ display: "flex", gap: "1rem", alignItems: "center", padding: "1rem 1.25rem", "--d": `${Math.min(i, 12) * 40}ms` } as React.CSSProperties}><Avatar name={m.displayName} size="lg" /><div style={{ minWidth: 0 }}><div style={{ fontWeight: 600, color: "var(--fg)" }}>{m.displayName}</div><div className="subtle" style={{ fontSize: "var(--fs-small)" }}>{m.headline}</div>{pos && <div className="role-line">{positionLabel(pos)}</div>}</div></Link>); })}</div>
    {list.length === 0 && <div className="card empty"><h3>No one matches</h3><p className="muted">Try a shorter search or clear the department filter.</p></div>}
  </Page>);
}
