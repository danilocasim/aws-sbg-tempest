// Drizzle schema. Translates docs/domain-model.md 1:1. Tables snake_case plural,
// `id` uuid v7 generated in the app, created_at/updated_at everywhere, constraints in the DB.
import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  customType,
  date,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { v7 as uuidv7 } from "uuid";

/** Case-insensitive text (Postgres `citext` extension, enabled in migration 0000). */
export const citext = customType<{ data: string; driverData: string }>({
  dataType: () => "citext",
});

const id = () =>
  uuid("id")
    .primaryKey()
    .$defaultFn(() => uuidv7());

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const visibilityEnum = pgEnum("visibility", ["public", "card-only", "inactive"]);
export const positionKindEnum = pgEnum("position_kind", ["director", "officer"]);
export const eventStatusEnum = pgEnum("event_status", ["draft", "published"]);
export const membershipApplicationStatusEnum = pgEnum("membership_application_status", [
  "submitted",
  "accepted",
  "rejected",
  "waitlisted",
]);
export const officerApplicationStatusEnum = pgEnum("officer_application_status", [
  "submitted",
  "accepted",
  "rejected",
]);
export const applicationKindEnum = pgEnum("application_kind", ["membership", "officer"]);

export const terms = pgTable(
  "terms",
  {
    id: id(),
    label: text("label").notNull().unique(),
    startsOn: date("starts_on").notNull(),
    endsOn: date("ends_on").notNull(),
    isCurrent: boolean("is_current").notNull().default(false),
    ...timestamps,
  },
  (t) => [
    // Exactly one current Term (partial unique index).
    uniqueIndex("terms_one_current_idx").on(t.isCurrent).where(sql`${t.isCurrent}`),
    check("terms_dates_chk", sql`${t.startsOn} < ${t.endsOn}`),
  ],
);

