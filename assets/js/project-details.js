document.addEventListener("DOMContentLoaded", () => {
  let projects = [];
  let currentProject = null;

  /*
  |--------------------------------------------------------------------------
  | URL
  |--------------------------------------------------------------------------
  */

  const params = new URLSearchParams(window.location.search);

  const projectSlug = params.get("project");

  /*
  |--------------------------------------------------------------------------
  | CARREGAR JSON
  |--------------------------------------------------------------------------
  */

  async function loadProjects() {
    try {
      const response = await fetch("assets/data/projects.json");

      if (!response.ok) {
        throw new Error("Erro ao carregar projects.json");
      }

      const data = await response.json();

      projects = data.projects || [];

      /*
      | Encontrar projeto
      */

      currentProject = projects.find((project) => project.slug === projectSlug);

      if (!currentProject) {
        showError();

        return;
      }

      /*
      | Renderizar
      */

      renderProject(currentProject);

      /*
      | Projetos recentes
      */

      renderRecentProjects();

      /*
      | Navegação
      */

      renderNavigation();
    } catch (error) {
      console.error(error);

      showError();
    }
  }

  /*
  |--------------------------------------------------------------------------
  | RENDERIZAR PROJETO
  |--------------------------------------------------------------------------
  */

  function renderProject(project) {
    document.title = `${project.title} | HiperObras`;

    /*
    | Hero
    */

    document.getElementById("projectTitle").textContent = project.title;

    document.getElementById("projectCategory").textContent =
      project.categoryName;

    /*
    | Meta
    */

    document.getElementById("projectStatus").textContent = project.status;

    document.getElementById("projectDate").textContent = project.date;

    document.getElementById("projectLocation").textContent = project.location;

    document.getElementById("projectCompany").textContent = project.company;

    /*
    | Overview
    */

    document.getElementById("projectOverview").innerHTML = `
      <p class="summary">
        ${escapeHTML(project.overview.summary)}
      </p>

      <p>
        ${escapeHTML(project.overview.description)}
      </p>
    `;

    /*
    | Desafios
    */

    document.getElementById("projectChallenges").textContent =
      project.challenges;

    /*
    | Metodologia
    */

    document.getElementById("projectMethodology").textContent =
      project.methodology;

    /*
    | Galeria principal
    */

    renderHeroGallery(project.gallery);

    /*
    | Galeria inferior
    */

    renderPhotoGallery(project.gallery);

    /*
    | Especificações
    */

    renderSpecifications(project.specifications);

    /*
    | Serviços
    */

    renderServices(project.services);

    /*
    | Cliente
    */

    renderClient(project.client);

    /*
    | Certificações
    */

    renderCertifications(project.certifications);
  }

  /*
  |--------------------------------------------------------------------------
  | HERO GALLERY
  |--------------------------------------------------------------------------
  */

  function renderHeroGallery(gallery) {
    const container = document.getElementById("projectHeroGallery");

    container.innerHTML = "";

    gallery.forEach((item) => {
      const slide = document.createElement("div");

      slide.className = "swiper-slide";

      slide.innerHTML = `
        <img
          src="${escapeAttribute(item.image)}"
          alt="${escapeAttribute(item.alt)}"
          class="img-fluid"
          loading="lazy"
        />
      `;

      container.appendChild(slide);
    });

    initializeHeroSwiper();
  }

  /*
  |--------------------------------------------------------------------------
  | SWIPER HERO
  |--------------------------------------------------------------------------
  */

  function initializeHeroSwiper() {
    if (typeof Swiper === "undefined") {
      return;
    }

    const element = document.querySelector(".banner-slider");

    if (!element) {
      return;
    }

    new Swiper(element, {
      loop: currentProject.gallery.length > 1,

      speed: 700,

      autoplay: {
        delay: 4500,
      },

      effect: "slide",

      slidesPerView: 1,

      pagination: {
        el: ".swiper-pagination",

        type: "fraction",
      },

      navigation: {
        nextEl: ".swiper-button-next",

        prevEl: ".swiper-button-prev",
      },
    });
  }

  /*
  |--------------------------------------------------------------------------
  | GALERIA INFERIOR
  |--------------------------------------------------------------------------
  */

  function renderPhotoGallery(gallery) {
    const container = document.getElementById("projectGallery");

    container.innerHTML = "";

    gallery.forEach((item) => {
      const column = document.createElement("div");

      column.className = "col-4";

      column.innerHTML = `
        <a
          href="${escapeAttribute(item.image)}"
          class="glightbox"
          data-gallery="detail-gallery"
        >

          <img
            src="${escapeAttribute(item.image)}"
            alt="${escapeAttribute(item.alt)}"
            class="img-fluid"
            loading="lazy"
          />

        </a>
      `;

      container.appendChild(column);
    });
  }

  /*
  |--------------------------------------------------------------------------
  | ESPECIFICAÇÕES
  |--------------------------------------------------------------------------
  */

  function renderSpecifications(specifications) {
    const container = document.getElementById("projectSpecifications");

    container.innerHTML = "";

    for (let i = 0; i < specifications.length; i += 2) {
      const row = document.createElement("div");

      row.className = "spec-row";

      const first = specifications[i];

      const second = specifications[i + 1];

      row.innerHTML = `
        <div class="spec-item">

          <span class="spec-number">
            ${escapeHTML(first.number)}
          </span>

          <span class="spec-label">
            ${escapeHTML(first.label)}
          </span>

        </div>

        ${
          second
            ? `
              <div class="spec-item">

                <span class="spec-number">
                  ${escapeHTML(second.number)}
                </span>

                <span class="spec-label">
                  ${escapeHTML(second.label)}
                </span>

              </div>
            `
            : ""
        }
      `;

      container.appendChild(row);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | SERVIÇOS
  |--------------------------------------------------------------------------
  */

  function renderServices(services) {
    const container = document.getElementById("projectServices");

    container.innerHTML = "";

    services.forEach((service) => {
      const tag = document.createElement("span");

      tag.className = "cap-tag";

      tag.innerHTML = `
        <i class="bi ${escapeAttribute(service.icon)}"></i>
        ${escapeHTML(service.name)}
      `;

      container.appendChild(tag);
    });
  }

  /*
  |--------------------------------------------------------------------------
  | CLIENTE
  |--------------------------------------------------------------------------
  */

  function renderClient(client) {
    document.getElementById("clientCompany").textContent = client.company;

    document.getElementById("clientSector").textContent = client.sector;

    document.getElementById("clientRegion").textContent = client.region;
  }

  /*
  |--------------------------------------------------------------------------
  | CERTIFICAÇÕES
  |--------------------------------------------------------------------------
  */

  function renderCertifications(certifications) {
    const container = document.getElementById("projectCertifications");

    container.innerHTML = "";

    certifications.forEach((certification) => {
      const li = document.createElement("li");

      li.innerHTML = `
          <i class="bi bi-check-circle-fill"></i>
          ${escapeHTML(certification)}
        `;

      container.appendChild(li);
    });
  }

  /*
  |--------------------------------------------------------------------------
  | 6 PROJETOS RECENTES
  |--------------------------------------------------------------------------
  */
  function renderRecentProjects() {
    const container = document.getElementById("recentProjects");

    if (!container) {
      return;
    }

    /*
  |--------------------------------------------------------------------------
  | LIMPAR
  |--------------------------------------------------------------------------
  */

    container.innerHTML = "";

    /*
  |--------------------------------------------------------------------------
  | PEGAR OS 6 PROJETOS MAIS RECENTES
  |--------------------------------------------------------------------------
  */

    const recentProjects = projects
      .filter((project) => project.id !== currentProject.id)
      .slice(0, 6);

    /*
  |--------------------------------------------------------------------------
  | TRACK
  |--------------------------------------------------------------------------
  */

    const track = document.createElement("div");

    track.className = "project-track active";

    track.dataset.category = "recent";

    /*
  |--------------------------------------------------------------------------
  | SWIPER
  |--------------------------------------------------------------------------
  */

    const swiper = document.createElement("div");

    swiper.className = "swiper project-swiper";

    /*
  |--------------------------------------------------------------------------
  | WRAPPER
  |--------------------------------------------------------------------------
  */

    const wrapper = document.createElement("div");

    wrapper.className = "swiper-wrapper";

    /*
  |--------------------------------------------------------------------------
  | PROJETOS
  |--------------------------------------------------------------------------
  */

    recentProjects.forEach((project) => {
      const slide = document.createElement("div");

      slide.className = "swiper-slide";

      /*
    | EXATAMENTE A MESMA ESTRUTURA
    | DO CARD DA PÁGINA INICIAL
    */

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
              href="project-details.html?project=${encodeURIComponent(
                project.slug,
              )}"
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

    /*
  |--------------------------------------------------------------------------
  | COLOCAR WRAPPER DENTRO DO SWIPER
  |--------------------------------------------------------------------------
  */

    swiper.appendChild(wrapper);

    /*
  |--------------------------------------------------------------------------
  | BOTÃO ANTERIOR
  |--------------------------------------------------------------------------
  */

    const prev = document.createElement("button");

    prev.className = "project-prev";

    prev.setAttribute("aria-label", "Projeto anterior");

    prev.innerHTML = `
    <i class="bi bi-chevron-left"></i>
  `;

    /*
  |--------------------------------------------------------------------------
  | BOTÃO PRÓXIMO
  |--------------------------------------------------------------------------
  */

    const next = document.createElement("button");

    next.className = "project-next";

    next.setAttribute("aria-label", "Próximo projeto");

    next.innerHTML = `
    <i class="bi bi-chevron-right"></i>
  `;

    /*
  |--------------------------------------------------------------------------
  | MONTAR TRACK
  |--------------------------------------------------------------------------
  */

    track.appendChild(swiper);

    track.appendChild(prev);

    track.appendChild(next);

    /*
  |--------------------------------------------------------------------------
  | ADICIONAR AO HTML
  |--------------------------------------------------------------------------
  */

    container.appendChild(track);

    /*
  |--------------------------------------------------------------------------
  | INICIALIZAR SWIPER
  |--------------------------------------------------------------------------
  */

    if (typeof Swiper !== "undefined" && recentProjects.length > 0) {
      new Swiper(swiper, {
        loop: recentProjects.length > 1,

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
    }
  }
  /*
  |--------------------------------------------------------------------------
  | SWIPER DOS RECENTES
  |--------------------------------------------------------------------------
  */

  function initializeRecentSwiper() {
    if (typeof Swiper === "undefined") {
      return;
    }

    const element = document.querySelector(".recent-projects-slider");

    if (!element) {
      return;
    }

    new Swiper(element, {
      loop: projects.length > 2,

      speed: 700,

      spaceBetween: 24,

      slidesPerView: 1,

      navigation: {
        nextEl: ".recent-projects-slider .swiper-button-next",

        prevEl: ".recent-projects-slider .swiper-button-prev",
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
  }

  /*
  |--------------------------------------------------------------------------
  | ANTERIOR / PRÓXIMO
  |--------------------------------------------------------------------------
  */

  function renderNavigation() {
    const index = projects.findIndex(
      (project) => project.id === currentProject.id,
    );

    const previousIndex = index > 0 ? index - 1 : projects.length - 1;

    const nextIndex = index < projects.length - 1 ? index + 1 : 0;

    const previous = projects[previousIndex];

    const next = projects[nextIndex];

    const previousLink = document.getElementById("previousProject");

    const nextLink = document.getElementById("nextProject");

    previousLink.href = `project-details.html?project=${encodeURIComponent(previous.slug)}`;

    nextLink.href = `project-details.html?project=${encodeURIComponent(next.slug)}`;

    document.getElementById("previousProjectTitle").textContent =
      previous.title;

    document.getElementById("nextProjectTitle").textContent = next.title;
  }

  /*
  |--------------------------------------------------------------------------
  | ERRO
  |--------------------------------------------------------------------------
  */

  function showError() {
    document.title = "Projeto não encontrado | HiperObras";

    const title = document.getElementById("projectTitle");

    if (title) {
      title.textContent = "Projeto não encontrado";
    }
  }

  /*
  |--------------------------------------------------------------------------
  | SEGURANÇA
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
