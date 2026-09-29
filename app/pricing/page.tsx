import type { Metadata } from "next";
import Link from "next/link";
import { og } from "@/lib/site";
import Faq from "@/components/Faq";
import Icon from "@/components/Icon";
import PageHead from "@/components/PageHead";
import { BuildRows, CareCols } from "@/components/PriceDoc";
import { buildMatrix, buildPlans } from "@/data/offer";

export const metadata: Metadata = {
  title: "웹사이트 제작 가격",
  description:
    "소규모 매장 웹사이트 제작 50만·80만·100만원, 제작 후 관리 Doion Care 월 5만·10만·13만원. 관리비는 최소 1년간 고정됩니다.",
  alternates: { canonical: "/pricing" },
  openGraph: og("/pricing"),
};

const col = (c: string, cm?: string) => ({ "--c": c, ...(cm ? { "--cm": cm } : {}) }) as React.CSSProperties;

export default function PricingPage() {
  return (
    <>
      {/* 1. 머리: 둘째 줄 우측 정렬 */}
      <PageHead a="제작 한 번," b="관리는 필요한 만큼." capL="가격" capR="VAT 별도" align="right">
        <p className="measure" style={col("1 / 10")}>
          매장 규모와 필요한 기능에 맞춰 세 가지로 준비했습니다. 견적 요청 전에 가격부터 확인하세요.
        </p>
      </PageHead>

      {/* 2. 가격 문서: 큰 숫자 세 줄 + 관리비 세 칸 */}
      <section className="g pricing" aria-labelledby="build-title">
        <h2 id="build-title" className="sr-only">
          제작 패키지와 관리비
        </h2>
        <div className="sub">
          <BuildRows />
          <CareCols />
        </div>
        <p className="t-cap mute" style={col("4 / 25")}>
          VAT 별도. 도메인·서버 비용은 상담 때 따로 안내드립니다. 실시간 혼잡도 표시 옵션: 전 패키지 공통 월 2만원 추가. 혼잡도는
          사장님이 직접 바꾸고, 데이터가 쌓이면 요일·시간대별 평균도 자동으로 보여줍니다.
        </p>
      </section>

      {/* 3. 기능 비교표: 전체 폭 표 */}
      <section className="g faq-sec" aria-labelledby="compare-title">
        <h2 id="compare-title" className="t-h2" style={col("1 / 13")} data-reveal>
          <span className="ln">
            <span>패키지별 기능 비교.</span>
          </span>
        </h2>
        {/* 좁은 화면: 패키지별 목록 */}
        <div className="compare-stack" style={col("1 / 25")}>
          {buildPlans.map((p, i) => (
            <section key={p.name} aria-label={`${p.name} ${p.price}만원 기능`}>
              <h3>
                <span>{p.name}</span>
                <span className="t-cap mute">{p.price}만원</span>
              </h3>
              <ul>
                {buildMatrix().map((r) => (
                  <li key={r.feature} data-in={i >= r.from}>
                    <Icon name={i >= r.from ? "check" : "minus"} />
                    <span>
                      {r.feature}
                      <span className="sr-only">{i >= r.from ? " 포함" : " 미포함"}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <div className="compare-wrap" style={col("1 / 25")}>
          <table className="compare">
            <thead>
              <tr>
                <th scope="col">기능</th>
                {buildPlans.map((p) => (
                  <th key={p.name} scope="col">
                    {p.name}
                    <small>{p.price}만원</small>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {buildMatrix().map((r) => (
                <tr key={r.feature}>
                  <th scope="row">{r.feature}</th>
                  {buildPlans.map((p, i) => (
                    <td key={p.name}>
                      {i >= r.from ? (
                        <>
                          <Icon name="check" />
                          <span className="sr-only">포함</span>
                        </>
                      ) : (
                        <span className="no">
                          <Icon name="minus" />
                          <span className="sr-only">미포함</span>
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. 자주 묻는 질문: 왼쪽 고정 제목 + 오른쪽 목록(8 + 1 + 15) */}
      <section className="g faq-sec" aria-labelledby="faq-title">
        <div className="left" style={col("1 / 9")}>
          <h2 id="faq-title" className="t-h2" data-reveal>
            <span className="ln">
              <span>자주 묻는 질문.</span>
            </span>
          </h2>
        </div>
        <div style={col("10 / 25")}>
          <Faq />
        </div>
      </section>

      {/* 5. 마무리: 선언 한 줄 + 설명 + 버튼(가운데 칼럼에서 시작) */}
      <section className="g band" aria-labelledby="band-title">
        <h2 id="band-title" className="t-st" style={col("5 / 21")}>
          관리비는 1년간 오르지 않습니다. Doion Care 비용은 계약일부터 최소 1년 동안 고정이고, 그 뒤 조정이 필요하면 일방적으로 올리지 않고
          서로 협의해서 정합니다.
        </h2>
        <div className="row-links" style={col("5 / 21")}>
          <Link href="/contact" className="btn btn-ink">
            무료 상담 신청
          </Link>
          <Link href="/portfolio" className="ul">
            포트폴리오 보기 <Icon name="out" />
          </Link>
        </div>
      </section>
    </>
  );
}
