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
    var heroWrap = heroSection.querySelector(".hero-wrap");
    var netCtx = heroCanvas.getContext("2d");
    var netW, netH, netDPR;
    var netMouse = { x: -9999, y: -9999, active: false };
    var netNodes = [];
    var netPhase = "form";
    var netFormStartedAt = 0;
    var netReleaseTriggered = false;
    var netReleaseStartedAt = 0;
    var NET_MIN_HOLD_MS = 2200;
    var netMouseMoved = false;
    var netLastMouseX = null, netLastMouseY = null;
    var NET_RELEASE_MS = 2000;
    var NET_CONTENT_REVEAL_MS = 1900;
    var WIDE_BREAKPOINT = 900;
    var NET_AMBIENT_COUNT = 170;

    var buildLogoTargets = function (isWide) {
      var off = document.createElement("canvas");
      off.width = netW; off.height = netH;
      var octx = off.getContext("2d");

      // 넓은 화면에서는 텍스트가 왼쪽(css의 .hero .hero-wrap 560px)에 있으므로,
      // 로고는 그 오른쪽 여백에만 그려서 겹치지 않게 합니다.
      var regionX0 = isWide ? 640 : 0;
      var regionW = isWide ? Math.max(netW - regionX0 - 40, 300) : netW;
      var centerX = regionX0 + regionW / 2;
      var fontSize = Math.min(regionW * 0.24, 170);

      octx.font = "800 " + fontSize + "px Pretendard, Arial, sans-serif";
      octx.fillStyle = "#fff";
      octx.textAlign = "center";
      octx.textBaseline = "middle";
      octx.fillText("doion", centerX, netH * 0.46);

      // 글자 내부 픽셀을 촘촘하게 전부 사용합니다(일부만 무작위로 골라 쓰면
      // 획 중간중간이 비어 보여 가독성이 떨어짐). 획수가 적은 만큼 총 개수는
      // 수백~천 개 안팎이라 이 형성 단계에서는 성능 부담도 크지 않습니다.
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

    var netInitNodes = function () {
      var isWide = netW >= WIDE_BREAKPOINT;
      var targets = buildLogoTargets(isWide);
      var count = targets.length || Math.max(30, Math.floor((netW * netH) / 28000));
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
          r: Math.random() * 1.5 + 1.1
        });
      }
      netPhase = targets.length ? "form" : "network";
      netFormStartedAt = Date.now();
      netReleaseTriggered = false;
      netFadingNodes = [];
      netReleaseStartedAt = 0;

      // 넓은 화면에서는 텍스트/카드가 로고와 겹치지 않으므로 계속 보이게 둡니다
      // (숨겼다 갑자기 나타나는 연출 없음). 좁은 화면에서만 겹치므로 잠깐 숨깁니다.
      if (heroWrap) {
        if (isWide || netPhase === "network") {
          heroWrap.classList.remove("is-intro-hidden");
        } else {
          heroWrap.classList.add("is-intro-hidden");
          window.setTimeout(function () {
            heroWrap.classList.remove("is-intro-hidden");
          }, NET_CONTENT_REVEAL_MS);
        }
      }
    };

    var netResize = function () {
      netDPR = Math.min(window.devicePixelRatio || 1, 2);
      netW = heroSection.clientWidth;
      netH = heroSection.clientHeight;
      heroCanvas.width = netW * netDPR;
      heroCanvas.height = netH * netDPR;
      heroCanvas.style.width = netW + "px";
      heroCanvas.style.height = netH + "px";
      netCtx.setTransform(netDPR, 0, 0, netDPR, 0, 0);
      netInitNodes();
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

    var drawConnections = function (opacityMul, maxDist) {
      if (maxDist === undefined) maxDist = 128;
      for (var i = 0; i < netNodes.length; i++) {
        for (var j = i + 1; j < netNodes.length; j++) {
          var a = netNodes[i], b = netNodes[j];
          var ddx = a.x - b.x, ddy = a.y - b.y;
          var d = Math.hypot(ddx, ddy);
          if (d < maxDist) {
            var op = (1 - d / maxDist) * 0.5 * opacityMul;
            if (op < 0.003) continue;
            netCtx.strokeStyle = "rgba(120,160,220," + op.toFixed(3) + ")";
            netCtx.lineWidth = 0.7;
            netCtx.beginPath();
            netCtx.moveTo(a.x, a.y);
            netCtx.lineTo(b.x, b.y);
            netCtx.stroke();
          }
        }
      }
    };

    var drawDots = function () {
      netNodes.forEach(function (n) {
        netCtx.beginPath();
        netCtx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        netCtx.fillStyle = "rgba(220,233,255,0.95)";
        netCtx.fill();
      });
    };

    var NET_FADE_MS = 550;
    var netFadingNodes = [];

    var stepForm = function () {
      // 다 모인 뒤에는 그대로 "doion" 모양을 유지합니다. 마우스가 (터치 시엔
      // 탭이) 들어오면 그때부터 서서히 퍼지기 시작해 네트워크로 풀립니다 —
      // 타이머로 갑자기 확 바뀌지 않고, 연결선도 진행률에 맞춰 서서히 옅게
      // 나타납니다. 글자를 읽으려면 점이 촘촘해야 하지만 그만큼 다 데리고
      // 네트워크로 풀면 선 계산이 무거워지므로, 트리거 시점에 일부만 남기고
      // 나머지는 자리에서 옅어지며 사라집니다.
      if (!netReleaseTriggered && netMouseMoved && Date.now() - netFormStartedAt > NET_MIN_HOLD_MS) {
        netReleaseTriggered = true;
        netReleaseStartedAt = Date.now();

        if (netNodes.length > NET_AMBIENT_COUNT) {
          for (var i = netNodes.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = netNodes[i]; netNodes[i] = netNodes[j]; netNodes[j] = tmp;
          }
          netFadingNodes = netNodes.slice(NET_AMBIENT_COUNT);
          netNodes = netNodes.slice(0, NET_AMBIENT_COUNT);
          var fadeStart = Date.now();
          netFadingNodes.forEach(function (n) { n.fadeStart = fadeStart; });
        }

        netNodes.forEach(function (n) {
          n.ex = (Math.random() - 0.5) * 0.35;
          n.ey = (Math.random() - 0.5) * 0.35;
        });
      }

      var releaseProgress = netReleaseTriggered
        ? Math.min((Date.now() - netReleaseStartedAt) / NET_RELEASE_MS, 1)
        : 0;
      var pull = 1 - releaseProgress;

      netNodes.forEach(function (n) {
        var dx = n.tx - n.x, dy = n.ty - n.y;
        var springVx = n.vx + dx * 0.02;
        var springVy = n.vy + dy * 0.02;
        springVx *= 0.82; springVy *= 0.82;

        if (releaseProgress > 0) {
          n.vx = springVx * pull + n.ex * releaseProgress;
          n.vy = springVy * pull + n.ey * releaseProgress;
        } else {
          n.vx = springVx; n.vy = springVy;
        }

        if (netMouse.active) {
          var mdx = n.x - netMouse.x, mdy = n.y - netMouse.y;
          var mdist = Math.hypot(mdx, mdy);
          if (mdist < 70) {
            var f = (70 - mdist) / 70;
            n.vx += (mdx / (mdist || 1)) * f * 3.2;
            n.vy += (mdy / (mdist || 1)) * f * 3.2;
          }
        }

        n.x += n.vx; n.y += n.vy;
      });

      if (releaseProgress > 0) {
        // 선은 진행률의 제곱으로 옅어지고, 연결 가능 거리도 함께 자라도록 해서
        // "갑자기 그물이 나타나는" 느낌 없이 서서히 자라나게 합니다.
        drawConnections(releaseProgress * releaseProgress, 128 * Math.pow(releaseProgress, 1.5));
      }
      drawDots();

      if (netFadingNodes.length) {
        var now = Date.now();
        netFadingNodes = netFadingNodes.filter(function (n) {
          var t = (now - n.fadeStart) / NET_FADE_MS;
          if (t >= 1) return false;
          netCtx.beginPath();
          netCtx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
          netCtx.fillStyle = "rgba(220,233,255," + (0.95 * (1 - t)).toFixed(3) + ")";
          netCtx.fill();
          return true;
        });
      }

      if (releaseProgress >= 1) {
        netPhase = "network";
      }
    };

    var stepNetwork = function () {
      netNodes.forEach(function (n) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > netW) n.vx *= -1;
        if (n.y < 0 || n.y > netH) n.vy *= -1;

        if (netMouse.active) {
          var dx = n.x - netMouse.x, dy = n.y - netMouse.y;
          var dist = Math.hypot(dx, dy);
          var radius = 140;
          if (dist < radius) {
            var force = (radius - dist) / radius;
            n.x += (dx / (dist || 1)) * force * 2.2;
            n.y += (dy / (dist || 1)) * force * 2.2;
          }
        }
      });

      drawConnections(1);
      drawDots();
    };

    var netStep = function () {
      netCtx.clearRect(0, 0, netW, netH);
      drawGradientWash();

      if (netPhase === "form") {
        stepForm();
      } else {
        stepNetwork();
      }

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
        netMouseMoved = true;
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
      netMouseMoved = true;
    }, { passive: true });

    netResize();
    netStep();
  }
})();
