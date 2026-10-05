(() => {
  const carousels = document.querySelectorAll("[data-carousel]");

  carousels.forEach((carousel) => {
    const slides = [...carousel.querySelectorAll("[data-carousel-slide]")];
    const dots = [...carousel.querySelectorAll("[data-carousel-to]")];
    const currentLabel = carousel.querySelector("[data-carousel-current]");
    const previousButton = carousel.querySelector("[data-carousel-prev]");
    const nextButton = carousel.querySelector("[data-carousel-next]");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let currentIndex = 0;
    let timer;

    if (slides.length < 2) return;

    const showSlide = (nextIndex) => {
      currentIndex = (nextIndex + slides.length) % slides.length;

      slides.forEach((slide, index) => {
        const isCurrent = index === currentIndex;
        slide.classList.toggle("is-active", isCurrent);
        slide.setAttribute("aria-hidden", String(!isCurrent));
      });

      dots.forEach((dot, index) => {
        const isCurrent = index === currentIndex;
        dot.classList.toggle("is-active", isCurrent);
        if (isCurrent) {
          dot.setAttribute("aria-current", "true");
        } else {
          dot.removeAttribute("aria-current");
        }
      });

      if (currentLabel) {
        currentLabel.textContent = String(currentIndex + 1).padStart(2, "0");
      }
    };

    const stopAutoplay = () => {
      window.clearInterval(timer);
      timer = undefined;
    };

    const startAutoplay = () => {
      stopAutoplay();
      if (reduceMotion.matches || document.hidden) return;
      timer = window.setInterval(() => showSlide(currentIndex + 1), 6000);
    };

    previousButton?.addEventListener("click", () => {
      showSlide(currentIndex - 1);
      startAutoplay();
    });

    nextButton?.addEventListener("click", () => {
      showSlide(currentIndex + 1);
      startAutoplay();
    });

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        showSlide(index);
        startAutoplay();
      });
    });

    carousel.addEventListener("mouseenter", stopAutoplay);
    carousel.addEventListener("mouseleave", startAutoplay);
    carousel.addEventListener("focusin", stopAutoplay);
    carousel.addEventListener("focusout", (event) => {
      if (!carousel.contains(event.relatedTarget)) startAutoplay();
    });
    carousel.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") showSlide(currentIndex - 1);
      if (event.key === "ArrowRight") showSlide(currentIndex + 1);
    });
    document.addEventListener("visibilitychange", startAutoplay);
    reduceMotion.addEventListener?.("change", startAutoplay);

    showSlide(0);
    startAutoplay();
  });
})();
