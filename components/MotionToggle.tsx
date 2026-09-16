"use client";

import { useRootAttr } from "@/lib/use-root-attr";

export default function MotionToggle() {
  const reduced = useRootAttr("motion") === "reduced";

  const toggle = () => {
    const el = document.documentElement;
    try {
      if (reduced) localStorage.removeItem("motion");
      else localStorage.setItem("motion", "reduced");
    } catch {}
    if (reduced) delete el.dataset.motion;
    else el.dataset.motion = "reduced";
  };

  return (
    <button type="button" onClick={toggle} aria-pressed={reduced}>
      {reduced ? "움직임 다시 켜기" : "움직임 줄이기"}
    </button>
  );
}
