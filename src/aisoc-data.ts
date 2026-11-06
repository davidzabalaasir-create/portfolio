// Datos ficticios para la demo aiSOC. Las alertas imitan las del Laboratorio LAN
// (VLAN 10/20/30, pfSense y Suricata) y el análisis de la "IA" está pregenerado.
import type { Lang } from './content'

export type Severity = 'critica' | 'alta' | 'media' | 'baja'

type Text = Record<Lang, string>

export type AlertTemplate = {
  id: string
  severity: Severity
  source: 'Suricata' | 'pfSense' | 'Grafana'
  signature: string
  /** Genera origen/destino aleatorios dentro de la red del laboratorio. */
  src: () => string
  dst: () => string
  port: number | null
  analysis: {
    summary: Text
    mitre: { id: string; name: string; tactic: Text }
    score: number
    verdict: 'tp' | 'fp' | 'review'
    evidence: Record<Lang, string[]>
    actions: Record<Lang, string[]>
    playbook: Record<Lang, string[]>
  }
}

const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)]
const host = (net: string, from = 100, to = 199) => `${net}.${from + Math.floor(Math.random() * (to - from + 1))}`
const USERS = '10.0.30'
const ADMIN = '10.0.10'
const SRV = '10.0.20'
const EXTERNAL = ['185.220.101.34', '45.155.205.12', '194.26.29.81', '91.240.118.7']