export const departments = pgTable(
  "departments",
  {
    id: id(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    description: text("description").notNull().default(""),
    sortOrder: integer("sort_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    ...timestamps,
  },
  (t) => [check("departments_slug_chk", sql`${t.slug} ~ '^[a-z0-9-]{2,40}$'`)],
);

export const members = pgTable(
  "members",
  {
    id: id(),
    /** 6-char opaque id on the NFC card: /p/<canonicalId>. Immutable, never reused (ADR-0005). */
    canonicalId: text("canonical_id").notNull().unique(),
    /** Optional vanity handle: /@handle → 301 to canonical. */
    handle: citext("handle").unique(),
    email: citext("email").notNull().unique(),
    passwordHash: text("password_hash"),
    displayName: text("display_name").notNull(),
    headline: text("headline").notNull().default(""),
    bio: text("bio").notNull().default(""),
    photoKey: text("photo_key"),
    linkedinUrl: text("linkedin_url"),
    facebookUrl: text("facebook_url"),
    githubUrl: text("github_url"),
    websiteUrl: text("website_url"),
    contactEmail: text("contact_email"),
    contactPhone: text("contact_phone"),
    visibility: visibilityEnum("visibility").notNull().default("public"),
    isSuperAdmin: boolean("is_super_admin").notNull().default(false),
    joinedTermId: uuid("joined_term_id")
      .notNull()
      .references(() => terms.id, { onDelete: "restrict" }),
    ...timestamps,
  },
  (t) => [
    check("members_canonical_id_chk", sql`${t.canonicalId} ~ '^[a-z0-9]{6}$'`),
    check("members_handle_chk", sql`${t.handle} IS NULL OR ${t.handle}::text ~ '^[a-z0-9_]{3,30}$'`),
  ],
);

export const positions = pgTable(
  "positions",
  {
    id: id(),
    memberId: uuid("member_id")
      .notNull()
      .references(() => members.id, { onDelete: "cascade" }),
    termId: uuid("term_id")
      .notNull()
      .references(() => terms.id, { onDelete: "restrict" }),
    kind: positionKindEnum("kind").notNull(),
    title: text("title").notNull(),
    departmentId: uuid("department_id").references(() => departments.id, { onDelete: "restrict" }),
    isHead: boolean("is_head").notNull().default(false),
    ...timestamps,
  },
  (t) => [
    // One Head per Department per Term.
    uniqueIndex("positions_one_head_idx").on(t.departmentId, t.termId).where(sql`${t.isHead}`),
    // director ⇒ no department; officer ⇒ department required.
    check(
      "positions_kind_department_chk",
      sql`(${t.kind} = 'director' AND ${t.departmentId} IS NULL) OR (${t.kind} = 'officer' AND ${t.departmentId} IS NOT NULL)`,
    ),
    check("positions_head_is_officer_chk", sql`NOT ${t.isHead} OR ${t.kind} = 'officer'`),
  ],
);

export const events = pgTable(
  "events",
  {
    id: id(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    endsAt: timestamp("ends_at", { withTimezone: true }),
    venue: text("venue"),
    onlineUrl: text("online_url"),
    coverKey: text("cover_key"),
    description: text("description").notNull().default(""),
    registrationUrl: text("registration_url"),
    departmentId: uuid("department_id").references(() => departments.id, { onDelete: "set null" }),
    status: eventStatusEnum("status").notNull().default("draft"),
    ...timestamps,
  },
  (t) => [
    check("events_slug_chk", sql`${t.slug} ~ '^[a-z0-9-]{2,80}$'`),
    check("events_dates_chk", sql`${t.endsAt} IS NULL OR ${t.endsAt} > ${t.startsAt}`),
  ],
);

export const membershipApplications = pgTable(
  "membership_applications",
  {
    id: id(),
    email: citext("email").notNull(),
    fullName: text("full_name").notNull(),
    course: text("course").notNull(),
    yearLevel: text("year_level").notNull(),
    motivation: text("motivation").notNull(),
    consentAt: timestamp("consent_at", { withTimezone: true }).notNull(),
    termId: uuid("term_id")
      .notNull()
      .references(() => terms.id, { onDelete: "restrict" }),
    status: membershipApplicationStatusEnum("status").notNull().default("submitted"),
    decidedById: uuid("decided_by_id").references(() => members.id, { onDelete: "set null" }),
    decidedAt: timestamp("decided_at", { withTimezone: true }),
    resultingMemberId: uuid("resulting_member_id").references(() => members.id, { onDelete: "set null" }),
    ...timestamps,
  },
  // One application per email per Term; rejected applicants may reapply next Term.
  (t) => [uniqueIndex("membership_applications_email_term_idx").on(t.email, t.termId)],
);

export const officerApplications = pgTable(
  "officer_applications",
  {
    id: id(),
    memberId: uuid("member_id")
      .notNull()
      .references(() => members.id, { onDelete: "cascade" }),
    termId: uuid("term_id")
      .notNull()
      .references(() => terms.id, { onDelete: "restrict" }),
    departmentId: uuid("department_id")
      .notNull()
      .references(() => departments.id, { onDelete: "restrict" }),
    statement: text("statement").notNull(),
    status: officerApplicationStatusEnum("status").notNull().default("submitted"),
    decidedById: uuid("decided_by_id").references(() => members.id, { onDelete: "set null" }),
    decidedAt: timestamp("decided_at", { withTimezone: true }),
    resultingPositionId: uuid("resulting_position_id").references(() => positions.id, {
      onDelete: "set null",
    }),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("officer_applications_member_term_department_idx").on(t.memberId, t.termId, t.departmentId),
  ],
);

export const applicationWindows = pgTable(
  "application_windows",
  {
    id: id(),
    termId: uuid("term_id")
      .notNull()
      .references(() => terms.id, { onDelete: "cascade" }),
    kind: applicationKindEnum("kind").notNull(),
    opensAt: timestamp("opens_at", { withTimezone: true }).notNull(),
    closesAt: timestamp("closes_at", { withTimezone: true }).notNull(),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("application_windows_term_kind_idx").on(t.termId, t.kind),
    check("application_windows_dates_chk", sql`${t.opensAt} < ${t.closesAt}`),
  ],
);

export const pages = pgTable(
  "pages",
  {
    id: id(),
    /** about | mission | join | department:<slug> */
    slug: text("slug").notNull().unique(),
    body: text("body").notNull().default(""),
    updatedById: uuid("updated_by_id").references(() => members.id, { onDelete: "set null" }),
    ...timestamps,
  },
  (t) => [check("pages_slug_chk", sql`${t.slug} ~ '^[a-z0-9:-]{2,60}$'`)],
);

/** Every admin write appends here (actor, action, target, diff, timestamp). Append-only. */
export const auditLog = pgTable("audit_log", {
  id: id(),
  actorMemberId: uuid("actor_member_id").references(() => members.id, { onDelete: "set null" }),
  action: text("action").notNull(),
  targetTable: text("target_table").notNull(),
  targetId: text("target_id").notNull(),
  diff: jsonb("diff"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Term = typeof terms.$inferSelect;
export type Department = typeof departments.$inferSelect;
export type Member = typeof members.$inferSelect;
export type Position = typeof positions.$inferSelect;
export type Event = typeof events.$inferSelect;
export type MembershipApplication = typeof membershipApplications.$inferSelect;
export type OfficerApplication = typeof officerApplications.$inferSelect;
export type ApplicationWindow = typeof applicationWindows.$inferSelect;
export type Page = typeof pages.$inferSelect;
export type AuditLogEntry = typeof auditLog.$inferSelect;
