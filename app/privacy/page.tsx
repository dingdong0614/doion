import type { Metadata } from "next";
import { og, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "doion(도이온) 개인정보처리방침. 수집 항목, 이용 목적, 보유 기간, 처리 위탁, 정보주체의 권리를 안내합니다.",
  alternates: { canonical: "/privacy" },
  openGraph: og("/privacy"),
};

export default function PrivacyPage() {
  return (
    <article className="hero wrap prose-legal" style={{ maxWidth: 860 }}>
      <h1 className="title-lg">
        개인정보처리방침
      </h1>
      <p style={{ marginTop: 16 }}>
        doion(이하 &ldquo;회사&rdquo;)은 「개인정보 보호법」을 지키며, 이용자의 개인정보를 필요한 만큼만 받고 목적이 끝나면
        파기합니다. 시행일: 2026년 9월 16일.
      </p>

      <h2>1. 수집하는 개인정보 항목과 방법</h2>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>구분</th>
              <th>항목</th>
              <th>방법</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>무료 상담 신청</td>
              <td>매장 이름, 담당자 이름, 연락처, 업종, 문의 내용(선택)</td>
              <td>홈페이지 상담 신청 폼</td>
            </tr>
            <tr>
              <td>계약 체결 시</td>
              <td>이름, 연락처, 이메일, 사업자 정보(세금계산서 발행 시), 결제 관련 정보</td>
              <td>계약서 작성, 이메일, 전화</td>
            </tr>
            <tr>
              <td>자동 수집</td>
              <td>접속 IP, 접속 일시(부정 이용 방지를 위한 신청 횟수 제한에 사용), 페이지 방문 기록(익명 통계)</td>
              <td>서버 요청 기록, Vercel Web Analytics</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p style={{ marginTop: 12 }}>민감정보와 주민등록번호 등 고유식별정보는 수집하지 않습니다.</p>

      <h2>2. 이용 목적</h2>
      <ul>
        <li>상담 신청 접수, 견적 안내, 결과 회신</li>
        <li>계약 체결·이행, 대금 정산, 세금계산서 발행</li>
        <li>반복·자동화된 부정 신청 방지</li>
      </ul>

      <h2>3. 보유 및 이용 기간</h2>
      <p>목적이 달성되면 지체 없이 파기합니다. 다만 아래 경우는 정해진 기간 동안 보관합니다.</p>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>항목</th>
              <th>근거</th>
              <th>기간</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>상담 신청 내용</td>
              <td>회사 내부 방침</td>
              <td>상담 처리 완료 후 3개월</td>
            </tr>
            <tr>
              <td>신청 횟수 제한용 IP</td>
              <td>회사 내부 방침</td>
              <td>10분</td>
            </tr>
            <tr>
              <td>계약 또는 청약철회 등에 관한 기록</td>
              <td>전자상거래법</td>
              <td>5년</td>
            </tr>
            <tr>
              <td>대금결제 및 재화 등의 공급에 관한 기록</td>
              <td>전자상거래법</td>
              <td>5년</td>
            </tr>
            <tr>
              <td>소비자 불만 또는 분쟁처리에 관한 기록</td>
              <td>전자상거래법</td>
              <td>3년</td>
            </tr>
            <tr>
              <td>세금계산서 등 거래 증빙</td>
              <td>국세기본법</td>
              <td>5년</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>4. 동의를 거부할 권리</h2>
      <p>개인정보 수집·이용 동의를 거부할 수 있습니다. 거부하시면 온라인 상담 신청은 할 수 없지만, 전화 상담은 가능합니다.</p>

      <h2>5. 제3자 제공</h2>
      <p>원칙적으로 제공하지 않습니다. 이용자가 미리 동의했거나 법령에 따라 수사기관 등이 요구하는 경우에만 예외로 합니다.</p>

      <h2>6. 처리 위탁 및 국외 이전</h2>
      <p>원활한 서비스를 위해 아래 업체에 처리를 맡기며, 이 업체들의 서버는 국외에 있습니다.</p>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>수탁업체(국가)</th>
              <th>위탁 업무</th>
              <th>이전 항목·시기·방법</th>
              <th>보유 기간</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Vercel Inc.(미국)</td>
              <td>웹사이트 호스팅, 상담 신청 처리 서버 운영, 익명 방문 통계</td>
              <td>상담 신청 항목, 접속 IP · 신청 시 · 네트워크 전송</td>
              <td>위탁 계약 종료 시까지</td>
            </tr>
            <tr>
              <td>Web3Forms 또는 Resend(미국)</td>
              <td>상담 신청 알림 메일 발송</td>
              <td>상담 신청 항목 · 신청 시 · 네트워크 전송</td>
              <td>위탁 계약 종료 시까지</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p style={{ marginTop: 12 }}>국외 이전을 원하지 않으시면 온라인 신청 대신 전화({site.phone})로 상담하실 수 있습니다.</p>

      <h2>7. 정보주체의 권리와 행사 방법</h2>
      <p>
        언제든 개인정보 열람, 정정, 삭제, 처리정지를 요구할 수 있습니다. 아래 연락처로 이메일·전화로 요청하시면 지체 없이
        조치합니다.
      </p>

      <h2>8. 파기 절차와 방법</h2>
      <ul>
        <li>보유 기간이 끝나거나 목적이 달성된 정보는 개인정보 보호책임자 확인 후 파기합니다.</li>
        <li>전자 파일은 복구할 수 없는 방법으로 삭제하고, 종이 문서는 분쇄하거나 소각합니다.</li>
      </ul>

      <h2>9. 안전성 확보 조치</h2>
      <ul>
        <li>개인정보 접근 권한을 최소 인원으로 제한</li>
        <li>관리 시스템 접근 비밀번호 설정 및 주기적 변경</li>
        <li>전송 구간 암호화(HTTPS)</li>
      </ul>

      <h2>10. 쿠키 등 자동 수집 장치</h2>
      <p>
        광고용 쿠키와 추적 쿠키는 쓰지 않습니다. 방문 통계는 쿠키를 쓰지 않고 개인을 식별하지 않는 Vercel Web Analytics로
        익명 집계합니다. 화면 밝기와 움직임 줄이기 설정만 이용자 브라우저(localStorage)에 저장되며, 회사로 전송되지 않습니다.
      </p>

      <h2>11. 개인정보 보호책임자</h2>
      <div className="table-scroll">
        <table>
          <tbody>
            <tr>
              <th>성명</th>
              <td>{site.ceo} (대표)</td>
            </tr>
            <tr>
              <th>이메일</th>
              <td>
                <a className="link" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </td>
            </tr>
            <tr>
              <th>전화</th>
              <td>{site.phone}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p style={{ marginTop: 12 }}>
        개인정보 침해 신고·상담은 개인정보침해신고센터(privacy.kisa.or.kr, 국번 없이 118)에도 하실 수 있습니다.
      </p>

      <h2>12. 방침 변경</h2>
      <p>내용이 바뀌면 시행 7일 전부터 이 페이지에 알립니다.</p>
    </article>
  );
}
