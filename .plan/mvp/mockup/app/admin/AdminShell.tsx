"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Avatar from "@/components/Avatar";
import { External, Menu, X } from "@/components/Icons";
export type NavItem = { href: string; label: string; icon: ReactNode; count?: number };
/**
 * Admin chrome. Desktop (≥1024): a 240px sidebar with the nav list and the signed-in user.
 * Phones: a top bar with the current section and a menu button that opens a left sheet with the same list.
 */
export default function AdminShell({ items, user }: { items: NavItem[]; user: { name: string; role: string } }) {
  const path = usePathname(); const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null); const burger = useRef<HTMLButtonElement>(null); const wasOpen = useRef(false);
  const isActive = (href: string) => (href === "/admin" ? path === href : path === href || path.startsWith(href + "/"));
  const current = items.find((i) => isActive(i.href)) ?? items[0];
  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; if (open) panel.current?.querySelector<HTMLElement>("button")?.focus(); else if (wasOpen.current) burger.current?.focus({ preventScroll: true }); wasOpen.current = open; }, [open]);
  const onKey = (e: React.KeyboardEvent) => { if (e.key === "Escape") setOpen(false); if (e.key === "Tab" && panel.current) { const f = Array.from(panel.current.querySelectorAll<HTMLElement>("button,a")); const first = f[0], last = f[f.length - 1]; if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } } };
  const nav = <nav aria-label="Admin" className="admin-nav">{items.map((i) => <Link key={i.href} href={i.href} className={isActive(i.href) ? "is-active" : ""} aria-current={isActive(i.href) ? "page" : undefined}>{i.icon}<span>{i.label}</span>{i.count ? <span className="count">{i.count}</span> : null}</Link>)}</nav>;
  const who = (<div className="admin-user">
    <Link href="/" className="admin-user-link"><External width={16} height={16} /> Public site</Link>
    <div className="admin-me"><Avatar name={user.name} size="sm" /><div><b>{user.name}</b><span>{user.role}</span></div></div>
  </div>);
  const brand = <Link href="/admin" className="admin-brand"><Image src="/brand/logo.png" alt="" width={32} height={32} /><span>Tempest <em>Admin</em></span></Link>;
  return (<>
    <aside className="admin-side">{brand}{nav}{who}</aside>
    <header className="admin-bar">
      <button ref={burger} className="admin-burger" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}><Menu /></button>
      <span className="admin-bar-title">{current.label}</span>
      <Link href="/admin" className="admin-bar-brand" aria-label="Admin home"><Image src="/brand/logo.png" alt="" width={28} height={28} /></Link>
    </header>
    <div className={`sheet admin-sheet ${open ? "is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Admin menu" onKeyDown={onKey}>
      <div className="sheet-overlay" onClick={() => setOpen(false)} />
      <div className="sheet-panel admin-sheet-panel" ref={panel}>
        <div className="admin-sheet-head">{brand}<button className="sheet-close" aria-label="Close menu" onClick={() => setOpen(false)}><X /></button></div>
        {nav}{who}
      </div>
    </div>
  </>);
}
