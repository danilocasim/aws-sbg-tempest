import Page from "@/components/Page";
import Reveal from "@/components/Reveal";
import EventCard from "@/components/landing/EventCard";
import { pastEvents, upcomingEvents } from "@/lib/data";
import "@/app/landing.css";
export const metadata = { title: "Events" };
export default function Events() {
  const up = upcomingEvents(), past = pastEvents();
  return (<Page>
    <Reveal className="section-head"><span className="eyebrow">Calendar</span><h1>Events</h1><p>Registration happens in the organizer&apos;s tool. Members get first dibs on limited seats.</p></Reveal>
    <h2 style={{ fontSize: "var(--fs-h3)", margin: "0 0 1.25rem" }}>Upcoming</h2>
    <Reveal stagger={70} className="grid grid-3" data-glow>{up.map((e, i) => <EventCard key={e.slug} e={e} isNext={i === 0} className="reveal" />)}</Reveal>
    <h2 style={{ fontSize: "var(--fs-h3)", margin: "3rem 0 1.25rem" }} className="muted">Past</h2>
    <Reveal stagger={70} className="grid grid-3" style={{ opacity: .85 }}>{past.map((e) => <EventCard key={e.slug} e={e} className="reveal" />)}</Reveal>
  </Page>);
}
