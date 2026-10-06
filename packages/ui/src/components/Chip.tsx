import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "../cx";

/** §7 Chip. Selected state gets the aurora border via `aria-pressed`. Used for directory filters. */
export function Chip({ selected = false, children, className, ...rest }: { selected?: boolean; children: ReactNode } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">) {
  return (
    <button type="button" className={cx("chip", className)} aria-pressed={selected} {...rest}>
      {children}
    </button>
  );
}
