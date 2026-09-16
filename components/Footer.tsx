import Link from "next/link";
import { site } from "@/lib/site";
import MotionToggle from "./MotionToggle";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap cols">
        <div style={{ display: "grid", gap: 6, maxWidth: 420 }}>
          <strong>doion(도이온)</strong>
          <p className="muted">수원 율전동에서 소규모 매장 웹사이트를 만들고 관리합니다.</p>
          <p className="muted">
            대표 {site.ceo} ·{" "}
            <a href={`tel:${site.phone.replaceAll("-", "")}`} className="link">
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
          <Link href="/privacy">
            <strong>개인정보처리방침</strong>
          </Link>
          <MotionToggle />
        </nav>
      </div>
      <p className="wrap muted" style={{ marginTop: 32, fontSize: "0.85rem" }}>
        © {new Date().getFullYear()} doion
      </p>
    </footer>
  );
}
