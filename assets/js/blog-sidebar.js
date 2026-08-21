document.addEventListener("DOMContentLoaded", () => {
  carregarSidebar();
});

/* =========================================================
   CONFIGURAÇÕES
========================================================= */

const POSTS_POR_PAGINA = 8;

let todosBlogs = [];

let paginaAtual = 1;

/* =========================================================
   CARREGAR SIDEBAR
========================================================= */

async function carregarSidebar() {
  try {
    const resposta = await fetch("assets/data/blogs.json");

    if (!resposta.ok) {
      throw new Error("Erro ao carregar blogs.");
    }

    const dados = await resposta.json();

    todosBlogs = Array.isArray(dados.blogs) ? dados.blogs : [];

    /*
    |--------------------------------------------------------------------------
    | Ordenar por data
    |--------------------------------------------------------------------------
    */

    todosBlogs.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

    /*
    |--------------------------------------------------------------------------
    | Categorias
    |--------------------------------------------------------------------------
    */

    carregarCategorias(todosBlogs);

    /*
    |--------------------------------------------------------------------------
    | Artigos recentes
    |--------------------------------------------------------------------------
    */

    carregarPostsRecentes();

    /*
    |--------------------------------------------------------------------------
    | Pesquisa
    |--------------------------------------------------------------------------
    */

    configurarPesquisa();
  } catch (erro) {
    console.error("Erro ao carregar sidebar:", erro);
  }
}

/* =========================================================
   CATEGORIAS
========================================================= */

function carregarCategorias(blogs) {
  const container = document.getElementById("blog-categories");

  if (!container) {
    return;
  }

  /*
  |--------------------------------------------------------------------------
  | Agrupar blogs por categoria
  |--------------------------------------------------------------------------
  */

  const categorias = {};

  blogs.forEach((blog) => {
    const categoria = blog.category;

    if (!categoria) {
      return;
    }

    if (!categorias[categoria]) {
      categorias[categoria] = [];
    }

    categorias[categoria].push(blog);
  });

  /*
  |--------------------------------------------------------------------------
  | Limpar lista
  |--------------------------------------------------------------------------
  */

  container.innerHTML = "";

  /*
  |--------------------------------------------------------------------------
  | Criar categorias
  |--------------------------------------------------------------------------
  */

  Object.entries(categorias).forEach(([categoria, blogsCategoria]) => {
    /*
      | Item principal da categoria
      */

    const li = document.createElement("li");

    li.className = "category-item";

    /*
      | Botão da categoria
      */

    const button = document.createElement("button");

    button.type = "button";

    button.className = "category-toggle";

    button.innerHTML = `

        <span>
          ${categoria}
          <span class="category-count">
            (${blogsCategoria.length})
          </span>
        </span>

        <i class="bi bi-chevron-down"></i>

      `;

    /*
      | Sublista
      */

    const sublista = document.createElement("ul");

    sublista.className = "category-posts";

    /*
      | Criar artigos da categoria
      */

    blogsCategoria.forEach((blog) => {
      const subItem = document.createElement("li");

      const link = document.createElement("a");

      link.href = `news-details.html?id=${blog.id}`;

      link.textContent = blog.title;

      subItem.appendChild(link);

      sublista.appendChild(subItem);
    });

    /*
      | Evento abrir/fechar
      */

    button.addEventListener("click", () => {
      const aberta = li.classList.contains("active");

      /*
          | Fechar outras categorias
          */

      document
        .querySelectorAll("#blog-categories .category-item.active")
        .forEach((item) => {
          item.classList.remove("active");
        });

      /*
          | Abrir a selecionada
          */

      if (!aberta) {
        li.classList.add("active");
      }
    });

    /*
      | Montar estrutura
      */

    li.appendChild(button);

    li.appendChild(sublista);

    container.appendChild(li);
  });
}

/* =========================================================
   ARTIGOS RECENTES
========================================================= */

