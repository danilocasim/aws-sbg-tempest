import Link from "next/link";
import Image from "next/image";
import CountUp from "@/components/CountUp";
import { ArrowRight, Sparkle } from "@/components/Icons";
import { club, stats, windowState } from "@/lib/data";
const school = "PLMUN";
export default function Hero() {
  const ws = windowState();
  return (<section className="container hero" aria-labelledby="hero-title">
    <div className="hero-copy">
      <span className="badge"><Sparkle /> AWS Student Builder Group · {school}</span>
      <h1 id="hero-title"><span className="line">Learn AWS</span><span className="line">by <span className="aurora-text">shipping it.</span></span></h1>
      <p className="lead">Tempest is the student-led AWS builder community at {club.school}. Weekly build nights, beginner-first workshops, and real projects you ship with people learning alongside you.</p>
      <div className="actions">
        <Link href="/join" className="btn btn-primary">{ws.state === "open" ? "Apply now" : "Join the waitlist"}</Link>
        <Link href="/events" className="btn btn-secondary">See upcoming events <ArrowRight className="arrow" /></Link>
      </div>
      <div className="hero-stats" aria-label="Club at a glance">
        <div className="stat"><div className="num"><CountUp to={stats.members} /></div><div className="label">Members</div></div>
        <div className="stat"><div className="num"><CountUp to={stats.eventsThisYear} /></div><div className="label">Events this year</div></div>
        <div className="stat"><div className="num"><CountUp to={stats.buildNights} /></div><div className="label">Build nights held</div></div>
        <div className="stat"><div className="num"><CountUp to={stats.cost} prefix="₱" /></div><div className="label">Cost to join</div></div>
      </div>
    </div>
    <div className="hero-art" aria-hidden><div className="halo" /><div className="dragon-follow"><Image className="dragon" src="/brand/dragon.png" alt="" width={440} height={480} priority /></div></div>
  </section>);
}
