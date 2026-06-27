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
