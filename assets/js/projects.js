document.addEventListener("DOMContentLoaded", () => {
  const filters = document.getElementById("projectFilters");

  const container = document.getElementById("projectsContainer");

  let projects = [];
  let swipers = [];

  /*
  |--------------------------------------------------------------------------
  | CARREGAR JSON
  |--------------------------------------------------------------------------
  */

  async function loadProjects() {
    try {
      const response = await fetch("assets/data/projects.json");

      if (!response.ok) {
        throw new Error("Não foi possível carregar projects.json");
      }

      const data = await response.json();

      projects = data.projects || [];

      renderProjects("all");

      initializeFilters();
    } catch (error) {
      console.error("Erro ao carregar projetos:", error);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | RENDERIZAR PROJETOS
  |--------------------------------------------------------------------------
  */

  function renderProjects(category) {
    /*
    | Destruir Swipers anteriores
    */

    swipers.forEach((swiper) => {
      if (swiper && !swiper.destroyed) {
        swiper.destroy(true, true);
      }
    });

    swipers = [];

    container.innerHTML = "";

    /*
    | Filtrar
    */

    const filteredProjects =
      category === "all"
        ? projects
        : projects.filter((project) => project.category === category);

    /*
    | Criar TRACK
    */

    const track = document.createElement("div");

    track.className = "project-track active";

    track.dataset.category = category;

    /*
    | Swiper
    */

    const swiper = document.createElement("div");

    swiper.className = "swiper project-swiper";

    const wrapper = document.createElement("div");

    wrapper.className = "swiper-wrapper";

    /*
    | PROJETOS
    */

    filteredProjects.forEach((project) => {
      const slide = document.createElement("div");

      slide.className = "swiper-slide";

      slide.innerHTML = `
        <div class="project-card">

          <img
            src="${escapeAttribute(project.mainImage)}"
            alt="${escapeAttribute(project.alt)}"
            class="img-fluid"
            loading="lazy"
          />

          <div class="card-overlay">

            <div class="card-content">

              <span class="tag">
                ${escapeHTML(project.categoryName)}
              </span>

              <h3>
                ${escapeHTML(project.title)}
              </h3>

              <p>
                ${escapeHTML(project.shortDescription)}
              </p>

            </div>


            <div class="card-actions">

              <a
                href="project-details.html?project=${encodeURIComponent(project.slug)}"
                class="card-action"
                title="Ver Detalhes"
                aria-label="Ver detalhes de ${escapeAttribute(project.title)}"
              >
                <i class="bi bi-arrow-right"></i>
              </a>

            </div>

          </div>

        </div>
      `;

      wrapper.appendChild(slide);
    });

    swiper.appendChild(wrapper);

    /*
    | BOTÕES
    */

    const prev = document.createElement("button");

    prev.className = "project-prev";

    prev.setAttribute("aria-label", "Projeto anterior");

    prev.innerHTML = `<i class="bi bi-chevron-left"></i>`;

    const next = document.createElement("button");

    next.className = "project-next";

    next.setAttribute("aria-label", "Próximo projeto");

    next.innerHTML = `<i class="bi bi-chevron-right"></i>`;

    /*
    | MONTAR TRACK
    */

    track.appendChild(swiper);

    track.appendChild(prev);

    track.appendChild(next);

    container.appendChild(track);

    /*
    |--------------------------------------------------------------------------
    | SWIPER
    |--------------------------------------------------------------------------
    */

    if (typeof Swiper !== "undefined" && filteredProjects.length > 0) {
      const swiperInstance = new Swiper(swiper, {
        loop: filteredProjects.length > 1,

        speed: 700,

        slidesPerView: 1,

        spaceBetween: 24,

        navigation: {
          nextEl: next,
          prevEl: prev,
        },

        breakpoints: {
          576: {
            slidesPerView: 2,
          },

          992: {
            slidesPerView: 3,
          },
        },
      });

      swipers.push(swiperInstance);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | FILTROS
  |--------------------------------------------------------------------------
  */

  function initializeFilters() {
    const filterItems = filters.querySelectorAll("li");

    filterItems.forEach((filter) => {
      filter.addEventListener("click", () => {
        filterItems.forEach((item) => {
          item.classList.remove("filter-active");
        });

        filter.classList.add("filter-active");

        const category = filter.dataset.filter;

        renderProjects(category);
      });
    });
  }

  /*
  |--------------------------------------------------------------------------
  | ESCAPAR HTML
  |--------------------------------------------------------------------------
  */

  function escapeHTML(value) {
    if (value === null || value === undefined) {
      return "";
    }

    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeAttribute(value) {
    return escapeHTML(value);
  }

  /*
  |--------------------------------------------------------------------------
  | INICIAR
  |--------------------------------------------------------------------------
  */

  loadProjects();
});
