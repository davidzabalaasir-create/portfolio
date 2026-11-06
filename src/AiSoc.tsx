import { useEffect, useMemo, useRef, useState } from 'react'
import { aisocText, severityOrder, templates, type AlertTemplate, type Severity } from './aisoc-data'
import type { Lang } from './content'

type Status = 'nueva' | 'contenida'

type SocAlert = {
  uid: number
  tpl: AlertTemplate
  src: string
  dst: string
  time: Date
  ticket: number
  status: Status
  respondedAt?: Date
}

const MAX_ALERTS = 14
const STREAM_MS = 4500

let counter = 0
function createAlert(time = new Date(), tpl?: AlertTemplate): SocAlert {
  const template = tpl ?? templates[Math.floor(Math.random() * templates.length)]
  counter += 1
  return {
    uid: counter,
    tpl: template,
    src: template.src(),
    dst: template.dst(),
    time,
    ticket: 1040 + counter,
    status: 'nueva',
  }
}

function initialAlerts(): SocAlert[] {
  const now = Date.now()
  // Una alerta de cada tipo principal para que la demo empiece con contexto
  return ['ssh', 'scan', 'dns', 'policy', 'icmp']
    .map((id, i) => createAlert(new Date(now - (i + 1) * 47_000), templates.find((t) => t.id === id)))
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const formatTime = (date: Date, lang: Lang) =>
  date.toLocaleTimeString(lang === 'es' ? 'es-ES' : 'en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

const fill = (line: string, alert: SocAlert) => line.replace('{src}', alert.src).replace('{n}', String(alert.ticket))

export function AiSoc({ lang }: { lang: Lang }) {
  const t = aisocText[lang]
  const [alerts, setAlerts] = useState<SocAlert[]>(initialAlerts)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [paused, setPaused] = useState(false)
  const [filter, setFilter] = useState<Severity | 'all'>('all')
  const [revealed, setRevealed] = useState(5)
  // Solo se anima cuando el usuario elige una alerta (no en la carga inicial)
  const [animate, setAnimate] = useState(false)
  const [visible, setVisible] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const analystRef = useRef<HTMLDivElement>(null)

  // Solo genera alertas mientras la demo está en pantalla
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.1 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (paused || !visible) return
    const id = window.setInterval(() => {
      setAlerts((current) => [createAlert(), ...current].slice(0, MAX_ALERTS))
    }, STREAM_MS)
    return () => window.clearInterval(id)
  }, [paused, visible])

  // Selecciona la primera alerta crítica al empezar
  useEffect(() => {
    setSelectedId((current) => current ?? alerts.find((a) => a.tpl.severity === 'critica')?.uid ?? alerts[0]?.uid ?? null)
  }, [alerts])

  const selected = alerts.find((a) => a.uid === selectedId) ?? null

  // Revela el análisis por partes, como si la IA lo estuviera escribiendo
  useEffect(() => {
    if (!selected) return
    if (!animate || prefersReducedMotion()) {
      setRevealed(5)
      return
    }
    setRevealed(0)
    const id = window.setInterval(() => {
      setRevealed((step) => {
        if (step >= 5) {
          window.clearInterval(id)
          return step
        }
        return step + 1
      })
    }, 380)
    return () => window.clearInterval(id)
  }, [selectedId]) // eslint-disable-line react-hooks/exhaustive-deps

  const visibleAlerts = useMemo(
    () => (filter === 'all' ? alerts : alerts.filter((a) => a.tpl.severity === filter)),
    [alerts, filter],
  )

  const contained = alerts.filter((a) => a.status === 'contenida')
  const mttr = contained.length
    ? Math.round(contained.reduce((sum, a) => sum + (a.respondedAt!.getTime() - a.time.getTime()), 0) / contained.length / 1000)
    : null

  const select = (uid: number) => {
    setAnimate(true)
    setSelectedId(uid)
    // En móvil el analista está debajo de la cola: desplázate hasta él
    if (window.matchMedia('(max-width: 980px)').matches) {
      analystRef.current?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
    }
  }

  const respond = (uid: number) =>
    setAlerts((current) =>
      current.map((a) => (a.uid === uid ? { ...a, status: 'contenida', respondedAt: new Date() } : a)),
    )

  const analysis = selected?.tpl.analysis

  return (
    <div className="aisoc" ref={rootRef}>
      <div className="aisoc-kpis">
        <div><strong>{alerts.length}</strong><span>{t.kpis.total}</span></div>
        <div className="is-critical">
          <strong>{alerts.filter((a) => a.tpl.severity === 'critica').length}</strong>
          <span>{t.kpis.critical}</span>
        </div>
        <div><strong>{contained.length}</strong><span>{t.kpis.contained}</span></div>
        <div>
          <strong>{mttr === null ? '—' : mttr < 60 ? `${mttr}s` : `${Math.floor(mttr / 60)}m ${mttr % 60}s`}</strong>
          <span>{t.kpis.mttr}</span>
        </div>
      </div>

      <div className="aisoc-console">
        <div className="aisoc-queue">
          <div className="aisoc-panel-head">
            <span>
              <i className={paused ? 'dot is-paused' : 'dot'} aria-hidden="true" />
              {t.queue} · {paused ? t.paused : t.live}
            </span>
            <button type="button" className="aisoc-btn" onClick={() => setPaused((p) => !p)} aria-pressed={paused}>
              {paused ? t.resume : t.pause}
            </button>
          </div>

          <div className="aisoc-filters" role="group" aria-label={lang === 'es' ? 'Filtrar por severidad' : 'Filter by severity'}>
            {(['all', ...severityOrder] as const).map((sev) => (
              <button
                key={sev}
                type="button"
                className={`aisoc-chip sev-${sev}${filter === sev ? ' active' : ''}`}
                aria-pressed={filter === sev}
                onClick={() => setFilter(sev)}
              >
                {sev === 'all' ? t.all : t.severities[sev]}
              </button>
            ))}
          </div>

          <ul className="aisoc-list">
            {visibleAlerts.map((alert) => (
              <li key={alert.uid}>
                <button
                  type="button"
                  className={`aisoc-alert sev-${alert.tpl.severity}${alert.uid === selectedId ? ' selected' : ''}${alert.status === 'contenida' ? ' is-contained' : ''}`}
                  aria-pressed={alert.uid === selectedId}
                  onClick={() => select(alert.uid)}
                >
                  <span className="aisoc-alert-top">
                    <span className="aisoc-sev">{t.severities[alert.tpl.severity]}</span>
                    <span className="aisoc-time">{formatTime(alert.time, lang)}</span>
                  </span>
                  <span className="aisoc-sig">{alert.tpl.signature}</span>
                  <span className="aisoc-meta">
                    {alert.tpl.source} · {alert.src} → {alert.dst}
                    {alert.tpl.port ? `:${alert.tpl.port}` : ''}
                    {alert.status === 'contenida' && <b> · ✓ {t.contained}</b>}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="aisoc-analyst" aria-live="polite" ref={analystRef}>
          <div className="aisoc-panel-head">
            <span><span className="aisoc-spark" aria-hidden="true">✦</span> {t.analyst}</span>
            {selected && <span className="aisoc-ticket">SOC-{selected.ticket}</span>}
          </div>

          {!selected || !analysis ? (
            <p className="aisoc-empty">{t.pick}</p>
          ) : (
            <div className="aisoc-report" key={selected.uid}>
              <div className="aisoc-report-head">
                <div>
                  <p className="aisoc-label">{selected.tpl.source} · {formatTime(selected.time, lang)}</p>
                  <h3>{selected.tpl.signature}</h3>
                </div>
                <div className={`aisoc-score verdict-${analysis.verdict}`}>
                  <strong>{analysis.score}</strong>
                  <span>{t.risk}</span>
                </div>
              </div>

              {revealed === 0 && <p className="aisoc-thinking"><span /><span /><span /></p>}

              {revealed >= 1 && (
                <div className="aisoc-block">
                  <p className="aisoc-label">{t.summary}</p>
                  <p>{analysis.summary[lang]}</p>
                </div>
              )}

              {revealed >= 2 && (
                <div className="aisoc-tags">
                  <span className={`aisoc-verdict verdict-${analysis.verdict}`}>{t.verdicts[analysis.verdict]}</span>
                  <a
                    className="aisoc-mitre"
                    href={`https://attack.mitre.org/techniques/${analysis.mitre.id.replace('.', '/')}/`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    MITRE {analysis.mitre.id} · {analysis.mitre.name} <span aria-hidden="true">↗</span>
                  </a>
                  <span className="aisoc-tactic">{analysis.mitre.tactic[lang]}</span>
                </div>
              )}

              {revealed >= 3 && (
                <div className="aisoc-block">
                  <p className="aisoc-label">{t.evidence}</p>
                  <ul>{analysis.evidence[lang].map((e) => <li key={e}>{e}</li>)}</ul>
                </div>
              )}

              {revealed >= 4 && (
                <div className="aisoc-block">
                  <p className="aisoc-label">{t.actions}</p>
                  <ol>{analysis.actions[lang].map((a) => <li key={a}>{a}</li>)}</ol>
                </div>
              )}

              {revealed >= 5 && (
                <div className="aisoc-response">
                  {selected.status === 'contenida' ? (
                    <pre className="aisoc-log">
                      {analysis.playbook[lang].map((line) => `$ ${fill(line, selected)}`).join('\n')}
                      {`\n✓ ${t.responded}`}
                    </pre>
                  ) : (
                    <button type="button" className="aisoc-btn aisoc-btn-primary" onClick={() => respond(selected.uid)}>
                      ▶ {t.respond}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
