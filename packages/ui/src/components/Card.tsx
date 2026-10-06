import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../cx";

/** §7 Card. `interactive` adds the lift and pointer-tracked highlight (pointer devices only). */
export function Card({ interactive, as: Tag = "div", children, className, ...rest }: { interactive?: boolean; as?: "div" | "article" | "section" | "li" | "a"; children: ReactNode; href?: string } & HTMLAttributes<HTMLElement>) {
  const Comp = Tag as "div";
  return (
    <Comp className={cx("card", interactive && "card-interactive", className)} {...rest}>
      {children}
    </Comp>
  );
}

/** §7 Glass panel: `--surface-glass`, blur 12px, hairline border. Sticky nav and the hero stat strip use it. */
export function GlassPanel({ children, className, ...rest }: { children: ReactNode } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cx("glass", className)} style={{ borderRadius: "var(--r-md)", padding: "var(--space-6)", ...rest.style }} {...rest}>
      {children}
    </div>
  );
}
