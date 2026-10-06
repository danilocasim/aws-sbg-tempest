import { Backdrop, Badge, Brand, ButtonLink, Nav } from "@tempest/ui";
import { Sparkle } from "@tempest/ui/icons";

// Foundation placeholder. The real landing page (C2.3) is built from the database; this only proves the
// shell renders with tokens, fonts, and shared components.
const links = [{ href: "/#about", label: "About" }, { href: "/events", label: "Events" }, { href: "/members", label: "Members" }];

export default function Home() {
  return (
    <>
      <Backdrop />
      <Nav brand={<Brand />} links={links} cta={{ href: "/join", label: "Apply now" }} extraSheetLinks={[{ href: "/login", label: "Sign in" }]} />
      <main className="container section" id="about">
        <div className="stack" style={{ maxWidth: 640 }}>
          <Badge icon={<Sparkle />}>AWS Student Builder Group · PLMUN</Badge>
          <h1 style={{ fontSize: "var(--fs-display)" }}>Learn AWS<br />by <span className="aurora-text">shipping it.</span></h1>
          <p style={{ fontSize: "var(--fs-lead)", color: "var(--fg-muted)" }}>Weekly build nights, beginner-first workshops, and projects shipped together. The site is being built; member profiles arrive first.</p>
          <div className="row" style={{ flexWrap: "wrap" }}>
            <ButtonLink href="/join">Apply now</ButtonLink>
            <ButtonLink href="/events" variant="secondary" arrow>See upcoming events</ButtonLink>
          </div>
        </div>
      </main>
    </>
  );
}
