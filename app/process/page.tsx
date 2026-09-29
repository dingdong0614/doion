import type { Metadata } from "next";
import Link from "next/link";
import { og } from "@/lib/site";
import Icon from "@/components/Icon";
import PageHead from "@/components/PageHead";
import { reasons, steps } from "@/data/offer";

export const metadata: Metadata = {
  title: "웹사이트 제작 진행 방식",
  description: "상담, 제작(약 2주), 납품, 운영까지 네 단계. 대표가 처음부터 끝까지 직접 소통합니다.",
  alternates: { canonical: "/process" },
  openGraph: og("/process"),
};

const col = (c: string, cm?: string) => ({ "--c": c, ...(cm ? { "--cm": cm } : {}) }) as React.CSSProperties;

// 단계 단어 위치를 줄마다 바꿔 지그재그로(같은 줄 배치 반복 없음)
const place = [
  { w: "1 / 10", b: "13 / 21", t: "22 / 25" },
  { w: "9 / 18", b: "18 / 25", t: "1 / 5" },
  { w: "16 / 25", b: "5 / 13", t: "1 / 5" },
  { w: "5 / 14", b: "15 / 23", t: "23 / 25" },
];

export default function ProcessPage() {
  const nfc = reasons[0];
  return (
    <>
      <PageHead a="전화 한 통에서" b="매달 관리까지." capL="진행 방식" capR="상담부터 납품까지 약 2주">
        <p className="measure" style={col("13 / 23")}>
          담당자가 바뀌지 않습니다. 첫 상담부터 운영까지 대표가 직접 연락드려요.
        </p>
      </PageHead>

      {/* 단계 네 줄: 단어가 화면 가운데를 지날 때 간판처럼 켜짐 */}
      <ol className="flow" aria-label="진행 단계" data-flow>
        {steps.map((s, i) => (
          <li key={s.title} className="g flow-row">
            <h2 className="word" style={col(place[i].w)}>
              {s.title}
            </h2>
            <p className="measure" style={col(place[i].b)}>
              {s.body}
            </p>
            <p className="t-cap mute" style={col(place[i].t)}>
              {String(i + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
              {s.time ? `, ${s.time}` : ""}
            </p>
          </li>
        ))}
      </ol>

      {/* 어두운 띠(이 페이지의 유일한 어두운 곳): NFC/QR */}
      <section className="g nfc-band dark" aria-labelledby="nfc-title">
        <h2 id="nfc-title" className="t-h2" style={col("1 / 13")} data-reveal>
          <span className="ln">
            <span>휴대폰을 대면,</span>
          </span>
          <span className="ln">
            <span>바로 우리 가게 페이지.</span>
          </span>
        </h2>
        <div style={col("15 / 25")} className="measure">
          <p className="t-st">{nfc.body}</p>
          <div className="row-links" style={{ marginTop: 32 }}>
            <Link href="/contact" className="btn btn-ink">
              무료 상담 신청
            </Link>
            <Link href="/pricing" className="ul">
              가격 보기 <Icon name="out" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
