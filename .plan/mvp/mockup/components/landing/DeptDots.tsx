"use client";
import { useEffect, useState } from "react";
/** Dots indicator for the mobile department carousel; hidden ≥640px via CSS. */
export default function DeptDots({ count }: { count: number }) {
  const [i, setI] = useState(0);
  useEffect(() => { const el = document.querySelector<HTMLElement>(".dept-scroller"); if (!el) return; const on = () => { const w = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 16 : 1; setI(Math.round(el.scrollLeft / w)); }; el.addEventListener("scroll", on, { passive: true }); return () => el.removeEventListener("scroll", on); }, []);
  return <div className="dept-dots" aria-hidden>{Array.from({ length: count }, (_, k) => <i key={k} className={k === i ? "is-on" : ""} />)}</div>;
}
