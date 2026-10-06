import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import "@/app/profile.css";
import Backdrop from "@/components/Backdrop";
import Avatar from "@/components/Avatar";
import { Download, External, Facebook, GitHub, Globe, LinkedIn } from "@/components/Icons";
import { byCanonical, club, positionLabel, positionsFor } from "@/lib/data";
import ProfileActions from "./ProfileActions";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params; const m = byCanonical(id);
  const robots = { index: false, follow: false };
  if (!m || m.visibility === "inactive") return { title: "Member profile", robots };
  return { title: m.displayName, description: m.headline, robots, openGraph: { title: `${m.displayName} · Tempest`, description: m.headline, images: [{ url: "/brand/logo.png", width: 400, height: 400 }], type: "profile" } };
}

/** The page a card tap opens. Flat surface, left-aligned, one primary action (Save contact), no motion beyond the route fade. */
export default async function Profile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const m = byCanonical(id); if (!m) notFound();
  if (m.visibility === "inactive") return (<><Backdrop stars={false} /><div className="profile-wrap"><div className="inactive"><Image src="/brand/logo.png" alt="" width={88} height={88} /><h1 style={{ fontSize: "1.5rem" }}>This Tempest member profile is no longer active</h1><p className="muted">The card you tapped belongs to a past member. The club is still here, though.</p><Link href="/" className="btn btn-secondary">Visit Tempest</Link></div></div></>);
  const pos = positionsFor(m.id);
  const links = [m.linkedinUrl && { href: m.linkedinUrl, label: "LinkedIn", brand: "linkedin", I: LinkedIn }, m.facebookUrl && { href: m.facebookUrl, label: "Facebook", brand: "facebook", I: Facebook }, m.githubUrl && { href: m.githubUrl, label: "GitHub", brand: "github", I: GitHub }, m.websiteUrl && { href: m.websiteUrl, label: m.websiteUrl.replace(/^https?:\/\//, ""), brand: "web", I: Globe }].filter(Boolean) as { href: string; label: string; brand: string; I: typeof LinkedIn }[];
  return (<><Backdrop stars={false} />
    <div className="profile-wrap"><article className="profile-card" aria-label={`${m.displayName}'s profile`}>
      <header className="profile-head">
        <Avatar name={m.displayName} size="lg" />
        <div className="who"><h1>{m.displayName}</h1><p className="headline">{m.headline}</p>{pos.length > 0 && <p className="role-line">{pos.map(positionLabel).join(" · ")}</p>}</div>
      </header>
      <a className="btn btn-primary btn-block" href={`/p/${m.canonicalId}/vcard`}><Download /> Save contact</a>
      {m.bio && <p className="bio">{m.bio}</p>}
      {links.length > 0 && <ul className="links">{links.map((l) => <li key={l.brand}><a className="link-row" data-brand={l.brand} href={l.href} rel="noopener"><l.I className="ic" /><span>{l.label}</span><External className="ext" width={16} height={16} /></a></li>)}</ul>}
      <ProfileActions id={m.canonicalId} name={m.displayName} />
      <footer className="profile-foot"><Link href="/" className="row" style={{ gap: ".5rem" }}><Image src="/brand/logo.png" alt="" width={24} height={24} /><span>{club.fullName}</span></Link><span className="mono faint">{club.domain}/p/{m.canonicalId}</span></footer>
    </article></div>
  </>);
}
