<div align="center">

<img src=".github/readme/banner.svg" alt="David Zabala — Diseño sistemas que resisten" width="100%" />

<br />

<a href="https://davidzabalaasir-create.github.io/portfolio/"><img src="https://img.shields.io/badge/portfolio-online-d2ff52?style=for-the-badge&labelColor=08101d" alt="Portfolio online" /></a>
<a href="https://davidzabalaasir-create.github.io/portfolio/CV_David_Zabala_Maira.pdf"><img src="https://img.shields.io/badge/CV-descargar-62d9df?style=for-the-badge&labelColor=08101d" alt="Descargar CV" /></a>
<a href="mailto:davidzamaira2003@gmail.com"><img src="https://img.shields.io/badge/contacto-email-e7f1ee?style=for-the-badge&labelColor=08101d" alt="Email" /></a>
<a href="https://github.com/davidzabalaasir-create/portfolio/actions/workflows/deploy.yml"><img src="https://img.shields.io/github/actions/workflow/status/davidzabalaasir-create/portfolio/deploy.yml?style=for-the-badge&label=deploy&labelColor=08101d" alt="Estado del despliegue" /></a>

</div>

```console
david@asir-lab:~$ whoami
David Zabala · estudiante de ASIR · Bilbao, ES

david@asir-lab:~$ cat ~/.motd
Construyo infraestructuras claras, seguras y fáciles de mantener,
desde la red hasta la automatización.
```

## `01` · `traceroute ~/formación`

<img src=".github/readme/path.svg" alt="Itinerario formativo: SMR 2023–2025 y ASIR desde 2025" width="100%" />

| hop | periodo | ciclo | estado |
| :-: | :-- | :-- | :-- |
| `1` | 2023 — 2025 | **SMR** · Sistemas Microinformáticos y Redes · Mikeldi | ✅ completado |
| `2` | 2025 — hoy | **ASIR** · Administración de Sistemas Informáticos en Red | 🟢 en curso |

## `02` · `ls -la ~/proyectos`

<img src=".github/readme/projects.svg" alt="Proyectos: Nexus Monitor, Laboratorio LAN, Backup Zero y Suricata Shield" width="100%" />

<details>
<summary><b>📂 Ver detalles de cada laboratorio</b></summary>

<br />

| proyecto | área | qué resuelve | estado |
| :-- | :-- | :-- | :-- |
| **NEXUS MONITOR** | sistemas | Vigilar servicios, latencias y capacidad en una red híbrida con dashboards. | 🟢 operativo |
| **LABORATORIO LAN** | redes | Segmentar la red con VLAN, firewall perimetral y servicios aislados por rol. | 🟢 operativo |
| **BACKUP ZERO** | sistemas | Copias 3-2-1 automatizadas con snapshots, cifrado y restauraciones verificadas. | 🟠 en evolución |
| **SURICATA SHIELD** | seguridad | Detectar intrusiones analizando el tráfico y responder ante amenazas. | 🟠 en evolución |

</details>

## `03` · `nmap --topology ~/laboratorio-lan`

<img src=".github/readme/network.svg" alt="Topología del laboratorio: WAN, firewall pfSense, sensor Suricata y VLAN de administración, servidores y usuarios" width="100%" />

<sub>Esquema del laboratorio de red: el tráfico entra por pfSense, Suricata lo inspecciona y cada VLAN queda aislada según su rol.</sub>

## `04` · `apt list --installed`

<table>
  <tr>
    <td valign="top" width="33%">

**`~/sistemas`**

<img src="https://img.shields.io/badge/Linux-08101d?style=flat-square&logo=linux&logoColor=d2ff52" alt="Linux" />
<img src="https://img.shields.io/badge/Windows%20Server-08101d?style=flat-square&logo=windows&logoColor=62d9df" alt="Windows Server" />
<img src="https://img.shields.io/badge/Docker-08101d?style=flat-square&logo=docker&logoColor=62d9df" alt="Docker" />
<img src="https://img.shields.io/badge/VirtualBox-08101d?style=flat-square&logo=virtualbox&logoColor=62d9df" alt="VirtualBox" />

</td>
    <td valign="top" width="33%">

**`~/redes & seguridad`**

<img src="https://img.shields.io/badge/TCP%2FIP-08101d?style=flat-square&logo=cisco&logoColor=d2ff52" alt="TCP/IP" />
<img src="https://img.shields.io/badge/pfSense-08101d?style=flat-square&logo=pfsense&logoColor=62d9df" alt="pfSense" />
<img src="https://img.shields.io/badge/VLAN-08101d?style=flat-square&logo=ubiquiti&logoColor=62d9df" alt="VLAN" />
<img src="https://img.shields.io/badge/Suricata-08101d?style=flat-square&logo=suricata&logoColor=ff6b6b" alt="Suricata" />

</td>
    <td valign="top" width="33%">

**`~/automatización`**

<img src="https://img.shields.io/badge/Bash-08101d?style=flat-square&logo=gnubash&logoColor=d2ff52" alt="Bash" />
<img src="https://img.shields.io/badge/Python-08101d?style=flat-square&logo=python&logoColor=62d9df" alt="Python" />
<img src="https://img.shields.io/badge/SQL-08101d?style=flat-square&logo=mysql&logoColor=62d9df" alt="SQL" />
<img src="https://img.shields.io/badge/Git-08101d?style=flat-square&logo=git&logoColor=62d9df" alt="Git" />

</td>
  </tr>
</table>

## `05` · `systemctl status portfolio`

```diff
● portfolio.service - Portfolio personal (React + TypeScript + Vite)
     Loaded: loaded (src/main.tsx; enabled)
+    Active: active (running) en GitHub Pages
     Docs:   CV y carta de motivación descargables en la sección «documentos»
```

<details>
<summary><b>🛠️ Arrancarlo en local</b></summary>

<br />

```bash
git clone https://github.com/davidzabalaasir-create/portfolio.git
cd portfolio
npm install
npm run dev      # servidor de desarrollo
npm run build    # build de producción en dist/
```

El contenido editable (proyectos, formación, stack, contacto) vive en `src/main.tsx`; los estilos en `src/styles.css`. Cada push a `main` se publica automáticamente en GitHub Pages.

</details>

## `06` · `ssh david@contacto`

<div align="center">

**¿Construimos algo resistente?** Disponible para prácticas y proyectos.

<a href="mailto:davidzamaira2003@gmail.com"><img src="https://img.shields.io/badge/davidzamaira2003@gmail.com-08101d?style=for-the-badge&logo=gmail&logoColor=d2ff52" alt="Email" /></a>
<a href="https://github.com/davidzabalaasir-create"><img src="https://img.shields.io/badge/GitHub-08101d?style=for-the-badge&logo=github&logoColor=62d9df" alt="GitHub" /></a>

<sub><code>exit 0</code> · construido con curiosidad + café</sub>

</div>
