import type { CSSProperties } from "react";
import { cx, initials } from "../cx";

const hue = (s: string) => { let h = 0; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) % 360; return h; };

/** 1:1 avatar with a 2px `--border` ring. Falls back to initials on a name-derived gradient when there is no photo. */
export function Avatar({ name, src, size = "md", className }: { name: string; src?: string | null; size?: "sm" | "md" | "lg" | "xl"; className?: string }) {
  if (src) {
    return <span className={cx("avatar", `avatar-${size}`, className)}><img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></span>;
  }
  return (
    <span className={cx("avatar", `avatar-${size}`, className)} data-hue style={{ "--h": hue(name) } as CSSProperties} aria-hidden>
      {initials(name)}
    </span>
  );
}

export function AvatarStack({ names, size = "sm" }: { names: string[]; size?: "sm" | "md" }) {
  return <span className="avatar-stack">{names.map((n) => <Avatar key={n} name={n} size={size} />)}</span>;
}
