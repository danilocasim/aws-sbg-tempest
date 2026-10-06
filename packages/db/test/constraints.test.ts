// Proves the constraints live in the database, not only in app code (conventions.md).
// Needs DATABASE_URL pointing at a migrated database; skipped otherwise.
import "dotenv/config";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { sql } from "drizzle-orm";
import { createDb } from "../src/index";
import * as s from "../src/schema";

const url = process.env.DATABASE_URL;
const d = url ? describe : describe.skip;

/** Drizzle wraps driver errors (DrizzleQueryError); the constraint name lives on `cause`. */
async function rejectsWith(p: Promise<unknown>, re: RegExp) {
  let err: unknown;
  try { await p; } catch (e) { err = e; }
  const msg = err instanceof Error ? `${err.message}\n${(err.cause as Error | undefined)?.message ?? ""}` : String(err);
  expect(err, `expected a rejection matching ${re}`).toBeDefined();
  expect(msg).toMatch(re);
}

d("database constraints", () => {
  const { db, client } = createDb(url, { max: 1 });
  const made: { table: "terms" | "departments" | "members" | "positions"; id: string }[] = [];
  let termA = "", termB = "", dept = "", member = "";
  const stamp = Date.now().toString(36);

  beforeAll(async () => {
    const [a, b] = await db
      .insert(s.terms)
      .values([
        { label: `test-${stamp}-a`, startsOn: "2000-08-01", endsOn: "2001-06-30" },
        { label: `test-${stamp}-b`, startsOn: "2001-08-01", endsOn: "2002-06-30" },
      ])
      .returning();
    termA = a!.id; termB = b!.id;
    const [dp] = await db.insert(s.departments).values({ slug: `t${stamp}`, name: "Test dept" }).returning();
    dept = dp!.id;
    const [m] = await db
      .insert(s.members)
      .values({ canonicalId: stamp.slice(-6).padStart(6, "0"), email: `t-${stamp}@example.test`, displayName: "Test", joinedTermId: termA })
      .returning();
    member = m!.id;
  });

  afterAll(async () => {
    await db.execute(sql`delete from positions where term_id in (${termA}, ${termB})`);
    await db.execute(sql`delete from members where id = ${member}`);
    await db.execute(sql`delete from departments where id = ${dept}`);
    await db.execute(sql`delete from terms where id in (${termA}, ${termB})`);
    await client.end();
  });

  it("allows at most one current term", async () => {
    const current = await db.select({ n: sql<number>`count(*)::int` }).from(s.terms).where(sql`is_current`);
    const already = (current[0]?.n ?? 0) > 0;
    if (!already) {
      await db.update(s.terms).set({ isCurrent: true }).where(sql`id = ${termA}`);
      made.push({ table: "terms", id: termA });
    }
    await rejectsWith(db.update(s.terms).set({ isCurrent: true }).where(sql`id = ${termB}`), /terms_one_current_idx/);
    if (!already) await db.update(s.terms).set({ isCurrent: false }).where(sql`id = ${termA}`);
  });

  it("rejects a director with a department and an officer without one", async () => {
    await rejectsWith(db.insert(s.positions).values({ memberId: member, termId: termA, kind: "director", title: "X", departmentId: dept }), /positions_kind_department_chk/);
    await rejectsWith(db.insert(s.positions).values({ memberId: member, termId: termA, kind: "officer", title: "X" }), /positions_kind_department_chk/);
  });

  it("allows one head per department per term", async () => {
    await db.insert(s.positions).values({ memberId: member, termId: termA, kind: "officer", title: "Head", departmentId: dept, isHead: true });
    await rejectsWith(db.insert(s.positions).values({ memberId: member, termId: termA, kind: "officer", title: "Head 2", departmentId: dept, isHead: true }), /positions_one_head_idx/);
    // same department, other term: fine
    await db.insert(s.positions).values({ memberId: member, termId: termB, kind: "officer", title: "Head", departmentId: dept, isHead: true });
  });

  it("treats member email as case-insensitive and canonical ids as 6 lowercase chars", async () => {
    await rejectsWith(db.insert(s.members).values({ canonicalId: "zz" + stamp.slice(-4), email: `T-${stamp.toUpperCase()}@EXAMPLE.TEST`, displayName: "Dup", joinedTermId: termA }), /members_email_unique/);
    await rejectsWith(db.insert(s.members).values({ canonicalId: "TOOLONG1", email: `u-${stamp}@example.test`, displayName: "Bad", joinedTermId: termA }), /members_canonical_id_chk/);
  });

  it("allows one application window per term and kind", async () => {
    await db.insert(s.applicationWindows).values({ termId: termB, kind: "membership", opensAt: new Date("2001-09-01"), closesAt: new Date("2001-10-01") });
    await rejectsWith(db.insert(s.applicationWindows).values({ termId: termB, kind: "membership", opensAt: new Date("2001-11-01"), closesAt: new Date("2001-12-01") }), /application_windows_term_kind_idx/);
    await db.execute(sql`delete from application_windows where term_id = ${termB}`);
  });
});
