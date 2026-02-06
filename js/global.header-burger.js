const burger = document.querySelector(".header__burger");
const nav = document.querySelector(".header__nav-menu");
const header = document.querySelector(".header__nav");
const menuLinks = document.querySelectorAll(".header__nav-link");

let isClosing = false;

function openMenu() {
  nav.classList.add("is-open");
  burger.classList.add("is-active");
  header.classList.add("menu-open");
  document.body.classList.add("no-scroll");
}

function closeMenuSmooth() {
  if (!nav.classList.contains("is-open") || isClosing) return;

  isClosing = true;

  nav.classList.remove("is-open");
  burger.classList.remove("is-active");
  document.body.classList.remove("no-scroll");

  const onEnd = (e) => {
    if (e.propertyName !== "height") return;
    header.classList.remove("menu-open");
    nav.removeEventListener("transitionend", onEnd);
    isClosing = false;
  };
  nav.addEventListener("transitionend", onEnd);
}

function toggleMenu() {
  if (nav.classList.contains("is-open")) {
    closeMenuSmooth();
  } else {
    openMenu();
  }
}

burger.addEventListener("click", toggleMenu);
menuLinks.forEach((link) => {
  link.addEventListener("click", closeMenuSmooth);
});
