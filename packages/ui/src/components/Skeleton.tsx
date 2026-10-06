import type { CSSProperties } from "react";

/** §7 Skeleton: surface block with an aurora shimmer at 8%. `aria-hidden`; pair with a visually hidden "Loading…". */
export function Skeleton({ width = "100%", height = 16, radius, style, className }: { width?: number | string; height?: number | string; radius?: string; style?: CSSProperties; className?: string }) {
  return <div className={["skeleton", className].filter(Boolean).join(" ")} aria-hidden style={{ width, height, borderRadius: radius, ...style }} />;
}
