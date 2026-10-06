import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "../cx";
import { ArrowRight } from "../icons";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Common = { variant?: Variant; size?: "md" | "sm"; block?: boolean; loading?: boolean; arrow?: boolean; children: ReactNode; className?: string };

const classes = ({ variant = "primary", size, block, loading, className }: Common) =>
  cx("btn", `btn-${variant}`, size === "sm" && "btn-sm", block && "btn-block", loading && "is-busy", className);

/** §7 Button. `primary` is the single ember action per view. `loading` locks width and swaps the label for a spinner. */
export function Button({ variant, size, block, loading, arrow, children, className, ...rest }: Common & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">) {
  return (
    <button type="button" className={classes({ variant, size, block, loading, className, children })} disabled={loading || rest.disabled} aria-busy={loading || undefined} {...rest}>
      {children}
      {arrow && <ArrowRight className="arrow" />}
    </button>
  );
}

/** Same look as Button, rendered as an anchor (use for navigation). */
export function ButtonLink({ variant, size, block, loading, arrow, children, className, ...rest }: Common & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children">) {
  return (
    <a className={classes({ variant, size, block, loading, className, children })} {...rest}>
      {children}
      {arrow && <ArrowRight className="arrow" />}
    </a>
  );
}
