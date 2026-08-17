/* ==========================================================================
   PEIA-HPC · dicionário bilíngue (pt / en)
   Uso no HTML:
     data-i18n="chave"            → define textContent
     data-i18n-html="chave"       → define innerHTML (para trechos com marcação)
     data-i18n-placeholder="..."  → define o atributo placeholder
     data-i18n-aria-label="..."   → define o atributo aria-label
     data-i18n-title="..."        → define o atributo title
     data-i18n-content="..."      → define o atributo content (meta tags)
   ========================================================================== */

window.PEIA_I18N = {
  pt: {
    /* --- Metadados e navegação ------------------------------------------ */
    "meta.titulo.index": "PEIA-HPC · Formação em IA aplicada e computação científica",
    "meta.desc.index":
      "Formação de 240 horas-aula em Inteligência Artificial Aplicada do Instituto de Inteligência Artificial do LNCC, com prática real no supercomputador Santos Dumont.",
    "meta.titulo.ensino": "Área de ensino · PEIA-HPC",
    "meta.desc.ensino":
      "Aulas em vídeo do curso de Inteligência Artificial Aplicada do PEIA-HPC: 20 semanas em cinco fases, com notebooks práticos executados no supercomputador SDumont.",

    "marca.descritor": "IA aplicada · Computação científica",
    "pular": "Pular para o conteúdo",

    "nav.projeto": "O projeto",
    "nav.curso": "O curso",
    "nav.infra": "Infraestrutura",
    "nav.ensino": "Área de ensino",
    "nav.professor": "Coordenação",
    "nav.abrirMenu": "Abrir menu de navegação",
    "nav.tema": "Alternar tema claro e escuro",
    "nav.idioma": "Idioma",
    "nav.novaAba": "abre em nova aba",

    /* --- Hero ------------------------------------------------------------ */
    "hero.selo.marca": "SINAPAD 249134",
    "hero.selo.texto": "Supercomputador Santos Dumont · LNCC/MCTI",
    "hero.titulo": "O supercomputador entra na <em>sala de aula</em>",
    "hero.sub":
      "O PEIA-HPC leva a infraestrutura nacional de computação de alto desempenho para o ensino técnico. O aluno não só usa ferramentas de IA: submete jobs, mede desempenho real de GPU e entende o que acontece por baixo do capô.",
    "hero.btn.aulas": "Entrar na área de ensino",
    "hero.btn.projeto": "Conhecer o projeto",
    "hero.cred.1": "Instituto de IA do LNCC",
    "hero.cred.2": "SDumont · SINAPAD",
    "hero.cred.3": "240 h/a · 20 semanas",
    "hero.legenda":
      "<strong>Asa-Nó</strong>: a asa do 14-Bis de Santos Dumont fundida a uma malha de nós de computação. Um único nó âmbar quebra a simetria e marca o ponto de inovação.",

    /* --- Indicadores ----------------------------------------------------- */
    "ind.1.r": "horas-aula presenciais",
    "ind.2.r": "semanas em cinco fases",
    "ind.3.r": "aulas com notebook prático",
    "ind.4.r": "GPUs V100 por nó, em NVLink",
    "ind.5.r": "eficiência de escala em 2 nós",

    /* --- O projeto ------------------------------------------------------- */
    "projeto.selo": "O projeto",
    "projeto.titulo": "Verticalizar, não acrescentar",
    "projeto.texto":
      "A formação em IA no ensino técnico brasileiro costuma parar no uso de ferramentas prontas. Aqui, cada tópico do currículo aponta para um modelo de IA, e o percurso desce em profundidade sobre o mesmo objeto, até o aluno rodar, medir e ajustar esse modelo em um supercomputador nacional.",
    "projeto.c1.t": "O mesmo objeto, duas profundidades",
    "projeto.c1.p":
      "A camada de HPC não é matéria nova no fim do curso. É o \"por baixo do capô\" de tudo que a turma já usa desde a primeira semana. Quando o currículo diz \"use este modelo\", o projeto pergunta: de onde ele veio, e podemos rodá-lo nós mesmos?",
    "projeto.c2.t": "Infraestrutura nacional de verdade",
    "projeto.c2.p":
      "As práticas rodam no Santos Dumont, o supercomputador Tier-0 do SINAPAD, no LNCC. Nada de simulador: submissão via Slurm, GPUs Tesla V100 em NVLink, armazenamento Lustre e rede InfiniBand. É o ambiente real da pesquisa científica.",
    "projeto.c3.t": "Aberto, auditável, reprodutível",
    "projeto.c3.p":
      "Todo o material é público sob Apache 2.0: notebooks, scripts de submissão, benchmarks e o relatório técnico de implantação. O registro dos erros tem valor didático equivalente ao dos acertos, e por isso também está documentado.",

    /* --- O curso --------------------------------------------------------- */
    "curso.selo": "O curso",
    "curso.titulo": "Inteligência Artificial Aplicada",
    "curso.texto":
      "Formação oferecida pelo Instituto de Inteligência Artificial do LNCC (IA-LNCC), no eixo de Informação e Comunicação. As 240 horas-aula se organizam em cinco fases, alinhando semana a semana cada tópico do currículo à sua camada de HPC correspondente.",

    "curso.fato.1.r": "Carga horária",
    "curso.fato.1.v": "240 horas-aula",
    "curso.fato.2.r": "Duração",
    "curso.fato.2.v": "20 semanas · 12 h/a por semana, em três encontros",
    "curso.fato.3.r": "Modalidade",
    "curso.fato.3.v": "Presencial · 40% teórica, 60% prática",
    "curso.fato.4.r": "Vagas",
    "curso.fato.4.v": "20, com mínimo de 10",
    "curso.fato.5.r": "Pré-requisitos",
    "curso.fato.5.v": "Idade mínima de 16 anos e Ensino Fundamental II completo",

    "curso.fases.titulo": "As cinco fases",
    "curso.btn.plano": "Ler o plano de ensino integrado",

    "fase.0.t": "Fundamentos e prontidão",
    "fase.0.p": "Terminal Linux, acesso remoto por VPN e SSH, e o primeiro job no escalonador de filas.",
    "fase.0.s": "Semanas 1–4",
    "fase.0.m": "Nível 0",
    "fase.1.t": "Ferramentas como inferência",
    "fase.1.p": "Do ChatGPT no navegador ao seu próprio modelo rodando como job na GPU do SDumont.",
    "fase.1.s": "Semanas 5–9",
    "fase.1.m": "Nível 1",
    "fase.2.t": "Geração multimídia e Slurm",
    "fase.2.p": "Imagem, vídeo e áudio como inferência; depuração, benchmark de throughput e higiene de cota.",
    "fase.2.s": "Semanas 10–14",
    "fase.2.m": "Slurm consolidado",
    "fase.3.t": "Treino, ajuste fino e escala",
    "fase.3.p": "Treinar em vez de só inferir: ajuste fino, escala forte e fraca, e os limites da alocação.",
    "fase.3.s": "Semanas 15–18",
    "fase.3.m": "Nível 2",
    "fase.4.t": "Culminância integrada",
    "fase.4.p": "Documentação reprodutível do experimento e apresentação do projeto final com dados reais medidos.",
    "fase.4.s": "Semanas 19–20",
    "fase.4.m": "Projeto integrado",

    /* --- Infraestrutura -------------------------------------------------- */
    "infra.selo": "Infraestrutura e resultados",
    "infra.titulo": "Medido dentro do cluster, não copiado da documentação",
    "infra.texto":
      "Toda especificação abaixo foi obtida dentro de jobs submetidos ao SDumont. Os benchmarks de comunicação e de treino são os mesmos que a turma reproduz nas Fases 2 e 3. É assim que o aluno aprende a ler um número de desempenho.",

    "infra.no.cap": "Nó de computação · partição sequana_gpu_dev",
    "infra.th.componente": "Componente",
    "infra.th.especificacao": "Especificação",
    "infra.no.1.r": "GPU",
    "infra.no.1.v": "4 × NVIDIA Tesla V100-SXM2, 32 GB cada",
    "infra.no.2.r": "Interconexão entre GPUs",
    "infra.no.2.v": "NVLink 2.0, dois enlaces por par, topologia all-to-all",
    "infra.no.3.r": "CPU",
    "infra.no.3.v": "48 núcleos, dois sockets, dois domínios NUMA",
    "infra.no.4.r": "Memória",
    "infra.no.4.v": "376 GB disponíveis",
    "infra.no.5.r": "Rede",
    "infra.no.5.v": "2 × Mellanox InfiniBand, com afinidade NUMA por par de GPUs",
    "infra.no.6.r": "Armazenamento",
    "infra.no.6.v": "/prj: 649 TB em NFS · /scratch: 1,4 PB em Lustre",

    "infra.nccl.cap": "All-reduce NCCL em um nó com 4 GPUs",
    "infra.th.mensagem": "Tamanho da mensagem",
    "infra.th.latencia": "Latência",
    "infra.th.banda": "Largura de banda de barramento",

    "infra.treino.cap": "Treino de modelo de 355 M parâmetros · DDP em fp16",
    "infra.th.config": "Configuração",
    "infra.th.gpus": "GPUs",
    "infra.th.tokens": "Tokens por segundo",
    "infra.th.passo": "Tempo de passo",
    "infra.th.eficiencia": "Eficiência de escala",
    "infra.treino.1.r": "1 nó",
    "infra.treino.1.e": "referência",
    "infra.treino.2.r": "2 nós",

    "infra.nota":
      "<strong>A eficiência de 94% em dois nós</strong> demonstra que a InfiniBand não constitui gargalo nessa escala. Os canais operam via P2P/CUMEM, confirmando uso efetivo do NVLink sem queda para PCIe. Pico de memória por GPU: 18,0 GB de 32 GB.",
    "infra.btn.relatorio": "Ler o relatório técnico completo",

    /* --- Chamada para a área de ensino ----------------------------------- */
    "teaser.selo": "Área de ensino",
    "teaser.titulo": "As aulas, semana a semana",
    "teaser.texto":
      "Cada uma das 20 semanas tem uma aula em vídeo e um notebook prático correspondente, além do módulo opcional de estudo de caso em duas partes. A trilha segue exatamente o plano de ensino integrado.",
    "teaser.btn": "Abrir a área de ensino",

    /* --- Coordenação ----------------------------------------------------- */
    "coord.selo": "Coordenação",
    "coord.titulo": "Quem conduz o projeto",
    "coord.texto":
      "O PEIA-HPC nasce do encontro entre a sala de aula do ensino técnico e a pesquisa em computação científica, e é coordenado pelas duas pontas dessa ponte.",

    "coord.b.papel": "Coordenação · FAETEC",
    "coord.b.nome": "Bruno Leonardo Santos Menezes",
    "coord.b.bio":
      "Professor da FAETEC e idealizador do PEIA-HPC. Responsável pela concepção do projeto, pela implantação do ambiente computacional no SDumont e pela produção do material didático do curso.",
    "coord.b.btn": "Página do professor",

    "coord.f.papel": "Coordenação · LNCC / MCTI",
    "coord.f.nome": "Fábio Porto",
    "coord.f.bio":
      "Pesquisador sênior do Laboratório Nacional de Computação Científica (LNCC), onde coordena o Data Extreme Lab (DEXL) e o Instituto de Inteligência Artificial do LNCC. Pesquisa na fronteira entre gerenciamento de dados, aprendizado de máquina e inteligência artificial.",
    "coord.f.detalhe":
      "Cátedra Internacional do INRIA (2024–2028) · Especialista do Global Partnership on AI (GPAI) · Membro da ACM e da SBC",

    "coord.btn.repo": "Ver o repositório do projeto",

    "apoio.nota":
      "O PEIA-HPC é uma formação do <strong>Instituto de Inteligência Artificial do LNCC (IA-LNCC)</strong>, realizada com recursos do <strong>Supercomputador Santos Dumont</strong>, do LNCC/MCTI, no âmbito do SINAPAD.",

    /* --- Chamada final --------------------------------------------------- */
    "cta.titulo": "Comece pela primeira aula",
    "cta.texto":
      "A trilha começa no terminal Linux e termina com o seu próprio experimento rodando em duas máquinas do supercomputador Santos Dumont. Todo o material é aberto.",
    "cta.btn1": "Ir para as aulas",
    "cta.btn2": "Ver no GitHub",

    /* --- Rodapé ---------------------------------------------------------- */
    "rodape.sobre":
      "Formação Nacional em Inteligência Artificial Aplicada e Computação Científica utilizando Infraestrutura HPC do SINAPAD. Proposta 249134, Supercomputador Santos Dumont, LNCC/MCTI.",
    "rodape.col1": "Navegação",
    "rodape.col2": "Material",
    "rodape.col3": "Instituições",
    "rodape.link.notebooks": "Notebooks das aulas",
    "rodape.link.plano": "Plano de ensino",
    "rodape.link.relatorio": "Relatório técnico",
    "rodape.link.identidade": "Identidade visual",
    "rodape.agradecimento":
      "Os experimentos e as atividades práticas deste projeto foram realizados com recursos do Supercomputador SDumont, do <strong>Laboratório Nacional de Computação Científica (LNCC/MCTI)</strong>. O PEIA-HPC é uma formação do <strong>Instituto de Inteligência Artificial do LNCC (IA-LNCC)</strong>, vinculada ao SINAPAD, coordenada em conjunto com o pesquisador <strong>Fábio Porto</strong>, a quem agradecemos, junto ao LNCC, pela colaboração que a viabilizou.",
    "rodape.licenca": "Conteúdo licenciado sob Apache 2.0",
    "rodape.direitos": "Projeto educacional e científico aberto",

    /* --- Área de ensino -------------------------------------------------- */
    "ens.hero.selo": "20 semanas · 5 fases · 22 aulas",
    "ens.hero.titulo": "Área de ensino",
    "ens.hero.sub":
      "Assista à aula da semana e siga com o notebook prático correspondente, executado no SDumont. A trilha reproduz o plano de ensino integrado, da primeira linha de terminal ao benchmark em dois nós.",

    "ens.nota":
      "<strong>Como acompanhar.</strong> Assista ao vídeo e depois abra o notebook da semana. A partir da Semana 4, todo comando pesado roda <strong>dentro de um job</strong>, nunca no nó de login. Os caminhos usam <code>$USER</code> e <code>/scratch/peia-hpc/$USER</code>.",

    "ens.playlist.btn": "Ver playlist completa",
    "ens.player.vazio.t": "Vídeo em breve",
    "ens.player.vazio.p":
      "Esta aula ainda não tem vídeo publicado. O notebook prático já está disponível abaixo e pode ser seguido normalmente.",

    "ens.trilha.titulo": "Trilha do curso",
    "ens.busca": "Buscar aula, tema ou comando…",
    "ens.busca.rotulo": "Buscar entre as aulas",
    "ens.filtro.todas": "Todas",
    "ens.filtros.rotulo": "Filtrar por fase",
    "ens.vazio": "Nenhuma aula corresponde à busca.",

    "ens.detalhe.curriculo": "Currículo do curso",
    "ens.detalhe.hpc": "Camada HPC",
    "ens.detalhe.pratica": "Prática no SDumont",
    "ens.detalhe.entregavel": "Entregável",

    "ens.btn.notebook": "Abrir o notebook da aula",
    "ens.btn.marcar": "Marcar como assistida",
    "ens.btn.desmarcar": "Marcada como assistida",
    "ens.btn.anterior": "Aula anterior",
    "ens.btn.proxima": "Próxima aula",

    "ens.progresso.zero": "Nenhuma aula concluída ainda",
    "ens.progresso.um": "1 de {total} aulas concluídas",
    "ens.progresso.muitas": "{n} de {total} aulas concluídas",
    "ens.contagem": "{n} aulas",
    "ens.carregando": "Carregando a trilha do curso…",
    "ens.erro":
      "Não foi possível carregar a trilha do curso. Recarregue a página ou consulte os notebooks diretamente no repositório."
  },

  en: {
    /* --- Metadata and navigation ----------------------------------------- */
    "meta.titulo.index": "PEIA-HPC · Applied AI and scientific computing education",
    "meta.desc.index":
      "A 240-hour Applied Artificial Intelligence programme from the LNCC Artificial Intelligence Institute, with real hands-on work on the Santos Dumont supercomputer.",
    "meta.titulo.ensino": "Learning area · PEIA-HPC",
    "meta.desc.ensino":
      "Video lessons from the PEIA-HPC Applied Artificial Intelligence course: 20 weeks in five phases, with hands-on notebooks run on the SDumont supercomputer.",

    "marca.descritor": "Applied AI · Scientific computing",
    "pular": "Skip to content",

    "nav.projeto": "The project",
    "nav.curso": "The course",
    "nav.infra": "Infrastructure",
    "nav.ensino": "Learning area",
    "nav.professor": "Coordination",
    "nav.abrirMenu": "Open navigation menu",
    "nav.tema": "Toggle light and dark theme",
    "nav.idioma": "Language",
    "nav.novaAba": "opens in a new tab",

    /* --- Hero ------------------------------------------------------------ */
    "hero.selo.marca": "SINAPAD 249134",
    "hero.selo.texto": "Santos Dumont Supercomputer · LNCC/MCTI",
    "hero.titulo": "The supercomputer walks into the <em>classroom</em>",
    "hero.sub":
      "PEIA-HPC brings Brazil's national high performance computing infrastructure into technical education. Students don't just use AI tools: they submit jobs, measure real GPU performance and understand what happens under the hood.",
    "hero.btn.aulas": "Enter the learning area",
    "hero.btn.projeto": "About the project",
    "hero.cred.1": "LNCC AI Institute",
    "hero.cred.2": "SDumont · SINAPAD",
    "hero.cred.3": "240 class hours · 20 weeks",
    "hero.legenda":
      "<strong>Wing-Node</strong>: the wing of Santos Dumont's 14-Bis fused with a mesh of compute nodes. A single amber node breaks the symmetry and marks the point of innovation.",

    /* --- Key figures ----------------------------------------------------- */
    "ind.1.r": "in-person class hours",
    "ind.2.r": "weeks across five phases",
    "ind.3.r": "lessons with a hands-on notebook",
    "ind.4.r": "V100 GPUs per node, on NVLink",
    "ind.5.r": "scaling efficiency across 2 nodes",

    /* --- The project ----------------------------------------------------- */
    "projeto.selo": "The project",
    "projeto.titulo": "Go deeper, don't bolt on",
    "projeto.texto":
      "AI education in Brazilian technical schools typically stops at using off-the-shelf tools. Here, every curriculum topic points to an AI model, and the course descends into the same object until students run, measure and fine-tune that model on a national supercomputer.",
    "projeto.c1.t": "One object, two depths",
    "projeto.c1.p":
      "The HPC layer is not new material tacked on at the end. It is the \"under the hood\" of everything the class has been using since week one. When the curriculum says \"use this model\", the project asks: where did it come from, and can we run it ourselves?",
    "projeto.c2.t": "Real national infrastructure",
    "projeto.c2.p":
      "Hands-on work runs on Santos Dumont, SINAPAD's Tier-0 supercomputer at LNCC. No simulators: Slurm job submission, Tesla V100 GPUs on NVLink, Lustre storage and InfiniBand networking. It is the real environment of scientific research.",
    "projeto.c3.t": "Open, auditable, reproducible",
    "projeto.c3.p":
      "All material is public under Apache 2.0: notebooks, submission scripts, benchmarks and the technical deployment report. Recording the failures carries as much teaching value as recording the successes, so those are documented too.",

    /* --- The course ------------------------------------------------------ */
    "curso.selo": "The course",
    "curso.titulo": "Applied Artificial Intelligence",
    "curso.texto":
      "A programme offered by the LNCC Artificial Intelligence Institute (IA-LNCC), in the Information and Communication axis. The 240 class hours are organized into five phases, aligning each curriculum topic, week by week, with its corresponding HPC layer.",

    "curso.fato.1.r": "Workload",
    "curso.fato.1.v": "240 class hours",
    "curso.fato.2.r": "Duration",
    "curso.fato.2.v": "20 weeks · 12 hours per week, across three sessions",
    "curso.fato.3.r": "Format",
    "curso.fato.3.v": "In person · 40% theory, 60% hands-on",
    "curso.fato.4.r": "Seats",
    "curso.fato.4.v": "20, minimum of 10",
    "curso.fato.5.r": "Prerequisites",
    "curso.fato.5.v": "Minimum age 16, lower secondary education completed",

    "curso.fases.titulo": "The five phases",
    "curso.btn.plano": "Read the integrated teaching plan",

    "fase.0.t": "Fundamentals and readiness",
    "fase.0.p": "Linux terminal, remote access over VPN and SSH, and the first job on the queue scheduler.",
    "fase.0.s": "Weeks 1–4",
    "fase.0.m": "Level 0",
    "fase.1.t": "Tools as inference",
    "fase.1.p": "From ChatGPT in the browser to your own model running as a job on an SDumont GPU.",
    "fase.1.s": "Weeks 5–9",
    "fase.1.m": "Level 1",
    "fase.2.t": "Multimedia generation and Slurm",
    "fase.2.p": "Image, video and audio as inference; debugging, throughput benchmarking and quota hygiene.",
    "fase.2.s": "Weeks 10–14",
    "fase.2.m": "Slurm consolidated",
    "fase.3.t": "Training, fine-tuning and scaling",
    "fase.3.p": "Training rather than only inferring: fine-tuning, strong and weak scaling, and allocation limits.",
    "fase.3.s": "Weeks 15–18",
    "fase.3.m": "Level 2",
    "fase.4.t": "Integrated capstone",
    "fase.4.p": "Reproducible documentation of the experiment and a final presentation with real measured data.",
    "fase.4.s": "Weeks 19–20",
    "fase.4.m": "Integrated project",

    /* --- Infrastructure -------------------------------------------------- */
    "infra.selo": "Infrastructure and results",
    "infra.titulo": "Measured inside the cluster, not copied from the docs",
    "infra.texto":
      "Every specification below was obtained inside jobs submitted to SDumont. The communication and training benchmarks are the same ones the class reproduces in Phases 2 and 3. That is how students learn to read a performance number.",

    "infra.no.cap": "Compute node · sequana_gpu_dev partition",
    "infra.th.componente": "Component",
    "infra.th.especificacao": "Specification",
    "infra.no.1.r": "GPU",
    "infra.no.1.v": "4 × NVIDIA Tesla V100-SXM2, 32 GB each",
    "infra.no.2.r": "GPU interconnect",
    "infra.no.2.v": "NVLink 2.0, two bonded links per pair, all-to-all topology",
    "infra.no.3.r": "CPU",
    "infra.no.3.v": "48 cores, dual socket, two NUMA domains",
    "infra.no.4.r": "Memory",
    "infra.no.4.v": "376 GB available",
    "infra.no.5.r": "Network",
    "infra.no.5.v": "2 × Mellanox InfiniBand, NUMA-affine to GPU pairs",
    "infra.no.6.r": "Storage",
    "infra.no.6.v": "/prj: 649 TB on NFS · /scratch: 1.4 PB on Lustre",

    "infra.nccl.cap": "NCCL all-reduce on a single 4-GPU node",
    "infra.th.mensagem": "Message size",
    "infra.th.latencia": "Latency",
    "infra.th.banda": "Bus bandwidth",

    "infra.treino.cap": "Training a 355 M parameter model · DDP in fp16",
    "infra.th.config": "Configuration",
    "infra.th.gpus": "GPUs",
    "infra.th.tokens": "Tokens per second",
    "infra.th.passo": "Step time",
    "infra.th.eficiencia": "Scaling efficiency",
    "infra.treino.1.r": "1 node",
    "infra.treino.1.e": "baseline",
    "infra.treino.2.r": "2 nodes",

    "infra.nota":
      "<strong>The 94% efficiency across two nodes</strong> shows that InfiniBand is not a bottleneck at this scale. All channels operate via P2P/CUMEM, confirming effective NVLink usage with no PCIe fallback. Peak memory per GPU: 18.0 GB out of 32 GB.",
    "infra.btn.relatorio": "Read the full technical report",

    /* --- Learning area teaser -------------------------------------------- */
    "teaser.selo": "Learning area",
    "teaser.titulo": "The lessons, week by week",
    "teaser.texto":
      "Each of the 20 weeks has a video lesson and a matching hands-on notebook, plus an optional two-part case study module. The track follows the integrated teaching plan exactly.",
    "teaser.btn": "Open the learning area",

    /* --- Coordination ---------------------------------------------------- */
    "coord.selo": "Coordination",
    "coord.titulo": "Who leads the project",
    "coord.texto":
      "PEIA-HPC grows out of the meeting between the technical-school classroom and scientific computing research, and it is coordinated from both ends of that bridge.",

    "coord.b.papel": "Coordination · FAETEC",
    "coord.b.nome": "Bruno Leonardo Santos Menezes",
    "coord.b.bio":
      "Teacher at FAETEC and originator of PEIA-HPC. Responsible for the project's design, for deploying the computing environment on SDumont and for producing the course's teaching material.",
    "coord.b.btn": "Instructor's page",

    "coord.f.papel": "Coordination · LNCC / MCTI",
    "coord.f.nome": "Fábio Porto",
    "coord.f.bio":
      "Senior researcher at the National Laboratory for Scientific Computing (LNCC), where he leads the Data Extreme Lab (DEXL) and the LNCC Artificial Intelligence Institute. His research sits at the frontier of data management, machine learning and artificial intelligence.",
    "coord.f.detalhe":
      "INRIA International Chair (2024–2028) · Expert at the Global Partnership on AI (GPAI) · Member of ACM and SBC",

    "coord.btn.repo": "See the project repository",

    "apoio.nota":
      "PEIA-HPC is a programme of the <strong>LNCC Artificial Intelligence Institute (IA-LNCC)</strong>, carried out with resources from the <strong>Santos Dumont Supercomputer</strong>, LNCC/MCTI, within SINAPAD.",

    /* --- Final call ------------------------------------------------------ */
    "cta.titulo": "Start with the first lesson",
    "cta.texto":
      "The track starts at the Linux terminal and ends with your own experiment running across two machines of the Santos Dumont supercomputer. All material is open.",
    "cta.btn1": "Go to the lessons",
    "cta.btn2": "View on GitHub",

    /* --- Footer ---------------------------------------------------------- */
    "rodape.sobre":
      "National Training in Applied Artificial Intelligence and Scientific Computing using SINAPAD's HPC Infrastructure. Proposal 249134, Santos Dumont Supercomputer, LNCC/MCTI.",
    "rodape.col1": "Navigation",
    "rodape.col2": "Material",
    "rodape.col3": "Institutions",
    "rodape.link.notebooks": "Course notebooks",
    "rodape.link.plano": "Teaching plan",
    "rodape.link.relatorio": "Technical report",
    "rodape.link.identidade": "Visual identity",
    "rodape.agradecimento":
      "The experiments and hands-on activities of this project were carried out using resources of the SDumont supercomputer, provided by the <strong>National Laboratory for Scientific Computing (LNCC/MCTI, Brazil)</strong>. PEIA-HPC is a programme of the <strong>LNCC Artificial Intelligence Institute (IA-LNCC)</strong>, affiliated with SINAPAD, co-coordinated by researcher <strong>Fábio Porto</strong>, whom we thank, together with LNCC, for the collaboration that made it possible.",
    "rodape.licenca": "Content licensed under Apache 2.0",
    "rodape.direitos": "Open educational and scientific project",

    /* --- Learning area --------------------------------------------------- */
    "ens.hero.selo": "20 weeks · 5 phases · 22 lessons",
    "ens.hero.titulo": "Learning area",
    "ens.hero.sub":
      "Watch the week's lesson and continue with the matching hands-on notebook, run on SDumont. The track mirrors the integrated teaching plan, from the first terminal line to the two-node benchmark.",

    "ens.nota":
      "<strong>How to follow along.</strong> Watch the video, then open the week's notebook. From Week 4 on, every heavy command runs <strong>inside a job</strong>, never on the login node. Paths use <code>$USER</code> and <code>/scratch/peia-hpc/$USER</code>.",

    "ens.playlist.btn": "View full playlist",
    "ens.player.vazio.t": "Video coming soon",
    "ens.player.vazio.p":
      "This lesson does not have a published video yet. The hands-on notebook is already available below and can be followed as usual.",

    "ens.trilha.titulo": "Course track",
    "ens.busca": "Search a lesson, topic or command…",
    "ens.busca.rotulo": "Search across the lessons",
    "ens.filtro.todas": "All",
    "ens.filtros.rotulo": "Filter by phase",
    "ens.vazio": "No lesson matches your search.",

    "ens.detalhe.curriculo": "Course curriculum",
    "ens.detalhe.hpc": "HPC layer",
    "ens.detalhe.pratica": "Practice on SDumont",
    "ens.detalhe.entregavel": "Deliverable",

    "ens.btn.notebook": "Open the lesson notebook",
    "ens.btn.marcar": "Mark as watched",
    "ens.btn.desmarcar": "Marked as watched",
    "ens.btn.anterior": "Previous lesson",
    "ens.btn.proxima": "Next lesson",

    "ens.progresso.zero": "No lessons completed yet",
    "ens.progresso.um": "1 of {total} lessons completed",
    "ens.progresso.muitas": "{n} of {total} lessons completed",
    "ens.contagem": "{n} lessons",
    "ens.carregando": "Loading the course track…",
    "ens.erro":
      "The course track could not be loaded. Reload the page or browse the notebooks directly in the repository."
  }
};
