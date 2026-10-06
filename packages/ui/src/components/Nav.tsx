"use client";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cx } from "../cx";
import { Menu, X } from "../icons";

export type NavLink = { href: string; label: string; active?: boolean };

/**
 * §7 Nav: glass band 72px, brand left, links, CTA right (secondary until scrolled past 80px, then ember).
 * Mobile: sheet from the right with Esc/overlay close and a focus trap. Data-agnostic: the app passes links and the CTA.
 * Uses next/link directly (next is a peer dependency) so server components can render it without passing functions.
 */
export function Nav({ brand, links, cta, extraSheetLinks = [] }: { brand: ReactNode; links: NavLink[]; cta?: { href: string; label: string }; extraSheetLinks?: NavLink[] }) {
  const A = Link;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const burger = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    const onScroll = () => setScrolled(scrollY > 80);
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) panel.current?.querySelector<HTMLElement>("button")?.focus();
    else if (wasOpen.current) burger.current?.focus({ preventScroll: true });
    wasOpen.current = open;
  }, [open]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
    if (e.key === "Tab" && panel.current) {
      const f = Array.from(panel.current.querySelectorAll<HTMLElement>("button,a"));
      const first = f[0], last = f[f.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };

  return (
    <>
      <header className={cx("nav glass", scrolled && "is-scrolled")}>
        <div className="container">
          {brand}
          <nav className="nav-links" aria-label="Primary">
            {links.map((l) => <A key={l.href} href={l.href} className={l.active ? "is-active" : undefined}>{l.label}</A>)}
          </nav>
          {cta && <A href={cta.href} className={cx("btn nav-cta", scrolled ? "btn-primary" : "btn-secondary")}>{cta.label}</A>}
          <button ref={burger} className="nav-burger" aria-label="Open menu" aria-expanded={open} aria-controls="nav-sheet" onClick={() => setOpen(true)}><Menu /></button>
        </div>
      </header>
      <div id="nav-sheet" className={cx("sheet", open && "is-open")} onKeyDown={onKey} role="dialog" aria-modal="true" aria-label="Menu" hidden={!open}>
        <div className="sheet-overlay" onClick={() => setOpen(false)} />
        <div className="sheet-panel" ref={panel}>
          <button className="sheet-close" aria-label="Close menu" onClick={() => setOpen(false)}><X /></button>
          {links.map((l) => <A key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</A>)}
          {cta && <A href={cta.href} onClick={() => setOpen(false)} style={{ color: "var(--accent)", fontWeight: 600 }}>{cta.label}</A>}
          {extraSheetLinks.map((l) => <A key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</A>)}
        </div>
      </div>
    </>
  );
}

/** Brand lockup for the nav and footer: round logo, eyebrow (hidden under 480px), cyan wordmark. */
export function Brand({ href = "/", logoSrc = "/brand/logo.png" }: { href?: string; logoSrc?: string }) {
  const A = Link;
  return (
    <A href={href} className="brand" aria-label="Tempest home">
      <img src={logoSrc} alt="" width={40} height={40} />
      <span><span className="eyebrow">AWS Student Builder Group</span><span className="word">Tempest</span></span>
    </A>
  );
}
