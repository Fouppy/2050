const data = require("./data.json");
const slideshow = document.querySelector(".slide-wrap");
const navigation = document.querySelector(".slideshow-navigation");

// Make sure we don't run this script if the slideshow is not present
if (slideshow !== null && navigation !== null) {
  // const logo = document.querySelector(".logo");
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

    if (window.matchMedia("(min-width: 568px)").matches) {
      if (Math.random() < 0.5) {
        slide.querySelector(".text-wrapper").style.left = "30px";
        slide.querySelector(".text-wrapper").style.right = "949px";
        slide.querySelector(".text").style.right = "0px";
      } else {
        slide.querySelector(".text-wrapper").style.left = "949px";
        slide.querySelector(".text-wrapper").style.right = "30px";
        slide.querySelector(".text").style.left = "0px";
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
    }

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

  // navigation.addEventListener("mouseenter", stopAutoPlay);
  // navigation.addEventListener("mouseleave", startAutoPlay);

  // const getRatio = () => {
  //   const initialHeight = 1024;
  //   const initialWidth = 1440;
  //   const currentHeight = slides[0].getBoundingClientRect().height;
  //   const currentWidth = slides[0].getBoundingClientRect().width;

  //   const heightRatio = currentHeight / initialHeight;
  //   const widthRatio = currentWidth / initialWidth;

  //   const ratio = Math.max(heightRatio, widthRatio);

  //   logo.style.transform = `translate(-50%, -50%) scale(${ratio})`;
  // };

  // Autoplay function
  startAutoPlay();

  // getRatio();

  // window.onresize = () => getRatio();
}
