const data = require("./data.json");
const slideshow = document.querySelector(".slide-wrap");
const navigation = document.querySelector(".slideshow-navigation");

// Make sure we don't run this script if the slideshow is not present
if (slideshow !== null && navigation !== null) {
  const slides = document.querySelectorAll(".slide-entry");
  const slidesArray = Array.from(slides);
  const slideCount = slides.length;
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
  slidesArray.map((slide, index) => {
    slide.querySelector(".slide-overlay").src = slides[index + 1]
      ? slides[index + 1].querySelector(".slide-background").src
      : slides[0].querySelector(".slide-background").src;

    slide.querySelector(".text").textContent =
      data[index].translations[translation];
  });

  dotsArray.map((dot, index) => {
    dot.addEventListener("click", () => {
      stopAutoPlay();
      moveToSlide(index, false);
      startAutoPlay();
    });
  });

  const moveToSlide = (n, shouldFadeOut = true) => {
    // Set up our slide navigation functionality
    if (shouldFadeOut) {
      slides[currentSlide].className = "slide-entry fade-out";
    } else {
      slidesArray.map((slide) => {
        slide.className = "slide-entry";
      });
    }

    dots[currentSlide].className = "dot";
    currentSlide = (n + slideCount) % slideCount;
    slides[currentSlide].className = "slide-entry active";
    dots[currentSlide].className = "dot active";

    if (shouldFadeOut) {
      setTimeout(() => {
        slides[currentSlide - 1]
          ? (slides[currentSlide - 1].className = "slide-entry")
          : (slides[slideCount - 1].className = "slide-entry");
      }, 500);
    }
  };

  const nextSlide = () => {
    moveToSlide(currentSlide + 1);
  };

  const startAutoPlay = () => {
    intervalId = setInterval(() => {
      nextSlide();
    }, 5000);
  };

  const stopAutoPlay = () => {
    clearInterval(intervalId);
    intervalId = null;
  };

  // Autoplay function
  startAutoPlay();
}
