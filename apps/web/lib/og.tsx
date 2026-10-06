import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const ogSize = { width: 1200, height: 630 };

// Brand colours as literals: next/og renders Satori, which cannot read CSS variables. Values mirror packages/ui/tokens.css.
const c = { bg: "#040615", surface: "#10111e", border: "#282a36", fg: "#ffffff", muted: "#d1d9e8", subtle: "#b6becc", cyan: "#98ecff", gold: "#ffd35e", plum: "#3c324c", goldBorder: "#836954", aurora1: "#87ccff", aurora2: "#b4a5fa", aurora3: "#eecba1", violet: "#342f57", steel: "#253144" };

async function asset(name: string) {
  const buf = await readFile(path.join(process.cwd(), "public", "brand", name));
  return `data:image/png;base64,${buf.toString("base64")}`;
}

async function fonts() {
  const dir = path.join(process.cwd(), "public", "brand", "fonts");
  try {
    const [display, body] = await Promise.all([readFile(path.join(dir, "SpaceGrotesk-Bold.woff")), readFile(path.join(dir, "Inter-Regular.woff"))]);
    return [
      { name: "Space Grotesk", data: display, weight: 700 as const, style: "normal" as const },
      { name: "Inter", data: body, weight: 400 as const, style: "normal" as const },
    ];
  } catch {
    return [];
  }
}

/** Shared OG template: night-sky canvas, logo, eyebrow badge, aurora headline, subtitle. */
export async function ogImage({ title, subtitle, eyebrow = "AWS Student Builder Group · Tempest" }: { title: string; subtitle?: string; eyebrow?: string }) {
  const [logo, fontList] = await Promise.all([asset("logo.png"), fonts()]);
  const display = fontList.length ? "Space Grotesk" : "sans-serif";
  const body = fontList.length ? "Inter" : "sans-serif";
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: c.bg, color: c.fg, position: "relative", fontFamily: body }}>
        <div style={{ position: "absolute", left: -200, top: -200, width: 700, height: 700, borderRadius: 9999, background: `radial-gradient(circle, ${c.violet} 0%, ${c.bg} 70%)`, opacity: 0.9, display: "flex" }} />
        <div style={{ position: "absolute", right: -220, top: 60, width: 640, height: 640, borderRadius: 9999, background: `radial-gradient(circle, ${c.steel} 0%, ${c.bg} 70%)`, display: "flex" }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, width: "100%", height: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} width={72} height={72} style={{ borderRadius: 9999 }} alt="" />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 18, letterSpacing: 4, textTransform: "uppercase", color: c.subtle }}>AWS Student Builder Group</div>
              <div style={{ fontSize: 36, fontFamily: display, color: c.cyan, fontWeight: 700 }}>Tempest</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <div style={{ display: "flex", alignSelf: "flex-start", padding: "10px 22px", borderRadius: 9999, background: c.plum, border: `2px solid ${c.goldBorder}`, color: c.gold, fontSize: 20, letterSpacing: 4, textTransform: "uppercase" }}>{eyebrow}</div>
            <div style={{ fontSize: 84, lineHeight: 1.02, fontFamily: display, fontWeight: 700, letterSpacing: -2, backgroundImage: `linear-gradient(90deg, ${c.aurora1}, ${c.aurora2} 55%, ${c.aurora3})`, backgroundClip: "text", color: "transparent", maxWidth: 1000 }}>{title}</div>
            {subtitle && <div style={{ fontSize: 30, color: c.muted, maxWidth: 900 }}>{subtitle}</div>}
          </div>
        </div>
      </div>
    ),
    { ...ogSize, fonts: fontList },
  );
}
