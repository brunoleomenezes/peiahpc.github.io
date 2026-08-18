# Relatório Técnico de Implantação de Ambiente Computacional

> **🌐 Idioma / Language:** **🇧🇷 Português** · [🇺🇸 English](relatorio.html)

## Projeto PEIA-HPC no Supercomputador Santos Dumont

**Autor:** Bruno Leonardo Santos Menezes
**Projeto:** PEIA-HPC (National Training in Applied Artificial Intelligence and Scientific Computing using SINAPAD's HPC Infrastructure)
**Proposta SINAPAD:** 249134
**Infraestrutura:** Supercomputador Santos Dumont (SDumont), LNCC, Petrópolis-RJ
**Período de execução:** 23 e 24 de julho de 2026
**Estação de trabalho de origem:** Windows 11, cliente doméstico com NAT

---

## Sumário

1. [Objetivo e escopo](#1-objetivo-e-escopo)
2. [Contexto e cronologia de concessão do acesso](#2-contexto-e-cronologia-de-concessão-do-acesso)
3. [Fase 1: Estabelecimento da conectividade VPN](#3-fase-1-estabelecimento-da-conectividade-vpn)
4. [Fase 2: Acesso SSH e estabilização da sessão](#4-fase-2-acesso-ssh-e-estabilização-da-sessão)
5. [Fase 3: Caracterização da alocação e do hardware](#5-fase-3-caracterização-da-alocação-e-do-hardware)
6. [Fase 4: Tentativa de ambiente conteinerizado](#6-fase-4-tentativa-de-ambiente-conteinerizado)
7. [Fase 5: Ambiente virtual Python](#7-fase-5-ambiente-virtual-python)
8. [Fase 6: Benchmarks de comunicação e throughput](#8-fase-6-benchmarks-de-comunicação-e-throughput)
9. [Análise quantitativa e dimensionamento](#9-análise-quantitativa-e-dimensionamento)
10. [Erros cometidos e lições metodológicas](#10-erros-cometidos-e-lições-metodológicas)
11. [Pendências e recomendações](#11-pendências-e-recomendações)
12. [Anexos](#12-anexos)

---

## 1. Objetivo e escopo

Este documento registra, de forma exaustiva, o processo de implantação de um ambiente computacional funcional para treinamento de modelos de linguagem no supercomputador SDumont, no âmbito do projeto PEIA-HPC.

O escopo cobre desde o primeiro contato com a infraestrutura de acesso remoto até a obtenção de métricas de desempenho reproduzíveis. Foram registrados tanto os caminhos bem-sucedidos quanto os becos sem saída, com o diagnóstico de cada falha, por três razões:

- **Reprodutibilidade.** Outro membro do projeto deve conseguir refazer o mesmo percurso sem repetir as tentativas infrutíferas.
- **Insumo para suporte.** Vários dos obstáculos encontrados são de natureza institucional e exigem intervenção do Helpdesk. O registro detalhado é o anexo técnico dos chamados.
- **Material didático.** Sendo o PEIA-HPC um projeto de formação, o próprio percurso de depuração é conteúdo pedagógico sobre uso real de infraestrutura de HPC.

O documento é deliberadamente detalhado. Comandos são reproduzidos na íntegra, com suas saídas, para que possam ser executados novamente sem reconstrução mental do contexto.

---

## 2. Contexto e cronologia de concessão do acesso

### 2.1 Marcos administrativos

| Data | Evento |
|---|---|
| 15/07/2026 01:00 | Notificação JEMS de aprovação da proposta 249134 na chamada SINAPAD |
| 15/07/2026 11:39 | Envio da documentação complementar em resposta à aprovação |
| 16/07/2026 15:23 | Criação dos diretórios de projeto `/prj/peia-hpc` e `/scratch/peia-hpc` |
| 16/07/2026 15:47 | Comunicação do Service Desk (COTIC/LNCC) informando criação do projeto PEIA-HPC e liberação do acesso |
| 23/07/2026 16:50 | Início dos trabalhos de configuração da estação de trabalho |
| 24/07/2026 08:40 | Conclusão dos benchmarks de caracterização |

### 2.2 Credenciais e identificadores

```
Login SDumont ......... bruno.menezes2
UID ................... 65341
GID ................... 61715 (peia-hpc)
Grupos ................ 61715 (peia-hpc)
Host de login ......... login.sdumont.lncc.br
Endereço resolvido .... 146.134.143.249
Nós de login ativos ... sdumont17, sdumont18
Definição de senha .... https://novasenhasdumont.lncc.br
Suporte ............... helpdesk-sdumont@lncc.br
Manual ................ https://github.com/lncc-sered/manual-sdumont/wiki
```

### 2.3 Procedimento de acesso previsto pelo LNCC

O procedimento documentado pelo Service Desk é composto de duas etapas obrigatórias e sequenciais:

1. Conexão ao serviço de VPN do SDumont
2. Conexão SSH ao host `login.sdumont.lncc.br`

Não há acesso SSH direto sem o túnel VPN estabelecido. Toda a Fase 1 deste relatório decorre dessa dependência.

---

## 3. Fase 1: Estabelecimento da conectividade VPN

Esta foi a fase de maior consumo de tempo do projeto, e a que gerou o maior número de becos sem saída. O material de apoio fornecido pelo LNCC pressupõe o cliente Cisco VPN Client legado, descontinuado pelo fabricante em 2014 e incompatível com o Windows 11 moderno.

### 3.1 Ponto de partida: erro 27850 na instalação

**Sintoma observado:**

```
Cisco Systems VPN Client 5.0.07.0290
Error 27850. Unable to manage networking component.
Operating system corruption may be preventing installation.
```

**Diagnóstico.** O erro 27850 é gerado quando o instalador do Cisco VPN Client não consegue registrar ou manipular o driver de filtro de rede DNE (Deterministic Network Enhancer), originalmente da Deterministic Networks e posteriormente mantido pela Citrix. Esse driver é pré-requisito para a criação do adaptador virtual do túnel.

As causas conhecidas para essa falha em sistemas Windows 10 e 11 são:

- Resíduos de instalação anterior do DNE no registro
- Bloqueio de drivers legados pela Integridade de Memória (Core Isolation) do Windows 11
- Estouro do limite de filtros de rede do Windows, que é de 8 componentes
- Incompatibilidade estrutural entre a versão do DNE e a pilha NDIS moderna

**Hipóteses de tratamento formuladas:**

1. Desinstalação completa e reinstalação com `winfix.exe` (ferramenta de limpeza do DNE) seguida de `dneupdate64.msi`
2. Desativação temporária da Integridade de Memória
3. Instalação via `msiexec /i vpnclient_setup.msi` em prompt elevado, contornando o wrapper `.exe`
4. Substituição do cliente por alternativa moderna

### 3.2 Erro 1721 na tentativa de desinstalação

Ao tentar remover a instalação pelo Painel de Controle:

```
Cisco Systems VPN Client 5.0.07.0290
Error 1721. There is a problem with this Windows Installer package.
A program required for this install to complete could not be run.
Contact your support personnel or package vendor.
```

**Diagnóstico.** A instalação estava em estado órfão: presente na lista de programas, mas com o desinstalador quebrado. O erro 1721 indica falha na execução de uma ação personalizada (custom action) do pacote MSI, tipicamente a rotina que para o serviço `CVPND` e remove o driver DNE.

**Estado observado no sistema:**

| Componente | Versão | Data de instalação |
|---|---|---|
| Cisco Systems VPN Client | 5.0.7 | 2025 |
| DNE Update (Deterministic Networks, Inc.) | 4.35.0.18936 | 02/11/2025 |

A presença do DNE Update 4.35 mostrou que o pré-requisito estava, de fato, instalado. Isso reposicionou o diagnóstico: o problema não era ausência do driver, e sim a incapacidade do instalador de manipulá-lo.

### 3.3 Verificação do estado real dos serviços

Antes de prosseguir com a remoção, foi verificado se a instalação existente estava funcional:

```powershell
sc.exe query CVPND
```

Saída:

```
NOME_DO_SERVIÇO: CVPND
        TIPO                          : 110  WIN32_OWN_PROCESS  (interactive)
        ESTADO                        : 4  RUNNING
                                        (STOPPABLE, PAUSABLE, IGNORES_SHUTDOWN)
        CÓDIGO_DE_SAÍDA_DO_WIN32      : 0  (0x0)
        CÓDIGO_DE_SAÍDA_DO_SERVIÇO    : 0  (0x0)
        PONTO_DE_VERIFICAÇÃO          : 0x0
        AGUARDAR_DICA                 : 0x0
```

**Descoberta decisiva.** O serviço estava em execução. A instalação não estava quebrada, apenas o desinstalador. O plano de remoção foi abortado e a estratégia mudou para tentar usar o cliente já instalado.

### 3.4 Investigação do adaptador virtual CVirtA

O adaptador virtual do Cisco VPN Client é registrado como serviço de driver `CVirtA`. Um erro clássico da versão 5.0.07.0290 em sistemas de 64 bits é o erro 442 (Failed to enable Virtual Adapter), causado por valor incorreto ou ausente na chave `DisplayName`.

Primeira consulta:

```powershell
Get-ItemProperty "HKLM:\SYSTEM\CurrentControlSet\Services\CVirtA" | Select-Object DisplayName
```

Saída:

```
DisplayName
-----------

```

O valor retornou vazio. Como o comando não falhou com erro de caminho, a chave existia, mas a propriedade `DisplayName` não estava definida.

Inspeção completa da chave:

```powershell
Get-ItemProperty "HKLM:\SYSTEM\CurrentControlSet\Services\CVirtA" | Format-List *
```

Saída:

```
Type               : 1
Start              : 3
ErrorControl       : 1
Tag                : 23
ImagePath          : \SystemRoot\System32\drivers\CVirtA64.sys
Group              : NDIS
Owners             : {oem176.inf}
NdisMajorVersion   : 5
NdisMinorVersion   : 0
DriverMajorVersion : 1
DriverMinorVersion : 0
```

**Interpretação campo a campo:**

| Campo | Valor | Significado |
|---|---|---|
| `Type` | 1 | Driver de kernel |
| `Start` | 3 | Carga sob demanda (SERVICE_DEMAND_START) |
| `ErrorControl` | 1 | Erro normal, registra e continua |
| `ImagePath` | `CVirtA64.sys` | Binário do driver de 64 bits, presente |
| `Group` | NDIS | Registrado corretamente na pilha de rede |
| `Owners` | `oem176.inf` | Identificador do pacote de driver instalado, útil para remoção via `pnputil` |
| `NdisMajorVersion` | 5 | Interface NDIS 5.0, arquitetura legada |

O driver estava corretamente instalado. Faltava exclusivamente o nome de exibição.

### 3.5 Correção do DisplayName

```powershell
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\CVirtA" `
  -Name DisplayName `
  -Value "Cisco Systems VPN Adapter for 64-bit Windows" `
  -PropertyType String -Force
```

Verificações subsequentes:

```powershell
Test-Path "C:\Windows\System32\drivers\CVirtA64.sys"
# True

Get-NetAdapter | Where-Object InterfaceDescription -like "*Cisco*"
```

Saída:

```
Name       InterfaceDescription                        ifIndex Status       MacAddress   LinkSpeed
----       --------------------                        ------- ------       ----------   ---------
Ethernet   Cisco Systems VPN Adapter for 64-bit...           2 Not Present               0 bps
```

O estado `Not Present` é esperado com o túnel fechado. O adaptador só é ativado durante a conexão.

### 3.6 Erro 440: Driver Failure

Após reinicialização e importação do perfil, a tentativa de conexão produziu:

```
Secure VPN Connection terminated locally by the Client.
Reason 440: Driver Failure.
Connection terminated on: jul 23, 2026 20:48:14   Duration: 0 day(s), 00.00.00
```

**Diagnóstico.** O erro 440 ocorre após a negociação, no momento em que o cliente solicita ao driver a ativação do adaptador virtual. As causas documentadas para Windows 10 e 11 são:

1. Conflito com o serviço de Compartilhamento de Conexão com a Internet (`SharedAccess`), que disputa o adaptador virtual
2. DNE instalado mas não vinculado (bound) à placa de rede física
3. Interferência de firewall ou antivírus de terceiros, com registro frequente de McAfee bloqueando a criação de adaptadores virtuais
4. Ausência de reinicialização após alteração no registro do driver

**Tratamentos propostos, na ordem:**

```powershell
# 1. Desativar Compartilhamento de Conexão com a Internet
Stop-Service SharedAccess -Force
Set-Service SharedAccess -StartupType Disabled

# 2. Verificar vinculação do DNE
Get-NetAdapterBinding | Where-Object DisplayName -like "*Deterministic*" |
  Format-Table Name, DisplayName, Enabled

# 3. Desativar temporariamente proteção em tempo real e firewall do McAfee
```

### 3.7 Decisão de mudança de cliente

Após três rodadas de depuração no cliente Cisco, foi tomada a decisão de abandonar o cliente legado. Os critérios que fundamentaram a decisão:

- O cliente é de 2010, descontinuado pelo fabricante desde 2014
- A pilha NDIS 5.0 é incompatível com as políticas de driver do Windows 11
- O tempo já investido excedia o custo de migração
- O arquivo de perfil `.pcf` estava disponível, e clientes alternativos o importam diretamente

### 3.8 Análise do perfil de conexão

O arquivo `SDUMONT.pcf` fornecido pelo LNCC contém os parâmetros da conexão. Análise linha a linha dos campos relevantes:

```ini
[main]
Host=146.134.0.14
AuthType=1
GroupName=sdumont
enc_GroupPwd=<omitido>
EnableNat=1
TunnelingMode=0
TcpTunnelingPort=10000
EnableMSLogon=1
MSLogonType=0
SaveUserPassword=0
PeerTimeout=90
EnableLocalLAN=0
EnableBackup=0
CertStore=0
SendCertChain=0
```

| Parâmetro | Valor | Implicação técnica |
|---|---|---|
| `Host` | 146.134.0.14 | Endereço do concentrador VPN, distinto do host de login SSH |
| `AuthType` | 1 | Autenticação por chave pré-compartilhada de grupo, seguida de XAuth |
| `GroupName` | sdumont | Identificador do grupo IPsec |
| `enc_GroupPwd` | cifrado | Chave pré-compartilhada. O algoritmo de cifra é público e reversível, o que exige tratar o arquivo como segredo institucional |
| `EnableNat` | 1 | NAT-Traversal ativo, encapsulamento sobre UDP 4500. Essencial para conexões domésticas atrás de NAT |
| `TunnelingMode` | 0 | IPsec sobre UDP. O valor 1 selecionaria IPsec sobre TCP na porta 10000 |
| `PeerTimeout` | 90 | Timeout de 90 segundos para resposta do peer |
| `EnableLocalLAN` | 0 | Túnel completo (full tunnel). Todo o tráfego da estação passa pelo LNCC enquanto conectado |

A implicação de `EnableLocalLAN=0` é operacional e relevante: durante a conexão, a navegação comum do usuário também é roteada pelo LNCC. Recomenda-se desconectar quando não estiver em uso.

### 3.9 Migração para Shrew Soft VPN Client

O Shrew Soft VPN Client foi escolhido por três características:

- Importa arquivos `.pcf` do Cisco VPN Client diretamente, incluindo o campo `enc_GroupPwd` cifrado
- Usa driver próprio, sem dependência do DNE nem do CVirtA
- Compatível com Windows 11

**Procedimento executado:**

1. Instalação do Shrew Soft VPN Client, edição Standard
2. Abertura do VPN Access Manager
3. Menu File, Import, seleção do arquivo `SDUMONT.pcf`
4. Conexão com credenciais XAuth (`bruno.menezes2` e senha do SDumont)

**Log de conexão bem-sucedida:**

```
client configured
local id configured
remote id configured
pre-shared key configured
bringing up tunnel ...
network device configured
tunnel enabled
```

A sequência confirma: leitura correta da chave pré-compartilhada a partir do campo cifrado, estabelecimento da fase 1 do IKE, configuração do dispositivo de rede virtual e ativação do túnel.

**Tempo total da Fase 1:** aproximadamente 4 horas e 30 minutos, das quais cerca de 4 horas foram consumidas em tentativas com o cliente legado.

---

## 4. Fase 2: Acesso SSH e estabilização da sessão

### 4.1 Primeira tentativa e o falso negativo do ICMP

```powershell
ping login.sdumont.lncc.br
```

Saída:

```
Disparando login.sdumont.lncc.br [146.134.143.249] com 32 bytes de dados:
Esgotado o tempo limite do pedido.
Esgotado o tempo limite do pedido.
Esgotado o tempo limite do pedido.
Esgotado o tempo limite do pedido.
Estatísticas do Ping para 146.134.143.249:
    Pacotes: Enviados = 4, Recebidos = 0, Perdidos = 4 (100% de perda)
```

**Interpretação.** A resolução de nome funcionou corretamente, retornando 146.134.143.249. A perda total de pacotes ICMP não indica falha de conectividade: o nó de login do SDumont não responde a ICMP echo. O `ping` é, portanto, um teste inadequado para validar o túnel neste ambiente. O teste correto é a própria tentativa de conexão SSH na porta 22.

### 4.2 Erro de integridade criptográfica na sessão SSH

```
The authenticity of host 'login.sdumont.lncc.br (146.134.143.249)' can't be established.
ED25519 key fingerprint is SHA256:lY3wp04SjEfvz0B4ISq2MtPZPmLNk0IOfdt+wgZKG9Q.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added 'login.sdumont.lncc.br' (ED25519) to the list of known hosts.
Corrupted MAC on input.
ssh_dispatch_run_fatal: Connection to 146.134.143.249 port 22: message authentication code incorrect
```

**Análise.** A negociação SSH avançou até a troca de chaves e o registro da impressão digital do host, o que prova que o túnel VPN estava funcional e que havia rota até o servidor. A falha ocorreu na verificação de integridade dos pacotes de dados.

O erro `Corrupted MAC on input` significa que o código de autenticação de mensagem calculado pelo cliente divergiu do recebido. As causas possíveis são adulteração ativa, falha de hardware ou corrupção de pacotes em trânsito. Em túneis IPsec, a causa esmagadoramente mais comum é a terceira, por fragmentação decorrente de MTU inadequado.

**Mecanismo da falha.** O encapsulamento IPsec acrescenta cabeçalhos ao pacote original. Se o MTU do adaptador virtual for alto demais, pacotes grandes precisam ser fragmentados. Em caminhos com NAT e Path MTU Discovery bloqueado, a fragmentação pode ser malfeita ou os fragmentos podem ser descartados, produzindo pacotes remontados incorretamente. O SSH detecta isso na verificação do MAC.

### 4.3 Contorno imediato

```powershell
ssh -c aes256-gcm@openssh.com bruno.menezes2@login.sdumont.lncc.br
```

O modo GCM realiza autenticação embutida no cifrador (AEAD), com comportamento diferente do esquema encrypt-then-MAC padrão. Isso contornou o sintoma e permitiu estabelecer a sessão.

### 4.4 Correção estrutural recomendada

O contorno acima trata o sintoma. A correção da causa é o ajuste de MTU no perfil do Shrew Soft:

```
VPN Access Manager, selecionar site SDUMONT, botão Modify,
aba General, seção Local Host, campo MTU: alterar de 1380 para 1300.
```

Caso persista, reduzir para 1200.

**Consequência de não aplicar a correção.** Ao longo da sessão de trabalho, a conexão caiu cinco vezes, sempre durante operações de longa duração. Cada queda abortou o processo remoto em execução, com perda de trabalho acumulado. A seção 6 documenta o impacto disso na tentativa de construção do container.

### 4.5 Configuração de cliente persistente

Arquivo `%USERPROFILE%\.ssh\config`:

```
Host sdumont
    HostName login.sdumont.lncc.br
    User bruno.menezes2
    Ciphers aes256-gcm@openssh.com
    ServerAliveInterval 30
    ServerAliveCountMax 6
    TCPKeepAlive yes
```

| Diretiva | Função |
|---|---|
| `Ciphers` | Fixa o cifrador AEAD que contorna a corrupção de MAC |
| `ServerAliveInterval 30` | Envia keepalive a cada 30 segundos, evitando derrubada por ociosidade em NAT |
| `ServerAliveCountMax 6` | Tolera até 6 keepalives sem resposta antes de desistir, ou seja, 3 minutos de instabilidade |
| `TCPKeepAlive yes` | Ativa keepalive na camada TCP além do nível de protocolo SSH |

Com esse arquivo, a conexão passa a ser feita apenas com `ssh sdumont`.

### 4.6 Primeira sessão estabelecida

Banner de acesso, com informações operacionais relevantes extraídas:

```
Você está acessando o Supercomputador Santos Dumont (SDumont)!

* O SDumont POSSUI storages distintos para o HOMEDIR e para o SCRATCH.
** O HOME (/prj) utiliza um storage DellEMC ISILON, via NFS, de 635TB.
** O SCRATCH (/scratch) é um filesystem Lustre, utilizando um storage
   ClusterStor L300 da Cray/HPE de 1,1 PB.

#### ATENÇÃO #### A partir do dia 29/09, a submissão de jobs no SDumont
(Equipamento de 2019, conhecido como Sequana ou Expansão) será removido
para projetos Petrobras/ParceirosICTs.
#### ATENÇÃO #### A partir do dia 28/11, todos os dados dos projetos
Petrobras/ParceirosICTs, presente no Lustre do SDumont (/petrobr),
serão removidos.
```

**Nota sobre os avisos.** Os avisos de remoção referem-se exclusivamente aos projetos Petrobras e Parceiros ICT, com dados no volume `/petrobr`. Não afetam o PEIA-HPC. Registra-se, contudo, que a árvore de módulos de ambiente do cluster reside em `/petrobr/app_sequana/modulos2`, o que merece acompanhamento caso haja reorganização do volume.

Prompt obtido:

```
[bruno.menezes2@sdumont18 ~]$
```

**Tempo total da Fase 2:** aproximadamente 15 minutos.

---

## 5. Fase 3: Caracterização da alocação e do hardware

Esta fase teve por objetivo estabelecer, com dados medidos, quais recursos o projeto efetivamente possui. A caracterização precede qualquer planejamento de treinamento, pois define o envelope de viabilidade.

### 5.1 Cotas de submissão

```bash
sacctmgr list user $USER -s format=partition%20,MaxJobs,MaxSubmit,MaxNodes,MaxCPUs,MaxWall
```

Saída:

```
           Partition MaxJobs MaxSubmit MaxNodes  MaxCPUs     MaxWall
-------------------- ------- --------- -------- -------- -----------
     sequana_cpu_dev       1         1        4      192    00:20:00
     sequana_gpu_dev       1         1        4      192    00:20:00
```

**Interpretação dos limites:**

| Parâmetro | Valor | Consequência operacional |
|---|---|---|
| Partições acessíveis | apenas `_dev` | Sem acesso às filas de produção `sequana_gpu`, `sequana_gpu_long`, `sequana_cpu`, `sequana_cpu_long` |
| `MaxJobs` | 1 | Um único job em execução por vez |
| `MaxSubmit` | 1 | Impossível enfileirar continuação. Inviabiliza cadeias de checkpoint e resubmissão |
| `MaxNodes` | 4 | Teto de 4 nós por job |
| `MaxCPUs` | 192 | Equivalente a 4 nós de 48 CPUs |
| `MaxWall` | 00:20:00 | Vinte minutos de tempo de parede por job |

**Conclusão desta subseção.** A alocação atual é de desenvolvimento. A combinação de `MaxWall` de 20 minutos com `MaxSubmit` igual a 1 impede qualquer estratégia de treinamento longo, inclusive as baseadas em checkpoint frequente, porque não é possível deixar a continuação enfileirada.

### 5.2 Panorama das partições do cluster

```bash
sinfo -s
```

Saída (recorte das partições relevantes):

```
PARTITION               AVAIL  TIMELIMIT   NODES(A/I/O/T) NODELIST
sequana_cpu                up   infinite      240/0/0/240 sdumont[6036-6084,6086-6164,...]
sequana_cpu_dev            up      20:00      161/5/0/166 sdumont[6036-6084,6165-6251,...]
sequana_cpu_long           up   infinite      240/0/0/240 sdumont[6036-6084,6086-6164,...]
sequana_cpu_bigmem         up   infinite        36/0/0/36 sdumont[6000-6035]
sequana_cpu_bigmem_long    up   infinite        36/0/0/36 sdumont[6000-6035]
sequana_gpu                up   infinite        76/6/1/83 sdumont[8000-8027,8029-8045,...]
sequana_gpu_dev            up   infinite       50/10/0/60 sdumont[8029-8055,8061-8083,...]
sequana_gpu_long           up   infinite        76/6/1/83 sdumont[8000-8027,8029-8045,...]
lhc-alice                  up   infinite          0/1/0/1 sdumont6085
cptec                   inact   infinite        90/0/0/90 sdumont[6192-6251,...]
sd_gpu                  inact   infinite        57/4/1/62 sdumont[8000-8027,...]
ict_gpu                 inact   infinite        57/6/1/64 sdumont[8000-8027,...]
gdl                        up   infinite          0/1/0/1 sdumont4000
```

A notação `NODES(A/I/O/T)` corresponde a Allocated, Idle, Other e Total.

Observa-se que a `sequana_gpu_dev` dispõe de 60 nós, dos quais 10 estavam ociosos no momento da consulta, o que explica o tempo de espera nulo verificado nas submissões.

### 5.3 Configuração detalhada da partição de GPU

```bash
scontrol show partition sequana_gpu_dev
```

Saída:

```
PartitionName=sequana_gpu_dev
   AllowGroups=ALL AllowAccounts=ALL AllowQos=ALL
   AllocNodes=ALL Default=NO QoS=defaultgpu
   DefaultTime=00:20:00 DisableRootJobs=NO ExclusiveUser=NO GraceTime=0 Hidden=NO
   MaxNodes=UNLIMITED MaxTime=UNLIMITED MinNodes=0 LLN=NO
   MaxCPUsPerNode=UNLIMITED MaxCPUsPerSocket=UNLIMITED
   Nodes=sdumont[8029-8055,8061-8083,8085-8091,8093-8095]
   PriorityJobFactor=40 PriorityTier=40 RootOnly=NO ReqResv=NO OverSubscribe=NO
   OverTimeLimit=NONE PreemptMode=OFF
   State=UP TotalCPUs=2880 TotalNodes=60 SelectTypeParameters=NONE
   JobDefaults=DefCpuPerGPU=12,DefMemPerGPU=94000
   DefMemPerCPU=8000 MaxMemPerNode=UNLIMITED
   TRES=cpu=2880,mem=22500G,node=60,billing=2880,gres/gpu=240
```

**Pontos de destaque:**

- `MaxTime=UNLIMITED` no nível da partição. O limite de 20 minutos vem da associação do usuário, não da partição. Isso significa que a liberação de tempo maior é uma alteração administrativa de cota, não de configuração de fila.
- `DefCpuPerGPU=12` e `DefMemPerGPU=94000`. Ao solicitar 4 GPUs, o Slurm atribui por padrão 48 CPUs e cerca de 376 GB de memória, ou seja, o nó completo.
- `TRES` total da partição: 240 GPUs distribuídas em 60 nós.
- `PriorityTier=40`, valor comum às partições Sequana.

### 5.4 Inventário de hardware por nó

```bash
sinfo -p sequana_gpu_dev -N -o "%N %G %c %m %t" | head
```

Saída:

```
NODELIST     GRES         CPUS  MEMORY  STATE
sdumont8029  gpu:v100:4   48    384000  alloc
sdumont8030  gpu:v100:4   48    384000  alloc
sdumont8031  gpu:v100:4   48    384000  alloc
sdumont8032  gpu:v100:4   48    384000  alloc
sdumont8033  gpu:v100:4   48    384000  alloc
```

Cada nó dispõe de 4 GPUs NVIDIA V100, 48 CPUs e 384 GB de memória nominal.

### 5.5 Erro metodológico cometido: medição no nó de login

Neste ponto do trabalho foi cometido um erro que merece registro, porque é armadilha comum.

As diretivas `#SBATCH` foram coladas diretamente no terminal interativo. Como essas linhas são comentários para o shell, foram ignoradas, e os comandos `nvidia-smi` e `nvidia-smi topo -m` executaram no nó de login sdumont18, não em um nó de computação.

**Resultado obtido no nó de login (incorreto para fins de caracterização):**

```
Tesla V100-PCIE-32GB  x4
Afinidade de CPU: 0-21,44-65 e 22-43,66-87  (88 CPUs lógicas)
Topologia: SYS e NODE entre GPUs, sem NVLink
```

**Como o erro foi detectado.** A afinidade de CPU ia até o núcleo 87, indicando 88 CPUs lógicas, enquanto o `sinfo` reportava 48 CPUs nos nós da partição. A incompatibilidade revelou que se tratava de máquinas diferentes.

**Lições registradas:**

1. Diretivas `#SBATCH` só têm efeito quando o arquivo é entregue ao `sbatch`. Coladas no terminal, são comentários.
2. Nós de login e nós de computação têm hardware distinto. Caracterização deve sempre ser feita dentro de um job.
3. Execução de carga em nó de login é prática proibida na maioria dos centros de HPC e pode acarretar suspensão da conta.

### 5.6 Caracterização correta, via job

Script submetido (job 11551829):

```bash
#!/bin/bash
#SBATCH --job-name=peia-teste
#SBATCH --partition=sequana_gpu_dev
#SBATCH --nodes=1
#SBATCH --ntasks-per-node=1
#SBATCH --gres=gpu:4
#SBATCH --time=00:20:00
#SBATCH --output=/scratch/peia-hpc/bruno.menezes2/logs/%j.out

module load cuda/12.6_sequana
hostname
nproc
free -g
nvidia-smi
nvidia-smi topo -m
```

Alocado em sdumont8046, tempo de espera nulo.

**Saída de identificação e memória:**

```
sdumont8046
48
              total        used        free      shared  buff/cache   available
Mem:            376           2         372           0           1         371
Swap:             0           0           0
```

**Saída do nvidia-smi:**

```
NVIDIA-SMI 560.35.03    Driver Version: 560.35.03    CUDA Version: 12.6

GPU 0: Tesla V100-SXM2-32GB   Bus-Id 00000000:60:00.0   32768MiB   250-300W
GPU 1: Tesla V100-SXM2-32GB   Bus-Id 00000000:61:00.0   32768MiB
GPU 2: Tesla V100-SXM2-32GB   Bus-Id 00000000:88:00.0   32768MiB
GPU 3: Tesla V100-SXM2-32GB   Bus-Id 00000000:89:00.0   32768MiB
```

**Diferença crítica em relação ao nó de login:** as GPUs de computação são **SXM2**, não PCIe. O fator de forma SXM2 é o que habilita NVLink.

**Saída da topologia:**

```
        GPU0    GPU1    GPU2    GPU3    NIC0    NIC1    CPU Affinity  NUMA Affinity
GPU0     X      NV2     NV2     NV2     PIX     SYS     0-23          0
GPU1    NV2      X      NV2     NV2     PIX     SYS     0-23          0
GPU2    NV2     NV2      X      NV2     SYS     PIX     24-47         1
GPU3    NV2     NV2     NV2      X      SYS     PIX     24-47         1
NIC0    PIX     PIX     SYS     SYS      X      SYS
NIC1    SYS     SYS     PIX     PIX     SYS      X

NIC0: mlx5_0
NIC1: mlx5_1
```

**Interpretação da topologia:**

- `NV2` entre todos os pares de GPU significa dois enlaces NVLink agregados por par, em topologia all-to-all. Cada GPU utiliza 6 dos seus enlaces NVLink 2.0, dois para cada uma das três GPUs vizinhas.
- Não há hop de PCIe entre GPUs para comunicação ponto a ponto.
- As GPUs 0 e 1 pertencem ao nó NUMA 0 e estão em proximidade PCIe (`PIX`) com a placa InfiniBand `mlx5_0`.
- As GPUs 2 e 3 pertencem ao nó NUMA 1 e estão em proximidade com a `mlx5_1`.
- Essa afinidade importa para GPUDirect RDMA em execuções multi-nó, pois determina qual HCA deve servir cada GPU.

### 5.7 Contabilização da alocação

```bash
sacct -j 11551829 --format=JobID,JobName,Partition,AllocTRES%45,Elapsed,State
```

Saída:

```
JobID           JobName  Partition                    AllocTRES    Elapsed      State
------------ ---------- ---------- ---------------------------- ---------- ----------
11551829     peia-teste sequana_g+ billing=48,cpu=48,gres/gpu=4,   00:00:11  COMPLETED
                                   mem=376000M,node=1
```

Confirma-se que a solicitação de 4 GPUs resultou na alocação do nó completo: 48 CPUs, 4 GPUs, 376 GB. Como a cobrança é por `billing=48`, solicitar menos GPUs não gera economia. A prática recomendada passa a ser sempre requisitar `--gres=gpu:4`.

O tempo cobrado é o `Elapsed` efetivo, 11 segundos, e não o limite solicitado de 20 minutos.

### 5.8 Estrutura de armazenamento

```bash
df -h /prj /scratch
```

Saída:

```
Filesystem                                          Size  Used Avail Use% Mounted on
isilonsdnfs.sdumont.lncc.br:/ifs/prj                649T   99T  536T  16% /prj
172.20.230.12@o2ib:172.20.230.13@o2ib:/cstor2/lncc  1.4P  1.1P  267T  80% /scratch
```

Montagem observada dentro de job:

```
172.20.230.12@o2ib:172.20.230.13@o2ib:/cstor2/lncc on /scratch type lustre
(rw,checksum,flock,nouser_xattr,lruresize,lazystatfs,nouser_fid2path,verbose,noencrypt)
```

**Análise das opções de montagem do Lustre:**

| Opção | Implicação |
|---|---|
| `nouser_xattr` | Atributos estendidos de usuário desabilitados. Esta é a causa direta dos avisos de `xattr` observados na Fase 4 |
| `flock` | Travas de arquivo habilitadas, necessário para SQLite e alguns formatos de dataset |
| `checksum` | Verificação de integridade ativa, com custo de CPU |
| `lazystatfs` | Estatísticas de sistema de arquivos obtidas de forma preguiçosa, evita bloqueio se um OST estiver indisponível |

**Diretórios do projeto, criados em 16/07/2026:**

```
/prj/peia-hpc         drwxrwx---  root peia-hpc
/scratch/peia-hpc     drwxrwx---  root peia-hpc
```

**Identidade do usuário:**

```bash
id
# uid=65341(bruno.menezes2) gid=61715(peia-hpc) groups=61715(peia-hpc)
```

**Política de uso recomendada, dadas as características de cada storage:**

| Volume | Tecnologia | Uso adequado | Uso a evitar |
|---|---|---|---|
| `/prj` | NFS sobre Isilon | Código, resultados finais, arquivos de reconstrução de ambiente | Datasets acessados durante execução, ambientes Python com muitos arquivos pequenos |
| `/scratch` | Lustre | Datasets, checkpoints, ambientes de execução, saída de jobs | Armazenamento de longo prazo, dada a incerteza sobre política de expurgo |

**Ponto de atenção.** O `/scratch` estava com 80% de ocupação. Não há restrição imediata, mas convém não deixar dados intermediários parados.

---

## 6. Fase 4: Tentativa de ambiente conteinerizado

Esta fase resultou em fracasso. É documentada integralmente porque o diagnóstico produzido é o insumo técnico para o chamado ao Helpdesk, e porque as tentativas realizadas eliminam caminhos que outros membros do projeto não precisam repetir.

### 6.1 Justificativa técnica da escolha inicial por container

A opção por container foi motivada por quatro razões:

1. **Ausência de internet nos nós de computação para instalação.** O ambiente precisa estar completo antes do início do job.
2. **Padrão de acesso adverso ao Lustre.** Um ambiente conda com PyTorch cria da ordem de 10⁵ arquivos pequenos. O Lustre é otimizado para poucos arquivos grandes lidos em paralelo, e degrada com o padrão oposto. O tempo de `import torch` pode ir de segundos a dezenas de segundos.
3. **Reprodutibilidade para o curso.** O PEIA-HPC é projeto de formação. Um arquivo `.sif` único, com hash verificável, é artefato distribuível a alunos.
4. **Isolamento de dependências.** Elimina conflitos com módulos do sistema.

### 6.2 Levantamento do que já existe no cluster

```bash
module avail pytorch
# No module(s) or extension(s) found!

module avail singularity
# parabricks/2.5.0_singularity_sequana
# parabricks/3.0_singularity_sequana (D)

which singularity apptainer
# /usr/bin/singularity

singularity --version
# singularity-ce version 4.2.1-1
```

Não há módulo de PyTorch instalado no cluster. O Singularity CE 4.2.1 está disponível como binário do sistema, acessível a todos os usuários.

Módulos de CUDA disponíveis em `/petrobr/app_sequana/modulos2`, recorte relevante:

```
cuda/10.1_sequana        cuda/11.0_sequana       cuda/11.4_sequana
cuda/10.2_sequana        cuda/11.1_sequana       cuda/12.6_sequana (D)
cuda/11.2_sequana

cudnn/7.6_cuda-10.1_sequana      cudnn/8.2_cuda-11.1_sequana
cudnn/8.0_cuda-10.1_sequana      cudnn/9.21_cuda-12.6_sequana (D)

nccl/2.4_cuda-10.0_sequana       nccl/2.13_cuda-11.2_sequana (D)

nvhpc/2025_cuda-12.9 (D)
anaconda3/2024.02_sequana (D)
```

Nota-se que o módulo NCCL padrão é compilado para CUDA 11.2, enquanto o CUDA padrão é 12.6. Essa incompatibilidade é irrelevante para PyTorch instalado via wheel, que embarca sua própria versão de NCCL.

### 6.3 Mapeamento de conectividade externa a partir do nó de login

```bash
curl -sI https://pypi.org | head -1
# HTTP/2 200

curl -sI https://download.pytorch.org | head -1
# HTTP/2 403

curl -sI https://download.pytorch.org/whl/cu126/ | head -1
# HTTP/2 200

curl -sI https://huggingface.co | head -1
# HTTP/2 200

curl -sI https://registry-1.docker.io/v2/ | head -1
# HTTP/2 401
```

**Interpretação de cada código:**

| Destino | Código | Leitura |
|---|---|---|
| `pypi.org` | 200 | Acessível |
| `download.pytorch.org` (raiz) | 403 | Falso negativo. É bucket sem página raiz, HEAD na raiz retorna 403 por design |
| `download.pytorch.org/whl/cu126/` | 200 | Índice de wheels acessível |
| `huggingface.co` | 200 | Acessível |
| `registry-1.docker.io/v2/` | 401 | Resposta esperada do Docker Registry API v2 sem token. Indica registry alcançável, não bloqueio |

**Lição registrada.** Códigos HTTP 401 e 403 em endpoints de API não significam bloqueio de rede. Testar sempre o caminho real do recurso, não apenas a raiz do domínio.

### 6.4 Determinação da versão de PyTorch compatível com Volta

As GPUs V100 têm compute capability 7.0 (`sm_70`), arquitetura Volta. Foi necessário verificar se as versões recentes de PyTorch ainda incluem kernels para essa arquitetura.

**Achado documental.** A partir do PyTorch 2.11, os binários pré-compilados de CUDA 12.8 e 12.9 deixaram de incluir suporte a Volta. A mudança foi necessária para permitir atualização ao cuDNN 9.15.1, que é incompatível com Volta. Usuários com V100 que precisam de CUDA 12.8 ou superior devem usar os builds de CUDA 12.6, que mantêm o suporte.

**Consequência prática.** A instalação deve obrigatoriamente usar o índice `cu126`. Esse detalhe deve constar da documentação do curso, pois é exatamente o tipo de restrição que quebra o ambiente quando alguém atualiza para a versão mais recente.

**Achado adicional relevante.** O vLLM também abandonou o suporte a Volta. Há relatos de falha de instalação do vLLM 0.20 em servidores com V100 por ausência de suporte a `sm_70`. Se o curso previa demonstração de serving de LLM, o planejamento precisa considerar Transformers puro, TGI em versão compatível ou llama.cpp.

### 6.5 Seleção da imagem

Consulta às tags disponíveis via API do Docker Hub, executada a partir do nó de login:

```bash
curl -s "https://hub.docker.com/v2/repositories/pytorch/pytorch/tags/?page_size=100&ordering=last_updated" \
  | python3 -c "import sys,json;[print(t['name']) for t in json.load(sys.stdin)['results']]" \
  | grep cuda12.6
```

Saída:

```
2.13.0-cuda12.6-cudnn9-devel     2.13.0-cuda12.6-cudnn9-runtime
2.12.1-cuda12.6-cudnn9-devel     2.12.1-cuda12.6-cudnn9-runtime
2.12.0-cuda12.6-cudnn9-devel     2.12.0-cuda12.6-cudnn9-runtime
2.11.0-cuda12.6-cudnn9-devel     2.11.0-cuda12.6-cudnn9-runtime
2.10.0-cuda12.6-cudnn9-devel     2.10.0-cuda12.6-cudnn9-runtime
2.9.1-cuda12.6-cudnn9-devel      2.9.1-cuda12.6-cudnn9-runtime
2.9.0-cuda12.6-cudnn9-devel      2.9.0-cuda12.6-cudnn9-runtime
2.8.0-cuda12.6-cudnn9-devel      2.8.0-cuda12.6-cudnn9-runtime
2.7.1-cuda12.6-cudnn9-devel      2.7.1-cuda12.6-cudnn9-runtime
2.7.0-cuda12.6-cudnn9-devel      2.7.0-cuda12.6-cudnn9-runtime
2.6.0-cuda12.6-cudnn9-devel      2.6.0-cuda12.6-cudnn9-runtime
```

**Critérios de escolha aplicados:**

- Variante `devel` em vez de `runtime`, para dispor do `nvcc`, necessário à compilação de extensões como DeepSpeed, xformers e bitsandbytes.
- Versão 2.11.0, por ser a versão com suporte a Volta documentado na linha cu126, e por estar suficientemente estabelecida para que o ecossistema de bibliotecas auxiliares já a acompanhe.

Imagem selecionada: `pytorch/pytorch:2.11.0-cuda12.6-cudnn9-devel`

### 6.6 Preparação do ambiente de construção

```bash
export SCR=/scratch/peia-hpc/$USER
export SINGULARITY_CACHEDIR=$SCR/.singularity
export SINGULARITY_TMPDIR=$SCR/.singularity/tmp
mkdir -p $SINGULARITY_TMPDIR $SCR/img
```

O redirecionamento de cache e diretório temporário é obrigatório. Sem ele, o Singularity utiliza `$HOME/.singularity`, que reside no NFS, e o volume de arquivos temporários da extração degrada o storage compartilhado.

### 6.7 Primeira tentativa: erro de sintaxe

```bash
singularity pull $SCR/img/pytorch.sif docker://pytorch/pytorch:TAG
```

Saída:

```
WARNING: Couldn't use cached digest for registry: HEAD
https://index.docker.io/v2/pytorch/pytorch/manifests/TAG: unexpected status code 404 Not Found
FATAL: While making image from oci registry: error fetching image:
failed to get checksum for docker://pytorch/pytorch:TAG:
GET https://index.docker.io/v2/pytorch/pytorch/manifests/TAG:
MANIFEST_UNKNOWN: manifest unknown; unknown tag=TAG
```

Erro trivial: `TAG` era marcador de posição literal, não substituído por tag real.

### 6.8 Segunda tentativa: avisos de xattr e queda de conexão

```bash
singularity pull $SCR/img/pytorch-2.11-cu126.sif \
  docker://pytorch/pytorch:2.11.0-cuda12.6-cudnn9-devel
```

Progresso do download das camadas:

```
INFO: Converting OCI blobs to SIF format
INFO: Starting build...
INFO: Fetching OCI image...
29.2MiB / 29.2MiB [====] 100 %
36.8MiB / 36.8MiB [====] 100 %
4.0GiB / 4.0GiB   [====] 100 %
24.5MiB / 24.5MiB [====] 100 %
3.4GiB / 3.4GiB   [====] 100 %
4.3GiB / 4.3GiB   [====] 100 %
62.7MiB / 62.7MiB [====] 100 %
INFO: Extracting OCI image...
```

Total aproximado de 12 GB de camadas comprimidas.

Avisos durante a extração:

```
warn xattr{etc/gshadow} ignoring ENOTSUP on setxattr "user.rootlesscontainers"
warn xattr{/scratch/.../rootfs/etc/gshadow} destination filesystem does not
support xattrs, further warnings will be suppressed
```

**Diagnóstico dos avisos.** São inofensivos. Decorrem diretamente da opção de montagem `nouser_xattr` do Lustre, identificada na seção 5.8. O Singularity utiliza atributos estendidos para preservar metadados de usuário em containers rootless. Como o `.sif` final é um squashfs único, esses atributos não são necessários em tempo de execução.

**Falha:** a sessão SSH caiu durante a etapa `Inserting Singularity configuration`, e o processo, preso à sessão, foi terminado. Nenhum arquivo `.sif` foi produzido.

```
INFO: Inserting Singularity configuration...
client_loop: send disconnect: Connection reset
```

### 6.9 Diagnóstico das quedas de conexão

Ao reconectar, a sessão SSH falhou novamente com `Corrupted MAC on input`, confirmando que as quedas eram manifestação do mesmo problema de MTU identificado na seção 4.2, e não eventos isolados.

Ao longo da sessão de trabalho ocorreram cinco quedas, todas durante operações de longa duração.

### 6.10 Proteção do processo contra desconexão

Verificação de multiplexadores disponíveis:

```bash
which tmux screen
# /usr/bin/which: no tmux in (...)
# /usr/bin/screen
```

O `tmux` não está instalado. O `screen` está disponível.

**Advertência operacional descoberta na prática.** As sessões do `screen` são locais ao nó. O socket reside em `/run/screen/S-<usuario>` de cada nó de login. Uma sessão criada no sdumont17 não é visível a partir do sdumont18. Ao reconectar, é necessário identificar o nó com `hostname` e, se preciso, saltar com `ssh sdumont17`.

Como a sessão de `screen` criada não sobreviveu a uma das quedas, optou-se por `nohup`:

```bash
nohup singularity pull $SCR/img/pytorch-2.11-cu126.sif \
  docker://pytorch/pytorch:2.11.0-cuda12.6-cudnn9-devel \
  > $SCR/pull.log 2>&1 &
```

O log em `/scratch` é legível a partir de qualquer nó, já que o Lustre é compartilhado. Apenas o processo é local.

### 6.11 Falha definitiva no nó de login: mksquashfs terminado por sinal

O processo protegido por `nohup` avançou até a etapa final e foi terminado:

```bash
grep -iE "fatal|error|killed|no space" $SCR/pull.log
```

Saída:

```
FATAL: While making image from oci registry: error fetching image:
while building SIF from layers: while creating squashfs:
create command failed: signal: killed:
```

Últimas linhas do log antes da terminação:

```
Unrecognised xattr prefix lustre.lov
Unrecognised xattr prefix lustre.lov
[repetido]
```

Essas linhas são emitidas pelo `mksquashfs` ao encontrar atributos estendidos específicos do Lustre (`lustre.lov`, que descreve o layout de striping do objeto). São avisos, não erros.

**Diagnóstico.** O `mksquashfs` recebeu SIGKILL. As causas possíveis são:

1. Vigia de recursos do nó de login terminando processo de CPU intensiva prolongada
2. OOM killer, dado que a compressão de aproximadamente 36 GB descomprimidos consome memória significativa
3. Política administrativa de limitação de processos em nó compartilhado

Espaço em disco foi descartado como causa: 267 TB livres no `/scratch`.

### 6.12 Tentativa de contenção de recursos

```bash
export SINGULARITY_MKSQUASHFS_MEM=2G
export SINGULARITY_MKSQUASHFS_PROCS=2
nohup singularity pull $SCR/img/pytorch-2.11-cu126.sif \
  docker://pytorch/pytorch:2.11.0-cuda12.6-cudnn9-devel \
  > $SCR/pull2.log 2>&1 &
```

Resultado idêntico:

```
INFO: Converting OCI blobs to SIF format
INFO: Starting build...
INFO: Fetching OCI image...
INFO: Extracting OCI image...
INFO: Inserting Singularity configuration...
INFO: Creating SIF file...
FATAL: While making image from oci registry: error fetching image:
while building SIF from layers: while creating squashfs:
create command failed: signal: killed:
```

**Conclusão.** Ou o SingularityCE 4.2.1 não honra essas variáveis de ambiente, ou a terminação não é motivada por consumo de memória. Em qualquer hipótese, a construção no nó de login é inviável e reprodutível na falha.

### 6.13 Transferência da construção para nó de computação

Estratégia: a etapa de compressão é uso intensivo de CPU e memória, portanto pertence a um job. Script submetido (job 11552004), na fila de CPU para não consumir a vaga de GPU:

```bash
#!/bin/bash
#SBATCH --job-name=build-sif
#SBATCH --partition=sequana_cpu_dev
#SBATCH --nodes=1
#SBATCH --time=00:20:00
#SBATCH --output=/scratch/peia-hpc/bruno.menezes2/logs/%j.out

SCR=/scratch/peia-hpc/$USER
export SINGULARITY_CACHEDIR=$SCR/.singularity
export SINGULARITY_TMPDIR=$SCR/.singularity/tmp

curl -sI --max-time 10 https://registry-1.docker.io/v2/ | head -1
singularity pull $SCR/img/pytorch-2.11-cu126.sif \
  docker://pytorch/pytorch:2.11.0-cuda12.6-cudnn9-devel
```

Saída:

```
HTTP/2 401
INFO:    Converting OCI blobs to SIF format
INFO:    Starting build...
INFO:    Fetching OCI image...
FATAL:   While making image from oci registry: error fetching image:
while building SIF from layers: conveyor failed to get:
Get "https://auth.docker.io/token?scope=repository%3Apytorch%2Fpytorch%3Apull&service=registry.docker.io":
tls: failed to verify certificate: x509: certificate signed by unknown authority
```

**Duas informações extraídas simultaneamente:**

1. O `curl` retornou 401 contra `registry-1.docker.io`, provando que os nós de computação **têm** acesso à internet.
2. A falha é de validação TLS contra `auth.docker.io`, um host distinto.

### 6.14 Diagnóstico da falha TLS

Job de diagnóstico submetido (11552006):

```bash
env | grep -i proxy
ls -l /etc/pki/tls/certs/ca-bundle.crt /etc/ssl/certs/ca-certificates.crt 2>&1
curl -sIv --max-time 10 https://auth.docker.io/v2/ 2>&1 | grep -iE "issuer|subject|proxy"
```

Saída:

```
ls: cannot access '/etc/ssl/certs/ca-certificates.crt': No such file or directory
lrwxrwxrwx 1 root root 49 Aug  3  2023 /etc/pki/tls/certs/ca-bundle.crt ->
  /etc/pki/ca-trust/extracted/pem/tls-ca-bundle.pem
```

**Análise das três evidências:**

1. **Nenhuma variável de proxy no ambiente.** Descarta a hipótese de proxy explícito não herdado pelo processo.
2. **Bundle de CA presente no caminho canônico do RHEL.** O `/etc/pki/tls/certs/ca-bundle.crt` é um dos caminhos que a biblioteca `crypto/x509` do Go consulta por padrão. Isso enfraquece a hipótese de que apenas definir `SSL_CERT_FILE` resolveria.
3. **Ausência total de saída do grep por issuer e subject.** Se o handshake TLS tivesse ocorrido, mesmo com certificado inválido, o `curl -v` teria emitido linhas de certificado. A ausência sugere que a conexão com `auth.docker.io` sequer se estabelece, ao contrário de `registry-1.docker.io`, que respondeu 401.

**Conclusão do diagnóstico.** Trata-se de filtragem seletiva por destino na rede dos nós de computação, e não de problema de cadeia de certificados. É política de infraestrutura, fora do alcance do usuário.

### 6.15 Caminho alternativo avaliado e descartado

A estratégia de separar as fases, baixando o layout OCI no nó de login (que tem acesso ao `auth.docker.io`) e convertendo para `.sif` dentro de um job (que tem CPU e memória), exigiria o `skopeo`:

```bash
skopeo copy docker://pytorch/pytorch:2.11.0-cuda12.6-cudnn9-devel \
  oci:$SCR/oci/pytorch:2.11
singularity build $SCR/img/pytorch.sif oci:$SCR/oci/pytorch:2.11
```

Verificação:

```bash
which skopeo
# /usr/bin/which: no skopeo in (...)
```

O `skopeo` não está instalado no sistema. Restariam duas opções: obter binário estático a partir de releases no GitHub, ou solicitar instalação ao Helpdesk. Ambas foram adiadas em favor do caminho que efetivamente funcionou.

### 6.16 Resumo do bloqueio

| Local | Etapa que falha | Causa |
|---|---|---|
| Nó de login | Compressão squashfs | Processo terminado por SIGKILL, reprodutível |
| Nó de computação | Autenticação no registry | Filtragem de rede para `auth.docker.io` |

Ambos os obstáculos são de natureza institucional. A construção de container permanece pendente de resposta do Helpdesk.

**Tempo consumido na Fase 4:** aproximadamente 2 horas e 30 minutos, distribuídas entre a noite de 23/07 e a manhã de 24/07.

---

## 7. Fase 5: Ambiente virtual Python

### 7.1 Revisão da decisão técnica

A escolha inicial por container fundamentava-se, entre outros pontos, na preocupação com o volume de arquivos pequenos gerados por ambientes Python no Lustre. Diante de dois bloqueios de infraestrutura reprodutíveis, essa preocupação foi reavaliada e considerada de peso excessivo frente ao custo de manter o projeto parado.

**Fundamentação da revisão.** Um ambiente virtual de usuário único fica na ordem de 10⁴ arquivos, não 10⁵ ou 10⁶. Esse volume o Lustre suporta sem degradação relevante para os demais usuários. O container continua sendo o formato correto para distribuição aos alunos do curso, mas essa é necessidade futura, não presente.

### 7.2 Construção do ambiente

```bash
export SCR=/scratch/peia-hpc/$USER
module load anaconda3/2024.02_sequana
python -m venv $SCR/envs/llm
source $SCR/envs/llm/bin/activate
pip install --upgrade pip
```

Resultado: `pip` atualizado de 23.2.1 para 26.1.2.

Python de base: 3.11, provido pelo módulo `anaconda3/2024.02_sequana`.

**Nota sobre a escolha de `venv` em vez de `conda create`.** O `venv` produz ambiente mais enxuto, sem duplicar bibliotecas de sistema, e evita a necessidade de inicializar o shell do conda em cada script de submissão. Como o Python base vem do módulo, basta carregá-lo antes de ativar o ambiente.

### 7.3 Instalação do PyTorch

```bash
pip install torch --index-url https://download.pytorch.org/whl/cu126
```

Pacotes instalados, com versões exatas:

```
torch                      2.13.0+cu126
triton                     3.7.1
cuda-toolkit               12.6.3
cuda-bindings              12.9.4
cuda-pathfinder            1.2.2
nvidia-cublas-cu12         12.6.4.1
nvidia-cuda-cupti-cu12     12.6.80
nvidia-cuda-nvrtc-cu12     12.6.85
nvidia-cuda-runtime-cu12   12.6.77
nvidia-cudnn-cu12          9.10.2.21
nvidia-cufft-cu12          11.3.0.4
nvidia-cufile-cu12         1.11.1.6
nvidia-curand-cu12         10.3.7.77
nvidia-cusolver-cu12       11.7.1.2
nvidia-cusparse-cu12       12.5.4.2
nvidia-cusparselt-cu12     0.7.1
nvidia-nccl-cu12           2.29.3
nvidia-nvjitlink-cu12      12.6.85
nvidia-nvshmem-cu12        3.4.5
nvidia-nvtx-cu12           12.6.77
filelock                   3.29.0
fsspec                     2026.4.0
jinja2                     3.1.6
MarkupSafe                 3.0.3
mpmath                     1.3.0
networkx                   3.6.1
setuptools                 78.1.0
sympy                      1.14.0
typing-extensions          4.15.0
```

Volume de download: aproximadamente 3,2 GB, dominado por `nvidia-cudnn-cu12` (706,8 MB), `nvidia-cublas-cu12` (393,1 MB), `nvidia-nccl-cu12` (289,8 MB), `nvidia-cusparselt-cu12` (287,2 MB) e o próprio `torch` (843,7 MB).

**Observação favorável.** A versão de cuDNN embarcada é a 9.10.2.21, anterior à 9.15.1 que motivou a remoção do suporte a Volta nos builds de CUDA 12.8 e superiores. Isso é indício de compatibilidade, mas não prova. A validação empírica era necessária.

### 7.4 Validação de compatibilidade com Volta

Script submetido (job 11552013):

```bash
#!/bin/bash
#SBATCH --job-name=valida-torch
#SBATCH --partition=sequana_gpu_dev
#SBATCH --nodes=1
#SBATCH --gres=gpu:4
#SBATCH --time=00:20:00
#SBATCH --output=/scratch/peia-hpc/bruno.menezes2/logs/%j.out

module load anaconda3/2024.02_sequana
source /scratch/peia-hpc/$USER/envs/llm/bin/activate
python - << 'PY'
import torch
print("torch", torch.__version__, "cuda", torch.version.cuda)
print("archs", torch.cuda.get_arch_list())
print("gpus", torch.cuda.device_count())
print("name", torch.cuda.get_device_name(0))
x = torch.randn(8192, 8192, device="cuda", dtype=torch.float16)
print("matmul", float((x @ x).float().abs().mean()))
PY
```

Saída:

```
UserWarning: Failed to initialize NumPy: No module named 'numpy'
torch 2.13.0+cu126 cuda 12.6
archs ['sm_50', 'sm_60', 'sm_70', 'sm_75', 'sm_80', 'sm_86', 'sm_90']
gpus 4
name Tesla V100-SXM2-32GB
matmul 72.20170593261719
```

**Análise dos resultados:**

1. **`sm_70` presente na lista de arquiteturas.** O binário do PyTorch 2.13.0+cu126 inclui kernels compilados para Volta. A precaução quanto à necessidade de fixar a versão 2.11 mostrou-se desnecessária.

2. **Quatro GPUs detectadas**, identificadas corretamente como V100-SXM2-32GB.

3. **Validação numérica do matmul.** O valor 72,2 não é apenas indicação de que a operação não falhou. Para o produto de duas matrizes 8192 × 8192 de normais padrão independentes, cada elemento do resultado é soma de 8192 produtos de variáveis normais padrão, com variância 8192 e desvio-padrão aproximado de 90,5. O valor esperado do módulo de uma normal centrada é o desvio-padrão multiplicado pela raiz de 2 sobre pi, resultando em aproximadamente 72,2. O cálculo está, portanto, numericamente correto, e não apenas executando sem exceção.

**Alerta de NumPy.** A ausência do NumPy gerou aviso, sem impedir a execução. Corrigida em seguida.

### 7.5 Complementação do ambiente

```bash
pip install numpy transformers datasets accelerate sentencepiece
```

Pacotes principais instalados:

```
transformers      5.14.1
datasets          5.0.0
accelerate        1.14.0
tokenizers        0.22.2
huggingface-hub   1.24.0
safetensors       0.8.0
sentencepiece     0.2.2
numpy             2.4.6
pandas            3.0.5
pyarrow           25.0.0
regex             2026.7.19
requests          2.34.2
tqdm              4.69.0
pyyaml            6.0.3
aiohttp           3.14.3
dill              0.4.1
multiprocess      0.70.19
xxhash            3.8.1
psutil            7.2.2
hf-xet            1.5.2
httpx             0.28.1
httpcore          1.0.9
certifi           2026.7.22
urllib3           2.7.0
rich              15.0.0
typer             0.27.0
```

### 7.6 Congelamento do estado

```bash
pip freeze > /prj/peia-hpc/$USER/requirements-cu126.txt
```

O arquivo de reconstrução foi gravado no `/prj`, storage persistente, e não no `/scratch`, cuja política de expurgo é desconhecida. Essa separação é deliberada: o ambiente vive no scratch por desempenho, a receita de reconstrução vive no NFS por durabilidade.

### 7.7 Variáveis de ambiente fixadas

Conteúdo acrescentado ao `~/.bashrc` no cluster:

```bash
export SCR=/scratch/peia-hpc/$USER
export SINGULARITY_CACHEDIR=$SCR/.singularity
export SINGULARITY_TMPDIR=$SCR/.singularity/tmp
export HF_HOME=$SCR/.hf
export PIP_CACHE_DIR=$SCR/.pip-cache
```

**Justificativa de cada variável:**

| Variável | Função |
|---|---|
| `SCR` | Abreviação do caminho de trabalho, usada em todos os scripts |
| `SINGULARITY_CACHEDIR` | Mantém cache de camadas OCI fora do NFS |
| `SINGULARITY_TMPDIR` | Direciona a extração temporária ao Lustre, onde há espaço |
| `HF_HOME` | Redireciona o cache de modelos e datasets do Hugging Face, que pode alcançar dezenas de gigabytes |
| `PIP_CACHE_DIR` | Mantém wheels em cache fora do home |

O `PATH` do usuário aponta para `/prj/peia-hpc/bruno.menezes2/.local/bin` e `/prj/peia-hpc/bruno.menezes2/bin`, confirmando que o home reside no NFS. Isso reforça a necessidade dos redirecionamentos acima.

**Tempo consumido na Fase 5:** aproximadamente 25 minutos.

---

## 8. Fase 6: Benchmarks de comunicação e throughput

### 8.1 Objetivo dos benchmarks

Duas grandezas foram medidas, com finalidades distintas:

1. **Largura de banda efetiva de all-reduce.** Determina se a comunicação entre GPUs é gargalo, e valida se o NVLink identificado na topologia está sendo efetivamente utilizado pelo NCCL.
2. **Throughput de treinamento em tokens por segundo.** Converte a capacidade da máquina em unidade diretamente utilizável para dimensionar horas de GPU necessárias.

### 8.2 Benchmark de all-reduce NCCL, nó único

Código (`$SCR/bench-nccl.py`):

```python
import os, time, torch, torch.distributed as dist
dist.init_process_group("nccl")
rank, world = dist.get_rank(), dist.get_world_size()
torch.cuda.set_device(int(os.environ["LOCAL_RANK"]))
for mb in [64, 256, 1024]:
    x = torch.ones(mb*1024*1024//2, dtype=torch.float16, device="cuda")
    for _ in range(5): dist.all_reduce(x)
    torch.cuda.synchronize(); t = time.time()
    for _ in range(20): dist.all_reduce(x)
    torch.cuda.synchronize(); dt = (time.time()-t)/20
    bus = 2*(world-1)/world*(mb/1024)/dt
    if rank == 0: print(f"{mb} MB  {dt*1000:.2f} ms  busbw {bus:.1f} GB/s")
dist.destroy_process_group()
```

**Nota metodológica sobre a métrica.** A largura de banda de barramento (busbw) para all-reduce em anel é calculada como o volume de dados multiplicado por 2(N-1)/N e dividido pelo tempo, onde N é o número de participantes. O fator decorre da estrutura do algoritmo, que executa uma fase de reduce-scatter e uma de all-gather, cada uma movendo (N-1)/N do volume total. Essa métrica é comparável entre topologias, diferentemente da largura de banda de algoritmo (algbw).

Script de submissão (`$SCR/bench-nccl.sh`), job 11552022:

```bash
#!/bin/bash
#SBATCH --job-name=bench-nccl
#SBATCH --partition=sequana_gpu_dev
#SBATCH --nodes=1
#SBATCH --gres=gpu:4
#SBATCH --time=00:20:00
#SBATCH --output=/scratch/peia-hpc/bruno.menezes2/logs/%j.out

SCR=/scratch/peia-hpc/$USER
module load anaconda3/2024.02_sequana
source $SCR/envs/llm/bin/activate
export NCCL_DEBUG=INFO
torchrun --nproc_per_node=4 $SCR/bench-nccl.py
```

### 8.3 Resultados de all-reduce

```
64 MB     0.94 ms   busbw 100.0 GB/s
256 MB    3.49 ms   busbw 107.4 GB/s
1024 MB  13.29 ms   busbw 112.9 GB/s
```

**Interpretação.** Os valores estão próximos do teto prático do NVLink 2.0 em configuração de 4 GPUs V100 SXM2. O crescimento da banda com o tamanho da mensagem é o comportamento esperado, dado que a latência fixa se dilui em transferências maiores.

### 8.4 Evidências extraídas do log do NCCL

O log com `NCCL_DEBUG=INFO` fornece confirmações importantes:

```
NCCL version 2.29.3+cuda12.9
Bootstrap: Using ib0:172.20.15.47<0>
NET/IB : Using [0]mlx5_0:1/IB [1]mlx5_1:1/IB [RO]; OOB ib0:172.20.15.47<0>
comm rank 0 nRanks 4 nNodes 1 localRanks 4 localRank 0 MNNVL 0
Channel 00/12 : 0 1 2 3
[... 12 canais no total ...]
Check P2P Type isAllDirectP2p 1 directMode 0 isAllCudaP2p 1
Channel 00/0 : 0[0] -> 1[1] via P2P/CUMEM
Connected all rings, use ring PXN 0 GDR 1
NVLS multicast support is not available on dev 0 (NVLS_NCHANNELS 0)
Skipping symmetric kernel 29 which requires driver 12070
ncclTopoGetCpuAffinity: Affinity for GPU 0 is 0-23
ncclTopoGetCpuAffinity: Affinity for GPU 3 is 24-47
```

**Leitura item a item:**

| Evidência | Significado |
|---|---|
| `via P2P/CUMEM` em todos os canais | Comunicação direta entre GPUs, sem passar por memória do host. Confirma uso do NVLink |
| `isAllDirectP2p 1` | Todos os pares têm caminho P2P direto, coerente com a topologia NV2 all-to-all |
| 12 canais de coletiva | O NCCL construiu 12 anéis distintos, explorando a topologia densa |
| `GDR 1` | GPUDirect RDMA habilitado, relevante para execução multi-nó |
| `NVLS não disponível` | NVLink SHARP requer Hopper ou superior. Esperado em Volta |
| `Skipping symmetric kernel ... requires driver 12070` | Kernels simétricos requerem driver 12.7. O nó tem 12.6. Perda de otimização, sem impacto funcional |
| Afinidade 0-23 e 24-47 | Coerente com a divisão NUMA identificada na topologia |
| `Bootstrap: Using ib0` | O rendezvous inicial usa a interface IP sobre InfiniBand |

### 8.5 Benchmark de throughput de treinamento

Código (`$SCR/bench-train.py`):

```python
import os, time, torch, torch.distributed as dist
from torch.nn.parallel import DistributedDataParallel as DDP
from transformers import GPT2Config, GPT2LMHeadModel

dist.init_process_group("nccl")
rank, world = dist.get_rank(), dist.get_world_size()
local = int(os.environ["LOCAL_RANK"]); torch.cuda.set_device(local)

cfg = GPT2Config(n_layer=24, n_head=16, n_embd=1024, n_positions=1024)
model = GPT2LMHeadModel(cfg).cuda()
if rank == 0:
    print("params (M)", sum(p.numel() for p in model.parameters())/1e6)
model = DDP(model, device_ids=[local])
opt = torch.optim.AdamW(model.parameters(), lr=1e-4)
scaler = torch.amp.GradScaler("cuda")

B, T = 4, 1024
x = torch.randint(0, cfg.vocab_size, (B, T), device="cuda")
def step():
    opt.zero_grad(set_to_none=True)
    with torch.autocast("cuda", dtype=torch.float16):
        loss = model(x, labels=x).loss
    scaler.scale(loss).backward(); scaler.step(opt); scaler.update()

for _ in range(5): step()
torch.cuda.synchronize(); t = time.time()
N = 20
for _ in range(N): step()
torch.cuda.synchronize(); dt = time.time() - t

if rank == 0:
    tok = B * T * world * N / dt
    print(f"tokens/s {tok:,.0f}   passo {dt/N*1000:.0f} ms")
    print(f"pico VRAM {torch.cuda.max_memory_allocated()/1e9:.1f} GB")
dist.destroy_process_group()
```

**Decisões de projeto do benchmark:**

- **Configuração instanciada localmente**, via `GPT2Config`, sem download de pesos. Elimina dependência de rede no nó de computação e torna o teste reprodutível.
- **Dados sintéticos**, com `torch.randint`. O objetivo é medir capacidade computacional, não pipeline de dados. Isolar as variáveis é deliberado.
- **Cinco passos de aquecimento** antes da medição, para excluir compilação de kernels, alocação inicial de memória e estabelecimento dos buffers do NCCL.
- **Precisão mista fp16 com GradScaler.** As V100 não têm suporte nativo a bf16, portanto fp16 com escalonamento de perda é o caminho obrigatório.
- **Sincronização explícita de CUDA** antes e depois da medição, pois as operações são assíncronas.

### 8.6 Resultado em nó único (job 11552024)

```
params (M) 354.823168
tokens/s 40,967   passo 400 ms
pico VRAM 18.0 GB
```

**Análise:**

| Grandeza | Valor | Observação |
|---|---|---|
| Parâmetros | 354,8 M | Configuração equivalente a GPT-2 Medium |
| Throughput agregado | 40.967 tokens/s | 4 GPUs |
| Throughput por GPU | ~10.242 tokens/s | |
| Tempo de passo | 400 ms | Batch global de 16.384 tokens |
| Pico de VRAM | 18,0 GB | De 32 GB disponíveis por GPU |

O consumo de 18 GB para um modelo de 355 M em DDP decorre da soma de pesos em fp32, gradientes, estados do otimizador AdamW (dois momentos em fp32) e ativações. Essa proporção indica que o DDP puro deixa de caber em 32 GB para modelos acima de aproximadamente 1 bilhão de parâmetros, exigindo ZeRO ou FSDP a partir dessa escala.

### 8.7 Incidente durante a preparação do teste multi-nó

Primeira submissão do benchmark (job 11552019) falhou:

```
python: can't open file '/prj/peia-hpc/bruno.menezes2/bench-nccl.py':
[Errno 2] No such file or directory
```

O arquivo existia, com data de modificação 08:24, e o job executou às 08:25.

**Diagnóstico.** Job posterior confirmou que o `/prj` **é** acessível a partir dos nós de computação, mediante `ls -d`. A hipótese mais provável é atraso de propagação de metadados no NFS entre o nó de login e o nó de computação, agravada pelo intervalo de apenas um minuto entre gravação e leitura.

**Nota de correção.** A hipótese inicialmente levantada, de que o `/prj` não estaria montado nos nós de cálculo, mostrou-se incorreta. Registra-se a correção porque a conclusão errada teria implicações relevantes sobre a organização dos dados.

**Prática adotada em consequência:** manter scripts e dados de execução no `/scratch`, com caminho absoluto, e usar o `/prj` apenas para arquivos de reconstrução e resultados finais.

### 8.8 Resultado em dois nós (job 11552027)

Configuração de lançamento:

```bash
#SBATCH --nodes=2
srun torchrun --nnodes=2 --nproc_per_node=4 --rdzv_backend=c10d \
  --rdzv_endpoint=$(scontrol show hostnames $SLURM_JOB_NODELIST | head -1):29500 \
  $SCR/bench-train.py
```

Nós alocados: sdumont8051 e sdumont8052.

Saída:

```
params (M) 354.823168
tokens/s 76,991   passo 426 ms
pico VRAM 18.0 GB
```

**Cálculo da eficiência de escala:**

```
Escala ideal ....... 2 × 40.967 = 81.934 tokens/s
Medido ............. 76.991 tokens/s
Eficiência ......... 76.991 / 81.934 = 93,97%
Sobrecarga no passo. (426 - 400) / 400 = 6,5%
```

**Interpretação.** A eficiência de 94% em dois nós indica que a InfiniBand não é gargalo nesta escala. O acréscimo de 26 ms no tempo de passo corresponde à comunicação inter-nó do gradiente, que para um modelo de 355 M em fp16 representa cerca de 710 MB por passo de all-reduce.

### 8.9 Ruído de encerramento observado

Após a impressão dos resultados, o log registrou exceções de `TCPStore`:

```
[c10d] recvValueWithTimeout failed on SocketImpl(fd=40, addr=[sdumont8052]:59426,
remote=[sdumont8051]:29500): Failed to recv, got 0 bytes.
Connection was likely closed. Did the remote server shutdown or crash?
...
torch.distributed.DistNetworkError: Failed to recv, got 0 bytes.
...
The node 'sdumont8052...' has failed to shutdown the rendezvous 'none'
due to an error of type RendezvousConnectionError.
```

**Diagnóstico.** Ruído de encerramento. O rank 0, hospedeiro do `TCPStore`, encerrou antes que os demais concluíssem a barreira de saída. Os resultados foram impressos antes disso e são válidos. Não requer intervenção, embora possa ser eliminado com `dist.barrier()` antes do `destroy_process_group()`.

**Tempo consumido na Fase 6:** aproximadamente 20 minutos.

---

## 9. Análise quantitativa e dimensionamento

### 9.1 Modelo de extrapolação

A conversão das medições em estimativa de horas de GPU parte de três premissas, explicitadas para que possam ser contestadas:

1. **Throughput inversamente proporcional ao número de parâmetros.** O custo computacional de um passo de treinamento de transformer é aproximadamente 6ND FLOPs, onde N é o número de parâmetros e D o número de tokens. Mantida a eficiência de utilização, o throughput em tokens por segundo escala com 1/N.

2. **Proporção de Chinchilla.** Adota-se 20 tokens de treinamento por parâmetro como alvo de otimalidade computacional.

3. **Eficiência de escala de 94% mantida até 4 nós.** Medida em 2 nós, extrapolada. É a premissa mais frágil das três.

### 9.2 Base de cálculo

```
Throughput medido, 1 nó (4 GPUs) ......... 40.967 tokens/s
Throughput medido, 2 nós (8 GPUs) ........ 76.991 tokens/s
Eficiência de escala medida .............. 93,97%
Throughput estimado, 4 nós (16 GPUs) ..... ~145.000 tokens/s
Tokens por hora de GPU, a 16 GPUs ........ ~32,6 milhões
Modelo de referência ..................... 354,8 M parâmetros
```

### 9.3 Estimativa de custo por escala de modelo

| Modelo | Tokens (20N) | Throughput estimado (16 GPUs) | Horas de GPU | Tempo de parede em 16 GPUs |
|---|---|---|---|---|
| 355 M | 7,1 B | ~145.000 tok/s | ~220 | ~14 horas |
| 1 B | 20 B | ~51.500 tok/s | ~1.700 | ~4,5 dias |
| 3 B | 60 B | ~17.200 tok/s | ~15.500 | ~40 dias |
| 7 B | 140 B | ~7.350 tok/s | ~85.000 | ~220 dias |

### 9.4 Ressalvas à extrapolação

**Fatores que tornam a estimativa otimista:**

- A partir de aproximadamente 1 B de parâmetros, o DDP puro não cabe em 32 GB de VRAM. Será necessário ZeRO estágio 2 ou 3, ou FSDP, que acrescentam comunicação e reduzem o throughput efetivo.
- A eficiência de escala de 94% foi medida em 2 nós. Em 4 nós a tendência é de queda.
- O benchmark usa dados sintéticos residentes em memória. Um pipeline real de dados introduz latência de leitura do Lustre.

**Fatores que tornam a estimativa conservadora:**

- Não foi utilizado FlashAttention nem xformers. Em Volta, o FlashAttention 1 e a atenção eficiente em memória do xformers são aplicáveis e podem trazer ganho relevante.
- Não foi utilizado gradient checkpointing, que troca computação por memória e permitiria batch maior.
- Não houve ajuste de tamanho de batch, comprimento de sequência ou parâmetros do NCCL.
- O batch por GPU foi fixado em 4 sequências de 1024 tokens, valor conservador dado o pico de 18 GB em 32 GB disponíveis.

Uma estimativa razoável do ganho obtenível com otimização é de 1,5 a 2 vezes, o que reduziria proporcionalmente as horas de GPU.

### 9.5 Impacto da alocação atual

```
Tempo máximo por job ........................ 20 minutos = 1.200 segundos
Tokens processáveis por job (1 nó) .......... 1.200 × 40.967 ≈ 49,2 milhões
Tokens processáveis por job (4 nós) ......... 1.200 × 145.000 ≈ 174 milhões
Necessário para o menor modelo da tabela .... 7,1 bilhões
Fração atingível por job (4 nós) ............ 2,45%
```

Como `MaxSubmit` é igual a 1, não é possível enfileirar a continuação, o que inviabiliza a estratégia de checkpoint com resubmissão encadeada. Ainda que fosse possível, seriam necessárias 41 submissões consecutivas apenas para o modelo de 355 M.

### 9.6 Conclusão do dimensionamento

O hardware não é o fator limitante do projeto. As medições demonstram:

- NVLink operando próximo ao teto teórico, com 113 GB/s de busbw
- InfiniBand com 94% de eficiência de escala entre nós
- Ambiente de software funcional e validado numericamente
- 512 GB de VRAM agregada disponíveis no teto de 4 nós

O fator limitante é exclusivamente a política de alocação: 20 minutos de tempo de parede e um job por vez. Trata-se de parâmetro administrativo, dado que a partição em si é configurada com `MaxTime=UNLIMITED`.

**Viabilidade por objetivo, na alocação atual:**

| Objetivo | Viável hoje |
|---|---|
| Aulas práticas e demonstrações | Sim |
| Validação de pipeline e depuração | Sim |
| Benchmarks e profiling | Sim |
| Fine-tuning com LoRA em modelo pequeno | Parcialmente, com checkpoint manual |
| Fine-tuning completo | Não |
| Pré-treinamento de qualquer escala | Não |

---

## 10. Erros cometidos e lições metodológicas

Esta seção registra os erros de processo, não apenas os obstáculos externos. É a parte de maior valor didático do relatório.

### 10.1 Persistência excessiva em caminho obsoleto

**Erro.** Foram consumidas cerca de 4 horas tentando fazer funcionar um cliente VPN descontinuado há 12 anos, em sistema operacional ativamente incompatível com ele.

**Sinal de alerta ignorado.** Após a segunda falha estrutural (erro 27850 seguido de erro 1721), já havia evidência suficiente de incompatibilidade fundamental.

**Lição.** Estabelecer previamente um critério de abandono. Duas falhas estruturais distintas na mesma ferramenta justificam avaliar alternativa antes de uma terceira rodada de depuração.

### 10.2 Tratamento de sintoma em vez de causa

**Erro.** O problema de MTU foi identificado na primeira ocorrência de `Corrupted MAC on input` e contornado com a troca de cifrador. A correção real, no campo MTU do perfil, nunca foi aplicada.

**Custo.** Cinco quedas de conexão ao longo da sessão, das quais duas abortaram construções de container em andamento, com perda de aproximadamente 40 minutos de processamento.

**Lição.** Contornos são aceitáveis para desbloquear, mas devem ser convertidos em correção assim que o caminho crítico permitir. Registrar o contorno como pendência, não como solução.

### 10.3 Caracterização de hardware no nó errado

**Erro.** Diretivas `#SBATCH` coladas no terminal interativo, com execução de `nvidia-smi` no nó de login.

**Consequência.** Conclusão incorreta de que as GPUs eram PCIe sem NVLink, o que teria levado a decisões de arquitetura de paralelismo equivocadas.

**Como foi detectado.** Incoerência entre a afinidade de CPU observada (88 núcleos) e o reportado pelo `sinfo` (48 núcleos).

**Lição.** Toda caracterização de recurso computacional deve ocorrer dentro de um job. Verificação cruzada entre fontes independentes de informação detecta esse tipo de erro.

### 10.4 Conclusão apressada sobre montagem de filesystem

**Erro.** Diante de falha de acesso a arquivo no `/prj` a partir de nó de computação, foi levantada a hipótese de que o volume não estivesse montado.

**Realidade.** O volume está acessível. A falha decorreu de atraso de propagação de metadados no NFS, com apenas um minuto entre a gravação e a leitura.

**Lição.** Distinguir "não acessível" de "não acessível ainda". Em sistemas de arquivos distribuídos com cache de metadados, o intervalo entre escrita e leitura em nós distintos é variável relevante.

### 10.5 Excesso de peso atribuído a otimização prematura

**Erro.** A escolha por container foi fortemente motivada pela preocupação com o volume de arquivos pequenos no Lustre. Essa preocupação, embora tecnicamente correta em princípio, foi superdimensionada para o caso de um ambiente virtual de usuário único.

**Consequência.** Aproximadamente 2 horas e 30 minutos investidas em um caminho bloqueado por infraestrutura, quando a alternativa levava 25 minutos.

**Lição.** Quantificar a magnitude do problema antes de deixá-lo determinar a arquitetura. A diferença entre 10⁴ e 10⁶ arquivos é de duas ordens de grandeza e muda completamente a análise.

### 10.6 Ausência de proteção de processo desde o início

**Erro.** Operações de longa duração foram iniciadas sem `screen`, `tmux` ou `nohup`.

**Lição.** Em ambiente com conectividade instável, qualquer operação prevista para mais de cinco minutos deve ser protegida desde a primeira tentativa. O custo é uma linha adicional de comando.

### 10.7 Falsos negativos em testes de conectividade

**Erros de interpretação inicialmente cometidos:**

| Teste | Resultado | Interpretação errada | Interpretação correta |
|---|---|---|---|
| `ping login.sdumont.lncc.br` | 100% de perda | Sem conectividade | ICMP bloqueado no destino |
| `curl -sI https://download.pytorch.org` | 403 | Domínio bloqueado | Bucket sem página raiz |
| `curl -sI https://registry-1.docker.io/v2/` | 401 | Acesso negado | Desafio de autenticação padrão do registry |

**Lição.** Códigos de erro em testes de conectividade exigem interpretação contextual. Testar sempre o caminho real do recurso pretendido.

### 10.8 Acertos metodológicos que merecem replicação

- **Verificar o estado antes de destruir.** A consulta ao serviço `CVPND` antes de executar a desinstalação evitou perda de uma instalação funcional.
- **Inspeção completa da chave de registro.** O `Format-List *` revelou o `Owners` com o identificador `oem176.inf`, informação que seria necessária para remoção limpa via `pnputil`.
- **Validação numérica, não apenas funcional.** Conferir que o resultado do matmul correspondia ao valor teórico esperado distingue "executou" de "executou corretamente".
- **Combinar diagnóstico e execução no mesmo job.** O script que mediu o benchmark também verificou montagens, aproveitando a submissão dentro de uma cota restritiva de um job por vez.
- **Medir antes de extrapolar.** A medição em dois nós converteu uma suposição de escala em dado, alterando materialmente a qualidade do dimensionamento.

---

## 11. Pendências e recomendações

### 11.1 Itens para chamado ao Helpdesk

O manual do SDumont estabelece que cada nova requisição exige e-mail novo, pois mensagem enviada em resposta a chamado já encerrado não é visualizada pela equipe. Recomenda-se, portanto, abrir um chamado por assunto, todos endereçados a helpdesk-sdumont@lncc.br, informando login `bruno.menezes2` e sigla `peia-hpc`.

**Chamado 1: Programa de alocação**

Solicitar esclarecimento sobre qual programa de alocação foi atribuído ao projeto e se as partições de produção serão liberadas. Anexar as medições das seções 8 e 9 como fundamentação quantitativa da necessidade.

**Chamado 2: Procedimento para construção de imagens Singularity**

Relatar os dois bloqueios documentados na seção 6:
- `singularity pull` terminado por SIGKILL na fase de `mksquashfs` no nó de login, reprodutível
- Falha de validação TLS contra `auth.docker.io` a partir dos nós de computação, com `registry-1.docker.io` respondendo normalmente

Solicitar o procedimento recomendado pelo centro e, alternativamente, a instalação do `skopeo`, que permitiria separar as fases de download e conversão.

**Chamado 3: Política de expurgo do /scratch**

Confirmar o prazo de retenção de dados no Lustre, informação necessária para decidir o que pode residir apenas no scratch.

**Chamado 4: MTU do perfil de VPN**

Relatar que transferências longas sobre a VPN sofrem corrupção de MAC em SSH, sugerindo MTU alto demais no perfil distribuído para conexões domésticas com NAT. Informação de utilidade para outros usuários.

### 11.2 Ações técnicas pendentes

| Prioridade | Ação | Justificativa |
|---|---|---|
| Alta | Ajustar MTU do perfil Shrew Soft para 1300 | Elimina a causa das quedas recorrentes |
| Alta | Testar `peft`, `bitsandbytes` e `deepspeed` na Volta | Bibliotecas de treinamento eficiente que compilam extensões CUDA e têm suporte irregular a `sm_70` |
| Média | Medir escala em 4 nós | Converte a última premissa da extrapolação em dado medido |
| Média | Repetir benchmark com FlashAttention e gradient checkpointing | Quantifica o ganho de otimização estimado em 1,5 a 2 vezes |
| Média | Estabelecer pipeline de dados a partir do Lustre | O benchmark atual usa dados sintéticos em memória |
| Baixa | Retomar construção de container | Necessário para distribuição aos alunos, não para o trabalho atual |
| Baixa | Configurar autenticação SSH por chave | Conveniência operacional |

### 11.3 Riscos identificados

**Dependência do /scratch sem política conhecida.** O ambiente virtual, o cache do Hugging Face e os dados de trabalho residem no Lustre. O arquivo de reconstrução está no `/prj`, o que mitiga parcialmente, mas datasets processados seriam perdidos em um expurgo.

**Ocupação do Lustre em 80%.** Não há restrição imediata, mas convém monitorar antes de planejar armazenamento de corpora grandes.

**Localização da árvore de módulos.** Os módulos de ambiente residem em `/petrobr/app_sequana/modulos2`. Os avisos institucionais indicam reorganização do volume `/petrobr` para dados de projetos Petrobras e Parceiros ICT. Convém acompanhar se há impacto sobre a árvore de aplicações.

**Arquitetura Volta em fim de ciclo.** O PyTorch já removeu Volta dos builds de CUDA 12.8 e superiores, e o vLLM abandonou o suporte. A janela de compatibilidade das V100 com o ecossistema moderno de LLM está se fechando. Isso é argumento adicional para o chamado de alocação e para o planejamento de médio prazo do projeto.

### 11.4 Estado final do ambiente

```
Localização do ambiente ..... /scratch/peia-hpc/bruno.menezes2/envs/llm
Python ...................... 3.11 (via módulo anaconda3/2024.02_sequana)
PyTorch ..................... 2.13.0+cu126
CUDA (runtime do wheel) ..... 12.6
CUDA (driver do nó) ......... 12.6 (560.35.03)
cuDNN ....................... 9.10.2.21
NCCL ........................ 2.29.3
Arquiteturas compiladas ..... sm_50, sm_60, sm_70, sm_75, sm_80, sm_86, sm_90
Transformers ................ 5.14.1
Datasets .................... 5.0.0
Accelerate .................. 1.14.0
Reconstrução ................ /prj/peia-hpc/bruno.menezes2/requirements-cu126.txt
Logs de job ................. /scratch/peia-hpc/bruno.menezes2/logs/
Scripts ..................... /scratch/peia-hpc/bruno.menezes2/
Status ...................... Funcional e validado
```

---

## 12. Anexos

### Anexo A: Inventário de jobs executados

| Job ID | Nome | Partição | Nó(s) | Resultado |
|---|---|---|---|---|
| 11551829 | peia-teste | sequana_gpu_dev | sdumont8046 | Concluído. Caracterização de hardware. 11 s |
| 11552004 | build-sif | sequana_cpu_dev | - | Falha. TLS contra auth.docker.io |
| 11552006 | diag | sequana_cpu_dev | - | Concluído. Diagnóstico de rede e certificados |
| 11552013 | valida-torch | sequana_gpu_dev | sdumont8046 | Concluído. Validação de sm_70 e matmul |
| 11552019 | bench-nccl | sequana_gpu_dev | sdumont8046 | Falha. Caminho de arquivo no /prj |
| 11552022 | bench-nccl | sequana_gpu_dev | sdumont8046 | Concluído. All-reduce, 113 GB/s |
| 11552024 | bench-nccl | sequana_gpu_dev | sdumont8046 | Concluído. Treino 1 nó, 40.967 tok/s |
| 11552027 | bench-nccl | sequana_gpu_dev | sdumont8051, sdumont8052 | Concluído. Treino 2 nós, 76.991 tok/s |

### Anexo B: Comandos de referência rápida

**Conexão:**

```bash
# Windows: conectar VPN pelo Shrew Soft, depois
ssh sdumont
```

**Ambiente:**

```bash
export SCR=/scratch/peia-hpc/$USER
module load anaconda3/2024.02_sequana
source $SCR/envs/llm/bin/activate
```

**Consulta de recursos:**

```bash
sacctmgr list user $USER -s format=partition%20,MaxJobs,MaxSubmit,MaxNodes,MaxCPUs,MaxWall
sinfo -p sequana_gpu_dev -N -o "%N %G %c %m %t"
scontrol show partition sequana_gpu_dev
squeue -u $USER
sacct -j <JOBID> --format=JobID,JobName,Partition,AllocTRES%45,Elapsed,State
```

**Reconstrução do ambiente:**

```bash
export SCR=/scratch/peia-hpc/$USER
module load anaconda3/2024.02_sequana
python -m venv $SCR/envs/llm
source $SCR/envs/llm/bin/activate
pip install --upgrade pip
pip install torch --index-url https://download.pytorch.org/whl/cu126
pip install -r /prj/peia-hpc/$USER/requirements-cu126.txt
```

### Anexo C: Modelo de script de submissão

```bash
#!/bin/bash
#SBATCH --job-name=<NOME>
#SBATCH --partition=sequana_gpu_dev
#SBATCH --nodes=1
#SBATCH --ntasks-per-node=1
#SBATCH --gres=gpu:4
#SBATCH --time=00:20:00
#SBATCH --output=/scratch/peia-hpc/bruno.menezes2/logs/%j.out
#SBATCH --error=/scratch/peia-hpc/bruno.menezes2/logs/%j.err

SCR=/scratch/peia-hpc/$USER
module load anaconda3/2024.02_sequana
source $SCR/envs/llm/bin/activate

# Para execução distribuída em um nó
torchrun --nproc_per_node=4 $SCR/<SCRIPT>.py

# Para execução distribuída em múltiplos nós, substituir por
# srun torchrun --nnodes=$SLURM_NNODES --nproc_per_node=4 \
#   --rdzv_backend=c10d \
#   --rdzv_endpoint=$(scontrol show hostnames $SLURM_JOB_NODELIST | head -1):29500 \
#   $SCR/<SCRIPT>.py
```

**Observações de uso:**

- Solicitar sempre `--gres=gpu:4`, pois a alocação entrega o nó inteiro independentemente do pedido
- Usar caminhos absolutos, nunca `~`, dada a diferença de comportamento entre nós
- Manter scripts e dados no `/scratch`
- Criar o diretório de logs previamente, pois o Slurm não o cria

### Anexo D: Configuração de cliente SSH

Arquivo `%USERPROFILE%\.ssh\config` na estação Windows:

```
Host sdumont
    HostName login.sdumont.lncc.br
    User bruno.menezes2
    Ciphers aes256-gcm@openssh.com
    ServerAliveInterval 30
    ServerAliveCountMax 6
    TCPKeepAlive yes
```

### Anexo E: Referências consultadas

- Manual de Utilização do SDumont: https://github.com/lncc-sered/manual-sdumont/wiki
- Notas de versão do PyTorch 2.11, sobre remoção de suporte a Volta nos builds de CUDA 12.8 e 12.9
- Discussão de empacotamento do PyTorch sobre a incompatibilidade entre cuDNN 9.15.1 e Volta
- Relatos de incompatibilidade do vLLM com `sm_70` a partir da versão 0.20
- Documentação do SingularityCE 4.2.1

### Anexo F: Glossário de termos empregados

| Termo | Definição |
|---|---|
| busbw | Largura de banda de barramento, métrica normalizada de coletiva que permite comparação entre topologias |
| CVirtA | Serviço de driver do adaptador virtual do Cisco VPN Client |
| CVPND | Serviço daemon do Cisco VPN Client |
| DDP | DistributedDataParallel, paralelismo de dados do PyTorch com réplica completa do modelo por GPU |
| DNE | Deterministic Network Enhancer, driver de filtro de rede requerido pelo Cisco VPN Client |
| GDR | GPUDirect RDMA, acesso direto da placa de rede à memória da GPU |
| GRES | Generic Resource, mecanismo do Slurm para recursos como GPUs |
| NV2 | Dois enlaces NVLink agregados entre um par de GPUs |
| NVLS | NVLink SHARP, redução em rede disponível a partir de Hopper |
| P2P/CUMEM | Transporte de comunicação direta entre GPUs via memória unificada CUDA |
| PIX | Conexão atravessando no máximo uma ponte PCIe |
| SIF | Singularity Image Format, imagem de container em arquivo único |
| sm_70 | Compute capability 7.0, arquitetura Volta |
| SXM2 | Fator de forma de GPU com suporte a NVLink, distinto do PCIe |
| TRES | Trackable Resources, recursos contabilizados pelo Slurm |
| XAuth | Extended Authentication, autenticação de usuário posterior à fase 1 do IKE |

---

**Documento gerado em 24 de julho de 2026.**
