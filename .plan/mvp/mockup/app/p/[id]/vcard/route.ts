import { byCanonical, club } from "@/lib/data";
/** GET /p/<id>/vcard → text/vcard. Served, not generated client-side, so iOS opens the Contacts sheet. */
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const m = byCanonical(id);
  if (!m || m.visibility === "inactive") return new Response("Not found", { status: 404 });
  const [first, ...rest] = m.displayName.split(" ");
  const lines = ["BEGIN:VCARD", "VERSION:3.0", `N:${rest.join(" ")};${first};;;`, `FN:${m.displayName}`, `ORG:${club.fullName}`, m.headline && `TITLE:${m.headline}`, `URL:https://${club.domain}/p/${m.canonicalId}`, m.contactEmail && `EMAIL;TYPE=INTERNET:${m.contactEmail}`, m.contactPhone && `TEL;TYPE=CELL:${m.contactPhone}`, "END:VCARD"].filter(Boolean).join("\r\n") + "\r\n";
  return new Response(lines, { headers: { "Content-Type": "text/vcard; charset=utf-8", "Content-Disposition": `attachment; filename="${m.displayName.replace(/[^\w ]/g, "")}.vcf"`, "Cache-Control": "private, max-age=60" } });
}
