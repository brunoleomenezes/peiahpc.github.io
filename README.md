# peiahpc.github.io

Site institucional e **área de ensino** do projeto **PEIA-HPC** — Formação Nacional em Inteligência Artificial Aplicada e Computação Científica utilizando Infraestrutura HPC do SINAPAD.

🔗 **https://peiahpc.github.io**

O conteúdo didático (notebooks, plano de ensino, relatório técnico) vive no repositório principal: [brunoleomenezes/peia-hpc](https://github.com/brunoleomenezes/peia-hpc).

---

## Como publicar os vídeos das aulas

Todo o conteúdo da área de ensino é lido de um único arquivo: [`dados/aulas.json`](dados/aulas.json). **Não é preciso editar HTML, CSS ou JavaScript.**

### 1. Para ligar um vídeo a uma aula

Localize a aula pelo `id` (`s01` a `s20`, `c01`, `c02`) e preencha o campo `youtubeId` com o identificador do vídeo:

```jsonc
{
  "id": "s01",
  "youtubeId": "dQw4w9WgXcQ",   // ← só o ID, não a URL inteira
  ...
}
```

O ID é a parte depois de `v=` na URL do YouTube:

```
https://www.youtube.com/watch?v=dQw4w9WgXcQ
                                └────┬─────┘
                                  este trecho
```

Aulas com `youtubeId` vazio continuam funcionando normalmente: o site exibe o aviso **“Vídeo em breve”** e mantém o link para o notebook prático.

### 2. Para ligar a playlist completa

No topo do arquivo, preencha `config.playlistId` com o ID da playlist (começa com `PL`):

```jsonc
"config": {
  "playlistId": "PLxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  ...
}
```

Isso faz duas coisas: exibe o botão **“Ver playlist completa”** no topo da área de ensino e passa a abrir cada vídeo já dentro do contexto da playlist.

Se preferir divulgar o canal em vez de uma playlist, use `config.canalUrl` com a URL completa.

### 3. Publicar

Faça o commit do `dados/aulas.json` na branch que o GitHub Pages serve. O site atualiza sozinho.

---

## Estrutura

```
peiahpc.github.io/
├── index.html              Página inicial: projeto, curso, infraestrutura, professor
├── ensino.html             Área de ensino: player, trilha das 22 aulas, progresso
├── dados/
│   └── aulas.json          ← única fonte de conteúdo das aulas (PT e EN)
├── assets/
│   ├── css/estilo.css      Sistema visual derivado da identidade do projeto
│   ├── js/i18n.js          Dicionário bilíngue (todo o texto da interface)
│   ├── js/site.js          Tema, idioma, navegação
│   ├── js/ensino.js        Trilha do curso, player, busca, filtros, progresso
│   └── img/                Logotipo, símbolo e favicon
└── .nojekyll               Serve os arquivos como estão, sem processar com Jekyll
```

## Identidade visual

O sistema visual segue a [identidade do projeto](https://github.com/brunoleomenezes/peia-hpc/blob/main/identidade-visual/README.md), com a paleta Okabe-Ito *color-blind-safe*:

| Papel | Cor | Hex | Uso no site |
|---|---|---|---|
| Primária | Azul | `#0072B2` | Estrutura, links, botão principal |
| Secundária | Verde-azulado | `#009E73` | Nós da rede, selos, progresso |
| Acento | Âmbar | `#E69F00` | O ponto único de assimetria por seção |
| Neutros | Preto / Cinza | `#111111` / `#555555` | Texto e descritores |

As decisões de forma (curvatura predominante, simetria com um acento assimétrico, complexidade moderada) reproduzem as escolhas documentadas e fundamentadas na identidade do projeto.

## Recursos

- **Bilíngue PT/EN** com alternador que persiste a escolha; aceita também `?lang=pt` e `?lang=en` na URL. Os links para o repositório trocam automaticamente entre as versões PT e EN de cada documento.
- **Tema claro e escuro**, seguindo a preferência do sistema, com alternância manual.
- **Progresso do aluno** — aulas marcadas como assistidas ficam salvas no navegador.
- **Busca e filtro por fase** na trilha do curso; link direto para cada aula (ex.: `ensino.html#s07`).
- **Acessibilidade** — navegação por teclado, foco visível, `prefers-reduced-motion`, contraste WCAG 2.1 e conteúdo legível sem JavaScript.

## Desenvolvimento local

Qualquer servidor estático serve. A área de ensino carrega `dados/aulas.json` via `fetch`, então **não funciona abrindo o arquivo direto com `file://`**:

```bash
python3 -m http.server 8000
# depois abra http://localhost:8000
```

## Licença

Apache 2.0, mesma licença do repositório principal do projeto.

---

*Projeto PEIA-HPC · Proposta SINAPAD 249134 · Supercomputador Santos Dumont, LNCC/MCTI · FAETEC, Unidade Resende.*
