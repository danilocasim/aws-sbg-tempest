// `pnpm email:test [recipient]` → renders the set-password template and sends it through the configured transport.
import "dotenv/config";
import { sendEmail, setPasswordEmail } from "./index";

const to = process.argv[2] ?? "test@example.test";
const mail = setPasswordEmail({ name: "Test Member", url: `${process.env.PUBLIC_BASE_URL ?? "http://localhost:3000"}/set-password/example-token` });
const r = await sendEmail({ to, ...mail });
console.log(`sent via ${r.transport} to ${to}: ${r.id}`);
