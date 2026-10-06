import Link from "next/link";
import Image from "next/image";
import { club } from "@/lib/data";
import { Facebook, GitHub, LinkedIn } from "./Icons";
export default function Footer() {
  return (<footer className="footer"><div className="container">
    <div className="footer-grid">
      <div><div className="brand" style={{ marginBottom: "1rem" }}><Image src="/brand/logo.png" alt="" width={40} height={40} /><span><span className="eyebrow">AWS Student Builder Group</span><span className="word">Tempest</span></span></div><p className="muted" style={{ maxWidth: 360, fontSize: "var(--fs-small)" }}>A student-led AWS builder community at {club.school}. Membership is free and always will be.</p></div>
      <div><h4>Club</h4><Link href="/#about">About</Link><Link href="/#departments">Departments</Link><Link href="/events">Events</Link><Link href="/archive">Past officers</Link></div>
      <div><h4>Members</h4><Link href="/join">Apply</Link><Link href="/login">Sign in</Link><Link href="/me">My profile</Link><Link href="/members">Directory</Link></div>
      <div><h4>Follow</h4><div className="socials"><a href={club.socials.facebook} data-brand="facebook" aria-label="Facebook"><Facebook /></a><a href={club.socials.linkedin} data-brand="linkedin" aria-label="LinkedIn"><LinkedIn /></a><a href={club.socials.github} data-brand="github" aria-label="GitHub"><GitHub /></a></div></div>
    </div>
    <div className="footer-bottom"><span>© 2026 {club.fullName}</span><span>Built by the Technical department · <Link href="/privacy" style={{ display: "inline" }}>Privacy</Link></span></div>
  </div></footer>);
}
