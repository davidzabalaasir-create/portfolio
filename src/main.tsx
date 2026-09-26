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

const skills = ['Linux', 'Windows Server', 'Docker', 'Virtualización', 'Redes TCP/IP', 'pfSense', 'Bash', 'Python', 'SQL', 'Git']
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
  { label: 'Email', href: 'mailto:davidzamaira2003@gmail.com' },
]

function App() {
  const [filter, setFilter] = useState<Category>('todos')
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'dark'
    const saved = localStorage.getItem('portfolio-theme') as Theme | null
    return saved ?? 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('portfolio-theme', theme)
  }, [theme])

  const visibleProjects = useMemo(
    () => (filter === 'todos' ? projects : projects.filter((project) => project.category === filter)),
    [filter],
  )

  const cvUrl = `${import.meta.env.BASE_URL}cv.html`

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Inicio portfolio de David">
          <span className="brand-mark">/</span>
          <span>DAVID</span>
        </a>

        <nav className="nav-links" aria-label="Navegación principal">
          <a href="#perfil">perfil</a>
          <a href="#formacion">formación</a>
          <a href="#proyectos">proyectos</a>
          <a href="#stack">stack</a>
          <a href="#contacto">contacto</a>
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
            <span className="pulse" /> disponible
          </a>
        </div>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-copy">
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
              <a className="button button-ghost" href={cvUrl} target="_blank" rel="noreferrer">
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

              <div className="mini-chart" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>

          <div className="scroll-note"><span className="scroll-line" /> desplázate para explorar</div>
        </section>

        <section className="profile section-grid" id="perfil">
          <div className="section-label"><span>02</span><span>perfil</span></div>

          <div className="profile-content">
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

          <div className="education-content">
            <p className="kicker">/ recorrido</p>

            {education.map((item) => (
              <div className="education-row" key={item.title}>
                <span>{item.period}</span>
                <strong>{item.title}</strong>
                <span>{item.subtitle}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="projects section-grid" id="proyectos">
          <div className="section-label"><span>04</span><span>proyectos</span></div>

          <div className="projects-content">
            <div className="section-heading">
              <div>
                <p className="kicker">/ trabajo de laboratorio</p>
                <h2>Construido para<br /><em>aprender haciendo.</em></h2>
              </div>

              <div className="filters" role="group" aria-label="Filtrar proyectos">
                {categories.map((category) => (
                  <button
                    type="button"
                    className={filter === category ? 'active' : ''}
                    onClick={() => setFilter(category)}
                    key={category}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="project-list">
              {visibleProjects.map((project) => (
                <article className="project-card" key={project.title}>
                  <div className="project-top">
                    <span className="project-number">{project.number}</span>
                    <span className="project-status"><i /> {project.status}</span>
                  </div>

                  <h3>{project.title}</h3>
                  <p>{project.description}</p>

                  <div className="project-stack">
                    {project.stack.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>

                  <span className="project-arrow">↗</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="stack section-grid" id="stack">
          <div className="section-label"><span>05</span><span>stack técnico</span></div>

          <div className="stack-content">
            <p className="kicker">/ herramientas que uso</p>
            <h2>La caja de<br /><em>herramientas.</em></h2>

            <div className="skill-cloud">
              {skills.map((skill, index) => (
                <span className={index % 4 === 0 ? 'highlight' : ''} key={skill}>{skill}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="contact section-grid" id="contacto">
          <div className="section-label"><span>06</span><span>contacto</span></div>

          <div className="contact-content">
            <p className="kicker">/ abre una conexión</p>
            <h2>¿Construimos algo<br /><em>resistente?</em></h2>

            <div className="contact-links">
              {socialLinks.map((link) => (
                <a key={link.label} className="contact-link" href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noreferrer' : undefined}>
                  {link.label} <span>↗</span>
                </a>
              ))}
            </div>

            <a className="contact-email" href="mailto:davidzamaira2003@gmail.com">
              davidzamaira2003@gmail.com <span>↗</span>
            </a>

            <p className="contact-location">Bilbao, España · disponible para prácticas y proyectos</p>
          </div>
        </section>
      </main>

      <footer>
        <span>DAVID © 2026</span>
        <span>construido con curiosidad + café</span>
        <span>status: <b>online</b></span>
      </footer>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
