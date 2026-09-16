"use client";

import { useEffect } from "react";

// 사례 캡처 위에서 "사이트 보기" 라벨이 포인터를 따라다님. 마우스 환경에서만, rAF로 한 프레임에 한 번만 갱신.
export default function PeekFollow() {
  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let raf = 0;
    let last: PointerEvent | null = null;
    const apply = () => {
      raf = 0;
      const e = last;
      // 카드 전체를 덮는 링크(::after)가 포인터 대상이 되므로 카드에서 캡처 영역을 찾음
      const shot = e && (e.target as Element).closest?.(".case")?.querySelector(".shot");
      if (!e || !(shot instanceof HTMLElement)) return;
      const r = shot.getBoundingClientRect();
      shot.style.setProperty("--px", `${e.clientX - r.left}px`);
      shot.style.setProperty("--py", `${e.clientY - r.top}px`);
    };
    const onMove = (e: PointerEvent) => {
      last = e;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    addEventListener("pointermove", onMove, { passive: true });
    return () => {
      removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}
