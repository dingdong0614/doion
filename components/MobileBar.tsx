"use client";

// 모바일 하단 고정 바(전화 상담·상담 신청).
// 홈은 첫 화면에 히어로 상담 버튼이 이미 있어, 그 버튼이 화면 위로 나간 뒤에만 보인다(3차 검수: 첫 화면 상담 버튼 두 번).
// 다른 페이지는 처음부터 보인다. 서버 렌더도 같은 기준이라 첫 화면 깜빡임 없음.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { tel } from "@/lib/site";

export default function MobileBar() {
  const home = usePathname() === "/";
  const [show, setShow] = useState(!home);

  useEffect(() => {
    if (!home) {
      setShow(true);
      return;
    }
    const cta = document.querySelector(".hero-cta");
    if (!cta) {
      setShow(true);
      return;
    }
    setShow(false);
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(cta);
    return () => io.disconnect();
  }, [home]);

  return (
    <div className="m-bar" data-show={show}>
      <a className="btn btn-line" href={tel} tabIndex={show ? undefined : -1}>
        전화 상담
      </a>
      <Link className="btn btn-ink" href="/contact" tabIndex={show ? undefined : -1}>
        상담 신청
      </Link>
    </div>
  );
}
