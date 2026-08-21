document.addEventListener("DOMContentLoaded", () => {
  const servicesMenu = document.getElementById("servicesMenu");
  const servicesSelect = document.getElementById("servicesSelect");

  const serviceCategory = document.getElementById("serviceCategory");
  const serviceTitle = document.getElementById("serviceTitle");
  const serviceDescription = document.getElementById("serviceDescription");
  const serviceImage = document.getElementById("serviceImage");
  const serviceLink = document.getElementById("serviceLink");

  let services = [];
  let currentService = 0;

  /*
  |--------------------------------------------------------------------------
  | CARREGAR JSON
  |--------------------------------------------------------------------------
  */

  async function loadServices() {
    try {
      const response = await fetch("assets/data/services.json");

      if (!response.ok) {
        throw new Error(`Erro ao carregar services.json: ${response.status}`);
      }

      const data = await response.json();

      services = data.services || [];

      if (!services.length) {
        throw new Error("Nenhum serviço encontrado no JSON.");
      }

      createServicesMenu();

      showService(0);
    } catch (error) {
      console.error("Erro ao carregar serviços:", error);

      serviceTitle.textContent = "Serviços indisponíveis";
      serviceDescription.textContent =
        "Não foi possível carregar os serviços neste momento.";
    }
  }

  /*
  |--------------------------------------------------------------------------
  | CRIAR MENU DESKTOP
  |--------------------------------------------------------------------------
  */

  function createServicesMenu() {
    servicesMenu.innerHTML = "";
    servicesSelect.innerHTML = "";

    services.forEach((service, index) => {
      /*
      | BOTÃO DESKTOP
      */

      const button = document.createElement("button");

      button.className = "service-tab";

      if (index === 0) {
        button.classList.add("active");
      }

      button.dataset.service = index;
      button.dataset.slug = service.slug;

      button.innerHTML = `
        <span class="service-number">
          ${service.number}
        </span>

        <span class="service-name">
          ${service.name}
        </span>
      `;

      button.addEventListener("click", () => {
        showService(index);
      });

      servicesMenu.appendChild(button);

      /*
      | DROPDOWN MOBILE
      */

      const option = document.createElement("option");

      option.value = index;

      option.textContent = `${service.number} — ${service.name}`;

      servicesSelect.appendChild(option);
    });

    /*
    | EVENTO DO SELECT MOBILE
    */

    servicesSelect.addEventListener("change", (event) => {
      const index = Number(event.target.value);

      showService(index);
    });
  }

  /*
  |--------------------------------------------------------------------------
  | MOSTRAR SERVIÇO
  |--------------------------------------------------------------------------
  */

  function showService(index) {
    if (!services[index]) {
      return;
    }

    currentService = index;

    const service = services[index];

    /*
    | ATUALIZAR MENU
    */

    document.querySelectorAll(".service-tab").forEach((button, buttonIndex) => {
      button.classList.toggle("active", buttonIndex === index);
    });

    /*
    | ATUALIZAR SELECT
    */

    servicesSelect.value = index;

    /*
    | ATUALIZAR CONTEÚDO
    */

    serviceCategory.textContent = service.category;

    serviceTitle.textContent = service.name;

    serviceDescription.textContent = service.shortDescription;

    /*
    | IMAGEM
    */

    serviceImage.src = service.mainImage;

    serviceImage.alt = service.name;

    /*
    | LINK PARA DETALHES
    */

    serviceLink.href = `service-details.html?service=${encodeURIComponent(service.slug)}`;
  }

  /*
  |--------------------------------------------------------------------------
  | INICIAR
  |--------------------------------------------------------------------------
  */

  loadServices();
});
