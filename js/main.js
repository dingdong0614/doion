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

  /* ---------- 6. stat counter (scroll count-up) ----------
     실제 수치는 관리자 페이지(admin.html)에서 수정할 수 있습니다. /api/stats에서
     불러온 값으로 data-target을 갱신한 뒤 카운트업을 시작하며, KV 미연동/조회
     실패 시에는 아래 HTML에 적힌 기본값을 그대로 사용합니다. */
  var statEls = document.querySelectorAll(".stat-number[data-target]");

  var renderStat = function (el, value) {
    var suffix = el.getAttribute("data-suffix") || "";
    el.textContent = value + suffix;
  };

  var setupStatCounters = function () {
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
  };

  if (statEls.length) {
    fetch("/api/stats", { cache: "no-store" })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data && data.configured !== false) {
          statEls.forEach(function (el) {
            var key = el.getAttribute("data-stat");
            if (key && typeof data[key] === "number") {
              el.setAttribute("data-target", data[key]);
            }
          });
        }
      })
      .catch(function () {})
      .then(setupStatCounters);
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

  /* ---------- 8. 히어로 터미널 체크리스트 순차 등장 ---------- */
  var termChecklist = document.querySelector(".term-checklist");
  if (termChecklist) {
    if (!prefersReducedMotion && "IntersectionObserver" in window) {
      var termItems = termChecklist.querySelectorAll("li");
      termItems.forEach(function (li, i) {
        li.style.transitionDelay = (i * 160) + "ms";
      });
      var termObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            termChecklist.classList.add("is-animated");
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      termObserver.observe(termChecklist);
    } else {
      termChecklist.classList.add("is-animated");
    }
  }

  /* ---------- 9. 스크롤 리빌: 카드가 뷰포트에 들어오면 순차적으로 페이드인 ---------- */
  var revealEls = document.querySelectorAll(".stat-card, .log-card, .spec-panel, .portfolio-card");
  if (revealEls.length && !prefersReducedMotion && "IntersectionObserver" in window) {
    var revealGroups = [];
    var revealDelay = function (el) {
      var group = null;
      for (var i = 0; i < revealGroups.length; i++) {
        if (revealGroups[i].parent === el.parentElement) { group = revealGroups[i]; break; }
      }
      if (!group) {
        group = { parent: el.parentElement, count: 0 };
        revealGroups.push(group);
      }
      var delay = Math.min(group.count * 70, 420);
      group.count++;
      return delay;
    };

    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(function (el) {
      el.classList.add("reveal");
      el.style.transitionDelay = revealDelay(el) + "ms";
      revealObserver.observe(el);
    });
  }

  /* ---------- 10. 3D 틸트 + 글레어 카드 (데스크톱 전용) ---------- */
  var canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  var initTiltCards = function (selector, withGlare) {
    var cards = document.querySelectorAll(selector);
    if (!cards.length || prefersReducedMotion || !canHover) return;

    cards.forEach(function (card) {
      card.classList.add("tilt-card");
      var glare = null;
      if (withGlare) {
        glare = document.createElement("span");
        glare.className = "tilt-glare";
        glare.setAttribute("aria-hidden", "true");
        card.appendChild(glare);
      }

      var maxTilt = 7;

      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width;
        var py = (e.clientY - rect.top) / rect.height;
        var rotateY = (px - 0.5) * maxTilt * 2;
        var rotateX = (0.5 - py) * maxTilt * 2;
        card.style.transform =
          "perspective(800px) rotateX(" + rotateX.toFixed(2) + "deg) rotateY(" + rotateY.toFixed(2) + "deg) translateY(-4px)";
        if (glare) {
          card.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
          card.style.setProperty("--my", (py * 100).toFixed(1) + "%");
        }
        card.classList.add("is-tilting");
      });

      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
        card.classList.remove("is-tilting");
      });
    });
  };

  initTiltCards(".log-card", true);
  initTiltCards(".spec-panel", true);
  initTiltCards(".portfolio-card", false);

  /* ---------- 11. 매그네틱 CTA 버튼 (데스크톱 전용) ---------- */
  if (!prefersReducedMotion && canHover) {
    var magnetButtons = document.querySelectorAll(".btn-magnetic");
    magnetButtons.forEach(function (btn) {
      var strength = 0.35;
      btn.addEventListener("mousemove", function (e) {
        var rect = btn.getBoundingClientRect();
        var relX = e.clientX - (rect.left + rect.width / 2);
        var relY = e.clientY - (rect.top + rect.height / 2);
        btn.style.transform = "translate(" + (relX * strength).toFixed(1) + "px, " + (relY * strength).toFixed(1) + "px)";
      });
      btn.addEventListener("mouseleave", function () {
        btn.style.transform = "";
      });
    });
  }

  /* ---------- 12. 히어로 인터랙티브 배경: 점들이 로고로 모였다가 네트워크로 풀어짐 (캔버스) ----------
     페이지가 열리면 흩어져 있던 점들이 잠깐 "doion" 워드마크로 모였다가(브랜드 각인),
     곧 흩어지며 서로 연결되는 점-선 네트워크로 풀립니다 — "점 하나하나가 모여 브랜드가
     되고, 그 브랜드는 매장들을 연결하는 네트워크가 된다"는 하나의 흐름으로 통합한 연출입니다.
     마우스가 지나가면 두 단계 모두에서 점들이 반응합니다. */
  var heroCanvas = document.getElementById("heroNetwork");
  if (heroCanvas && !prefersReducedMotion) {
    var heroSection = document.querySelector(".hero");
    var netCtx = heroCanvas.getContext("2d");
    var netW, netH, netDPR;
    var netMouse = { x: -9999, y: -9999, active: false };
    var netNodes = [];
    var netLastMouseX = null, netLastMouseY = null;
    var netFormStartedAt = 0;
    // 0 = doion 모양으로 완전히 모임, 1 = 완전히 풀려나 네트워크가 됨.
    // 목표값(netTargetProgress)을 향해 매 프레임 조금씩 다가가며, 호버로
    // 1을 향하고 한동안 가만히 두면(NET_IDLE_REFORM_MS) 다시 0을 향해
    // 되돌아갑니다 — 같은 물리 로직이 양방향으로 그대로 작동합니다.
    var netProgress = 0;
    var netTargetProgress = 0;
    var netLastInteractionAt = 0;
    var netLastFrameAt = 0;
    var NET_MIN_HOLD_MS = 2200;
    var NET_TRANSITION_MS = 2200;
    var NET_IDLE_REFORM_MS = 4000;
    var WIDE_BREAKPOINT = 900;
    var CELL = 128;
    var NET_LINE_DIST = 38;

    var buildLogoTargets = function (isWide) {
      var off = document.createElement("canvas");
      off.width = netW; off.height = netH;
      var octx = off.getContext("2d");

      // 넓은 화면에서는 텍스트가 왼쪽(css의 .hero .hero-wrap 560px)에 있으므로
      // 로고는 그 오른쪽 여백에 그리고, 좁은 화면에서는 카드가 화면 전체를
      // 차지하므로 카드보다 위쪽(css에서 미리 넓혀둔 상단 여백)에 작게 그려서
      // 어느 화면에서도 카드에 가려지지 않게 합니다.
      var centerX, centerY, fontSize, regionW;
      if (isWide) {
        var regionX0 = 640;
        regionW = Math.max(netW - regionX0 - 40, 300);
        centerX = regionX0 + regionW / 2;
        fontSize = Math.min(regionW * 0.24, 170);
        centerY = netH * 0.46;
      } else {
        regionW = netW;
        centerX = netW / 2;
        fontSize = Math.min(regionW * 0.24, 92);
        centerY = 100;
      }

      octx.font = "800 " + fontSize + "px Pretendard, Arial, sans-serif";
      octx.fillStyle = "#fff";
      octx.textAlign = "center";
      octx.textBaseline = "middle";
      octx.fillText("doion", centerX, centerY);

      // 글자 내부 픽셀을 촘촘하게 전부 사용합니다(일부만 무작위로 골라 쓰면
      // 획 중간중간이 비어 보여 가독성이 떨어짐).
      var step = Math.max(2, Math.floor(fontSize / 34));
      var candidates = [];
      var data = octx.getImageData(0, 0, netW, netH).data;
      for (var y = 0; y < netH; y += step) {
        for (var x = 0; x < netW; x += step) {
          if (data[(y * netW + x) * 4 + 3] > 128) candidates.push({ x: x, y: y });
        }
      }
      return candidates;
    };

    var netIsWide = false;

    var netInitNodes = function () {
      var isWide = netW >= WIDE_BREAKPOINT;
      netIsWide = isWide;
      var targets = buildLogoTargets(isWide);
      var count = targets.length || Math.max(30, Math.floor((netW * netH) / 28000));
      // 모바일에서는 글자가 작아서(넓은 화면보다 폰트가 훨씬 작음) 흔들림
      // 폭이 크면 획이 뭉개져 잘 안 읽힙니다. 화면이 좁을수록 흔들림을 줄입니다.
      var wobbleScale = isWide ? 1 : 0.4;
      netNodes = [];
      for (var i = 0; i < count; i++) {
        var t = targets[i];
        netNodes.push({
          x: Math.random() * netW,
          y: Math.random() * netH,
          tx: t ? t.x : Math.random() * netW,
          ty: t ? t.y : Math.random() * netH,
          vx: 0,
          vy: 0,
          r: Math.random() * 1.5 + 1.1,
          // 다 모인 뒤 제자리에서 계속 살짝 흔들리도록 각자 다른 위상/속도를 부여합니다.
          wPhaseX: Math.random() * Math.PI * 2,
          wPhaseY: Math.random() * Math.PI * 2,
          wFreqX: 0.0006 + Math.random() * 0.0006,
          wFreqY: 0.0006 + Math.random() * 0.0006,
          wAmpX: (2 + Math.random() * 3) * wobbleScale,
          wAmpY: (2 + Math.random() * 3) * wobbleScale,
          ex: 0,
          ey: 0,
          // 전체가 똑같은 타이밍으로 한 몸처럼 움직이면 기계적으로 보이므로,
          // 점마다 진행률을 살짝 어긋나게 둬서 물결처럼 하나씩 풀리고
          // 하나씩 모이게 합니다.
          pJitter: (Math.random() - 0.5) * 0.3
        });
      }
      netFormStartedAt = Date.now();
      netProgress = 0;
      netTargetProgress = 0;
    };

    var netResize = function () {
      var newW = heroSection.clientWidth;
      var newH = heroSection.clientHeight;
      // 모바일에서 스크롤하면 주소창이 접혔다 펴지면서 뷰포트 높이만 바뀌어도
      // resize 이벤트가 뜹니다. 그때마다 점을 처음부터 다시 만들면 스크롤해서
      // 위로 올라올 때마다 애니메이션이 리셋된 것처럼 보이므로, 폭이 실제로
      // 바뀌었을 때만(=진짜 리사이즈/회전) 다시 만듭니다.
      var isFirstRun = netNodes.length === 0;
      var widthChanged = isFirstRun || Math.abs(newW - netW) > 4;

      netDPR = Math.min(window.devicePixelRatio || 1, 2);
      netW = newW;
      netH = newH;
      heroCanvas.width = netW * netDPR;
      heroCanvas.height = netH * netDPR;
      heroCanvas.style.width = netW + "px";
      heroCanvas.style.height = netH + "px";
      netCtx.setTransform(netDPR, 0, 0, netDPR, 0, 0);

      if (widthChanged) netInitNodes();
    };

    var drawGradientWash = function () {
      var t = Date.now() / 6000;
      var gx = netW * 0.5 + Math.sin(t) * netW * 0.25;
      var gy = netH * 0.35 + Math.cos(t * 0.8) * netH * 0.2;
      var grad = netCtx.createRadialGradient(gx, gy, 0, gx, gy, Math.max(netW, netH) * 0.7);
      grad.addColorStop(0, "rgba(70,117,219,0.16)");
      grad.addColorStop(1, "rgba(70,117,219,0)");
      netCtx.fillStyle = grad;
      netCtx.fillRect(0, 0, netW, netH);
    };

    // 점이 많아지면(최대 1000개 이상) 모든 쌍을 다 검사하는 방식은 느려지므로,
    // 화면을 128px 격자로 나눠 각 점은 바로 옆 칸에 있는 점하고만 거리를
    // 비교합니다 — 결과(가까운 점끼리만 선으로 연결)는 같지만 훨씬 빠릅니다.
    var NEIGHBOR_OFFSETS = [[0, 0], [1, 0], [0, 1], [1, 1], [-1, 1]];
    var drawConnections = function (opacityMul, maxDist) {
      if (maxDist === undefined) maxDist = CELL;
      var grid = {};
      for (var i = 0; i < netNodes.length; i++) {
        var n = netNodes[i];
        var key = Math.floor(n.x / CELL) + "_" + Math.floor(n.y / CELL);
        (grid[key] || (grid[key] = [])).push(i);
      }
      Object.keys(grid).forEach(function (key) {
        var parts = key.split("_");
        var cx = parseInt(parts[0], 10), cy = parseInt(parts[1], 10);
        var cellIdxs = grid[key];
        NEIGHBOR_OFFSETS.forEach(function (off) {
          var otherIdxs = grid[(cx + off[0]) + "_" + (cy + off[1])];
          if (!otherIdxs) return;
          var sameCell = off[0] === 0 && off[1] === 0;
          for (var a = 0; a < cellIdxs.length; a++) {
            var startB = sameCell ? a + 1 : 0;
            for (var b = startB; b < otherIdxs.length; b++) {
              var na = netNodes[cellIdxs[a]], nb = netNodes[otherIdxs[b]];
              var d = Math.hypot(na.x - nb.x, na.y - nb.y);
              if (d >= maxDist) continue;
              var op = (1 - d / maxDist) * 0.5 * opacityMul;
              if (op < 0.003) continue;
              netCtx.strokeStyle = "rgba(120,160,220," + op.toFixed(3) + ")";
              netCtx.lineWidth = 0.7;
              netCtx.beginPath();
              netCtx.moveTo(na.x, na.y);
              netCtx.lineTo(nb.x, nb.y);
              netCtx.stroke();
            }
          }
        });
      });
    };

    var drawDots = function () {
      netNodes.forEach(function (n) {
        netCtx.beginPath();
        netCtx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        netCtx.fillStyle = "rgba(220,233,255,0.95)";
        netCtx.fill();
      });
    };

    var netStep = function () {
      netCtx.clearRect(0, 0, netW, netH);
      drawGradientWash();

      var now = Date.now();
      var dt = netLastFrameAt ? Math.min(now - netLastFrameAt, 100) : 16.7;
      netLastFrameAt = now;

      // 한동안(NET_IDLE_REFORM_MS) 마우스가 움직이지 않으면 다시 doion
      // 모양으로 모이도록 목표를 되돌립니다. 계속 움직이는 동안은 풀린
      // 상태를 유지합니다.
      if (netTargetProgress >= 1 && now - netLastInteractionAt > NET_IDLE_REFORM_MS) {
        netTargetProgress = 0;
      }

      // netProgress를 목표값 쪽으로 일정한 속도로 움직입니다 — 늘어나는
      // 방향(풀림)과 줄어드는 방향(다시 모임)에 같은 물리를 그대로 씁니다.
      var wasAboveZero = netProgress > 0;
      var step = dt / NET_TRANSITION_MS;
      if (netProgress < netTargetProgress) netProgress = Math.min(netProgress + step, netTargetProgress);
      else if (netProgress > netTargetProgress) netProgress = Math.max(netProgress - step, netTargetProgress);

      // 완전히 다시 모이면 이전에 쓰던 확산 방향을 지워, 쉬는 동안 잔여
      // 힘이 남아 미세하게 계속 흘러가는 일이 없도록 합니다.
      if (netProgress === 0 && wasAboveZero) {
        netNodes.forEach(function (n) { n.ex = 0; n.ey = 0; });
      }

      netNodes.forEach(function (n) {
        var localT = Math.min(Math.max(netProgress + n.pJitter, 0), 1);
        // 대칭적인 완만한 커브(smootherstep): 풀릴 때도 모일 때도 자연스럽게
        var eased = localT * localT * (3 - 2 * localT);
        var pull = 1 - eased;

        var liveTx = n.tx + Math.sin(now * n.wFreqX + n.wPhaseX) * n.wAmpX;
        var liveTy = n.ty + Math.cos(now * n.wFreqY + n.wPhaseY) * n.wAmpY;
        var dx = liveTx - n.x, dy = liveTy - n.y;
        var springVx = (n.vx + dx * 0.005) * 0.9;
        var springVy = (n.vy + dy * 0.005) * 0.9;

        if (eased > 0) {
          n.vx = springVx * pull + n.ex * eased;
          n.vy = springVy * pull + n.ey * eased;
        } else {
          n.vx = springVx; n.vy = springVy;
        }

        if (netProgress > 0) {
          // 가장자리에 가까워지면 딱 부딪혀 반사되기 전에 미리 중앙 쪽으로
          // 살짝 당겨서, 고정된 각도로 튕기는 당구공처럼 네모난 궤적을
          // 그리며 갇힌 것처럼 보이지 않고 자연스럽게 안쪽으로 휘어 돌아오게
          // 합니다.
          var margin = 140;
          if (n.x < margin) n.vx += (margin - n.x) / margin * 0.12;
          else if (n.x > netW - margin) n.vx -= (n.x - (netW - margin)) / margin * 0.12;
          if (n.y < margin) n.vy += (margin - n.y) / margin * 0.12;
          else if (n.y > netH - margin) n.vy -= (n.y - (netH - margin)) / margin * 0.12;

          // 그래도 실제 가장자리에 닿으면(안전장치) 위치를 벽에 딱 붙이고
          // 속도를 안쪽으로 확실히 뒤집습니다. 매 프레임 "밖에 있으니
          // 뒤집기"만 하면 한 번에 못 돌아온 점이 벽 밖에서 계속 방향이
          // 뒤집히며 제자리에서 떨게 됩니다.
          if (n.x < 0) { n.x = 0; n.vx = Math.abs(n.vx); }
          else if (n.x > netW) { n.x = netW; n.vx = -Math.abs(n.vx); }
          if (n.y < 0) { n.y = 0; n.vy = Math.abs(n.vy); }
          else if (n.y > netH) { n.y = netH; n.vy = -Math.abs(n.vy); }
        }

        if (netMouse.active) {
          var mdx = n.x - netMouse.x, mdy = n.y - netMouse.y;
          var mdist = Math.hypot(mdx, mdy);
          var radius = 70 + 70 * eased;
          if (mdist < radius) {
            var f = (radius - mdist) / radius;
            n.vx += (mdx / (mdist || 1)) * f * (3.2 - eased);
            n.vy += (mdy / (mdist || 1)) * f * (3.2 - eased);
          }
        }

        n.x += n.vx; n.y += n.vy;
      });

      if (netProgress > 0) {
        var opacityMul = netProgress * netProgress;
        var maxDist = NET_LINE_DIST * Math.pow(netProgress, 1.5);
        drawConnections(opacityMul, maxDist);
      }
      drawDots();

      window.requestAnimationFrame(netStep);
    };

    window.addEventListener("resize", netResize);
    heroSection.addEventListener("mousemove", function (e) {
      var rect = heroSection.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      // 페이지 전환 직후 커서가 가만히 있어도 브라우저가 mousemove를 한 번 쏘는
      // 경우가 있어, 실제로 움직인 거리가 있을 때만 "의도된 호버"로 인정합니다.
      if (netLastMouseX !== null && Math.hypot(x - netLastMouseX, y - netLastMouseY) > 4) {
        netLastInteractionAt = Date.now();
        if (netIsWide && netLastInteractionAt - netFormStartedAt > NET_MIN_HOLD_MS) {
          if (netTargetProgress === 0) {
            // 새로 풀려날 때마다 흩어지는 방향을 다시 무작위로 정해 매번
            // 다른 모습으로 퍼지게 합니다.
            netNodes.forEach(function (n) {
              n.ex = (Math.random() - 0.5) * 1.6;
              n.ey = (Math.random() - 0.5) * 1.6;
            });
          }
          netTargetProgress = 1;
        }
      }
      netLastMouseX = x; netLastMouseY = y;
      netMouse.x = x; netMouse.y = y;
      netMouse.active = true;
    });
    heroSection.addEventListener("mouseleave", function () {
      netMouse.active = false;
    });
    heroSection.addEventListener("touchmove", function (e) {
      var rect = heroSection.getBoundingClientRect();
      var t = e.touches[0];
      netMouse.x = t.clientX - rect.left;
      netMouse.y = t.clientY - rect.top;
      netMouse.active = true;
    }, { passive: true });

    netResize();
    netStep();
  }
})();
