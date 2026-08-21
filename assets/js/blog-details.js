document.addEventListener("DOMContentLoaded", async function () {
  try {
    /* Pegar ID da URL */

    const params = new URLSearchParams(window.location.search);

    const blogId = Number(params.get("id"));

    if (!blogId) {
      console.error("ID do blog não informado.");

      return;
    }

    /* Carregar JSON */

    const response = await fetch("assets/data/blogs.json");

    if (!response.ok) {
      throw new Error("Não foi possível carregar os blogs.");
    }

    const data = await response.json();

    const blogs = data.blogs || [];

    /* Encontrar blog */

    const blog = blogs.find((item) => item.id === blogId);

    if (!blog) {
      console.error("Blog não encontrado.");

      return;
    }

    /*----------------------------------------------------------
    | Dados principais
    ----------------------------------------------------------*/

    document.getElementById("blogTitle").textContent = blog.title;

    document.getElementById("blogCategory").textContent = blog.category;

    document.getElementById("blogReadingTime").textContent = blog.readingTime;

    /* Imagem */

    const image = document.getElementById("blogImage");

    image.src = blog.image;
    image.alt = blog.title;

    /* Data */

    const date = new Date(blog.date);

    document.getElementById("blogDate").textContent = date.toLocaleDateString(
      "pt-PT",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      },
    );

    /*----------------------------------------------------------
    | Conteúdo
    ----------------------------------------------------------*/

    const contentContainer = document.getElementById("blogContent");

    contentContainer.innerHTML = "";

    blog.content.forEach((block) => {
      let element;

      if (block.type === "lead") {
        element = document.createElement("p");

        element.classList.add("lead");

        element.textContent = block.text;
      } else if (block.type === "paragraph") {
        element = document.createElement("p");

        element.textContent = block.text;
      } else if (block.type === "heading") {
        element = document.createElement("h2");

        element.textContent = block.text;
      }

      if (element) {
        contentContainer.appendChild(element);
      }
    });

    /*
    | Atualizar título da página
    */

    document.title = blog.title;
  } catch (error) {
    console.error("Erro ao carregar detalhe do blog:", error);
  }
});
document.addEventListener("DOMContentLoaded", () => {
  carregarBlog();
});

async function carregarBlog() {
  try {
    /*
    |--------------------------------------------------------------------------
    | Pegar ID da URL
    |--------------------------------------------------------------------------
    |
    | Exemplo:
    |
    | blog-details.html?id=1
    |
    */

    const parametros = new URLSearchParams(window.location.search);

    const id = Number(parametros.get("id"));

    if (!id) {
      mostrarErro("Nenhum artigo foi selecionado.");

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Buscar JSON
    |--------------------------------------------------------------------------
    */

    const resposta = await fetch("assets/data/blogs.json");

    if (!resposta.ok) {
      throw new Error("Não foi possível carregar os blogs.");
    }

    const dados = await resposta.json();

    const blogs = Array.isArray(dados.blogs) ? dados.blogs : [];

    /*
    |--------------------------------------------------------------------------
    | Encontrar artigo
    |--------------------------------------------------------------------------
    */

    const blog = blogs.find((item) => Number(item.id) === id);

    if (!blog) {
      mostrarErro("O artigo não foi encontrado.");

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Mostrar artigo
    |--------------------------------------------------------------------------
    */

    mostrarBlog(blog);
  } catch (erro) {
    console.error("Erro ao carregar artigo:", erro);

    mostrarErro("Ocorreu um erro ao carregar o artigo.");
  }
}

/*
|--------------------------------------------------------------------------
| MOSTRAR BLOG
|--------------------------------------------------------------------------
*/

function mostrarBlog(blog) {
  /*
  | Imagem
  */

  const imagem = document.getElementById("blog-image");

  if (imagem) {
    imagem.src = blog.image;

    imagem.alt = blog.title;
  }

  /*
  | Categoria
  */

  const categoria = document.getElementById("blog-category");

  if (categoria) {
    categoria.textContent = blog.category;
  }

  /*
  | Tempo de leitura
  */

  const tempo = document.getElementById("blog-reading-time");

  if (tempo) {
    tempo.textContent = blog.readingTime;
  }

  /*
  | Título
  */

  const titulo = document.getElementById("blog-title");

  if (titulo) {
    titulo.textContent = blog.title;
  }

  /*
  | Conteúdo
  */

  const conteudo = document.getElementById("blog-content");

  if (!conteudo) {
    return;
  }

  conteudo.innerHTML = "";

  /*
  | Percorrer conteúdo
  */

  if (Array.isArray(blog.content)) {
    blog.content.forEach((bloco) => {
      criarBloco(conteudo, bloco);
    });
  }

  /*
  | Título da página
  */

  document.title = `${blog.title} | HiperObras`;
}

/*
|--------------------------------------------------------------------------
| CRIAR BLOCO DO ARTIGO
|--------------------------------------------------------------------------
*/

function criarBloco(container, bloco) {
  if (!bloco.type) {
    return;
  }

  /*
  |--------------------------------------------------------------------------
  | Lead
  |--------------------------------------------------------------------------
  */

  if (bloco.type === "lead") {
    const p = document.createElement("p");

    p.className = "lead";

    p.textContent = bloco.text || "";

    container.appendChild(p);

    return;
  }

  /*
  |--------------------------------------------------------------------------
  | Parágrafo
  |--------------------------------------------------------------------------
  */

  if (bloco.type === "paragraph") {
    const p = document.createElement("p");

    p.textContent = bloco.text || "";

    container.appendChild(p);

    return;
  }

  /*
  |--------------------------------------------------------------------------
  | Heading
  |--------------------------------------------------------------------------
  */

  if (bloco.type === "heading") {
    const h2 = document.createElement("h2");

    h2.textContent = bloco.text || "";

    container.appendChild(h2);

    return;
  }

  /*
  |--------------------------------------------------------------------------
  | Subheading
  |--------------------------------------------------------------------------
  */

  if (bloco.type === "subheading") {
    const h3 = document.createElement("h3");

    h3.textContent = bloco.text || "";

    container.appendChild(h3);

    return;
  }

  /*
  |--------------------------------------------------------------------------
  | Lista
  |--------------------------------------------------------------------------
  */

  if (bloco.type === "list") {
    const ul = document.createElement("ul");

    if (Array.isArray(bloco.items)) {
      bloco.items.forEach((item) => {
        const li = document.createElement("li");

        li.textContent = item;

        ul.appendChild(li);
      });
    }

    container.appendChild(ul);

    return;
  }

  /*
  |--------------------------------------------------------------------------
  | Imagem dentro do artigo
  |--------------------------------------------------------------------------
  */

  if (bloco.type === "image") {
    const img = document.createElement("img");

    img.src = bloco.src || "";

    img.alt = bloco.alt || "";

    img.className = "img-fluid";

    img.loading = "lazy";

    container.appendChild(img);
  }
}

/*
|--------------------------------------------------------------------------
| ERRO
|--------------------------------------------------------------------------
*/

function mostrarErro(mensagem) {
  const titulo = document.getElementById("blog-title");

  const conteudo = document.getElementById("blog-content");

  if (titulo) {
    titulo.textContent = "Artigo não encontrado";
  }

  if (conteudo) {
    conteudo.innerHTML = `

      <div class="alert alert-warning">

        <i class="bi bi-exclamation-circle"></i>

        ${mensagem}

      </div>

      <a
        href="news-details.html"
        class="btn btn-primary"
      >
        Ver todos os artigos
      </a>

    `;
  }
}
