import { getDb, pingDb } from "./index";

/** GET /api/health → 200 {ok:true, db:true} or 503. Used by Coolify health checks and the uptime monitor. */
export async function healthResponse(app: "web" | "admin"): Promise<Response> {
  const started = Date.now();
  try {
    const db = await pingDb(getDb());
    return Response.json({ ok: true, app, db, ms: Date.now() - started }, { headers: { "cache-control": "no-store" } });
  } catch (err) {
    return Response.json({ ok: false, app, db: false, error: err instanceof Error ? err.message : String(err) }, { status: 503, headers: { "cache-control": "no-store" } });
  }
}
