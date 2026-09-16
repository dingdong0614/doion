// 무료 상담 신청 → Resend로 ceo@doion.co.kr에 알림 메일.
import { headers } from "next/headers";
import { validate } from "@/lib/inquiry";
import { kv, kvEnabled } from "@/lib/kv";
import { site } from "@/lib/site";

const WINDOW_SEC = 600;
const MAX_PER_WINDOW = 5;
// ponytail: KV 없을 때는 인스턴스 메모리 기준이라 인스턴스가 여러 개면 느슨해짐. 운영에선 KV 연결 권장.
const memory = new Map<string, { n: number; until: number }>();

async function tooMany(ip: string) {
  const key = `doion_rl_contact_${ip}`;
  if (kvEnabled) {
    try {
      const n = Number(await kv("incr", key));
      if (n === 1) await kv("expire", key, WINDOW_SEC);
      return n > MAX_PER_WINDOW;
    } catch {
      // KV 장애 시 메모리로 폴백
    }
  }
  const now = Date.now();
  const cur = memory.get(key);
  if (!cur || cur.until < now) {
    memory.set(key, { n: 1, until: now + WINDOW_SEC * 1000 });
    return false;
  }
  cur.n++;
  return cur.n > MAX_PER_WINDOW;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return Response.json({ ok: false, error: "잘못된 요청입니다." }, { status: 400 });

  // honeypot: 사람은 못 보는 칸이 채워져 있으면 봇. 성공처럼 응답하고 버림.
  if (body.website) return Response.json({ ok: true });

  const h = await headers();
  const ip = h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (await tooMany(ip)) {
    return Response.json({ ok: false, error: "짧은 시간에 신청이 많았어요. 10분 뒤 다시 시도하시거나 전화 주세요." }, { status: 429 });
  }

  const { data, errors } = validate(body);
  if (Object.keys(errors).length) return Response.json({ ok: false, errors }, { status: 422 });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] RESEND_API_KEY 없음 — 개발 모드라 메일 대신 로그만 남김", { ...data, phone: "***" });
      return Response.json({ ok: true, dev: true });
    }
    // Resend 키가 없으면 검증·횟수 제한만 서버에서 하고, 메일은 브라우저가 Web3Forms로 보냄
    // (기존 정적 사이트와 같은 방식. Web3Forms 무료 플랜은 서버 호출을 막음)
    return Response.json({ ok: true, relay: "web3forms" });
  }

  const rows: [string, string][] = [
    ["매장", data.shop],
    ["담당자", data.name],
    ["연락처", data.phone],
    ["업종", data.industry],
    ["문의 내용", data.message || "(없음)"],
  ];
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM ?? "doion 상담 신청 <noreply@doion.co.kr>",
      to: [process.env.CONTACT_TO ?? site.email],
      subject: `[상담 신청] ${data.shop} (${data.industry})`,
      text: rows.map(([k, v]) => `${k}: ${v}`).join("\n"),
      html: `<table>${rows.map(([k, v]) => `<tr><th align="left">${k}</th><td style="white-space:pre-wrap">${esc(v)}</td></tr>`).join("")}</table>`,
    }),
  });

  if (!res.ok) {
    console.error("[contact] resend failed", res.status, await res.text().catch(() => ""));
    return Response.json({ ok: false, error: `접수 중 문제가 생겼어요. ${site.phone}로 전화 주시면 바로 도와드릴게요.` }, { status: 502 });
  }
  return Response.json({ ok: true });
}
