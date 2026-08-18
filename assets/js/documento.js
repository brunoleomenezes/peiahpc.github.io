/* ==========================================================================
   PEIA-HPC · páginas de documento
   Carrega o Markdown de documentos/, converte para HTML e monta o sumário.
   Cobre o subconjunto usado pelos documentos do projeto: títulos, parágrafos,
   listas, tabelas, blocos de código, citações, linhas divisórias e formatação
   em linha (negrito, itálico, código e links).
   ========================================================================== */

(function () {
  "use strict";

  var raiz = document.querySelector("[data-documento]");
  if (!raiz) return;

  var DOC = raiz.getAttribute("data-documento");
  var alvo = document.querySelector("[data-corpo]");
  var sumario = document.querySelector("[data-sumario]");

  /* ------------------------------------------------------------ Auxílios -- */

  function escapar(t) {
    return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // Mesmo algoritmo de âncora do GitHub, para os links internos seguirem válidos
  function ancora(texto) {
    return texto
      .toLowerCase()
      .replace(/<[^>]+>/g, "")
      .replace(/[^\p{L}\p{N}\s-]/gu, "")
      .trim()
      .replace(/\s+/g, "-");
  }

  function emLinha(txt) {
    var s = escapar(txt);

    // O código em linha sai de cena antes das demais regras, para que
    // asteriscos e colchetes dentro dele não sejam interpretados.
    var codigos = [];
    s = s.replace(/`([^`]+)`/g, function (m, c) {
      codigos.push(c);
      return "@@COD" + (codigos.length - 1) + "@@";
    });

    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (m, rotulo, url) {
      var externo = /^https?:/.test(url);
      return (
        '<a href="' + url + '"' +
        (externo ? ' target="_blank" rel="noopener noreferrer"' : "") +
        ">" + rotulo + "</a>"
      );
    });

    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");

    s = s.replace(/@@COD(\d+)@@/g, function (m, i) {
      return "<code>" + codigos[Number(i)] + "</code>";
    });
    return s;
  }

  /* ---------------------------------------------------------- Conversão -- */

  function converter(md) {
    var linhas = md.replace(/\r\n/g, "\n").split("\n");
    var saida = [];
    var buff = [];
    var i = 0;

    function paragrafo() {
      if (buff.length) saida.push("<p>" + emLinha(buff.join(" ")) + "</p>");
      buff = [];
    }

    while (i < linhas.length) {
      var l = linhas[i];

      // Bloco de código: nada dentro dele é interpretado
      var cerca = l.match(/^```(\w*)/);
      if (cerca) {
        paragrafo();
        var codigo = [];
        i++;
        while (i < linhas.length && !/^```/.test(linhas[i])) {
          codigo.push(linhas[i]);
          i++;
        }
        i++;
        saida.push(
          "<pre><code" + (cerca[1] ? ' class="linguagem-' + cerca[1] + '"' : "") +
          ">" + escapar(codigo.join("\n")) + "</code></pre>"
        );
        continue;
      }

      // Título
      var titulo = l.match(/^(#{1,6})\s+(.*)$/);
      if (titulo) {
        paragrafo();
        var nivel = titulo[1].length;
        var texto = titulo[2].replace(/\s*#+\s*$/, "");
        saida.push(
          "<h" + nivel + ' id="' + ancora(texto) + '">' + emLinha(texto) + "</h" + nivel + ">"
        );
        i++;
        continue;
      }

      // Linha divisória
      if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(l)) {
        paragrafo();
        saida.push("<hr>");
        i++;
        continue;
      }

      // Tabela (exige a linha de separação logo abaixo do cabeçalho)
      if (/^\s*\|/.test(l) && i + 1 < linhas.length &&
          /^\s*\|[\s:|-]+\|?\s*$/.test(linhas[i + 1])) {
        paragrafo();
        var celulas = function (linha) {
          return linha.trim().replace(/^\||\|$/g, "").split("|").map(function (c) {
            return c.trim();
          });
        };
        var cabecalho = celulas(l);
        i += 2;
        var corpo = [];
        while (i < linhas.length && /^\s*\|/.test(linhas[i])) {
          corpo.push(celulas(linhas[i]));
          i++;
        }
        var t = ['<div class="tabela-rolagem"><table><thead><tr>'];
        cabecalho.forEach(function (c) {
          t.push('<th scope="col">' + emLinha(c) + "</th>");
        });
        t.push("</tr></thead><tbody>");
        corpo.forEach(function (linha) {
          t.push("<tr>");
          linha.forEach(function (c) {
            t.push("<td>" + emLinha(c) + "</td>");
          });
          t.push("</tr>");
        });
        t.push("</tbody></table></div>");
        saida.push(t.join(""));
        continue;
      }

      // Citação
      if (/^>\s?/.test(l)) {
        paragrafo();
        var cita = [];
        while (i < linhas.length && /^>\s?/.test(linhas[i])) {
          cita.push(linhas[i].replace(/^>\s?/, ""));
          i++;
        }
        saida.push("<blockquote>" + converter(cita.join("\n")) + "</blockquote>");
        continue;
      }

      // Listas
      var marcador = /^\s*[-*+]\s+/.test(l);
      var numerada = /^\s*\d+\.\s+/.test(l);
      if (marcador || numerada) {
        paragrafo();
        var tag = marcador ? "ul" : "ol";
        var padrao = marcador ? /^\s*[-*+]\s+(.*)$/ : /^\s*\d+\.\s+(.*)$/;
        var itens = [];
        while (i < linhas.length) {
          var m = linhas[i].match(padrao);
          if (!m) break;
          var conteudo = [m[1]];
          i++;
          // Continuação recuada do mesmo item
          while (i < linhas.length && /^\s{2,}\S/.test(linhas[i]) &&
                 !/^\s*([-*+]|\d+\.)\s/.test(linhas[i])) {
            conteudo.push(linhas[i].trim());
            i++;
          }
          itens.push("<li>" + emLinha(conteudo.join(" ")) + "</li>");
        }
        saida.push("<" + tag + ">" + itens.join("") + "</" + tag + ">");
        continue;
      }

      // HTML solto (o bloco do logotipo, na identidade visual)
      if (/^\s*<(p|div|img|br|details|summary)/i.test(l)) {
        paragrafo();
        saida.push(l);
        i++;
        continue;
      }

      if (!l.trim()) {
        paragrafo();
        i++;
        continue;
      }

      buff.push(l.trim());
      i++;
    }

    paragrafo();
    return saida.join("\n");
  }

  /* ------------------------------------------------------------ Sumário -- */

  function montarSumario() {
    if (!sumario) return;
    sumario.textContent = "";
    var titulos = alvo.querySelectorAll("h2, h3");
    if (!titulos.length) return;

    var lista = document.createElement("ul");
    titulos.forEach(function (h) {
      var li = document.createElement("li");
      if (h.tagName === "H3") li.className = "sumario__sub";
      var a = document.createElement("a");
      a.href = "#" + h.id;
      a.textContent = h.textContent;
      li.appendChild(a);
      lista.appendChild(li);
    });
    sumario.appendChild(lista);
  }

  /* ------------------------------------------------------- Carregamento -- */

  function idioma() {
    return window.PEIA ? window.PEIA.idioma() : "pt";
  }

  function t(chave) {
    return window.PEIA ? window.PEIA.t(chave) : chave;
  }

  function carregar() {
    var arquivo = "documentos/" + DOC + "-" + idioma() + ".md";
    alvo.innerHTML = '<p class="documento__aviso">' + t("doc.carregando") + "</p>";

    fetch(arquivo, { cache: "no-cache" })
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.text();
      })
      .then(function (md) {
        // O título principal e a linha de idioma já aparecem no cabeçalho da página
        md = md.replace(/^#\s+.*$/m, "");
        md = md.replace(/^>.*(Idioma|Language).*$/m, "");
        alvo.innerHTML = converter(md);
        montarSumario();
        if (window.location.hash) {
          var destino = document.getElementById(
            decodeURIComponent(window.location.hash.slice(1))
          );
          if (destino) destino.scrollIntoView();
        }
      })
      .catch(function (erro) {
        alvo.innerHTML = '<p class="documento__aviso">' + t("doc.erro") + "</p>";
        if (window.console) window.console.error("[PEIA-HPC]", erro);
      });
  }

  document.addEventListener("peia:idioma", carregar);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", carregar);
  } else {
    carregar();
  }
})();
