import type { Metadata } from "next";
import Link from "next/link";
import { steps } from "@/data/offer";

export const metadata: Metadata = {
  title: "웹사이트 제작 진행 방식",
  description: "상담, 제작(약 2주), 납품, 운영까지 네 단계. 대표가 처음부터 끝까지 직접 소통합니다.",
  alternates: { canonical: "/process" },
  openGraph: { url: "/process" },
};

export default function ProcessPage() {
  return (
    <>
      <section className="hero wrap" style={{ paddingBottom: 56 }}>
        <h1 className="title-lg">
          전화 한 통에서
          <br />
          <span className="dim">매달 관리까지.</span>
        </h1>
        <p className="lead" style={{ marginTop: 20 }}>
          담당자가 바뀌지 않습니다. 첫 상담부터 운영까지 대표가 직접 연락드려요.
        </p>
      </section>

      <section className="wrap" aria-label="진행 단계">
        <ol className="steps">
          {steps.map((s) => (
            <li key={s.title}>
              <h2 className="h3">{s.title}</h2>
              <p>{s.body}</p>
              {s.time && <span className="time">{s.time}</span>}
            </li>
          ))}
        </ol>
        <div className="hero-cta" style={{ marginTop: 56 }}>
          <Link href="/contact" className="btn btn-primary">
            무료 상담 신청
          </Link>
          <Link href="/pricing" className="btn btn-ghost">
            가격 보기
          </Link>
        </div>
      </section>
    </>
  );
}
