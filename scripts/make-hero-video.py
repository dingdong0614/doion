"""히어로 휴대폰 영상(60fps) 만들기.

실시간 녹화 대신 스크롤 위치를 한 프레임씩 옮기며 DPR 2 스크린샷을 찍고(부드러운 이징으로 위치 보간),
ffmpeg -framerate 60 으로 인코딩한다. 내려갔다 같은 프레임을 거꾸로 올라와 끊김 없는 루프.
대상: 고객 사이트를 로컬에서 띄운 주소(작업 환경에서 라이브 도메인 접속이 막혀, 공개 저장소
dingdong0614/ptholic-1 을 next build && next start 로 띄워 찍음. 외부 이미지·폰트 요청은 막거나 로컬 파일로 대체).
출력: public/assets/video/hero.webm (VP9), hero.mp4 (H.264), hero-poster.jpg
실행: python3 scripts/make-hero-video.py http://localhost:4001/ <pretendard 패키지 경로(선택)>
보정: scripts/tone.py 의 preset(채도·대비·흰 균형 약간)을 프레임마다 적용.
"""
import asyncio, os, subprocess, sys, tempfile
from pathlib import Path
from PIL import Image
from playwright.async_api import async_playwright

sys.path.insert(0, str(Path(__file__).resolve().parent))
from tone import preset  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public/assets/video"
URL = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:4001/"
PKG = sys.argv[2] if len(sys.argv) > 2 else ""
FPS = 60
DOWN_S, HOLD_TOP_S, HOLD_BOTTOM_S = 3.6, 0.5, 0.4
DIST = 1900  # 내려가는 거리(CSS px): 첫 화면 → 트레이너 → 가격표(외부 이미지가 빠진 칸 전까지)
W, H = 480, 1038  # 인코딩 크기(휴대폰 화면 390x844 비율)


def ease(t: float) -> float:
    # cubic-bezier(0.65, 0.05, 0.36, 1) 성격의 부드러운 가감속
    return 4 * t * t * t if t < 0.5 else 1 - pow(-2 * t + 2, 3) / 2


async def route(r):
    u = r.request.url
    if PKG and "pretendard" in u and "jsdelivr" in u and "/dist/" in u:
        f = os.path.join(PKG, "dist", u.split("/dist/", 1)[1].split("?")[0])
        if os.path.exists(f):
            return await r.fulfill(path=f, content_type="text/css" if f.endswith(".css") else "font/woff2")
    if u.startswith("http://localhost"):
        return await r.continue_()
    return await r.abort()


async def capture(tmp: Path) -> int:
    async with async_playwright() as p:
        b = await p.chromium.launch()
        ctx = await b.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=2, is_mobile=True, has_touch=True, reduced_motion="reduce")
        await ctx.route("**/*", route)
        pg = await ctx.new_page()
        await pg.goto(URL, wait_until="load")
        await pg.wait_for_timeout(4000)
        n = round(DOWN_S * FPS)
        for i in range(n + 1):
            y = round(DIST * ease(i / n))
            await pg.evaluate(f"window.scrollTo(0,{y})")
            await pg.evaluate("new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))")
            await pg.screenshot(path=str(tmp / f"d{i:04d}.png"))
        await b.close()
        return n + 1


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as t:
        tmp = Path(t)
        n = asyncio.run(capture(tmp))
        down = [tmp / f"d{i:04d}.png" for i in range(n)]
        seq = [down[0]] * round(HOLD_TOP_S * FPS) + down + [down[-1]] * round(HOLD_BOTTOM_S * FPS) + down[::-1][1:-1]
        for k, f in enumerate(seq):
            im = preset(Image.open(f)).resize((W, H), Image.LANCZOS)
            im.save(tmp / f"f{k:05d}.png")
            if k == 0:
                im.save(OUT / "hero-poster.jpg", "JPEG", quality=82, optimize=True, progressive=True)
        common = ["ffmpeg", "-y", "-loglevel", "error", "-framerate", str(FPS), "-i", str(tmp / "f%05d.png"), "-an"]
        subprocess.run(common + ["-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "42", "-row-mt", "1", "-deadline", "good", "-cpu-used", "2", "-pix_fmt", "yuv420p", str(OUT / "hero.webm")], check=True)
        subprocess.run(common + ["-c:v", "libx264", "-crf", "30", "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(OUT / "hero.mp4")], check=True)
    for f in ("hero.webm", "hero.mp4", "hero-poster.jpg"):
        print(f, (OUT / f).stat().st_size // 1024, "KB")
    print("frames", len(seq), "fps", FPS, "seconds", round(len(seq) / FPS, 2))


if __name__ == "__main__":
    main()
