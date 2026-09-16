// 실시간 상담 가능 여부 수동 오버라이드 (admin.html에서 설정). 기존 api/status.js 이식.
import { isAdmin, kv, kvEnabled } from "@/lib/kv";

const KEY = "doion_live_status_override";
const noStore = { headers: { "Cache-Control": "no-store" } };

export async function GET() {
  if (!kvEnabled) return Response.json({ override: null, configured: false }, noStore);
  try {
    const raw = await kv("get", KEY);
    const override = raw === "true" ? true : raw === "false" ? false : null;
    return Response.json({ override, configured: true }, noStore);
  } catch {
    return Response.json({ override: null, configured: true, error: "kv_read_failed" }, noStore);
  }
}

export async function POST(req: Request) {
  if (!kvEnabled) return Response.json({ ok: false, error: "kv_not_configured" }, { status: 503 });
  if (!isAdmin(req)) return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const value = body.override === true ? true : body.override === false ? false : null;
  try {
    await kv("set", KEY, value === null ? "auto" : String(value));
    return Response.json({ ok: true, override: value }, noStore);
  } catch {
    return Response.json({ ok: false, error: "kv_write_failed" }, { status: 500 });
  }
}
