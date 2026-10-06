import Link from "next/link";
import { notFound } from "next/navigation";
import Page from "@/components/Page";
import Reveal from "@/components/Reveal";
import Portrait from "@/components/Portrait";
import DeptIcon from "@/components/landing/DeptIcon";
import EventCard from "@/components/landing/EventCard";
import { currentTerm, deptBySlug, officersOf, upcomingEvents } from "@/lib/data";
import "@/app/landing.css";
export default async function Dept({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const d = deptBySlug(slug); if (!d) notFound();
  const offs = officersOf(d.slug); const evs = upcomingEvents().filter((e) => e.department === d.slug);
  return (<Page>
    <Reveal className="section-head"><span className="icon dept" style={{ width: 56, height: 56, borderRadius: "var(--r-sm)", display: "grid", placeItems: "center", background: "var(--highlight-bg)", color: "var(--highlight)", border: "1px solid var(--highlight-border)", minHeight: 0 }}><DeptIcon icon={d.icon} /></span><h1>{d.name}</h1><p>{d.description}</p></Reveal>
    <h2 style={{ fontSize: "var(--fs-h3)", margin: "0 0 1.25rem" }}>Officers · {currentTerm.label}</h2>
    <Reveal stagger={70} className="grid grid-4 grid-people" data-glow>{offs.map((o) => { const inner = <><div className="photo"><Portrait name={o.member.displayName} /></div><div className="meta"><h3>{o.member.displayName}</h3><div className="role">{o.title}</div></div></>; return o.member.visibility === "public" ? <Link key={o.memberId} href={`/p/${o.member.canonicalId}`} className="card card-interactive person tilt reveal">{inner}</Link> : <div key={o.memberId} className="card person reveal">{inner}</div>; })}</Reveal>
    {evs.length > 0 && <><h2 style={{ fontSize: "var(--fs-h3)", margin: "3rem 0 1.25rem" }}>Upcoming from {d.name}</h2><Reveal stagger={70} className="grid grid-3">{evs.map((e) => <EventCard key={e.slug} e={e} className="reveal" />)}</Reveal></>}
  </Page>);
}
