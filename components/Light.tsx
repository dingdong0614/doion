// 간판 불 켜기용 글자 쪼개기(서버에서 span으로 내보냄). 애니메이션은 CSS [data-light] .ch
export default function Light({ text, start = 0 }: { text: string; start?: number }) {
  let i = start;
  return (
    <>
      {Array.from(text).map((c, k) =>
        c === " " ? (
          " "
        ) : (
          <span key={k} className="ch" style={{ "--i": i++ } as React.CSSProperties}>
            {c}
          </span>
        )
      )}
    </>
  );
}
