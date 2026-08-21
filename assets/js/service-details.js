document.addEventListener("DOMContentLoaded", () => {
  /*
  |--------------------------------------------------------------------------
  | ELEMENTOS
  |--------------------------------------------------------------------------
  */

  const overviewIcon = document.getElementById("serviceOverviewIcon");

  const overviewTitle = document.getElementById("serviceOverviewTitle");

  const overviewDescription = document.getElementById(
    "serviceOverviewDescription",
  );

  const quoteLink = document.getElementById("serviceQuoteLink");

  const benefitsContainer = document.getElementById("serviceBenefits");

  const galleryContainer = document.getElementById("serviceGallery");

  const detailsTitle = document.getElementById("serviceDetailsTitle");

  const detailsParagraphs = document.getElementById("serviceDetailsParagraphs");

  const featuresContainer = document.getElementById("serviceFeatures");

  const processContainer = document.getElementById("serviceProcess");

  /*
  |--------------------------------------------------------------------------
  | PEGAR SERVIÇO DA URL
  |--------------------------------------------------------------------------
  */

  const params = new URLSearchParams(window.location.search);

  const serviceSlug = params.get("service");

  /*
  |--------------------------------------------------------------------------
  | VERIFICAR SLUG
  |--------------------------------------------------------------------------
  */

  if (!serviceSlug) {
    showError("Nenhum serviço foi selecionado.");

    return;
  }

  /*
  |--------------------------------------------------------------------------
  | CARREGAR JSON
  |--------------------------------------------------------------------------
  */

  async function loadService() {
    try {
      const response = await fetch("assets/data/services.json");

      if (!response.ok) {
        throw new Error(`Erro ao carregar services.json: ${response.status}`);
      }

      const data = await response.json();

      const services = data.services || [];

      /*
      | PROCURAR SERVIÇO
      */

      const service = services.find((item) => item.slug === serviceSlug);

      if (!service) {
        showError("O serviço solicitado não foi encontrado.");

        return;
      }

      /*
      | PREENCHER PÁGINA
      */

      renderService(service);
    } catch (error) {
      console.error("Erro ao carregar serviço:", error);

      showError("Não foi possível carregar as informações deste serviço.");
    }
  }

  /*
  |--------------------------------------------------------------------------
  | RENDERIZAR SERVIÇO
  |--------------------------------------------------------------------------
  */

  function renderService(service) {
    /*
    | TÍTULO DA PÁGINA
    */

    document.title = `${service.name} | HiperObras`;

    /*
    | ÍCONE
    */

    if (service.icon) {
      overviewIcon.className = `bi ${service.icon}`;
    }

    /*
    | VISÃO GERAL
    */

    overviewTitle.textContent = service.overview.title;

    overviewDescription.textContent = service.overview.description;

    /*
    | BOTÃO ORÇAMENTO
    */

    quoteLink.textContent =
      service.overview.ctaText || "Solicitar Orçamento Gratuito";

    /*
    | BENEFÍCIOS
    */

    renderBenefits(service.benefits);

    /*
    | GALERIA
    */

    renderGallery(service.gallery);

    /*
    | DETALHES
    */

    renderDetails(service.details);

    /*
    | FEATURES
    */

    renderFeatures(service.features);

    /*
    | PROCESSO
    */

    renderProcess(service.process);
  }

  /*
  |--------------------------------------------------------------------------
  | BENEFÍCIOS
  |--------------------------------------------------------------------------
  */

  function renderBenefits(benefits) {
    benefitsContainer.innerHTML = "";

    if (!Array.isArray(benefits)) {
      return;
    }

    benefits.forEach((benefit) => {
      const li = document.createElement("li");

      li.innerHTML = `
        <i class="bi bi-check-circle-fill"></i>
        ${escapeHTML(benefit)}
      `;

      benefitsContainer.appendChild(li);
    });
  }

  /*
  |--------------------------------------------------------------------------
  | GALERIA
  |--------------------------------------------------------------------------
  */

  function renderGallery(gallery) {
    galleryContainer.innerHTML = "";

    if (!Array.isArray(gallery)) {
      return;
    }

    gallery.forEach((item) => {
      const slide = document.createElement("div");

      slide.className = "swiper-slide";

      slide.innerHTML = `
        <img
          src="${escapeAttribute(item.image)}"
          alt="${escapeAttribute(item.alt || "")}"
          class="img-fluid"
          loading="lazy"
        />
      `;

      galleryContainer.appendChild(slide);
    });

    /*
    | Inicializar/Reinicializar Swiper
    */

    initializeSwiper();
  }

  /*
  |--------------------------------------------------------------------------
  | DETALHES
  |--------------------------------------------------------------------------
  */

  function renderDetails(details) {
    if (!details) {
      return;
    }

    detailsTitle.textContent = details.title || "";

    detailsParagraphs.innerHTML = "";

    if (!Array.isArray(details.paragraphs)) {
      return;
    }

    details.paragraphs.forEach((paragraph) => {
      const p = document.createElement("p");

      p.textContent = paragraph;

      detailsParagraphs.appendChild(p);
    });
  }

  /*
  |--------------------------------------------------------------------------
  | FEATURES
  |--------------------------------------------------------------------------
  */

  function renderFeatures(features) {
    featuresContainer.innerHTML = "";

    if (!Array.isArray(features)) {
      return;
    }

    features.forEach((feature) => {
      const column = document.createElement("div");

      column.className = "col-md-6";

      column.innerHTML = `
        <div class="feature-card">

          <div class="icon-wrapper">
            <i class="bi ${escapeAttribute(feature.icon)}"></i>
          </div>

          <h4>
            ${escapeHTML(feature.title)}
          </h4>

          <p>
            ${escapeHTML(feature.description)}
          </p>

        </div>
      `;

      featuresContainer.appendChild(column);
    });
  }

  /*
  |--------------------------------------------------------------------------
  | PROCESSO
  |--------------------------------------------------------------------------
  */

  function renderProcess(process) {
    processContainer.innerHTML = "";

    if (!Array.isArray(process)) {
      return;
    }

    process.forEach((step) => {
      const stepElement = document.createElement("div");

      stepElement.className = "step";

      stepElement.innerHTML = `
        <span class="step-number">
          ${escapeHTML(step.number)}
        </span>

        <div class="step-content">

          <h4>
            ${escapeHTML(step.title)}
          </h4>

          <p>
            ${escapeHTML(step.description)}
          </p>

        </div>
      `;

      processContainer.appendChild(stepElement);
    });
  }

  /*
  |--------------------------------------------------------------------------
  | SWIPER
  |--------------------------------------------------------------------------
  */

  function initializeSwiper() {
    /*
    | Se o template já possuir o sistema
    | de inicialização automática do Swiper,
    | ele pode assumir o controle.
    */

    if (typeof Swiper === "undefined") {
      console.warn("Swiper não está carregado.");

      return;
    }

    const slider = document.querySelector(".service-details-slider");

    if (!slider) {
      return;
    }

    /*
    | Evitar inicialização duplicada
    */

    if (slider.swiper) {
      slider.swiper.update();

      return;
    }

    new Swiper(slider, {
      loop: true,

      speed: 800,

      autoplay: {
        delay: 5000,
      },

      slidesPerView: 1,

      effect: "fade",

      navigation: {
        nextEl: ".swiper-button-next",

        prevEl: ".swiper-button-prev",
      },

      pagination: {
        el: ".swiper-pagination",

        type: "bullets",

        clickable: true,
      },
    });
  }

  /*
  |--------------------------------------------------------------------------
  | ERRO
  |--------------------------------------------------------------------------
  */

  function showError(message) {
    overviewTitle.textContent = "Serviço não encontrado";

    overviewDescription.textContent = message;
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

  loadService();
});
