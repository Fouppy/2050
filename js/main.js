const slideshow = document.querySelector(".slide-wrap");

// Make sure we don't run this script if the slideshow is not present
if (slideshow !== null) {
  const slides = document.querySelectorAll(".slide-entry");
  const slidesArray = Array.from(slides);
  const slideCount = slides.length;
  let currentSlide = 0;
  let intervalId;

  // On load, activate the first slide
  slides[0].classList.add("active");

  // Set up next slide background image as current slide overlay image
  slidesArray.map((slide, index) => {
    slide.querySelector(".slide-overlay").src = slides[index + 1]
      ? slides[index + 1].querySelector(".slide-background").src
      : slides[0].querySelector(".slide-background").src;
  });

  const moveToNextSlide = () => {
    // Set up our slide navigation functionality
    slides[currentSlide].className = "slide-entry";
    currentSlide = (currentSlide + 1 + slideCount) % slideCount;
    slides[currentSlide].className = "slide-entry active";
  };

  // Autoplay function
  intervalId = setInterval(() => {
    moveToNextSlide();
  }, 5000);
}
