"use client";
import { useEffect } from "react";
/**
 * One global pointer handler for all cursor-driven effects (pointer devices only):
 * - .btn-primary / .card-interactive: radial highlight at --mx/--my
 * - [data-glow] grids: every child card lights relative to the cursor (.is-glow)
 * - .tilt: 3D tilt up to ±7° via --rx/--ry
 */
export default function Pointer() {
  useEffect(() => {
    if (!matchMedia("(hover: hover)").matches) return;
    const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lastGlow: HTMLElement | null = null; let lastTilt: HTMLElement | null = null;
    const mv = (e: PointerEvent) => {
      const t = e.target as Element;
      const hi = t.closest<HTMLElement>(".btn-primary,.card-interactive");
      if (hi) { const r = hi.getBoundingClientRect(); hi.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100) + "%"); hi.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100) + "%"); }
      // shared glow
      const grid = t.closest<HTMLElement>("[data-glow]");
      if (grid !== lastGlow) { lastGlow?.querySelectorAll<HTMLElement>(".is-glow").forEach((c) => c.classList.remove("is-glow")); lastGlow = grid; }
      if (grid) grid.querySelectorAll<HTMLElement>(".card-interactive").forEach((c) => { const r = c.getBoundingClientRect(); c.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100) + "%"); c.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100) + "%"); c.classList.add("is-glow"); });
      // tilt
      const tl = RM ? null : t.closest<HTMLElement>(".tilt");
      if (tl !== lastTilt) { lastTilt?.style.removeProperty("--rx"); lastTilt?.style.removeProperty("--ry"); lastTilt = tl; }
      if (tl) { const r = tl.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; tl.style.setProperty("--rx", (-y * 7).toFixed(2) + "deg"); tl.style.setProperty("--ry", (x * 7).toFixed(2) + "deg"); }
    };
    addEventListener("pointermove", mv, { passive: true });
    return () => removeEventListener("pointermove", mv);
  }, []);
  return null;
}
