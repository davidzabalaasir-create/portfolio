# 01 · Nexus Monitor — observabilidad con Prometheus y Grafana

**Objetivo:** montar en `srv-01` un stack de monitorización con Docker que vigila el estado de los servidores (CPU, memoria, disco), la disponibilidad y latencia de servicios de la red, y avisa cuando algo falla.

```text
 ┌──────────────────────── srv-01 (Docker) ────────────────────────┐
 │  node-exporter ──┐                                               │
 │  blackbox ───────┼──► Prometheus (:9090) ──► Grafana (:3000)     │
 │  (ping/HTTP a    │         └── reglas de alerta                  │
 │   pfSense, web…) │                                               │
 └──────────────────────────────────────────────────────────────────┘
```

**Requisitos:** `srv-01` (Ubuntu Server, 2 GB RAM) en la VLAN 20 con IP `10.0.20.10` (lab 02). Se puede hacer también en una sola VM con red NAT.

## 1. Instalar Docker

```bash
sudo apt update
sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" \
| sudo tee /etc/apt/sources.list.d/docker.list
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo usermod -aG docker $USER     # cierra sesión y vuelve a entrar
docker run --rm hello-world
```

📸 **Captura `01-nexus-01-docker.png`:** salida de `docker run --rm hello-world` y `docker compose version`.

## 2. Archivos del stack

Crea la carpeta `~/nexus-monitor` con esta estructura:

```text
nexus-monitor/
├── docker-compose.yml
├── prometheus/
│   ├── prometheus.yml
│   └── alertas.yml
└── blackbox/
    └── blackbox.yml
```

**`docker-compose.yml`**

```yaml
services:
  prometheus:
    image: prom/prometheus:latest        # fija una versión concreta cuando funcione (p. ej. v3.x.y)
    container_name: prometheus
    volumes:
      - ./prometheus:/etc/prometheus:ro
      - prometheus-data:/prometheus
    command:
      - --config.file=/etc/prometheus/prometheus.yml
      - --storage.tsdb.retention.time=15d
    ports: ["9090:9090"]
    restart: unless-stopped

  node-exporter:
    image: prom/node-exporter:latest
    container_name: node-exporter
    pid: host
    volumes:
      - /:/host:ro,rslave
    command: ["--path.rootfs=/host"]
    restart: unless-stopped

  blackbox:
    image: prom/blackbox-exporter:latest
    container_name: blackbox
    volumes:
      - ./blackbox:/config:ro
    command: ["--config.file=/config/blackbox.yml"]
    cap_add: [NET_RAW]                   # necesario para el ping (ICMP)
    restart: unless-stopped

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    environment:
      GF_SECURITY_ADMIN_PASSWORD: cambia-esta-clave
    volumes:
      - grafana-data:/var/lib/grafana
    ports: ["3000:3000"]
    restart: unless-stopped

volumes:
  prometheus-data:
  grafana-data:
```

**`prometheus/prometheus.yml`**

```yaml
global:
  scrape_interval: 15s

rule_files:
  - /etc/prometheus/alertas.yml

scrape_configs:
  - job_name: prometheus
    static_configs:
      - targets: ["localhost:9090"]

  - job_name: nodo
    static_configs:
      - targets: ["node-exporter:9100"]
        labels: { host: srv-01 }

  # Latencia y disponibilidad por ping (ICMP)
  - job_name: ping
    metrics_path: /probe
    params: { module: [icmp] }
    static_configs:
      - targets: ["10.0.20.1", "10.0.10.1", "1.1.1.1"]   # pfSense y una IP de Internet
    relabel_configs:
      - source_labels: [__address__]
        target_label: __param_target
      - source_labels: [__param_target]
        target_label: instance
      - target_label: __address__
        replacement: blackbox:9115

  # Disponibilidad de servicios web
  - job_name: web
    metrics_path: /probe
    params: { module: [http_2xx] }
    static_configs:
      - targets: ["http://grafana:3000/login"]
    relabel_configs:
      - source_labels: [__address__]
        target_label: __param_target
      - source_labels: [__param_target]
        target_label: instance
      - target_label: __address__
        replacement: blackbox:9115
```

