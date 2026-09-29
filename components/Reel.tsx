"use client";

// 사례 릴: 실제 모바일 캡처 8장을 같은 보정으로 넘겨 보는 무음 루프(scripts/make-reel.py).
// preload none, 화면에 들어올 때만 재생, 움직임 줄이기면 정지(포스터만). 5초 넘는 자동 재생이라 정지 버튼 제공.
import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import { useReduced } from "@/lib/motion";

export default function Reel() {
  const v = useRef<HTMLVideoElement>(null);
  const reduced = useReduced();
  const [paused, setPaused] = useState(false); // 사용자가 누른 정지
  const [playing, setPlaying] = useState(false);
  const [near, setNear] = useState(false); // 가까워지면 포스터를 받는다(첫 로드 전송량 절약)

  useEffect(() => {
    const el = v.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setNear(true), io.disconnect()), { rootMargin: "600px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = v.current;
    if (!el) return;
    if (reduced !== false || paused) {
      el.pause();
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) el.play().catch(() => undefined);
        else el.pause();
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, paused]);

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

  return (
    <figure className="reel">
      <div className="media r45 tone">
        <video
          ref={v}
          muted
          loop
          playsInline
          preload="none"
          poster={near ? "/assets/video/reel-poster.jpg" : undefined}
          width={600}
          height={750}
          aria-label="doion이 만든 사이트 8곳의 모바일 첫 화면을 차례로 넘겨 보는 무음 영상"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          <source src="/assets/video/reel.webm" type="video/webm" />
          <source src="/assets/video/reel.mp4" type="video/mp4" />
        </video>
      </div>
      <figcaption className="fig-cap row-links">
        <span className="t-cap mute">만든 사이트 8곳, 휴대폰 첫 화면</span>
        <button type="button" className="ul t-cap reel-btn" onClick={toggle} aria-pressed={playing}>
          <Icon name={playing ? "pause" : "play"} />
          {playing ? "영상 멈추기" : "영상 재생"}
        </button>
      </figcaption>
    </figure>
  );
}
