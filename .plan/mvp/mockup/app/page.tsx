import Link from "next/link";
import Image from "next/image";
import "./landing.css";
import Backdrop from "@/components/Backdrop";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import Avatar from "@/components/Avatar";
import Portrait from "@/components/Portrait";
import Hero from "@/components/landing/Hero";
import DragonFollow from "@/components/landing/DragonFollow";
import EventCard from "@/components/landing/EventCard";
import DeptIcon from "@/components/landing/DeptIcon";
import { ArrowRight } from "@/components/Icons";
import { club, currentTerm, departments, directors, officersOf, upcomingEvents, windowState, fmtDate } from "@/lib/data";
import DeptDots from "@/components/landing/DeptDots";
import Marquee from "@/components/landing/Marquee";
import BackToTop from "@/components/BackToTop";

export default function Landing() {
  const dirs = directors(); const events = upcomingEvents().slice(0, 3); const ws = windowState();
  return (<>
    <Backdrop /><Nav spy /><DragonFollow />
    <main>
      <Hero />

      <section id="about" className="section container" aria-labelledby="about-title">
        <div className="about">
          <Reveal className="about-left"><span className="eyebrow">About the club</span><h2 id="about-title" style={{ marginTop: ".75rem" }}>Builders first, <span className="aurora-text">students always</span></h2></Reveal>
          <Reveal stagger={60}><p className="reveal" style={{ fontSize: "var(--fs-lead)" }}>{club.about}</p><p className="reveal muted">{club.aboutMore}</p><blockquote className="pullquote reveal">{club.mission}</blockquote></Reveal>
        </div>
        <Reveal fade style={{ marginTop: "3.5rem" }}><p className="eyebrow" style={{ marginBottom: "1rem" }}>What members have shipped with</p><Marquee /></Reveal>
      </section>

      <section id="directors" className="section container" aria-labelledby="directors-title">
        <Reveal className="section-head"><span className="eyebrow">{currentTerm.label}</span><h2 id="directors-title">Directors</h2><p>The students who signed up to be responsible for all of this.</p></Reveal>
        <Reveal stagger={70} className="grid grid-3 grid-people" data-glow>
          {dirs.map(({ member, title }) => {
            const inner = <><div className="photo"><Portrait name={member.displayName} /></div><div className="meta"><h3>{member.displayName}</h3><div className="role">{title}</div></div></>;
            return member.visibility === "public" ? <Link key={member.id} href={`/p/${member.canonicalId}`} className="card card-interactive person tilt reveal">{inner}</Link> : <div key={member.id} className="card person reveal">{inner}</div>;
          })}
        </Reveal>
      </section>

      <section id="departments" className="section container" aria-labelledby="departments-title">
        <Reveal className="section-head"><span className="eyebrow">Four ways in</span><h2 id="departments-title">Departments</h2><p>Every member belongs to the club. Officers belong to a department. Pick the kind of work you want to be known for.</p></Reveal>
        <Reveal stagger={70} className="grid grid-4 dept-scroller" data-glow>
          {departments.map((d) => { const offs = officersOf(d.slug); return (
            <Link key={d.slug} href={`/departments/${d.slug}`} className="card card-interactive dept tilt reveal">
              <span className="icon"><DeptIcon icon={d.icon} /></span>
              <div><h3>{d.name}</h3><p className="muted" style={{ fontSize: "var(--fs-small)", marginTop: ".4rem" }}>{d.blurb}</p></div>
              <div className="foot"><div className="avatar-stack">{offs.map((o) => <Avatar key={o.memberId} name={o.member.displayName} size="sm" />)}</div><span className="more">View department <ArrowRight width={16} height={16} /></span></div>
            </Link>); })}
        </Reveal>
        <DeptDots count={departments.length} />
      </section>

      <section id="events" className="section container" aria-labelledby="events-title">
        <Reveal className="section-head"><span className="eyebrow">What&apos;s next</span><h2 id="events-title">Upcoming events</h2><p>Workshops, build nights, and the hackathon. Registration links open in the organizer&apos;s tool.</p></Reveal>
        {events.length ? <Reveal stagger={70} className="grid grid-3" data-glow>{events.map((e, i) => <EventCard key={e.slug} e={e} isNext={i === 0} className="reveal" />)}</Reveal>
          : <div className="card empty"><Image src="/brand/logo.png" alt="" width={72} height={72} /><h3>No events scheduled yet</h3><p className="muted">Follow us on Facebook to hear first.</p><a className="btn btn-secondary" href={club.socials.facebook}>Facebook</a></div>}
        <div style={{ marginTop: "2rem" }}><Link href="/events" className="btn btn-secondary">All events <ArrowRight className="arrow" /></Link></div>
      </section>

      <Reveal as="section" fade className="join-band" aria-labelledby="join-title">
        <div className="disc" aria-hidden />
        <div className="container inner">
          <span className="badge">{ws.state === "open" ? `Applications open until ${fmtDate(ws.date.toISOString(), { month: "long", day: "numeric" })}` : ws.state === "upcoming" ? `Applications open ${fmtDate(ws.date.toISOString(), { month: "long", day: "numeric" })}` : "Closed for this term"}</span>
          <h2 id="join-title">Build with us</h2>
          <p className="muted" style={{ maxWidth: 520, fontSize: "var(--fs-lead)" }}>Membership is free. You need a laptop, a PLMUN email, and a problem you want to solve.</p>
          <Link href="/join" className="btn btn-primary">{ws.state === "open" ? "Apply for membership" : "Join the waitlist"}</Link>
        </div>
      </Reveal>
    </main>
    <Footer />
    <BackToTop />
  </>);
}
