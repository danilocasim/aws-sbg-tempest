import { layout } from "./layout";

/** Sent on CSV import / application accept (ADR-0014). `url` is the single-use set-password link. */
export function setPasswordEmail({ name, url, expiresInHours = 48 }: { name: string; url: string; expiresInHours?: number }) {
  const subject = "Set your Tempest password";
  const text = `Hi ${name},\n\nYour Tempest member account is ready. Set a password to sign in and edit your profile:\n\n${url}\n\nThe link works once and expires in ${expiresInHours} hours.\n\n— AWS Student Builder Group · Tempest`;
  const html = layout({
    title: subject,
    preheader: `Your member account is ready. The link expires in ${expiresInHours} hours.`,
    bodyHtml: `<p style="margin:0 0 12px">Hi ${name},</p><p style="margin:0">Your Tempest member account is ready. Set a password to sign in, edit your profile, and get your NFC card pointing at it.</p><p style="margin:12px 0 0;color:#b6becc;font-size:14px">The link works once and expires in ${expiresInHours} hours.</p>`,
    cta: { label: "Set my password", url },
  });
  return { subject, html, text };
}
