import type { ReactNode } from "react";
import { cx } from "../cx";
import { Badge } from "./Badge";

/** §7 Section header: eyebrow badge → h2 → one-line lead. Every landing section starts with this. */
export function SectionHeader({ eyebrow, title, lead, icon, className, id }: { eyebrow: string; title: ReactNode; lead?: ReactNode; icon?: ReactNode; className?: string; id?: string }) {
  return (
    <div className={cx("section-head", className)}>
      <Badge icon={icon}>{eyebrow}</Badge>
      <h2 id={id}>{title}</h2>
      {lead && <p>{lead}</p>}
    </div>
  );
}
