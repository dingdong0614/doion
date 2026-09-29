import { PageEnter } from "@/components/Transition";
import PageMotion from "@/components/PageMotion";

// 페이지 전환 레이어: 이동할 때마다 새로 붙어 덮개를 걷고(PageEnter), 그 페이지의 스크롤 연출을 건다(PageMotion).
// 서버 렌더 결과(HTML·메타)는 그대로라 검색엔진에는 영향이 없다.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageEnter />
      {children}
      <PageMotion />
    </>
  );
}
