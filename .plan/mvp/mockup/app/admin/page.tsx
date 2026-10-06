import Link from "next/link";
import { ArrowRight } from "@/components/Icons";
import { applications, auditLog, currentTerm, events, members, ops, stats, upcomingEvents, fmtDate, fmtDateTime, windowState } from "@/lib/data";
/** Overview: a KPI strip that links into each section, a task list with an action per row, system health, and a stacked activity feed. */
export default function AdminHome() {
  const pending = applications.filter((a) => a.status === "submitted").length;
  const draft = events.find((e) => e.status === "draft"); const next = upcomingEvents()[0];
  const closes = fmtDate(windowState().date.toISOString(), { month: "short", day: "numeric" });
  const pct = Math.round((ops.emailSendsUsed / ops.emailSendsLimit) * 100);
  return (<>
    <div className="admin-head"><div><span className="eyebrow">{currentTerm.label} · current term</span><h1>Overview</h1></div><Link href="/admin/members/export" className="btn btn-secondary btn-sm">Export card list</Link></div>
    <nav className="kpis" aria-label="At a glance">
      <Link href="/admin/members" className="kpi"><span className="num">{stats.members}</span><span className="label">Members</span></Link>
      <Link href="/admin/applications" className={`kpi ${pending ? "is-hot" : ""}`}><span className="num">{pending}</span><span className="label">Applications to review</span></Link>
      <Link href="/admin/events" className="kpi"><span className="num">{upcomingEvents().length}</span><span className="label">Upcoming events</span></Link>
      <Link href="/admin/members" className="kpi"><span className="num">{members.filter((m) => m.visibility === "inactive").length}</span><span className="label">Inactive profiles</span></Link>
    </nav>
    <div className="admin-cols">
      <div className="stack">
        <section className="panel" aria-labelledby="h-tasks">
          <h2 id="h-tasks">Needs attention <span className="count">{(pending ? 1 : 0) + (draft ? 1 : 0)}</span></h2>
          <ul className="tasks">
            {pending > 0 && <li><span className="dot status-warning" /><div><b>{pending} membership application{pending > 1 ? "s" : ""} waiting</b><span>Window closes {closes}</span></div><Link href="/admin/applications" className="btn btn-secondary btn-sm">Review</Link></li>}
            {draft && <li><span className="dot status-info" /><div><b>Draft event not published</b><span>{draft.title}</span></div><Link href="/admin/events" className="btn btn-secondary btn-sm">Open</Link></li>}
            {next && <li><span className="dot status-muted" /><div><b>Next event · {fmtDate(next.startsAt, { month: "short", day: "numeric" })}</b><span>{next.title}</span></div><Link href={`/events/${next.slug}`} className="btn btn-ghost btn-sm">View <ArrowRight width={14} height={14} /></Link></li>}
          </ul>
        </section>
        <section className="panel" aria-labelledby="h-sys">
          <h2 id="h-sys">System</h2>
          <ul className="sys">
            <li><span>Nightly backup</span><span className="status status-success">Succeeded · {fmtDateTime(ops.lastBackupAt)}</span></li>
            <li><span>Email sends this month</span><span className="mono">{ops.emailSendsUsed.toLocaleString()} / {ops.emailSendsLimit.toLocaleString()}</span><span className="bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Email quota used"><i style={{ width: `${pct}%` }} /></span></li>
          </ul>
        </section>
      </div>
      <section className="panel" aria-labelledby="h-activity">
        <h2 id="h-activity">Recent activity</h2>
        <ol className="audit">{auditLog.map((a) => <li key={a.at}><span><b>{a.actor}</b> {a.action}</span><time dateTime={a.at}>{fmtDateTime(a.at)}</time></li>)}</ol>
      </section>
    </div>
  </>);
}
