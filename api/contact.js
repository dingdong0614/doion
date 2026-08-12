/**
 * 문의 폼 접수 시 관리자에게 이메일 발송
 * POST만 허용. Resend API(https://resend.com) 사용 —
 * Vercel 프로젝트 환경변수에 RESEND_API_KEY, CONTACT_TO_EMAIL 설정 필요.
 */

function readBody(req) {
  return new Promise((resolve, reject) => {
    if (req.body !== undefined) {
      try {
        resolve(typeof req.body === "string" ? JSON.parse(req.body) : req.body);
      } catch {
        resolve({});
      }
      return;
    }
    let raw = "";
    req.on("data", (chunk) => (raw += chunk));
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        resolve({});
      }
    });
    req.on("error", reject);
  });
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "허용되지 않은 메서드입니다." });
    return;
  }

  const body = await readBody(req);
  const shopName = (body.shopName || "").toString().trim();
  const managerName = (body.managerName || "").toString().trim();
  const phone = (body.phone || "").toString().trim();

  if (!shopName || !managerName || !phone) {
    res.status(400).json({ error: "모든 항목을 입력해주세요." });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !toEmail) {
    res.status(500).json({ error: "이메일 발송 설정이 완료되지 않았습니다. RESEND_API_KEY / CONTACT_TO_EMAIL 환경변수를 확인해주세요." });
    return;
  }

  try {
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "doion 문의 <onboarding@resend.dev>",
        to: [toEmail],
        subject: `[doion 문의] ${shopName} · ${managerName}`,
        text: `새 상담 신청이 접수되었습니다.\n\n매장 이름: ${shopName}\n담당자 이름: ${managerName}\n연락처: ${phone}`,
      }),
    });

    if (!resendRes.ok) {
      const detail = await resendRes.text();
      throw new Error(`Resend API 오류 (${resendRes.status}): ${detail}`);
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "이메일 발송에 실패했습니다.", detail: String(err.message || err) });
  }
};
