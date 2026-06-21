import "./style.css";
import "flyonui/flyonui.js";

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
