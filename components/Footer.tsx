import Link from "next/link";
import { Phone } from "lucide-react";
import { site } from "@/lib/site";
import MotionToggle from "./MotionToggle";

const tel = `tel:${site.phone.replaceAll("-", "")}`;

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap cols">
        <div style={{ display: "grid", gap: 6, maxWidth: 440 }}>
          <strong style={{ fontWeight: 600 }}>doion(도이온)</strong>
          <p className="muted">수원 율전동에서 동네 가게 홈페이지를 만들고 관리합니다.</p>
          <p className="muted">
            대표 {site.ceo} ·{" "}
            <a href={tel} className="link">
              {site.phone}
            </a>{" "}
            ·{" "}
            <a href={`mailto:${site.email}`} className="link">
              {site.email}
            </a>
          </p>
        </div>
        <nav className="footer-links" aria-label="바닥글">
          <Link href="/portfolio">사례</Link>
          <Link href="/pricing">가격</Link>
          <Link href="/process">진행 방식</Link>
          <Link href="/contact">무료 상담 신청</Link>
          <Link href="/privacy" style={{ color: "var(--ink)", fontWeight: 600 }}>
            개인정보처리방침
          </Link>
          <MotionToggle />
        </nav>
      </div>
      <p className="wrap muted" style={{ marginTop: 28, fontSize: "0.85rem" }}>
        © {new Date().getFullYear()} doion
      </p>

      {/* 모바일 하단 고정 바 */}
      <div className="m-bar">
        <a className="btn btn-ghost" href={tel}>
          <Phone size={18} aria-hidden /> 전화 상담
        </a>
        <Link className="btn btn-primary" href="/contact">
          상담 신청
        </Link>
      </div>
    </footer>
  );
}
