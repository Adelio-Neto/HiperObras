<?php

header('Content-Type: application/json; charset=utf-8');

$url = 'https://www.jornaldeangola.ao/noticias/4/economia';

function responder($dados)
{
    echo json_encode(
        $dados,
        JSON_UNESCAPED_UNICODE |
        JSON_UNESCAPED_SLASHES |
        JSON_PRETTY_PRINT
    );

    exit;
}


/*
|--------------------------------------------------------------------------
| BUSCAR HTML
|--------------------------------------------------------------------------
*/

$ch = curl_init();

curl_setopt_array($ch, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_TIMEOUT => 20,
    CURLOPT_CONNECTTIMEOUT => 10,

    CURLOPT_USERAGENT =>
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' .
        'AppleWebKit/537.36 (KHTML, like Gecko) ' .
        'Chrome/131.0.0.0 Safari/537.36',

    CURLOPT_HTTPHEADER => [
        'Accept: text/html,application/xhtml+xml',
        'Accept-Language: pt-PT,pt;q=0.9,en;q=0.8'
    ]
]);

$html = curl_exec($ch);

$erroCurl = curl_error($ch);

$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);

curl_close($ch);


if ($html === false || empty($html)) {

    responder([
        'sucesso' => false,
        'erro' => 'Não foi possível obter as notícias.',
        'detalhes' => $erroCurl
    ]);

}


if ($status >= 400) {

    responder([
        'sucesso' => false,
        'erro' => 'O Jornal de Angola respondeu com erro.',
        'status' => $status
    ]);

}


/*
|--------------------------------------------------------------------------
| CRIAR DOM
|--------------------------------------------------------------------------
*/

libxml_use_internal_errors(true);

$dom = new DOMDocument();

$dom->loadHTML(
    mb_convert_encoding($html, 'HTML-ENTITIES', 'UTF-8')
);

libxml_clear_errors();

$xpath = new DOMXPath($dom);


/*
|--------------------------------------------------------------------------
| FUNÇÕES AUXILIARES
|--------------------------------------------------------------------------
*/

function limparTexto($texto)
{
    $texto = trim($texto);

    $texto = preg_replace('/\s+/', ' ', $texto);

    return $texto;
}


function urlAbsoluta($url)
{
    if (empty($url)) {
        return '';
    }

    if (str_starts_with($url, 'http://')) {
        return $url;
    }

    if (str_starts_with($url, 'https://')) {
        return $url;
    }

    if (str_starts_with($url, '//')) {
        return 'https:' . $url;
    }

    if (str_starts_with($url, '/')) {
        return 'https://www.jornaldeangola.ao' . $url;
    }

    return 'https://www.jornaldeangola.ao/' . $url;
}


/*
|--------------------------------------------------------------------------
| ENCONTRAR NOTÍCIAS
|--------------------------------------------------------------------------
|
| As URLs das notícias do Jornal de Angola têm normalmente:
|
| /noticias/4/economia/ID/titulo
|
*/

$links = $xpath->query(
    '//a[contains(@href, "/noticias/4/economia/")]'
);


$noticias = [];

$urlsEncontradas = [];


foreach ($links as $link) {

    // Garantir que é um elemento HTML
    if (!$link instanceof DOMElement) {
        continue;
    }


    /*
    |--------------------------------------------------------------------------
    | PEGAR LINK
    |--------------------------------------------------------------------------
    */

    $href = $link->getAttribute('href');

    $href = urlAbsoluta($href);

    if (empty($href)) {
        continue;
    }


    /*
    |--------------------------------------------------------------------------
    | EVITAR NOTÍCIA DUPLICADA
    |--------------------------------------------------------------------------
    */

    if (isset($urlsEncontradas[$href])) {
        continue;
    }

    $urlsEncontradas[$href] = true;


    /*
    |--------------------------------------------------------------------------
    | PEGAR TÍTULO
    |--------------------------------------------------------------------------
    */

    $titulo = limparTexto($link->textContent);


    /*
    |--------------------------------------------------------------------------
    | SE NÃO TIVER TEXTO, PROCURAR TÍTULO
    |--------------------------------------------------------------------------
    */

    if (strlen($titulo) < 10) {

        $tituloNode = $xpath->query(
            './/h1 | .//h2 | .//h3 | .//h4',
            $link
        );

        if (
            $tituloNode !== false &&
            $tituloNode->length > 0
        ) {

            $elementoTitulo =
                $tituloNode->item(0);

            if ($elementoTitulo instanceof DOMElement) {

                $titulo = limparTexto(
                    $elementoTitulo->textContent
                );

            }

        }

    }


    /*
    |--------------------------------------------------------------------------
    | IGNORAR LINKS QUE NÃO SÃO NOTÍCIAS
    |--------------------------------------------------------------------------
    */

    if (strlen($titulo) < 15) {
        continue;
    }


    /*
    |--------------------------------------------------------------------------
    | PROCURAR IMAGEM
    |--------------------------------------------------------------------------
    */

    $imagem = '';

    $img = $xpath->query(
        './/img',
        $link
    );


    if (
        $img !== false &&
        $img->length > 0
    ) {

        $imagemNode = $img->item(0);


        /*
        | Garantir que é DOMElement
        */

        if ($imagemNode instanceof DOMElement) {

            $imagem =
                $imagemNode->getAttribute('src');


            /*
            | Lazy loading
            */

            if (empty($imagem)) {

                $imagem =
                    $imagemNode->getAttribute('data-src');

            }


            if (empty($imagem)) {

                $imagem =
                    $imagemNode->getAttribute('data-lazy-src');

            }


            $imagem =
                urlAbsoluta($imagem);

        }

    }


    /*
    |--------------------------------------------------------------------------
    | PROCURAR DATA
    |--------------------------------------------------------------------------
    */

    $data = '';

    $parent = $link->parentNode;


    if ($parent) {

        $textoParent =
            limparTexto($parent->textContent);


        if (
            preg_match(
                '/\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}\b/',
                $textoParent,
                $matches
            )
        ) {

            $data = $matches[0];

        }

    }


    /*
    |--------------------------------------------------------------------------
    | ADICIONAR NOTÍCIA
    |--------------------------------------------------------------------------
    */

    $noticias[] = [

        'titulo' => $titulo,

        'categoria' => 'Economia',

        'data' => $data,

        'imagem' => $imagem,

        'url' => $href

    ];


    /*
    |--------------------------------------------------------------------------
    | LIMITAR A 10 NOTÍCIAS
    |--------------------------------------------------------------------------
    */

    if (count($noticias) >= 10) {
        break;
    }

}

/*
|--------------------------------------------------------------------------
| REMOVER DUPLICADOS PELO TÍTULO
|--------------------------------------------------------------------------
*/

$noticiasUnicas = [];

$titulos = [];


foreach ($noticias as $noticia) {

    $chave = strtolower(
        trim($noticia['titulo'])
    );


    if (isset($titulos[$chave])) {
        continue;
    }


    $titulos[$chave] = true;

    $noticiasUnicas[] = $noticia;

}


/*
|--------------------------------------------------------------------------
| RESPOSTA
|--------------------------------------------------------------------------
*/

responder([
    'sucesso' => true,

    'quantidade' => count($noticiasUnicas),

    'fonte' =>
        'Jornal de Angola',

    'noticias' =>
        $noticiasUnicas
]);