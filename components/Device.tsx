import Image from "next/image";

// 실제 고객 사이트 캡처를 노트북·휴대폰 프레임에 담아 "제품 사진"처럼 보여줌. 순수 CSS 프레임.

export function Laptop({ src, alt, sizes, preload }: { src: string; alt: string; sizes: string; preload?: boolean }) {
  return (
    <div className="laptop">
      <div className="laptop-screen">
        <Image src={src} alt={alt} fill sizes={sizes} preload={preload} />
      </div>
      <div className="laptop-base" aria-hidden />
    </div>
  );
}

export function Phone({ src, alt, sizes, preload }: { src: string; alt: string; sizes: string; preload?: boolean }) {
  return (
    <div className="phone">
      <div className="phone-screen">
        <Image src={src} alt={alt} fill sizes={sizes} preload={preload} />
      </div>
    </div>
  );
}
