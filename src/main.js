import "./style.css";
import "flyonui/flyonui.js";
import AOS from "aos";
import "aos/dist/aos.css";

AOS.init({
  duration: 650,
  easing: "ease-out-cubic",
  once: true,
  offset: 60,
  disableMutationObserver: false,
});

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

const progressBar = document.getElementById("scroll-progress");
if (progressBar) {
  let ticking = false;
  const updateProgress = () => {
    const scrollable =
      document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
    progressBar.style.transform = `scaleX(${Math.min(ratio, 1)})`;
    ticking = false;
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    },
    { passive: true },
  );
  updateProgress();
}

const backToTop = document.getElementById("back-to-top");
if (backToTop) {
  const toggleBackToTop = () => {
    backToTop.classList.toggle("is-visible", window.scrollY > 600);
  };
  window.addEventListener("scroll", toggleBackToTop, { passive: true });
  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  });
  toggleBackToTop();
}

const counters = document.querySelectorAll(".stat-counter");
if (counters.length) {
  const formatNum = (n) => n.toLocaleString("en-US");
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10) || 0;
    if (prefersReducedMotion) {
      el.textContent = "+" + formatNum(target);
      return;
    }
    const duration = 1800;
    let startTime = null;
    const step = (timestamp) => {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      el.textContent = "+" + formatNum(Math.round(target * eased));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  };
  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 },
  );
  counters.forEach((el) => counterObserver.observe(el));
}

if (!prefersReducedMotion && window.matchMedia("(hover: hover)").matches) {
  const tiltCards = document.querySelectorAll(".main-card");
  tiltCards.forEach((card) => {
    let rafId = null;
    const onMove = (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      card.style.setProperty("--mx", `${px * 100}%`);
      card.style.setProperty("--my", `${py * 100}%`);
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        const rotY = (px - 0.5) * 6; // ميل أفقي خفيف
        const rotX = (0.5 - py) * 6; // ميل رأسي خفيف
        card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
        rafId = null;
      });
    };
    const onLeave = () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      rafId = null;
      card.style.transform = "";
    };
    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", onLeave);
  });
}

if (document.querySelector(".splide")) {
  var splide = new Splide(".splide", {
    type: "loop",
    perPage: 3,
    focus: "center",
    direction: "rtl",
    gap: "1.5rem",
    pagination: false,
    arrows: false,
    breakpoints: {
      1024: { perPage: 2 },
      640: { perPage: 1, gap: "1rem", focus: 0 },
    },
  });

  splide.mount();
}

const siteHeader = document.getElementById("site-header");
if (siteHeader) {
  const onScroll = () => {
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 10);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

const drawer = document.getElementById("mobile-drawer");
const drawerOverlay = document.getElementById("drawer-overlay");
const menuOpenBtn = document.getElementById("menu-open");
const menuCloseBtn = document.getElementById("menu-close");

if (drawer && drawerOverlay) {
  const openDrawer = () => {
    drawer.classList.add("is-open");
    drawerOverlay.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    if (menuOpenBtn) menuOpenBtn.setAttribute("aria-expanded", "true");
  };
  const closeDrawer = () => {
    drawer.classList.remove("is-open");
    drawerOverlay.classList.add("hidden");
    document.body.style.overflow = "";
    if (menuOpenBtn) menuOpenBtn.setAttribute("aria-expanded", "false");
  };

  if (menuOpenBtn) menuOpenBtn.addEventListener("click", openDrawer);
  if (menuCloseBtn) menuCloseBtn.addEventListener("click", closeDrawer);
  drawerOverlay.addEventListener("click", closeDrawer);
  drawer.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeDrawer);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });
}

document.querySelectorAll(".dd-option").forEach((opt) => {
  opt.addEventListener("click", () => {
    const dd = opt.closest(".dropdown");
    if (!dd) return;
    const toggle = dd.querySelector(".dropdown-toggle");
    const label = dd.querySelector(".dd-label");
    if (label) label.textContent = opt.textContent.trim();
    if (toggle) {
      toggle.classList.remove("text-gray-400");
      toggle.classList.add("text-brand-navy");
    }
  });
});

