import type { Metadata } from "next";
import { og } from "@/lib/site";
import Link from "next/link";
import { FileText } from "lucide-react";
import PortfolioBrowser from "@/components/PortfolioBrowser";
import { categories, portfolio, proposals } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "헬스장·뷰티샵·학원 웹사이트 제작 사례 · 포트폴리오",
  description:
    "doion이 만든 실제 운영 중인 웹사이트와 업종별 영업용 데모. 헬스장, 학원, 뷰티 인플루언서, 지역 디렉토리, 요양원, 교회 사례를 라이브 화면으로 확인하세요.",
  alternates: { canonical: "/portfolio" },
  openGraph: og("/portfolio"),
};

export default function PortfolioPage() {
  return (
    <>
      <section className="hero wrap" style={{ paddingBottom: 40 }}>
        <h1 className="title-lg">
          만든 사이트,
          <br />
          <span className="dim">지금 열어보세요.</span>
        </h1>
        <p className="lead" style={{ marginTop: 20 }}>
          실제 운영 중인 사이트와 업종별 영업용 데모를 함께 모았습니다. 카드를 누르면 라이브 사이트가 새 탭에서 열립니다.
        </p>
      </section>

      <section className="wrap" aria-labelledby="list-title">
        <h2 id="list-title" className="sr-only">
          사례 목록
        </h2>
        <PortfolioBrowser items={portfolio} categories={categories} />
      </section>

      <section className="section wrap" aria-labelledby="proposal-title">
        <div className="section-head">
          <h2 id="proposal-title" className="title-md">
            업종별 제안서.
          </h2>
          <p className="lead">업종마다 필요한 기능과 강조할 부분이 다릅니다. 해당 업종 제안서를 PDF로 바로 볼 수 있어요.</p>
        </div>
        <ul className="reason-list">
          {proposals.map((p) => (
            <li key={p.file}>
              <a href={`/assets/proposals/${p.file}`} target="_blank" rel="noopener noreferrer" style={{ display: "flex", gap: 14 }}>
                <FileText size={22} aria-hidden style={{ flex: "none", marginTop: 4, color: "var(--accent)" }} />
                <span>
                  <span className="h3" style={{ display: "block" }}>
                    {p.title} <span className="muted" style={{ fontSize: "0.85rem", fontWeight: 400 }}>PDF</span>
                  </span>
                  <span className="muted">{p.desc}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
        <p style={{ marginTop: 40 }}>
          <Link href="/contact" className="btn btn-primary">
            우리 매장도 상담받기
          </Link>
        </p>
      </section>
    </>
  );
}
