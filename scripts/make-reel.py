"""사례 릴(무음 루프 영상) 만들기.

라이브 사이트를 직접 스크롤 녹화할 수 없는 환경(작업 환경에서 vercel.app 접속 차단)이라
public/assets/work/ 의 실제 모바일 캡처 8장을 같은 프리셋(tone.py)으로 보정한 뒤
4:5 틀 안에서 위에서 아래로 넘겨 보는 영상으로 만든다.
라이브 스크롤 녹화본으로 바꾸려면 scripts/record-reel.mjs 를 대표 PC에서 실행한다.
출력: public/assets/video/reel.webm (VP9), reel.mp4 (H.264), reel-poster.jpg
실행: python3 scripts/make-reel.py  (Pillow, ffmpeg 필요)
"""
import subprocess, tempfile
from pathlib import Path
from PIL import Image
from tone import preset, SRC, CAPTURES

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public/assets/video"
OUT.mkdir(parents=True, exist_ok=True)
W, H, FPS = 600, 750, 24
ORDER = ["jangan", "sungdae", "bbadoom", "keyhoon", "chedae", "ptholic", "ondam", "dasom"]  # 첫 장(포스터)은 금지 패턴 없는 장안설비대장
HOLD_A, MOVE, HOLD_B = 0.3, 1.8, 0.5


def ease(t: float) -> float:
    # cubic-bezier(0.65, 0.05, 0.36, 1) 근사(사이트 --ease-inout과 같은 성격)
    return 4 * t * t * t if t < 0.5 else 1 - pow(-2 * t + 2, 3) / 2


with tempfile.TemporaryDirectory() as tmp:
    n = 0
    for slug in ORDER:
        im = preset(Image.open(SRC / CAPTURES[slug][1]))
        im = im.resize((W, round(im.height * W / im.width)), Image.LANCZOS)
        span = im.height - H
        total = HOLD_A + MOVE + HOLD_B
        for f in range(round(total * FPS)):
            t = f / FPS
            p = 0 if t < HOLD_A else 1 if t > HOLD_A + MOVE else ease((t - HOLD_A) / MOVE)
            y = round(span * p)
            im.crop((0, y, W, y + H)).save(f"{tmp}/f{n:05d}.png")
            if n == 0:
                im.crop((0, 0, W, H)).save(OUT / "reel-poster.jpg", "JPEG", quality=80, optimize=True, progressive=True)
            n += 1
    common = ["ffmpeg", "-y", "-loglevel", "error", "-framerate", str(FPS), "-i", f"{tmp}/f%05d.png", "-an"]
    subprocess.run(common + ["-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "40", "-row-mt", "1", "-pix_fmt", "yuv420p", str(OUT / "reel.webm")], check=True)
    subprocess.run(common + ["-c:v", "libx264", "-crf", "28", "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(OUT / "reel.mp4")], check=True)
print("frames", n)
