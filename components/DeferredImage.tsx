"use client";

// 첫 화면 글자가 먼저 그려지도록 페이지 load 뒤 한가할 때 붙는 next/image.
// 자리는 부모 .media의 비율로 고정돼 레이아웃 이동이 없고, 스크립트가 없으면 noscript 이미지가 보인다.
import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";

export default function DeferredImage(props: ImageProps) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    const go = () => (ric ? ric(() => setReady(true), { timeout: 1500 }) : setTimeout(() => setReady(true), 300));
    if (document.readyState === "complete") go();
    else addEventListener("load", go, { once: true });
  }, []);
  // eslint-disable-next-line jsx-a11y/alt-text
  const img = <Image {...props} />;
  return ready ? img : <noscript>{img}</noscript>;
}
