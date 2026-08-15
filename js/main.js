(function () {
  "use strict";

  // web3forms.com에서 발급받은 Access Key입니다. (ptholic 프로젝트와 동일한 방식)
  // 문의를 받을 이메일을 바꾸고 싶으면 web3forms.com에서 새 이메일로 키를 재발급받아 이 값을 교체하세요.
  var WEB3FORMS_ACCESS_KEY = "70c6c844-d397-4367-a7d3-21bb1f7a655b";

  // 우측 하단 플로팅 상담 버튼에 쓰이는 값입니다. 바꾸려면 이 줄만 수정하세요.
  var CONTACT_PHONE = "010-9786-2433";

  // 실시간 상담 가능 여부 표시에 쓰이는 상담 가능 시간대입니다. 바꾸려면 이 값들만 수정하세요.
  var BUSINESS_DAYS = [1, 2, 3, 4, 5]; // 0=일 1=월 ... 6=토
  var BUSINESS_HOURS_START = 9;
  var BUSINESS_HOURS_END = 18;

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. hero terminal typewriter ---------- */
  var shopNames = ["헬스장", "뷰티샵", "학원"];
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

  /* ---------- 2. floating contact buttons (call + 문의하기) ---------- */
  var fabGroup = document.getElementById("fabGroup");
  if (fabGroup) {
    var telHref = "tel:" + CONTACT_PHONE.replace(/-/g, "");
    fabGroup.innerHTML =
      '<a class="fab fab-email" href="contact.html" aria-label="이메일로 문의하기">' +
        '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 4h16a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M3.5 5.5l8.5 7 8.5-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '</a>' +
      '<a class="fab fab-call" href="' + telHref + '" aria-label="전화 상담: ' + CONTACT_PHONE + '">' +
        '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.24.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z" fill="currentColor"/></svg>' +
      '</a>';
  }

  /* ---------- 3. 실시간 상담 가능 여부 표시 ----------
     관리자 페이지(admin.html)에서 수동으로 켜고 끌 수 있습니다. 수동 설정이 없으면
     아래 시간표(BUSINESS_DAYS/HOURS) 기준으로 자동 판단합니다. */
  var liveStatusEl = document.getElementById("liveStatus");
  if (liveStatusEl) {
    var scheduleIsOpen = function () {
      var now = new Date();
      return BUSINESS_DAYS.indexOf(now.getDay()) !== -1 &&
        now.getHours() >= BUSINESS_HOURS_START && now.getHours() < BUSINESS_HOURS_END;
    };

    var renderLiveStatus = function (manualOverride) {
      var now = new Date();
      var isOpen = typeof manualOverride === "boolean" ? manualOverride : scheduleIsOpen();
      var hh = ("0" + now.getHours()).slice(-2);
      var mm = ("0" + now.getMinutes()).slice(-2);

      liveStatusEl.classList.toggle("is-live", isOpen);
      liveStatusEl.innerHTML = isOpen
        ? '<span class="live-status-dot"></span><span class="live-status-text">지금 실시간 상담 가능 · ' + hh + ":" + mm + " 기준</span>"
        : '<span class="live-status-dot"></span><a class="live-status-text live-status-link" href="contact.html">지금은 웹사이트로 문의해주세요</a>';
    };

    var refreshLiveStatus = function () {
      fetch("/api/status", { cache: "no-store" })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          renderLiveStatus(data && typeof data.override === "boolean" ? data.override : null);
        })
        .catch(function () {
          renderLiveStatus(null);
        });
    };

    refreshLiveStatus();
    window.setInterval(refreshLiveStatus, 60000);
  }

  /* ---------- 4. mobile nav toggle ---------- */
  var navEl = document.querySelector(".nav");
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");

  if (navEl && navToggle && navLinks) {
    var closeNav = function () {
      navEl.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "메뉴 열기");
    };
    var openNav = function () {
      navEl.classList.add("is-open");
      navToggle.setAttribute("aria-expanded", "true");
      navToggle.setAttribute("aria-label", "메뉴 닫기");
    };

    navToggle.addEventListener("click", function () {
      if (navEl.classList.contains("is-open")) {
        closeNav();
      } else {
        openNav();
      }
    });

    navLinks.addEventListener("click", function (e) {
      if (e.target.tagName === "A") closeNav();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });

    document.addEventListener("click", function (e) {
      if (navEl.classList.contains("is-open") && !navEl.contains(e.target)) closeNav();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 760) closeNav();
    });
  }

  /* ---------- 5. contact form ---------- */
  var form = document.getElementById("contactForm");
  var formNote = document.getElementById("formNote");

  if (form) {
    var submitBtn = form.querySelector('button[type="submit"]');

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

      if (submitBtn) submitBtn.disabled = true;
      formNote.textContent = "전송 중...";

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: "[doion 상담 신청] " + shopName + " · " + managerName,
          from_name: "doion 웹사이트 상담 신청 폼",
          매장이름: shopName,
          담당자이름: managerName,
          연락처: phone
        })
      })
        .then(function (res) { return res.json(); })
        .then(function (result) {
          if (result.success) {
            formNote.textContent = "상담 신청이 접수되었습니다. 빠르게 연락드리겠습니다.";
            formNote.classList.add("is-success");
            form.reset();
          } else {
            formNote.textContent = "전송에 실패했습니다. 잠시 후 다시 시도해주세요.";
            formNote.classList.add("is-error");
          }
        })
        .catch(function () {
          formNote.textContent = "전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
          formNote.classList.add("is-error");
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }

  /* ---------- 6. stat counter (scroll count-up) ---------- */
  var statEls = document.querySelectorAll(".stat-number[data-target]");

  var renderStat = function (el, value) {
    var suffix = el.getAttribute("data-suffix") || "";
    el.textContent = value + suffix;
  };

  if (statEls.length && !prefersReducedMotion && "IntersectionObserver" in window) {
    var animateStat = function (el) {
      var target = parseInt(el.getAttribute("data-target"), 10) || 0;
      var duration = 1400;
      var startTime = null;

      var step = function (ts) {
        if (startTime === null) startTime = ts;
        var progress = Math.min((ts - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        renderStat(el, Math.round(target * eased));
        if (progress < 1) window.requestAnimationFrame(step);
      };
      window.requestAnimationFrame(step);
    };

    var statObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateStat(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    statEls.forEach(function (el) { statObserver.observe(el); });
  } else {
    statEls.forEach(function (el) {
      renderStat(el, parseInt(el.getAttribute("data-target"), 10) || 0);
    });
  }

  /* ---------- 7. portfolio filter tabs ---------- */
  var filterTabs = document.querySelectorAll(".filter-tab");
  var portfolioCards = document.querySelectorAll(".portfolio-card");

  if (filterTabs.length && portfolioCards.length) {
    var applyFilter = function (category) {
      portfolioCards.forEach(function (card) {
        var match = category === "all" || card.getAttribute("data-category") === category;
        if (match) {
          card.style.display = "";
          window.requestAnimationFrame(function () { card.classList.remove("is-hidden"); });
        } else {
          card.classList.add("is-hidden");
          window.setTimeout(function () {
            if (card.classList.contains("is-hidden")) card.style.display = "none";
          }, 250);
        }
      });
    };

    filterTabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        filterTabs.forEach(function (t) { t.classList.remove("is-active"); });
        tab.classList.add("is-active");
        applyFilter(tab.getAttribute("data-filter"));
      });
    });
  }
})();