// كاليندر الفعاليات (FullCalendar)
const calendarEl = document.getElementById("events-calendar");
if (calendarEl && window.FullCalendar) {
  const pad = (n) => String(n).padStart(2, "0");
  const keyOf = (d) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  const selectedDay = "2026-03-20";

  // عناوين الفعاليات لكل يوم (للـ tooltip فقط — الكروت ثابتة)
  const dayEvents = {
    "2026-03-10": ["ملتقى المبادرات المجتمعية للأيتام"],
    "2026-03-20": ["عيد الفطر", "اليوم العالمي للسعادة"],
    "2026-03-27": ["فعالية يوم التأسيس تمكين الأيتام"],
    "2026-03-30": ["ورشة تطوير المهارات الحياتية"],
  };

  // بناء محتوى الـ tooltip لليوم
  const tooltipLines = (key) =>
    dayEvents[key] && dayEvents[key].length
      ? dayEvents[key]
      : ["لا توجد فعاليات في هذا اليوم"];

  // إظهار tooltip على خلية يوم محددة (واحد فقط، مع تثبيته داخل حدود الكاليندر)
  const showTooltip = (dayEl, key) => {
    calendarEl.querySelectorAll(".fc-day-tooltip").forEach((t) => t.remove());
    const numEl = dayEl.querySelector(".fc-daygrid-day-number") || dayEl;
    if (!numEl) return;
    const hasEvents = !!(dayEvents[key] && dayEvents[key].length);
    const tip = document.createElement("div");
    tip.className = "fc-day-tooltip" + (hasEvents ? "" : " is-empty");
    tip.innerHTML = tooltipLines(key)
      .map((t) => `<span>${t}</span>`)
      .join("");
    calendarEl.appendChild(tip);

    // حساب الموضع نسبةً لحاوية الكاليندر
    const calRect = calendarEl.getBoundingClientRect();
    const cellRect = numEl.getBoundingClientRect();
    const cellCenterX = cellRect.left - calRect.left + cellRect.width / 2;
    const cellTop = cellRect.top - calRect.top;
    const margin = 6;
    let left = cellCenterX - tip.offsetWidth / 2;
    left = Math.max(
      margin,
      Math.min(left, calRect.width - tip.offsetWidth - margin),
    );
    tip.style.left = `${left}px`;
    tip.style.top = `${cellTop - tip.offsetHeight - 10}px`;
    // توجيه السهم نحو مركز اليوم
    tip.style.setProperty("--arrow-x", `${cellCenterX - left}px`);
  };

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    initialDate: "2026-03-20",
    locale: "ar",
    direction: "rtl",
    firstDay: 6,
    height: "auto",
    fixedWeekCount: false,
    showNonCurrentDates: true,
    headerToolbar: { start: "prev", center: "title", end: "next" },
    titleFormat: { year: "numeric", month: "long" },
    dayHeaderContent: (arg) => {
      const names = [
        "الأحد",
        "الاثنين",
        "الثلاثاء",
        "الاربعاء",
        "الخميس",
        "الجمعة",
        "السبت",
      ];
      return names[arg.dow];
    },
    dayCellClassNames: (arg) => {
      const key = keyOf(arg.date);
      const cls = [];
      if (dayEvents[key]) cls.push("day-event");
      if (key === selectedDay) cls.push("day-selected");
      return cls;
    },
    dateClick: (info) => {
      // نقل التحديد إلى اليوم المضغوط
      calendarEl
        .querySelectorAll(".day-selected, .day-active")
        .forEach((el) => el.classList.remove("day-selected", "day-active"));
      info.dayEl.classList.add(
        dayEvents[info.dateStr] ? "day-selected" : "day-active",
      );
      // إظهار tooltip لليوم (فعالياته أو عدم وجودها)
      showTooltip(info.dayEl, info.dateStr);
    },
  });
  calendar.render();

  // إظهار tooltip لليوم المحدد افتراضياً (بعد اكتمال التخطيط)
  requestAnimationFrame(() => {
    const initialCell = calendarEl.querySelector(
      `.fc-daygrid-day[data-date="${selectedDay}"]`,
    );
    if (initialCell) showTooltip(initialCell, selectedDay);
  });
}

