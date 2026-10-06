import Reveal from "@/components/Reveal";
import { Check } from "@/components/Icons";
const steps = ["Apply", "Directors review", "If accepted, set a password", "Get your NFC card"];
/** The joining process as a four-line list. `current` marks where the visitor is; earlier steps tick off. */
export default function HowItWorks({ current = 1, className = "" }: { current?: number; className?: string }) {
  return (<Reveal as="section" fade className={`how-wrap ${className}`} aria-labelledby="how-title">
    <h2 id="how-title" className="eyebrow">How it works</h2>
    <Reveal as="ol" className="how" stagger={80}>
      {steps.map((t, i) => { const n = i + 1; const s = n < current ? "is-done" : n === current ? "is-now" : ""; return (
        <li key={t} className={`how-step ${s}`} aria-current={n === current ? "step" : undefined}>
          <span className="n" aria-hidden>{n < current ? <Check width={14} height={14} strokeWidth={2.5} /> : String(n).padStart(2, "0")}</span>
          <span className="t"><b>{t}</b></span>
        </li>); })}
    </Reveal>
  </Reveal>);
}
