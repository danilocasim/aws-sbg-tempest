"use client";
import { useState } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import HowItWorks from "./HowItWorks";
import JoinForm, { type Receipt } from "./JoinForm";
type State = "open" | "upcoming" | "closed";
/** Owns the one piece of shared state on the page: whether the application has been received. The steps list reads it. */
export default function JoinExperience({ state, dateLabel, daysLeft, term }: { state: State; dateLabel: string; daysLeft: number; term: string }) {
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  return (<div className="join">
    <aside className="join-aside">
      <Reveal className="join-head section-head">
        <span className="eyebrow">Membership · {term}</span>
        <h1>Apply for membership</h1>
        <p>Free. About three minutes. No account needed.</p>
        <p className="join-window">
          {state === "open" && <><span className="status status-success">Open</span><span>Closes {dateLabel}</span><span className="faint">· {daysLeft} {daysLeft === 1 ? "day" : "days"} left</span></>}
          {state === "upcoming" && <><span className="status status-warning">Not open yet</span><span>Opens {dateLabel}</span></>}
          {state === "closed" && <><span className="status status-muted">Closed</span><span>for this term</span></>}
        </p>
      </Reveal>
      <HowItWorks current={receipt ? 2 : 1} className="join-how" />
    </aside>
    <div className="join-form">
      {state === "open" ? <JoinForm closes={dateLabel} receipt={receipt} onDone={setReceipt} />
        : <div className="card empty"><h3>{state === "upcoming" ? "Applications aren't open yet" : "Applications are closed for this term"}</h3><p className="muted">{state === "upcoming" ? `Come back on ${dateLabel}. Until then, events are open to everyone.` : "Follow our socials to hear when the next window opens. Events are open to everyone."}</p><Link href="/events" className="btn btn-secondary">See upcoming events</Link></div>}
    </div>
  </div>);
}
