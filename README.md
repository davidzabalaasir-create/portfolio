# ASIR Lab Portfolio — Seguridad y Operaciones

<p align="center">
  <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1400&q=80" alt="ASIR Lab — Seguridad" width="100%" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/ASIR-Security%20Focused-111827?style=for-the-badge&logo=shield" alt="ASIR Security" />
  <img src="https://img.shields.io/badge/IDS-Suricata-FF3A3A?style=for-the-badge&logo=suricata" alt="Suricata" />
  <img src="https://img.shields.io/badge/Monitoring-Nexus%20Monitor-00AEEF?style=for-the-badge" alt="Nexus Monitor" />
  <img src="https://img.shields.io/badge/Labs-Homelab-2B2E33?style=for-the-badge" alt="Homelab" />
</p>

Este repositorio agrupa mi portafolio técnico orientado a Administración de Sistemas y Seguridad de Redes (ASIR). Incluye laboratorios reproducibles, detección de intrusiones, monitorización y prácticas de backup y recuperación — pensado para demostrar capacidades operacionales y de hardening.

## Resumen rápido

- Nombre: David — Administrador de Sistemas & Security Ops
- Enfoque: infraestructura segura, detección y respuesta, automatización de operaciones
- Objetivo: mostrar proyectos prácticos, reproducibles y documentados para auditoría y formación

## Perfil y enfoque en seguridad

Trabajo en la intersección entre operaciones y seguridad: diseño de redes segmentadas, hardening de servicios, monitorización continua y respuesta a incidentes.

- Threat hunting y análisis de tráfico (PCAP)
- Detección y prevención con Suricata
- Observabilidad: métricas, logs y dashboards (Prometheus / Grafana / ELK / NEXUS)
- Automatización de despliegues y backups seguros (scripts, Ansible, Docker)
- Pruebas de contingencia: restauraciones y verificación de integridad

## Stack y herramientas destacadas

<p align="left">
  <img src="https://img.shields.io/badge/Linux-000000?style=for-the-badge&logo=linux" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker" />
  <img src="https://img.shields.io/badge/Suricata-FF3A3A?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Grafana-F46800?style=for-the-badge&logo=grafana" />
  <img src="https://img.shields.io/badge/Prometheus-1E90FF?style=for-the-badge&logo=prometheus" />
  <img src="https://img.shields.io/badge/ELK-4B0082?style=for-the-badge&logo=elastic" />
  <img src="https://img.shields.io/badge/Ansible-EE0000?style=for-the-badge&logo=ansible" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python" />
</p>

## Proyectos y labs (destacados)

### SURICATA SHIELD — Detección y prevención
Imagen: <img src="https://images.unsplash.com/photo-1526378722616-3b0b6f6f2f6c?auto=format&fit=crop&w=900&q=80" alt="Suricata" width="100%" />

Implementación de Suricata con reglas personalizadas, integración de alertas hacia un SIEM ligero y pipeline para análisis de PCAPs. Incluye:

- Reglas personalizadas para IoC y anomalías
- Procesamiento de logs y envío a ELK/Grafana
- Playbooks de respuesta para falsos positivos y remediación rápida

Dónde mirar: carpeta `labs/suricata` (reglas, docker-compose y scripts de ingestión).

---

### NEXUS MONITOR — Observabilidad aplicada
Imagen: <img src="https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?auto=format&fit=crop&w=900&q=80" alt="Nexus Monitor" width="100%" />

Panel integrado que reúne métricas, trazas y logs para identificar degradaciones y patrones de ataque (picos de conexiones, latencia, errores 500, spikes en logs).

Incluye dashboards preconfigurados, alertas y ejemplos de playbooks (escalado, mitigación, post-mortem).

---

### LABORATORIO LAN — Segmentación y hardening
Imagen: <img src="https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=900&q=80" alt="Laboratorio LAN" width="100%" />

Topologías reproducibles con VLANs, firewall perimetral, y servicios aislados por rol. Documentación para pruebas de microsegmentación y MFA en servicios críticos.

---

### BACKUP ZERO — Estrategia y validación
Imagen: <img src="https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=80" alt="Backup Zero" width="100%" />

Estrategia 3-2-1 con snapshots, cifrado en tránsito y en reposo, verificación automática de restauraciones y alertas ante fallos.

Scripts y procedimientos en `labs/backup`.

## Cómo reproducir los laboratorios (rápido)

Requisitos: Docker y Docker Compose instalados. Linux recomendado.

1. Clonar el repositorio

   git clone https://github.com/davidzabalaasir-create/portfolio.git
   cd portfolio

2. Ir al lab que quieras y arrancarlo con docker-compose

   cd labs/suricata
   docker-compose up -d --build

   cd ../nexus-monitor
   docker-compose up -d

3. Revisar dashboards:

   - Grafana: http://localhost:3000
   - ELK Kibana: http://localhost:5601
   - Suricata Eve JSON logs en `logs/eve.json`

4. Ejecutar un pcap de ejemplo para generar eventos (opcional)

   ./scripts/play_pcap.sh sample.pcap

Nota: los labs incluyen README propios con variables de entorno y opciones de despliegue.

## Checklist de seguridad (rápido)

- [ ] Actualizar reglas de Suricata periódicamente
- [ ] Habilitar TLS para endpoints de ingestión de logs
- [ ] Rotación de credenciales y secrets management (no almacenar en texto plano)
- [ ] Verificación regular de backups y pruebas de RTO/RPO
- [ ] Aplicar hardening en images base y escaneo de vulnerabilidades

## Contribuciones y uso académico

Este repositorio está pensado como portafolio y entorno educativo. Para colaborar, abre un issue o PR indicando:

- Objetivo de la mejora
- Lab afectado
- Impacto en detección o infraestructura

## Comandos de desarrollo

Instala dependencias y arranca el frontend de portfolio:

```bash
npm install
npm run dev
```

Build de producción:

```bash
npm run build
npm run preview
```

## Contacto

Si quieres colaborar en labs, auditorías o prácticas de red, contáctame en GitHub: https://github.com/davidzabalaasir-create

---

> Edita los laboratorios y la información personal en `labs/` y `src/main.tsx`.
