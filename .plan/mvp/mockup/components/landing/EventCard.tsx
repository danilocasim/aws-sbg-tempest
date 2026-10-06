import Link from "next/link";
import { Calendar, MapPin } from "@/components/Icons";
import { deptBySlug, fmtDate, fmtTime, type Event } from "@/lib/data";
import Countdown from "./Countdown";
export default function EventCard({ e, isNext = false, className = "" }: { e: Event; isNext?: boolean; className?: string }) {
  return (<Link href={`/events/${e.slug}`} className={`card card-interactive event tilt ${isNext ? "is-next" : ""} ${className}`}>
    <div className="cover"><div className={`art art-${e.cover}`} /><span className="badge">{isNext ? <>Up next · <Countdown to={e.startsAt} /></> : fmtDate(e.startsAt, { month: "short", day: "numeric" })}</span></div>
    <div className="body">
      <h3>{e.title}</h3>
      <p className="muted" style={{ fontSize: "var(--fs-small)" }}>{e.blurb}</p>
      <div className="when"><span><Calendar width={16} height={16} /> {fmtDate(e.startsAt, { weekday: "short", month: "short", day: "numeric" })} · {fmtTime(e.startsAt)}</span><span><MapPin width={16} height={16} /> {e.venue}</span>{e.department && <span className="faint">{deptBySlug(e.department)?.name}</span>}</div>
    </div>
  </Link>);
}
