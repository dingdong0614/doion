"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { industries, validate, type Errors } from "@/lib/inquiry";
import Icon from "./Icon";

type State = { status: "idle" | "sending" | "done" | "error"; message?: string };

// 기존 사이트에서 쓰던 공개용 Web3Forms 키(브라우저에 노출되는 값). 수신 메일 변경은 web3forms.com에서 재발급.
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "70c6c844-d397-4367-a7d3-21bb1f7a655b";

async function relayToWeb3Forms(d: Record<string, FormDataEntryValue>) {
  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: WEB3FORMS_KEY,
      subject: `[doion 상담 신청] ${d.shop} (${d.industry})`,
      from_name: "doion 웹사이트 상담 신청",
      매장: d.shop,
      담당자: d.name,
      연락처: d.phone,
      업종: d.industry,
      문의내용: d.message || "(없음)",
    }),
  });
  return ((await res.json()) as { success?: boolean }).success === true;
}

export default function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<State>({ status: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const raw = Object.fromEntries(new FormData(form));
    const { errors: errs } = validate(raw);
    setErrors(errs);
    if (Object.keys(errs).length) {
      // 첫 오류 칸으로 초점(업종은 첫 칩)
      form.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`)?.focus();
      return;
    }

    setState({ status: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...raw, consent: raw.consent === "on" }),
      });
      const json = await res.json();
      if (json.ok && json.relay === "web3forms" && !(await relayToWeb3Forms(raw))) {
        setState({ status: "error", message: "접수 중 문제가 생겼어요. 010-9786-2433로 전화 주시면 바로 도와드릴게요." });
        return;
      }
      if (json.ok) {
        form.reset();
        setState({ status: "done" });
      } else {
        if (json.errors) setErrors(json.errors);
        setState({ status: "error", message: json.error ?? "입력값을 다시 확인해주세요." });
      }
    } catch {
      setState({ status: "error", message: "인터넷 연결을 확인한 뒤 다시 보내주세요." });
    }
  }

  if (state.status === "done") {
    return (
      <div className="done" role="status" tabIndex={-1} ref={(el) => el?.focus()} style={{ "--c": "1 / 25" } as React.CSSProperties}>
        <p className="t-h2">상담 신청이 접수됐어요.</p>
        <p>남겨주신 연락처로 대표가 직접 연락드립니다.</p>
        <p>
          <Link href="/portfolio" className="ul">
            기다리시는 동안 포트폴리오 보기
          </Link>
        </p>
      </div>
    );
  }

  const err = (name: keyof Errors) =>
    errors[name] ? (
      <p className="err" id={`${name}-err`}>
        {errors[name]}
      </p>
    ) : null;
  const aria = (name: keyof Errors) => ({
    id: name,
    name,
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `${name}-err` : undefined,
  });
  const col = (c: string, cm?: string) => ({ "--c": c, ...(cm ? { "--cm": cm } : {}) }) as React.CSSProperties;

  return (
    <form className="sub form" onSubmit={onSubmit} noValidate style={{ position: "relative" }}>
      <div className="field" style={col("1 / 9")}>
        <label htmlFor="shop">매장 이름</label>
        <input className="inp" {...aria("shop")} autoComplete="organization" placeholder="예: 율전 PT 스튜디오" />
        {err("shop")}
      </div>
      <div className="field" style={col("9 / 17")}>
        <label htmlFor="name">담당자 이름</label>
        <input className="inp" {...aria("name")} autoComplete="name" placeholder="예: 홍길동" />
        {err("name")}
      </div>
      <div className="field" style={col("17 / 25")}>
        <label htmlFor="phone">연락처</label>
        <input className="inp" {...aria("phone")} type="tel" inputMode="tel" autoComplete="tel" placeholder="010-0000-0000" />
        {err("phone")}
      </div>

      {/* 업종: 기존 select와 같은 값(lib/inquiry.ts industries)을 라디오 칩으로 */}
      <fieldset className="field" style={col("1 / 25")} aria-describedby={errors.industry ? "industry-err" : undefined}>
        <legend>어떤 가게를 하고 계세요?</legend>
        <div className="chips" id="industry">
          {industries.map((i) => (
            <label key={i} className="chip">
              <input type="radio" name="industry" value={i} />
              <span>{i}</span>
            </label>
          ))}
        </div>
        {err("industry")}
      </fieldset>

      <div className="field" style={col("1 / 15")}>
        <label htmlFor="message">문의 내용 (선택)</label>
        <textarea className="inp" {...aria("message")} maxLength={1000} placeholder="지금 쓰는 인스타그램·블로그 주소나, 고민되는 점을 편하게 적어주세요." />
      </div>

      {/* honeypot */}
      <div className="hp" aria-hidden>
        <label htmlFor="website">웹사이트</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="send" style={col("16 / 25")}>
        <div>
          <label className="check">
            <input type="checkbox" {...aria("consent")} />
            <span>
              (필수) 상담 연락을 위한 개인정보 수집·이용에 동의합니다. 매장 이름·담당자 이름·연락처·업종·문의 내용을 수집하고, 처리 완료 후 1년 뒤 파기합니다. 접수·알림을 위해 Vercel(미국)·Web3Forms(인도) 서버로 국외 이전됩니다.
            </span>
          </label>
          {/* 문장 속 작은 링크 대신 따로 한 줄(터치 48px) */}
          <Link href="/privacy" className="ul t-cap consent-link" target="_blank">
            개인정보 수집·이용 내용 보기<span className="sr-only"> (새 탭)</span>
            <Icon name="out" />
          </Link>
          {err("consent")}
        </div>
        <button type="submit" className="btn btn-ink" disabled={state.status === "sending"}>
          {state.status === "sending" ? "보내는 중" : "상담 신청 보내기"}
          <Icon name="out" />
        </button>
        <p role="alert" className="err">
          {state.status === "error" ? state.message : ""}
        </p>
      </div>
    </form>
  );
}
