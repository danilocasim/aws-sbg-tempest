import Link from "next/link";
import Image from "next/image";
import Backdrop from "@/components/Backdrop";
export default function NotFound() {
  return (<><Backdrop /><div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem" }}><div className="empty"><Image src="/brand/logo.png" alt="" width={88} height={88} /><h1 style={{ fontSize: "1.5rem" }}>Nothing here</h1><p className="muted">That link doesn&apos;t point at anything. Card URLs are never reused, so this one was never printed.</p><Link href="/" className="btn btn-secondary">Go home</Link></div></div></>);
}
