import { StrictMode, useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

type Project = {
  title: string
  description: string
  category: 'redes' | 'sistemas' | 'seguridad'
  status: 'operativo' | 'en evolución'
  stack: string[]
  number: string
}

type Theme = 'dark' | 'light'
type Category = 'todos' | Project['category']

const projects: Project[] = [
  {
    title: 'NEXUS MONITOR',
    description: 'Dashboard de observabilidad para vigilar servicios, latencias y capacidad en una red híbrida.',
    category: 'sistemas',
    status: 'operativo',
    stack: ['Linux', 'Docker', 'Grafana'],
    number: '01',
  },
  {
    title: 'LABORATORIO LAN',
    description: 'Arquitectura segmentada con VLAN, firewall perimetral y servicios internos aislados por roles.',
    category: 'redes',
    status: 'operativo',
    stack: ['pfSense', 'VLAN', 'TCP/IP'],
    number: '02',
  },
  {
    title: 'BACKUP ZERO',
    description: 'Estrategia 3-2-1 automatizada con snapshots, cifrado y restauraciones verificadas.',
    category: 'sistemas',
    status: 'en evolución',
    stack: ['Bash', 'Rsync', 'VirtualBox'],
    number: '03',
  },
  {
    title: 'SURICATA SHIELD',
    description: 'Sistema de detección de intrusiones para analizar tráfico y responder ante amenazas de red.',
    category: 'seguridad',
    status: 'en evolución',
    stack: ['Suricata', 'Linux', 'Logs'],
    number: '04',
  },
]

const skillGroups = [
  { title: 'sistemas', items: ['Linux', 'Windows Server', 'Docker', 'Virtualización'] },
  { title: 'redes & seguridad', items: ['Redes TCP/IP', 'pfSense', 'VLAN', 'Suricata'] },
  { title: 'automatización', items: ['Bash', 'Python', 'SQL', 'Git'] },
]

const navItems = [
  { id: 'perfil', label: 'perfil' },
  { id: 'formacion', label: 'formación' },
  { id: 'proyectos', label: 'proyectos' },
  { id: 'stack', label: 'stack' },
  { id: 'contacto', label: 'contacto' },
]

const EMAIL = 'davidzamaira2003@gmail.com'
const categories: Category[] = ['todos', 'redes', 'sistemas', 'seguridad']

const education = [
  { period: '2025 — actualidad', title: 'Administración de Sistemas Informáticos en Red', subtitle: 'ASIR' },
  { period: '2023 — 2025', title: 'Sistemas Microinformáticos y Redes', subtitle: 'SMR' },
]

const stats = [
  { value: '03', label: 'áreas de foco' },
  { value: '24/7', label: 'mentalidad operativa' },
  { value: '∞', label: 'curiosidad técnica' },
]

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/davidzabalaasir-create' },
]

