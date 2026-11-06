import { StrictMode, useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { content, EMAIL, GITHUB, LINKEDIN, projects, type FilterId, type Lang } from './content'
import './styles.css'

type Theme = 'dark' | 'light'

const sectionIds = ['perfil', 'formacion', 'experiencia', 'proyectos', 'stack', 'documentos', 'contacto'] as const
const filters: FilterId[] = ['todos', 'redes', 'sistemas', 'seguridad']
const base = import.meta.env.BASE_URL

function readStored<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  if (typeof window === 'undefined') return fallback
  const saved = localStorage.getItem(key)
  return allowed.includes(saved as T) ? (saved as T) : fallback
}

function initialLang(): Lang {
  const fromUrl = new URLSearchParams(window.location.search).get('lang')
  if (fromUrl === 'es' || fromUrl === 'en') return fromUrl
  const stored = localStorage.getItem('portfolio-lang')
  if (stored === 'es' || stored === 'en') return stored
  return navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en'
}

function SectionTitle({ lines }: { lines: string[] }) {
  return (
    <h2>
      {lines[0]}
      <br />
      <em>{lines[1]}</em>
    </h2>
  )
}

function App() {
  const [filter, setFilter] = useState<FilterId>('todos')
  const [theme, setTheme] = useState<Theme>(() => readStored('portfolio-theme', ['dark', 'light'], 'dark'))
  const [lang, setLang] = useState<Lang>(initialLang)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [copied, setCopied] = useState(false)

  const t = content[lang]

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#08101d' : '#edf4f2')
    localStorage.setItem('portfolio-theme', theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = t.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description)
    localStorage.setItem('portfolio-lang', lang)
  }, [lang, t])

  // Resalta en la navegación la sección visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  // Animación de entrada al hacer scroll
  useEffect(() => {
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

    document.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => observer.observe(el))
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

  const cv = t.documents.items[0]
  const socialLinks = [
    { label: 'LinkedIn', href: LINKEDIN },
    { label: 'GitHub', href: GITHUB },
  ]

  return (
    <div className="app-shell">
      <a className="skip-link" href="#perfil">
        {lang === 'es' ? 'saltar al contenido' : 'skip to content'}
      </a>

      <header className="topbar">
        <a className="brand" href="#inicio" aria-label={t.ui.home}>
          <span className="brand-mark" aria-hidden="true">/</span>
          <span>DAVID</span>
        </a>

        <nav id="main-nav" className={`nav-links${menuOpen ? ' open' : ''}`} aria-label={t.ui.mainNav}>
          {sectionIds.map((id, index) => (
            <a
              key={id}
              href={`#${id}`}
              className={activeSection === id ? 'active' : ''}
              aria-current={activeSection === id ? 'true' : undefined}
              onClick={() => setMenuOpen(false)}
            >
              <span className="nav-index">0{index + 2}</span>
              {t.nav[id]}
            </a>
          ))}
        </nav>

        <div className="topbar-actions">
          <button
            type="button"
            className="lang-toggle"
            aria-label={t.ui.language}
            title={t.ui.language}
            onClick={() => setLang((current) => (current === 'es' ? 'en' : 'es'))}
          >
            {t.ui.languageShort}
          </button>
          <button
            type="button"
            className="theme-toggle"
            aria-label={t.ui.theme}
            aria-pressed={theme === 'light'}
            onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
          >
            <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
          </button>
          <a className="availability" href="#contacto" aria-label={t.ui.available}>
            <span className="pulse" aria-hidden="true" /> <span className="availability-text">{t.ui.available}</span>
          </a>
          <button
            type="button"
            className={`menu-toggle${menuOpen ? ' open' : ''}`}
            aria-label={menuOpen ? t.ui.closeMenu : t.ui.openMenu}
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
            <p className="eyebrow"><span>01</span> / {t.hero.eyebrow}</p>
            <h1>
              {t.hero.title[0]}
              <br />
              <em>{t.hero.title[1]}</em>
            </h1>
            <p className="hero-text">{t.hero.text}</p>

            <div className="hero-actions">
              <a className="button button-primary" href="#proyectos">
                {t.hero.projects} <span aria-hidden="true">↗</span>
              </a>
              <a className="button button-ghost" href={`${base}${cv.file}`} download={cv.file}>
                {t.hero.cv} <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>

          <div className="hero-console" role="img" aria-label={t.ui.systemStatus}>
            <div className="console-head" aria-hidden="true">
              <span>system_status.log</span>
              <span className="live"><i /> LIVE</span>
            </div>
            <div className="console-body" aria-hidden="true">
              {t.hero.console.map(([command, value]) => (
                <div key={command}>
                  <p><b className="cyan">$</b> {command}</p>
                  <p className="console-value">{value}</p>
                </div>
              ))}
              <p><b className="cyan">$</b> <span className="cursor" /></p>

              <div className="mini-chart">
                {Array.from({ length: 8 }, (_, i) => (
                  <span key={i} style={{ animationDelay: `${i * 120}ms` }} />
                ))}
              </div>
            </div>
          </div>

          <div className="scroll-note" aria-hidden="true"><span className="scroll-line" /> {t.ui.scroll}</div>
        </section>

        <section className="profile section-grid" id="perfil">
          <div className="section-label"><span>02</span><span>{t.profile.label}</span></div>

          <div className="profile-content reveal">
            <div>
              <p className="kicker">{t.profile.kicker}</p>
              <SectionTitle lines={t.profile.title} />
            </div>

            <div className="profile-copy">
              {t.profile.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <dl className="stats">
              {t.profile.stats.map((stat) => (
                <div key={stat.label}>
                  <dt>{stat.label}</dt>
                  <dd>{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="education section-grid" id="formacion">
          <div className="section-label"><span>03</span><span>{t.education.label}</span></div>

          <div className="education-content reveal">
            <p className="kicker">{t.education.kicker}</p>
            <SectionTitle lines={t.education.title} />

            <div className="education-list">
              {t.education.items.map((item) => (
                <div className="education-row" key={item.badge}>
                  <span>{item.period}</span>
                  <strong>{item.title}</strong>
                  <span className="education-badge">{item.badge}</span>
                </div>
              ))}
            </div>

            <div className="education-extra">
              <div className="info-panel">
                <h3><span>~/</span>{t.education.extraTitle}</h3>
                <ul>
                  {t.education.extra.map((course) => (
                    <li key={course}>{course}</li>
                  ))}
                </ul>
              </div>

              <div className="info-panel">
                <h3><span>~/</span>{t.education.languagesTitle}</h3>
                <ul className="language-list">
                  {t.education.languages.map((language) => (
                    <li key={language.name}>
                      <span>{language.name}</span>
                      <b>{language.level}</b>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="experience section-grid" id="experiencia">
          <div className="section-label"><span>04</span><span>{t.experience.label}</span></div>

          <div className="experience-content reveal">
            <p className="kicker">{t.experience.kicker}</p>
            <SectionTitle lines={t.experience.title} />

            <ol className="timeline">
              {t.experience.items.map((job) => (
                <li className="timeline-item" key={job.company}>
                  <div className="timeline-head">
                    <span className="timeline-period">{job.period}</span>
                    <h3>{job.role}</h3>
                    <span className="timeline-company">{job.company}</span>
                  </div>
                  <ul>
                    {job.tasks.map((task) => (
                      <li key={task}>{task}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="projects section-grid" id="proyectos">
          <div className="section-label"><span>05</span><span>{t.projectsSection.label}</span></div>

          <div className="projects-content reveal">
            <div className="section-heading">
              <div>
                <p className="kicker">{t.projectsSection.kicker}</p>
                <SectionTitle lines={t.projectsSection.title} />
              </div>

              <div className="filters" role="group" aria-label={t.ui.filter}>
                {filters.map((category) => (
                  <button
                    type="button"
                    aria-pressed={filter === category}
                    className={filter === category ? 'active' : ''}
                    onClick={() => setFilter(category)}
                    key={category}
                  >
                    {t.projectsSection.filters[category]}
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
                    <span className={`project-status ${project.live ? 'is-live' : 'is-wip'}`}>
                      <i aria-hidden="true" /> {project.live ? t.projectsSection.live : t.projectsSection.wip}
                    </span>
                  </div>

                  <h3>{project.title}</h3>
                  <p>{project.description[lang]}</p>

                  <div className="project-footer">
                    <div className="project-stack">
                      {project.stack.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                    {project.link && (
                      <a className="project-link" href={project.link} target="_blank" rel="noreferrer">
                        {t.ui.viewDocs} <span aria-hidden="true">↗</span>
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="stack section-grid" id="stack">
          <div className="section-label"><span>06</span><span>{t.stack.label}</span></div>

          <div className="stack-content reveal">
            <p className="kicker">{t.stack.kicker}</p>
            <SectionTitle lines={t.stack.title} />

            <div className="skill-groups">
              {t.stack.groups.map((group) => (
                <div className="skill-group" key={group.title}>
                  <h3 className="skill-group-title"><span>~/</span>{group.title}</h3>
                  <ul className="skill-cloud">
                    {group.items.map((skill, index) => (
                      <li className={index === 0 ? 'highlight' : ''} key={skill}>{skill}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="documents section-grid" id="documentos">
          <div className="section-label"><span>07</span><span>{t.documents.label}</span></div>

          <div className="documents-content reveal">
            <p className="kicker">{t.documents.kicker}</p>
            <SectionTitle lines={t.documents.title} />

            <div className="document-list">
              {t.documents.items.map((doc) => (
                <a key={doc.file} className="document-card" href={`${base}${doc.file}`} download={doc.file}>
                  <span className="document-icon" aria-hidden="true">PDF</span>
                  <span className="document-info">
                    <strong>{doc.title}</strong>
                    <span>{doc.description}</span>
                    <small>{doc.meta}</small>
                  </span>
                  <span className="document-action">{t.ui.download} <b aria-hidden="true">↓</b></span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="contact section-grid" id="contacto">
          <div className="section-label"><span>08</span><span>{t.contact.label}</span></div>

          <div className="contact-content reveal">
            <p className="kicker">{t.contact.kicker}</p>
            <SectionTitle lines={t.contact.title} />

            <div className="contact-links">
              {socialLinks.map((link) => (
                <a key={link.label} className="contact-link" href={link.href} target="_blank" rel="noreferrer">
                  {link.label} <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>

            <div className="contact-email-row">
              <a className="contact-email" href={`mailto:${EMAIL}`}>
                {EMAIL} <span aria-hidden="true">↗</span>
              </a>
              <button type="button" className="copy-button" onClick={copyEmail} aria-live="polite">
                {copied ? t.ui.copied : t.ui.copy}
              </button>
            </div>

            <p className="contact-location">{t.contact.location}</p>
          </div>
        </section>
      </main>

      <footer>
        <span>DAVID © {new Date().getFullYear()}</span>
        <span>{t.ui.footer}</span>
        <a href="#inicio" className="back-top">{t.ui.backTop}</a>
      </footer>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
