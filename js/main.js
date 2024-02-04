const atroposFunc = function (i) {
  const myAtropos = Atropos({
    el: `.my-atropos-${i}`,
    activeOffset: 40,
    shadow: true,
    highlight: true,
    rotateXMax: 25,
    rotateYMax: 25,
    onEnter() {
      myAtropos.el.style.transition = "transform 0.3s ease";
      myAtropos.el.style.transform = "scale(1)";
    },
    onLeave() {
      myAtropos.el.style.transition = "transform 0.3s ease";
      myAtropos.el.style.transform = "scale(1)";
    },
  });
};

function toggleClasses() {
  const burger = document.querySelector(".header_menu");
  const blur = document.querySelector(".overlay");
  burger.classList.toggle("open");
  let hasClass = burger.classList.contains("open");
  if (hasClass) {
    blur.classList.add("show");
  } else {
    blur.classList.remove("show");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const offset = 100;
  const scrollUp = document.querySelector(".scrollup");
  const scrollupSvgPath = document.querySelector(".scrollup_path");
  const pathLength = scrollupSvgPath.getTotalLength();

  scrollupSvgPath.style.strokeDasharray = pathLength;
  scrollupSvgPath.style.strokeDashoffset = pathLength;

  const getTop = () => document.documentElement.scrollTop || window.pageYOffset;

  const updateDashoffset = () => {
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const dashoffset = pathLength - (getTop() * pathLength) / height;
    scrollupSvgPath.style.strokeDashoffset = dashoffset;
  };

  window.addEventListener("scroll", () => {
    updateDashoffset();
    if (getTop() > offset) {
      scrollUp.classList.add("scrollup--active");
    } else {
      scrollUp.classList.remove("scrollup--active");
    }
  });

  scrollUp.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
});
