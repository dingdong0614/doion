import Link from "next/link";
import { site, tel } from "@/lib/site";
import MobileBar from "./MobileBar";
import MotionToggle from "./MotionToggle";
import SignStrip from "./SignStrip";

// 푸터: 상호 띠(반대 방향) + 컨셉 문장 반복 + 3단 정보
export default function Footer() {
  return (
    <>
      <footer className="foot cv">
        <SignStrip dir="right" />
        <div className="g foot-a">
          <p className="t-h2 foot-line" style={{ "--c": "1 / 17" } as React.CSSProperties}>
            간판 다음으로,
            <span className="b">손님이 보는 곳.</span>
          </p>
          <nav className="foot-nav" aria-label="바닥글" style={{ "--c": "19 / 25" } as React.CSSProperties}>
            <Link className="u" href="/portfolio">
              사례
            </Link>
            <Link className="u" href="/pricing">
              가격
            </Link>
            <Link className="u" href="/process">
              진행 방식
            </Link>
            <Link className="u" href="/contact">
              무료 상담 신청
            </Link>
          </nav>
        </div>
        <div className="g foot-b">
          <div style={{ "--c": "1 / 9" } as React.CSSProperties}>
            <p>doion(도이온)</p>
            <p>수원 율전동에서 동네 가게 홈페이지를 만들고 관리합니다.</p>
          </div>
          <div style={{ "--c": "9 / 17" } as React.CSSProperties}>
            <p>대표 {site.ceo}</p>
            <p>
              <a className="ul" href={tel}>
                {site.phone}
              </a>
            </p>
            <p>
              <a className="ul" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </p>
          </div>
          <div style={{ "--c": "17 / 25" } as React.CSSProperties}>
            <p>
              <Link className="ul" href="/privacy" style={{ fontWeight: 700 }}>
                개인정보처리방침
              </Link>
            </p>
            <p>
              <MotionToggle />
            </p>
            <p className="mute">© {new Date().getFullYear()} doion</p>
          </div>
        </div>
      </footer>

      {/* 모바일 하단 고정 바 */}
      <MobileBar />
    </>
  );
}
