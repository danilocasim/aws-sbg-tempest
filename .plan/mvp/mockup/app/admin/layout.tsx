import "./admin.css";
import { Calendar, FileText, Inbox, Layers, Shield, Users } from "@/components/Icons";
import AdminShell from "./AdminShell";
import { applications, me, positionsFor } from "@/lib/data";
export const metadata = { title: "Admin" };
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pending = applications.filter((a) => a.status === "submitted").length;
  const role = positionsFor(me.id)[0]?.title ?? "Member";
  return (<>
    <div className="mock-banner">Mockup · in production this is admin.tempest.club behind Cloudflare Access (ADR-0008)</div>
    <div className="admin">
      <AdminShell user={{ name: me.displayName, role }} items={[{ href: "/admin", label: "Overview", icon: <Layers width={18} height={18} /> }, { href: "/admin/applications", label: "Applications", icon: <Inbox width={18} height={18} />, count: pending }, { href: "/admin/members", label: "Members", icon: <Users width={18} height={18} /> }, { href: "/admin/events", label: "Events", icon: <Calendar width={18} height={18} /> }, { href: "/admin/pages", label: "Pages", icon: <FileText width={18} height={18} /> }, { href: "/admin/terms", label: "Terms & positions", icon: <Shield width={18} height={18} /> }]} />
      <div className="admin-main">{children}</div>
    </div>
  </>);
}
