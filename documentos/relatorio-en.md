# Technical Report on the Deployment of a Computational Environment

> **🌐 Language / Idioma:** [🇧🇷 Português](relatorio.html) · **🇺🇸 English**

## PEIA-HPC Project on the Santos Dumont Supercomputer

**Author:** Bruno Leonardo Santos Menezes
**Project:** PEIA-HPC (National Training in Applied Artificial Intelligence and Scientific Computing using SINAPAD's HPC Infrastructure)
**SINAPAD Proposal:** 249134
**Infrastructure:** Santos Dumont Supercomputer (SDumont), LNCC, Petrópolis-RJ
**Execution period:** July 23 and 24, 2026
**Origin workstation:** Windows 11, home client behind NAT

---

## Table of Contents

1. [Objective and scope](#1-objetivo-e-escopo)
2. [Context and timeline of access provisioning](#2-contexto-e-cronologia-de-concessão-do-acesso)
3. [Phase 1: Establishing VPN connectivity](#3-fase-1-estabelecimento-da-conectividade-vpn)
4. [Phase 2: SSH access and session stabilization](#4-fase-2-acesso-ssh-e-estabilização-da-sessão)
5. [Phase 3: Characterization of the allocation and the hardware](#5-fase-3-caracterização-da-alocação-e-do-hardware)
6. [Phase 4: Attempt at a containerized environment](#6-fase-4-tentativa-de-ambiente-conteinerizado)
7. [Phase 5: Python virtual environment](#7-fase-5-ambiente-virtual-python)
8. [Phase 6: Communication and throughput benchmarks](#8-fase-6-benchmarks-de-comunicação-e-throughput)
9. [Quantitative analysis and sizing](#9-análise-quantitativa-e-dimensionamento)
10. [Mistakes made and methodological lessons](#10-erros-cometidos-e-lições-metodológicas)
11. [Open items and recommendations](#11-pendências-e-recomendações)
12. [Appendices](#12-anexos)

---

## 1. Objective and scope

This document records, exhaustively, the process of deploying a functional computational environment for training language models on the SDumont supercomputer, within the scope of the PEIA-HPC project.

The scope covers everything from the first contact with the remote access infrastructure to the obtaining of reproducible performance metrics. Both the successful paths and the dead ends were recorded, with a diagnosis of each failure, for three reasons:

- **Reproducibility.** Another project member should be able to retrace the same path without repeating the fruitless attempts.
- **Input for support.** Several of the obstacles encountered are institutional in nature and require intervention from the Helpdesk. The detailed record is the technical appendix to the tickets.
- **Instructional material.** Since PEIA-HPC is a training project, the debugging journey itself is pedagogical content about the real-world use of HPC infrastructure.

The document is deliberately detailed. Commands are reproduced in full, with their outputs, so that they can be run again without a mental reconstruction of the context.

---

## 2. Context and timeline of access provisioning

### 2.1 Administrative milestones

| Date | Event |
|---|---|
| 07/15/2026 01:00 | JEMS notification of the approval of proposal 249134 in the SINAPAD call |
| 07/15/2026 11:39 | Submission of supplementary documentation in response to the approval |
| 07/16/2026 15:23 | Creation of the project directories `/prj/peia-hpc` and `/scratch/peia-hpc` |
| 07/16/2026 15:47 | Communication from the Service Desk (COTIC/LNCC) reporting the creation of the PEIA-HPC project and the release of access |
| 07/23/2026 16:50 | Start of the workstation configuration work |
| 07/24/2026 08:40 | Completion of the characterization benchmarks |

### 2.2 Credentials and identifiers

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

### 2.3 Access procedure prescribed by the LNCC

The procedure documented by the Service Desk consists of two mandatory, sequential steps:

1. Connection to the SDumont VPN service
2. SSH connection to the host `login.sdumont.lncc.br`

There is no direct SSH access without the VPN tunnel established. All of Phase 1 of this report stems from that dependency.

---

## 3. Phase 1: Establishing VPN connectivity

This was the most time-consuming phase of the project, and the one that generated the greatest number of dead ends. The support material provided by the LNCC assumes the legacy Cisco VPN Client, discontinued by the manufacturer in 2014 and incompatible with modern Windows 11.

### 3.1 Starting point: error 27850 during installation

**Observed symptom:**

```
Cisco Systems VPN Client 5.0.07.0290
Error 27850. Unable to manage networking component.
Operating system corruption may be preventing installation.
```

**Diagnosis.** Error 27850 is generated when the Cisco VPN Client installer cannot register or manipulate the DNE (Deterministic Network Enhancer) network filter driver, originally from Deterministic Networks and later maintained by Citrix. This driver is a prerequisite for the creation of the tunnel's virtual adapter.

The known causes for this failure on Windows 10 and 11 systems are:

- Residue from a previous DNE installation in the registry
- Blocking of legacy drivers by Windows 11 Memory Integrity (Core Isolation)
- Exceeding the Windows network filter limit, which is 8 components
- Structural incompatibility between the DNE version and the modern NDIS stack

**Treatment hypotheses formulated:**

1. Complete uninstallation and reinstallation with `winfix.exe` (the DNE cleanup tool) followed by `dneupdate64.msi`
2. Temporary disabling of Memory Integrity
3. Installation via `msiexec /i vpnclient_setup.msi` in an elevated prompt, bypassing the `.exe` wrapper
4. Replacement of the client with a modern alternative

### 3.2 Error 1721 when attempting to uninstall

When attempting to remove the installation through the Control Panel:

```
Cisco Systems VPN Client 5.0.07.0290
Error 1721. There is a problem with this Windows Installer package.
A program required for this install to complete could not be run.
Contact your support personnel or package vendor.
```

**Diagnosis.** The installation was in an orphaned state: present in the list of programs, but with a broken uninstaller. Error 1721 indicates a failure in the execution of a custom action of the MSI package, typically the routine that stops the `CVPND` service and removes the DNE driver.

**State observed on the system:**

| Component | Version | Installation date |
|---|---|---|
| Cisco Systems VPN Client | 5.0.7 | 2025 |
| DNE Update (Deterministic Networks, Inc.) | 4.35.0.18936 | 11/02/2025 |

The presence of DNE Update 4.35 showed that the prerequisite was, in fact, installed. This repositioned the diagnosis: the problem was not the absence of the driver, but rather the installer's inability to manipulate it.

### 3.3 Verifying the actual state of the services

Before proceeding with the removal, it was verified whether the existing installation was functional:

```powershell
sc.exe query CVPND
```

Output:

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

**Decisive finding.** The service was running. The installation was not broken, only the uninstaller was. The removal plan was aborted and the strategy shifted to trying to use the already installed client.

### 3.4 Investigation of the CVirtA virtual adapter

The Cisco VPN Client's virtual adapter is registered as the driver service `CVirtA`. A classic error of version 5.0.07.0290 on 64-bit systems is error 442 (Failed to enable Virtual Adapter), caused by an incorrect or missing value in the `DisplayName` key.

First query:

```powershell
Get-ItemProperty "HKLM:\SYSTEM\CurrentControlSet\Services\CVirtA" | Select-Object DisplayName
```

Output:

```
DisplayName
-----------

```

The value returned empty. Since the command did not fail with a path error, the key existed, but the `DisplayName` property was not set.

Full inspection of the key:

```powershell
Get-ItemProperty "HKLM:\SYSTEM\CurrentControlSet\Services\CVirtA" | Format-List *
```

Output:

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

**Field-by-field interpretation:**

| Field | Value | Meaning |
|---|---|---|
| `Type` | 1 | Kernel driver |
| `Start` | 3 | On-demand load (SERVICE_DEMAND_START) |
| `ErrorControl` | 1 | Normal error, logs and continues |
| `ImagePath` | `CVirtA64.sys` | 64-bit driver binary, present |
| `Group` | NDIS | Correctly registered in the network stack |
| `Owners` | `oem176.inf` | Identifier of the installed driver package, useful for removal via `pnputil` |
| `NdisMajorVersion` | 5 | NDIS 5.0 interface, legacy architecture |

The driver was correctly installed. Only the display name was missing.

### 3.5 Correction of the DisplayName

```powershell
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\CVirtA" `
  -Name DisplayName `
  -Value "Cisco Systems VPN Adapter for 64-bit Windows" `
  -PropertyType String -Force
```

Subsequent verifications:

```powershell
Test-Path "C:\Windows\System32\drivers\CVirtA64.sys"
# True

Get-NetAdapter | Where-Object InterfaceDescription -like "*Cisco*"
```

Output:

```
Name       InterfaceDescription                        ifIndex Status       MacAddress   LinkSpeed
----       --------------------                        ------- ------       ----------   ---------
Ethernet   Cisco Systems VPN Adapter for 64-bit...           2 Not Present               0 bps
```

The `Not Present` state is expected with the tunnel closed. The adapter is only activated during the connection.

### 3.6 Error 440: Driver Failure

After restarting and importing the profile, the connection attempt produced:

```
Secure VPN Connection terminated locally by the Client.
Reason 440: Driver Failure.
Connection terminated on: jul 23, 2026 20:48:14   Duration: 0 day(s), 00.00.00
```

**Diagnosis.** Error 440 occurs after the negotiation, at the moment the client requests the driver to activate the virtual adapter. The documented causes for Windows 10 and 11 are:

1. Conflict with the Internet Connection Sharing service (`SharedAccess`), which contends for the virtual adapter
2. DNE installed but not bound to the physical network card
3. Interference from third-party firewall or antivirus, with frequent reports of McAfee blocking the creation of virtual adapters
4. Absence of a restart after a change to the driver's registry

**Proposed treatments, in order:**

```powershell
# 1. Desativar Compartilhamento de Conexão com a Internet
Stop-Service SharedAccess -Force
Set-Service SharedAccess -StartupType Disabled

# 2. Verificar vinculação do DNE
Get-NetAdapterBinding | Where-Object DisplayName -like "*Deterministic*" |
  Format-Table Name, DisplayName, Enabled

# 3. Desativar temporariamente proteção em tempo real e firewall do McAfee
```

### 3.7 Decision to switch clients

After three rounds of debugging on the Cisco client, the decision was made to abandon the legacy client. The criteria underlying the decision:

- The client is from 2010, discontinued by the manufacturer since 2014
- The NDIS 5.0 stack is incompatible with the driver policies of Windows 11
- The time already invested exceeded the cost of migration
- The `.pcf` profile file was available, and alternative clients import it directly

### 3.8 Analysis of the connection profile

The `SDUMONT.pcf` file provided by the LNCC contains the connection parameters. Line-by-line analysis of the relevant fields:

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

| Parameter | Value | Technical implication |
|---|---|---|
| `Host` | 146.134.0.14 | Address of the VPN concentrator, distinct from the SSH login host |
| `AuthType` | 1 | Authentication by group pre-shared key, followed by XAuth |
| `GroupName` | sdumont | IPsec group identifier |
| `enc_GroupPwd` | encrypted | Pre-shared key. The cipher algorithm is public and reversible, which requires treating the file as an institutional secret |
| `EnableNat` | 1 | NAT-Traversal active, encapsulation over UDP 4500. Essential for home connections behind NAT |
| `TunnelingMode` | 0 | IPsec over UDP. A value of 1 would select IPsec over TCP on port 10000 |
| `PeerTimeout` | 90 | 90-second timeout for the peer's response |
| `EnableLocalLAN` | 0 | Full tunnel. All of the workstation's traffic passes through the LNCC while connected |

The implication of `EnableLocalLAN=0` is operational and relevant: during the connection, the user's ordinary browsing is also routed through the LNCC. It is recommended to disconnect when not in use.

### 3.9 Migration to the Shrew Soft VPN Client

The Shrew Soft VPN Client was chosen for three characteristics:

- It imports Cisco VPN Client `.pcf` files directly, including the encrypted `enc_GroupPwd` field
- It uses its own driver, without dependency on the DNE or CVirtA
- It is compatible with Windows 11

**Procedure executed:**

1. Installation of the Shrew Soft VPN Client, Standard edition
2. Opening the VPN Access Manager
3. File menu, Import, selection of the `SDUMONT.pcf` file
4. Connection with XAuth credentials (`bruno.menezes2` and the SDumont password)

**Successful connection log:**

```
client configured
local id configured
remote id configured
pre-shared key configured
bringing up tunnel ...
network device configured
tunnel enabled
```

The sequence confirms: correct reading of the pre-shared key from the encrypted field, establishment of IKE phase 1, configuration of the virtual network device, and activation of the tunnel.

**Total time for Phase 1:** approximately 4 hours and 30 minutes, of which about 4 hours were consumed in attempts with the legacy client.

---

## 4. Phase 2: SSH access and session stabilization

### 4.1 First attempt and the ICMP false negative

```powershell
ping login.sdumont.lncc.br
```

Output:

```
Disparando login.sdumont.lncc.br [146.134.143.249] com 32 bytes de dados:
Esgotado o tempo limite do pedido.
Esgotado o tempo limite do pedido.
Esgotado o tempo limite do pedido.
Esgotado o tempo limite do pedido.
Estatísticas do Ping para 146.134.143.249:
    Pacotes: Enviados = 4, Recebidos = 0, Perdidos = 4 (100% de perda)
```

**Interpretation.** Name resolution worked correctly, returning 146.134.143.249. The total loss of ICMP packets does not indicate a connectivity failure: the SDumont login node does not respond to ICMP echo. `ping` is, therefore, an inadequate test for validating the tunnel in this environment. The correct test is the SSH connection attempt itself on port 22.

### 4.2 Cryptographic integrity error in the SSH session

```
The authenticity of host 'login.sdumont.lncc.br (146.134.143.249)' can't be established.
ED25519 key fingerprint is SHA256:lY3wp04SjEfvz0B4ISq2MtPZPmLNk0IOfdt+wgZKG9Q.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added 'login.sdumont.lncc.br' (ED25519) to the list of known hosts.
Corrupted MAC on input.
ssh_dispatch_run_fatal: Connection to 146.134.143.249 port 22: message authentication code incorrect
```

**Analysis.** The SSH negotiation progressed as far as the key exchange and the recording of the host fingerprint, which proves that the VPN tunnel was functional and that there was a route to the server. The failure occurred in the integrity verification of the data packets.

The `Corrupted MAC on input` error means that the message authentication code computed by the client diverged from the one received. The possible causes are active tampering, hardware failure, or packet corruption in transit. In IPsec tunnels, the overwhelmingly most common cause is the third, from fragmentation resulting from an inadequate MTU.

**Failure mechanism.** IPsec encapsulation adds headers to the original packet. If the MTU of the virtual adapter is too high, large packets have to be fragmented. On paths with NAT and Path MTU Discovery blocked, fragmentation may be done poorly or the fragments may be discarded, producing incorrectly reassembled packets. SSH detects this in the MAC verification.

### 4.3 Immediate workaround

```powershell
ssh -c aes256-gcm@openssh.com bruno.menezes2@login.sdumont.lncc.br
```

GCM mode performs authentication embedded in the cipher (AEAD), with behavior different from the standard encrypt-then-MAC scheme. This worked around the symptom and made it possible to establish the session.

### 4.4 Recommended structural fix

The workaround above treats the symptom. The fix for the root cause is the MTU adjustment in the Shrew Soft profile:

```
VPN Access Manager, selecionar site SDUMONT, botão Modify,
aba General, seção Local Host, campo MTU: alterar de 1380 para 1300.
```

If it persists, reduce to 1200.

**Consequence of not applying the fix.** Over the course of the work session, the connection dropped five times, always during long-running operations. Each drop aborted the remote process in execution, with loss of accumulated work. Section 6 documents the impact of this on the attempt to build the container.

### 4.5 Persistent client configuration

File `%USERPROFILE%\.ssh\config`:

```
Host sdumont
    HostName login.sdumont.lncc.br
    User bruno.menezes2
    Ciphers aes256-gcm@openssh.com
    ServerAliveInterval 30
    ServerAliveCountMax 6
    TCPKeepAlive yes
```

| Directive | Function |
|---|---|
| `Ciphers` | Fixes the AEAD cipher that works around the MAC corruption |
| `ServerAliveInterval 30` | Sends a keepalive every 30 seconds, preventing drop from idleness on NAT |
| `ServerAliveCountMax 6` | Tolerates up to 6 keepalives without response before giving up, i.e., 3 minutes of instability |
| `TCPKeepAlive yes` | Enables keepalive at the TCP layer in addition to the SSH protocol level |

With this file, the connection is now made simply with `ssh sdumont`.

### 4.6 First session established

Access banner, with relevant operational information extracted:

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

**Note on the warnings.** The removal warnings refer exclusively to the Petrobras and Parceiros ICT projects, with data on the `/petrobr` volume. They do not affect PEIA-HPC. It is noted, however, that the cluster's environment module tree resides in `/petrobr/app_sequana/modulos2`, which warrants monitoring in case the volume is reorganized.

Prompt obtained:

```
[bruno.menezes2@sdumont18 ~]$
```

**Total time for Phase 2:** approximately 15 minutes.

---

## 5. Phase 3: Characterization of the allocation and the hardware

The objective of this phase was to establish, with measured data, which resources the project actually possesses. Characterization precedes any training planning, because it defines the feasibility envelope.

### 5.1 Submission quotas

```bash
sacctmgr list user $USER -s format=partition%20,MaxJobs,MaxSubmit,MaxNodes,MaxCPUs,MaxWall
```

Output:

```
           Partition MaxJobs MaxSubmit MaxNodes  MaxCPUs     MaxWall
-------------------- ------- --------- -------- -------- -----------
     sequana_cpu_dev       1         1        4      192    00:20:00
     sequana_gpu_dev       1         1        4      192    00:20:00
```

**Interpretation of the limits:**

| Parameter | Value | Operational consequence |
|---|---|---|
| Accessible partitions | only `_dev` | No access to the production queues `sequana_gpu`, `sequana_gpu_long`, `sequana_cpu`, `sequana_cpu_long` |
| `MaxJobs` | 1 | A single job running at a time |
| `MaxSubmit` | 1 | Impossible to queue a continuation. Rules out checkpoint and resubmission chains |
| `MaxNodes` | 4 | Ceiling of 4 nodes per job |
| `MaxCPUs` | 192 | Equivalent to 4 nodes of 48 CPUs |
| `MaxWall` | 00:20:00 | Twenty minutes of wall time per job |

**Conclusion of this subsection.** The current allocation is for development. The combination of a 20-minute `MaxWall` with a `MaxSubmit` of 1 prevents any long-training strategy, including those based on frequent checkpointing, because it is not possible to leave the continuation queued.

### 5.2 Overview of the cluster's partitions

```bash
sinfo -s
```

Output (excerpt of the relevant partitions):

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

The notation `NODES(A/I/O/T)` corresponds to Allocated, Idle, Other, and Total.

It is observed that `sequana_gpu_dev` has 60 nodes, of which 10 were idle at the time of the query, which explains the null wait time verified in the submissions.

### 5.3 Detailed configuration of the GPU partition

```bash
scontrol show partition sequana_gpu_dev
```

Output:

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

**Points of note:**

- `MaxTime=UNLIMITED` at the partition level. The 20-minute limit comes from the user's association, not from the partition. This means that releasing more time is an administrative quota change, not a queue configuration change.
- `DefCpuPerGPU=12` and `DefMemPerGPU=94000`. When requesting 4 GPUs, Slurm assigns by default 48 CPUs and about 376 GB of memory, i.e., the complete node.
- Total `TRES` of the partition: 240 GPUs distributed across 60 nodes.
- `PriorityTier=40`, a value common to the Sequana partitions.

### 5.4 Hardware inventory per node

```bash
sinfo -p sequana_gpu_dev -N -o "%N %G %c %m %t" | head
```

Output:

```
NODELIST     GRES         CPUS  MEMORY  STATE
sdumont8029  gpu:v100:4   48    384000  alloc
sdumont8030  gpu:v100:4   48    384000  alloc
sdumont8031  gpu:v100:4   48    384000  alloc
sdumont8032  gpu:v100:4   48    384000  alloc
sdumont8033  gpu:v100:4   48    384000  alloc
```

Each node has 4 NVIDIA V100 GPUs, 48 CPUs, and 384 GB of nominal memory.

### 5.5 Methodological error committed: measurement on the login node

At this point in the work, an error was committed that deserves to be recorded, because it is a common trap.

The `#SBATCH` directives were pasted directly into the interactive terminal. Since these lines are comments to the shell, they were ignored, and the `nvidia-smi` and `nvidia-smi topo -m` commands ran on the login node sdumont18, not on a compute node.

**Result obtained on the login node (incorrect for characterization purposes):**

```
Tesla V100-PCIE-32GB  x4
Afinidade de CPU: 0-21,44-65 e 22-43,66-87  (88 CPUs lógicas)
Topologia: SYS e NODE entre GPUs, sem NVLink
```

**How the error was detected.** The CPU affinity went up to core 87, indicating 88 logical CPUs, whereas `sinfo` reported 48 CPUs on the partition's nodes. The mismatch revealed that these were different machines.

**Lessons recorded:**

1. `#SBATCH` directives only take effect when the file is handed to `sbatch`. Pasted into the terminal, they are comments.
2. Login nodes and compute nodes have distinct hardware. Characterization must always be done inside a job.
3. Running a workload on a login node is a prohibited practice at most HPC centers and can result in account suspension.

### 5.6 Correct characterization, via a job

Script submitted (job 11551829):

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

Allocated on sdumont8046, null wait time.

**Identification and memory output:**

```
sdumont8046
48
              total        used        free      shared  buff/cache   available
Mem:            376           2         372           0           1         371
Swap:             0           0           0
```

**Output of nvidia-smi:**

```
NVIDIA-SMI 560.35.03    Driver Version: 560.35.03    CUDA Version: 12.6

GPU 0: Tesla V100-SXM2-32GB   Bus-Id 00000000:60:00.0   32768MiB   250-300W
GPU 1: Tesla V100-SXM2-32GB   Bus-Id 00000000:61:00.0   32768MiB
GPU 2: Tesla V100-SXM2-32GB   Bus-Id 00000000:88:00.0   32768MiB
GPU 3: Tesla V100-SXM2-32GB   Bus-Id 00000000:89:00.0   32768MiB
```

**Critical difference relative to the login node:** the compute GPUs are **SXM2**, not PCIe. The SXM2 form factor is what enables NVLink.

**Topology output:**

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

**Interpretation of the topology:**

- `NV2` between all GPU pairs means two aggregated NVLink links per pair, in an all-to-all topology. Each GPU uses 6 of its NVLink 2.0 links, two for each of the three neighboring GPUs.
- There is no PCIe hop between GPUs for point-to-point communication.
- GPUs 0 and 1 belong to NUMA node 0 and are in PCIe proximity (`PIX`) to the InfiniBand card `mlx5_0`.
- GPUs 2 and 3 belong to NUMA node 1 and are in proximity to `mlx5_1`.
- This affinity matters for GPUDirect RDMA in multi-node runs, because it determines which HCA should serve each GPU.

### 5.7 Accounting of the allocation

```bash
sacct -j 11551829 --format=JobID,JobName,Partition,AllocTRES%45,Elapsed,State
```

Output:

```
JobID           JobName  Partition                    AllocTRES    Elapsed      State
------------ ---------- ---------- ---------------------------- ---------- ----------
11551829     peia-teste sequana_g+ billing=48,cpu=48,gres/gpu=4,   00:00:11  COMPLETED
                                   mem=376000M,node=1
```

It is confirmed that the request for 4 GPUs resulted in the allocation of the complete node: 48 CPUs, 4 GPUs, 376 GB. Since billing is by `billing=48`, requesting fewer GPUs generates no savings. The recommended practice is now to always request `--gres=gpu:4`.

The time charged is the effective `Elapsed`, 11 seconds, and not the requested limit of 20 minutes.

### 5.8 Storage structure

```bash
df -h /prj /scratch
```

Output:

```
Filesystem                                          Size  Used Avail Use% Mounted on
isilonsdnfs.sdumont.lncc.br:/ifs/prj                649T   99T  536T  16% /prj
172.20.230.12@o2ib:172.20.230.13@o2ib:/cstor2/lncc  1.4P  1.1P  267T  80% /scratch
```

Mount observed inside a job:

```
172.20.230.12@o2ib:172.20.230.13@o2ib:/cstor2/lncc on /scratch type lustre
(rw,checksum,flock,nouser_xattr,lruresize,lazystatfs,nouser_fid2path,verbose,noencrypt)
```

**Analysis of the Lustre mount options:**

| Option | Implication |
|---|---|
| `nouser_xattr` | User extended attributes disabled. This is the direct cause of the `xattr` warnings observed in Phase 4 |
| `flock` | File locks enabled, required for SQLite and some dataset formats |
| `checksum` | Integrity verification active, with a CPU cost |
| `lazystatfs` | Filesystem statistics obtained lazily, avoids blocking if an OST is unavailable |

**Project directories, created on 16/07/2026:**

```
/prj/peia-hpc         drwxrwx---  root peia-hpc
/scratch/peia-hpc     drwxrwx---  root peia-hpc
```

**User identity:**

```bash
id
# uid=65341(bruno.menezes2) gid=61715(peia-hpc) groups=61715(peia-hpc)
```

**Recommended usage policy, given the characteristics of each storage:**

| Volume | Technology | Appropriate use | Use to avoid |
|---|---|---|---|
| `/prj` | NFS over Isilon | Code, final results, environment reconstruction files | Datasets accessed during execution, Python environments with many small files |
| `/scratch` | Lustre | Datasets, checkpoints, execution environments, job output | Long-term storage, given the uncertainty about the purge policy |

**Point of attention.** `/scratch` was at 80% occupancy. There is no immediate restriction, but it is advisable not to leave intermediate data sitting idle.

---

## 6. Phase 4: Attempt at a containerized environment

This phase ended in failure. It is documented in full because the diagnosis it produced is the technical input for the Helpdesk ticket, and because the attempts carried out rule out paths that other project members will not need to repeat.

### 6.1 Technical rationale for the initial choice of a container

The container option was motivated by four reasons:

1. **Absence of internet on the compute nodes for installation.** The environment must be complete before the job begins.
2. **Adverse access pattern to Lustre.** A conda environment with PyTorch creates on the order of 10⁵ small files. Lustre is optimized for a few large files read in parallel, and degrades with the opposite pattern. The time for `import torch` can go from seconds to tens of seconds.
3. **Reproducibility for the course.** PEIA-HPC is a training project. A single `.sif` file, with a verifiable hash, is an artifact distributable to students.
4. **Dependency isolation.** It eliminates conflicts with system modules.

### 6.2 Survey of what already exists on the cluster

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

There is no PyTorch module installed on the cluster. Singularity CE 4.2.1 is available as a system binary, accessible to all users.

CUDA modules available in `/petrobr/app_sequana/modulos2`, relevant excerpt:

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

Note that the default NCCL module is compiled for CUDA 11.2, whereas the default CUDA is 12.6. This incompatibility is irrelevant for PyTorch installed via wheel, which bundles its own version of NCCL.

### 6.3 Mapping external connectivity from the login node

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

**Interpretation of each code:**

| Destination | Code | Reading |
|---|---|---|
| `pypi.org` | 200 | Accessible |
| `download.pytorch.org` (root) | 403 | False negative. It is a bucket with no root page; HEAD on the root returns 403 by design |
| `download.pytorch.org/whl/cu126/` | 200 | Wheel index accessible |
| `huggingface.co` | 200 | Accessible |
| `registry-1.docker.io/v2/` | 401 | Expected response from the Docker Registry API v2 without a token. Indicates the registry is reachable, not blocked |

**Lesson recorded.** HTTP 401 and 403 codes on API endpoints do not mean a network block. Always test the real path to the resource, not just the root of the domain.

### 6.4 Determining the PyTorch version compatible with Volta

The V100 GPUs have compute capability 7.0 (`sm_70`), Volta architecture. It was necessary to verify whether recent PyTorch versions still include kernels for this architecture.

**Documentary finding.** As of PyTorch 2.11, the pre-compiled binaries for CUDA 12.8 and 12.9 stopped including Volta support. The change was necessary to allow an upgrade to cuDNN 9.15.1, which is incompatible with Volta. Users with V100 who need CUDA 12.8 or higher must use the CUDA 12.6 builds, which retain support.

**Practical consequence.** The installation must mandatorily use the `cu126` index. This detail must appear in the course documentation, as it is exactly the type of constraint that breaks the environment when someone upgrades to the latest version.

**Additional relevant finding.** vLLM has also dropped Volta support. There are reports of vLLM 0.20 installation failures on servers with V100 due to the absence of `sm_70` support. If the course planned an LLM serving demonstration, the planning must consider pure Transformers, a compatible version of TGI, or llama.cpp.

### 6.5 Image selection

Query of the available tags via the Docker Hub API, executed from the login node:

```bash
curl -s "https://hub.docker.com/v2/repositories/pytorch/pytorch/tags/?page_size=100&ordering=last_updated" \
  | python3 -c "import sys,json;[print(t['name']) for t in json.load(sys.stdin)['results']]" \
  | grep cuda12.6
```

Output:

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

**Selection criteria applied:**

- The `devel` variant instead of `runtime`, to have `nvcc`, needed to compile extensions such as DeepSpeed, xformers, and bitsandbytes.
- Version 2.11.0, because it is the version with documented Volta support in the cu126 line, and because it is sufficiently established that the ecosystem of auxiliary libraries already supports it.

Selected image: `pytorch/pytorch:2.11.0-cuda12.6-cudnn9-devel`

### 6.6 Preparing the build environment

```bash
export SCR=/scratch/peia-hpc/$USER
export SINGULARITY_CACHEDIR=$SCR/.singularity
export SINGULARITY_TMPDIR=$SCR/.singularity/tmp
mkdir -p $SINGULARITY_TMPDIR $SCR/img
```

Redirecting the cache and temporary directory is mandatory. Without it, Singularity uses `$HOME/.singularity`, which resides on NFS, and the volume of temporary files from the extraction degrades the shared storage.

### 6.7 First attempt: syntax error

```bash
singularity pull $SCR/img/pytorch.sif docker://pytorch/pytorch:TAG
```

Output:

```
WARNING: Couldn't use cached digest for registry: HEAD
https://index.docker.io/v2/pytorch/pytorch/manifests/TAG: unexpected status code 404 Not Found
FATAL: While making image from oci registry: error fetching image:
failed to get checksum for docker://pytorch/pytorch:TAG:
GET https://index.docker.io/v2/pytorch/pytorch/manifests/TAG:
MANIFEST_UNKNOWN: manifest unknown; unknown tag=TAG
```

Trivial error: `TAG` was a literal placeholder, not replaced by a real tag.

### 6.8 Second attempt: xattr warnings and dropped connection

```bash
singularity pull $SCR/img/pytorch-2.11-cu126.sif \
  docker://pytorch/pytorch:2.11.0-cuda12.6-cudnn9-devel
```

Progress of the layer download:

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

Approximately 12 GB of compressed layers in total.

Warnings during extraction:

```
warn xattr{etc/gshadow} ignoring ENOTSUP on setxattr "user.rootlesscontainers"
warn xattr{/scratch/.../rootfs/etc/gshadow} destination filesystem does not
support xattrs, further warnings will be suppressed
```

**Diagnosis of the warnings.** They are harmless. They stem directly from Lustre's `nouser_xattr` mount option, identified in section 5.8. Singularity uses extended attributes to preserve user metadata in rootless containers. Since the final `.sif` is a single squashfs, these attributes are not needed at runtime.

**Failure:** the SSH session dropped during the `Inserting Singularity configuration` step, and the process, tied to the session, was terminated. No `.sif` file was produced.

```
INFO: Inserting Singularity configuration...
client_loop: send disconnect: Connection reset
```

### 6.9 Diagnosis of the connection drops

Upon reconnecting, the SSH session failed again with `Corrupted MAC on input`, confirming that the drops were a manifestation of the same MTU problem identified in section 4.2, and not isolated events.

Over the course of the work session there were five drops, all during long-running operations.

### 6.10 Protecting the process against disconnection

Check of available multiplexers:

```bash
which tmux screen
# /usr/bin/which: no tmux in (...)
# /usr/bin/screen
```

`tmux` is not installed. `screen` is available.

**Operational caveat discovered in practice.** `screen` sessions are local to the node. The socket resides in `/run/screen/S-<user>` on each login node. A session created on sdumont17 is not visible from sdumont18. Upon reconnecting, it is necessary to identify the node with `hostname` and, if needed, hop over with `ssh sdumont17`.

Since the `screen` session created did not survive one of the drops, `nohup` was chosen:

```bash
nohup singularity pull $SCR/img/pytorch-2.11-cu126.sif \
  docker://pytorch/pytorch:2.11.0-cuda12.6-cudnn9-devel \
  > $SCR/pull.log 2>&1 &
```

The log in `/scratch` is readable from any node, since Lustre is shared. Only the process is local.

### 6.11 Definitive failure on the login node: mksquashfs terminated by signal

The process protected by `nohup` advanced to the final step and was terminated:

```bash
grep -iE "fatal|error|killed|no space" $SCR/pull.log
```

Output:

```
FATAL: While making image from oci registry: error fetching image:
while building SIF from layers: while creating squashfs:
create command failed: signal: killed:
```

Last lines of the log before termination:

```
Unrecognised xattr prefix lustre.lov
Unrecognised xattr prefix lustre.lov
[repeated]
```

These lines are emitted by `mksquashfs` when it encounters Lustre-specific extended attributes (`lustre.lov`, which describes the object's striping layout). They are warnings, not errors.

**Diagnosis.** `mksquashfs` received SIGKILL. The possible causes are:

1. A resource watchdog on the login node terminating a prolonged CPU-intensive process
2. The OOM killer, given that compressing approximately 36 GB uncompressed consumes significant memory
3. An administrative policy limiting processes on a shared node

Disk space was ruled out as a cause: 267 TB free on `/scratch`.

### 6.12 Attempt at resource containment

```bash
export SINGULARITY_MKSQUASHFS_MEM=2G
export SINGULARITY_MKSQUASHFS_PROCS=2
nohup singularity pull $SCR/img/pytorch-2.11-cu126.sif \
  docker://pytorch/pytorch:2.11.0-cuda12.6-cudnn9-devel \
  > $SCR/pull2.log 2>&1 &
```

Identical result:

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

**Conclusion.** Either SingularityCE 4.2.1 does not honor these environment variables, or the termination is not driven by memory consumption. In any case, building on the login node is unviable and reproducible in its failure.

### 6.13 Moving the build to a compute node

Strategy: the compression step is CPU- and memory-intensive, so it belongs in a job. Script submitted (job 11552004), on the CPU queue so as not to consume the GPU slot:

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

Output:

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

**Two pieces of information extracted simultaneously:**

1. `curl` returned 401 against `registry-1.docker.io`, proving that the compute nodes **do** have internet access.
2. The failure is a TLS validation failure against `auth.docker.io`, a distinct host.

### 6.14 Diagnosis of the TLS failure

Diagnostic job submitted (11552006):

```bash
env | grep -i proxy
ls -l /etc/pki/tls/certs/ca-bundle.crt /etc/ssl/certs/ca-certificates.crt 2>&1
curl -sIv --max-time 10 https://auth.docker.io/v2/ 2>&1 | grep -iE "issuer|subject|proxy"
```

Output:

```
ls: cannot access '/etc/ssl/certs/ca-certificates.crt': No such file or directory
lrwxrwxrwx 1 root root 49 Aug  3  2023 /etc/pki/tls/certs/ca-bundle.crt ->
  /etc/pki/ca-trust/extracted/pem/tls-ca-bundle.pem
```

**Analysis of the three pieces of evidence:**

1. **No proxy variable in the environment.** This rules out the hypothesis of an explicit proxy not inherited by the process.
2. **CA bundle present at the canonical RHEL path.** `/etc/pki/tls/certs/ca-bundle.crt` is one of the paths that Go's `crypto/x509` library consults by default. This weakens the hypothesis that simply defining `SSL_CERT_FILE` would resolve it.
3. **Complete absence of grep output for issuer and subject.** If the TLS handshake had occurred, even with an invalid certificate, `curl -v` would have emitted certificate lines. Their absence suggests that the connection to `auth.docker.io` does not even establish, unlike `registry-1.docker.io`, which responded 401.

**Diagnostic conclusion.** This is selective filtering by destination on the compute nodes' network, and not a certificate chain problem. It is an infrastructure policy, beyond the user's reach.

### 6.15 Alternative path evaluated and discarded

The strategy of splitting the phases, downloading the OCI layout on the login node (which has access to `auth.docker.io`) and converting to `.sif` inside a job (which has CPU and memory), would require `skopeo`:

```bash
skopeo copy docker://pytorch/pytorch:2.11.0-cuda12.6-cudnn9-devel \
  oci:$SCR/oci/pytorch:2.11
singularity build $SCR/img/pytorch.sif oci:$SCR/oci/pytorch:2.11
```

Check:

```bash
which skopeo
# /usr/bin/which: no skopeo in (...)
```

`skopeo` is not installed on the system. Two options would remain: obtaining a static binary from GitHub releases, or requesting installation from the Helpdesk. Both were deferred in favor of the path that actually worked.

### 6.16 Summary of the blockage

| Location | Step that fails | Cause |
|---|---|---|
| Login node | squashfs compression | Process terminated by SIGKILL, reproducible |
| Compute node | Registry authentication | Network filtering to `auth.docker.io` |

Both obstacles are institutional in nature. The container build remains pending a Helpdesk response.

**Time spent in Phase 4:** approximately 2 hours and 30 minutes, spread between the night of 07/23 and the morning of 07/24.

---

## 7. Phase 5: Python virtual environment

### 7.1 Review of the technical decision

The initial choice of a container was based, among other points, on the concern with the volume of small files generated by Python environments on Lustre. Faced with two reproducible infrastructure blockers, this concern was reassessed and deemed to carry excessive weight relative to the cost of keeping the project stalled.

**Rationale for the review.** A single-user virtual environment sits on the order of 10⁴ files, not 10⁵ or 10⁶. Lustre supports this volume without relevant degradation for the other users. The container remains the correct format for distribution to the course students, but that is a future need, not a present one.

### 7.2 Building the environment

```bash
export SCR=/scratch/peia-hpc/$USER
module load anaconda3/2024.02_sequana
python -m venv $SCR/envs/llm
source $SCR/envs/llm/bin/activate
pip install --upgrade pip
```

Result: `pip` upgraded from 23.2.1 to 26.1.2.

Base Python: 3.11, provided by the `anaconda3/2024.02_sequana` module.

**Note on the choice of `venv` instead of `conda create`.** `venv` produces a leaner environment, without duplicating system libraries, and avoids the need to initialize the conda shell in each submission script. Since the base Python comes from the module, it is enough to load it before activating the environment.

### 7.3 Installing PyTorch

```bash
pip install torch --index-url https://download.pytorch.org/whl/cu126
```

Installed packages, with exact versions:

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

Download volume: approximately 3.2 GB, dominated by `nvidia-cudnn-cu12` (706.8 MB), `nvidia-cublas-cu12` (393.1 MB), `nvidia-nccl-cu12` (289.8 MB), `nvidia-cusparselt-cu12` (287.2 MB) and `torch` itself (843.7 MB).

**Favorable observation.** The embedded cuDNN version is 9.10.2.21, earlier than the 9.15.1 that prompted the removal of Volta support in the CUDA 12.8 and higher builds. This is an indication of compatibility, but not proof. Empirical validation was necessary.

### 7.4 Volta compatibility validation

Script submitted (job 11552013):

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

Output:

```
UserWarning: Failed to initialize NumPy: No module named 'numpy'
torch 2.13.0+cu126 cuda 12.6
archs ['sm_50', 'sm_60', 'sm_70', 'sm_75', 'sm_80', 'sm_86', 'sm_90']
gpus 4
name Tesla V100-SXM2-32GB
matmul 72.20170593261719
```

**Analysis of the results:**

1. **`sm_70` present in the architecture list.** The PyTorch 2.13.0+cu126 binary includes kernels compiled for Volta. The precaution of pinning version 2.11 proved unnecessary.

2. **Four GPUs detected**, correctly identified as V100-SXM2-32GB.

3. **Numerical validation of the matmul.** The value 72.2 is not merely an indication that the operation did not fail. For the product of two 8192 × 8192 matrices of independent standard normals, each element of the result is a sum of 8192 products of standard normal variables, with variance 8192 and standard deviation of approximately 90.5. The expected value of the modulus of a centered normal is the standard deviation multiplied by the square root of 2 over pi, resulting in approximately 72.2. The computation is therefore numerically correct, and not merely running without an exception.

**NumPy warning.** The absence of NumPy generated a warning, without preventing execution. Fixed immediately afterward.

### 7.5 Completing the environment

```bash
pip install numpy transformers datasets accelerate sentencepiece
```

Main packages installed:

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

### 7.6 Freezing the state

```bash
pip freeze > /prj/peia-hpc/$USER/requirements-cu126.txt
```

The rebuild file was written to `/prj`, persistent storage, and not to `/scratch`, whose purge policy is unknown. This separation is deliberate: the environment lives on scratch for performance, the rebuild recipe lives on NFS for durability.

### 7.7 Fixed environment variables

Content added to `~/.bashrc` on the cluster:

```bash
export SCR=/scratch/peia-hpc/$USER
export SINGULARITY_CACHEDIR=$SCR/.singularity
export SINGULARITY_TMPDIR=$SCR/.singularity/tmp
export HF_HOME=$SCR/.hf
export PIP_CACHE_DIR=$SCR/.pip-cache
```

**Justification for each variable:**

| Variable | Function |
|---|---|
| `SCR` | Abbreviation of the working path, used in all scripts |
| `SINGULARITY_CACHEDIR` | Keeps the OCI layer cache off NFS |
| `SINGULARITY_TMPDIR` | Directs temporary extraction to Lustre, where there is space |
| `HF_HOME` | Redirects the Hugging Face model and dataset cache, which can reach tens of gigabytes |
| `PIP_CACHE_DIR` | Keeps cached wheels off the home |

The user's `PATH` points to `/prj/peia-hpc/bruno.menezes2/.local/bin` and `/prj/peia-hpc/bruno.menezes2/bin`, confirming that the home resides on NFS. This reinforces the need for the redirections above.

**Time spent in Phase 5:** approximately 25 minutes.

---

## 8. Phase 6: Communication and throughput benchmarks

### 8.1 Objective of the benchmarks

Two quantities were measured, with distinct purposes:

1. **Effective all-reduce bandwidth.** Determines whether communication between GPUs is a bottleneck, and validates whether the NVLink identified in the topology is being effectively used by NCCL.
2. **Training throughput in tokens per second.** Converts the machine's capacity into a unit directly usable for sizing the required GPU hours.

### 8.2 NCCL all-reduce benchmark, single node

Code (`$SCR/bench-nccl.py`):

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

**Methodological note on the metric.** The bus bandwidth (busbw) for ring all-reduce is computed as the data volume multiplied by 2(N-1)/N and divided by the time, where N is the number of participants. The factor stems from the structure of the algorithm, which executes a reduce-scatter phase and an all-gather phase, each moving (N-1)/N of the total volume. This metric is comparable across topologies, unlike the algorithm bandwidth (algbw).

Submission script (`$SCR/bench-nccl.sh`), job 11552022:

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

### 8.3 All-reduce results

```
64 MB     0.94 ms   busbw 100.0 GB/s
256 MB    3.49 ms   busbw 107.4 GB/s
1024 MB  13.29 ms   busbw 112.9 GB/s
```

**Interpretation.** The values are close to the practical ceiling of NVLink 2.0 in a 4-GPU V100 SXM2 configuration. The growth of bandwidth with message size is the expected behavior, given that the fixed latency is diluted across larger transfers.

### 8.4 Evidence extracted from the NCCL log

The log with `NCCL_DEBUG=INFO` provides important confirmations:

```
NCCL version 2.29.3+cuda12.9
Bootstrap: Using ib0:172.20.15.47<0>
NET/IB : Using [0]mlx5_0:1/IB [1]mlx5_1:1/IB [RO]; OOB ib0:172.20.15.47<0>
comm rank 0 nRanks 4 nNodes 1 localRanks 4 localRank 0 MNNVL 0
Channel 00/12 : 0 1 2 3
[... 12 channels total ...]
Check P2P Type isAllDirectP2p 1 directMode 0 isAllCudaP2p 1
Channel 00/0 : 0[0] -> 1[1] via P2P/CUMEM
Connected all rings, use ring PXN 0 GDR 1
NVLS multicast support is not available on dev 0 (NVLS_NCHANNELS 0)
Skipping symmetric kernel 29 which requires driver 12070
ncclTopoGetCpuAffinity: Affinity for GPU 0 is 0-23
ncclTopoGetCpuAffinity: Affinity for GPU 3 is 24-47
```

**Item-by-item reading:**

| Evidence | Meaning |
|---|---|
| `via P2P/CUMEM` on all channels | Direct communication between GPUs, without passing through host memory. Confirms the use of NVLink |
| `isAllDirectP2p 1` | All pairs have a direct P2P path, consistent with the NV2 all-to-all topology |
| 12 collective channels | NCCL built 12 distinct rings, exploiting the dense topology |
| `GDR 1` | GPUDirect RDMA enabled, relevant for multi-node execution |
| `NVLS not available` | NVLink SHARP requires Hopper or higher. Expected on Volta |
| `Skipping symmetric kernel ... requires driver 12070` | Symmetric kernels require driver 12.7. The node has 12.6. Loss of optimization, without functional impact |
| Affinity 0-23 and 24-47 | Consistent with the NUMA split identified in the topology |
| `Bootstrap: Using ib0` | The initial rendezvous uses the IP-over-InfiniBand interface |

### 8.5 Training throughput benchmark

Code (`$SCR/bench-train.py`):

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

**Benchmark design decisions:**

- **Configuration instantiated locally**, via `GPT2Config`, without downloading weights. Eliminates network dependency on the compute node and makes the test reproducible.
- **Synthetic data**, with `torch.randint`. The goal is to measure computational capacity, not the data pipeline. Isolating the variables is deliberate.
- **Five warmup steps** before measurement, to exclude kernel compilation, initial memory allocation and the establishment of the NCCL buffers.
- **Mixed precision fp16 with GradScaler.** The V100s have no native bf16 support, so fp16 with loss scaling is the mandatory path.
- **Explicit CUDA synchronization** before and after measurement, since the operations are asynchronous.

### 8.6 Single-node result (job 11552024)

```
params (M) 354.823168
tokens/s 40,967   passo 400 ms
pico VRAM 18.0 GB
```

**Analysis:**

| Quantity | Value | Observation |
|---|---|---|
| Parameters | 354.8 M | Configuration equivalent to GPT-2 Medium |
| Aggregate throughput | 40,967 tokens/s | 4 GPUs |
| Throughput per GPU | ~10,242 tokens/s | |
| Step time | 400 ms | Global batch of 16,384 tokens |
| Peak VRAM | 18.0 GB | Of 32 GB available per GPU |

The 18 GB consumption for a 355 M model in DDP results from the sum of fp32 weights, gradients, AdamW optimizer states (two moments in fp32) and activations. This proportion indicates that pure DDP ceases to fit in 32 GB for models above approximately 1 billion parameters, requiring ZeRO or FSDP from that scale onward.

### 8.7 Incident during the preparation of the multi-node test

The first submission of the benchmark (job 11552019) failed:

```
python: can't open file '/prj/peia-hpc/bruno.menezes2/bench-nccl.py':
[Errno 2] No such file or directory
```

The file existed, with a modification date of 08:24, and the job ran at 08:25.

**Diagnosis.** A later job confirmed that `/prj` **is** accessible from the compute nodes, via `ls -d`. The most likely hypothesis is a metadata propagation delay on NFS between the login node and the compute node, aggravated by the interval of only one minute between writing and reading.

**Correction note.** The hypothesis initially raised, that `/prj` was not mounted on the compute nodes, proved incorrect. The correction is recorded because the wrong conclusion would have relevant implications for the organization of the data.

**Practice adopted as a consequence:** keep execution scripts and data on `/scratch`, with an absolute path, and use `/prj` only for rebuild files and final results.

### 8.8 Two-node result (job 11552027)

Launch configuration:

```bash
#SBATCH --nodes=2
srun torchrun --nnodes=2 --nproc_per_node=4 --rdzv_backend=c10d \
  --rdzv_endpoint=$(scontrol show hostnames $SLURM_JOB_NODELIST | head -1):29500 \
  $SCR/bench-train.py
```

Nodes allocated: sdumont8051 and sdumont8052.

Output:

```
params (M) 354.823168
tokens/s 76,991   passo 426 ms
pico VRAM 18.0 GB
```

**Scaling efficiency calculation:**

```
Ideal scaling ...... 2 × 40,967 = 81,934 tokens/s
Measured ........... 76,991 tokens/s
Efficiency ......... 76,991 / 81,934 = 93.97%
Step overhead ...... (426 - 400) / 400 = 6.5%
```

**Interpretation.** The 94% efficiency across two nodes indicates that InfiniBand is not a bottleneck at this scale. The 26 ms increase in step time corresponds to the inter-node communication of the gradient, which for a 355 M model in fp16 represents about 710 MB per all-reduce step.

### 8.9 Shutdown noise observed

After the results were printed, the log recorded `TCPStore` exceptions:

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

**Diagnosis.** Shutdown noise. Rank 0, host of the `TCPStore`, terminated before the others completed the exit barrier. The results were printed before that and are valid. It requires no intervention, although it can be eliminated with `dist.barrier()` before `destroy_process_group()`.

**Time spent in Phase 6:** approximately 20 minutes.

---

## 9. Quantitative analysis and sizing

### 9.1 Extrapolation model

Converting the measurements into a GPU-hours estimate rests on three premises, made explicit so that they can be challenged:

1. **Throughput inversely proportional to the number of parameters.** The computational cost of a transformer training step is approximately 6ND FLOPs, where N is the number of parameters and D the number of tokens. Holding utilization efficiency constant, the throughput in tokens per second scales with 1/N.

2. **Chinchilla ratio.** A target of 20 training tokens per parameter is adopted as the compute-optimal goal.

3. **94% scaling efficiency held up to 4 nodes.** Measured on 2 nodes, extrapolated. This is the most fragile of the three premises.

### 9.2 Calculation basis

```
Throughput medido, 1 nó (4 GPUs) ......... 40.967 tokens/s
Throughput medido, 2 nós (8 GPUs) ........ 76.991 tokens/s
Eficiência de escala medida .............. 93,97%
Throughput estimado, 4 nós (16 GPUs) ..... ~145.000 tokens/s
Tokens por hora de GPU, a 16 GPUs ........ ~32,6 milhões
Modelo de referência ..................... 354,8 M parâmetros
```

### 9.3 Cost estimate by model scale

| Model | Tokens (20N) | Estimated throughput (16 GPUs) | GPU-hours | Wall-clock time on 16 GPUs |
|---|---|---|---|---|
| 355 M | 7,1 B | ~145.000 tok/s | ~220 | ~14 hours |
| 1 B | 20 B | ~51.500 tok/s | ~1.700 | ~4,5 days |
| 3 B | 60 B | ~17.200 tok/s | ~15.500 | ~40 days |
| 7 B | 140 B | ~7.350 tok/s | ~85.000 | ~220 days |

### 9.4 Caveats to the extrapolation

**Factors that make the estimate optimistic:**

- Beyond roughly 1 B parameters, pure DDP does not fit in 32 GB of VRAM. ZeRO stage 2 or 3, or FSDP, will be required, which add communication and reduce the effective throughput.
- The 94% scaling efficiency was measured on 2 nodes. On 4 nodes the trend is downward.
- The benchmark uses synthetic data resident in memory. A real data pipeline introduces read latency from Lustre.

**Factors that make the estimate conservative:**

- Neither FlashAttention nor xformers was used. On Volta, FlashAttention 1 and the memory-efficient attention from xformers are applicable and can yield a relevant gain.
- Gradient checkpointing was not used, which trades computation for memory and would allow a larger batch.
- There was no tuning of batch size, sequence length, or NCCL parameters.
- The per-GPU batch was fixed at 4 sequences of 1024 tokens, a conservative value given the peak of 18 GB out of 32 GB available.

A reasonable estimate of the gain achievable through optimization is 1.5 to 2 times, which would proportionally reduce the GPU-hours.

### 9.5 Impact of the current allocation

```
Tempo máximo por job ........................ 20 minutos = 1.200 segundos
Tokens processáveis por job (1 nó) .......... 1.200 × 40.967 ≈ 49,2 milhões
Tokens processáveis por job (4 nós) ......... 1.200 × 145.000 ≈ 174 milhões
Necessário para o menor modelo da tabela .... 7,1 bilhões
Fração atingível por job (4 nós) ............ 2,45%
```

Since `MaxSubmit` equals 1, it is not possible to queue the continuation, which makes the checkpoint strategy with chained resubmission unfeasible. Even if it were possible, 41 consecutive submissions would be required for the 355 M model alone.

### 9.6 Sizing conclusion

The hardware is not the project's limiting factor. The measurements demonstrate:

- NVLink operating close to its theoretical ceiling, at 113 GB/s of busbw
- InfiniBand with 94% scaling efficiency between nodes
- A functional and numerically validated software environment
- 512 GB of aggregate VRAM available at the 4-node ceiling

The limiting factor is exclusively the allocation policy: 20 minutes of wall-clock time and one job at a time. This is an administrative parameter, given that the partition itself is configured with `MaxTime=UNLIMITED`.

**Feasibility by objective, under the current allocation:**

| Objective | Feasible today |
|---|---|
| Practical classes and demonstrations | Yes |
| Pipeline validation and debugging | Yes |
| Benchmarks and profiling | Yes |
| Fine-tuning with LoRA on a small model | Partially, with manual checkpointing |
| Full fine-tuning | No |
| Pre-training of any scale | No |

---

## 10. Mistakes made and methodological lessons

This section records process errors, not just external obstacles. It is the most didactically valuable part of the report.

### 10.1 Excessive persistence on an obsolete path

**Mistake.** About 4 hours were spent trying to get a VPN client discontinued 12 years ago to work on an operating system actively incompatible with it.

**Warning sign ignored.** After the second structural failure (error 27850 followed by error 1721), there was already sufficient evidence of a fundamental incompatibility.

**Lesson.** Establish an abandonment criterion in advance. Two distinct structural failures in the same tool justify evaluating an alternative before a third round of debugging.

### 10.2 Treating the symptom instead of the cause

**Mistake.** The MTU problem was identified on the first occurrence of `Corrupted MAC on input` and worked around by switching the cipher. The real fix, in the profile's MTU field, was never applied.

**Cost.** Five connection drops over the course of the session, two of which aborted container builds in progress, with a loss of approximately 40 minutes of processing.

**Lesson.** Workarounds are acceptable to unblock, but should be converted into a fix as soon as the critical path allows. Record the workaround as an open item, not as a solution.

### 10.3 Hardware characterization on the wrong node

**Mistake.** `#SBATCH` directives pasted into the interactive terminal, with `nvidia-smi` executed on the login node.

**Consequence.** The incorrect conclusion that the GPUs were PCIe without NVLink, which would have led to mistaken parallelism architecture decisions.

**How it was detected.** Inconsistency between the observed CPU affinity (88 cores) and what `sinfo` reported (48 cores).

**Lesson.** Any characterization of a compute resource must occur within a job. Cross-checking between independent information sources detects this kind of error.

### 10.4 Hasty conclusion about filesystem mounting

**Mistake.** Faced with a file-access failure on `/prj` from a compute node, the hypothesis was raised that the volume was not mounted.

**Reality.** The volume is accessible. The failure stemmed from a metadata propagation delay in NFS, with only one minute between the write and the read.

**Lesson.** Distinguish "not accessible" from "not accessible yet". In distributed filesystems with metadata caching, the interval between write and read across distinct nodes is a relevant variable.

### 10.5 Excessive weight given to premature optimization

**Mistake.** The choice of a container was strongly motivated by concern over the volume of small files on Lustre. This concern, although technically correct in principle, was oversized for the case of a single-user virtual environment.

**Consequence.** Approximately 2 hours and 30 minutes invested in a path blocked by infrastructure, when the alternative took 25 minutes.

**Lesson.** Quantify the magnitude of the problem before letting it determine the architecture. The difference between 10⁴ and 10⁶ files is two orders of magnitude and completely changes the analysis.

### 10.6 Absence of process protection from the start

**Mistake.** Long-running operations were started without `screen`, `tmux`, or `nohup`.

**Lesson.** In an environment with unstable connectivity, any operation expected to take more than five minutes should be protected from the first attempt. The cost is one additional command line.

### 10.7 False negatives in connectivity tests

**Interpretation errors initially made:**

| Test | Result | Wrong interpretation | Correct interpretation |
|---|---|---|---|
| `ping login.sdumont.lncc.br` | 100% loss | No connectivity | ICMP blocked at the destination |
| `curl -sI https://download.pytorch.org` | 403 | Domain blocked | Bucket without a root page |
| `curl -sI https://registry-1.docker.io/v2/` | 401 | Access denied | Standard registry authentication challenge |

**Lesson.** Error codes in connectivity tests require contextual interpretation. Always test the real path of the intended resource.

### 10.8 Methodological successes that deserve replication

- **Check state before destroying.** Querying the `CVPND` service before running the uninstall avoided losing a working installation.
- **Complete inspection of the registry key.** The `Format-List *` revealed the `Owners` with the identifier `oem176.inf`, information that would be needed for clean removal via `pnputil`.
- **Numerical validation, not just functional.** Confirming that the matmul result matched the expected theoretical value distinguishes "it ran" from "it ran correctly".
- **Combine diagnosis and execution in the same job.** The script that measured the benchmark also verified mounts, taking advantage of the submission within a restrictive quota of one job at a time.
- **Measure before extrapolating.** The measurement on two nodes turned a scaling assumption into data, materially altering the quality of the sizing.

---

## 11. Open items and recommendations

### 11.1 Items for a Helpdesk ticket

The SDumont manual establishes that each new request requires a new e-mail, since a message sent in reply to an already-closed ticket is not seen by the team. It is therefore recommended to open one ticket per subject, all addressed to helpdesk-sdumont@lncc.br, providing login `bruno.menezes2` and acronym `peia-hpc`.

**Ticket 1: Allocation program**

Request clarification on which allocation program was assigned to the project and whether the production partitions will be released. Attach the measurements from sections 8 and 9 as quantitative grounds for the need.

**Ticket 2: Procedure for building Singularity images**

Report the two blockers documented in section 6:
- `singularity pull` terminated by SIGKILL in the `mksquashfs` phase on the login node, reproducible
- TLS validation failure against `auth.docker.io` from the compute nodes, with `registry-1.docker.io` responding normally

Request the procedure recommended by the center and, alternatively, the installation of `skopeo`, which would allow separating the download and conversion phases.

**Ticket 3: /scratch purge policy**

Confirm the data retention period on Lustre, information needed to decide what may reside only on scratch.

**Ticket 4: VPN profile MTU**

Report that long transfers over the VPN suffer MAC corruption in SSH, suggesting an MTU too high in the distributed profile for home connections with NAT. Information useful to other users.

### 11.2 Pending technical actions

| Priority | Action | Rationale |
|---|---|---|
| High | Adjust the Shrew Soft profile MTU to 1300 | Eliminates the cause of the recurring drops |
| High | Test `peft`, `bitsandbytes`, and `deepspeed` on Volta | Efficient-training libraries that compile CUDA extensions and have irregular support for `sm_70` |
| Medium | Measure scaling on 4 nodes | Turns the last extrapolation premise into measured data |
| Medium | Repeat the benchmark with FlashAttention and gradient checkpointing | Quantifies the optimization gain estimated at 1.5 to 2 times |
| Medium | Establish a data pipeline from Lustre | The current benchmark uses synthetic data in memory |
| Low | Resume the container build | Needed for distribution to students, not for the current work |
| Low | Configure SSH key-based authentication | Operational convenience |

### 11.3 Identified risks

**Dependence on /scratch without a known policy.** The virtual environment, the Hugging Face cache, and the working data reside on Lustre. The reconstruction file is on `/prj`, which partially mitigates this, but processed datasets would be lost in a purge.

**Lustre occupancy at 80%.** There is no immediate restriction, but it is worth monitoring before planning the storage of large corpora.

**Location of the module tree.** The environment modules reside in `/petrobr/app_sequana/modulos2`. Institutional notices indicate a reorganization of the `/petrobr` volume for Petrobras and ICT Partner project data. It is worth watching whether there is any impact on the applications tree.

**Volta architecture at end of cycle.** PyTorch has already removed Volta from the CUDA 12.8 and higher builds, and vLLM has dropped support. The compatibility window of the V100s with the modern LLM ecosystem is closing. This is an additional argument for the allocation ticket and for the project's medium-term planning.

### 11.4 Final state of the environment

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

## 12. Appendices

### Appendix A: Inventory of executed jobs

| Job ID | Name | Partition | Node(s) | Result |
|---|---|---|---|---|
| 11551829 | peia-teste | sequana_gpu_dev | sdumont8046 | Completed. Hardware characterization. 11 s |
| 11552004 | build-sif | sequana_cpu_dev | - | Failed. TLS against auth.docker.io |
| 11552006 | diag | sequana_cpu_dev | - | Completed. Network and certificate diagnosis |
| 11552013 | valida-torch | sequana_gpu_dev | sdumont8046 | Completed. Validation of sm_70 and matmul |
| 11552019 | bench-nccl | sequana_gpu_dev | sdumont8046 | Failed. File path on /prj |
| 11552022 | bench-nccl | sequana_gpu_dev | sdumont8046 | Completed. All-reduce, 113 GB/s |
| 11552024 | bench-nccl | sequana_gpu_dev | sdumont8046 | Completed. Training 1 node, 40.967 tok/s |
| 11552027 | bench-nccl | sequana_gpu_dev | sdumont8051, sdumont8052 | Completed. Training 2 nodes, 76.991 tok/s |

### Appendix B: Quick-reference commands

**Connection:**

```bash
# Windows: conectar VPN pelo Shrew Soft, depois
ssh sdumont
```

**Environment:**

```bash
export SCR=/scratch/peia-hpc/$USER
module load anaconda3/2024.02_sequana
source $SCR/envs/llm/bin/activate
```

**Resource queries:**

```bash
sacctmgr list user $USER -s format=partition%20,MaxJobs,MaxSubmit,MaxNodes,MaxCPUs,MaxWall
sinfo -p sequana_gpu_dev -N -o "%N %G %c %m %t"
scontrol show partition sequana_gpu_dev
squeue -u $USER
sacct -j <JOBID> --format=JobID,JobName,Partition,AllocTRES%45,Elapsed,State
```

**Environment reconstruction:**

```bash
export SCR=/scratch/peia-hpc/$USER
module load anaconda3/2024.02_sequana
python -m venv $SCR/envs/llm
source $SCR/envs/llm/bin/activate
pip install --upgrade pip
pip install torch --index-url https://download.pytorch.org/whl/cu126
pip install -r /prj/peia-hpc/$USER/requirements-cu126.txt
```

### Appendix C: Submission script template

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

**Usage notes:**

- Always request `--gres=gpu:4`, since the allocation delivers the whole node regardless of the request
- Use absolute paths, never `~`, given the difference in behavior between nodes
- Keep scripts and data on `/scratch`
- Create the logs directory beforehand, since Slurm does not create it

### Appendix D: SSH client configuration

File `%USERPROFILE%\.ssh\config` on the Windows workstation:

```
Host sdumont
    HostName login.sdumont.lncc.br
    User bruno.menezes2
    Ciphers aes256-gcm@openssh.com
    ServerAliveInterval 30
    ServerAliveCountMax 6
    TCPKeepAlive yes
```

### Appendix E: References consulted

- SDumont User Manual: https://github.com/lncc-sered/manual-sdumont/wiki
- PyTorch 2.11 release notes, on the removal of Volta support in the CUDA 12.8 and 12.9 builds
- PyTorch packaging discussion on the incompatibility between cuDNN 9.15.1 and Volta
- Reports of vLLM incompatibility with `sm_70` from version 0.20 onward
- SingularityCE 4.2.1 documentation

### Appendix F: Glossary of terms used

| Term | Definition |
|---|---|
| busbw | Bus bandwidth, a normalized collective metric that allows comparison between topologies |
| CVirtA | Virtual adapter driver service of the Cisco VPN Client |
| CVPND | Daemon service of the Cisco VPN Client |
| DDP | DistributedDataParallel, PyTorch data parallelism with a full replica of the model per GPU |
| DNE | Deterministic Network Enhancer, a network filter driver required by the Cisco VPN Client |
| GDR | GPUDirect RDMA, direct access from the network card to the GPU memory |
| GRES | Generic Resource, Slurm's mechanism for resources such as GPUs |
| NV2 | Two aggregated NVLink links between a pair of GPUs |
| NVLS | NVLink SHARP, in-network reduction available from Hopper onward |
| P2P/CUMEM | Direct GPU-to-GPU communication transport via CUDA unified memory |
| PIX | Connection crossing at most one PCIe bridge |
| SIF | Singularity Image Format, a container image in a single file |
| sm_70 | Compute capability 7.0, the Volta architecture |
| SXM2 | GPU form factor with NVLink support, distinct from PCIe |
| TRES | Trackable Resources, resources accounted for by Slurm |
| XAuth | Extended Authentication, user authentication subsequent to IKE phase 1 |

---

**Document generated on July 24, 2026.**
