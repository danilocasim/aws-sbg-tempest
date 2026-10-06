import { initials } from "@/lib/data";
import type { CSSProperties } from "react";
const hue = (s: string) => { let h = 0; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) % 360; return h; };
export default function Avatar({ name, size = "md", className = "" }: { name: string; size?: "sm" | "md" | "lg" | "xl"; className?: string }) {
  return <span className={`avatar avatar-${size} ${className}`} data-hue style={{ "--h": hue(name) } as CSSProperties} aria-hidden>{initials(name)}</span>;
}
