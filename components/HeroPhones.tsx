"use client";

// 히어로 휴대폰 세 대: 간판 다음에 손님이 보는 곳(실제 고객 사이트 화면, 원색).
// 왼쪽 뭐무까~, 가운데 관악중앙교회, 오른쪽 피티홀릭짐. 가운데는 관악중앙교회 모바일 사이트를 한 프레임씩 찍어 만든 60fps 스크롤 영상(scripts/make-hero-video.py).
// 영상은 사용자가 움직이거나 load 5초 뒤에 붙이고(첫 화면 LCP는 포스터 이미지), 움직임 줄이기면 포스터만. 5초 넘는 자동 재생이라 정지 버튼.
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import { useReduced } from "@/lib/motion";

export default function HeroPhones() {
  const reduced = useReduced();
  const v = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    // 영상(약 0.4~0.7MB)은 첫 화면이 다 그려진 뒤에 붙인다: 사용자가 움직이면 바로, 아니면 load 5초 뒤.
    // 첫 프레임은 포스터와 같은 그림이라 붙는 순간 화면이 바뀌지 않는다.
    let t = 0;
    const evs = ["pointerdown", "touchstart", "scroll", "keydown", "wheel"] as const;
    const go = () => {
      clearTimeout(t);
      evs.forEach((e) => removeEventListener(e, go));
      setReady(true);
    };
    const arm = () => {
      t = window.setTimeout(go, 5000);
    };
    evs.forEach((e) => addEventListener(e, go, { once: true, passive: true }));
    if (document.readyState === "complete") arm();
    else addEventListener("load", arm, { once: true });
    return () => {
      clearTimeout(t);
      evs.forEach((e) => removeEventListener(e, go));
      removeEventListener("load", arm);
    };
  }, []);

  useEffect(() => {
    const el = v.current;
    if (!el) return;
    if (reduced !== false || paused) {
      el.pause();
      return;
    }
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? el.play().catch(() => undefined) : el.pause()), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, paused, ready]);

  const toggle = () => {
    const el = v.current;
    if (!el) return;
    if (el.paused) {
      setPaused(false);
      el.play().catch(() => undefined);
    } else {
      setPaused(true);
      el.pause();
    }
  };

  const showVideo = ready && reduced === false;

  return (
    <figure className="hero-visual">
      <div className="phones">
        <div className="phone side l">
          <Image src="/assets/tone/sungdae-2610-phone.jpg" alt="뭐무까~ 앱 휴대폰 첫 화면" width={780} height={1688} sizes="(max-width: 1023px) 110px, 170px" />
        </div>
        <div className="phone c">
          {/* 포스터(LCP)는 홈 전용 CSS의 data URI(app/hero-poster.css, scripts/hero-poster.py): 이미지 요청 없이 첫 페인트에 그려짐 */}
          <div className="poster" role="img" aria-label="관악중앙교회 사이트 휴대폰 화면" />
          {showVideo && (
            <video ref={v} muted loop playsInline preload="auto" aria-hidden="true" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}>
              <source src="/assets/video/hero.webm" type="video/webm" />
              <source src="/assets/video/hero.mp4" type="video/mp4" />
            </video>
          )}
        </div>
        <div className="phone side r">
          <Image src="/assets/tone/ptholic-2610-phone.jpg" alt="피티홀릭짐 사이트 휴대폰 화면, 운영 시간 안내" width={780} height={1688} sizes="(max-width: 1023px) 110px, 170px" />
        </div>
      </div>
      <figcaption className="phones-cap t-cap mute">
        <span>
          뭐무까~ · 관악중앙교회 · 피티홀릭짐<span className="sr-only">, 손님 휴대폰에서 보이는 화면</span>
        </span>
        {/* 버튼 자리는 처음부터 잡아 둔다(영상이 붙을 때 아래 내용이 밀리지 않게, CLS 0). 영상 전에는 숨김 */}
        <button
          type="button"
          className="ul t-cap"
          onClick={toggle}
          aria-pressed={playing}
          disabled={!showVideo}
          aria-hidden={!showVideo || undefined}
          style={showVideo ? undefined : { visibility: "hidden" }}
        >
          <Icon name={playing ? "pause" : "play"} />
          {playing ? "영상 멈추기" : "영상 재생"}
        </button>
      </figcaption>
    </figure>
  );
}
