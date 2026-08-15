// 실시간 상담 가능 여부 수동 오버라이드 API (Vercel Serverless Function)
//
// 필요한 환경변수 (Vercel 프로젝트 > Settings > Environment Variables):
//  - KV_REST_API_URL, KV_REST_API_TOKEN : Vercel 프로젝트에 KV(Upstash Redis)를
//    연동하면 자동으로 생성됩니다. (Storage 탭 > Create Database > KV)
//  - ADMIN_TOKEN : admin.html 관리자 페이지 로그인 비밀번호로 쓸 값. 직접 정해서
//    환경변수에 등록하세요 (예: 영문+숫자 조합).
//
// 위 환경변수가 없으면 항상 자동 모드(override: null)로만 응답합니다 — 즉, KV를
// 연동하기 전까지는 사이트가 기존처럼 시간표 기준으로만 동작하니 안전합니다.

var KV_URL = process.env.KV_REST_API_URL;
var KV_TOKEN = process.env.KV_REST_API_TOKEN;
var ADMIN_TOKEN = process.env.ADMIN_TOKEN;
var STATUS_KEY = "doion_live_status_override";

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

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (!KV_URL || !KV_TOKEN) {
    return res.status(200).json({ override: null, configured: false });
  }

  if (req.method === "GET") {
    try {
      var data = await kvGet(STATUS_KEY);
      var raw = data && data.result;
      var override = raw === "true" ? true : raw === "false" ? false : null;
      return res.status(200).json({ override: override, configured: true });
    } catch (e) {
      return res.status(200).json({ override: null, configured: true, error: "kv_read_failed" });
    }
  }

  if (req.method === "POST") {
    var authHeader = req.headers.authorization || "";
    if (!ADMIN_TOKEN || authHeader !== "Bearer " + ADMIN_TOKEN) {
      return res.status(401).json({ ok: false, error: "unauthorized" });
    }
    var body = req.body || {};
    var value = body.override; // true | false | null
    var toStore = value === true ? "true" : value === false ? "false" : "auto";
    try {
      await kvSet(STATUS_KEY, toStore);
      return res.status(200).json({ ok: true, override: value });
    } catch (e) {
      return res.status(500).json({ ok: false, error: "kv_write_failed" });
    }
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ ok: false, error: "method_not_allowed" });
};
