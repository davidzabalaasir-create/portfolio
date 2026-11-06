# 02 · Laboratorio LAN — segmentación con VLAN y pfSense

**Objetivo:** construir una red segmentada en tres VLAN con un firewall pfSense que hace de router entre ellas, reparte IPs por DHCP y aplica reglas de acceso por rol.

```text
                 Internet (NAT de VirtualBox)
                            │ WAN (em0)
                     ┌──────┴──────┐
                     │  fw-pfsense │  LAN (em1) = troncal 802.1Q
                     └──────┬──────┘
          ┌─────────────────┼─────────────────┐
     VLAN 10            VLAN 20            VLAN 30
  10.0.10.0/24       10.0.20.0/24       10.0.30.0/24
  Administración      Servidores          Usuarios
    admin-01            srv-01             user-01
```

| VLAN | Red | Puerta de enlace | DHCP | Política |
| :-: | :-- | :-- | :-- | :-- |
| 10 | 10.0.10.0/24 | 10.0.10.1 | .100–.199 | Acceso total (gestión) |
| 20 | 10.0.20.0/24 | 10.0.20.1 | .100–.199 (srv-01 con IP fija .10) | Solo salida a Internet y respuestas |
| 30 | 10.0.30.0/24 | 10.0.30.1 | .100–.199 | Internet y servicios de VLAN 20; **sin acceso a VLAN 10** |

## 1. Preparar las máquinas en VirtualBox

1. Crea la VM `fw-pfsense` (Tipo: BSD, Versión: FreeBSD 64-bit; 1 GB RAM; 16 GB disco).
2. **Red de `fw-pfsense`:**
   - Adaptador 1 → **NAT** (será la WAN).
   - Adaptador 2 → **Red interna** llamada `lab-trunk`. En *Avanzado*: tipo **Intel PRO/1000 MT Desktop** y modo promiscuo **Permitir todo** (necesario para que pasen las etiquetas VLAN).
3. Crea `admin-01`, `srv-01` y `user-01` con un único adaptador en **Red interna `lab-trunk`**, modo promiscuo **Permitir todo**.

> En VirtualBox la red interna funciona como un switch que deja pasar las tramas etiquetadas; por eso cada cliente etiquetará su propio tráfico con su VLAN (paso 5).

## 2. Instalar pfSense

1. Arranca la ISO y acepta las opciones por defecto (sistema de archivos ZFS o UFS, da igual para el laboratorio).
2. Al reiniciar, en *Should VLANs be set up now?* responde **n** (las crearemos desde la web).
3. Asigna **WAN = em0** y **LAN = em1**.
4. Opción **2) Set interface(s) IP address** → LAN → `10.0.10.1/24`, activa DHCP en LAN con rango `10.0.10.100–10.0.10.199`. Esta LAN temporal te permite entrar a la web desde `admin-01` sin VLAN.

📸 **Captura `02-lan-01-consola-pfsense.png`:** menú de consola de pfSense con WAN y LAN asignadas y sus IPs.

## 3. Crear las VLAN en pfSense

Desde `admin-01` (temporalmente sin VLAN, en la red 10.0.10.0/24) abre `https://10.0.10.1` (usuario `admin`, contraseña `pfsense`; cámbiala en el asistente).

1. **Interfaces → Assignments → VLANs → Add**, tres veces:
   - Parent `em1`, VLAN Tag `10`, descripción `ADMIN`
   - Parent `em1`, VLAN Tag `20`, descripción `SERVIDORES`
   - Parent `em1`, VLAN Tag `30`, descripción `USUARIOS`
2. **Interfaces → Assignments**: añade `em1.10`, `em1.20` y `em1.30`. Entra en cada una:
   - *Enable*, descripción (`ADMIN`, `SERVIDORES`, `USUARIOS`), *IPv4 Configuration Type: Static IPv4*.
   - IPs: `10.0.10.1/24`, `10.0.20.1/24`, `10.0.30.1/24`.
3. Cambia la LAN original (`em1` sin etiqueta) a otra red (por ejemplo `192.168.99.1/24`) o desactívala cuando ya entres por la VLAN 10.

📸 **Captura `02-lan-02-vlans.png`:** pantalla *Interfaces → Assignments → VLANs* con las tres VLAN.

## 4. DHCP por VLAN

**Services → DHCP Server** → pestaña de cada VLAN → *Enable* y rango `.100` a `.199`.

En la pestaña `SERVIDORES`, añade una **reserva estática** (*Static Mappings*) para la MAC de `srv-01` → `10.0.20.10`.

📸 **Captura `02-lan-03-dhcp.png`:** configuración DHCP de una VLAN con el rango y la reserva de `srv-01`.

## 5. Configurar los clientes Linux con VLAN

En cada cliente Ubuntu, edita `/etc/netplan/50-lab.yaml` (ajusta `enp0s3` al nombre que muestre `ip link`):

