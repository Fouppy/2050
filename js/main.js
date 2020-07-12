"use strict";

const data = require("./data.json");
const slideshow = document.querySelector(".slide-wrap");
const navigation = document.querySelector(".slideshow-navigation");

// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty("--vh", `${vh}px`);

// Make sure we don't run this script if the slideshow is not present
if (slideshow !== null && navigation !== null) {
  const slides = document.querySelectorAll(".slide-entry");
  const slidesArray = Array.from(slides);
  const dots = document.querySelectorAll(".dot");
  const dotsArray = Array.from(dots);
  let currentSlide = 0;
  let intervalId;

  // Detect browser language
  const lang = navigator.language || navigator.userLanguage;
  const shortLang = lang.split("-")[0];
  let translation = "en";
  if (shortLang === "fr") translation = "fr";

  // On load, activate the first slide
  slides[0].classList.add("active");
  dots[0].classList.add("active");

  // Set up next slide background image as current slide overlay image
  // and use correct translation
  slidesArray.map(function (slide, index) {
    slide.querySelector(".text").textContent =
      data[index].translations[translation];
  });

  dotsArray.map(function (dot, index) {
    dot.addEventListener("click", function () {
      if (index === currentSlide) return;

      stopAutoPlay();
      moveToSlide(index, false);
      startAutoPlay();
    });
  });

  function moveToSlide(n, shouldFadeOut = true) {
    const slideCount = slides.length;

    // Set up our slide navigation functionality
    if (shouldFadeOut) {
      slides[currentSlide].className = "slide-entry fade-out";
    } else {
      slidesArray.map(function (slide) {
        slide.className = "slide-entry";
      });
    }

    dots[currentSlide].className = "dot";
    currentSlide = (n + slideCount) % slideCount;
    slides[currentSlide].className = "slide-entry active";
    dots[currentSlide].className = "dot active";

    if (shouldFadeOut) {
      setTimeout(function () {
        slides[currentSlide - 1]
          ? (slides[currentSlide - 1].className = "slide-entry")
          : (slides[slideCount - 1].className = "slide-entry");
      }, 2000);
    }
  }

  function nextSlide() {
    moveToSlide(currentSlide + 1);
  }

  function startAutoPlay() {
    intervalId = setInterval(function () {
      nextSlide();
    }, 5000);
  }

  function stopAutoPlay() {
    clearInterval(intervalId);
    intervalId = null;
  }

  // Handle page visibility change events
  function handleVisibilityChange() {
    if (document.visibilityState === "hidden") {
      stopAutoPlay();
    } else {
      startAutoPlay();
    }
  }

  function placeText() {
    let initialHeight = 1024;
    let initialWidth = 1440;
    let logoHeight = 426.29;
    let logoWidth = 426.55;
    const footerHeight = 114;
    const currentHeight = slides[0].getBoundingClientRect().height;
    const currentWidth = slides[0].getBoundingClientRect().width;
    const heightRatio = currentHeight / initialHeight;
    const widthRatio = currentWidth / initialWidth;
    const ratio = Math.max(heightRatio, widthRatio);
    const topPosition = Math.round(
      currentHeight / 2 - (logoHeight * ratio) / 2 - 20
    );

    if (ratio !== 1) {
      logoHeight = logoHeight * ratio;
      logoWidth = logoWidth * ratio;
    }

    const availableHorizontalSpaceCoordinate = Math.round(
      currentWidth / 2 + logoWidth / 2 + 30
    );

    const availableVerticalSpaceCoordinate = Math.round(
      currentHeight / 2 + logoHeight / 2 + 20
    );

    const availableTopVerticalSpaceCoordinate = Math.round(
      currentHeight / 2 - logoHeight / 2
    );

    const mediaQuery = window.matchMedia("(min-width: 721px)");
    const iPadMediaQuery = window.matchMedia(
      "(min-width: 1024px) and (max-height: 1366px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1.5)"
    );

    slidesArray.map(function (slide) {
      const textWrapper = slide.querySelector(".text-wrapper");
      const text = slide.querySelector(".text");

      if (mediaQuery.matches && !iPadMediaQuery.matches) {
        if (Math.random() < 0.5) {
          textWrapper.style.left = "30px";
          textWrapper.style.right = availableHorizontalSpaceCoordinate + "px";
          text.style.right = "0px";
          text.style.textAlign = "right";
        } else {
          textWrapper.style.left = availableHorizontalSpaceCoordinate + "px";
          textWrapper.style.right = "30px";
          text.style.left = "0px";
          text.style.textAlign = "left";
        }

        if (Math.random() < 0.25) {
          text.style.top = "0px";
        } else if (Math.random() >= 0.25 && Math.random() < 0.5) {
          text.style.top = "0px";
        } else if (Math.random() >= 0.5 && Math.random() < 0.75) {
          text.style.bottom = "0px";
        } else {
          text.style.bottom = "0px";
        }

        textWrapper.style.top = topPosition + "px";
        textWrapper.style.height = Math.round(logoHeight) + "px";
      } else {
        textWrapper.style.left = "30px";
        textWrapper.style.right = "30px";
        if (
          currentHeight - footerHeight - availableVerticalSpaceCoordinate <
          textWrapper.getBoundingClientRect().height
        ) {
          textWrapper.style.top =
            availableTopVerticalSpaceCoordinate / 2 -
            textWrapper.getBoundingClientRect().height / 2 +
            "px";
        } else {
          textWrapper.style.top = availableVerticalSpaceCoordinate + "px";
        }
        text.style.textAlign = "center";
      }
    });
  }

  document.addEventListener("visibilitychange", handleVisibilityChange, false);

  window.addEventListener("resize", placeText);

  // Autoplay function
  startAutoPlay();
  placeText();
}
