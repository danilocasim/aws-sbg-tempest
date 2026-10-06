"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "./Icons";
import { windowState } from "@/lib/data";
const links = [{ href: "/#about", label: "About" }, { href: "/#directors", label: "Directors" }, { href: "/#departments", label: "Departments" }, { href: "/events", label: "Events" }, { href: "/members", label: "Members" }];
export default function Nav({ spy = false }: { spy?: boolean }) {
  const [scrolled, setScrolled] = useState(false); const [open, setOpen] = useState(false); const [active, setActive] = useState("");
  const panel = useRef<HTMLDivElement>(null); const burger = useRef<HTMLButtonElement>(null);
  const ws = windowState();
  useEffect(() => {
    const ids = ["about", "directors", "departments", "events"];
    const onScroll = () => { setScrolled(scrollY > 80); if (!spy) return; const y = scrollY + 120; let cur = ""; for (const id of ids) { const el = document.getElementById(id); if (el && el.offsetTop <= y) cur = id; } setActive(cur); };
    addEventListener("scroll", onScroll, { passive: true }); onScroll(); return () => removeEventListener("scroll", onScroll);
  }, [spy]);
  const wasOpen = useRef(false);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; if (open) panel.current?.querySelector<HTMLElement>("button")?.focus(); else if (wasOpen.current) burger.current?.focus({ preventScroll: true }); wasOpen.current = open; }, [open]);
  const onKey = (e: React.KeyboardEvent) => { if (e.key === "Escape") setOpen(false); if (e.key === "Tab" && panel.current) { const f = Array.from(panel.current.querySelectorAll<HTMLElement>("button,a")); const first = f[0], last = f[f.length - 1]; if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } } };
  const cta = ws.state === "open" ? "Apply now" : "Join the waitlist";
  return (<>
    <header className={`nav glass ${scrolled ? "is-scrolled" : ""}`}>
      <div className="container">
        <Link href="/" className="brand" aria-label="Tempest home"><Image src="/brand/logo.png" alt="" width={40} height={40} priority /><span><span className="eyebrow">AWS Student Builder Group</span><span className="word">Tempest</span></span></Link>
        <nav className="nav-links" aria-label="Primary">{links.map((l) => <Link key={l.href} href={l.href} className={active && l.href === `/#${active}` ? "is-active" : ""}>{l.label}</Link>)}</nav>
        <Link href="/join" className={`btn nav-cta ${scrolled ? "btn-primary" : "btn-secondary"}`}>{cta}</Link>
        <button ref={burger} className="nav-burger" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}><Menu /></button>
      </div>
    </header>
    <div className={`sheet ${open ? "is-open" : ""}`} onKeyDown={onKey} role="dialog" aria-modal="true" aria-label="Menu">
      <div className="sheet-overlay" onClick={() => setOpen(false)} />
      <div className="sheet-panel" ref={panel}>
        <button className="sheet-close" aria-label="Close menu" onClick={() => setOpen(false)}><X /></button>
        {links.map((l) => <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</Link>)}
        <Link href="/join" onClick={() => setOpen(false)} style={{ color: "var(--accent)", fontWeight: 600 }}>{cta}</Link>
        <Link href="/login" onClick={() => setOpen(false)}>Sign in</Link>
      </div>
    </div>
  </>);
}
