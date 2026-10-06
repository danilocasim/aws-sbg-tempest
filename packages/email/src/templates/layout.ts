// Plain-HTML email shell. Inline styles only; email clients ignore stylesheets. Colours are the brand tokens' literal values
// (email cannot read CSS variables) and are the one sanctioned place for raw hex outside packages/ui/tokens.css.
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export function layout({ title, preheader, bodyHtml, cta }: { title: string; preheader: string; bodyHtml: string; cta?: { label: string; url: string } }) {
  const button = cta
    ? `<p style="margin:28px 0"><a href="${esc(cta.url)}" style="display:inline-block;background:#f5a044;color:#000017;text-decoration:none;font-weight:600;font-size:16px;padding:14px 24px;border-radius:9999px">${esc(cta.label)}</a></p><p style="font-size:13px;color:#8b93a7;word-break:break-all">Or paste this link into your browser:<br>${esc(cta.url)}</p>`
    : "";
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${esc(title)}</title></head>
<body style="margin:0;background:#040615;color:#e0e9f7;font-family:Inter,-apple-system,Segoe UI,Roboto,sans-serif;font-size:16px;line-height:1.6">
<span style="display:none;max-height:0;overflow:hidden">${esc(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#040615"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#10111e;border:1px solid #282a36;border-radius:16px">
<tr><td style="padding:32px">
<p style="margin:0 0 8px;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#b6becc">AWS Student Builder Group · Tempest</p>
<h1 style="margin:0 0 16px;font-size:24px;line-height:1.2;color:#ffffff">${esc(title)}</h1>
${bodyHtml}${button}
</td></tr></table>
<p style="max-width:560px;margin:16px 0 0;font-size:12px;color:#8b93a7">You received this because an officer of AWS Student Builder Group – Tempest created or updated your member account. If that was not expected, ignore this message; nothing changes until you act on it.</p>
</td></tr></table></body></html>`;
}
