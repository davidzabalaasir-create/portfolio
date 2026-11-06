# 04 · Suricata Shield — detección de intrusiones

**Objetivo:** instalar Suricata como IDS en la red del laboratorio, escribir reglas propias, generar ataques controlados desde otra máquina y analizar las alertas.

```text
   user-01 (atacante de pruebas, VLAN 30)
        │  nmap, ssh, curl
        ▼
 ───────────── red interna lab-trunk (modo promiscuo) ─────────────
        │                                  │
   srv-01 (víctima, VLAN 20)        sensor Suricata (escucha todo el tráfico)
                                    └─► /var/log/suricata/eve.json  →  jq / Grafana
```

> ⚠️ Haz estas pruebas **solo en tu laboratorio**. Escanear o atacar redes ajenas es ilegal.

**Requisitos:** puedes usar `srv-01` como sensor o una VM nueva `ids-01` (Ubuntu Server, 2 GB RAM). El adaptador que escucha debe estar en la red interna `lab-trunk` con **modo promiscuo: Permitir todo**.

## 1. Instalar Suricata

```bash
sudo add-apt-repository -y ppa:oisf/suricata-stable
sudo apt update
sudo apt install -y suricata jq
suricata --build-info | head -5
```

## 2. Configuración básica — `/etc/suricata/suricata.yaml`

Ajusta estas partes (el resto se deja por defecto):

```yaml
vars:
  address-groups:
    HOME_NET: "[10.0.10.0/24,10.0.20.0/24,10.0.30.0/24]"
    EXTERNAL_NET: "!$HOME_NET"

af-packet:
  - interface: enp0s3          # la interfaz conectada a lab-trunk (mírala con: ip -br link)
    cluster-id: 99
    cluster-type: cluster_flow
    defrag: yes

default-rule-path: /var/lib/suricata/rules
rule-files:
  - suricata.rules
  - /etc/suricata/rules/local.rules
```

> Si la interfaz recibe tráfico etiquetado con VLAN, Suricata lo entiende sin cambios (`vlan.use-for-tracking: true` viene activado por defecto).

## 3. Reglas de la comunidad y reglas propias

```bash
sudo suricata-update                     # descarga Emerging Threats Open
sudo mkdir -p /etc/suricata/rules
sudo nano /etc/suricata/rules/local.rules
```

**`/etc/suricata/rules/local.rules`**

```text
# 1. Ping hacia los servidores (útil para ver que el sensor funciona)
alert icmp any any -> 10.0.20.0/24 any (msg:"LAB ICMP hacia la VLAN de servidores"; itype:8; sid:1000001; rev:1;)

# 2. Escaneo de puertos: muchos SYN desde el mismo origen en poco tiempo
alert tcp any any -> $HOME_NET any (msg:"LAB Posible escaneo de puertos"; flags:S,12; \
  threshold:type both, track by_src, count 20, seconds 10; classtype:attempted-recon; sid:1000002; rev:1;)

# 3. Fuerza bruta SSH: muchos intentos de conexión al puerto 22
alert tcp any any -> $HOME_NET 22 (msg:"LAB Posible fuerza bruta SSH"; flow:to_server; flags:S,12; \
  threshold:type both, track by_src, count 5, seconds 60; classtype:attempted-admin; sid:1000003; rev:1;)

# 4. Acceso desde la VLAN de usuarios a la de administración (no debería ocurrir)
alert ip 10.0.30.0/24 any -> 10.0.10.0/24 any (msg:"LAB Usuarios intentan llegar a la VLAN de gestión"; \
  classtype:policy-violation; sid:1000004; rev:1;)
```

```bash
sudo suricata -T -c /etc/suricata/suricata.yaml -v     # comprueba la configuración y las reglas
sudo systemctl enable --now suricata
sudo systemctl status suricata --no-pager
```

📸 **Captura `04-suricata-01-test-config.png`:** salida de `suricata -T` terminando en *Configuration provided was successfully loaded*.
📸 **Captura `04-suricata-02-reglas.png`:** el archivo `local.rules` con tus reglas.

## 4. Generar tráfico de prueba (desde user-01)

```bash
sudo apt install -y nmap
ping -c 3 10.0.20.10                                  # regla 1
nmap -sS -p 1-1000 10.0.20.10                         # regla 2: escaneo
for i in $(seq 1 8); do ssh -o ConnectTimeout=2 -o BatchMode=yes fake@10.0.20.10 2>/dev/null; done   # regla 3
ping -c 2 10.0.10.1                                   # regla 4 (si llega al sensor)
curl -s http://testmynids.org/uid/index.html          # prueba clásica: dispara una regla de ET Open
```

📸 **Captura `04-suricata-03-ataque.png`:** terminal de `user-01` lanzando el `nmap`.

## 5. Analizar las alertas

```bash
sudo tail -f /var/log/suricata/fast.log               # vista rápida, una línea por alerta

# Alertas en formato JSON con jq
sudo jq -c 'select(.event_type=="alert") | {hora:.timestamp, origen:.src_ip, destino:.dest_ip, firma:.alert.signature}' \
  /var/log/suricata/eve.json | tail -20

# Top de firmas disparadas
sudo jq -r 'select(.event_type=="alert") | .alert.signature' /var/log/suricata/eve.json \
  | sort | uniq -c | sort -rn | head
```

📸 **Captura `04-suricata-04-fast-log.png`:** `fast.log` con las alertas de tus reglas `LAB …` ⭐.
📸 **Captura `04-suricata-05-jq.png`:** resultado del top de firmas con `jq`.

## 6. Respuesta: bloquear al atacante

Suricata en modo IDS solo **detecta**. La respuesta la aplicas en el firewall:

1. En pfSense, **Firewall → Aliases** → crea `BLOQUEADOS` con la IP de `user-01`.
2. **Firewall → Rules → USUARIOS** → regla *Block* con origen `BLOQUEADOS` arriba del todo.
3. Repite el `nmap`: ya no llega a `srv-01` (y Suricata deja de ver el tráfico hacia la VLAN 20).

📸 **Captura `04-suricata-06-respuesta.png`:** regla de bloqueo en pfSense y el `nmap` fallando.

## 7. (Opcional) Ver las alertas en Grafana

Si hiciste el lab 01, añade Loki y Promtail al `docker-compose.yml` para leer `eve.json` y crear un panel con las alertas por firma y por IP de origen.

## Capturas — resumen

| Archivo | Qué debe verse |
| :-- | :-- |
| `04-suricata-01-test-config.png` | Configuración validada |
| `04-suricata-02-reglas.png` | Reglas propias |
| `04-suricata-03-ataque.png` | Escaneo lanzado desde user-01 |
| `04-suricata-04-fast-log.png` | Alertas detectadas ⭐ |
| `04-suricata-05-jq.png` | Análisis con jq |
| `04-suricata-06-respuesta.png` | Bloqueo en pfSense |

## Conclusiones (rellenar)

- **Qué reglas generaron más alertas y por qué:**
- **Falsos positivos encontrados y cómo ajusté los umbrales:**
- **Siguiente paso:** modo IPS en línea (Suricata dentro de pfSense con el paquete oficial), o un SIEM ligero (Wazuh).
