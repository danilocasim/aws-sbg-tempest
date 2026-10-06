// One sender for both apps. Dev: SMTP_URL (mailpit, never real inboxes). Prod: EMAIL_API_KEY → Resend.
import nodemailer from "nodemailer";

export type Mail = { to: string; subject: string; html: string; text: string; replyTo?: string };
export type SendResult = { id: string; transport: "smtp" | "resend" };

const from = () => process.env.EMAIL_FROM ?? "Tempest <no-reply@localhost>";

export async function sendEmail(mail: Mail): Promise<SendResult> {
  const smtp = process.env.SMTP_URL;
  if (smtp) {
    const t = nodemailer.createTransport(smtp);
    const info = await t.sendMail({ from: from(), ...mail });
    return { id: info.messageId, transport: "smtp" };
  }
  const key = process.env.EMAIL_API_KEY;
  if (!key) throw new Error("Set SMTP_URL (dev) or EMAIL_API_KEY (prod) to send email");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: from(), to: [mail.to], subject: mail.subject, html: mail.html, text: mail.text, reply_to: mail.replyTo }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
  const body = (await res.json()) as { id: string };
  return { id: body.id, transport: "resend" };
}

export { setPasswordEmail } from "./templates/set-password";
export { layout } from "./templates/layout";
