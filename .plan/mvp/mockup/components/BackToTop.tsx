"use client";
import { useEffect, useState } from "react";
export default function BackToTop() {
  const [on, setOn] = useState(false);
  useEffect(() => { const f = () => setOn(scrollY > 900); addEventListener("scroll", f, { passive: true }); f(); return () => removeEventListener("scroll", f); }, []);
  return <button className={`to-top ${on ? "is-on" : ""}`} aria-label="Back to top" onClick={() => scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 19V5M5 12l7-7 7 7"/></svg></button>;
}
