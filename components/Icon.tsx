// 아이콘 한 세트: 24 격자, 선 1.5, 각진 끝. 전부 장식용(aria-hidden).
const paths = {
  out: "M7 17 17 7M9 7h8v8", // 새 탭·바깥으로
  down: "M12 5v14M6 13l6 6 6-6",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  check: "M5 12.5 10 17.5 19 7",
  phone: "M8 3h8v18H8zM11 18h2",
  doc: "M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6",
  play: "M8 5v14l11-7z",
  pause: "M8 5v14M16 5v14",
} as const;

export type IconName = keyof typeof paths;

export default function Icon({ name, className = "ico" }: { name: IconName; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={paths[name]} />
    </svg>
  );
}
