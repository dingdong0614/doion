import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { buildPlans, carePlans } from "@/data/offer";

export const metadata: Metadata = {
  title: "웹사이트 제작 가격",
  description:
    "소규모 매장 웹사이트 제작 30만·60만·80만원, 제작 후 관리 Doion Care 월 5만·10만·13만원. 관리비는 최소 1년간 고정됩니다.",
  alternates: { canonical: "/pricing" },
  openGraph: { url: "/pricing" },
};

function Plan({ p, unit }: { p: { name: string; price: number; features: string[]; recommended?: boolean }; unit: string }) {
  return (
    <article className="plan" data-rec={Boolean(p.recommended)}>
      {p.recommended && <span className="rec-label">추천</span>}
      <h3 className="h3">{p.name}</h3>
      <p className="price">
        {p.price}
        <small>{unit}</small>
      </p>
      <ul>
        {p.features.map((f) => (
          <li key={f}>
            <Check size={16} aria-hidden />
            {f}
          </li>
        ))}
      </ul>
    </article>
  );
}

export default function PricingPage() {
  return (
    <>
      <section className="hero wrap" style={{ paddingBottom: 48 }}>
        <h1 className="title-lg">
          제작 한 번,
          <br />
          관리는 필요한 만큼.
        </h1>
        <p className="lead" style={{ marginTop: 20 }}>
          매장 규모와 필요한 기능에 맞춰 세 가지로 준비했습니다. 견적 요청 전에 가격부터 확인하세요.
        </p>
      </section>

      <section className="wrap" aria-labelledby="build-title">
        <h2 id="build-title" className="title-lg" style={{ fontSize: "clamp(1.9rem, 1.3rem + 2.4vw, 3.2rem)", marginBottom: 28 }}>
          제작 패키지.
        </h2>
        <div className="plans">
          {buildPlans.map((p) => (
            <Plan key={p.name} p={p} unit="만원" />
          ))}
        </div>
        <p className="note" style={{ marginTop: 16 }}>
          VAT 별도. 도메인·서버 비용은 상담 때 따로 안내드립니다.
        </p>
      </section>

      <section className="section wrap" aria-labelledby="care-title">
        <div className="section-head">
          <h2 id="care-title" className="title-lg" style={{ fontSize: "clamp(1.9rem, 1.3rem + 2.4vw, 3.2rem)" }}>
            만든 뒤에는 Doion Care.
          </h2>
          <p className="lead">매달 필요한 수정만 맡기는 관리 서비스입니다. 필요할 때 신청하시면 됩니다.</p>
        </div>
        <div className="plans">
          {carePlans.map((p) => (
            <Plan key={p.name} p={p} unit="만원 / 월" />
          ))}
        </div>
        <p className="note" style={{ marginTop: 16 }}>
          실시간 혼잡도 표시 옵션: 전 패키지 공통 월 2만원 추가. 혼잡도는 사장님이 직접 바꾸고, 데이터가 쌓이면 요일·시간대별
          평균도 자동으로 보여줍니다.
        </p>

        <div className="cta-band" style={{ marginTop: "clamp(48px, 7vw, 96px)" }}>
          <h2 className="title-lg" style={{ fontSize: "clamp(1.9rem, 1.3rem + 2.4vw, 3.2rem)" }}>관리비는 1년간 오르지 않습니다.</h2>
          <p className="muted" style={{ maxWidth: "36em" }}>
            Doion Care 비용은 계약일부터 최소 1년 동안 고정입니다. 그 뒤 조정이 필요하면 일방적으로 올리지 않고 서로 협의해서
            정합니다.
          </p>
          <div className="hero-cta" style={{ marginTop: 0 }}>
            <Link href="/contact" className="btn btn-primary">
              무료 상담 신청
            </Link>
            <Link href="/portfolio" className="btn btn-ghost">
              포트폴리오 보기
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
