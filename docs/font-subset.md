# 폰트 서브셋 (2026-09-26)

- app/fonts/WantedSansSubset.woff2: Wanted Sans Variable(OFL)에서 사이트 소스(app, components, data, lib 등)에 실제 쓰인 한글 620자 + ASCII + 기본 기호만 남기고, 굵기 축을 300~700으로 줄인 파일(약 90KB). next/font/local로 preload.
- 여기 없는 글자는 --font 두 번째 순서의 조각 폰트(app/fonts/wanted/wanted-sans.css)가 필요한 조각만 받아 채우므로 깨지지 않는다. 다만 새 글자가 많아지면 조각 다운로드가 늘어나니 다시 생성.

## 다시 생성하는 법
1. 소스에서 비ASCII 글자 모으기: node로 app, components, data, lib의 .ts/.tsx/.md/.json/.css를 읽어 글자 집합 저장
2. `pip install fonttools brotli`
3. `python -m fontTools.varLib.instancer WantedSansVariable.ttf wght=300:700 -o inst.ttf` (원본 ttf는 npm 패키지 wanted-sans의 fonts/variable)
4. `pyftsubset inst.ttf --text-file=chars.txt --flavor=woff2 --layout-features=kern,liga,calt,tnum,lnum,ccmp,locl,mark,mkmk --output-file=WantedSansSubset.woff2` (chars.txt에 ASCII 0x20~0x7E 포함)