function carregarPostsRecentes() {
  const container = document.getElementById("recent-posts");

  if (!container) {
    return;
  }

  /*
  |--------------------------------------------------------------------------
  | Calcular início e fim
  |--------------------------------------------------------------------------
  */

  const inicio = (paginaAtual - 1) * POSTS_POR_PAGINA;

  const fim = inicio + POSTS_POR_PAGINA;

  const posts = todosBlogs.slice(inicio, fim);

  /*
  |--------------------------------------------------------------------------
  | Limpar
  |--------------------------------------------------------------------------
  */

  container.innerHTML = "";

  /*
  |--------------------------------------------------------------------------
  | Criar artigos
  |--------------------------------------------------------------------------
  */

  posts.forEach((blog) => {
    const post = document.createElement("div");

    post.className = "post-item";

    /*
      | Data
      */

    const data = new Date(blog.date);

    const dataFormatada = data.toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    post.innerHTML = `

        <img
          src="${blog.image}"
          alt="${blog.title}"
          class="flex-shrink-0"
          loading="lazy"
        />


        <div>

          <h4>

            <a
              href="news-details.html?id=${blog.id}"
            >
              ${blog.title}
            </a>

          </h4>


          <time
            datetime="${blog.date}"
          >
            ${dataFormatada}
          </time>

        </div>

      `;

    container.appendChild(post);
  });

  /*
  |--------------------------------------------------------------------------
  | Atualizar paginação
  |--------------------------------------------------------------------------
  */

  atualizarPaginacao();
}

/* =========================================================
   PAGINAÇÃO
========================================================= */

function atualizarPaginacao() {
  const prev = document.getElementById("recent-prev");

  const next = document.getElementById("recent-next");

  const page = document.getElementById("recent-page");

  if (!prev || !next || !page) {
    return;
  }

  /*
  |--------------------------------------------------------------------------
  | Total de páginas
  |--------------------------------------------------------------------------
  */

  const totalPaginas = Math.ceil(todosBlogs.length / POSTS_POR_PAGINA);

  /*
  |--------------------------------------------------------------------------
  | Número da página
  |--------------------------------------------------------------------------
  */

  page.textContent = `${paginaAtual} / ${totalPaginas || 1}`;

  /*
  |--------------------------------------------------------------------------
  | Botão anterior
  |--------------------------------------------------------------------------
  */

  prev.disabled = paginaAtual <= 1;

  /*
  |--------------------------------------------------------------------------
  | Botão próximo
  |--------------------------------------------------------------------------
  */

  next.disabled = paginaAtual >= totalPaginas;

  /*
  |--------------------------------------------------------------------------
  | Eventos
  |--------------------------------------------------------------------------
  */

  prev.onclick = () => {
    if (paginaAtual <= 1) {
      return;
    }

    paginaAtual--;

    carregarPostsRecentes();
  };

  next.onclick = () => {
    if (paginaAtual >= totalPaginas) {
      return;
    }

    paginaAtual++;

    carregarPostsRecentes();
  };
}

/* =========================================================
   PESQUISA
========================================================= */

function configurarPesquisa() {
  const form = document.getElementById("blog-search-form");

  const input = document.getElementById("blog-search");

  if (!form || !input) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const pesquisa = input.value.trim().toLowerCase();

    /*
      |--------------------------------------------------------------------------
      | Pesquisa vazia
      |--------------------------------------------------------------------------
      */

    if (!pesquisa) {
      todosBlogs = todosBlogsOriginal();

      paginaAtual = 1;

      carregarPostsRecentes();

      return;
    }

    /*
      |--------------------------------------------------------------------------
      | Filtrar
      |--------------------------------------------------------------------------
      */

    const resultados = todosBlogsOriginal().filter((blog) => {
      const titulo = (blog.title || "").toLowerCase();

      const categoria = (blog.category || "").toLowerCase();

      const conteudo = JSON.stringify(blog.content || []).toLowerCase();

      return (
        titulo.includes(pesquisa) ||
        categoria.includes(pesquisa) ||
        conteudo.includes(pesquisa)
      );
    });

    /*
      |--------------------------------------------------------------------------
      | Aplicar resultados
      |--------------------------------------------------------------------------
      */

    todosBlogs = resultados;

    paginaAtual = 1;

    carregarPostsRecentes();
  });
}

/* =========================================================
   MANTER CÓPIA ORIGINAL
========================================================= */

let blogsOriginais = null;

function todosBlogsOriginal() {
  if (!blogsOriginais) {
    blogsOriginais = [...todosBlogs];
  }

  return [...blogsOriginais];
}
