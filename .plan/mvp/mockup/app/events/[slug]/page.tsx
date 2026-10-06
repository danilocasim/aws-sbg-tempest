import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Page from "@/components/Page";
import Reveal from "@/components/Reveal";
import { ArrowRight, Calendar, External, MapPin, Users } from "@/components/Icons";
import { deptBySlug, events, fmtDate, fmtTime } from "@/lib/data";
import "@/app/landing.css";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const e = events.find((x) => x.slug === slug && x.status === "published");
  return e ? { title: e.title, description: e.blurb } : { title: "Event" };
}
export default async function EventDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const e = events.find((x) => x.slug === slug && x.status === "published"); if (!e) notFound();
  const dept = e.department ? deptBySlug(e.department) : undefined;
  return (<Page>
    <article className="event-page">
      <Link href="/events" className="back"><ArrowRight width={16} height={16} style={{ transform: "rotate(180deg)" }} /> All events</Link>
      <Reveal fade className="event-cover"><div className={`art art-${e.cover}`} />{dept && <span className="badge">{dept.name}</span>}</Reveal>
      <div className="event-grid">
        <Reveal className="event-body"><h1>{e.title}</h1><p className="lead">{e.blurb}</p><p>{e.description}</p></Reveal>
        <Reveal as="aside" delay={80} className="card event-facts" aria-label="Event details">
          <dl>
            <div><dt>When</dt><dd><Calendar width={18} height={18} /><span>{fmtDate(e.startsAt, { weekday: "long", month: "long", day: "numeric" })}<br />{fmtTime(e.startsAt)}{e.endsAt ? ` – ${fmtTime(e.endsAt)}` : ""}</span></dd></div>
            <div><dt>Where</dt><dd><MapPin width={18} height={18} /><span>{e.venue}</span></dd></div>
            {dept && <div><dt>Hosted by</dt><dd><Users width={18} height={18} /><Link href={`/departments/${dept.slug}`} className="link">{dept.name}</Link></dd></div>}
          </dl>
          {e.registrationUrl ? <a className="btn btn-primary btn-block" href={e.registrationUrl} target="_blank" rel="noopener noreferrer">Register <External width={16} height={16} /></a> : <span className="status status-muted">No registration needed. Just show up.</span>}
        </Reveal>
      </div>
    </article>
  </Page>);
}
