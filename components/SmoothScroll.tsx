"use client";

// 관성 스크롤(Lenis, lerp 0.1). 움직임 줄이기(시스템·사이트 버튼)면 켜지 않고 네이티브 스크롤.
// Lenis는 첫 입력 때 불러온다(첫 로드 JS에서 뺌).
import { useEffect } from "react";
import "lenis/dist/lenis.css";
import { onFirstInput, setLenis, useReduced } from "@/lib/motion";
import type Lenis from "lenis";

export default function SmoothScroll() {
  const reduced = useReduced();

  useEffect(() => {
    if (reduced !== false) return;
    let lenis: Lenis | null = null;
    let raf = 0;
    let t = 0;
    let dead = false;
    const off = onFirstInput(async () => {
      const { default: L } = await import("lenis");
      if (dead) return;
      lenis = new L({ lerp: 0.1, smoothWheel: true });
      setLenis(lenis);
      const loop = (time: number) => {
        lenis?.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      // 첫 방문 로더(1.6초) 동안은 멈춤
      if (document.documentElement.hasAttribute("data-loader")) {
        lenis.stop();
        t = window.setTimeout(() => lenis?.start(), 1650);
      }
      window.dispatchEvent(new Event("doion:lenis"));
    });
    return () => {
      dead = true;
      off();
      clearTimeout(t);
      cancelAnimationFrame(raf);
      lenis?.destroy();
      setLenis(null);
    };
  }, [reduced]);

  return null;
}