```yaml
# admin-01 → VLAN 10 (cambia id y nombre en cada máquina: srv-01 → 20, user-01 → 30)
network:
  version: 2
  ethernets:
    enp0s3:
      dhcp4: false
  vlans:
    vlan10:
      id: 10
      link: enp0s3
      dhcp4: true
```

```bash
sudo chmod 600 /etc/netplan/50-lab.yaml
sudo netplan apply
ip -br addr        # debe aparecer vlan10 con una IP 10.0.10.x
ip route           # la ruta por defecto debe ir a 10.0.10.1
```

📸 **Captura `02-lan-04-cliente-vlan.png`:** salida de `ip -br addr` e `ip route` en `user-01` (VLAN 30).

## 6. Reglas de firewall

En pfSense las reglas se evalúan de arriba abajo por interfaz. Crea primero un **alias** en *Firewall → Aliases*: `RED_ADMIN` = `10.0.10.0/24`.

**Firewall → Rules → ADMIN (VLAN 10)**

| Acción | Origen | Destino | Descripción |
| :-- | :-- | :-- | :-- |
| Pass | ADMIN net | any | Gestión: acceso total |

**Firewall → Rules → SERVIDORES (VLAN 20)**

| Acción | Origen | Destino | Puerto | Descripción |
| :-- | :-- | :-- | :-- | :-- |
| Pass | SERVIDORES net | This firewall | 53 (DNS) | Resolver DNS |
| Block | SERVIDORES net | RED_ADMIN | any | Servidores no inician conexiones a gestión |
| Block | SERVIDORES net | USUARIOS net | any | Ni hacia usuarios |
| Pass | SERVIDORES net | any | any | Salida a Internet (actualizaciones) |

**Firewall → Rules → USUARIOS (VLAN 30)**

| Acción | Origen | Destino | Puerto | Descripción |
| :-- | :-- | :-- | :-- | :-- |
| Pass | USUARIOS net | This firewall | 53 (DNS) | Resolver DNS |
| Block | USUARIOS net | RED_ADMIN | any | **Usuarios sin acceso a gestión** (marca *Log*) |
| Pass | USUARIOS net | 10.0.20.10 | 80, 443 | Acceso a los servicios web de srv-01 |
| Block | USUARIOS net | SERVIDORES net | any | Resto de servidores bloqueado |
| Pass | USUARIOS net | any | any | Salida a Internet |

📸 **Captura `02-lan-05-reglas-usuarios.png`:** reglas de la interfaz USUARIOS.
📸 **Captura `02-lan-06-reglas-servidores.png`:** reglas de la interfaz SERVIDORES.

## 7. Verificación

Desde `user-01` (VLAN 30):

```bash
ping -c 3 10.0.30.1          # ✅ puerta de enlace
ping -c 3 1.1.1.1            # ✅ Internet
ping -c 3 10.0.10.100        # ❌ debe fallar: VLAN de gestión bloqueada
curl -I http://10.0.20.10    # ✅ si srv-01 tiene un servicio web (lo tendrás tras el lab 01)
```

Desde `admin-01` (VLAN 10):

```bash
ping -c 3 10.0.30.100        # ✅ gestión llega a usuarios
sudo apt install -y nmap
nmap -sn 10.0.20.0/24        # descubre srv-01
```

En pfSense: **Status → System Logs → Firewall** muestra los bloqueos de `user-01` hacia la VLAN 10.

📸 **Captura `02-lan-07-prueba-bloqueo.png`:** terminal de `user-01` con el ping a Internet funcionando y el ping a la VLAN 10 fallando.
📸 **Captura `02-lan-08-log-firewall.png`:** registro del firewall con las conexiones bloqueadas.
📸 **Captura `02-lan-09-dashboard.png`:** *Status → Dashboard* de pfSense con las interfaces activas.

## Capturas — resumen

| Archivo | Qué debe verse |
| :-- | :-- |
| `02-lan-01-consola-pfsense.png` | Consola con WAN/LAN asignadas |
| `02-lan-02-vlans.png` | Las tres VLAN creadas |
| `02-lan-03-dhcp.png` | DHCP de una VLAN + reserva de srv-01 |
| `02-lan-04-cliente-vlan.png` | `ip -br addr` / `ip route` en un cliente |
| `02-lan-05-reglas-usuarios.png` | Reglas de USUARIOS |
| `02-lan-06-reglas-servidores.png` | Reglas de SERVIDORES |
| `02-lan-07-prueba-bloqueo.png` | Ping permitido y ping bloqueado |
| `02-lan-08-log-firewall.png` | Log de bloqueos |
| `02-lan-09-dashboard.png` | Dashboard de pfSense |

## Conclusiones (rellenar)

- **Qué funcionó a la primera:**
- **Problemas y cómo los resolví:** (por ejemplo, tramas VLAN que no pasaban hasta activar el modo promiscuo)
- **Qué mejoraría:** (por ejemplo, un switch virtual gestionable, IPv6, VPN de administración)
