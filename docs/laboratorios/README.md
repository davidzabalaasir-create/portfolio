# Manual de laboratorios

Guías paso a paso para montar (o volver a montar) los cuatro laboratorios del portfolio y documentarlos con capturas. Cada guía incluye:

- **Objetivo** y esquema de lo que vas a construir.
- **Requisitos** (máquinas virtuales, ISOs, recursos).
- **Configuración** paso a paso, con los comandos y archivos necesarios.
- **Verificación**: cómo comprobar que funciona.
- **Capturas a realizar**: lista numerada con el nombre de archivo y qué debe verse en cada una.
- **Plantilla de conclusiones** para escribir qué aprendiste.

| # | Laboratorio | Área | Guía | Tiempo orientativo |
| :-: | :-- | :-- | :-- | :-- |
| 01 | Nexus Monitor | sistemas | [01-nexus-monitor.md](01-nexus-monitor.md) | 2–3 h |
| 02 | Laboratorio LAN | redes | [02-laboratorio-lan.md](02-laboratorio-lan.md) | 3–4 h |
| 03 | Backup Zero | sistemas | [03-backup-zero.md](03-backup-zero.md) | 2–3 h |
| 04 | Suricata Shield | seguridad | [04-suricata-shield.md](04-suricata-shield.md) | 2–3 h |

> Orden recomendado: **02 → 01 → 04 → 03**. El laboratorio LAN crea la red sobre la que funcionan los demás.

## Entorno base

- **Hipervisor:** VirtualBox 7 (gratuito). Activa la virtualización (VT-x/AMD-V) en la BIOS.
- **Equipo anfitrión:** 16 GB de RAM recomendados (8 GB mínimo, ejecutando menos VMs a la vez) y ~80 GB libres.
- **ISOs:**
  - pfSense CE (AMD64, instalador ISO) — <https://www.pfsense.org/download/>
  - Ubuntu Server 24.04 LTS — <https://ubuntu.com/download/server>
  - Ubuntu Desktop 24.04 LTS (opcional, para un cliente con navegador)

| VM | SO | RAM | Disco | Usada en |
| :-- | :-- | :-: | :-: | :-- |
| `fw-pfsense` | pfSense CE | 1 GB | 16 GB | 02, 04 |
| `srv-01` | Ubuntu Server | 2 GB | 25 GB | 01, 03, 04 |
| `admin-01` | Ubuntu Desktop/Server | 2 GB | 25 GB | 02, 01 |
| `user-01` | Ubuntu Server | 1 GB | 15 GB | 02, 04 |
| `backup-01` | Ubuntu Server | 1 GB | 30 GB | 03 |

## Cómo hacer buenas capturas

1. **Guárdalas** en `docs/laboratorios/capturas/<laboratorio>/` con el nombre que indica cada guía (por ejemplo `02-lan-03-reglas-firewall.png`).
2. **Formato PNG**, ventana completa pero sin el escritorio alrededor (Windows: `Win + Shift + S`; Ubuntu: `Impr Pant`).
3. **Que se vea el contexto:** nombre de la VM, el prompt (`usuario@host`) y la fecha cuando sea útil.
4. **Oculta datos sensibles antes de publicar:** contraseñas, IPs públicas reales de tu casa, tokens, correos personales. En la terminal puedes usar `clear` antes de la captura.
5. **Para la consola**, usa un tamaño de letra grande (`Ctrl + +`) para que se lea en la web.

## Cuando termines

Pásame las capturas y tus notas (o súbelas a la carpeta) y yo:

- añado las capturas a cada guía como documentación final,
- enlazo cada tarjeta de proyecto de la web con su documentación («ver documentación ↗»),
- actualizo el README con los resultados.
