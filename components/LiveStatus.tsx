"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";

function scheduleOpen(d = new Date()) {
  const [start, end] = site.businessHours;
  return site.businessDays.includes(d.getDay()) && d.getHours() >= start && d.getHours() < end;
}

export default function LiveStatus() {
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const refresh = () =>
      fetch("/api/status", { cache: "no-store" })
        .then((r) => r.json())
        .then((d) => setOpen(typeof d.override === "boolean" ? d.override : scheduleOpen()))
        .catch(() => setOpen(scheduleOpen()));
    refresh();
    const id = setInterval(refresh, 60_000);
    return () => clearInterval(id);
  }, []);

  // 판단 전에는 자리만 잡아 레이아웃 시프트 방지
  return (
    <p className="live" data-open={open === true} aria-live="polite">
      <i aria-hidden />
      {open === null ? " " : open ? "지금 전화 상담 가능해요" : "지금은 상담 신청을 남겨주세요"}
    </p>
  );
}
