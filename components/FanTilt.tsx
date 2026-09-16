"use client";

import { useEffect } from "react";

// 부채꼴 카드: 마우스 위치에 따라 살짝 기울어짐(--rx/--ry). 마우스 환경·모션 허용일 때만.
export default function FanTilt() {
  useEffect(() => {
    const reduced = () =>
      matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.motion === "reduced";
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let raf = 0;
    let last: PointerEvent | null = null;
    const apply = () => {
      raf = 0;
      const card = last && (last.target as Element).closest?.(".fan .card");
      if (!last || !(card instanceof HTMLElement) || reduced()) return;
      const r = card.getBoundingClientRect();
      const x = (last.clientX - r.left) / r.width - 0.5;
      const y = (last.clientY - r.top) / r.height - 0.5;
      card.style.setProperty("--ry", `${(x * 10).toFixed(2)}deg`);
      card.style.setProperty("--rx", `${(-y * 8).toFixed(2)}deg`);
    };
    const onMove = (e: PointerEvent) => {
      last = e;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onLeave = (e: PointerEvent) => {
      const card = (e.target as Element).closest?.(".fan .card");
      if (card instanceof HTMLElement && !card.contains(e.relatedTarget as Node)) {
        card.style.removeProperty("--ry");
        card.style.removeProperty("--rx");
      }
    };
    addEventListener("pointermove", onMove, { passive: true });
    addEventListener("pointerout", onLeave, { passive: true });
    return () => {
      removeEventListener("pointermove", onMove);
      removeEventListener("pointerout", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}
