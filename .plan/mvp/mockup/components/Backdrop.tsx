"use client";
import { useEffect, useRef } from "react";
/** Fixed canvas starfield + nebula glows with cursor parallax. Pauses when hidden or under reduced motion. stars=false renders static CSS dots and no JS loop. */
export default function Backdrop({ stars = true }: { stars?: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null); const glow = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const RM = matchMedia("(prefers-reduced-motion: reduce)").matches; const hover = matchMedia("(hover: hover)").matches;
    let raf = 0; const cleanup: (() => void)[] = [];
    if (stars && canvas.current) {
      const c = canvas.current, ctx = c.getContext("2d")!; let w = 0, h = 0, lastW = 0; let field: { x: number; y: number; r: number; a: number; v: number; tw: number | null }[] = [];
      const build = () => { const d = devicePixelRatio; w = c.width = innerWidth * d; h = c.height = innerHeight * d; c.style.width = innerWidth + "px"; c.style.height = innerHeight + "px"; field = []; for (let i = 0; i < 200; i++) { const far = i < 140; field.push({ x: Math.random() * w, y: Math.random() * h, r: (far ? .6 : 1.1) * d, a: far ? .35 : .6, v: (far ? 2 : 4) / 3600 * d, tw: Math.random() < .1 ? Math.random() * 6.28 : null }); } lastW = innerWidth; };
      const resize = () => { if (innerWidth !== lastW) build(); }; // iOS URL-bar collapse only changes height
      const draw = (t: number) => { ctx.clearRect(0, 0, w, h); for (const s of field) { if (!RM) { s.y -= s.v; if (s.y < 0) s.y = h; } let a = s.a; if (s.tw !== null && !RM) a = s.a * (.6 + .4 * Math.sin(t / 1000 + s.tw)); ctx.globalAlpha = a; ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283); ctx.fill(); } if (!RM) raf = requestAnimationFrame(draw); };
      build(); addEventListener("resize", resize); draw(0);
      const vis = () => { if (document.hidden) cancelAnimationFrame(raf); else if (!RM) raf = requestAnimationFrame(draw); };
      document.addEventListener("visibilitychange", vis);
      cleanup.push(() => { removeEventListener("resize", resize); document.removeEventListener("visibilitychange", vis); cancelAnimationFrame(raf); });
    }
    if (stars && hover && !RM && glow.current) {
      let tx = 0, ty = 0, cx = 0, cy = 0, id = 0;
      const mv = (e: PointerEvent) => { tx = -(e.clientX / innerWidth - .5) * 24; ty = -(e.clientY / innerHeight - .5) * 24; };
      const loop = () => { cx += (tx - cx) * .08; cy += (ty - cy) * .08; glow.current!.style.transform = `translate(${cx}px,${cy}px)`; id = requestAnimationFrame(loop); };
      addEventListener("pointermove", mv, { passive: true }); loop();
      cleanup.push(() => { removeEventListener("pointermove", mv); cancelAnimationFrame(id); });
    }
    return () => cleanup.forEach((f) => f());
  }, [stars]);
  return (<>
    <div className="backdrop" aria-hidden><div className="glow" ref={glow} /></div>
    {stars ? <canvas id="stars" ref={canvas} aria-hidden /> : <div className="dots" aria-hidden />}
  </>);
}
