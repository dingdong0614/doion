"use client";

import { useEffect, useRef } from "react";

// 커서(마우스 기기만): 사례 위에서는 "열어보기" 원, 링크·버튼 위에서는 테두리 원, 어두운 섹션에서는 반전.
export default function Cursor() {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = matchMedia("(hover: hover) and (pointer: fine)");
    if (!mq.matches || !el.current) return;
    const c = el.current;
    const root = document.documentElement;
    root.dataset.cursor = "on";
    let x = -100,
      y = -100,
      cx = x,
      cy = y,
      raf = 0,
      last = performance.now();
    const loop = (t: number) => {
      // 시간 기반 감속(프레임 수와 무관하게 같은 속도)
      const k = 1 - Math.exp(-(t - last) / 70);
      last = t;
      cx += (x - cx) * k;
      cy += (y - cy) * k;
      c.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.1 ? requestAnimationFrame(loop) : 0;
    };
    const kick = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      c.dataset.on = "true";
      if (root.dataset.motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches) {
        cx = x;
        cy = y;
        c.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        return;
      }
      kick();
    };
    const onOver = (e: PointerEvent) => {
      const t = e.target as Element;
      const open = t.closest?.('[data-cursor="open"]');
      c.dataset.mode = open ? "open" : t.closest?.("a,button,label,input,select,textarea,summary") ? "link" : "";
      c.dataset.dark = String(Boolean(t.closest?.(".dark")));
    };
    const onLeave = () => (c.dataset.on = "false");
    addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
      delete root.dataset.cursor;
    };
  }, []);

  return (
    <div ref={el} className="cursor" aria-hidden="true">
      <span>열어보기</span>
    </div>
  );
}
