document.addEventListener("DOMContentLoaded", function () {
  const serviceTabs = document.querySelectorAll(".service-tab");
  const serviceSelect = document.getElementById("servicesSelect");

  const serviceTitle = document.getElementById("serviceTitle");
  const serviceDescription = document.getElementById("serviceDescription");
  const serviceImage = document.getElementById("serviceImage");

  const services = [
    {
      category: "CONSTRUÇÃO CIVIL",
      title: "Construção Residencial",
      description:
        "Casas, apartamentos e condomínios com design moderno e materiais de primeira linha.",
      image: "assets/img/construction/showcase-2.webp",
    },

    {
      category: "CONSTRUÇÃO CIVIL",
      title: "Obras Comerciais",
      description:
        "Edifícios corporativos, lojas, galpões e espaços comerciais funcionais.",
      image: "assets/img/construction/showcase-8.webp",
    },

    {
      category: "CONSTRUÇÃO CIVIL",
      title: "Reformas e Restaurações",
      description:
        "Renovação completa de ambientes, com foco em eficiência, qualidade e estética.",
      image: "assets/img/construction/showcase-7.webp",
    },

    {
      category: "INFRAESTRUTURA",
      title: "Infraestrutura e Urbanismo",
      description:
        "Pavimentação, redes de água e esgoto e projetos de mobilidade urbana.",
      image: "assets/img/construction/showcase-4.webp",
    },

    {
      category: "GESTÃO",
      title: "Gerenciamento de Obras",
      description:
        "Gestão completa de cronogramas, equipes, materiais e orçamento.",
      image: "assets/img/construction/showcase-2.webp",
    },

    {
      category: "ARQUITETURA",
      title: "Arquitetura e Design",
      description:
        "Projetos arquitetônicos inovadores, integrando estética, funcionalidade e sustentabilidade.",
      image: "assets/img/construction/showcase-7.webp",
    },
  ];

  function changeService(index) {
    const service = services[index];

    if (!service) {
      return;
    }

    /* Atualizar conteúdo */

    serviceTitle.textContent = service.title;

    serviceDescription.textContent = service.description;

    serviceImage.alt = service.title;

    /* Pequeno efeito na imagem */

    serviceImage.style.opacity = "0";

    setTimeout(() => {
      serviceImage.src = service.image;

      serviceImage.onload = () => {
        serviceImage.style.opacity = "1";
      };
    }, 150);

    /* Atualizar menu desktop */

    serviceTabs.forEach((tab) => {
      tab.classList.remove("active");
    });

    const activeTab = document.querySelector(
      `.service-tab[data-service="${index}"]`,
    );

    if (activeTab) {
      activeTab.classList.add("active");
    }

    /* Atualizar dropdown mobile */

    if (serviceSelect) {
      serviceSelect.value = index;
    }
  }

  /* Clique nos serviços */

  serviceTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const index = Number(this.dataset.service);

      changeService(index);
    });
  });

  /* Dropdown mobile */

  if (serviceSelect) {
    serviceSelect.addEventListener("change", function () {
      const index = Number(this.value);

      changeService(index);
    });
  }
});
