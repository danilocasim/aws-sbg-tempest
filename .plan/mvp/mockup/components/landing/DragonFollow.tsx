"use client";
import { useEffect } from "react";
/** Dragon drifts up to 8px toward the cursor within 300px. Desktop + full motion only. */
export default function DragonFollow() {
  useEffect(() => {
    if (!matchMedia("(hover: hover)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = document.querySelector<HTMLElement>(".dragon-follow"); if (!el) return;
    let dx = 0, dy = 0, cx = 0, cy = 0, id = 0;
    const mv = (e: PointerEvent) => { const r = el.getBoundingClientRect(); const mx = r.left + r.width / 2, my = r.top + r.height / 2; const d = Math.hypot(e.clientX - mx, e.clientY - my); const k = d < 300 ? (1 - d / 300) * 8 : 0; dx = (e.clientX - mx) / Math.max(d, 1) * k; dy = (e.clientY - my) / Math.max(d, 1) * k; };
    const loop = () => { cx += (dx - cx) * .1; cy += (dy - cy) * .1; el.style.transform = `translate(${cx}px,${cy}px)`; id = requestAnimationFrame(loop); };
    addEventListener("pointermove", mv, { passive: true }); loop();
    return () => { removeEventListener("pointermove", mv); cancelAnimationFrame(id); };
  }, []);
  return null;
}
