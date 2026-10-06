import type { ReactNode, TableHTMLAttributes } from "react";
import { cx } from "../cx";

/** §7 Table (admin): dense 44px rows, `--bg-band` header, zebra, row hover. Wrap in a horizontally scrolling container on small screens. */
export function Table({ caption, head, children, className, ...rest }: { caption?: string; head: ReactNode[]; children: ReactNode } & TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table className={cx("table", className)} {...rest}>
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr>{head.map((h, i) => <th key={i} scope="col">{h}</th>)}</tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
