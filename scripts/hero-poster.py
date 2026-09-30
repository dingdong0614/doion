"""히어로 가운데 휴대폰 포스터를 홈 전용 CSS에 data URI로 넣는다(3차 검수: 홈 LCP 3.2초).

LCP 요소가 이 포스터라, 별도 이미지 요청 없이 홈 스타일시트와 함께 도착하게 해 첫 페인트와 같은 순간에 그린다.
입력: public/assets/video/hero-poster.jpg (scripts/make-hero-video.py 가 영상 첫 프레임으로 만듦, 480x1038)
출력: app/hero-poster.css (app/page.tsx 만 import. 다른 페이지 CSS에는 들어가지 않음)
크기: 가로 400px WebP q65(약 20KB). 표시 폭은 390 화면에서 약 150px, 1440에서 약 200px
실행: python3 scripts/hero-poster.py (영상을 다시 만들면 같이 실행)
"""
import base64, io
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
im = Image.open(ROOT / "public/assets/video/hero-poster.jpg").convert("RGB")
W = 400
im = im.resize((W, round(im.height * W / im.width)), Image.LANCZOS)
b = io.BytesIO()
im.save(b, "WEBP", quality=65, method=6)
uri = "data:image/webp;base64," + base64.b64encode(b.getvalue()).decode()
css = (
    "/* scripts/hero-poster.py 가 만듦. 직접 고치지 말 것 */\n"
    f".phone .poster{{background:#1b1a17 url({uri}) top center/cover no-repeat}}\n"
)
(ROOT / "app/hero-poster.css").write_text(css)
print("hero-poster.css", len(css) // 1024, "KB (webp", len(b.getvalue()) // 1024, "KB)")
