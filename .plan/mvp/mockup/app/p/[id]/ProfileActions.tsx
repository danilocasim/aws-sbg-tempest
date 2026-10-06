"use client";
import { useToast } from "@/components/Toast";
import { club } from "@/lib/data";
export default function ProfileActions({ id, name }: { id: string; name: string }) {
  const toast = useToast(); const url = `https://${club.domain}/p/${id}`;
  const copy = async () => { try { await navigator.clipboard.writeText(url); toast("Link copied"); } catch { toast(url); } };
  const share = async () => { if (navigator.share) { try { await navigator.share({ title: `${name} · Tempest`, url }); } catch { /* cancelled */ } } else copy(); };
  return (<div className="profile-actions"><button className="btn btn-ghost btn-sm" onClick={share}>Share</button><button className="btn btn-ghost btn-sm" onClick={copy}>Copy link</button></div>);
}
