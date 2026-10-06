import Link from "next/link";
import { Brand, Card, Stat } from "@tempest/ui";
import { getDb, sql } from "@tempest/db";

export const dynamic = "force-dynamic";

const nav = [["/", "Overview"], ["/applications", "Applications"], ["/members", "Members"], ["/events", "Events"], ["/pages", "Pages"], ["/terms", "Terms & positions"]] as const;

// Foundation placeholder: proves the admin shell renders against the shared database. Real surfaces land in C1/C2/C3.
export default async function AdminHome() {
  let counts = { members: 0, events: 0, applications: 0 };
  let dbError: string | null = null;
  try {
    const rows = await getDb().execute<{ members: number; events: number; applications: number }>(
      sql`select (select count(*) from members)::int as members, (select count(*) from events)::int as events, (select count(*) from membership_applications where status = 'submitted')::int as applications`,
    );
    counts = rows[0] ?? counts;
  } catch (err) {
    dbError = err instanceof Error ? err.message : String(err);
  }
  return (
    <div className="admin">
      <aside className="admin-side">
        <Brand />
        <nav aria-label="Admin">{nav.map(([href, label]) => <Link key={href} href={href} aria-current={href === "/" ? "page" : undefined}>{label}</Link>)}</nav>
      </aside>
      <main className="admin-main">
        <h1>Overview</h1>
        {dbError ? (
          <Card><p className="status status-danger">Database unreachable</p><p className="muted mono" style={{ marginTop: ".5rem" }}>{dbError}</p></Card>
        ) : (
          <div className="grid grid-3">
            <Card><Stat value={counts.members} label="Members" /></Card>
            <Card><Stat value={counts.events} label="Events" /></Card>
            <Card><Stat value={counts.applications} label="Applications to review" /></Card>
          </div>
        )}
      </main>
    </div>
  );
}
