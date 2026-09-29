"use client";

import { useReduced } from "@/lib/motion";

// 사이트 안에서 움직임 줄이기(시스템 설정과 별도). html[data-motion="reduced"]로 모든 연출을 끈다.
export default function MotionToggle() {
  const reduced = useReduced();

  const toggle = () => {
    const el = document.documentElement;
    const next = el.dataset.motion !== "reduced";
    try {
      if (next) localStorage.setItem("motion", "reduced");
      else localStorage.removeItem("motion");
    } catch {}
    if (next) el.dataset.motion = "reduced";
    else delete el.dataset.motion;
  };

  return (
    <button type="button" className="ul" onClick={toggle} aria-pressed={reduced === true}>
      {reduced ? "움직임 다시 켜기" : "움직임 줄이기"}
    </button>
  );
}
