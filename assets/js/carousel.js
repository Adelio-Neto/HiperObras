document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector("#hero");

  if (!hero) {
    return;
  }

  const slides = hero.querySelectorAll(".hero-slide");

  const prevButton = document.querySelector("#heroPrev");
  const nextButton = document.querySelector("#heroNext");
  const dotsContainer = document.querySelector("#heroDots");

  if (!slides.length) {
    return;
  }

  let currentSlide = 0;

  let autoplay;

  /*
  | Criar indicadores
  */

  slides.forEach((slide, index) => {
    const dot = document.createElement("button");

    dot.classList.add("hero-dot");

    dot.setAttribute("aria-label", `Ir para o slide ${index + 1}`);

    dot.addEventListener("click", () => {
      showSlide(index);

      restartAutoplay();
    });

    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll(".hero-dot");

  /*
  | Mostrar slide
  */

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });

    currentSlide = index;
  }

  /*
  | Próximo slide
  */

  function nextSlide() {
    let next = currentSlide + 1;

    if (next >= slides.length) {
      next = 0;
    }

    showSlide(next);
  }

  /*
  | Slide anterior
  */

  function previousSlide() {
    let previous = currentSlide - 1;

    if (previous < 0) {
      previous = slides.length - 1;
    }

    showSlide(previous);
  }

  /*
  | Botão próximo
  */

  nextButton.addEventListener("click", () => {
    nextSlide();

    restartAutoplay();
  });

  /*
  | Botão anterior
  */

  prevButton.addEventListener("click", () => {
    previousSlide();

    restartAutoplay();
  });

  /*
  | Autoplay
  */

  function startAutoplay() {
    autoplay = setInterval(() => {
      nextSlide();
    }, 6000);
  }

  /*
  | Reiniciar autoplay
  */

  function restartAutoplay() {
    clearInterval(autoplay);

    startAutoplay();
  }

  /*
  | Inicializar
  */

  showSlide(0);

  startAutoplay();
});