// الخريطة التفاعلية لمناطق المملكة: تحديث البطاقة عند الضغط على منطقة
const saMap = document.getElementById("sa-map");
const regionNameEl = document.getElementById("region-name");
const regionListEl = document.getElementById("region-list");
if (saMap && regionNameEl && regionListEl) {
  const logoPool = [
    "image 3.svg",
    "image 4.svg",
    "image 5.svg",
    "logo2.svg",
  ].map((f) => "/src/assets/images/" + f);
  const regionsData = {
    SAU1097: {
      name: "منطقة الرياض",
      items: [
        "جمعية كيان للأيتام",
        "الجمعية الخيرية لرعاية الأيتام",
        "جمعية ساعد القانونية لخدمة الأيتام",
        "المجلس الفرعي التخصصي لجمعيات الأيتام",
      ],
    },
    SAU1098: {
      name: "المنطقة الشرقية",
      items: [
        "جمعية إنسان لرعاية الأيتام",
        "جمعية بنيان الخيرية",
        "جمعية رعاية الأيتام بالأحساء",
        "جمعية كنف لرعاية الأيتام",
      ],
    },
    SAU888: {
      name: "منطقة مكة المكرمة",
      items: [
        "جمعية أيتام جدة",
        "جمعية رعاية الأيتام بمكة",
        "جمعية بر جدة",
        "جمعية الأيتام الخيرية",
      ],
    },
    SAU886: {
      name: "منطقة عسير",
      items: [
        "جمعية رعاية الأيتام بعسير",
        "جمعية أبها الخيرية",
        "جمعية كنف بعسير",
        "جمعية بر خميس مشيط",
      ],
    },
    SAU845: {
      name: "المدينة المنورة",
      items: [
        "جمعية رعاية الأيتام بالمدينة",
        "جمعية أيتام طيبة",
        "جمعية بر المدينة",
      ],
    },
    SAU1096: {
      name: "منطقة نجران",
      items: ["جمعية رعاية الأيتام بنجران", "جمعية بر نجران"],
    },
    SAU846: {
      name: "منطقة القصيم",
      items: ["جمعية رعاية الأيتام بالقصيم", "جمعية بريدة الخيرية"],
    },
    SAU848: {
      name: "منطقة تبوك",
      items: ["جمعية رعاية الأيتام بتبوك", "جمعية بر تبوك"],
    },
    SAU862: {
      name: "منطقة الجوف",
      items: ["جمعية رعاية الأيتام بالجوف", "جمعية سكاكا الخيرية"],
    },
    SAU887: {
      name: "منطقة جازان",
      items: ["جمعية رعاية الأيتام بجازان", "جمعية بر جازان"],
    },
    SAU861: {
      name: "منطقة الحدود الشمالية",
      items: ["جمعية رحمة لرعاية الأيتام بالعويقيلة"],
    },
    SAU885: {
      name: "منطقة الباحة",
      items: ["جمعية رعاية الأيتام بالباحة"],
    },
    SAU847: { name: "منطقة حائل", items: [] },
  };

  const regions = saMap.querySelectorAll(".region");
  const renderRegion = (id) => {
    const data = regionsData[id];
    if (!data) return;
    regionNameEl.textContent = data.name;
    if (!data.items.length) {
      regionListEl.innerHTML =
        '<li class="px-4 py-12 text-center text-sm text-gray-400">لا توجد جمعيات مسجلة في هذه المنطقة حالياً</li>';
    } else {
      regionListEl.innerHTML = data.items
        .map(
          (name, i) => `
        <li class="flex items-center justify-between gap-4 px-4 py-4">
          <div class="min-w-0">
            <p class="truncate text-sm font-bold text-brand-navy">${name}</p>
            <a href="associations-details.html" class="mt-1.5 inline-flex items-center gap-1 text-xs text-gray-400 transition hover:text-brand-green">اقرأ المزيد <i class="fa-solid fa-angle-left text-[10px]"></i></a>
          </div>
          <img src="${logoPool[i % logoPool.length]}" alt="" class="h-11 w-auto max-w-[84px] shrink-0 object-contain" />
        </li>`,
        )
        .join("");
    }
    regions.forEach((r) => r.classList.toggle("is-active", r.id === id));
  };

  regions.forEach((r) => {
    r.addEventListener("click", () => renderRegion(r.id));
    r.style.cursor = "pointer";
  });
  renderRegion("SAU1097");
}

