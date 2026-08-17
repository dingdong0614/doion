// 홈페이지 실적 지표(누적 제작 매장 / 평균 제작 기간 / 설치한 NFC·QR 태그) 관리자 수정 API
//
// 필요한 환경변수는 api/status.js와 동일합니다 (KV_REST_API_URL, KV_REST_API_TOKEN, ADMIN_TOKEN).
//
// 위 환경변수가 없으면 항상 기본값(configured: false)으로만 응답합니다 — 즉, KV를
// 연동하기 전까지는 index.html에 하드코딩된 기본 수치가 그대로 보입니다.

var KV_URL = process.env.KV_REST_API_URL;
var KV_TOKEN = process.env.KV_REST_API_TOKEN;
var ADMIN_TOKEN = process.env.ADMIN_TOKEN;
var STATS_KEY = "doion_stats_override";

var DEFAULTS = { stores: 12, days: 14, tags: 20 };

function kvGet(key) {
  return fetch(KV_URL + "/get/" + key, {
    headers: { Authorization: "Bearer " + KV_TOKEN }
  }).then(function (r) { return r.json(); });
}

function kvSet(key, value) {
  return fetch(KV_URL + "/set/" + key + "/" + encodeURIComponent(value), {
    headers: { Authorization: "Bearer " + KV_TOKEN }
  }).then(function (r) { return r.json(); });
}

function sanitize(body) {
  var out = {};
  ["stores", "days", "tags"].forEach(function (key) {
    var n = parseInt(body[key], 10);
    out[key] = isNaN(n) || n < 0 ? DEFAULTS[key] : n;
  });
  return out;
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (!KV_URL || !KV_TOKEN) {
    return res.status(200).json(Object.assign({}, DEFAULTS, { configured: false }));
  }

  if (req.method === "GET") {
    try {
      var data = await kvGet(STATS_KEY);
      var parsed = data && data.result ? JSON.parse(data.result) : null;
      var stats = parsed && typeof parsed === "object" ? sanitize(parsed) : DEFAULTS;
      return res.status(200).json(Object.assign({}, stats, { configured: true }));
    } catch (e) {
      return res.status(200).json(Object.assign({}, DEFAULTS, { configured: true, error: "kv_read_failed" }));
    }
  }

  if (req.method === "POST") {
    var authHeader = req.headers.authorization || "";
    if (!ADMIN_TOKEN || authHeader !== "Bearer " + ADMIN_TOKEN) {
      return res.status(401).json({ ok: false, error: "unauthorized" });
    }
    var body = req.body || {};
    var stats = sanitize(body);
    try {
      await kvSet(STATS_KEY, JSON.stringify(stats));
      return res.status(200).json(Object.assign({ ok: true }, stats));
    } catch (e) {
      return res.status(500).json({ ok: false, error: "kv_write_failed" });
    }
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ ok: false, error: "method_not_allowed" });
};
