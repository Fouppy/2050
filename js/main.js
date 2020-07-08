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
      if (index === currentSlide) return;

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
        // }, 500);
      }, 2000);
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
    const currentHeight = slides[0].getBoundingClientRect().height;
    const currentWidth = slides[0].getBoundingClientRect().width;
    const heightRatio = currentHeight / initialHeight;
    const widthRatio = currentWidth / initialWidth;
    const ratio = Math.max(heightRatio, widthRatio);
    let topPosition = currentHeight / 2 - (logoHeight * ratio) / 2 - 20;

    if (ratio !== 1) {
      logoHeight = logoHeight * ratio;
      logoWidth = logoWidth * ratio;
    }

    const availableLeftSpaceRightCoordinate =
      currentWidth / 2 + logoWidth / 2 + 30;
    const availableRightSpaceLeftCoordinate =
      currentWidth / 2 + logoWidth / 2 + 30;

    slidesArray.map((slide) => {
      if (window.matchMedia("(min-width: 721px)").matches) {
        if (Math.random() < 0.5) {
          slide.querySelector(".text-wrapper").style.left = "30px";
          slide.querySelector(".text-wrapper").style.right =
            Math.round(availableLeftSpaceRightCoordinate) + "px";
          slide.querySelector(".text-wrapper").style.top =
            Math.round(topPosition) + "px";
          slide.querySelector(".text-wrapper").style.height =
            Math.round(logoHeight) + "px";
          slide.querySelector(".text").style.right = "0px";
          slide.querySelector(".text").style.textAlign = "right";
        } else {
          slide.querySelector(".text-wrapper").style.left =
            Math.round(availableRightSpaceLeftCoordinate) + "px";
          slide.querySelector(".text-wrapper").style.right = "30px";
          slide.querySelector(".text-wrapper").style.top =
            Math.round(topPosition) + "px";
          slide.querySelector(".text-wrapper").style.height =
            Math.round(logoHeight) + "px";
          slide.querySelector(".text").style.left = "0px";
          slide.querySelector(".text").style.textAlign = "left";
        }

        if (Math.random() < 0.25) {
          slide.querySelector(".text").style.top = "0px";
        } else if (Math.random() >= 0.25 && Math.random() < 0.5) {
          slide.querySelector(".text").style.top = "0px";
        } else if (Math.random() >= 0.5 && Math.random() < 0.75) {
          slide.querySelector(".text").style.bottom = "0px";
        } else {
          slide.querySelector(".text").style.bottom = "0px";
        }
      } else {
        slide.querySelector(".text-wrapper").style.left = "30px";
        slide.querySelector(".text-wrapper").style.right = "30px";
      }
    });
  }

  document.addEventListener("visibilitychange", handleVisibilityChange, false);

  window.addEventListener("resize", placeText);

  // Autoplay function
  startAutoPlay();
  placeText();
}
