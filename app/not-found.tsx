import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import Light from "@/components/Light";

export const metadata: Metadata = {
  title: "찾는 페이지가 없어요",
  robots: { index: false },
};

const col = (c: string, cm?: string) => ({ "--c": c, ...(cm ? { "--cm": cm } : {}) }) as React.CSSProperties;

// 404: 간판은 있는데 가게가 없는 주소. 컨셉 문장을 비틀어 쓰고, 상호 띠는 푸터에서 이어진다
export default function NotFound() {
  return (
    <>
      <section className="g nf" style={{ minHeight: "70svh" }} aria-labelledby="page-title">
        <p className="t-cap" style={col("1 / 13", "1 / 5")}>
          404
        </p>
        <h1 id="page-title" style={col("1 / 25")} data-light>
          <span className="sr-only">간판만 있고, 가게는 없는 주소예요.</span>
          <span className="t-display" style={{ display: "block", whiteSpace: "nowrap" }} aria-hidden="true">
            <Light text="간판만 있고," />
          </span>
          <span className="t-h2" style={{ display: "block", textAlign: "right" }} aria-hidden="true">
            <Light text="가게는 없는 주소예요." start={7} />
          </span>
        </h1>
        <p className="measure" style={col("1 / 11")}>
          주소가 바뀌었거나 잘못 입력된 것 같아요. 아래에서 찾으시는 곳으로 가 보세요.
        </p>
        <div className="row-links" style={col("1 / 25")}>
          <Link href="/" className="btn btn-ink" data-label="doion">
            처음으로
          </Link>
          <Link href="/portfolio" className="ul">
            만든 사이트 보기 <Icon name="out" />
          </Link>
          <Link href="/pricing" className="ul">
            가격 보기 <Icon name="out" />
          </Link>
          <Link href="/contact" className="ul">
            무료 상담 신청 <Icon name="out" />
          </Link>
        </div>
      </section>
    </>
  );
}
