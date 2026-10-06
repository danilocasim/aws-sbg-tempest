import Avatar from "@/components/Avatar";
import { byId, departments, positions, terms } from "@/lib/data";
export default function AdminTerms() {
  return (<>
    <div className="admin-head"><div><span className="eyebrow">Roles are positions held per term</span><h1>Terms &amp; positions</h1></div><button className="btn btn-secondary btn-sm">New term</button></div>
    {terms.map((t) => <div key={t.id} className="card" style={{ marginBottom: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: ".5rem" }}><h2 style={{ fontSize: "1.125rem" }}>{t.label} {t.isCurrent && <span className="badge badge-sm" style={{ marginLeft: ".5rem" }}>Current</span>}</h2><span className="faint">{t.startsOn} → {t.endsOn}</span></div>
      <div className="table-wrap"><table className="table"><thead><tr><th>Member</th><th>Kind</th><th>Title</th><th>Department</th><th>Head</th></tr></thead><tbody>{positions.filter((p) => p.term === t.id).map((p) => { const m = byId(p.memberId); return <tr key={p.memberId + p.title}><td><div style={{ display: "flex", gap: ".6rem", alignItems: "center" }}><Avatar name={m.displayName} size="sm" /><span style={{ color: "var(--fg)" }}>{m.displayName}</span></div></td><td>{p.kind}</td><td>{p.title}</td><td>{p.department ? departments.find((d) => d.slug === p.department)?.name : <span className="faint">—</span>}</td><td>{p.isHead ? <span className="status status-success">Head</span> : <span className="faint">—</span>}</td></tr>; })}</tbody></table></div>
    </div>)}
    <p className="faint">Admin access is derived: directors and Technical officers of the current term, plus break-glass super admins. Rolling over the year moves access automatically.</p>
  </>);
}
