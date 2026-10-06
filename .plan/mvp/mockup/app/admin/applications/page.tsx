"use client";
import { useEffect, useRef, useState } from "react";
import Avatar from "@/components/Avatar";
import { useToast } from "@/components/Toast";
import { X } from "@/components/Icons";
import { applications as seed, currentTerm, fmtDate, fmtDateTime, windowState, type Application } from "@/lib/data";
const label: Record<Application["status"], { cls: string; text: string }> = { submitted: { cls: "status-warning", text: "Submitted" }, accepted: { cls: "status-success", text: "Accepted" }, rejected: { cls: "status-danger", text: "Rejected" }, waitlisted: { cls: "status-info", text: "Waitlisted" } };
/** Inline two-step confirm: first click arms, second confirms, Cancel disarms. */
function Confirm({ label: l, confirmLabel, onConfirm, primary = false, danger = false }: { label: string; confirmLabel: string; onConfirm: () => void; primary?: boolean; danger?: boolean }) {
  const [armed, setArmed] = useState(false);
  if (!armed) return <button className={`btn ${primary ? "btn-primary" : danger ? "btn-danger" : "btn-secondary"} btn-sm`} onClick={() => setArmed(true)}>{l}</button>;
  return <span className={`confirm ${primary ? "is-primary" : ""}`} role="group" aria-label={`Confirm: ${l}`}><span>{confirmLabel}</span><button className={`btn ${danger ? "btn-danger" : "btn-primary"} btn-sm`} onClick={onConfirm} autoFocus>Confirm</button><button className="btn btn-ghost btn-sm" onClick={() => setArmed(false)}>Cancel</button></span>;
}
export default function Applications() {
  const toast = useToast(); const [apps, setApps] = useState(seed); const [filter, setFilter] = useState<Application["status"] | "all">("submitted"); const [open, setOpen] = useState<Application | null>(null); const [sel, setSel] = useState<string[]>([]);
  const panel = useRef<HTMLDivElement>(null); const opener = useRef<HTMLElement | null>(null);
  const list = apps.filter((a) => filter === "all" || a.status === filter);
  const closes = fmtDate(windowState().date.toISOString(), { month: "short", day: "numeric" });
  const decide = (ids: string[], status: Application["status"]) => { setApps((p) => p.map((a) => (ids.includes(a.id) ? { ...a, status } : a))); setOpen(null); setSel([]); toast(status === "accepted" ? `${ids.length} accepted · member${ids.length > 1 ? "s" : ""} created, set-password email sent` : `${ids.length} marked ${status}`); };
  // drawer focus management: move focus in, trap Tab, Escape closes, focus returns to opener
  useEffect(() => { if (open) { panel.current?.querySelector<HTMLElement>("button")?.focus(); } else { opener.current?.focus(); } }, [open]);
  const onKey = (e: React.KeyboardEvent) => { if (e.key === "Escape") setOpen(null); if (e.key === "Tab" && panel.current) { const f = Array.from(panel.current.querySelectorAll<HTMLElement>("button,a,textarea,input")).filter((x) => !x.hasAttribute("disabled")); const first = f[0], last = f[f.length - 1]; if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } } };
  return (<>
    <div className="admin-head"><div><span className="eyebrow">Membership · {currentTerm.label}</span><h1>Applications</h1></div><span className="status status-warning">Window closes {closes}</span></div>
    <div className="toolbar">
      {(["submitted", "waitlisted", "accepted", "rejected", "all"] as const).map((f) => <button key={f} className="chip" aria-pressed={filter === f} onClick={() => setFilter(f)}>{f === "all" ? "All" : label[f].text} <span className="faint">{f === "all" ? apps.length : apps.filter((a) => a.status === f).length}</span></button>)}
      {sel.length > 0 && <div style={{ marginLeft: "auto", display: "flex", gap: ".5rem", alignItems: "center" }}><Confirm label={`Accept ${sel.length}`} confirmLabel={`Create ${sel.length} member${sel.length > 1 ? "s" : ""} and send emails?`} onConfirm={() => decide(sel, "accepted")} primary /><button className="btn btn-secondary btn-sm" onClick={() => decide(sel, "waitlisted")}>Waitlist</button></div>}
    </div>
    <div className="table-wrap"><table className="table rows"><thead><tr><th style={{ width: 36 }}><input type="checkbox" aria-label="Select all" checked={sel.length === list.length && list.length > 0} onChange={(e) => setSel(e.target.checked ? list.map((a) => a.id) : [])} /></th><th>Applicant</th><th className="hide-sm">Course</th><th className="hide-sm">Submitted</th><th>Status</th><th></th></tr></thead>
      <tbody>{list.map((a) => <tr key={a.id}><td><input type="checkbox" aria-label={`Select ${a.fullName}`} checked={sel.includes(a.id)} onChange={(e) => setSel(e.target.checked ? [...sel, a.id] : sel.filter((x) => x !== a.id))} /></td><td className="cell-main"><div style={{ display: "flex", gap: ".6rem", alignItems: "center" }}><Avatar name={a.fullName} size="sm" /><div style={{ minWidth: 0 }}><div style={{ color: "var(--fg)", fontWeight: 500 }}>{a.fullName}</div><div className="faint" style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{a.email}</div></div></div></td><td className="hide-sm">{a.course}<br /><span className="faint">{a.year}</span></td><td className="faint hide-sm">{fmtDateTime(a.submittedAt)}</td><td><span className={`status ${label[a.status].cls}`}>{label[a.status].text}</span></td><td className="cell-actions"><button className="btn btn-ghost btn-sm" onClick={(e) => { opener.current = e.currentTarget; setOpen(a); }}>Review</button></td></tr>)}
      {list.length === 0 && <tr><td colSpan={6} style={{ textAlign: "center", padding: "2rem" }} className="faint">Nothing here.</td></tr>}</tbody></table></div>
    {open && <div className="drawer" role="dialog" aria-modal="true" aria-label={`Review ${open.fullName}`} onKeyDown={onKey}><div className="drawer-overlay" onClick={() => setOpen(null)} /><div className="drawer-panel" ref={panel}>
      <header className="drawer-head">
        <Avatar name={open.fullName} size="md" />
        <div className="who"><h2>{open.fullName}</h2><span className="faint">{open.email}</span></div>
        <span className={`status ${label[open.status].cls}`}>{label[open.status].text}</span>
        <button className="sheet-close" aria-label="Close" onClick={() => setOpen(null)}><X /></button>
      </header>
      <div className="drawer-body">
        <dl className="facts"><div><dt>Course</dt><dd>{open.course}</dd></div><div><dt>Year</dt><dd>{open.year}</dd></div><div><dt>Submitted</dt><dd>{fmtDateTime(open.submittedAt)}</dd></div><div><dt>Consent</dt><dd className="status status-success">Given</dd></div></dl>
        <section><h3>Why they want to join</h3><blockquote className="motivation">{open.motivation}</blockquote></section>
        <div className="field"><label htmlFor="note">Internal note</label><textarea id="note" className="textarea" style={{ minHeight: 72 }} placeholder="Visible to admins only" /></div>
      </div>
      <footer className="drawer-foot">
        {open.status === "submitted" ? <>
          <div className="actions"><button className="btn btn-primary" onClick={() => decide([open.id], "accepted")}>Accept</button><button className="btn btn-secondary" onClick={() => decide([open.id], "waitlisted")}>Waitlist</button><span className="push"><Confirm label="Reject" confirmLabel="Reject this application?" onConfirm={() => decide([open.id], "rejected")} danger /></span></div>
          <p className="faint">Accept creates the member, their permanent card URL, and emails a set-password link. Rejections are kept; they may reapply next term.</p>
        </> : <p className="faint">Decided. {label[open.status].text === "Rejected" ? "The applicant may reapply next term." : "No further action."}</p>}
      </footer>
    </div></div>}
  </>);
}
