document.addEventListener("DOMContentLoaded", async function () {
  const blogsContainer = document.getElementById("homeBlogs");

  if (!blogsContainer) {
    return;
  }

  try {
    const response = await fetch("assets/data/blogs.json");

    if (!response.ok) {
      throw new Error("Não foi possível carregar os blogs.");
    }

    const data = await response.json();

    const blogs = data.blogs || [];

    /* Ordenar do mais recente para o mais antigo */

    blogs.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

    /* Mostrar somente os 5 mais recentes */

    const latestBlogs = blogs.slice(0, 5);

    blogsContainer.innerHTML = latestBlogs
      .map((blog) => {
        return `
        <div class="swiper-slide">

          <div class="blog-post-item">

            <img
              src="${blog.image}"
              alt="${blog.title}"
              loading="lazy"
            />

            <div class="blog-post-content">

              <h2>
                <a href="news-details.html?id=${blog.id}">
                  ${blog.title}
                </a>
              </h2>

              <a
                href="news-details.html?id=${blog.id}"
                class="read-more"
              >
                Ler Mais
                <i class="bi bi-arrow-right"></i>
              </a>

            </div>

          </div>

        </div>
      `;
      })
      .join("");

    /*
    | Se o teu template inicializa automaticamente
    | os .init-swiper, não precisas criar outro Swiper aqui.
    */
  } catch (error) {
    console.error("Erro ao carregar blogs:", error);
  }
});