**`prometheus/alertas.yml`**

```yaml
groups:
  - name: nexus
    rules:
      - alert: ServicioCaido
        expr: probe_success == 0
        for: 1m
        labels: { severity: critica }
        annotations:
          summary: "{{ $labels.instance }} no responde"

      - alert: DiscoCasiLleno
        expr: (1 - node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"}) > 0.85
        for: 5m
        labels: { severity: aviso }
        annotations:
          summary: "Disco raíz por encima del 85 %"

      - alert: CPUAlta
        expr: 100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[2m])) * 100) > 90
        for: 5m
        labels: { severity: aviso }
        annotations:
          summary: "CPU por encima del 90 % durante 5 minutos"
```

**`blackbox/blackbox.yml`**

```yaml
modules:
  icmp:
    prober: icmp
    timeout: 5s
  http_2xx:
    prober: http
    timeout: 5s
```

## 3. Arrancar y comprobar

```bash
cd ~/nexus-monitor
docker compose up -d
docker compose ps
```

Abre `http://10.0.20.10:9090/targets` (desde `admin-01`): todos los objetivos deben estar en **UP**.

> Con las reglas del lab 02, los puertos 3000/9090 solo son accesibles desde la VLAN de administración, que es lo correcto para una herramienta de gestión.

📸 **Captura `01-nexus-02-compose-ps.png`:** `docker compose ps` con los 4 contenedores *running*.
📸 **Captura `01-nexus-03-targets.png`:** página *Status → Targets* de Prometheus con todo en UP.

## 4. Grafana

1. Entra en `http://10.0.20.10:3000` (usuario `admin`, la contraseña del compose).
2. **Connections → Data sources → Add → Prometheus** → URL `http://prometheus:9090` → *Save & test*.
3. **Dashboards → New → Import**:
   - ID **1860** (*Node Exporter Full*) → estado del servidor.
   - ID **7587** (*Prometheus Blackbox Exporter*) → latencia y disponibilidad.
4. Crea un dashboard propio llamado **Nexus Monitor** con 4 paneles:
   - *Stat*: `probe_success` por instancia (verde/rojo).
   - *Time series*: `probe_icmp_duration_seconds{phase="rtt"} * 1000` (latencia en ms).
   - *Gauge*: uso de disco del nodo.
   - *Time series*: uso de CPU.

📸 **Captura `01-nexus-04-datasource.png`:** fuente de datos Prometheus con *Successfully queried*.
📸 **Captura `01-nexus-05-node-exporter.png`:** dashboard 1860 con datos.
📸 **Captura `01-nexus-06-dashboard-propio.png`:** tu dashboard Nexus Monitor (la captura principal del proyecto).

## 5. Provocar una alerta

```bash
docker stop grafana            # el objetivo web pasa a DOWN
# espera ~1-2 minutos y mira http://10.0.20.10:9090/alerts → ServicioCaido en FIRING
docker start grafana
```

Para la alerta de CPU puedes usar `sudo apt install -y stress-ng && stress-ng --cpu 0 --timeout 6m`.

📸 **Captura `01-nexus-07-alerta.png`:** página *Alerts* de Prometheus con `ServicioCaido` en estado **FIRING**.

## Capturas — resumen

| Archivo | Qué debe verse |
| :-- | :-- |
| `01-nexus-01-docker.png` | Docker instalado |
| `01-nexus-02-compose-ps.png` | Contenedores en marcha |
| `01-nexus-03-targets.png` | Objetivos en UP |
| `01-nexus-04-datasource.png` | Grafana conectado a Prometheus |
| `01-nexus-05-node-exporter.png` | Métricas del servidor |
| `01-nexus-06-dashboard-propio.png` | Dashboard Nexus Monitor ⭐ |
| `01-nexus-07-alerta.png` | Alerta disparada |

## Conclusiones (rellenar)

- **Qué métricas me resultaron más útiles:**
- **Problemas y cómo los resolví:** (por ejemplo, el ping del blackbox falla sin `NET_RAW`)
- **Siguiente paso:** Alertmanager con avisos por correo o Telegram; monitorizar también pfSense con SNMP.
