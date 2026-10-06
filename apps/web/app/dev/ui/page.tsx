import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar, AvatarStack, Backdrop, Badge, Brand, Button, ButtonLink, Card, Checkbox, EmptyState, GlassPanel, Input, Nav, ProfileCard, SectionHeader, Select, Skeleton, Stat, Status, Table, Textarea, LinkButton } from "@tempest/ui";
import { Calendar, Sparkle } from "@tempest/ui/icons";
import { ToastDemo } from "./ToastDemo";
import { ChipDemo } from "./ChipDemo";

export const metadata = { title: "UI preview", robots: { index: false, follow: false } };

const slug = (s: string) => `s-${s.toLowerCase().replace(/[^a-z]+/g, "-")}`;
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="stack" style={{ paddingTop: "2.5rem", borderTop: "1px solid var(--divider)" }} aria-labelledby={slug(title)}>
      <h2 id={slug(title)} style={{ fontSize: "var(--fs-h3)" }}>{title}</h2>
      {children}
    </section>
  );
}

/** Dev-only preview of every component in design-system.md §7, in every listed state. Source of truth for the design system. */
export default function DevUi() {
  if (process.env.NODE_ENV === "production" && process.env.DEV_UI !== "1") notFound();
  return (
    <>
      <Backdrop />
      <Nav brand={<Brand />} links={[{ href: "#buttons", label: "Buttons" }, { href: "#forms", label: "Forms", active: true }, { href: "#profile", label: "Profile" }]} cta={{ href: "#cta", label: "Apply now" }} extraSheetLinks={[{ href: "#", label: "Sign in" }]} />
      <main className="container section stack" style={{ gap: "2.5rem" }}>
        <SectionHeader eyebrow="Dev only" title="Component preview" lead="Every component from design-system.md §7 in every listed state. Not linked from anywhere; 404 in production." icon={<Sparkle />} />

        <Section title="Buttons">
          <div className="row" style={{ flexWrap: "wrap" }} id="buttons">
            <Button>Primary</Button>
            <Button variant="secondary" arrow>Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button loading>Saving</Button>
            <Button disabled>Disabled</Button>
            <Button size="sm">Small</Button>
            <ButtonLink href="#" variant="secondary" size="sm">Link button</ButtonLink>
          </div>
          <div style={{ maxWidth: 360 }}><Button block>Block primary</Button></div>
        </Section>

        <Section title="Badge, chip, status">
          <div className="row" style={{ flexWrap: "wrap" }}>
            <Badge icon={<Sparkle />}>AWS Student Builder Group · PLMUN</Badge>
            <Badge size="sm">Head of Technical</Badge>
            <Badge neutral>Draft</Badge>
          </div>
          <ChipDemo />
          <div className="row" style={{ flexWrap: "wrap" }}>
            <Status tone="success">Published</Status>
            <Status tone="warning">Waitlisted</Status>
            <Status tone="danger">Rejected</Status>
            <Status tone="info">Submitted</Status>
            <Status tone="muted">Inactive</Status>
          </div>
        </Section>

        <Section title="Card, glass panel, stat">
          <div className="grid grid-3">
            <Card><h3>Static card</h3><p className="muted">Surface, radius md, elev-1, 24px padding.</p></Card>
            <Card interactive as="a" href="#" aria-label="Interactive card example"><h3>Interactive card</h3><p className="muted">Hover lifts 4px with a pointer-tracked highlight.</p></Card>
            <GlassPanel><h3>Glass panel</h3><p className="muted">Surface-glass, blur 12px, hairline border.</p></GlassPanel>
          </div>
          <GlassPanel>
            <div className="grid grid-4">
              <Stat value={128} label="Members" animate />
              <Stat value={14} label="Events this year" animate />
              <Stat value={22} label="Build nights" />
              <Stat value={0} label="Cost to join" prefix="₱" />
            </div>
          </GlassPanel>
        </Section>

        <Section title="Avatar">
          <div className="row">
            <Avatar name="Maya Villanueva" size="sm" /><Avatar name="RJ Dela Cruz" /><Avatar name="Bea Santos" size="lg" /><Avatar name="Kiko Ramirez" size="xl" />
            <AvatarStack names={["Maya Villanueva", "JM Reyes", "Nicole Tan"]} />
          </div>
        </Section>

        <Section title="Forms">
          <form className="stack" id="forms" style={{ maxWidth: 480 }} onSubmit={undefined}>
            <Input id="f-name" label="Display name" placeholder="Maya Villanueva" help="Shown on your profile and card." />
            <Input id="f-email" label="Email" type="email" defaultValue="not-an-email" error="Enter a valid email address." />
            <Input id="f-disabled" label="Canonical id" defaultValue="7hq2kd" disabled />
            <Select id="f-dept" label="Department" defaultValue="technical">
              <option value="technical">Technical</option><option value="marketing">Marketing &amp; Creatives</option>
            </Select>
            <Textarea id="f-bio" label="Bio" placeholder="Two or three sentences." />
            <Checkbox id="f-consent" label="I have read the privacy notice and consent to the club storing this application." />
          </form>
        </Section>

        <Section title="Toast">
          <ToastDemo />
        </Section>

        <Section title="Table">
          <Table caption="Members" head={["Name", "Canonical id", "Visibility", <span key="a" className="sr-only">Actions</span>]}>
            {[["Maya Villanueva", "7hq2kd", "public"], ["Nicole Tan", "w3k5vn", "card-only"], ["Former Member", "q7w2xn", "inactive"]].map(([n, id, v]) => (
              <tr key={id}><td>{n}</td><td className="mono">{id}</td><td><Status tone={v === "public" ? "success" : v === "card-only" ? "info" : "muted"}>{v}</Status></td><td><Button variant="ghost" size="sm">Edit</Button></td></tr>
            ))}
          </Table>
        </Section>

        <Section title="Empty state and skeleton">
          <Card><EmptyState title="No events scheduled yet" action={<ButtonLink href="#" variant="secondary" arrow>Follow us on Facebook</ButtonLink>}>Check back after the next general assembly.</EmptyState></Card>
          <div className="stack" aria-busy="true">
            <span className="sr-only">Loading…</span>
            <Skeleton height={24} width="40%" /><Skeleton /><Skeleton width="80%" /><Skeleton height={120} radius="var(--r-md)" />
          </div>
        </Section>

        <Section title="Link button and profile card">
          <div style={{ maxWidth: 440 }} className="stack"><LinkButton brand="linkedin" href="https://linkedin.com/in/example">LinkedIn</LinkButton><LinkButton brand="web" href="https://maya.dev">maya.dev</LinkButton></div>
          <div id="profile" style={{ display: "grid", placeItems: "center", padding: "1rem 0" }}>
            <ProfileCard
              name="Maya Villanueva"
              headline="BS Computer Science · 3rd year"
              bio="Builds serverless things and breaks them on purpose. Runs the Thursday build nights."
              badges={["Head of Technical"]}
              vcardHref="#vcard"
              links={[{ brand: "linkedin", href: "https://linkedin.com/in/maya-villanueva", label: "LinkedIn" }, { brand: "github", href: "https://github.com/mayav", label: "GitHub" }, { brand: "web", href: "https://maya.dev", label: "maya.dev" }]}
              footer={<><Link href="/" className="row" style={{ gap: ".5rem" }}><Calendar /> <span>AWS Student Builder Group – Tempest</span></Link><span className="mono faint">tempest.club/p/7hq2kd</span></>}
            />
          </div>
        </Section>
        <div id="cta" />
      </main>
    </>
  );
}
