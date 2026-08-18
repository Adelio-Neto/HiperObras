document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector("#hero");

  if (!hero) {
    return;
  }

  const slides = hero.querySelectorAll(".hero-slide");
  const prevButton = hero.querySelector("#heroPrev");
  const nextButton = hero.querySelector("#heroNext");
  const dotsContainer = hero.querySelector("#heroDots");
  const loader = hero.querySelector("#heroLoader");

  if (!slides.length) {
    return;
  }

  let currentSlide = 0;
  let autoplay = null;

  const slideDuration = 6000;

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
  | Loader
  */

  function startLoader() {
    if (!loader) {
      return;
    }

    loader.classList.remove("loading");

    /*
    | Força o navegador a reiniciar a animação
    */

    void loader.offsetWidth;

    loader.classList.add("loading");
  }

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

    startLoader();
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
  | Próximo
  */

  nextButton?.addEventListener("click", () => {
    nextSlide();

    restartAutoplay();
  });

  /*
  | Anterior
  */

  prevButton?.addEventListener("click", () => {
    previousSlide();

    restartAutoplay();
  });

  /*
  | Autoplay
  */

  function startAutoplay() {
    clearInterval(autoplay);

    autoplay = setInterval(() => {
      nextSlide();
    }, slideDuration);
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
