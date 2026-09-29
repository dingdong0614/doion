"""사이트 글자만 담은 Pretendard Variable 서브셋 두 벌 만들기 (docs/font-subset.md).

1. app, components, data, lib 의 .ts/.tsx/.md/.json 에서 쓰인 글자 + ASCII 0x20~0x7E + 기본 기호를 모은다.
2. PretendardVariable.ttf(npm pretendard, dist/public/variable)의 굵기 축을 200~800으로 줄인다.
3. 첫 화면용: app/fonts/critical-chars.txt(scripts/critical-chars.py) + ASCII -> app/fonts/PretendardCritical.woff2 (preload)
   전체: 1의 글자 전부 -> public/fonts/PretendardSubset.woff2 (FontFallback이 한가할 때 붙임)
4. 첫 화면용은 app/fonts/critical-font.css 에 data URI로 넣는다(layout.tsx가 import)
실행: python3 scripts/font-subset.py <PretendardVariable.ttf 경로>   (fonttools, brotli 필요)
"""
import subprocess, sys, tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC_DIRS = ["app", "components", "data", "lib"]
EXTRA = "·…‘’“”「」『』○×→←↑↓%~₩©®™"

chars = set(chr(c) for c in range(0x20, 0x7F)) | set(EXTRA)
for d in SRC_DIRS:
    for p in (ROOT / d).rglob("*"):
        if p.suffix in {".ts", ".tsx", ".md", ".json"} and "fonts" not in p.parts:
            chars |= set(p.read_text(encoding="utf-8"))
chars = {c for c in chars if c.isprintable() or c == " "}

ttf = sys.argv[1]
ascii_extra = set(chr(c) for c in range(0x20, 0x7F)) | set(EXTRA)
critical = ascii_extra | set((ROOT / "app/fonts/critical-chars.txt").read_text(encoding="utf-8"))
with tempfile.TemporaryDirectory() as tmp:
    inst = Path(tmp) / "inst.ttf"
    subprocess.run([sys.executable, "-m", "fontTools.varLib.instancer", ttf, "wght=200:800", "-o", str(inst)], check=True)
    for name, cs, out in [
        ("critical", critical, ROOT / "app/fonts/PretendardCritical.woff2"),
        ("full", chars, ROOT / "public/fonts/PretendardSubset.woff2"),
    ]:
        txt = Path(tmp) / f"{name}.txt"
        txt.write_text("".join(sorted(cs)), encoding="utf-8")
        subprocess.run(
            [
                "pyftsubset", str(inst), f"--text-file={txt}", "--flavor=woff2",
                "--layout-features=kern,liga,calt,tnum,lnum,ccmp,locl,mark,mkmk",
                f"--output-file={out}",
            ],
            check=True,
        )
        hangul = sum(1 for c in cs if "\uac00" <= c <= "\ud7a3")
        print(f"{name}: 한글 {hangul}자, 전체 {len(cs)}자 -> {out.relative_to(ROOT)} {out.stat().st_size // 1024}KB")

# font-display swap: 첫 프레임은 대체 글꼴일 수 있어, 글자 폭에 따라 줄이 바뀌는 칩 줄은 칸 폭을 고정했다(globals.css .chips.filters)
# 첫 화면 서브셋은 CSS에 data URI로 넣는다(스타일시트와 함께 도착해 첫 레이아웃부터 같은 글꼴, 글꼴 교체로 인한 두 번째 레이아웃 없음)
import base64
b64 = base64.b64encode((ROOT / "app/fonts/PretendardCritical.woff2").read_bytes()).decode()
(ROOT / "app/fonts/critical-font.css").write_text(
    "/* scripts/font-subset.py 가 만드는 파일(직접 고치지 않음). Pretendard Variable, SIL OFL 1.1 */\n"
    "@font-face {\n"
    '  font-family: "Pretendard First";\n'
    "  font-style: normal;\n"
    "  font-weight: 200 800;\n"
    "  font-display: swap;\n"
    f'  src: url(data:font/woff2;base64,{b64}) format("woff2");\n'
    "}\n",
    encoding="utf-8",
)
print("critical-font.css", (ROOT / "app/fonts/critical-font.css").stat().st_size // 1024, "KB")
