document.addEventListener("DOMContentLoaded", () => {
  const filters = document.querySelectorAll("#projectFilters li");
  const tracks = document.querySelectorAll(".project-track");

  const swipers = new Map();

  /*
  | Inicializar um Swiper por categoria
  */

  tracks.forEach((track) => {
    const category = track.dataset.category;
    const swiperEl = track.querySelector(".project-swiper");

    const swiper = new Swiper(swiperEl, {
      slidesPerView: 1,
      spaceBetween: 24,

      navigation: {
        nextEl: track.querySelector(".project-next"),
        prevEl: track.querySelector(".project-prev"),
      },

      breakpoints: {
        576: { slidesPerView: 2 },
        992: { slidesPerView: 3 },
      },
    });

    swipers.set(category, swiper);
  });

  /*
  | Trocar de categoria
  */

  function setActiveTrack(category) {
    tracks.forEach((track) => {
      const isActive = track.dataset.category === category;

      track.classList.toggle("active", isActive);
    });

    // Swiper calcula mal as dimensões enquanto o track está escondido (display: none),
    // por isso é preciso forçar um update assim que ele fica visível.
    swipers.get(category).update();
  }

  /*
  | Filtros
  */

  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      filters.forEach((f) => f.classList.remove("filter-active"));
      filter.classList.add("filter-active");

      setActiveTrack(filter.dataset.filter);
    });
  });
});

new Swiper(".team-slider", {
  loop: true,
  speed: 600,

  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
  },

  slidesPerView: 2,
  spaceBetween: 16,

  pagination: {
    el: ".team-slider .swiper-pagination",
    type: "fraction",
  },

  pagination: {
    el: ".swiper-pagination",
    type: "bullets",
    clickable: true,
  },

  breakpoints: {
    768: {
      slidesPerView: 2,
    },

    992: {
      slidesPerView: 3,
    },

    1200: {
      slidesPerView: 4,
    },
  },
});
