CREATE EXTENSION IF NOT EXISTS citext;
CREATE TYPE "public"."application_kind" AS ENUM('membership', 'officer');--> statement-breakpoint
CREATE TYPE "public"."event_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TYPE "public"."membership_application_status" AS ENUM('submitted', 'accepted', 'rejected', 'waitlisted');--> statement-breakpoint
CREATE TYPE "public"."officer_application_status" AS ENUM('submitted', 'accepted', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."position_kind" AS ENUM('director', 'officer');--> statement-breakpoint
CREATE TYPE "public"."visibility" AS ENUM('public', 'card-only', 'inactive');--> statement-breakpoint
CREATE TABLE "application_windows" (
	"id" uuid PRIMARY KEY NOT NULL,
	"term_id" uuid NOT NULL,
	"kind" "application_kind" NOT NULL,
	"opens_at" timestamp with time zone NOT NULL,
	"closes_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "application_windows_dates_chk" CHECK ("application_windows"."opens_at" < "application_windows"."closes_at")
);
--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" uuid PRIMARY KEY NOT NULL,
	"actor_member_id" uuid,
	"action" text NOT NULL,
	"target_table" text NOT NULL,
	"target_id" text NOT NULL,
	"diff" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "departments" (
	"id" uuid PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "departments_slug_unique" UNIQUE("slug"),
	CONSTRAINT "departments_slug_chk" CHECK ("departments"."slug" ~ '^[a-z0-9-]{2,40}$')
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone,
	"venue" text,
	"online_url" text,
	"cover_key" text,
	"description" text DEFAULT '' NOT NULL,
	"registration_url" text,
	"department_id" uuid,
	"status" "event_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "events_slug_unique" UNIQUE("slug"),
	CONSTRAINT "events_slug_chk" CHECK ("events"."slug" ~ '^[a-z0-9-]{2,80}$'),
	CONSTRAINT "events_dates_chk" CHECK ("events"."ends_at" IS NULL OR "events"."ends_at" > "events"."starts_at")
);
--> statement-breakpoint
CREATE TABLE "members" (
	"id" uuid PRIMARY KEY NOT NULL,
	"canonical_id" text NOT NULL,
	"handle" "citext",
	"email" "citext" NOT NULL,
	"password_hash" text,
	"display_name" text NOT NULL,
	"headline" text DEFAULT '' NOT NULL,
	"bio" text DEFAULT '' NOT NULL,
	"photo_key" text,
	"linkedin_url" text,
	"facebook_url" text,
	"github_url" text,
	"website_url" text,
	"contact_email" text,
	"contact_phone" text,
	"visibility" "visibility" DEFAULT 'public' NOT NULL,
	"is_super_admin" boolean DEFAULT false NOT NULL,
	"joined_term_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "members_canonical_id_unique" UNIQUE("canonical_id"),
	CONSTRAINT "members_handle_unique" UNIQUE("handle"),
	CONSTRAINT "members_email_unique" UNIQUE("email"),
	CONSTRAINT "members_canonical_id_chk" CHECK ("members"."canonical_id" ~ '^[a-z0-9]{6}$'),
	CONSTRAINT "members_handle_chk" CHECK ("members"."handle" IS NULL OR "members"."handle"::text ~ '^[a-z0-9_]{3,30}$')
);
--> statement-breakpoint
CREATE TABLE "membership_applications" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" "citext" NOT NULL,
	"full_name" text NOT NULL,
	"course" text NOT NULL,
	"year_level" text NOT NULL,
	"motivation" text NOT NULL,
	"consent_at" timestamp with time zone NOT NULL,
	"term_id" uuid NOT NULL,
	"status" "membership_application_status" DEFAULT 'submitted' NOT NULL,
	"decided_by_id" uuid,
	"decided_at" timestamp with time zone,
	"resulting_member_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "officer_applications" (
	"id" uuid PRIMARY KEY NOT NULL,
	"member_id" uuid NOT NULL,
	"term_id" uuid NOT NULL,
	"department_id" uuid NOT NULL,
	"statement" text NOT NULL,
	"status" "officer_application_status" DEFAULT 'submitted' NOT NULL,
	"decided_by_id" uuid,
	"decided_at" timestamp with time zone,
	"resulting_position_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pages" (
	"id" uuid PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"body" text DEFAULT '' NOT NULL,
	"updated_by_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pages_slug_unique" UNIQUE("slug"),
	CONSTRAINT "pages_slug_chk" CHECK ("pages"."slug" ~ '^[a-z0-9:-]{2,60}$')
);
--> statement-breakpoint
CREATE TABLE "positions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"member_id" uuid NOT NULL,
	"term_id" uuid NOT NULL,
	"kind" "position_kind" NOT NULL,
	"title" text NOT NULL,
	"department_id" uuid,
	"is_head" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "positions_kind_department_chk" CHECK (("positions"."kind" = 'director' AND "positions"."department_id" IS NULL) OR ("positions"."kind" = 'officer' AND "positions"."department_id" IS NOT NULL)),
	CONSTRAINT "positions_head_is_officer_chk" CHECK (NOT "positions"."is_head" OR "positions"."kind" = 'officer')
);
--> statement-breakpoint
CREATE TABLE "terms" (
	"id" uuid PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"starts_on" date NOT NULL,
	"ends_on" date NOT NULL,
	"is_current" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "terms_label_unique" UNIQUE("label"),
	CONSTRAINT "terms_dates_chk" CHECK ("terms"."starts_on" < "terms"."ends_on")
);
--> statement-breakpoint
ALTER TABLE "application_windows" ADD CONSTRAINT "application_windows_term_id_terms_id_fk" FOREIGN KEY ("term_id") REFERENCES "public"."terms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_actor_member_id_members_id_fk" FOREIGN KEY ("actor_member_id") REFERENCES "public"."members"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_joined_term_id_terms_id_fk" FOREIGN KEY ("joined_term_id") REFERENCES "public"."terms"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "membership_applications" ADD CONSTRAINT "membership_applications_term_id_terms_id_fk" FOREIGN KEY ("term_id") REFERENCES "public"."terms"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "membership_applications" ADD CONSTRAINT "membership_applications_decided_by_id_members_id_fk" FOREIGN KEY ("decided_by_id") REFERENCES "public"."members"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "membership_applications" ADD CONSTRAINT "membership_applications_resulting_member_id_members_id_fk" FOREIGN KEY ("resulting_member_id") REFERENCES "public"."members"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "officer_applications" ADD CONSTRAINT "officer_applications_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "officer_applications" ADD CONSTRAINT "officer_applications_term_id_terms_id_fk" FOREIGN KEY ("term_id") REFERENCES "public"."terms"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "officer_applications" ADD CONSTRAINT "officer_applications_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "officer_applications" ADD CONSTRAINT "officer_applications_decided_by_id_members_id_fk" FOREIGN KEY ("decided_by_id") REFERENCES "public"."members"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "officer_applications" ADD CONSTRAINT "officer_applications_resulting_position_id_positions_id_fk" FOREIGN KEY ("resulting_position_id") REFERENCES "public"."positions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pages" ADD CONSTRAINT "pages_updated_by_id_members_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."members"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "positions" ADD CONSTRAINT "positions_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "positions" ADD CONSTRAINT "positions_term_id_terms_id_fk" FOREIGN KEY ("term_id") REFERENCES "public"."terms"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "positions" ADD CONSTRAINT "positions_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "application_windows_term_kind_idx" ON "application_windows" USING btree ("term_id","kind");--> statement-breakpoint
CREATE UNIQUE INDEX "membership_applications_email_term_idx" ON "membership_applications" USING btree ("email","term_id");--> statement-breakpoint
CREATE UNIQUE INDEX "officer_applications_member_term_department_idx" ON "officer_applications" USING btree ("member_id","term_id","department_id");--> statement-breakpoint
CREATE UNIQUE INDEX "positions_one_head_idx" ON "positions" USING btree ("department_id","term_id") WHERE "positions"."is_head";--> statement-breakpoint
CREATE UNIQUE INDEX "terms_one_current_idx" ON "terms" USING btree ("is_current") WHERE "terms"."is_current";
