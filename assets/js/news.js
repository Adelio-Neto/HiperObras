document.addEventListener("DOMContentLoaded", function () {
  const wrapper = document.querySelector("#latest-news .swiper-wrapper");

  if (!wrapper) {
    return;
  }

  /*
    |--------------------------------------------------------------------------
    | BUSCAR NOTÍCIAS
    |--------------------------------------------------------------------------
    */

  fetch("api/news.php")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao contactar a API.");
      }

      return response.json();
    })

    .then((data) => {
      console.log("Notícias recebidas:", data);

      if (!data.sucesso) {
        console.error("Erro da API:", data.erro);

        return;
      }

      if (!data.noticias || data.noticias.length === 0) {
        console.warn("Nenhuma notícia encontrada.");

        return;
      }

      /*
            |--------------------------------------------------------------------------
            | CRIAR CARDS
            |--------------------------------------------------------------------------
            */

      wrapper.innerHTML = "";

      data.noticias.forEach((noticia) => {
        const slide = document.createElement("div");

        slide.className = "swiper-slide";

        slide.innerHTML = `

                    <article class="news-card">

                        <a
                            href="${noticia.url}"
                            class="news-image"
                            target="_blank"
                            rel="noopener noreferrer"
                        >

                            <img
                                src="${noticia.imagem}"
                                alt="${escaparHTML(noticia.titulo)}"
                                loading="lazy"
                            >

                        </a>


                        <div class="news-content">

                            <span class="news-category">
                                ${noticia.categoria}
                            </span>


                            <h3>

                                <a
                                    href="${noticia.url}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    ${escaparHTML(noticia.titulo)}
                                </a>

                            </h3>


                            <div class="news-meta">

                                <span>
                                    Angola
                                </span>

                                <span>|</span>

                                <span>
                                    ${noticia.data || ""}
                                </span>

                            </div>

                        </div>

                    </article>

                `;

        wrapper.appendChild(slide);
      });

      /*
            |--------------------------------------------------------------------------
            | INICIAR SWIPER
            |--------------------------------------------------------------------------
            */

      iniciarNewsSwiper();
    })

    .catch((error) => {
      console.error("Erro ao carregar notícias:", error);
    });
});

/*
|--------------------------------------------------------------------------
| ESCAPAR HTML
|--------------------------------------------------------------------------
*/

function escaparHTML(texto) {
  const div = document.createElement("div");

  div.textContent = texto || "";

  return div.innerHTML;
}

/*
|--------------------------------------------------------------------------
| SWIPER
|--------------------------------------------------------------------------
*/

function iniciarNewsSwiper() {
  const slider = document.querySelector(".latest-news-slider");

  if (!slider) {
    return;
  }

  /*
    | Verificar se o Swiper existe
    */

  if (typeof Swiper === "undefined") {
    console.error("Swiper não foi carregado.");

    return;
  }

  /*
    | Se já existir uma instância,
    | destruí-la.
    */

  if (slider.swiper) {
    slider.swiper.destroy(true, true);
  }

  /*
    |--------------------------------------------------------------------------
    | CRIAR SWIPER
    |--------------------------------------------------------------------------
    */

  new Swiper(slider, {
    loop: true,

    speed: 700,

    slidesPerView: 1,

    spaceBetween: 24,

    grabCursor: true,

    autoplay: {
      delay: 5000,

      disableOnInteraction: false,
    },

    pagination: {
      el: ".news-pagination",

      clickable: true,
    },

    navigation: {
      nextEl: ".news-next",

      prevEl: ".news-prev",
    },

    breakpoints: {
      768: {
        slidesPerView: 2,

        spaceBetween: 24,
      },

      1200: {
        slidesPerView: 3,

        spaceBetween: 26,
      },
    },
  });
}
