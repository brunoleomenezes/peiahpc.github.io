# Integrated Teaching Plan (Applied Artificial Intelligence and High-Performance Computing

> **🌐 Language / Idioma:** [🇧🇷 Português](plano.html) · **🇺🇸 English**

## PEIA-HPC Project · Programme of the LNCC Artificial Intelligence Institute

**Author:** Bruno Leonardo Santos Menezes
**Project:** PEIA-HPC (National Training in Applied Artificial Intelligence and Scientific Computing using SINAPAD HPC Infrastructure)
**SINAPAD Proposal:** 249134
**Practice infrastructure:** Santos Dumont Supercomputer (SDumont), LNCC, Petrópolis-RJ
**Base course:** Applied Artificial Intelligence) 240 class hours, 20 weeks, 12 class hours per week, three sessions per week
**Methodology:** 40% theoretical, 60% practical
**Term:** 2026, with activities scheduled to end on December 17
**License of this material:** Apache 2.0 (code) / same license text for courseware

---

## Table of Contents

1. [Purpose and scope of the document](#1-objetivo-e-escopo-do-documento)
2. [Pedagogical principle: verticalization, not addition](#2-princípio-pedagógico-verticalização-não-adição)
3. [Compliance with the approved course plan](#3-conformidade-com-o-plano-de-curso-aprovado)
4. [Audience, prerequisites, and the bridge from the previous course](#4-público-pré-requisitos-e-a-ponte-com-o-curso-anterior)
5. [Course architecture: the five phases](#5-arquitetura-do-curso-as-cinco-fases)
6. [HPC readiness ladder](#6-escada-de-prontidão-em-hpc)
7. [Detailed week-by-week schedule](#7-cronograma-detalhado-semana-a-semana)
8. [Learning objectives by phase](#8-objetivos-de-aprendizagem-por-fase)
9. [Proficiency levels](#9-níveis-de-proficiência)
10. [Integrated assessment rubric](#10-rubrica-de-avaliação-integrada)
11. [Operational prerequisites and risks](#11-pré-requisitos-operacionais-e-riscos)
12. [Appendices](#12-anexos)

---

## 1. Purpose and scope of the document

This document defines the teaching plan that integrates, in a single 240-class-hour offering, the **Applied Artificial Intelligence** approved curriculum and the **High-Performance Computing layer** of the PEIA-HPC project, run on the SDumont Supercomputer.

The document establishes the week-by-week schedule, the learning objectives by phase, the expected proficiency levels, and the assessment rubric, all framed within the curricular structure and assessment instruments already set out in the approved course plan.

The scope covers the instructional organization. The technical specifications of the environment, the submission scripts, and the benchmark methodology are recorded in the [technical deployment report](relatorio.html), referenced throughout this text and reproduced in condensed form in Appendix 12.3.

The document is deliberately detailed. Each week presents the curriculum topic, the corresponding HPC layer, the hands-on activity on the cluster, and the expected deliverable, so that the offering can be reproduced by another instructor without mentally reconstructing the context.

---

## 2. Pedagogical principle: verticalization, not addition

The design decision that organizes the entire remainder of the document is the following: **the AI tools curriculum and the HPC layer are not two contents competing for the workload: they are the same conceptual object at two depths.**

Treating the two as separate blocks fails on arithmetic. If half the course becomes "tools" and the other half becomes "supercomputing", neither fits, and the HPC layer arrives too late for a lower secondary education class.

The alternative is to **verticalize**. Each topic of the approved curriculum points to an AI model. The student's path descends deeper into the same object:

```
uses ChatGPT (surface)
   └─ discovers that it is a neural network (Fundamentals)
        └─ sees that network run on an SDumont GPU (demonstration)
             └─ submits their own job (Slurm)
                  └─ measures how fast it processes (benchmark)
                       └─ fine-tunes a small model (capstone)
```

The HPC layer is not new material added at the end. It is the "under the hood" of everything the class has already been using since the first week. Every time the curriculum says "use this model", the HPC layer asks "where did this model come from, and can we run it, measure it, and fine-tune it ourselves?".

---

## 3. Compliance with the approved course plan

The course plan is approved and **cannot be rewritten**. This teaching plan does not rewrite it.

The integration rests on three points of the approved course plan itself:

- The plan requires a **60% practical workload**. All of the HPC falls within that 60%, as a practice environment.
- The plan defines the methodology as "analysis and solution of problems, case studies, projects, research, and other actions that integrate theory and practice and focus on the work context". **SDumont is that real-context environment.**
- The plan includes an **AI Fundamentals** module (which already mentions neural networks and AI algorithms) and a **Capstone** with a final project. The HPC layer is the concrete realization of the Fundamentals concepts and the substrate of the Capstone project.

Nothing in the approved course plan prohibits using a supercomputer as a laboratory. The prescribed assessment instruments (a 4.0-point theoretical exam and a 6.0-point practical exam, with approval requiring an average equal to or greater than 6.0 and minimum attendance of 75%) are preserved in full. Section 10 distributes these same points across the two knowledge axes, without creating any new grade.

---

## 4. Audience, prerequisites, and the bridge from the previous course

**Class profile.** Minimum age of 16, completed lower secondary education, having finished the "Computer Assembly and Repair" course or equivalent. Class of 10 to 20 students.

**What the class already has.** The "Computer Assembly and Repair" prerequisite is a pedagogical asset, not a bureaucratic detail. The class already understands CPU, memory, and GPU as physical components: they assembled a machine with their own hands. The mental model of hardware already exists.

**The bridge to be used on the first day.** SDumont is the natural continuation of that mental model: "you assembled a PC; SDumont is the `sequana_gpu_dev` partition with 60 nodes, each with 4 of the most powerful GPUs that exist, connected to one another by NVLink." The student does not start from zero; they start from a machine they know how to assemble, and scale it to 240 GPUs.

**What the class does not yet have.** The Linux terminal, remote access, and Python. That is the real gap, and it requires a runway (Section 6) before any job submission. Anticipating HPC without that runway turns the first job into frustration.

---

## 5. Course architecture: the five phases

The 20 weeks are organized into five phases. Each phase aligns a block of the course curriculum with a corresponding HPC depth.

| Phase | Weeks | course curriculum axis | HPC layer | Milestone |
|---|---|---|---|---|
| 0 | 1–4 | AI Fundamentals; first prompts | Readiness: terminal, SSH, first job | Level 0 (everyone) |
| 1 | 5–9 | ChatGPT: productivity, business, marketing | Inference: run your own model | Level 1 (most) |
| 2 | 10–14 | Image, video, audio, site, and app generation | Slurm consolidated; first benchmark | Slurm proficient |
| 3 | 15–18 | Solidification; project planning | Training, fine-tuning, strong/weak scaling | Level 2 (teams) |
| 4 | 19–20 | Capstone: execution and presentation | Experiment documentation; performance data | Integrated project |

The distribution of weeks per phase is 4 + 5 + 5 + 4 + 2 = 20.

---

## 6. HPC readiness ladder

HPC competence is built in steps, in a mandatory order. Each step assumes the previous one. The first steps begin already in Phase 0, in parallel with the AI Fundamentals; the upper steps only hold up once the lower ones are firm.

| Step | Competence | Where it enters |
|---|---|---|
| 1 | Terminal and Linux file system | Phase 0, weeks 1–2 |
| 2 | Remote access: VPN and SSH | Phase 0, weeks 2–3 |
| 3 | Environment modules and Python virtual environment (`venv`) | Phase 1, weeks 5–6 |
| 4 | Slurm: `sbatch`, `srun`, `squeue`, `sacct`, partition, resource request | Phase 0 week 4, consolidated in Phase 2 |
| 5 | GPU: `nvidia-smi`, VRAM, occupancy, throughput | Phase 1–2 |
| 6 | Parallelism and scaling: strong and weak scaling, DDP | Phase 3 |

**Sequence rule.** The first real job (step 4) is only submitted after SSH (step 2) is working. Environment building (step 3) precedes any inference. Parallelism (step 6) is the last and is reserved for teams that arrive ready.

---

## 7. Detailed week-by-week schedule

Each week has 12 class hours, distributed across three sessions of 4 class hours, with approximately 5 theoretical and 7 practical class hours, respecting the 40/60 proportion of the approved course plan.

In the columns: **course curriculum** is the topic of the approved plan; **HPC layer** is the descent deeper into the same object; **Practice on SDumont** is the activity on the cluster; **Deliverable** is the assessable evidence.

### 7.1 Phase 0: Fundamentals and readiness (weeks 1 to 4)

**Week 1**
- **course curriculum:** course presentation; history of AI; what Artificial Intelligence is and its current importance; distinction between AI, Machine Learning, and Deep Learning.
- **HPC layer:** why computing matters; what a supercomputer is; introduction to SINAPAD, LNCC, and the PEIA-HPC project. The bridge to "Computer Assembly and Repair": from the physical component to the node, from the node to the cluster.
- **Practice on SDumont:** still in a local environment. Linux terminal: navigation, creation and manipulation of directories and files, basic permissions.
- **Deliverable:** completed terminal walkthrough (build a directory tree, copy, move, list).

**Week 2**
- **course curriculum:** concepts of machine learning, neural networks, and AI algorithms, at a conceptual level; introduction to the concepts of prompt and chatbot.
- **HPC layer:** anatomy of a GPU node; what the GPU does differently from the CPU; NVLink as "the components talking to one another". Concept of remote access: what SSH and VPN are.
- **Practice on SDumont:** completion of the terminal (redirection, pipes, editing with `nano`); workstation preparation: installation and configuration of the VPN client, with MTU adjustment to 1300 (see technical report).
- **Deliverable:** workstation with VPN configured and tested; terminal walkthrough finished.

**Week 3**
- **course curriculum:** introduction to ChatGPT: what it is, prerequisites, account creation, practical overview, first prompt-creation tasks.
- **HPC layer:** what a queue scheduler is (the bank queue as an analogy); concepts of job, partition, and resource; the difference between `/prj` (home, NFS) and `/scratch` (Lustre).
- **Practice on SDumont:** **first supervised login via SSH**; exploration of the banner, the prompt, and the file system; configuration of a persistent `~/.ssh/config`.
- **Deliverable:** successful SSH session recorded; student locates their directory at `/scratch/peia-hpc/$USER`.

**Week 4**
- **course curriculum:** hands-on prompt-creation tasks; consolidation of the fundamentals.
- **HPC layer:** the first job: the `#SBATCH` directive, the commands `sbatch`, `squeue`, and `sacct`; the discipline of **never running a workload on the login node**, using the error documented in the report as a lesson in method.
- **Practice on SDumont:** submission of `teste-gpu.sh` (prints `hostname`, `nproc`, `free -g`, and `nvidia-smi` inside a job); reading the output in `logs/`.
- **Deliverable:** first job with `COMPLETED` state; output file interpreted (identify the allocated node and the 4 V100 GPUs).
- **Milestone: Level 0 reached by the whole class.**

### 7.2 Phase 1 (Tools as inference (weeks 5 to 9)

**Week 5**
- **course curriculum:** ChatGPT optimizing everyday tasks) complete research, writing various kinds of content, summaries, translations, data organization.
- **HPC layer:** the concept of **inference**: running an already-trained model. What separates "using ChatGPT in the browser" from "running a model yourself".
- **Practice on SDumont:** environment modules (`module load anaconda3/2024.02_sequana`); creation of a `venv` in `/scratch`; concept of an isolated environment.
- **Deliverable:** `venv` environment created and activated inside a job; `python --version` confirming Python 3.11.

**Week 6**
- **course curriculum:** ChatGPT for everyday use: problem solving, video summarization, email writing, creation of tables and spreadsheets.
- **HPC layer:** package installation; the constraint of the `cu126` index (why the V100s, Volta architecture `sm_70`, require CUDA 12.6); validation of `torch.cuda`.
- **Practice on SDumont:** `pip install torch --index-url .../cu126` and other requirements; submission of `valida-torch.sh`; verification that `torch.cuda.is_available()` is true and that `torch.cuda.get_arch_list()` contains `sm_70`.
- **Deliverable:** validated software stack; job that prints the PyTorch version, CUDA availability, and the architecture list.

**Week 7**
- **course curriculum:** ChatGPT for business, entrepreneurship, and jobs: professional prompts, résumé production, email to a potential employer.
- **HPC layer:** running a small open language model in inference mode, as a job; reading `nvidia-smi` during execution (GPU and memory usage).
- **Practice on SDumont:** job that loads a small model via Transformers and generates text; comparison of the output with that of ChatGPT in the browser.
- **Deliverable:** inference output from the cluster accompanied by a written comparison with the web tool.

**Week 8**
- **course curriculum:** ChatGPT for personal and professional productivity: reading books, extracting information, supporting decision-making.
- **HPC layer:** in-depth reading of `nvidia-smi`; what VRAM, occupancy, and throughput are; a first notion of "how much it costs" to run a model.
- **Practice on SDumont:** measurement of generation time with and without GPU (CPU versus GPU) for the same small model.
- **Deliverable:** CPU versus GPU comparison table (time and items per second).

**Week 9**
- **course curriculum:** ChatGPT for marketing content creation: copywriting, articles, video scripts, headlines, and calls to action.
- **HPC layer:** consolidation of Phase 1; concept of reproducibility: why to record commands and versions, in the manner of the technical report.
- **Practice on SDumont:** each student writes, from scratch, their own `sbatch` script for an inference task.
- **Deliverable:** original `sbatch` script with its output.
- **Milestone: Level 1 reached by most of the class.**

### 7.3 Phase 2: Multimedia generation and real Slurm (weeks 10 to 14)

**Week 10**
- **course curriculum:** generation of texts and presentations; image generation (overview of the main tools).
- **HPC layer:** image generation is inference of a diffusion model; running an image model as a batch job.
- **Practice on SDumont:** image-generation job on the cluster; artifacts saved in `/scratch`, final result moved to `/prj`.
- **Deliverable:** image generated on the cluster and the corresponding script; `/scratch` versus `/prj` distinction applied in practice.

**Week 11**
- **course curriculum:** video generation; content generation for social media.
- **HPC layer:** heavier pipelines; reading error logs and debugging (file not found, metadata propagation on NFS, lessons from the report).
- **Practice on SDumont:** guided debugging of a job that fails on purpose (incorrect path, missing module); diagnosis and correction.
- **Deliverable:** short debugging report in the format error → diagnosis → correction, in the style of the technical report.

**Week 12**
- **course curriculum:** narration and dubbing generation; audio-to-text and text-to-audio converter.
- **HPC layer:** audio models as inference; the concept of a throughput benchmark: what it means to measure items or tokens per second, with warmup and CUDA synchronization.
- **Practice on SDumont:** running a benchmark and collecting a model's throughput, with warmup steps before the measurement.
- **Deliverable:** first original throughput benchmark, with methodology described (warmup and measurement).

**Week 13**
- **course curriculum:** site creation; animation generator; various automations.
- **HPC layer:** efficiency and quota hygiene: why to always request `--gres=gpu:4` (billing is per full node, `billing=48`); why never to use the login node.
- **Practice on SDumont:** sizing exercise: estimate the GPU hours needed for a task from the measured throughput.
- **Deliverable:** cost estimate in GPU hours, with the calculation basis made explicit.

**Week 14**
- **course curriculum:** application creation; design and marketing (closing of the tools block).
- **HPC layer:** Slurm consolidation; review for the theoretical assessment of HPC concepts.
- **Practice on SDumont:** mid-course mini-project: a complete inference pipeline, submitted and documented.
- **Deliverable:** documented mini-project.
- **Milestone: Slurm consolidated.**

### 7.4 Phase 3: Training, fine-tuning, and scaling (weeks 15 to 18)

This phase concentrates the dense HPC content and corresponds to **Level 2**. It is carried out in teams, and its depth adjusts to each group's readiness.

**Week 15**
- **course curriculum:** general solidification of knowledge; review of all items.
- **HPC layer:** what it means to **train** a model, in contrast to inferring; the notion of computational cost (approximately 6ND); why training is expensive. Synthetic data versus real data.
- **Practice on SDumont:** running `bench-train.py` on 1 node with 4 GPUs; observing the throughput (on the order of 40,967 tokens/s in the reference experiment) and the VRAM peak (18 GB of 32 GB).
- **Deliverable:** single-node training result, interpreted.

**Week 16**
- **course curriculum:** planning of the course's final project; description of the project scope.
- **HPC layer:** **fine-tuning**: adapting a pre-trained model to one's own data; the difference between training from scratch and fine-tuning.
- **Practice on SDumont:** fine-tuning of a small model with a small dataset from the team itself.
- **Deliverable:** fine-tuned model and a qualitative before/after comparison.

**Week 17**
- **course curriculum:** execution of the final project (start).
- **HPC layer:** **parallelism and scaling**: strong scaling versus weak scaling; running the benchmark on 2 nodes; computing the scaling efficiency (94% in the reference experiment) and the finding that InfiniBand is not a bottleneck at this scale.
- **Practice on SDumont:** benchmark comparing 1 node and 2 nodes; computing the scaling efficiency.
- **Deliverable:** scaling table with the computed efficiency, in the format of the technical report.

**Week 18**
- **course curriculum:** execution of the final project (continuation).
- **HPC layer:** the limits of the educational allocation (20-minute walltime, `MaxSubmit=1`) and their implications for the project; when to request a quota increase; why pure DDP stops fitting in 32 GB above about 1 billion parameters, requiring ZeRO or FSDP.
- **Practice on SDumont:** integration of the HPC component into each team's project.
- **Deliverable:** the project's HPC component up and running.
- **Milestone: Level 2 reached by the prepared teams.**

### 7.5 Phase 4: Integrated capstone (weeks 19 to 20)

**Week 19**
- **course curriculum:** execution of the Final Project; preparation of the presentation.
- **HPC layer:** documentation of the experiment in the style of the technical report: commands, outputs, measurements, and what failed.
- **Practice on SDumont:** finalization of the experiment; writing the documentation of the HPC component.
- **Deliverable:** complete final project, with HPC documentation (job submitted, measurement performed, and analysis).

**Week 20**
- **course curriculum:** presentation of the Final Project.
- **HPC layer:** the presentation includes the real performance data measured by the team.
- **Practice on SDumont:** presentations; assessment in the class council of the formative aspects.
- **Deliverable:** presentation delivered; consolidated integrated final grade; the material produced becomes part of the project repository (the `curso/` and `notebooks/` folders).

### 7.6 Case study: Variant filter ablation (optional post-Phase-4 extension)

A special two-part module, outside the mandatory 20-week schedule. It is meant for teams that reach Level 2 before the end of Phase 4 and for classes with additional sessions available. Notebooks in `notebooks/en/estudo-de-caso-ablacao/`.

**Case 01 (The variant filter: a substring bug that rewrites the corpus**
- **course curriculum:** execution and documentation of the Final Project; critical reading of AI results) what a number says and what it does not say.
- **HPC layer:** corpus curation for pre-training; Stage 2 (the PT-BR/PT-PT variant filter) and the difference between substring and word-boundary matching; the design of a single-factor ablation; the equal token budget; 13-gram decontamination against ENEM, BLUEX, OAB and ASSIN2.
- **Practice on SDumont:** clone the experiment onto `/scratch`, reproduce the divergence between the two classifiers on the login node, build a pilot pool (login node, needs internet) and measure the retention rate in a CPU job on `sequana_cpu_dev`.
- **Deliverable:** divergence table (legacy × fixed) and retention table for the pilot pool, with an interpretation of what the filter actually separates: formal register, not linguistic variant.

**Case 02: Training the three arms in 20-minute windows and reading the result**
- **course curriculum:** execution, documentation and presentation of the Final Project; methodological honesty when reporting results.
- **HPC layer:** pre-training three ~153 M-parameter models from scratch with checkpoint resume in 20-minute windows; the manual chain imposed by `MaxJobs=1`/`MaxSubmit=1`; offline evaluation; reading a comparison report with bootstrap confidence intervals, McNemar's paired test and the chance line.
- **Practice on SDumont:** submit the three arms one at a time on `sequana_gpu_dev` with `--gres=gpu:4`, read `status.json`, resume inside a `screen` on the login node, evaluate and generate the comparison report.
- **Deliverable:** comparison table of the three arms (held-out perplexity and benchmark accuracy) with the chance line marked, and a conclusion that states what the data support and what they do not.

---

## 8. Learning objectives by phase

The objectives are written as verifiable capabilities. Each phase declares what the student becomes able to do, on both axes.

**Phase 0: Fundamentals and readiness.** By the end, the student is able to: distinguish AI, Machine Learning, and Deep Learning and explain the role of neural networks; operate the Linux terminal for file and navigation tasks; establish a remote connection to SDumont via VPN and SSH; and submit a simple job to the scheduler, interpreting its output.

**Phase 1: Tools as inference.** By the end, the student is able to: employ generative AI tools in productivity, business, and marketing tasks; build an isolated Python environment on the cluster and validate the software stack; run an open model in inference mode as a job; and read `nvidia-smi` to describe GPU and memory usage.

**Phase 2: Multimedia generation and Slurm.** By the end, the student is able to: use image, video, and audio generation tools; write submission scripts from scratch and manage data between `/scratch` and `/prj`; diagnose and fix job failures from the logs; and measure a model's throughput with a reproducible methodology.

**Phase 3: Training, fine-tuning, and scaling.** By the end, the team is able to: explain the difference between training and inferring and the origin of training's computational cost; perform the fine-tuning of a small model with its own data; run a distributed benchmark and compute the scaling efficiency; and justify resource choices in light of the allocation's limits.

**Phase 4: Integrated capstone.** By the end, the team is able to: conceive and execute a project that integrates the use of AI tools with a real HPC experiment; document the experiment with reproducibility rigor; and present the results supported by measured performance data.

---

## 9. Proficiency levels

The class is heterogeneous. The HPC layer is inclusive at the base and deep at the top, organized into three levels.

| Level | Description | Corresponds to |
|---|---|---|
| **Level 0** | Access SDumont, submit a simple job, run an inference, and read the output. | Course floor. Required of all students. |
| **Level 1** | Set up the environment, run a benchmark, and interpret `nvidia-smi` and throughput. | Expected of most. Full marks on the practical operation criterion. |
| **Level 2** | Fine-tune a small model, run a distributed benchmark, and analyze the scaling. | More prepared capstone teams. Distinction on the final project. |

Level 0 is the floor for approval: every student must reach it. Level 1 corresponds to full marks on criterion P2 of the rubric. Level 2 corresponds to full marks, with distinction, on criterion P3.

---

## 10. Integrated assessment rubric

The assessment fully preserves the instruments and totals of the approved course plan: a 4.0-point theoretical exam and a 6.0-point practical exam, totaling 10.0. Approval requires an average equal to or greater than **6.0** and minimum attendance of **75%**. The rubric merely distributes these same points across the two knowledge axes.

### 10.1 Distribution of points

| Instrument | Criterion | Weight |
|---|---|---|
| **Theoretical (4.0)** | **T1.** AI Fundamentals: AI/ML/DL, neural networks, algorithms | 2.0 |
| | **T2.** HPC Fundamentals: CPU versus GPU, parallelism, queue scheduler, strong and weak scaling | 2.0 |
| **Practical (6.0)** | **P1.** AI tools portfolio: generation of text, image, video, audio, and applications | 2.0 |
| | **P2.** HPC environment operation: access, environment, job submission, reading `nvidia-smi`, benchmark | 2.0 |
| | **P3.** Integrated final project: with a documented and presented HPC component | 2.0 |
| | **Total** | **10.0** |

### 10.2 Performance descriptors: criterion P2 (HPC environment operation)

| Performance level | Description | Points |
|---|---|---|
| Insufficient | Does not establish cluster access or submit a job autonomously. | 0.0 |
| Basic | Accesses the cluster and submits a simple job with support; reads the output with assistance. | 0.5–1.0 |
| Proficient | Builds the environment, submits their own jobs, and interprets `nvidia-smi` and throughput without support. | 1.5 |
| Advanced | Debugs failures from the logs, applies good quota practices, and documents the methodology. | 2.0 |

Criterion P2 maps directly to Levels 0 and 1 of Section 9.

### 10.3 Performance descriptors: criterion P3 (integrated final project)

| Performance level | Description | Points |
|---|---|---|
| Insufficient | Project without an HPC component, or not presented. | 0.0 |
| Basic | Project uses AI tools and includes a simple run on the cluster, without measurement. | 0.5–1.0 |
| Proficient | Project integrates cluster inference with a documented performance measurement. | 1.5 |
| Advanced | Project includes fine-tuning or scaling analysis, documented with the rigor of the technical report. | 2.0 |

Criterion P3 maps to Levels 1 and 2 of Section 9. Advanced performance corresponds to the distinction of Level 2.

### 10.4 Notes on the assessment

The formative assessment in the class council, prescribed in the approved course plan, considers the student's progression on the readiness ladder (Section 6), and not only the final result. The class register records attendance per class hour, as per the plan.

---

## 11. Operational prerequisites and risks

Three dependencies can render the offering unviable if not addressed early. They are listed in order of criticality.

**Risk 1: Provisioning student access (blocker no. 1).** The SINAPAD form registers only the coordinator as a participant. The 10 to 20 students need accounts and VPN profiles on SDumont. This is an administrative pending item with the LNCC Helpdesk, which **must be resolved before the Phase 0 cluster activities**. It is also recommended to consider a supervised access model, with the class in a joint session, to reduce the problem surface at the start.

**Risk 2: The educational allocation is for short jobs.** The technical report records a ceiling of 20 minutes of walltime and `MaxSubmit=1`, which prevents long training and checkpoint chains. This is appropriate for the classroom, as it favors fast feedback cycles. The practices are designed around benchmarking, inference, and short fine-tuning. If the Capstone requires larger runs, a quota increase for that specific window should be requested from LNCC: it is an administrative quota change, not a queue configuration change.

**Risk 3: Login node discipline and quota etiquette.** It must be taught explicitly: "never run a workload on the login node" and "always request `--gres=gpu:4`, because billing is per full node anyway". The very error documented in the report (a measurement mistakenly made on the login node) is teaching material about responsible use, which is a stated objective of the project.

**Risk 4: Entry competence gap.** The class does not command the terminal, remote access, or Python. The mitigation is the readiness ladder of Section 6: the terminal and remote-access steps precede any job submission. Do not anticipate HPC.

---

## 12. Appendices

### 12.1 Slurm command quick reference

| Command | Function |
|---|---|
| `sbatch script.sh` | Submits a batch job |
| `squeue -u $USER` | Lists the user's jobs in the queue |
| `sacct -j <id>` | Accounts for a completed job |
| `scontrol show partition <nome>` | Details the configuration of a partition |
| `sinfo -s` | Overview of the cluster's partitions |
| `srun ...` | Runs a task within the allocation |

### 12.2 Validated software stack

| Component | Version |
|---|---|
| Python | 3.11 |
| PyTorch | 2.13.0+cu126 |
| CUDA | 12.6 |
| cuDNN | 9.10.2.21 |
| NCCL | 2.29.3 |
| Transformers | 5.14.1 |
| Datasets | 5.0.0 |
| Accelerate | 1.14.0 |

**Constraint.** The `cu126` index is mandatory: as of PyTorch 2.11, the CUDA 12.8 and 12.9 binaries no longer include support for the Volta architecture (`sm_70`) of the V100s. Always verify with `torch.cuda.get_arch_list()`.

### 12.3 Storage map

| Volume | Technology | Recommended use |
|---|---|---|
| `/prj` | NFS over DellEMC Isilon | Code, final results, reconstruction files |
| `/scratch` | Lustre over Cray ClusterStor L300 | Datasets, checkpoints, execution environments |

### 12.4 Reference compute node (`sequana_gpu_dev` partition)

| Component | Specification |
|---|---|
| GPU | 4 × NVIDIA Tesla V100-SXM2, 32 GB each |
| GPU interconnect | NVLink 2.0, all-to-all topology |
| CPU | 48 cores, two sockets, two NUMA domains |
| Memory | 376 GB available |
| Network | 2 × Mellanox InfiniBand |

### 12.5 Related documents in the repository

- [`../docs/relatorio-tecnico.en.md`](relatorio.html): technical deployment report for the environment
- [`../docs/ambiente.md`](https://github.com/brunoleomenezes/peia-hpc/blob/main/docs/ambiente.md): environment reconstruction guide
- [`../slurm/`](https://github.com/brunoleomenezes/peia-hpc/blob/main/slurm): submission scripts (`teste-gpu.sh`, `valida-torch.sh`, `bench-nccl.sh`, `bench-train.sh`)
- [`../benchmarks/`](https://github.com/brunoleomenezes/peia-hpc/blob/main/benchmarks): measurement code
- [`../notebooks/`](https://github.com/brunoleomenezes/peia-hpc/blob/main/notebooks): hands-on class material

---

*Document linked to the PEIA-HPC project, SINAPAD proposal 249134, SDumont Supercomputer (LNCC/MCTI). Courseware licensed under Apache 2.0.*
