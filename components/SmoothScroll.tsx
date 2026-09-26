"use client";

// 부드러운 스크롤(관성). 사이트의 모션 설정을 존중한다:
// - data-motion="off"(사이트 토글) 또는 OS의 "동작 줄이기"면 켜지 않음(네이티브 스크롤 유지).
// - 기존 CSS 스크롤 구동 애니메이션(rise·parallax 등)은 스크롤 위치 기반이라 그대로 동작.
import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

export default function SmoothScroll() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (root.dataset.motion === "off" || reduce) return;

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, wheelMultiplier: 1 });
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
