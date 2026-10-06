"use client";
import { useState } from "react";
function ConfirmReset({ onConfirm }: { onConfirm: () => void }) { const [armed, setArmed] = useState(false); if (!armed) return <button className="btn btn-ghost btn-sm" onClick={() => setArmed(true)}>Send reset</button>; return <span className="confirm"><span>Email a reset link?</span><button className="btn btn-primary btn-sm" onClick={() => { onConfirm(); setArmed(false); }} autoFocus>Send</button><button className="btn btn-ghost btn-sm" onClick={() => setArmed(false)}>Cancel</button></span>; }
import Avatar from "@/components/Avatar";
import { useToast } from "@/components/Toast";
import { Search } from "@/components/Icons";
import { club, members, positionsFor } from "@/lib/data";
export default function AdminMembers() {
  const toast = useToast(); const [q, setQ] = useState("");
  const list = members.filter((m) => !q || (m.displayName + m.email + m.canonicalId).toLowerCase().includes(q.toLowerCase()));
  const vis: Record<string, string> = { public: "status-success", "card-only": "status-info", inactive: "status-muted" };
  return (<>
    <div className="admin-head"><div><span className="eyebrow">{members.length} accounts</span><h1>Members</h1></div><div style={{ display: "flex", gap: ".5rem" }}><button className="btn btn-secondary btn-sm" onClick={() => toast("CSV import is mocked")}>Import CSV</button><button className="btn btn-primary btn-sm" onClick={() => toast("card-list.csv downloaded")}>Export card list</button></div></div>
    <div className="toolbar"><div style={{ position: "relative", flex: "1 1 240px", maxWidth: 380 }}><Search width={18} height={18} style={{ position: "absolute", left: 12, top: 11, color: "var(--fg-faint)" }} /><input className="input" style={{ height: 40, paddingLeft: 38 }} placeholder="Search name, email, or card ID" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search" /></div></div>
    <div className="table-wrap"><table className="table rows"><thead><tr><th>Member</th><th className="hide-sm">Card URL</th><th className="hide-sm">Position</th><th>Visibility</th><th className="hide-sm">Joined</th><th></th></tr></thead>
      <tbody>{list.map((m) => { const p = positionsFor(m.id)[0]; return (<tr key={m.id}><td className="cell-main"><div style={{ display: "flex", gap: ".6rem", alignItems: "center" }}><Avatar name={m.displayName} size="sm" /><div style={{ minWidth: 0 }}><div style={{ color: "var(--fg)", fontWeight: 500 }}>{m.displayName}</div><div className="faint" style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{m.email}</div></div></div></td><td className="mono hide-sm">{club.domain}/p/{m.canonicalId}</td><td className="hide-sm">{p ? p.title : <span className="faint">Member</span>}</td><td><span className={`status ${vis[m.visibility]}`}>{m.visibility}</span></td><td className="faint hide-sm">{m.joinedTerm}</td><td className="cell-actions" style={{ whiteSpace: "nowrap" }}><ConfirmReset onConfirm={() => toast(`Reset link sent to ${m.email}`)} /><button className="btn btn-ghost btn-sm" onClick={() => toast("Edit is mocked")}>Edit</button></td></tr>); })}</tbody></table></div>
  </>);
}
