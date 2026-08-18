# Plano de Ensino Integrado (Inteligência Artificial Aplicada e Computação de Alto Desempenho

> **🌐 Idioma / Language:** **🇧🇷 Português** · [🇺🇸 English](plano.html)

## Projeto PEIA-HPC · Formação do Instituto de IA do LNCC

**Autor:** Bruno Leonardo Santos Menezes
**Projeto:** PEIA-HPC (Formação Nacional em Inteligência Artificial Aplicada e Computação Científica utilizando Infraestrutura HPC do SINAPAD)
**Proposta SINAPAD:** 249134
**Infraestrutura de práticas:** Supercomputador Santos Dumont (SDumont), LNCC, Petrópolis-RJ
**Curso base:** Inteligência Artificial Aplicada) 240 h/a, 20 semanas, 12 h/a semanais, três encontros por semana
**Metodologia:** 40% teórica, 60% prática
**Vigência:** 2026, com término das atividades previsto para 17 de dezembro
**Licença deste material:** Apache 2.0 (código) / mesmo texto de licença para material didático

---

## Sumário

1. [Objetivo e escopo do documento](#1-objetivo-e-escopo-do-documento)
2. [Princípio pedagógico: verticalização, não adição](#2-princípio-pedagógico-verticalização-não-adição)
3. [Conformidade com o plano de curso aprovado](#3-conformidade-com-o-plano-de-curso-aprovado)
4. [Público, pré-requisitos e a ponte com o curso anterior](#4-público-pré-requisitos-e-a-ponte-com-o-curso-anterior)
5. [Arquitetura do curso: as cinco fases](#5-arquitetura-do-curso-as-cinco-fases)
6. [Escada de prontidão em HPC](#6-escada-de-prontidão-em-hpc)
7. [Cronograma detalhado semana a semana](#7-cronograma-detalhado-semana-a-semana)
8. [Objetivos de aprendizagem por fase](#8-objetivos-de-aprendizagem-por-fase)
9. [Níveis de proficiência](#9-níveis-de-proficiência)
10. [Rubrica de avaliação integrada](#10-rubrica-de-avaliação-integrada)
11. [Pré-requisitos operacionais e riscos](#11-pré-requisitos-operacionais-e-riscos)
12. [Anexos](#12-anexos)

---

## 1. Objetivo e escopo do documento

Este documento define o plano de ensino que integra, em uma única oferta de 240 horas-aula, o currículo aprovado de **Inteligência Artificial Aplicada** e a **camada de Computação de Alto Desempenho** do projeto PEIA-HPC, executada no Supercomputador SDumont.

O documento estabelece o cronograma semana a semana, os objetivos de aprendizagem por fase, os níveis de proficiência esperados e a rubrica de avaliação, tudo enquadrado dentro da estrutura curricular e dos instrumentos de avaliação já já previstos no plano de curso aprovado.

O escopo cobre a organização didática. As especificações técnicas do ambiente, os scripts de submissão e a metodologia dos benchmarks estão registrados no [relatório técnico de implantação](relatorio.html), referenciado ao longo deste texto e reproduzido de forma condensada no Anexo 12.3.

O documento é deliberadamente detalhado. Cada semana traz o tópico do currículo, a camada de HPC correspondente, a atividade prática no cluster e o entregável esperado, para que a oferta possa ser reproduzida por outro instrutor sem reconstrução mental do contexto.

---

## 2. Princípio pedagógico: verticalização, não adição

A decisão de projeto que organiza todo o restante do documento é a seguinte: **o currículo de ferramentas de IA e a camada de HPC não são dois conteúdos que competem pela carga horária: são o mesmo objeto conceitual em duas profundidades.**

Tratar os dois como blocos separados fracassa por aritmética. Se metade do curso vira "ferramentas" e a outra metade vira "supercomputação", nenhum dos dois cabe, e a camada de HPC chega tarde demais para uma turma de Ensino Fundamental II.

A alternativa é **verticalizar**. Cada tópico do currículo aprovado aponta para um modelo de IA. O percurso do aluno desce em profundidade sobre o mesmo objeto:

```
usa o ChatGPT (superfície)
   └─ descobre que aquilo é uma rede neural (Fundamentos)
        └─ vê essa rede rodar numa GPU do SDumont (demonstração)
             └─ submete o próprio job (Slurm)
                  └─ mede quão rápido ela processa (benchmark)
                       └─ ajusta um modelo pequeno (culminância)
```

A camada de HPC não é matéria nova acrescentada ao fim. É o "por baixo do capô" de tudo que a turma já usa desde a primeira semana. Toda vez que o currículo diz "use este modelo", a camada de HPC pergunta "de onde veio este modelo, e podemos rodá-lo, medi-lo e ajustá-lo nós mesmos?".

---

## 3. Conformidade com o plano de curso aprovado

O plano de curso é aprovado e **não pode ser reescrito**. Este plano de ensino não o reescreve.

A integração se sustenta em três pontos do próprio plano de curso aprovado:

- O plano exige **60% de carga prática**. Todo o HPC entra dentro desses 60%, como ambiente de prática.
- O plano define a metodologia como "análise e solução de problemas, estudo de casos, projetos, pesquisas e outras ações que integrem teoria e prática e focalize o contexto do trabalho". **O SDumont é esse ambiente de contexto real.**
- O plano prevê módulo de **Fundamentos da IA** (que já cita redes neurais e algoritmos de IA) e uma **Culminância** com projeto final. A camada de HPC é a realização concreta dos conceitos de Fundamentos e o substrato do projeto de Culminância.

Nada no plano de curso aprovado proíbe usar um supercomputador como laboratório. Os instrumentos de avaliação previstos (prova teórica de 4,0 pontos e prova prática de 6,0 pontos, com aprovação por média igual ou superior a 6,0 e frequência mínima de 75%) são preservados integralmente. A Seção 10 distribui esses mesmos pontos entre os dois eixos de conhecimento, sem criar nota nova.

---

## 4. Público, pré-requisitos e a ponte com o curso anterior

**Perfil da turma.** Idade mínima de 16 anos, Ensino Fundamental II completo, tendo concluído o curso de "Montador e Reparador de Computadores" ou equivalente. Turma de 10 a 20 alunos.

**O que a turma já tem.** O pré-requisito de "Montador e Reparador de Computadores" é um ativo pedagógico, não um detalhe burocrático. A turma já entende CPU, memória e GPU como componentes físicos: eles montaram uma máquina com as próprias mãos. O modelo mental de hardware já existe.

**A ponte a ser usada no primeiro dia.** O SDumont é a continuação natural desse modelo mental: "vocês montaram um PC; o SDumont é a partição `sequana_gpu_dev` com 60 nós, cada um com 4 das GPUs mais potentes que existem, ligadas entre si por NVLink." O aluno não parte do zero; parte de uma máquina que ele sabe montar, e a escala para 240 GPUs.

**O que a turma ainda não tem.** Terminal Linux, acesso remoto e Python. Essa é a lacuna real, e ela exige uma pista de decolagem (Seção 6) antes de qualquer submissão de job. Antecipar HPC sem essa pista transforma o primeiro job em frustração.

---

## 5. Arquitetura do curso: as cinco fases

As 20 semanas se organizam em cinco fases. Cada fase alinha um bloco do currículo do curso a uma profundidade correspondente de HPC.

| Fase | Semanas | Eixo do currículo do curso | Camada de HPC | Marco |
|---|---|---|---|---|
| 0 | 1–4 | Fundamentos da IA; primeiros prompts | Prontidão: terminal, SSH, primeiro job | Nível 0 (todos) |
| 1 | 5–9 | ChatGPT: produtividade, negócios, marketing | Inferência: rodar um modelo próprio | Nível 1 (maioria) |
| 2 | 10–14 | Geração de imagem, vídeo, áudio, sites, apps | Slurm consolidado; primeiro benchmark | Slurm proficiente |
| 3 | 15–18 | Solidificação; planejamento do projeto | Treino, ajuste fino, escala forte/fraca | Nível 2 (equipes) |
| 4 | 19–20 | Culminância: execução e apresentação | Documentação do experimento; dados de desempenho | Projeto integrado |

A distribuição de semanas por fase é 4 + 5 + 5 + 4 + 2 = 20.

---

## 6. Escada de prontidão em HPC

A competência de HPC é construída em degraus, em ordem obrigatória. Cada degrau pressupõe o anterior. Os primeiros degraus entram já na Fase 0, em paralelo aos Fundamentos de IA; os degraus superiores só se sustentam depois que os inferiores estão firmes.

| Degrau | Competência | Onde entra |
|---|---|---|
| 1 | Terminal e sistema de arquivos Linux | Fase 0, semanas 1–2 |
| 2 | Acesso remoto: VPN e SSH | Fase 0, semanas 2–3 |
| 3 | Módulos de ambiente e ambiente virtual Python (`venv`) | Fase 1, semanas 5–6 |
| 4 | Slurm: `sbatch`, `srun`, `squeue`, `sacct`, partição, pedido de recursos | Fase 0 semana 4, consolidado na Fase 2 |
| 5 | GPU: `nvidia-smi`, VRAM, ocupação, throughput | Fase 1–2 |
| 6 | Paralelismo e escala: escala forte e fraca, DDP | Fase 3 |

**Regra de sequência.** O primeiro job real (degrau 4) só é submetido depois que SSH (degrau 2) está funcionando. A construção de ambiente (degrau 3) precede qualquer inferência. O paralelismo (degrau 6) é o último e é reservado às equipes que chegarem prontas.

---

## 7. Cronograma detalhado semana a semana

Cada semana dispõe de 12 h/a, distribuídas em três encontros de 4 h/a, com aproximadamente 5 h/a teóricas e 7 h/a práticas, respeitando a proporção 40/60 do plano de curso aprovado.

Nas colunas: **Currículo do curso** é o tópico do plano aprovado; **Camada HPC** é a descida em profundidade sobre o mesmo objeto; **Prática no SDumont** é a atividade no cluster; **Entregável** é a evidência avaliável.

### 7.1 Fase 0: Fundamentos e prontidão (semanas 1 a 4)

**Semana 1**
- **Currículo do curso:** apresentação do curso; história da IA; o que é Inteligência Artificial e sua importância atual; distinção entre IA, Machine Learning e Deep Learning.
- **Camada HPC:** por que computação importa; o que é um supercomputador; apresentação do SINAPAD, do LNCC e do projeto PEIA-HPC. A ponte com "Montador e Reparador": do componente físico ao nó, do nó ao cluster.
- **Prática no SDumont:** ainda em ambiente local. Terminal Linux: navegação, criação e manipulação de diretórios e arquivos, permissões básicas.
- **Entregável:** roteiro de terminal concluído (montar uma árvore de diretórios, copiar, mover, listar).

**Semana 2**
- **Currículo do curso:** conceitos de aprendizado de máquina, redes neurais e algoritmos de IA, em nível conceitual; introdução aos conceitos de prompt e chatbot.
- **Camada HPC:** anatomia de um nó de GPU; o que a GPU faz de diferente da CPU; NVLink como "os componentes conversando entre si". Conceito de acesso remoto: o que são SSH e VPN.
- **Prática no SDumont:** conclusão do terminal (redirecionamento, pipes, edição com `nano`); preparação da estação: instalação e configuração do cliente VPN, com ajuste de MTU para 1300 (ver relatório técnico).
- **Entregável:** estação com VPN configurada e testada; roteiro de terminal finalizado.

**Semana 3**
- **Currículo do curso:** introdução ao ChatGPT: o que é, pré-requisitos, criação de conta, visão prática, primeiras tarefas de criação de prompts.
- **Camada HPC:** o que é um escalonador de filas (a fila do banco como analogia); conceitos de job, partição e recurso; a diferença entre `/prj` (home, NFS) e `/scratch` (Lustre).
- **Prática no SDumont:** **primeiro login supervisionado via SSH**; exploração do banner, do prompt e do sistema de arquivos; configuração do `~/.ssh/config` persistente.
- **Entregável:** sessão SSH bem-sucedida registrada; aluno localiza seu diretório em `/scratch/peia-hpc/$USER`.

**Semana 4**
- **Currículo do curso:** tarefas práticas de criação de prompts; consolidação dos fundamentos.
- **Camada HPC:** o primeiro job: a diretiva `#SBATCH`, os comandos `sbatch`, `squeue` e `sacct`; a disciplina de **nunca rodar carga no nó de login**, usando o erro documentado no relatório como lição de método.
- **Prática no SDumont:** submissão do `teste-gpu.sh` (imprime `hostname`, `nproc`, `free -g` e `nvidia-smi` dentro de um job); leitura da saída em `logs/`.
- **Entregável:** primeiro job com estado `COMPLETED`; arquivo de saída interpretado (identificar o nó alocado e as 4 GPUs V100).
- **Marco: Nível 0 atingido por toda a turma.**

### 7.2 Fase 1 (Ferramentas como inferência (semanas 5 a 9)

**Semana 5**
- **Currículo do curso:** ChatGPT otimizando tarefas do dia a dia) pesquisas completas, escrita de conteúdos diversos, resumos, traduções, organização de dados.
- **Camada HPC:** o conceito de **inferência**: rodar um modelo já treinado. O que separa "usar o ChatGPT no navegador" de "rodar um modelo você mesmo".
- **Prática no SDumont:** módulos de ambiente (`module load anaconda3/2024.02_sequana`); criação de um `venv` em `/scratch`; conceito de ambiente isolado.
- **Entregável:** ambiente `venv` criado e ativado dentro de um job; `python --version` confirmando Python 3.11.

**Semana 6**
- **Currículo do curso:** ChatGPT para o dia a dia: resolução de problemas, resumo de vídeos, redação de e-mails, criação de tabelas e planilhas.
- **Camada HPC:** instalação de pacotes; a restrição do índice `cu126` (por que as V100, arquitetura Volta `sm_70`, exigem CUDA 12.6); validação do `torch.cuda`.
- **Prática no SDumont:** `pip install torch --index-url .../cu126` e demais requisitos; submissão do `valida-torch.sh`; verificação de que `torch.cuda.is_available()` é verdadeiro e que `torch.cuda.get_arch_list()` contém `sm_70`.
- **Entregável:** pilha de software validada; job que imprime a versão do PyTorch, a disponibilidade de CUDA e a lista de arquiteturas.

**Semana 7**
- **Currículo do curso:** ChatGPT para negócios, empreendedorismo e empregos: prompts profissionais, produção de currículo, e-mail para potencial empregador.
- **Camada HPC:** rodar um modelo de linguagem aberto e pequeno em modo inferência, como job; leitura do `nvidia-smi` durante a execução (uso de GPU e de memória).
- **Prática no SDumont:** job que carrega um modelo pequeno via Transformers e gera texto; comparação da saída com a do ChatGPT no navegador.
- **Entregável:** saída de inferência do cluster acompanhada de comparação escrita com a ferramenta web.

**Semana 8**
- **Currículo do curso:** ChatGPT para produtividade pessoal e profissional: leitura de livros, extração de informações, apoio à tomada de decisão.
- **Camada HPC:** leitura aprofundada do `nvidia-smi`; o que é VRAM, ocupação e throughput; primeira noção de "quanto custa" rodar um modelo.
- **Prática no SDumont:** medição do tempo de geração com e sem GPU (CPU versus GPU) para o mesmo modelo pequeno.
- **Entregável:** tabela comparativa CPU versus GPU (tempo e itens por segundo).

**Semana 9**
- **Currículo do curso:** ChatGPT para criação de conteúdo de marketing: copywriting, artigos, scripts de vídeo, títulos e chamadas.
- **Camada HPC:** consolidação da Fase 1; conceito de reprodutibilidade: por que registrar comandos e versões, à maneira do relatório técnico.
- **Prática no SDumont:** cada aluno escreve, do zero, um script `sbatch` próprio para uma tarefa de inferência.
- **Entregável:** script `sbatch` autoral com sua saída.
- **Marco: Nível 1 atingido pela maioria da turma.**

### 7.3 Fase 2: Geração multimídia e Slurm de verdade (semanas 10 a 14)

**Semana 10**
- **Currículo do curso:** geração de textos e apresentações; geração de imagens (abordagem das principais ferramentas).
- **Camada HPC:** geração de imagem é inferência de um modelo de difusão; rodar um modelo de imagem como job em lote.
- **Prática no SDumont:** job de geração de imagem no cluster; artefatos salvos em `/scratch`, resultado final movido para `/prj`.
- **Entregável:** imagem gerada no cluster e o script correspondente; distinção `/scratch` versus `/prj` aplicada na prática.

**Semana 11**
- **Currículo do curso:** geração de vídeos; geração de conteúdo para redes sociais.
- **Camada HPC:** pipelines mais pesados; leitura de logs de erro e depuração (arquivo não encontrado, propagação de metadados em NFS, lições do relatório).
- **Prática no SDumont:** depuração guiada de um job que falha de propósito (caminho incorreto, módulo ausente); diagnóstico e correção.
- **Entregável:** relato curto de depuração no formato erro → diagnóstico → correção, no estilo do relatório técnico.

**Semana 12**
- **Currículo do curso:** geração de narração e dublagem; conversor de áudio e texto.
- **Camada HPC:** modelos de áudio como inferência; o conceito de benchmark de throughput: o que significa medir itens ou tokens por segundo, com aquecimento (warmup) e sincronização de CUDA.
- **Prática no SDumont:** execução de um benchmark e coleta de throughput de um modelo, com passos de aquecimento antes da medição.
- **Entregável:** primeiro benchmark de throughput autoral, com metodologia descrita (warmup e medição).

**Semana 13**
- **Currículo do curso:** criação de sites; gerador de animações; automações diversas.
- **Camada HPC:** eficiência e higiene de cota: por que solicitar sempre `--gres=gpu:4` (a cobrança é por nó cheio, `billing=48`); por que nunca usar o nó de login.
- **Prática no SDumont:** exercício de dimensionamento: estimar as horas de GPU necessárias para uma tarefa a partir do throughput medido.
- **Entregável:** estimativa de custo em horas de GPU, com a base de cálculo explicitada.

**Semana 14**
- **Currículo do curso:** criação de aplicativos; designer e marketing (fechamento do bloco de ferramentas).
- **Camada HPC:** consolidação do Slurm; revisão para a avaliação teórica de conceitos de HPC.
- **Prática no SDumont:** mini-projeto de meio de curso: um pipeline de inferência completo, submetido e documentado.
- **Entregável:** mini-projeto documentado.
- **Marco: Slurm consolidado.**

### 7.4 Fase 3: Treino, ajuste fino e escala (semanas 15 a 18)

Esta fase concentra o conteúdo denso de HPC e corresponde ao **Nível 2**. É desenvolvida em equipes, e sua profundidade se ajusta ao preparo de cada grupo.

**Semana 15**
- **Currículo do curso:** solidificação dos conhecimentos em geral; revisão de todos os itens.
- **Camada HPC:** o que é **treinar** um modelo, em contraste com inferir; a noção de custo computacional (aproximadamente 6ND); por que o treino é caro. Dados sintéticos versus dados reais.
- **Prática no SDumont:** execução do `bench-train.py` em 1 nó com 4 GPUs; observação do throughput (da ordem de 40.967 tokens/s no experimento de referência) e do pico de VRAM (18 GB de 32 GB).
- **Entregável:** resultado do treino em nó único, interpretado.

**Semana 16**
- **Currículo do curso:** planejamento do projeto de término do curso; descrição do escopo do projeto.
- **Camada HPC:** **ajuste fino**: adaptar um modelo pré-treinado a dados próprios; a diferença entre treinar do zero e fazer fine-tuning.
- **Prática no SDumont:** ajuste fino de um modelo pequeno com um conjunto de dados pequeno da própria equipe.
- **Entregável:** modelo ajustado e comparação qualitativa antes/depois.

**Semana 17**
- **Currículo do curso:** execução do projeto final (início).
- **Camada HPC:** **paralelismo e escala**: escala forte versus escala fraca; execução do benchmark em 2 nós; cálculo da eficiência de escala (94% no experimento de referência) e a constatação de que a InfiniBand não é gargalo nessa escala.
- **Prática no SDumont:** benchmark comparando 1 nó e 2 nós; cálculo da eficiência de escala.
- **Entregável:** tabela de escala com a eficiência calculada, no formato do relatório técnico.

**Semana 18**
- **Currículo do curso:** execução do projeto final (continuação).
- **Camada HPC:** os limites da alocação educacional (walltime de 20 minutos, `MaxSubmit=1`) e suas implicações para o projeto; quando solicitar aumento de cota; por que o DDP puro deixa de caber em 32 GB acima de cerca de 1 bilhão de parâmetros, exigindo ZeRO ou FSDP.
- **Prática no SDumont:** integração do componente de HPC ao projeto de cada equipe.
- **Entregável:** componente de HPC do projeto em funcionamento.
- **Marco: Nível 2 atingido pelas equipes preparadas.**

### 7.5 Fase 4: Culminância integrada (semanas 19 a 20)

**Semana 19**
- **Currículo do curso:** execução do Projeto Final; preparação da apresentação.
- **Camada HPC:** documentação do experimento no estilo do relatório técnico: comandos, saídas, medições e o que falhou.
- **Prática no SDumont:** finalização do experimento; redação da documentação do componente de HPC.
- **Entregável:** projeto final completo, com documentação de HPC (job submetido, medição realizada e análise).

**Semana 20**
- **Currículo do curso:** apresentação do Projeto Final.
- **Camada HPC:** a apresentação inclui os dados de desempenho reais medidos pela equipe.
- **Prática no SDumont:** apresentações; avaliação em Conselho de Classe dos aspectos formativos.
- **Entregável:** apresentação realizada; nota final integrada consolidada; o material produzido passa a compor o repositório do projeto (pastas `curso/` e `notebooks/`).

### 7.6 Estudo de caso: Ablação do filtro de variante (extensão pós-Fase 4, opcional)

Módulo especial de duas partes, fora do cronograma obrigatório das 20 semanas. Destina-se às equipes que atingirem o Nível 2 antes do fim da Fase 4 e às turmas que dispuserem de encontros adicionais. Notebooks em `notebooks/estudo-de-caso-ablacao/`.

**Caso 01 (O filtro de variante: um bug de substring que reescreve o corpus**
- **Currículo do curso:** execução e documentação do Projeto Final; leitura crítica de resultados de IA) o que um número diz e o que ele não diz.
- **Camada HPC:** curadoria de corpus para pré-treino; o Estágio 2 (filtro de variante PT-BR/PT-PT) e a diferença entre casamento por substring e por fronteira de palavra; desenho de uma ablação de fator único; orçamento igual de tokens; descontaminação por 13-gramas contra ENEM, BLUEX, OAB e ASSIN2.
- **Prática no SDumont:** clonar o experimento no `/scratch`, reproduzir a divergência entre os dois classificadores no nó de login, construir um pool piloto (nó de login, precisa de internet) e medir a taxa de retenção em um job de CPU na `sequana_cpu_dev`.
- **Entregável:** tabela de divergência (legado × corrigido) e tabela de retenção do pool piloto, com a interpretação do que o filtro realmente separa: registro formal, não variante linguística.

**Caso 02: Treinar os três braços em janelas de 20 minutos e ler o resultado**
- **Currículo do curso:** execução, documentação e apresentação do Projeto Final; honestidade metodológica ao relatar resultados.
- **Camada HPC:** pré-treino do zero de três modelos de ~153 M de parâmetros com retomada por checkpoint em janelas de 20 minutos; a cadeia manual imposta por `MaxJobs=1`/`MaxSubmit=1`; avaliação offline; leitura de relatório comparativo com intervalo de confiança bootstrap, teste pareado de McNemar e linha do acaso.
- **Prática no SDumont:** submeter os três braços um a um na `sequana_gpu_dev` com `--gres=gpu:4`, ler `status.json`, retomar dentro de um `screen` no nó de login, avaliar e gerar o relatório comparativo.
- **Entregável:** tabela comparativa dos três braços (perplexidade nos conjuntos retidos e acurácia nos benchmarks) com a linha do acaso marcada, e uma conclusão que declara o que os dados sustentam e o que não sustentam.

---

## 8. Objetivos de aprendizagem por fase

Os objetivos são redigidos como capacidades verificáveis. Cada fase declara o que o aluno passa a ser capaz de fazer, nos dois eixos.

**Fase 0: Fundamentos e prontidão.** Ao final, o aluno é capaz de: distinguir IA, Machine Learning e Deep Learning e explicar o papel das redes neurais; operar o terminal Linux para tarefas de arquivo e navegação; estabelecer uma conexão remota ao SDumont via VPN e SSH; e submeter um job simples ao escalonador, interpretando sua saída.

**Fase 1: Ferramentas como inferência.** Ao final, o aluno é capaz de: empregar ferramentas de IA generativa em tarefas de produtividade, negócios e marketing; construir um ambiente Python isolado no cluster e validar a pilha de software; executar um modelo aberto em modo inferência como job; e ler o `nvidia-smi` para descrever o uso de GPU e de memória.

**Fase 2: Geração multimídia e Slurm.** Ao final, o aluno é capaz de: utilizar ferramentas de geração de imagem, vídeo e áudio; escrever scripts de submissão do zero e gerenciar dados entre `/scratch` e `/prj`; diagnosticar e corrigir falhas de job a partir dos logs; e medir o throughput de um modelo com metodologia reprodutível.

**Fase 3: Treino, ajuste fino e escala.** Ao final, a equipe é capaz de: explicar a diferença entre treinar e inferir e a origem do custo computacional do treino; realizar o ajuste fino de um modelo pequeno com dados próprios; executar um benchmark distribuído e calcular a eficiência de escala; e justificar as escolhas de recurso à luz dos limites da alocação.

**Fase 4: Culminância integrada.** Ao final, a equipe é capaz de: conceber e executar um projeto que integra o uso de ferramentas de IA a um experimento real de HPC; documentar o experimento com rigor de reprodutibilidade; e apresentar os resultados sustentados por dados de desempenho medidos.

---

## 9. Níveis de proficiência

A turma é heterogênea. A camada de HPC é inclusiva na base e profunda no topo, organizada em três níveis.

| Nível | Descrição | Corresponde a |
|---|---|---|
| **Nível 0** | Acessar o SDumont, submeter um job simples, rodar uma inferência e ler a saída. | Piso do curso. Exigido de todos os alunos. |
| **Nível 1** | Montar o ambiente, rodar um benchmark e interpretar `nvidia-smi` e o throughput. | Esperado da maioria. Nota plena no critério prático de operação. |
| **Nível 2** | Ajustar um modelo pequeno, executar benchmark distribuído e analisar a escala. | Equipes de culminância mais preparadas. Distinção no projeto final. |

O Nível 0 é o piso para aprovação: todo aluno precisa alcançá-lo. O Nível 1 corresponde à nota plena no critério P2 da rubrica. O Nível 2 corresponde à nota plena, com distinção, no critério P3.

---

## 10. Rubrica de avaliação integrada

A avaliação preserva integralmente os instrumentos e os totais do plano de curso aprovado: prova teórica de 4,0 pontos e prova prática de 6,0 pontos, totalizando 10,0. A aprovação exige média igual ou superior a **6,0** e frequência mínima de **75%**. A rubrica apenas distribui esses mesmos pontos entre os dois eixos de conhecimento.

### 10.1 Distribuição dos pontos

| Instrumento | Critério | Peso |
|---|---|---|
| **Teórica (4,0)** | **T1.** Fundamentos de IA: IA/ML/DL, redes neurais, algoritmos | 2,0 |
| | **T2.** Fundamentos de HPC: CPU versus GPU, paralelismo, escalonador de filas, escala forte e fraca | 2,0 |
| **Prática (6,0)** | **P1.** Portfólio de ferramentas de IA: geração de texto, imagem, vídeo, áudio e aplicações | 2,0 |
| | **P2.** Operação do ambiente de HPC: acesso, ambiente, submissão de job, leitura de `nvidia-smi`, benchmark | 2,0 |
| | **P3.** Projeto final integrado: com componente de HPC documentado e apresentado | 2,0 |
| | **Total** | **10,0** |

### 10.2 Descritores de desempenho: critério P2 (operação do ambiente de HPC)

| Nível de desempenho | Descrição | Pontos |
|---|---|---|
| Insuficiente | Não estabelece acesso ao cluster nem submete job de forma autônoma. | 0,0 |
| Básico | Acessa o cluster e submete um job simples com apoio; lê a saída com auxílio. | 0,5–1,0 |
| Proficiente | Constrói o ambiente, submete jobs próprios e interpreta `nvidia-smi` e throughput sem apoio. | 1,5 |
| Avançado | Depura falhas a partir dos logs, aplica boas práticas de cota e documenta a metodologia. | 2,0 |

O critério P2 mapeia diretamente os Níveis 0 e 1 da Seção 9.

### 10.3 Descritores de desempenho: critério P3 (projeto final integrado)

| Nível de desempenho | Descrição | Pontos |
|---|---|---|
| Insuficiente | Projeto sem componente de HPC, ou não apresentado. | 0,0 |
| Básico | Projeto usa ferramentas de IA e inclui uma execução simples no cluster, sem medição. | 0,5–1,0 |
| Proficiente | Projeto integra inferência no cluster com uma medição de desempenho documentada. | 1,5 |
| Avançado | Projeto inclui ajuste fino ou análise de escala, documentado no rigor do relatório técnico. | 2,0 |

O critério P3 mapeia os Níveis 1 e 2 da Seção 9. O desempenho Avançado corresponde à distinção do Nível 2.

### 10.4 Observações sobre a avaliação

A avaliação formativa em Conselho de Classe, prevista no plano de curso aprovado, considera a progressão do aluno na escada de prontidão (Seção 6), e não apenas o resultado final. O registro em Diário de Classe acompanha a frequência por hora-aula, conforme o plano.

---

## 11. Pré-requisitos operacionais e riscos

Três dependências podem inviabilizar a oferta se não forem tratadas cedo. Estão listadas em ordem de criticidade.

**Risco 1: Provisionamento de acesso dos alunos (bloqueio nº 1).** O formulário do SINAPAD registra apenas o coordenador como participante. Os 10 a 20 alunos precisam de contas e perfis de VPN no SDumont. Trata-se de pendência administrativa junto ao Helpdesk do LNCC, que **precisa estar resolvida antes das atividades de cluster da Fase 0**. Recomenda-se avaliar também um modelo de acesso supervisionado, com a turma em sessão conjunta, para reduzir a superfície de problema no início.

**Risco 2: A alocação educacional é de jobs curtos.** O relatório técnico registra teto de 20 minutos de walltime e `MaxSubmit=1`, o que impede treino longo e cadeias de checkpoint. Isso é adequado para sala de aula, pois favorece ciclos rápidos de feedback. As práticas são desenhadas em torno de benchmark, inferência e ajuste fino curto. Caso a Culminância exija rodadas maiores, deve-se solicitar ao LNCC um aumento de cota para essa janela específica: é uma alteração administrativa de cota, não de configuração de fila.

**Risco 3: Disciplina de nó de login e etiqueta de cota.** Deve ser ensinada explicitamente: "nunca rode carga no nó de login" e "solicite sempre `--gres=gpu:4`, porque a cobrança é por nó cheio de qualquer modo". O próprio erro documentado no relatório (medição feita no nó de login por engano) é material didático sobre uso responsável, que é objetivo declarado do projeto.

**Risco 4: Lacuna de competência de entrada.** A turma não domina terminal, acesso remoto nem Python. A mitigação é a escada de prontidão da Seção 6: os degraus de terminal e acesso remoto precedem qualquer submissão de job. Não antecipar HPC.

---

## 12. Anexos

### 12.1 Referência rápida de comandos Slurm

| Comando | Função |
|---|---|
| `sbatch script.sh` | Submete um job em lote |
| `squeue -u $USER` | Lista os jobs do usuário na fila |
| `sacct -j <id>` | Contabiliza um job concluído |
| `scontrol show partition <nome>` | Detalha a configuração de uma partição |
| `sinfo -s` | Panorama das partições do cluster |
| `srun ...` | Executa uma tarefa dentro da alocação |

### 12.2 Pilha de software validada

| Componente | Versão |
|---|---|
| Python | 3.11 |
| PyTorch | 2.13.0+cu126 |
| CUDA | 12.6 |
| cuDNN | 9.10.2.21 |
| NCCL | 2.29.3 |
| Transformers | 5.14.1 |
| Datasets | 5.0.0 |
| Accelerate | 1.14.0 |

**Restrição.** O índice `cu126` é obrigatório: a partir do PyTorch 2.11, os binários de CUDA 12.8 e 12.9 deixaram de incluir suporte à arquitetura Volta (`sm_70`) das V100. Verifique sempre com `torch.cuda.get_arch_list()`.

### 12.3 Mapa de armazenamento

| Volume | Tecnologia | Uso recomendado |
|---|---|---|
| `/prj` | NFS sobre DellEMC Isilon | Código, resultados finais, arquivos de reconstrução |
| `/scratch` | Lustre sobre Cray ClusterStor L300 | Datasets, checkpoints, ambientes de execução |

### 12.4 Nó de computação de referência (partição `sequana_gpu_dev`)

| Componente | Especificação |
|---|---|
| GPU | 4 × NVIDIA Tesla V100-SXM2, 32 GB cada |
| Interconexão entre GPUs | NVLink 2.0, topologia all-to-all |
| CPU | 48 núcleos, dois sockets, dois domínios NUMA |
| Memória | 376 GB disponíveis |
| Rede | 2 × Mellanox InfiniBand |

### 12.5 Documentos relacionados no repositório

- [`../docs/relatorio-tecnico.md`](relatorio.html): relatório técnico de implantação do ambiente
- [`../docs/ambiente.md`](https://github.com/brunoleomenezes/peia-hpc/blob/main/docs/ambiente.md): guia de reconstrução do ambiente
- [`../slurm/`](https://github.com/brunoleomenezes/peia-hpc/blob/main/slurm): scripts de submissão (`teste-gpu.sh`, `valida-torch.sh`, `bench-nccl.sh`, `bench-train.sh`)
- [`../benchmarks/`](https://github.com/brunoleomenezes/peia-hpc/blob/main/benchmarks): códigos de medição
- [`../notebooks/`](https://github.com/brunoleomenezes/peia-hpc/blob/main/notebooks): material das aulas práticas

---

*Documento vinculado ao projeto PEIA-HPC, proposta SINAPAD 249134, Supercomputador SDumont (LNCC/MCTI). Material didático licenciado sob Apache 2.0.*
