"use client";

import { useSyncExternalStore } from "react";

// <html data-*> 속성을 읽는 훅. 토글은 dataset만 바꾸면 되고 상태는 여기서 따라옴.
const subscribe = (cb: () => void) => {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-motion"] });
  return () => mo.disconnect();
};

export function useRootAttr(name: "theme" | "motion") {
  return useSyncExternalStore(
    subscribe,
    () => document.documentElement.dataset[name] ?? null,
    () => null
  );
}
