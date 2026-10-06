import Link from "next/link";
import { Backdrop, EmptyState } from "@tempest/ui";

export default function NotFound() {
  return (
    <>
      <Backdrop />
      <div style={{ minHeight: "100dvh", display: "grid", placeItems: "center", padding: "2rem" }}>
        <EmptyState title="Nothing here" action={<Link href="/" className="btn btn-secondary">Go home</Link>}>
          That link doesn&apos;t point at anything. Card URLs are never reused, so this one was never printed.
        </EmptyState>
      </div>
    </>
  );
}
