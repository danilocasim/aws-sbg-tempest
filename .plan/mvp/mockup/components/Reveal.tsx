"use client";
import { useEffect, useRef, type ReactNode, type CSSProperties } from "react";
/** Reveals once at 15% visibility. `stagger` sets --d on children. */
export default function Reveal({ children, as: Tag = "div", className = "", fade = false, delay = 0, stagger, style, ...rest }: { children: ReactNode; as?: keyof HTMLElementTagNameMap; className?: string; fade?: boolean; delay?: number; stagger?: number; style?: CSSProperties; id?: string }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (stagger) Array.from(el.children).forEach((c, i) => (c as HTMLElement).style.setProperty("--d", i * stagger + "ms"));
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { el.classList.add("is-in"); el.querySelectorAll(".reveal,.reveal-fade").forEach((c) => c.classList.add("is-in")); io.disconnect(); } }), { threshold: .15 });
    io.observe(el); return () => io.disconnect();
  }, [stagger]);
  const Comp = Tag as unknown as "div";
  return <Comp ref={ref as never} className={`${stagger ? "" : fade ? "reveal-fade" : "reveal"} ${className}`} style={{ ...style, "--d": `${delay}ms` } as CSSProperties} {...rest}>{children}</Comp>;
}
