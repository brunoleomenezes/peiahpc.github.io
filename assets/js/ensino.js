/* ==========================================================================
   PEIA-HPC — área de ensino
   Carrega dados/aulas.json, monta a trilha do curso, controla o player do
   YouTube, a busca, os filtros por fase e o progresso do aluno.

   Para publicar um vídeo, basta preencher "youtubeId" da aula em
   dados/aulas.json (e, opcionalmente, "config.playlistId"). Nada aqui
   precisa ser alterado.
   ========================================================================== */

(function () {
  "use strict";

  var CHAVE_VISTAS = "peia:aulas-vistas";
  var CHAVE_ULTIMA = "peia:ultima-aula";

  var dados = null;
  var aulaAtual = null;
  var filtroFase = "todas";
  var termoBusca = "";

  /* ---------------------------------------------------------- Elementos -- */

  var el = {
    player: document.querySelector("[data-player]"),
    playlist: document.querySelector("[data-playlist]"),
    detalheAula: document.querySelector("[data-aula-atual]"),
    lista: document.querySelector("[data-lista-aulas]"),
    filtros: document.querySelector("[data-filtros]"),
    busca: document.querySelector("[data-busca]"),
    barra: document.querySelector("[data-progresso-barra]"),
    progressoTexto: document.querySelector("[data-progresso-texto]"),
    contagem: document.querySelector("[data-contagem]")
  };

  /* ------------------------------------------------------- Persistência -- */

  function lerVistas() {
    try {
      var bruto = localStorage.getItem(CHAVE_VISTAS);
      var lista = bruto ? JSON.parse(bruto) : [];
      return Array.isArray(lista) ? lista : [];
    } catch (e) {
      return [];
    }
  }

  function gravarVistas(lista) {
    try {
      localStorage.setItem(CHAVE_VISTAS, JSON.stringify(lista));
    } catch (e) {
      /* modo privado: progresso vale só nesta sessão */
    }
  }

  function estaVista(id) {
    return lerVistas().indexOf(id) !== -1;
  }

  function alternarVista(id) {
    var lista = lerVistas();
    var posicao = lista.indexOf(id);
    if (posicao === -1) {
      lista.push(id);
    } else {
      lista.splice(posicao, 1);
    }
    gravarVistas(lista);
  }

  function gravarUltima(id) {
    try {
      localStorage.setItem(CHAVE_ULTIMA, id);
    } catch (e) {
      /* ignora */
    }
  }

  function lerUltima() {
    try {
      return localStorage.getItem(CHAVE_ULTIMA);
    } catch (e) {
      return null;
    }
  }

  /* ----------------------------------------------------------- Auxílios -- */

  function idioma() {
    return window.PEIA ? window.PEIA.idioma() : "pt";
  }

  function t(chave) {
    return window.PEIA ? window.PEIA.t(chave) : chave;
  }

  function conteudo(item) {
    return item[idioma()] || item.pt;
  }

  function fasePorId(id) {
    for (var i = 0; i < dados.fases.length; i++) {
      if (dados.fases[i].id === id) return dados.fases[i];
    }
    return null;
  }

  function aulaPorId(id) {
    for (var i = 0; i < dados.aulas.length; i++) {
      if (dados.aulas[i].id === id) return dados.aulas[i];
    }
    return null;
  }

  function urlNotebook(aula) {
    var base = dados.config.notebooksBase.replace(/\/$/, "");
    var prefixo = idioma() === "en" ? "/en/" : "/";
    return base + prefixo + aula.notebook;
  }

  function criar(tag, classe, texto) {
    var no = document.createElement(tag);
    if (classe) no.className = classe;
    if (texto !== undefined && texto !== null) no.textContent = texto;
    return no;
  }

  function icone(caminho, extra) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");
    if (extra) svg.setAttribute("fill", extra);
    var p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p.setAttribute("d", caminho);
    svg.appendChild(p);
    return svg;
  }

  var CAMINHO_CHECK = "M20 6L9 17l-5-5";
  var CAMINHO_CIRCULO = "M12 3a9 9 0 100 18 9 9 0 000-18z";
  var CAMINHO_LINK = "M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3";

  /* ------------------------------------------------------------- Player -- */

  function montarPlayer(aula) {
    el.player.textContent = "";

    var dadosAula = conteudo(aula);

    if (aula.youtubeId) {
      var src =
        "https://www.youtube-nocookie.com/embed/" +
        encodeURIComponent(aula.youtubeId) +
        "?rel=0&modestbranding=1&hl=" +
        idioma();

      if (dados.config.playlistId) {
        src += "&list=" + encodeURIComponent(dados.config.playlistId);
      }

      var quadro = document.createElement("iframe");
      quadro.src = src;
      quadro.title = dadosAula.semana + " · " + dadosAula.titulo;
      quadro.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      quadro.setAttribute("allowfullscreen", "");
      quadro.setAttribute("loading", "lazy");
      quadro.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
      el.player.appendChild(quadro);
      return;
    }

    // Sem vídeo publicado ainda
    var vazio = criar("div", "player__vazio");
    var marca = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    marca.setAttribute("viewBox", "0 0 24 24");
    marca.setAttribute("fill", "currentColor");
    marca.setAttribute("aria-hidden", "true");
    var forma = document.createElementNS("http://www.w3.org/2000/svg", "path");
    forma.setAttribute(
      "d",
      "M12 2a10 10 0 100 20 10 10 0 000-20zm0 2a8 8 0 110 16 8 8 0 010-16zm-.75 3.5v5.25l4.5 2.7.75-1.23-3.75-2.22V7.5z"
    );
    marca.appendChild(forma);

    vazio.appendChild(marca);
    vazio.appendChild(criar("strong", null, t("ens.player.vazio.t")));
    vazio.appendChild(criar("p", null, t("ens.player.vazio.p")));
    el.player.appendChild(vazio);
  }

  /* ------------------------------------------------- Detalhes da aula -- */

  function montarDetalhes(aula) {
    var d = conteudo(aula);
    var fase = fasePorId(aula.fase);
    var faseTexto = fase ? conteudo(fase) : null;

    el.detalheAula.textContent = "";

    // Etiquetas
    var etiquetas = criar("div", "aula-atual__etiquetas");
    etiquetas.appendChild(criar("span", "etiqueta etiqueta--azul", d.semana));
    if (faseTexto) {
      etiquetas.appendChild(criar("span", "etiqueta etiqueta--teal", faseTexto.curto));
    }
    if (d.marco) {
      etiquetas.appendChild(criar("span", "etiqueta etiqueta--ambar", d.marco));
    }
    el.detalheAula.appendChild(etiquetas);

    // Título
    el.detalheAula.appendChild(criar("h2", null, d.titulo));

    // Blocos de detalhe
    var blocos = [
      ["ens.detalhe.curriculo", d.curriculo],
      ["ens.detalhe.hpc", d.hpc],
      ["ens.detalhe.pratica", d.pratica],
      ["ens.detalhe.entregavel", d.entregavel]
    ];

    var caixa = criar("div", "detalhes");
    blocos.forEach(function (par) {
      if (!par[1]) return;
      var bloco = criar("div", "detalhe");
      bloco.appendChild(criar("div", "detalhe__rotulo", t(par[0])));
      bloco.appendChild(criar("p", null, par[1]));
      caixa.appendChild(bloco);
    });
    el.detalheAula.appendChild(caixa);

    // Ações
    var acoes = criar("div", "grupo-botoes");

    var notebook = criar("a", "botao botao--primario");
    notebook.href = urlNotebook(aula);
    notebook.target = "_blank";
    notebook.rel = "noopener noreferrer";
    notebook.appendChild(document.createTextNode(t("ens.btn.notebook")));
    notebook.appendChild(icone(CAMINHO_LINK));
    acoes.appendChild(notebook);

    var vista = estaVista(aula.id);
    var marcar = criar("button", "botao " + (vista ? "botao--contorno" : "botao--contorno"));
    marcar.type = "button";
    marcar.setAttribute("aria-pressed", String(vista));
    marcar.appendChild(icone(CAMINHO_CHECK));
    marcar.appendChild(
      document.createTextNode(vista ? t("ens.btn.desmarcar") : t("ens.btn.marcar"))
    );
    marcar.addEventListener("click", function () {
      alternarVista(aula.id);
      montarDetalhes(aula);
      montarLista();
      atualizarProgresso();
    });
    acoes.appendChild(marcar);

    el.detalheAula.appendChild(acoes);

    // Navegação entre aulas consecutivas da trilha completa
    var posicao = dados.aulas.indexOf(aula);
    var anterior = posicao > 0 ? dados.aulas[posicao - 1] : null;
    var proxima = posicao < dados.aulas.length - 1 ? dados.aulas[posicao + 1] : null;

    if (anterior || proxima) {
      var navegacao = criar("nav", "navegacao-aula");
      navegacao.setAttribute("aria-label", t("ens.trilha.titulo"));

      [
        { alvo: anterior, chave: "ens.btn.anterior", direcao: "anterior" },
        { alvo: proxima, chave: "ens.btn.proxima", direcao: "proxima" }
      ].forEach(function (item) {
        if (!item.alvo) {
          navegacao.appendChild(criar("span"));
          return;
        }

        var botao = criar("button", "navegacao-aula__botao navegacao-aula__botao--" + item.direcao);
        botao.type = "button";

        var seta = icone(item.direcao === "anterior" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6");
        var texto = criar("span", "navegacao-aula__texto");
        texto.appendChild(criar("span", "navegacao-aula__rotulo", t(item.chave)));
        texto.appendChild(criar("span", "navegacao-aula__titulo", conteudo(item.alvo).titulo));

        if (item.direcao === "anterior") {
          botao.appendChild(seta);
          botao.appendChild(texto);
        } else {
          botao.appendChild(texto);
          botao.appendChild(seta);
        }

        botao.addEventListener("click", function () {
          selecionar(item.alvo.id, true);
        });

        navegacao.appendChild(botao);
      });

      el.detalheAula.appendChild(navegacao);
    }
  }

  /* --------------------------------------------------------- Selecionar -- */

  function selecionar(id, rolar) {
    var aula = aulaPorId(id);
    if (!aula) return;

    aulaAtual = aula;
    gravarUltima(id);

    montarPlayer(aula);
    montarDetalhes(aula);
    marcarAtivaNaLista();

    if (history.replaceState) {
      history.replaceState(null, "", "#" + id);
    }

    if (rolar && window.matchMedia("(max-width: 1000px)").matches) {
      var palco = document.querySelector("[data-palco]");
      if (palco) palco.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function marcarAtivaNaLista() {
    el.lista.querySelectorAll("[data-aula-id]").forEach(function (botao) {
      var ativo = aulaAtual && botao.getAttribute("data-aula-id") === aulaAtual.id;
      botao.setAttribute("aria-current", String(ativo));
    });
  }

  /* --------------------------------------------------------- Lista/filtros */

  function aulasFiltradas() {
    var termo = termoBusca.trim().toLowerCase();

    return dados.aulas.filter(function (aula) {
      if (filtroFase !== "todas" && aula.fase !== filtroFase) return false;
      if (!termo) return true;

      var d = conteudo(aula);
      var alvo = [d.semana, d.titulo, d.curriculo, d.hpc, d.pratica, d.entregavel]
        .join(" ")
        .toLowerCase();
      return alvo.indexOf(termo) !== -1;
    });
  }

  function montarFiltros() {
    el.filtros.textContent = "";

    var itens = [{ id: "todas", nome: t("ens.filtro.todas") }].concat(
      dados.fases.map(function (fase) {
        return { id: fase.id, nome: conteudo(fase).curto };
      })
    );

    itens.forEach(function (item) {
      var botao = criar("button", "filtro", item.nome);
      botao.type = "button";
      botao.setAttribute("aria-pressed", String(filtroFase === item.id));
      botao.addEventListener("click", function () {
        filtroFase = item.id;
        montarFiltros();
        montarLista();
      });
      el.filtros.appendChild(botao);
    });
  }

  function montarLista() {
    el.lista.textContent = "";

    var lista = aulasFiltradas();

    if (el.contagem) {
      el.contagem.textContent = window.PEIA.formatar("ens.contagem", { n: lista.length });
    }

    if (!lista.length) {
      el.lista.appendChild(criar("li", "vazio-busca", t("ens.vazio")));
      return;
    }

    var faseAnterior = null;

    lista.forEach(function (aula) {
      if (aula.fase !== faseAnterior) {
        faseAnterior = aula.fase;
        var fase = fasePorId(aula.fase);
        var cabecalho = criar("li", "grupo-fase", fase ? conteudo(fase).curto : "");
        cabecalho.setAttribute("role", "presentation");
        el.lista.appendChild(cabecalho);
      }

      var d = conteudo(aula);
      var vista = estaVista(aula.id);

      var item = document.createElement("li");
      var botao = criar("button", "aula" + (vista ? " esta-vista" : ""));
      botao.type = "button";
      botao.setAttribute("data-aula-id", aula.id);
      botao.setAttribute("aria-current", String(aulaAtual && aulaAtual.id === aula.id));

      botao.appendChild(criar("span", "aula__indice", aula.rotulo));

      var texto = criar("span", "aula__texto");
      texto.appendChild(criar("span", "aula__nome", d.titulo));
      texto.appendChild(
        criar("span", "aula__nota", d.semana + (aula.youtubeId ? "" : " · " + t("ens.player.vazio.t")))
      );
      botao.appendChild(texto);

      var estado = criar("span", "aula__estado");
      estado.appendChild(icone(vista ? CAMINHO_CHECK : CAMINHO_CIRCULO));
      botao.appendChild(estado);

      botao.addEventListener("click", function () {
        selecionar(aula.id, true);
      });

      item.appendChild(botao);
      el.lista.appendChild(item);
    });
  }

  function atualizarProgresso() {
    var total = dados.aulas.length;
    var vistas = lerVistas().filter(function (id) {
      return aulaPorId(id) !== null;
    }).length;

    var percentual = total ? Math.round((vistas / total) * 100) : 0;

    if (el.barra) {
      el.barra.style.width = percentual + "%";
      var trilho = el.barra.parentElement;
      if (trilho) trilho.setAttribute("aria-valuenow", String(percentual));
    }

    if (el.progressoTexto) {
      if (vistas === 0) {
        el.progressoTexto.textContent = t("ens.progresso.zero");
      } else if (vistas === 1) {
        el.progressoTexto.textContent = window.PEIA.formatar("ens.progresso.um", { total: total });
      } else {
        el.progressoTexto.textContent = window.PEIA.formatar("ens.progresso.muitas", {
          n: vistas,
          total: total
        });
      }
    }
  }

  function montarPlaylist() {
    if (!el.playlist) return;

    if (dados.config.playlistId) {
      el.playlist.href =
        "https://www.youtube.com/playlist?list=" + encodeURIComponent(dados.config.playlistId);
      el.playlist.hidden = false;
    } else if (dados.config.canalUrl) {
      el.playlist.href = dados.config.canalUrl;
      el.playlist.hidden = false;
    } else {
      el.playlist.hidden = true;
    }
  }

  /* ---------------------------------------------------------- Renderizar -- */

  function renderizarTudo() {
    montarFiltros();
    montarLista();
    montarPlaylist();
    atualizarProgresso();
    if (aulaAtual) {
      montarPlayer(aulaAtual);
      montarDetalhes(aulaAtual);
      marcarAtivaNaLista();
    }
  }

  function aulaInicial() {
    var alvo = (window.location.hash || "").replace("#", "");
    if (alvo && aulaPorId(alvo)) return alvo;

    var ultima = lerUltima();
    if (ultima && aulaPorId(ultima)) return ultima;

    return dados.aulas[0].id;
  }

  /* -------------------------------------------------------------- Início -- */

  function iniciar() {
    if (!el.lista || !el.player) return;

    fetch("dados/aulas.json", { cache: "no-cache" })
      .then(function (resposta) {
        if (!resposta.ok) throw new Error("HTTP " + resposta.status);
        return resposta.json();
      })
      .then(function (json) {
        dados = json;

        // Links do plano de ensino, quando presentes no HTML
        var plano = document.querySelector("[data-plano-ensino]");
        if (plano && dados.config.planoDeEnsino) {
          plano.setAttribute("data-href-pt", dados.config.planoDeEnsino.pt);
          plano.setAttribute("data-href-en", dados.config.planoDeEnsino.en);
          plano.setAttribute("href", dados.config.planoDeEnsino[idioma()]);
        }

        renderizarTudo();
        selecionar(aulaInicial(), false);

        if (el.busca) {
          el.busca.addEventListener("input", function () {
            termoBusca = el.busca.value;
            montarLista();
          });
        }

        document.addEventListener("peia:idioma", function () {
          renderizarTudo();
        });

        window.addEventListener("hashchange", function () {
          var alvo = (window.location.hash || "").replace("#", "");
          if (alvo && aulaPorId(alvo) && (!aulaAtual || alvo !== aulaAtual.id)) {
            selecionar(alvo, true);
          }
        });
      })
      .catch(function (erro) {
        el.lista.textContent = "";
        el.lista.appendChild(criar("li", "vazio-busca", t("ens.erro")));
        if (window.console) window.console.error("[PEIA-HPC]", erro);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
