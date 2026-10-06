// `pnpm db:seed` fills an empty database. `pnpm db:seed -- --reset` truncates first (never in production).
import "dotenv/config";
import { sql } from "drizzle-orm";
import { createDb } from "./index";
import * as s from "./schema";
import { seedApplicationWindows, seedDepartments, seedEvents, seedMembers, seedPages, seedPositions, seedTerms } from "./seed-data";

const reset = process.argv.includes("--reset");
if (reset && process.env.NODE_ENV === "production") {
  console.error("refusing to --reset in production");
  process.exit(1);
}

const { db, client } = createDb(undefined, { max: 1 });
try {
  if (reset) {
    await db.execute(sql`truncate table audit_log, officer_applications, membership_applications, application_windows, pages, events, positions, members, departments, terms restart identity cascade`);
  }
  const existing = await db.select({ n: sql<number>`count(*)::int` }).from(s.terms);
  if ((existing[0]?.n ?? 0) > 0) {
    console.log("database already seeded; run with --reset to start over");
    process.exit(0);
  }

  const termRows = await db.insert(s.terms).values(seedTerms.map(({ key: _k, ...t }) => t)).returning();
  const termId = Object.fromEntries(seedTerms.map((t, i) => [t.key, termRows[i]!.id])) as Record<string, string>;

  const deptRows = await db.insert(s.departments).values(seedDepartments.map((d) => ({ ...d }))).returning();
  const deptId = Object.fromEntries(deptRows.map((d) => [d.slug, d.id]));

  const memberRows = await db
    .insert(s.members)
    .values(seedMembers.map(({ key: _k, joinedTerm, ...m }) => ({ ...m, joinedTermId: termId[joinedTerm]! })))
    .returning();
  const memberId = Object.fromEntries(seedMembers.map((m, i) => [m.key, memberRows[i]!.id]));

  await db.insert(s.positions).values(
    seedPositions.map((p) => ({
      memberId: memberId[p.member]!,
      termId: termId[p.term]!,
      kind: p.kind,
      title: p.title,
      departmentId: p.department ? deptId[p.department]! : null,
      isHead: p.isHead ?? false,
    })),
  );

  await db.insert(s.events).values(
    seedEvents.map(({ department, startsAt, endsAt, ...e }) => ({
      ...e,
      startsAt: new Date(startsAt),
      endsAt: endsAt ? new Date(endsAt) : null,
      departmentId: department ? deptId[department]! : null,
    })),
  );

  await db.insert(s.pages).values(seedPages.map((p) => ({ ...p, updatedById: memberId.m1! })));

  await db.insert(s.applicationWindows).values(
    seedApplicationWindows.map((w) => ({ termId: termId[w.term]!, kind: w.kind, opensAt: new Date(w.opensAt), closesAt: new Date(w.closesAt) })),
  );

  await db.insert(s.auditLog).values({ actorMemberId: null, action: "seed", targetTable: "terms", targetId: termId.ay2627!, diff: { members: seedMembers.length, events: seedEvents.length } });

  console.log(`seeded ${termRows.length} terms, ${deptRows.length} departments, ${memberRows.length} members, ${seedPositions.length} positions, ${seedEvents.length} events, ${seedPages.length} pages, ${seedApplicationWindows.length} windows`);
} finally {
  await client.end();
}
