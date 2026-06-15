'use client'

import { motion, useReducedMotion } from 'motion/react'
import { FileText, GitBranch, Compass } from 'lucide-react'
import ItalicAccent from '@/components/ui/ItalicAccent'
import AccentGlow from '@/components/ui/AccentGlow'

const EASE = [0.16, 1, 0.3, 1] as const

type Artifact = {
  Icon: typeof FileText
  file: string
  type: string
  title: string
  /** Strukturierter Mock-Inhalt: Label + Wert pro Zeile. */
  lines: { k: string; v: string }[]
}

const ARTIFACTS: Artifact[] = [
  {
    Icon: FileText,
    file: 'runbook_tenant-cutover.md',
    type: 'Run-Book',
    title: 'Run-Book-Auszug',
    lines: [
      { k: 'Schritt 03', v: 'DNS-MX auf neuen Tenant umstellen' },
      { k: 'Verantwortlich', v: 'IT-Betrieb (Vier-Augen mit Lotse)' },
      { k: 'Vorbedingung', v: 'Backup verifiziert, Wartungsfenster freigegeben' },
      { k: 'Prüfung', v: 'Testmail intern + extern zugestellt' },
      { k: 'Rollback', v: 'MX-Record auf alten Wert, TTL 300s' },
    ],
  },
  {
    Icon: GitBranch,
    file: 'adr_0007-identity-provider.md',
    type: 'ADR',
    title: 'Architecture Decision Record',
    lines: [
      { k: 'Status', v: 'Angenommen' },
      { k: 'Kontext', v: 'Zwei IdP parallel, doppelte Pflege, Drift-Risiko' },
      { k: 'Entscheidung', v: 'Entra ID als führend, Legacy nur lesend' },
      { k: 'Konsequenz', v: 'Ein Pflegeort, Migration in zwei Wellen' },
      { k: 'Alternativen', v: 'Beibehalten verworfen — Kosten zu hoch' },
    ],
  },
  {
    Icon: Compass,
    file: 'lagebild_briefing.pdf',
    type: 'Lagebild',
    title: 'Lagebild-Briefing-Sample',
    lines: [
      { k: 'Reibungspunkt', v: 'Manuelle Freigaben blockieren Durchlauf' },
      { k: 'Reibungspunkt', v: 'Kein zentrales Monitoring der Kernsysteme' },
      { k: 'Roadmap A', v: 'Freigabe-Workflow automatisieren (Quartal 1)' },
      { k: 'Roadmap B', v: 'Monitoring-Baseline aufsetzen (Quartal 2)' },
      { k: 'Nächster Schritt', v: 'Festpreis-Angebot Phase „Kurs setzen“' },
    ],
  },
]

/**
 * „Wie ein Ergebnis aussieht" — drei dezente Mock-Dokument-Karten, die
 * konkretisieren, was am Ende einer Phase tatsächlich auf dem Tisch liegt.
 * Inhalte sind anonymisierte Muster, klar als solche gekennzeichnet.
 */
export default function MethodikArtifacts() {
  const reduce = useReducedMotion()

  return (
    <section
      aria-label="Beispiel-Artefakte"
      className="relative w-screen overflow-hidden"
      style={{
        marginLeft: 'calc(-50vw + 50%)',
        background: 'var(--bg-base)',
        padding: 'clamp(80px, 10vw, 140px) 0',
        borderTop: '1px solid var(--border-subtle)',
      }}
    >
      <AccentGlow position="top-right" intensity="low" />

      <div className="relative z-[3] mx-auto w-full max-w-[1100px] px-6 md:px-12">
        <motion.p
          className="font-mono uppercase"
          style={{
            fontSize: '11px',
            letterSpacing: '0.20em',
            color: 'var(--brand)',
            marginBottom: '24px',
          }}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 0.5 }}
        >
          Greifbar gemacht
        </motion.p>

        <motion.h2
          className="font-display font-bold"
          style={{
            fontSize: 'clamp(32px, 4vw, 56px)',
            lineHeight: 1.05,
            letterSpacing: 'var(--tr-display)',
            color: 'var(--fg-default)',
            maxWidth: '760px',
          }}
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          Wie ein <ItalicAccent>Ergebnis</ItalicAccent> aussieht.
        </motion.h2>

        <motion.p
          className="mt-6 font-body"
          style={{
            fontSize: '18px',
            lineHeight: 1.7,
            color: 'var(--fg-default)',
            opacity: 0.85,
            maxWidth: '680px',
          }}
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
        >
          Am Ende steht kein Foliensatz, sondern Doku, die dein Team weiterführt.
          Drei typische Artefakte aus einem Engagement — anonymisierte Muster, kein
          echter Mandant.
        </motion.p>

        <div
          className="mt-12 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-3"
        >
          {ARTIFACTS.map((a, i) => {
            const Icon = a.Icon
            return (
              <motion.article
                key={a.file}
                className="glass-card flex flex-col"
                style={{ padding: '0', overflow: 'hidden' }}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-8%' }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
              >
                {/* Dokument-Header: Dateiname + Typ-Badge, mono */}
                <div
                  className="flex items-center justify-between gap-3"
                  style={{
                    padding: '14px 18px',
                    borderBottom: '1px solid var(--border-subtle)',
                    background: 'rgba(255, 255, 255, 0.03)',
                  }}
                >
                  <span
                    className="flex items-center gap-2 font-mono"
                    style={{
                      fontSize: '11px',
                      color: 'var(--fg-subtle)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Icon size={13} strokeWidth={1.5} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                    {a.file}
                  </span>
                  <span
                    className="font-mono uppercase"
                    style={{
                      fontSize: '9px',
                      letterSpacing: '0.16em',
                      color: 'var(--brand)',
                      border: '1px solid color-mix(in srgb, var(--brand) 40%, transparent)',
                      borderRadius: 'var(--r-sm)',
                      padding: '3px 7px',
                      flexShrink: 0,
                    }}
                  >
                    {a.type}
                  </span>
                </div>

                {/* Dokument-Body: Mock-Zeilen */}
                <div style={{ padding: '18px', flex: 1 }}>
                  <p
                    className="font-display font-semibold"
                    style={{
                      fontSize: '16px',
                      lineHeight: 1.3,
                      color: 'var(--fg-default)',
                      marginBottom: '16px',
                    }}
                  >
                    {a.title}
                  </p>
                  <dl style={{ margin: 0 }}>
                    {a.lines.map((line, li) => (
                      <div
                        key={li}
                        className="flex flex-col gap-0.5"
                        style={{
                          paddingTop: li === 0 ? 0 : '10px',
                          marginTop: li === 0 ? 0 : '10px',
                          borderTop: li === 0 ? 'none' : '1px solid var(--border-subtle)',
                        }}
                      >
                        <dt
                          className="font-mono uppercase"
                          style={{
                            fontSize: '9px',
                            letterSpacing: '0.14em',
                            color: 'var(--fg-subtle)',
                          }}
                        >
                          {line.k}
                        </dt>
                        <dd
                          className="font-body"
                          style={{
                            margin: 0,
                            fontSize: '13px',
                            lineHeight: 1.45,
                            color: 'var(--fg-default)',
                            opacity: 0.82,
                          }}
                        >
                          {line.v}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </motion.article>
            )
          })}
        </div>

        <p
          className="mt-8 font-mono uppercase"
          style={{
            fontSize: '10px',
            letterSpacing: '0.16em',
            color: 'var(--fg-subtle)',
            opacity: 0.7,
          }}
        >
          Muster · anonymisiert · keine echten Mandantendaten
        </p>
      </div>
    </section>
  )
}
