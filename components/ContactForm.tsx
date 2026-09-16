"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { industries, validate, type Errors } from "@/lib/inquiry";

type State = { status: "idle" | "sending" | "done" | "error"; message?: string };

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
      <div role="status" style={{ display: "grid", gap: 10 }}>
        <h2 className="title-lg" style={{ fontSize: "clamp(1.7rem, 1.3rem + 1.6vw, 2.4rem)" }}>상담 신청이 접수됐어요.</h2>
        <p className="muted">남겨주신 연락처로 대표가 직접 연락드립니다.</p>
        <p>
          <Link href="/portfolio" className="link">
            기다리시는 동안 포트폴리오 보기
          </Link>
        </p>
      </div>
    );
  }

  const field = (name: keyof Errors, label: string, input: React.ReactNode) => (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      {input}
      {errors[name] && (
        <p className="err" id={`${name}-err`}>
          {errors[name]}
        </p>
      )}
    </div>
  );
  const aria = (name: keyof Errors) => ({
    id: name,
    name,
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `${name}-err` : undefined,
  });

  return (
    <form onSubmit={onSubmit} noValidate style={{ display: "grid", gap: 20, position: "relative" }}>
      <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        {field("shop", "매장 이름", <input {...aria("shop")} autoComplete="organization" placeholder="예: 율전 PT 스튜디오" />)}
        {field("name", "담당자 이름", <input {...aria("name")} autoComplete="name" placeholder="예: 홍길동" />)}
        {field("phone", "연락처", <input {...aria("phone")} type="tel" inputMode="tel" autoComplete="tel" placeholder="010-0000-0000" />)}
        {field(
          "industry",
          "업종",
          <select {...aria("industry")} defaultValue="">
            <option value="" disabled>
              골라주세요
            </option>
            {industries.map((i) => (
              <option key={i}>{i}</option>
            ))}
          </select>
        )}
      </div>
      {field(
        "message",
        "문의 내용 (선택)",
        <textarea {...aria("message")} maxLength={1000} placeholder="지금 쓰는 인스타그램·블로그 주소나, 고민되는 점을 편하게 적어주세요." />
      )}

      {/* honeypot */}
      <div className="hp" aria-hidden>
        <label htmlFor="website">웹사이트</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="field">
        <label className="check">
          <input type="checkbox" {...aria("consent")} />
          <span>
            (필수) 상담 연락을 위한{" "}
            <Link href="/privacy" className="link" target="_blank">
              개인정보 수집·이용
            </Link>
            에 동의합니다. 매장 이름·담당자 이름·연락처·업종·문의 내용을 수집하고, 처리 후 3개월 뒤 파기합니다.
          </span>
        </label>
        {errors.consent && (
          <p className="err" id="consent-err">
            {errors.consent}
          </p>
        )}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
        <button type="submit" className="btn btn-primary" disabled={state.status === "sending"}>
          {state.status === "sending" ? "보내는 중…" : "상담 신청 보내기"}
        </button>
        <p role="alert" className="err" style={{ color: "var(--danger)" }}>
          {state.status === "error" ? state.message : ""}
        </p>
      </div>
    </form>
  );
}
