// Vercel KV(Upstash Redis) REST 최소 래퍼. 환경변수가 없으면 kvEnabled=false.
const URL_ = process.env.KV_REST_API_URL;
const TOKEN = process.env.KV_REST_API_TOKEN;

export const kvEnabled = Boolean(URL_ && TOKEN);

export async function kv(...cmd: (string | number)[]): Promise<unknown> {
  const res = await fetch(`${URL_}/${cmd.map((c) => encodeURIComponent(String(c))).join("/")}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`kv ${res.status}`);
  return ((await res.json()) as { result: unknown }).result;
}

export function isAdmin(req: Request) {
  const token = process.env.ADMIN_TOKEN;
  return Boolean(token) && req.headers.get("authorization") === `Bearer ${token}`;
}
