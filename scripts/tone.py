"""doion 사진 보정 프리셋 doion-tone-01 (한 세션처럼 보이게 하는 단일 파이프라인).

입력: public/assets/work/ 의 라이브 사이트 캡처(1440x900 데스크톱, 780x1688 모바일)
출력: public/assets/tone/<slug>-<비율>.jpg  (비율은 45, 11, 그리고 히어로 휴대폰용 phone = 390:844 전체 화면)
프리셋: 채도 0.94, 대비 1.04, 배경색(#F7F7F4) 쪽으로 흰 균형 이동, 약한 선명도.
화면에서는 원색 그대로 쓴다(2026-09-29 대표 피드백으로 무채색 연출 폐기). 톤 통일은 이 프리셋만.
모바일 캡처는 390x844 DPR 2(780x1688)라 카드·휴대폰 표시 크기에서 2배 해상도.
실사 촬영본이 들어오면 같은 스크립트에 넣어 같은 프리셋으로 뽑는다.
실행: python3 scripts/tone.py  (Pillow 필요)
"""
from pathlib import Path
from PIL import Image, ImageEnhance, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public/assets/work"
OUT = ROOT / "public/assets/tone"
OUT.mkdir(parents=True, exist_ok=True)

# slug: (데스크톱 캡처, 모바일 캡처). 캡처를 새로 찍으면 slug에 날짜 접미사(-2610 등)를 바꿔 붙여 보정본 파일 이름도 바뀌게 한다(CDN·이미지 최적화 캐시 회피)
CAPTURES = {
    "sungdae-2610": (None, "sungdae-m-2610.jpg"),
    "ptholic-2610": (None, "ptholic-m-2610.jpg"),
    "keyhoon": ("keyhoon-d.jpg", "keyhoon-m.jpg"),
    "jangan": ("jangan-d-2609b.jpg", "jangan-m-2609b.jpg"),
    "chedae": ("chedae-d-2609b.jpg", "chedae-m-2609b.jpg"),
    "ondam": ("ondam-d-2609b.jpg", "ondam-m-2609b.jpg"),
    "dasom": ("dasom-d-2609b.jpg", "dasom-m-2609b.jpg"),
    "gajach-2610": (None, "gajach-m-2610.jpg"),
    "green-2610": (None, "green-m-2610.jpg"),
}

WB = (1.0, 0.994, 0.972)  # 배경 #F7F7F4 방향의 따뜻한 흰 균형


def preset(im: Image.Image) -> Image.Image:
    im = im.convert("RGB")
    im = ImageEnhance.Color(im).enhance(0.94)
    im = ImageEnhance.Contrast(im).enhance(1.04)
    r, g, b = im.split()
    r = r.point(lambda v: min(255, round(v * WB[0])))
    g = g.point(lambda v: min(255, round(v * WB[1])))
    b = b.point(lambda v: min(255, round(v * WB[2])))
    im = Image.merge("RGB", (r, g, b))
    return im.filter(ImageFilter.UnsharpMask(radius=1.2, percent=40, threshold=2))


def crop(im: Image.Image, ratio: float, anchor: str = "top") -> Image.Image:
    w, h = im.size
    if w / h > ratio:
        nw = round(h * ratio)
        x = (w - nw) // 2
        return im.crop((x, 0, x + nw, h))
    nh = round(w / ratio)
    y = 0 if anchor == "top" else (h - nh) // 2
    return im.crop((0, y, w, y + nh))


def save(im: Image.Image, name: str, width: int):
    if im.width > width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    im.save(OUT / name, "JPEG", quality=86, optimize=True, progressive=True)


PHONE = ["sungdae-2610", "ptholic-2610"]  # 히어로 옆 휴대폰 두 대: 왼쪽 뭐무까~, 오른쪽 피티홀릭짐(가운데 관악중앙교회는 60fps 영상, scripts/make-hero-video.py)
# 히어로 휴대폰에 첫 화면 대신 쓸 캡처: 피티홀릭짐 첫 화면에는 특가 가격 배지가 있어 doion 가격으로 오해될 수 있음(3차 검수) → 운영 시간 구간(스크롤 3800px)
PHONE_SRC = {"ptholic-2610": "ptholic-m-hours-2610.jpg"}
USED_11 = ["green-2610"]  # 관리 섹션 1:1 사진(2026-09-30 빠둠뮤직 사례 내림에 따라 교체)

if __name__ == "__main__":
    for slug, (desk, mob) in CAPTURES.items():
        m = preset(Image.open(SRC / mob))
        save(crop(m, 4 / 5), f"{slug}-45.jpg", 780)
        if slug in USED_11:
            save(crop(m, 1 / 1), f"{slug}-11.jpg", 780)
        if slug in PHONE:
            src = PHONE_SRC.get(slug)
            save(preset(Image.open(SRC / src)) if src else m, f"{slug}-phone.jpg", 780)
        # 데스크톱 1440x900 캡처(DPR 1)는 큰 화면에 흐리게 보여 쓰지 않는다(대표 피드백)
    print("done", sorted(p.name for p in OUT.iterdir()))
