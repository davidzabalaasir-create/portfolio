import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

type Project = {
  title: string
  description: string
  category: string
  status: string
  stack: string[]
  number: string
}

const projects: Project[] = [
  { title: 'NEXUS MONITOR', description: 'Dashboard de observabilidad para vigilar servicios, latencias y capacidad en una red híbrida.', category: 'monitorización', status: 'operativo', stack: ['Grafana', 'Prometheus', 'Docker'], number: '01' },
  { title: 'LABORATORIO LAN', description: 'Arquitectura segmentada con VLANs, firewall perimetral y servicios internos aislados por roles.', category: 'redes', status: 'en evolución', stack: ['pfSense', 'Cisco', 'WireGuard'], number: '02' },
  { title: 'BACKUP ZERO', description: 'Estrategia 3-2-1 automatizada con snapshots, cifrado y restauraciones verificadas.', category: 'sistemas', status: 'operativo', stack: ['Bash', 'VirtualBox'], number: '03' },
  { title: 'SURICATA SHIELD', description: 'Sistema de detección y prevención de intrusiones para analizar tráfico y bloquear amenazas en la red.', category: 'redes', status: 'en evolución', stack: ['Suricata', 'Linux', 'pfSense'], number: '04' },
]

const skills = ['Linux', 'Windows Server', 'Docker', 'Virtualización', 'Redes TCP/IP', 'Bash', 'Python', 'SQL']

function App() {
  const [filter, setFilter] = useState('todos')
  const categories = ['todos', ...new Set(projects.map((project) => project.category))]
  const visibleProjects = filter === 'todos' ? projects : projects.filter((project) => project.category === filter)
  const cvUrl = `${import.meta.env.BASE_URL}cv.html`

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Inicio portfolio de David"><span className="brand-mark">/</span><span>DAVID</span></a>
        <nav className="nav-links" aria-label="Navegación principal">
          <a href="#perfil">perfil</a><a href="#formacion">formación</a><a href="#proyectos">proyectos</a><a href="#stack">stack</a><a href="#contacto">contacto</a>
        </nav>
        <a className="availability" href="#contacto"><span className="pulse" /> disponible</a>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-copy"><p className="eyebrow"><span>01</span> / administración de sistemas informáticos</p><h1>Diseño sistemas<br /><em>que resisten.</em></h1><p className="hero-text">Portfolio técnico de <strong>David</strong>. Infraestructura, redes y automatización pensadas para mantenerse estables cuando todo lo demás falla.</p><div className="hero-actions"><a className="button button-primary" href="#proyectos">explorar proyectos <span>↗</span></a><a className="text-link" href="#contacto">hablar conmigo <span>→</span></a></div></div>
          <div className="hero-console" aria-label="Estado del sistema"><div className="console-head"><span>system_status.log</span><span className="live"><i /> LIVE</span></div><div className="console-body"><p><span className="muted">$</span> whoami</p><p className="console-accent">david@estudiante</p><p><span className="muted">$</span> ls -la</p><p><a className="console-link" href={cvUrl}>cv.pdf</a> <span className="muted">· portfolio</span></p><div className="metric"><span>network</span><b><i style={{ width: '92%' }} /></b><strong>92%</strong></div><div className="metric"><span>reliability</span><b><i style={{ width: '99%' }} /></b><strong>99%</strong></div><div className="metric"><span>curiosity</span><b><i style={{ width: '87%' }} /></b><strong>87%</strong></div><p className="console-cursor"><span className="muted">$</span> <span className="cursor" /></p></div></div>
          <div className="scroll-note"><span className="scroll-line" /> desplázate para explorar</div>
        </section>

        <section className="profile section-grid" id="perfil"><div className="section-label"><span>02</span><span>perfil</span></div><div className="profile-content"><div><p className="kicker">/ sobre mí</p><h2>La infraestructura<br /><em>también cuenta historias.</em></h2></div><div className="profile-description"><p>Me muevo entre la consola y el mapa de red. Me interesa entender cómo funcionan las cosas, documentarlas bien y automatizar lo que no merece repetirse.</p><p>Actualmente formándome en <strong>ASIR</strong>, construyo laboratorios para convertir teoría en sistemas medibles, seguros y fáciles de mantener.</p></div><div className="facts"><div><strong>02</strong><span>años aprendiendo</span></div><div><strong>12+</strong><span>entornos desplegados</span></div><div><strong>∞</strong><span>cosas por optimizar</span></div></div><div className="education" id="formacion"><p className="kicker">/ formación</p><div className="education-row"><span>2025 — ahora</span><strong>Administración de Sistemas Informáticos en Red</strong><span>ASIR</span></div></div></div></section>

        <section className="projects section-grid" id="proyectos"><div className="section-label"><span>03</span><span>proyectos</span></div><div className="projects-content"><div className="section-heading"><div><p className="kicker">/ trabajo seleccionado</p><h2>Sistemas en <em>producción.</em></h2></div><span className="project-count">{String(visibleProjects.length).padStart(2, '0')} / 04</span></div><div className="filters" role="group" aria-label="Filtrar proyectos">{categories.map((category) => <button className={filter === category ? 'active' : ''} key={category} onClick={() => setFilter(category)}>{category}</button>)}</div><div className="project-list">{visibleProjects.map((project) => <article className="project-row" key={project.title}><span className="project-number">{project.number}</span><div className="project-main"><h3>{project.title}</h3><p>{project.description}</p><div className="tags">{project.stack.map((item) => <span key={item}>{item}</span>)}</div></div><span className="project-status"><i /> {project.status}</span></article>)}</div></div></section>

        <section className="stack section-grid" id="stack"><div className="section-label"><span>04</span><span>stack técnico</span></div><div className="stack-content"><p className="kicker">/ herramientas del oficio</p><h2>Aprender. <em>Probar.</em><br />Documentar.</h2><div className="skill-cloud">{skills.map((skill) => <span key={skill}>{skill}</span>)}</div></div></section>
        <section className="contact section-grid" id="contacto"><div className="section-label"><span>05</span><span>contacto</span></div><div className="contact-content"><p className="kicker">/ abrir conexión</p><h2>¿Tienes un sistema<br />que <em>mejorar?</em></h2><a className="contact-email" href="mailto:davidzamaira2003@gmail.com">davidzamaira2003@gmail.com <span>↗</span></a></div></section>
      </main>
      <footer><span>DAVID © 2026</span><span>construido con curiosidad + café</span><span>status: <b>online</b></span></footer>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
