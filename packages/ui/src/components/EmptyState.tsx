import type { ReactNode } from "react";

/** §7 Empty state: small dragon-head mark, h3, one sentence, one button. */
export function EmptyState({ title, children, action, markSrc = "/brand/logo-mark.svg" }: { title: string; children: ReactNode; action?: ReactNode; markSrc?: string }) {
  return (
    <div className="empty">
      <img src={markSrc} alt="" width={72} height={72} />
      <h3>{title}</h3>
      <p className="muted">{children}</p>
      {action}
    </div>
  );
}
