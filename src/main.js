import "./style.css";
import "flyonui/flyonui.js";

if (document.querySelector(".splide")) {
  var splide = new Splide(".splide", {
    type: "loop",
    perPage: 3,
    focus: "center",
    direction: "rtl",
    gap: "1.5rem",
    pagination: false,
    arrows: false,
  });

  splide.mount();
}

// تأثير الهيدر عند التمرير: خلفية بلور + حد سفلي
const siteHeader = document.getElementById("site-header");
if (siteHeader) {
  const onScroll = () => {
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 10);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

// قائمة الموبايل: فتح/إغلاق الـ drawer المنزلق
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
  // إغلاق القائمة عند الضغط على أي رابط بداخلها
  drawer.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeDrawer);
  });
  // إغلاق بزر Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });
}

// الخريطة التفاعلية لمناطق المملكة: تحديث البطاقة عند الضغط على منطقة
const saMap = document.getElementById("sa-map");
const regionNameEl = document.getElementById("region-name");
const regionListEl = document.getElementById("region-list");
if (saMap && regionNameEl && regionListEl) {
  const regionLogo = "/src/assets/images/image 3.svg";
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
          (name) => `
        <li class="flex items-center justify-between gap-3 px-3 py-4">
          <div class="min-w-0">
            <p class="truncate text-sm font-semibold text-brand-navy">${name}</p>
            <a href="associations-details.html" class="text-xs text-gray-400 transition hover:text-brand-green">اقرأ المزيد <i class="fa-solid fa-angle-left"></i></a>
          </div>
          <span class="flex h-12 w-16 shrink-0 items-center justify-center rounded-xl bg-base-200/60 p-1">
            <img src="${regionLogo}" alt="" class="max-h-9 w-auto" />
          </span>
        </li>`
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
