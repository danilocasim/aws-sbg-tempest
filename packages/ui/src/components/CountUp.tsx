"use client";
import { useEffect, useRef } from "react";

/** Visible numeral animates (aria-hidden); a visually hidden live region gets the final value once. Reduced motion: jumps to the value. */
export function CountUp({ to, prefix = "", suffix = "", className = "" }: { to: number; prefix?: string; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const live = useRef<HTMLSpanElement>(null);
  const final = prefix + to.toLocaleString() + suffix;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        io.disconnect();
        const done = () => {
          el.textContent = final;
          if (live.current) live.current.textContent = final;
        };
        if (reduce) return done();
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / 900);
          const e = 1 - Math.pow(1 - p, 3);
          el.textContent = prefix + Math.round(to * e).toLocaleString() + suffix;
          if (p < 1) requestAnimationFrame(tick);
          else done();
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, prefix, suffix, final]);
  return (
    <>
      <span ref={ref} className={className} aria-hidden>{prefix}0{suffix}</span>
      <span ref={live} className="sr-only" aria-live="polite" />
    </>
  );
}
