import { initials } from "@/lib/data";
import type { CSSProperties } from "react";
const hue = (s: string) => { let h = 0; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) % 360; return h; };
/** Full-bleed portrait placeholder: a hue-keyed field with a large monogram. Swap for the member's photo when one exists. */
export default function Portrait({ name, className = "" }: { name: string; className?: string }) {
  return <span className={`portrait ${className}`} style={{ "--h": hue(name) } as CSSProperties} aria-hidden><span className="mono-mark">{initials(name)}</span></span>;
}