export const templates: AlertTemplate[] = [
  {
    id: 'scan',
    severity: 'alta',
    source: 'Suricata',
    signature: 'LAB Posible escaneo de puertos',
    src: () => host(USERS),
    dst: () => `${SRV}.10`,
    port: null,
    analysis: {
      summary: {
        es: 'Un equipo de la VLAN de usuarios ha enviado más de 20 paquetes SYN a puertos distintos de srv-01 en menos de 10 segundos. El patrón coincide con un escaneo SYN tipo nmap.',
        en: 'A host in the users VLAN sent more than 20 SYN packets to different ports on srv-01 in under 10 seconds. The pattern matches an nmap-style SYN scan.',
      },
      mitre: { id: 'T1046', name: 'Network Service Discovery', tactic: { es: 'Descubrimiento', en: 'Discovery' } },
      score: 72,
      verdict: 'tp',
      evidence: {
        es: ['412 conexiones SYN a 412 puertos distintos', 'Sin tráfico previo entre origen y destino', 'Ventana TCP de 1024 bytes, típica de nmap -sS'],
        en: ['412 SYN connections to 412 different ports', 'No previous traffic between source and target', 'TCP window of 1024 bytes, typical of nmap -sS'],
      },
      actions: {
        es: ['Bloquear temporalmente el origen en pfSense (alias BLOQUEADOS)', 'Preguntar al usuario del equipo si lanzó el escaneo', 'Revisar qué puertos respondieron abiertos'],
        en: ['Temporarily block the source in pfSense (BLOCKED alias)', 'Ask the host owner whether they ran the scan', 'Review which ports answered as open'],
      },
      playbook: {
        es: ['pfctl: alias BLOQUEADOS += {src}', 'pfSense: regla "Block BLOQUEADOS" activa en USUARIOS', 'ticket SOC-{n} creado · asignado a david'],
        en: ['pfctl: alias BLOCKED += {src}', 'pfSense: rule "Block BLOCKED" active on USERS', 'ticket SOC-{n} created · assigned to david'],
      },
    },
  },
  {
    id: 'ssh',
    severity: 'critica',
    source: 'Suricata',
    signature: 'LAB Posible fuerza bruta SSH',
    src: () => pick(EXTERNAL),
    dst: () => `${SRV}.10`,
    port: 22,
    analysis: {
      summary: {
        es: 'Una IP externa ha abierto 37 conexiones SSH contra srv-01 en 60 segundos. Coincide con un ataque de diccionario contra contraseñas. Ningún intento ha terminado en sesión iniciada.',
        en: 'An external IP opened 37 SSH connections to srv-01 within 60 seconds. This matches a dictionary attack against passwords. No attempt resulted in a successful login.',
      },
      mitre: { id: 'T1110.001', name: 'Brute Force: Password Guessing', tactic: { es: 'Acceso a credenciales', en: 'Credential Access' } },
      score: 91,
      verdict: 'tp',
      evidence: {
        es: ['37 intentos en 60 s desde la misma IP', 'La IP figura en listas públicas de nodos maliciosos', 'auth.log: "Failed password for invalid user admin"'],
        en: ['37 attempts in 60 s from the same IP', 'The IP appears on public threat lists', 'auth.log: "Failed password for invalid user admin"'],
      },
      actions: {
        es: ['Bloquear la IP en el firewall perimetral', 'Desactivar el acceso SSH por contraseña (solo claves)', 'Comprobar que no hubo ningún login correcto desde esa IP'],
        en: ['Block the IP at the perimeter firewall', 'Disable SSH password authentication (keys only)', 'Confirm there was no successful login from that IP'],
      },
      playbook: {
        es: ['pfctl: alias BLOQUEADOS += {src}', 'srv-01: PasswordAuthentication no · systemctl reload ssh', 'ticket SOC-{n} creado · prioridad P1'],
        en: ['pfctl: alias BLOCKED += {src}', 'srv-01: PasswordAuthentication no · systemctl reload ssh', 'ticket SOC-{n} created · priority P1'],
      },
    },
  },
  {
    id: 'policy',
    severity: 'alta',
    source: 'pfSense',
    signature: 'Usuarios intentan llegar a la VLAN de gestión',
    src: () => host(USERS),
    dst: () => host(ADMIN),
    port: 22,
    analysis: {
      summary: {
        es: 'Un equipo de usuarios ha intentado conectarse por SSH a la VLAN de administración. El firewall lo ha bloqueado, pero indica un intento de movimiento lateral o un equipo mal configurado.',
        en: 'A user host tried to reach the admin VLAN over SSH. The firewall blocked it, but it points to a lateral movement attempt or a misconfigured machine.',
      },
      mitre: { id: 'T1021.004', name: 'Remote Services: SSH', tactic: { es: 'Movimiento lateral', en: 'Lateral Movement' } },
      score: 64,
      verdict: 'review',
      evidence: {
        es: ['Regla "Block USUARIOS → RED_ADMIN" con 6 coincidencias', 'Primer intento de este equipo hacia la VLAN 10', 'Sin alertas previas del mismo origen'],
        en: ['Rule "Block USERS → ADMIN_NET" matched 6 times', 'First attempt from this host towards VLAN 10', 'No previous alerts from the same source'],
      },
      actions: {
        es: ['Mantener el bloqueo (ya aplicado por la política)', 'Revisar procesos y conexiones del equipo de origen', 'Confirmar con el usuario si buscaba un servicio legítimo'],
        en: ['Keep the block (already enforced by policy)', 'Review processes and connections on the source host', 'Check with the user whether they needed a legitimate service'],
      },
      playbook: {
        es: ['pfSense: bloqueo confirmado por política (sin cambios)', 'EDR: recogida de procesos en {src} solicitada', 'ticket SOC-{n} creado · estado: en revisión'],
        en: ['pfSense: block confirmed by policy (no changes)', 'EDR: process collection on {src} requested', 'ticket SOC-{n} created · status: under review'],
      },
    },
  },
  {
    id: 'uid',
    severity: 'critica',
    source: 'Suricata',
    signature: 'GPL ATTACK_RESPONSE id check returned root',
    src: () => pick(EXTERNAL),
    dst: () => host(USERS),
    port: 80,
    analysis: {
      summary: {
        es: 'Una respuesta HTTP contiene la salida del comando "id" con uid=0(root). Puede indicar que un servidor ejecutó comandos como root. En este laboratorio coincide con la prueba de testmynids.org.',
        en: 'An HTTP response contains the output of the "id" command with uid=0(root). It may mean a server executed commands as root. In this lab it matches the testmynids.org test.',
      },
      mitre: { id: 'T1059.004', name: 'Command and Scripting Interpreter: Unix Shell', tactic: { es: 'Ejecución', en: 'Execution' } },
      score: 38,
      verdict: 'fp',
      evidence: {
        es: ['Dominio de origen: testmynids.org (prueba de IDS conocida)', 'Petición iniciada desde dentro con curl', 'Sin tráfico posterior sospechoso'],
        en: ['Source domain: testmynids.org (well-known IDS test)', 'Request initiated from inside with curl', 'No suspicious follow-up traffic'],
      },
      actions: {
        es: ['Marcar como prueba controlada (falso positivo)', 'Documentar la prueba en el registro del laboratorio', 'No requiere contención'],
        en: ['Mark as controlled test (false positive)', 'Document the test in the lab log', 'No containment required'],
      },
      playbook: {
        es: ['SOC: alerta etiquetada como "prueba controlada"', 'Suricata: sin supresión (la regla sigue activa)', 'ticket SOC-{n} cerrado · falso positivo'],
        en: ['SOC: alert tagged as "controlled test"', 'Suricata: no suppression (rule stays active)', 'ticket SOC-{n} closed · false positive'],
      },
    },
  },
  {
    id: 'dns',
    severity: 'media',
    source: 'Suricata',
    signature: 'ET DNS Consultas DNS anómalamente largas',
    src: () => host(USERS),
    dst: () => '10.0.30.1',
    port: 53,
    analysis: {
      summary: {
        es: 'Un equipo hace muchas consultas DNS con subdominios largos y aleatorios hacia el mismo dominio. Es un patrón compatible con exfiltración de datos o un canal de control por DNS.',
        en: 'A host is making many DNS queries with long, random subdomains to the same domain. The pattern is consistent with data exfiltration or a DNS command channel.',
      },
      mitre: { id: 'T1071.004', name: 'Application Layer Protocol: DNS', tactic: { es: 'Mando y control', en: 'Command and Control' } },
      score: 58,
      verdict: 'review',
      evidence: {
        es: ['180 consultas en 5 min a *.cdn-sync.example', 'Longitud media del subdominio: 52 caracteres', 'Alta entropía en los nombres consultados'],
        en: ['180 queries in 5 min to *.cdn-sync.example', 'Average subdomain length: 52 characters', 'High entropy in queried names'],
      },
      actions: {
        es: ['Bloquear el dominio en el resolver DNS de pfSense', 'Aislar el equipo si las consultas continúan', 'Revisar qué proceso genera las consultas'],
        en: ['Block the domain in the pfSense DNS resolver', 'Isolate the host if queries continue', 'Find which process generates the queries'],
      },
      playbook: {
        es: ['Unbound: dominio cdn-sync.example → NXDOMAIN', 'monitorización reforzada de {src} durante 24 h', 'ticket SOC-{n} creado · estado: en revisión'],
        en: ['Unbound: domain cdn-sync.example → NXDOMAIN', 'enhanced monitoring of {src} for 24 h', 'ticket SOC-{n} created · status: under review'],
      },
    },
  },
  {
    id: 'grafana',
    severity: 'media',
    source: 'Grafana',
    signature: 'Varios inicios de sesión fallidos en Grafana',
    src: () => host(ADMIN),
    dst: () => `${SRV}.10`,
    port: 3000,
    analysis: {
      summary: {
        es: 'Se han producido 8 inicios de sesión fallidos en Grafana desde la VLAN de administración en 2 minutos. Por el origen y el ritmo, parece un error de contraseña de un administrador.',
        en: '8 failed Grafana logins came from the admin VLAN within 2 minutes. Given the source and the pace, it looks like an administrator mistyping a password.',
      },
      mitre: { id: 'T1110', name: 'Brute Force', tactic: { es: 'Acceso a credenciales', en: 'Credential Access' } },
      score: 31,
      verdict: 'fp',
      evidence: {
        es: ['Origen en la VLAN de gestión (equipo admin-01)', 'Ritmo humano: un intento cada 15 s', 'Inicio de sesión correcto justo después'],
        en: ['Source in the management VLAN (admin-01)', 'Human pace: one attempt every 15 s', 'Successful login right after'],
      },
      actions: {
        es: ['Confirmar con el administrador', 'Activar 2FA en Grafana', 'Sin contención necesaria'],
        en: ['Confirm with the administrator', 'Enable 2FA in Grafana', 'No containment needed'],
      },
      playbook: {
        es: ['SOC: confirmado con el administrador', 'Grafana: recomendación de 2FA registrada', 'ticket SOC-{n} cerrado · falso positivo'],
        en: ['SOC: confirmed with the administrator', 'Grafana: 2FA recommendation logged', 'ticket SOC-{n} closed · false positive'],
      },
    },
  },
  {
    id: 'icmp',
    severity: 'baja',
    source: 'Suricata',
    signature: 'LAB ICMP hacia la VLAN de servidores',
    src: () => host(USERS),
    dst: () => `${SRV}.10`,
    port: null,
    analysis: {
      summary: {
        es: 'Tráfico ICMP (ping) desde usuarios hacia los servidores. Por sí solo no es malicioso: lo más probable es una comprobación de conectividad.',
        en: 'ICMP (ping) traffic from users to the servers. On its own it is not malicious: most likely a connectivity check.',
      },
      mitre: { id: 'T1018', name: 'Remote System Discovery', tactic: { es: 'Descubrimiento', en: 'Discovery' } },
      score: 18,
      verdict: 'fp',
      evidence: {
        es: ['3 paquetes echo-request', 'Un único destino', 'Sin escaneo posterior'],
        en: ['3 echo-request packets', 'A single destination', 'No follow-up scan'],
      },
      actions: {
        es: ['Sin acción', 'Correlacionar si aparece junto a un escaneo de puertos'],
        en: ['No action', 'Correlate if it appears alongside a port scan'],
      },
      playbook: {
        es: ['SOC: alerta informativa archivada', 'correlación activa con la regla de escaneo'],
        en: ['SOC: informational alert archived', 'correlation with the port-scan rule enabled'],
      },
    },
  },
]

