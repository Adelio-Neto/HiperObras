document.addEventListener("DOMContentLoaded", function () {
  const serviceTabs = document.querySelectorAll(".service-tab");
  const serviceSelect = document.getElementById("servicesSelect");

  const serviceCategory = document.getElementById("serviceCategory");
  const serviceTitle = document.getElementById("serviceTitle");
  const serviceDescription = document.getElementById("serviceDescription");
  const serviceImage = document.getElementById("serviceImage");

  function changeService(index) {
    const service = services[index];

    if (!service) {
      console.error("Serviço não encontrado:", index);
      return;
    }

    console.log("Serviço selecionado:", index);
    console.log("Imagem:", service.image);

    /* =========================
       ATUALIZAR CONTEÚDO
    ========================= */

    serviceCategory.textContent = service.category;
    serviceTitle.textContent = service.title;
    serviceDescription.textContent = service.description;

    /* =========================
       PREPARAR IMAGEM
    ========================= */

    serviceImage.style.opacity = "0";

    /*
     * Criamos uma nova imagem antes de
     * alterar a imagem que está na página.
     *
     * Isso evita deixar o espaço vazio
     * caso a nova imagem demore a carregar.
     */

    const newImage = new Image();

    newImage.onload = function () {
      serviceImage.src = service.image;
      serviceImage.alt = service.title;

      serviceImage.style.opacity = "1";

      console.log("Imagem carregada:", service.image);
    };

    newImage.onerror = function () {
      console.error("ERRO AO CARREGAR A IMAGEM:", service.image);

      /*
       * Mesmo que a imagem dê erro,
       * voltamos a mostrar o elemento.
       */
      serviceImage.style.opacity = "1";
    };

    newImage.src = service.image;

    /* =========================
       MENU DESKTOP
    ========================= */

    serviceTabs.forEach((tab) => {
      tab.classList.remove("active");
    });

    const activeTab = document.querySelector(
      `.service-tab[data-service="${index}"]`,
    );

    if (activeTab) {
      activeTab.classList.add("active");
    }

    /* =========================
       DROPDOWN MOBILE
    ========================= */

    if (serviceSelect) {
      serviceSelect.value = index;
    }
  }

  /* =========================
     CLIQUE NOS SERVIÇOS
  ========================= */

  serviceTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const index = Number(this.dataset.service);

      changeService(index);
    });
  });

  /* =========================
     DROPDOWN MOBILE
  ========================= */

  if (serviceSelect) {
    serviceSelect.addEventListener("change", function () {
      const index = Number(this.value);

      changeService(index);
    });
  }

  /* =========================
     CARREGAR PRIMEIRO SERVIÇO
  ========================= */

  changeService(0);
});