function App() {
  const [filter, setFilter] = useState<Category>('todos')
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'dark'
    const saved = localStorage.getItem('portfolio-theme') as Theme | null
    return saved ?? 'dark'
  })

  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#08101d' : '#edf4f2')
    localStorage.setItem('portfolio-theme', theme)
  }, [theme])

  // Resalta en la navegación la sección visible
  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  // Animación de entrada al hacer scroll
  useEffect(() => {
    const elements = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${EMAIL}`
    }
  }

  const visibleProjects = useMemo(
    () => (filter === 'todos' ? projects : projects.filter((project) => project.category === filter)),
    [filter],
  )

  const cvPath = `${import.meta.env.BASE_URL}CV_David_Zabala_Maira.pdf`

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Inicio portfolio de David">
          <span className="brand-mark">/</span>
          <span>DAVID</span>
        </a>

        <nav
          id="main-nav"
          className={`nav-links${menuOpen ? ' open' : ''}`}
          aria-label="Navegación principal"
        >
          {navItems.map((item, index) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={activeSection === item.id ? 'active' : ''}
              aria-current={activeSection === item.id ? 'true' : undefined}
              onClick={() => setMenuOpen(false)}
            >
              <span className="nav-index">0{index + 2}</span>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="topbar-actions">
          <button
            type="button"
            className="theme-toggle"
            aria-label="Cambiar tema"
            aria-pressed={theme === 'light'}
            onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
          >
            {theme === 'dark' ? '☀' : '☾'}
          </button>
          <a className="availability" href="#contacto">
            <span className="pulse" /> <span className="availability-text">disponible</span>
          </a>
          <button
            type="button"
            className={`menu-toggle${menuOpen ? ' open' : ''}`}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            aria-controls="main-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-copy reveal is-visible">
            <p className="eyebrow"><span>01</span> / administración de sistemas informáticos</p>
            <h1>
              Diseño sistemas<br />
              <em>que resisten.</em>
            </h1>
            <p className="hero-text">
              Soy David, estudiante de ASIR. Construyo infraestructuras claras, seguras y fáciles de mantener,
              desde la red hasta la automatización.
            </p>

            <div className="hero-actions">
              <a className="button button-primary" href="#proyectos">
                ver proyectos <span>↗</span>
              </a>
              <a
                className="button button-ghost"
                href={cvPath}
                download="CV_David_Zabala_Maira.pdf"
              >
                descargar CV <span>↓</span>
              </a>
            </div>
          </div>

          <div className="hero-console" aria-label="Estado del sistema">
            <div className="console-head">
              <span>system_status.log</span>
              <span className="live"><i /> LIVE</span>
            </div>
            <div className="console-body">
              <p><b className="cyan">$</b> whoami</p>
              <p className="console-value">david / asir-admin</p>

              <p><b className="cyan">$</b> uptime --portfolio</p>
              <p className="console-value">online · aprendiendo siempre</p>

              <p><b className="cyan">$</b> location</p>
              <p className="console-value">bilbao, es</p>

              <p><b className="cyan">$</b> <span className="cursor" aria-hidden="true" /></p>

              <div className="mini-chart" aria-hidden="true">
                {Array.from({ length: 8 }, (_, i) => (
                  <span key={i} style={{ animationDelay: `${i * 120}ms` }} />
                ))}
              </div>
            </div>
          </div>

          <div className="scroll-note"><span className="scroll-line" /> desplázate para explorar</div>
        </section>

        <section className="profile section-grid" id="perfil">
          <div className="section-label"><span>02</span><span>perfil</span></div>

          <div className="profile-content reveal">
            <div>
              <p className="kicker">/ sobre mí</p>
              <h2>Infraestructura con<br /><em>intención.</em></h2>
            </div>

            <div className="profile-copy">
              <p>
                Me interesa entender cómo funcionan las cosas por debajo y convertir esa comprensión en soluciones útiles.
                Trabajo entre servidores, redes, seguridad y scripts.
              </p>
              <p>
                En cada laboratorio busco lo mismo: que todo sea observable, reproducible y que otra persona pueda
                mantenerlo sin adivinar.
              </p>
            </div>

            <div className="stats">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="education section-grid" id="formacion">
          <div className="section-label"><span>03</span><span>formación</span></div>

          <div className="education-content reveal">
            <p className="kicker">/ recorrido</p>
            <h2>Aprendiendo<br /><em>por capas.</em></h2>

            <div className="education-list">
            {education.map((item) => (
              <div className="education-row" key={item.title}>
                <span>{item.period}</span>
                <strong>{item.title}</strong>
                <span className="education-badge">{item.subtitle}</span>
              </div>
            ))}
            </div>
          </div>
        </section>

        <section className="projects section-grid" id="proyectos">
          <div className="section-label"><span>04</span><span>proyectos</span></div>

          <div className="projects-content reveal">
            <div className="section-heading">
              <div>
                <p className="kicker">/ trabajo de laboratorio</p>
                <h2>Construido para<br /><em>aprender haciendo.</em></h2>
              </div>

              <div className="filters" role="group" aria-label="Filtrar proyectos">
                {categories.map((category) => (
                  <button
                    type="button"
                    aria-pressed={filter === category}
                    className={filter === category ? 'active' : ''}
                    onClick={() => setFilter(category)}
                    key={category}
                  >
                    {category}
                    <span className="filter-count">
                      {category === 'todos' ? projects.length : projects.filter((p) => p.category === category).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="project-list">
              {visibleProjects.map((project) => (
                <article className="project-card" key={project.title} data-category={project.category}>
                  <div className="project-top">
                    <span className="project-number">{project.number}</span>
                    <span className={`project-status ${project.status === 'operativo' ? 'is-live' : 'is-wip'}`}><i /> {project.status}</span>
                  </div>

                  <h3>{project.title}</h3>
                  <p>{project.description}</p>

                  <div className="project-footer">
                    <div className="project-stack">
                      {project.stack.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                    <span className="project-arrow" aria-hidden="true">↗</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="stack section-grid" id="stack">
          <div className="section-label"><span>05</span><span>stack técnico</span></div>

          <div className="stack-content reveal">
            <p className="kicker">/ herramientas que uso</p>
            <h2>La caja de<br /><em>herramientas.</em></h2>

            <div className="skill-groups">
              {skillGroups.map((group) => (
                <div className="skill-group" key={group.title}>
                  <p className="skill-group-title"><span>~/</span>{group.title}</p>
                  <div className="skill-cloud">
                    {group.items.map((skill, index) => (
                      <span className={index === 0 ? 'highlight' : ''} key={skill}>{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="contact section-grid" id="contacto">
          <div className="section-label"><span>06</span><span>contacto</span></div>

          <div className="contact-content reveal">
            <p className="kicker">/ abre una conexión</p>
            <h2>¿Construimos algo<br /><em>resistente?</em></h2>

            <div className="contact-links">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  className="contact-link"
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                >
                  {link.label} <span>↗</span>
                </a>
              ))}
            </div>

            <div className="contact-email-row">
              <a className="contact-email" href={`mailto:${EMAIL}`}>
                {EMAIL} <span>↗</span>
              </a>
              <button type="button" className="copy-button" onClick={copyEmail} aria-live="polite">
                {copied ? '✓ copiado' : 'copiar'}
              </button>
            </div>

            <p className="contact-location">Bilbao, España · disponible para prácticas y proyectos</p>
          </div>
        </section>
      </main>

      <footer>
        <span>DAVID © {new Date().getFullYear()}</span>
        <span>construido con curiosidad + café</span>
        <a href="#inicio" className="back-top">volver arriba ↑</a>
      </footer>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
