import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../cx";

/** §7 Badge / eyebrow pill. Gold text on plum, uppercase 12px tracking 0.18em. `sm` is 24px tall, still 12px text. */
export function Badge({ children, icon, size = "md", neutral, className, ...rest }: { children: ReactNode; icon?: ReactNode; size?: "md" | "sm"; neutral?: boolean } & HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cx("badge", size === "sm" && "badge-sm", neutral && "badge-neutral", className)} {...rest}>
      {icon}
      {children}
    </span>
  );
}

/** Plain eyebrow text (no pill). */
export function Eyebrow({ children, className, ...rest }: { children: ReactNode } & HTMLAttributes<HTMLSpanElement>) {
  return <span className={cx("eyebrow", className)} {...rest}>{children}</span>;
}

/** Status text with a leading dot; never colour alone (§7 accessibility baseline). */
export function Status({ tone, children, className }: { tone: "success" | "warning" | "danger" | "info" | "muted"; children: ReactNode; className?: string }) {
  return <span className={cx("status", `status-${tone}`, className)}>{children}</span>;
}