export const severityOrder: Severity[] = ['critica', 'alta', 'media', 'baja']

export const aisocText = {
  es: {
    label: 'aiSOC',
    kicker: '/ demo interactiva',
    title: ['Un SOC con', 'copiloto de IA.'],
    intro:
      'Simulación de un centro de operaciones de seguridad sobre la red de mis laboratorios. Las alertas llegan en directo; elige una y el analista IA la explica, la relaciona con MITRE ATT&CK y propone la respuesta.',
    disclaimer: 'Simulación con datos ficticios: el análisis está pregenerado para mostrar el flujo de trabajo de un SOC.',
    queue: 'cola de alertas',
    live: 'en directo',
    paused: 'en pausa',
    pause: 'pausar',
    resume: 'reanudar',
    all: 'todas',
    severities: { critica: 'crítica', alta: 'alta', media: 'media', baja: 'baja' },
    kpis: { total: 'alertas', critical: 'críticas', contained: 'contenidas', mttr: 'MTTR simulado' },
    analyst: 'analista IA',
    pick: 'Selecciona una alerta de la cola para analizarla.',
    summary: 'resumen',
    evidence: 'evidencias',
    actions: 'acciones recomendadas',
    risk: 'riesgo',
    verdicts: { tp: 'verdadero positivo', fp: 'probable falso positivo', review: 'requiere revisión' },
    respond: 'ejecutar respuesta',
    responded: 'respuesta ejecutada',
    contained: 'contenida',
    newAlert: 'Nueva alerta',
  },
  en: {
    label: 'aiSOC',
    kicker: '/ interactive demo',
    title: ['A SOC with an', 'AI copilot.'],
    intro:
      'A simulated security operations centre running on my lab network. Alerts stream in live; pick one and the AI analyst explains it, maps it to MITRE ATT&CK and proposes a response.',
    disclaimer: 'Simulation with fictitious data: the analysis is pre-generated to show a SOC workflow.',
    queue: 'alert queue',
    live: 'live',
    paused: 'paused',
    pause: 'pause',
    resume: 'resume',
    all: 'all',
    severities: { critica: 'critical', alta: 'high', media: 'medium', baja: 'low' },
    kpis: { total: 'alerts', critical: 'critical', contained: 'contained', mttr: 'simulated MTTR' },
    analyst: 'AI analyst',
    pick: 'Pick an alert from the queue to analyse it.',
    summary: 'summary',
    evidence: 'evidence',
    actions: 'recommended actions',
    risk: 'risk',
    verdicts: { tp: 'true positive', fp: 'likely false positive', review: 'needs review' },
    respond: 'run response',
    responded: 'response executed',
    contained: 'contained',
    newAlert: 'New alert',
  },
} satisfies Record<Lang, unknown>
