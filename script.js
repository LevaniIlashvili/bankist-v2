"use strict";

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");

const nav = document.querySelector(".nav");

const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");

//////////////////////////////////
// Modal Window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach(btn => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

// learn more btn, scroll to section1
btnScrollTo.addEventListener("click", e => {
  section1.scrollIntoView({ behavior: "smooth" });
});

/////////////////////////////
// Page Navigation

document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

////////////////////////////
// Tabbed Component
tabsContainer.addEventListener("click", e => {
  const clicked = e.target.closest(".operations__tab");

  if (!clicked) return;

  // Active tab
  tabs.forEach(tab => tab.classList.remove("operations__tab--active"));
  clicked.classList.add("operations__tab--active");

  // Active content area
  tabsContent.forEach(content =>
    content.classList.remove("operations__content--active")
  );
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

////////////////////////
// Menu fade animation
function handleHover(e, opacity) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const sibilings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    sibilings.forEach(el => {
      if (el !== link) el.style.opacity = opacity;
      logo.style.opacity = opacity;
    });
  }
}

nav.addEventListener("mouseover", e => {
  handleHover(e, 0.5);
});

nav.addEventListener("mouseout", e => {
  handleHover(e, 1);
});

////////////////////////
// sticky navigation: intersection observer API
const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect().height;

function stickyNav(entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
}

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

//////////////////////////////
// Reveal sections
const allSections = document.querySelectorAll(".section");

function revealSection(entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

//////////////////////////
// Lazy loading images
const imgTargets = document.querySelectorAll("img[data-src");

function loadImg(entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener("load", () => {
    entry.target.classList.remove("lazy-img");
  });

  observer.unobserve(entry.target);
}

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});

imgTargets.forEach(img => imgObserver.observe(img));

//////////////////////////////////
// slider
function slider() {
  const slides = document.querySelectorAll(".slide");
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  const dotContainer = document.querySelector(".dots");

  function createDots() {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  }

  function activateDot(slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach(dot => dot.classList.remove("dots__dot--active"));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  }

  function goToSlide(slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  }

  function init() {
    goToSlide(0);
    createDots();
    activateDot(0);
  }
  init();

  let curSlide = 0;
  const maxSlide = slides.length;

  function nextSlide() {
    if (curSlide === maxSlide - 1) curSlide = 0;
    else curSlide++;

    goToSlide(curSlide);
    activateDot(curSlide);
  }

  function prevSlide() {
    if (curSlide === 0) curSlide = maxSlide - 1;
    else curSlide--;

    goToSlide(curSlide);
    activateDot(curSlide);
  }

  btnRight.addEventListener("click", nextSlide);

  btnLeft.addEventListener("click", prevSlide);

  document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") prevSlide();
    else if (e.key === "ArrowRight") nextSlide();
  });

  dotContainer.addEventListener("click", e => {
    if (e.target.classList.contains("dots__dot")) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
}
slider();
