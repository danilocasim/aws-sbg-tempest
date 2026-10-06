"use client";
import { useState } from "react";
import { useToast } from "@/components/Toast";
import { deptBySlug, events as seed, fmtDate, type Event } from "@/lib/data";
export default function AdminEvents() {
  const toast = useToast(); const [evs, setEvs] = useState(seed);
  const toggle = (e: Event) => { setEvs((p) => p.map((x) => (x.slug === e.slug ? { ...x, status: x.status === "draft" ? "published" : "draft" } : x))); toast(e.status === "draft" ? `Published “${e.title}”` : `Unpublished “${e.title}”`); };
  return (<>
    <div className="admin-head"><div><span className="eyebrow">{evs.length} events</span><h1>Events</h1></div><button className="btn btn-primary btn-sm" onClick={() => toast("New event form is mocked")}>New event</button></div>
    <div className="table-wrap"><table className="table rows"><thead><tr><th>Event</th><th>When</th><th className="hide-sm">Venue</th><th className="hide-sm">Department</th><th>Status</th><th></th></tr></thead>
      <tbody>{[...evs].sort((a, b) => b.startsAt.localeCompare(a.startsAt)).map((e) => <tr key={e.slug}><td className="cell-main" style={{ color: "var(--fg)", fontWeight: 500 }}>{e.title}</td><td className="faint cell-sub">{fmtDate(e.startsAt, { month: "short", day: "numeric", year: "numeric" })}</td><td className="hide-sm">{e.venue}</td><td className="hide-sm">{e.department ? deptBySlug(e.department)?.name : <span className="faint">Club-wide</span>}</td><td><span className={`status ${e.status === "published" ? "status-success" : "status-warning"}`}>{e.status}</span></td><td className="cell-actions" style={{ whiteSpace: "nowrap" }}><button className="btn btn-ghost btn-sm" onClick={() => toggle(e)}>{e.status === "draft" ? "Publish" : "Unpublish"}</button><button className="btn btn-ghost btn-sm" onClick={() => toast("Edit is mocked")}>Edit</button></td></tr>)}</tbody></table></div>
  </>);
}