// إظهار/إخفاء كلمة المرور في صفحات الحساب
document.querySelectorAll(".pw-toggle").forEach((btn) => {
  btn.addEventListener("click", () => {
    const wrap = btn.closest(".relative");
    const input = wrap && wrap.querySelector("input");
    if (!input) return;
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    const icon = btn.querySelector("i");
    if (icon) {
      icon.classList.toggle("fa-eye-slash", !show);
      icon.classList.toggle("fa-eye", show);
    }
  });
});

// رمز التحقق (OTP) في صفحة تفعيل الحساب
const otpInputs = document.querySelectorAll(".otp-input");
if (otpInputs.length) {
  const submitBtn = document.getElementById("otp-submit");
  const syncSubmit = () => {
    const filled = [...otpInputs].every((i) => i.value.trim() !== "");
    if (submitBtn) submitBtn.disabled = !filled;
  };
  otpInputs.forEach((input, idx) => {
    input.addEventListener("input", () => {
      // أرقام فقط
      input.value = input.value.replace(/\D/g, "").slice(0, 1);
      if (input.value && idx < otpInputs.length - 1) otpInputs[idx + 1].focus();
      syncSubmit();
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !input.value && idx > 0) {
        otpInputs[idx - 1].focus();
      }
    });
    input.addEventListener("paste", (e) => {
      e.preventDefault();
      const digits = (e.clipboardData.getData("text") || "")
        .replace(/\D/g, "")
        .split("");
      otpInputs.forEach((box, i) => (box.value = digits[i] || ""));
      const next = Math.min(digits.length, otpInputs.length - 1);
      otpInputs[next].focus();
      syncSubmit();
    });
  });

  // مؤقّت إعادة إرسال الرمز
  const timerEl = document.getElementById("otp-timer");
  const timerWrap = document.getElementById("otp-resend-wrap");
  const resendBtn = document.getElementById("otp-resend");
  if (timerEl && resendBtn) {
    let remaining = 57;
    const fmt = (s) =>
      `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
    const startTimer = () => {
      remaining = 57;
      timerEl.textContent = fmt(remaining);
      timerWrap.classList.remove("hidden");
      resendBtn.classList.add("hidden");
      const id = setInterval(() => {
        remaining -= 1;
        if (remaining <= 0) {
          clearInterval(id);
          timerWrap.classList.add("hidden");
          resendBtn.classList.remove("hidden");
        } else {
          timerEl.textContent = fmt(remaining);
        }
      }, 1000);
    };
    resendBtn.addEventListener("click", startTimer);
    startTimer();
  }
}

// التبويبات: تبديل المحتوى عند الضغط على كل تبويب
const assocTabs = document.querySelectorAll(".assoc-tab");
const assocPanels = document.querySelectorAll(".assoc-panel");
assocTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = document.querySelector(tab.dataset.tab);
    assocTabs.forEach((t) => {
      t.classList.remove("is-active");
      t.setAttribute("aria-selected", "false");
    });
    assocPanels.forEach((p) => p.classList.add("hidden"));
    tab.classList.add("is-active");
    tab.setAttribute("aria-selected", "true");
    if (target) target.classList.remove("hidden");
  });
});
