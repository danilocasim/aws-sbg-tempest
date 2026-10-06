"use client";
import { useEffect, useState } from "react";
/** "in 15 days" / "in 3h 20m" / "happening now", refreshed every minute. */
export default function Countdown({ to }: { to: string }) {
  const calc = () => { const ms = new Date(to).getTime() - Date.now(); if (ms < 0) return "happening now"; const m = Math.round(ms / 60000), h = Math.floor(m / 60), d = Math.floor(h / 24); if (d >= 2) return `in ${d} days`; if (h >= 1) return `in ${h}h ${m % 60}m`; return `in ${m} min`; };
  const [t, setT] = useState<string>(""); useEffect(() => { setT(calc()); const id = setInterval(() => setT(calc()), 60000); return () => clearInterval(id); }, [to]); // eslint-disable-line react-hooks/exhaustive-deps
  return <span className="countdown">{t}</span>;
}
