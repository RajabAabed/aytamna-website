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
