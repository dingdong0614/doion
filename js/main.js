(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. hero terminal typewriter ---------- */
  var shopNames = ["피티홀릭짐", "마룬피티", "당신의 매장"];
  var typeEl = document.getElementById("typeTarget");

  if (typeEl && !prefersReducedMotion) {
    var nameIdx = 0;
    var charIdx = 0;
    var deleting = false;

    (function tick() {
      var current = shopNames[nameIdx];
      if (!deleting) {
        charIdx++;
        typeEl.textContent = current.slice(0, charIdx);
        if (charIdx === current.length) {
          deleting = true;
          window.setTimeout(tick, 1400);
          return;
        }
      } else {
        charIdx--;
        typeEl.textContent = current.slice(0, charIdx);
        if (charIdx === 0) {
          deleting = false;
          nameIdx = (nameIdx + 1) % shopNames.length;
        }
      }
      window.setTimeout(tick, deleting ? 45 : 90);
    })();
  } else if (typeEl) {
    typeEl.textContent = shopNames[0];
  }

  /* ---------- 2. contact form ---------- */
  var form = document.getElementById("contactForm");
  var formNote = document.getElementById("formNote");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var shopName = (data.get("shopName") || "").toString().trim();
      var managerName = (data.get("managerName") || "").toString().trim();
      var phone = (data.get("phone") || "").toString().trim();

      formNote.classList.remove("is-error", "is-success");

      if (!shopName || !managerName || !phone) {
        formNote.textContent = "모든 항목을 입력해주세요.";
        formNote.classList.add("is-error");
        return;
      }

      // TODO: 실제 접수 방식(이메일 전송 서비스 또는 서버리스 함수) 연동 필요
      formNote.textContent = "상담 신청이 접수되었습니다. 빠르게 연락드리겠습니다.";
      formNote.classList.add("is-success");
      form.reset();
    });
  }
})();
