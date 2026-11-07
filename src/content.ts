// Contenido editable del portfolio en español (es) e inglés (en).
// Para cambiar textos, proyectos o experiencia, edita este archivo.

export type Lang = 'es' | 'en'
export type CategoryId = 'redes' | 'sistemas' | 'seguridad'
export type FilterId = 'todos' | CategoryId

export type Project = {
  number: string
  title: string
  category: CategoryId
  live: boolean
  stack: string[]
  description: Record<Lang, string>
  /** Enlace opcional a la documentación o repositorio del laboratorio. */
  link?: string
}

export const EMAIL = 'davidzamaira2003@gmail.com'
export const LINKEDIN = 'https://www.linkedin.com/in/david-zabala-66b655233'
export const GITHUB = 'https://github.com/davidzabalaasir-create'

// Redes sociales: aparecen en contacto y en el pie de página.
// Para añadir una red nueva, crea su icono en SocialIcon.tsx y añade una línea aquí.
export type SocialId = 'linkedin' | 'github' | 'instagram' | 'tryhackme' | 'email'
export const SOCIALS: { id: SocialId; label: string; href: string }[] = [
  { id: 'linkedin', label: 'LinkedIn', href: LINKEDIN },
  { id: 'github', label: 'GitHub', href: GITHUB },
  { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/davidd_0.0' },
  { id: 'tryhackme', label: 'TryHackMe', href: 'https://tryhackme.com/p/david.zabala.asir' },
  { id: 'email', label: 'Email', href: `mailto:${EMAIL}` },
]

export const projects: Project[] = [
  {
    number: '01',
    title: 'NEXUS MONITOR',
    category: 'sistemas',
    live: true,
    stack: ['Linux', 'Docker', 'Grafana'],
    description: {
      es: 'Dashboard de observabilidad para vigilar servicios, latencias y capacidad en una red híbrida.',
      en: 'Observability dashboard to monitor services, latency and capacity across a hybrid network.',
    },
  },
  {
    number: '02',
    title: 'LABORATORIO LAN',
    category: 'redes',
    live: true,
    stack: ['pfSense', 'VLAN', 'TCP/IP'],
    description: {
      es: 'Arquitectura segmentada con VLAN, firewall perimetral y servicios internos aislados por roles.',
      en: 'Segmented architecture with VLANs, a perimeter firewall and internal services isolated by role.',
    },
  },
  {
    number: '03',
    title: 'BACKUP ZERO',
    category: 'sistemas',
    live: false,
    stack: ['Bash', 'Rsync', 'VirtualBox'],
    description: {
      es: 'Estrategia 3-2-1 automatizada con snapshots, cifrado y restauraciones verificadas.',
      en: 'Automated 3-2-1 strategy with snapshots, encryption and verified restores.',
    },
  },
  {
    number: '04',
    title: 'SURICATA SHIELD',
    category: 'seguridad',
    live: false,
    stack: ['Suricata', 'Linux', 'Logs'],
    description: {
      es: 'Sistema de detección de intrusiones para analizar tráfico y responder ante amenazas de red.',
      en: 'Intrusion detection system to analyse traffic and respond to network threats.',
    },
  },
]

export const content = {
  es: {
    meta: {
      title: 'David Zabala · Portfolio ASIR',
      description: 'Portfolio de David Zabala: administración de sistemas, redes y ciberseguridad (ASIR).',
    },
    nav: {
      perfil: 'perfil',
      formacion: 'formación',
      experiencia: 'experiencia',
      proyectos: 'proyectos',
      aisoc: 'aisoc',
      stack: 'stack',
      documentos: 'documentos',
      contacto: 'contacto',
    },
    ui: {
      home: 'Inicio portfolio de David',
      mainNav: 'Navegación principal',
      theme: 'Cambiar tema',
      language: 'Ver en inglés',
      languageShort: 'EN',
      available: 'disponible',
      openMenu: 'Abrir menú',
      closeMenu: 'Cerrar menú',
      scroll: 'desplázate para explorar',
      systemStatus: 'Estado del sistema',
      backTop: 'volver arriba ↑',
      footer: 'construido con curiosidad + café',
      copy: 'copiar',
      copied: '✓ copiado',
      download: 'descargar',
      filter: 'Filtrar proyectos',
      viewDocs: 'ver documentación',
    },
    hero: {
      eyebrow: 'administración de sistemas informáticos',
      title: ['Diseño sistemas', 'que resisten.'],
      text:
        'Soy David, estudiante de ASIR. Construyo infraestructuras claras, seguras y fáciles de mantener, desde la red hasta la automatización.',
      projects: 'ver proyectos',
      cv: 'descargar CV',
      console: [
        ['whoami', 'david / asir-admin'],
        ['uptime --portfolio', 'online · aprendiendo siempre'],
        ['location', 'bilbao, es'],
      ],
    },
    profile: {
      label: 'perfil',
      kicker: '/ sobre mí',
      title: ['Infraestructura con', 'intención.'],
      paragraphs: [
        'Me interesa entender cómo funcionan las cosas por debajo y convertir esa comprensión en soluciones útiles. Trabajo entre servidores, redes, seguridad y scripts.',
        'En cada laboratorio busco lo mismo: que todo sea observable, reproducible y que otra persona pueda mantenerlo sin adivinar.',
      ],
      stats: [
        { value: '04', label: 'laboratorios propios' },
        { value: '02', label: 'ciclos de FP en informática' },
        { value: '02', label: 'experiencias en IT' },
      ],
    },
    education: {
      label: 'formación',
      kicker: '/ recorrido',
      title: ['Aprendiendo', 'por capas.'],
      items: [
        { period: '2025 — actualidad', title: 'Administración de Sistemas Informáticos en Red', badge: 'ASIR' },
        { period: '2023 — 2025', title: 'Sistemas Microinformáticos y Redes · Centro de Estudios Mikeldi', badge: 'SMR' },
      ],
      extraTitle: 'formación complementaria',
      extra: [
        'Hoja de cálculo Excel — 60 h, curso autorizado por Lanbide (2026)',
        'Informática y ofimática: Windows, Word, Excel, PowerPoint e Internet — Centro de Estudio Inatec',
      ],
      languagesTitle: 'idiomas',
      languages: [
        { name: 'Español', level: 'nativo' },
        { name: 'Inglés', level: 'B1' },
        { name: 'Euskera', level: 'B1' },
      ],
    },
    experience: {
      label: 'experiencia',
      kicker: '/ en producción',
      title: ['Del laboratorio', 'al mundo real.'],
      items: [
        {
          period: 'feb 2026 — may 2026',
          role: 'Técnico informático',
          company: 'Worten · Portugal',
          tasks: [
            'Diagnóstico, reparación y mantenimiento de equipos (hardware y software).',
            'Instalación y configuración de Windows 10/11 y restauraciones de fábrica.',
            'Actualización de BIOS/UEFI y sustitución de componentes: RAM, HDD/SSD y fuentes.',
            'Resolución de incidencias: virus, controladores, actualizaciones y recuperación de datos.',
          ],
        },
        {
          period: 'mar 2022 — may 2022',
          role: 'Técnico de redes de datos (FCT)',
          company: 'Colegio Gaztelueta',
          tasks: [
            'Configuración y mantenimiento de la red LAN del centro.',
            'Instalación de switches, puntos de acceso WiFi y cableado estructurado Cat5e/Cat6.',
            'Diagnóstico de incidencias de conectividad TCP/IP, direccionamiento IP y DNS.',
            'Soporte técnico a usuarios y configuración de equipos.',
          ],
        },
      ],
    },
    projectsSection: {
      label: 'proyectos',
      kicker: '/ trabajo de laboratorio',
      title: ['Construido para', 'aprender haciendo.'],
      filters: { todos: 'todos', redes: 'redes', sistemas: 'sistemas', seguridad: 'seguridad' },
      live: 'operativo',
      wip: 'en evolución',
    },
    stack: {
      label: 'stack técnico',
      kicker: '/ competencias técnicas',
      title: ['Lo que sé', 'hacer.'],
      groups: [
        { title: 'sistemas', items: ['Linux', 'Windows Server', 'Windows 10/11', 'Docker', 'Virtualización'] },
        { title: 'redes & seguridad', items: ['TCP/IP', 'DNS / DHCP', 'pfSense', 'VLAN', 'Suricata', 'Cableado Cat6'] },
        { title: 'soporte & hardware', items: ['Montaje y reparación', 'BIOS / UEFI', 'Helpdesk', 'Recuperación de datos'] },
        { title: 'automatización', items: ['Bash', 'Python', 'SQL', 'Git'] },
        { title: 'desarrollo web', items: ['HTML', 'CSS', 'JavaScript'] },
      ],
    },
    documents: {
      label: 'documentos',
      kicker: '/ descargas',
      title: ['Todo en', 'un archivo.'],
      items: [
        {
          file: 'CV_David_Zabala_Maira.pdf',
          title: 'Currículum vitae',
          description: 'Formación, experiencia y competencias técnicas.',
          meta: 'PDF · 178 KB · español',
        },
        {
          file: 'Carta_de_Motivacion_David_Zabala.pdf',
          title: 'Carta de motivación',
          description: 'Presentación personal e intereses profesionales.',
          meta: 'PDF · 18 KB · inglés',
        },
      ],
    },
    contact: {
      label: 'contacto',
      kicker: '/ abre una conexión',
      title: ['¿Buscas un técnico?', 'Aquí estoy.'],
      location: 'Bilbao, España · disponible para prácticas y proyectos',
    },
  },

  en: {
    meta: {
      title: 'David Zabala · Systems & Networks Portfolio',
      description: 'David Zabala’s portfolio: systems administration, networking and cybersecurity.',
    },
    nav: {
      perfil: 'profile',
      formacion: 'education',
      experiencia: 'experience',
      proyectos: 'projects',
      aisoc: 'aisoc',
      stack: 'stack',
      documentos: 'documents',
      contacto: 'contact',
    },
    ui: {
      home: 'David’s portfolio home',
      mainNav: 'Main navigation',
      theme: 'Toggle theme',
      language: 'Ver en español',
      languageShort: 'ES',
      available: 'available',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      scroll: 'scroll to explore',
      systemStatus: 'System status',
      backTop: 'back to top ↑',
      footer: 'built with curiosity + coffee',
      copy: 'copy',
      copied: '✓ copied',
      download: 'download',
      filter: 'Filter projects',
      viewDocs: 'view docs',
    },
    hero: {
      eyebrow: 'network systems administration',
      title: ['I design systems', 'that endure.'],
      text:
        'I’m David, a Network Systems Administration (ASIR) student. I build clear, secure and maintainable infrastructure, from the network up to automation.',
      projects: 'see projects',
      cv: 'download CV',
      console: [
        ['whoami', 'david / asir-admin'],
        ['uptime --portfolio', 'online · always learning'],
        ['location', 'bilbao, spain'],
      ],
    },
    profile: {
      label: 'profile',
      kicker: '/ about me',
      title: ['Infrastructure with', 'intent.'],
      paragraphs: [
        'I like understanding how things work under the hood and turning that into useful solutions. I work across servers, networks, security and scripting.',
        'In every lab I aim for the same thing: everything observable, reproducible and maintainable by someone else without guesswork.',
      ],
      stats: [
        { value: '04', label: 'personal labs' },
        { value: '02', label: 'IT vocational programmes' },
        { value: '02', label: 'IT work experiences' },
      ],
    },
    education: {
      label: 'education',
      kicker: '/ path',
      title: ['Learning', 'layer by layer.'],
      items: [
        { period: '2025 — present', title: 'Network Computer Systems Administration', badge: 'ASIR' },
        { period: '2023 — 2025', title: 'Microcomputer Systems and Networks · Mikeldi Study Center', badge: 'SMR' },
      ],
      extraTitle: 'additional training',
      extra: [
        'Excel spreadsheets — 60 h course accredited by Lanbide (2026)',
        'IT and office software: Windows, Word, Excel, PowerPoint and Internet — Inatec Study Center',
      ],
      languagesTitle: 'languages',
      languages: [
        { name: 'Spanish', level: 'native' },
        { name: 'English', level: 'B1' },
        { name: 'Basque', level: 'B1' },
      ],
    },
    experience: {
      label: 'experience',
      kicker: '/ in production',
      title: ['From the lab', 'to the real world.'],
      items: [
        {
          period: 'feb 2026 — may 2026',
          role: 'IT Technician',
          company: 'Worten · Portugal',
          tasks: [
            'Diagnosis, repair and maintenance of computers (hardware and software).',
            'Windows 10/11 installation, configuration and factory restores.',
            'BIOS/UEFI updates and component replacement: RAM, HDD/SSD and power supplies.',
            'Troubleshooting: malware, drivers, updates and data recovery.',
          ],
        },
        {
          period: 'mar 2022 — may 2022',
          role: 'Data Network Technician (internship)',
          company: 'Colegio Gaztelueta',
          tasks: [
            'Configuration and maintenance of the school’s LAN.',
            'Installation of switches, WiFi access points and Cat5e/Cat6 structured cabling.',
            'Troubleshooting TCP/IP connectivity, IP addressing and DNS.',
            'User support and workstation setup.',
          ],
        },
      ],
    },
    projectsSection: {
      label: 'projects',
      kicker: '/ lab work',
      title: ['Built to', 'learn by doing.'],
      filters: { todos: 'all', redes: 'networks', sistemas: 'systems', seguridad: 'security' },
      live: 'running',
      wip: 'in progress',
    },
    stack: {
      label: 'tech stack',
      kicker: '/ technical skills',
      title: ['What I', 'can do.'],
      groups: [
        { title: 'systems', items: ['Linux', 'Windows Server', 'Windows 10/11', 'Docker', 'Virtualisation'] },
        { title: 'networks & security', items: ['TCP/IP', 'DNS / DHCP', 'pfSense', 'VLAN', 'Suricata', 'Cat6 cabling'] },
        { title: 'support & hardware', items: ['PC build & repair', 'BIOS / UEFI', 'Helpdesk', 'Data recovery'] },
        { title: 'automation', items: ['Bash', 'Python', 'SQL', 'Git'] },
        { title: 'web development', items: ['HTML', 'CSS', 'JavaScript'] },
      ],
    },
    documents: {
      label: 'documents',
      kicker: '/ downloads',
      title: ['All in', 'one file.'],
      items: [
        {
          file: 'CV_David_Zabala_Maira.pdf',
          title: 'Résumé (CV)',
          description: 'Education, experience and technical skills.',
          meta: 'PDF · 178 KB · Spanish',
        },
        {
          file: 'Carta_de_Motivacion_David_Zabala.pdf',
          title: 'Cover letter',
          description: 'Personal introduction and career interests.',
          meta: 'PDF · 18 KB · English',
        },
      ],
    },
    contact: {
      label: 'contact',
      kicker: '/ open a connection',
      title: ['Looking for a technician?', "I'm here."],
      location: 'Bilbao, Spain · open to internships and projects',
    },
  },
} satisfies Record<Lang, unknown>

export type Content = (typeof content)['es']
