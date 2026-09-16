// 홈 실적 지표(누적 제작 매장 / 평균 제작 기간 / 설치한 NFC·QR 태그) — admin.html에서 수정. 기존 api/stats.js 이식.
import { isAdmin, kv, kvEnabled } from "@/lib/kv";
import { statDefaults } from "@/data/offer";

const KEY = "doion_stats_override";
const noStore = { headers: { "Cache-Control": "no-store" } };

function sanitize(body: Record<string, unknown>) {
  const out = { ...statDefaults };
  for (const k of Object.keys(statDefaults) as (keyof typeof statDefaults)[]) {
    const n = parseInt(String(body[k]), 10);
    if (!isNaN(n) && n >= 0) out[k] = n;
  }
  return out;
}

export async function GET() {
  if (!kvEnabled) return Response.json({ ...statDefaults, configured: false }, noStore);
  try {
    const raw = await kv("get", KEY);
    const stats = typeof raw === "string" ? sanitize(JSON.parse(raw)) : statDefaults;
    return Response.json({ ...stats, configured: true }, noStore);
  } catch {
    return Response.json({ ...statDefaults, configured: true, error: "kv_read_failed" }, noStore);
  }
}

export async function POST(req: Request) {
  if (!kvEnabled) return Response.json({ ok: false, error: "kv_not_configured" }, { status: 503 });
  if (!isAdmin(req)) return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  const stats = sanitize(await req.json().catch(() => ({})));
  try {
    await kv("set", KEY, JSON.stringify(stats));
    return Response.json({ ok: true, ...stats }, noStore);
  } catch {
    return Response.json({ ok: false, error: "kv_write_failed" }, { status: 500 });
  }
}
