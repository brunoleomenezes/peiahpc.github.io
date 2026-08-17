/* ==========================================================================
   PEIA-HPC — comportamento comum a todas as páginas
   Tema (claro/escuro), idioma (pt/en), navegação móvel e revelação em rolagem.
   ========================================================================== */

(function () {
  "use strict";

  var CHAVE_TEMA = "peia:tema";
  var CHAVE_IDIOMA = "peia:idioma";
  var IDIOMAS = ["pt", "en"];

  /* ---------------------------------------------------------------- Tema -- */

  function temaSalvo() {
    try {
      return localStorage.getItem(CHAVE_TEMA);
    } catch (e) {
      return null;
    }
  }

  function aplicarTema(tema) {
    if (tema === "claro" || tema === "escuro") {
      document.documentElement.setAttribute("data-tema", tema);
    } else {
      document.documentElement.removeAttribute("data-tema");
    }
    var botao = document.querySelector("[data-alternar-tema]");
    if (botao) {
      var escuroAtivo = temaEfetivoEscuro();
      botao.setAttribute("aria-pressed", String(escuroAtivo));
    }
  }

  function temaEfetivoEscuro() {
    var explicito = document.documentElement.getAttribute("data-tema");
    if (explicito === "escuro") return true;
    if (explicito === "claro") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function alternarTema() {
    var proximo = temaEfetivoEscuro() ? "claro" : "escuro";
    try {
      localStorage.setItem(CHAVE_TEMA, proximo);
    } catch (e) {
      /* modo privado: segue apenas na sessão */
    }
    aplicarTema(proximo);
  }

  /* ------------------------------------------------------------- Idioma -- */

  function idiomaInicial() {
    var url = new URLSearchParams(window.location.search).get("lang");
    if (IDIOMAS.indexOf(url) !== -1) return url;

    var salvo = null;
    try {
      salvo = localStorage.getItem(CHAVE_IDIOMA);
    } catch (e) {
      /* ignora */
    }
    if (IDIOMAS.indexOf(salvo) !== -1) return salvo;

    // Português é o idioma primário do projeto; inglês só para navegadores em inglês
    var navegador = (navigator.language || "pt-BR").toLowerCase();
    if (navegador.indexOf("en") === 0) return "en";
    return "pt";
  }

  var idiomaAtual = idiomaInicial();

  function t(chave) {
    var dicionario = window.PEIA_I18N[idiomaAtual] || {};
    if (Object.prototype.hasOwnProperty.call(dicionario, chave)) return dicionario[chave];
    var reserva = window.PEIA_I18N.pt || {};
    return Object.prototype.hasOwnProperty.call(reserva, chave) ? reserva[chave] : chave;
  }

  var ATRIBUTOS = ["placeholder", "aria-label", "title", "content", "alt"];

  function traduzir(raiz) {
    var escopo = raiz || document;

    escopo.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-i18n"));
    });

    escopo.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      el.innerHTML = t(el.getAttribute("data-i18n-html"));
    });

    ATRIBUTOS.forEach(function (attr) {
      escopo.querySelectorAll("[data-i18n-" + attr + "]").forEach(function (el) {
        el.setAttribute(attr, t(el.getAttribute("data-i18n-" + attr)));
      });
    });

    // Título do documento
    var meta = document.querySelector("[data-i18n-titulo]");
    if (meta) document.title = t(meta.getAttribute("data-i18n-titulo"));
  }

  function definirIdioma(idioma, silencioso) {
    if (IDIOMAS.indexOf(idioma) === -1) return;
    idiomaAtual = idioma;

    try {
      localStorage.setItem(CHAVE_IDIOMA, idioma);
    } catch (e) {
      /* ignora */
    }

    document.documentElement.setAttribute("lang", idioma === "pt" ? "pt-BR" : "en");

    document.querySelectorAll("[data-idioma]").forEach(function (botao) {
      botao.setAttribute("aria-pressed", String(botao.getAttribute("data-idioma") === idioma));
    });

    // Alterna href entre versões PT e EN de documentos do repositório
    document.querySelectorAll("[data-href-pt][data-href-en]").forEach(function (a) {
      a.setAttribute("href", a.getAttribute("data-href-" + idioma));
    });

    traduzir(document);

    if (!silencioso) {
      document.dispatchEvent(new CustomEvent("peia:idioma", { detail: { idioma: idioma } }));
    }
  }

  // Exposto para o script da área de ensino
  window.PEIA = {
    t: t,
    traduzir: traduzir,
    idioma: function () {
      return idiomaAtual;
    },
    formatar: function (chave, valores) {
      var texto = t(chave);
      Object.keys(valores || {}).forEach(function (k) {
        texto = texto.split("{" + k + "}").join(valores[k]);
      });
      return texto;
    }
  };

  /* --------------------------------------------------------- Navegação -- */

  function iniciarNavegacao() {
    var botao = document.querySelector("[data-abrir-menu]");
    var nav = document.querySelector("[data-nav]");
    if (!botao || !nav) return;

    botao.addEventListener("click", function () {
      var aberto = nav.classList.toggle("esta-aberto");
      botao.setAttribute("aria-expanded", String(aberto));
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("esta-aberto");
        botao.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("keydown", function (evento) {
      if (evento.key === "Escape" && nav.classList.contains("esta-aberto")) {
        nav.classList.remove("esta-aberto");
        botao.setAttribute("aria-expanded", "false");
        botao.focus();
      }
    });
  }

  function iniciarCabecalho() {
    var cabecalho = document.querySelector("[data-cabecalho]");
    if (!cabecalho) return;

    var marcar = function () {
      cabecalho.classList.toggle("esta-rolado", window.scrollY > 8);
    };
    marcar();
    window.addEventListener("scroll", marcar, { passive: true });
  }

  /* -------------------------------------------------------- Revelação -- */

  function iniciarRevelacao() {
    var alvos = document.querySelectorAll(".revelar");
    if (!alvos.length) return;

    if (!("IntersectionObserver" in window)) {
      alvos.forEach(function (el) {
        el.classList.add("esta-visivel");
      });
      return;
    }

    var observador = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (entrada) {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("esta-visivel");
            observador.unobserve(entrada.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 }
    );

    alvos.forEach(function (el) {
      observador.observe(el);
    });
  }

  /* ------------------------------------------------------------ Início -- */

  function iniciar() {
    aplicarTema(temaSalvo());

    var botaoTema = document.querySelector("[data-alternar-tema]");
    if (botaoTema) botaoTema.addEventListener("click", alternarTema);

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", function () {
        if (!temaSalvo()) aplicarTema(null);
      });

    document.querySelectorAll("[data-idioma]").forEach(function (botao) {
      botao.addEventListener("click", function () {
        definirIdioma(botao.getAttribute("data-idioma"));
      });
    });

    definirIdioma(idiomaAtual, true);
    iniciarNavegacao();
    iniciarCabecalho();
    iniciarRevelacao();

    document.dispatchEvent(new CustomEvent("peia:pronto", { detail: { idioma: idiomaAtual } }));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
