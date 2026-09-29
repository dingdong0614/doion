import type { Metadata } from "next";
import Link from "next/link";
import { og } from "@/lib/site";
import Icon from "@/components/Icon";
import PageHead from "@/components/PageHead";
import PortfolioIndex from "@/components/PortfolioIndex";
import { categories, portfolio, proposals } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "헬스장·뷰티샵·학원 웹사이트 제작 사례 · 포트폴리오",
  description:
    "doion이 만든 실제 운영 중인 웹사이트와 업종별 영업용 데모. 헬스장, 학원, 뷰티 인플루언서, 대학가 맛집 웹앱, 지역 디렉토리, 요양원, 교회 사례를 라이브 화면으로 확인하세요.",
  alternates: { canonical: "/portfolio" },
  openGraph: og("/portfolio"),
};

const col = (c: string, cm?: string) => ({ "--c": c, ...(cm ? { "--cm": cm } : {}) }) as React.CSSProperties;

export default function PortfolioPage() {
  return (
    <>
      {/* 1. 머리: 둘째 줄을 8컬럼 들여 씀 */}
      <PageHead a="만든 사이트," b="지금 열어보세요." capL={`사례 ${portfolio.length}곳`} capR="라이브 사이트는 새 탭에서 열립니다" align="indent">
        <p className="measure" style={col("1 / 10")}>
          실제 운영 중인 사이트와 업종별 영업용 데모를 함께 모았습니다. 줄을 누르면 라이브 사이트가 새 탭에서 열립니다.
        </p>
      </PageHead>

      {/* 2. 목록 + 고정 미리보기(14 + 1 + 9) */}
      <PortfolioIndex items={portfolio} categories={categories} />

      {/* 3. 업종별 제안서: 두 칸 문서 목록 */}
      <section className="g proposals cv" aria-labelledby="proposal-title">
        <h2 id="proposal-title" className="t-h2" style={col("1 / 9")} data-reveal>
          <span className="ln">
            <span>업종별 제안서.</span>
          </span>
        </h2>
        <p className="measure mute" style={col("9 / 19")}>
          업종마다 필요한 기능과 강조할 부분이 다릅니다. 해당 업종 제안서를 PDF로 바로 볼 수 있어요.
        </p>
        <ul className="prop-list" style={col("1 / 25")}>
          {proposals.map((p) => (
            <li key={p.file}>
              <a href={`/assets/proposals/${p.file}`} target="_blank" rel="noopener noreferrer">
                <span className="t">
                  <span className="t-st">{p.title}</span>
                  <span className="t-cap mute">
                    PDF<span className="sr-only"> (새 탭)</span>
                  </span>
                </span>
                <span className="mute">{p.desc}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* 4. 마무리 띠: 제목 왼쪽, 버튼 오른쪽 아래 */}
      <section className="g band cv" aria-labelledby="band-title">
        <h2 id="band-title" className="t-h2" style={col("1 / 15")}>
          우리 매장도 상담받기
        </h2>
        <div className="end row-links" style={col("15 / 25")}>
          <Link href="/contact" className="btn btn-ink">
            무료 상담 신청
          </Link>
          <Link href="/pricing" className="ul">
            가격 보기 <Icon name="out" />
          </Link>
        </div>
      </section>
    </>
  );
}
