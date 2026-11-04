'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useInView } from 'motion/react'
import Link from 'next/link'
import {
  ArrowLeft, Brain, Sparkles, Workflow, Mail,
  Bot, Zap, FileSpreadsheet, MessageSquare, Check,
} from 'lucide-react'
import type { Service } from '@/lib/cms'

const EASE = [0.16, 1, 0.3, 1] as const

/**
 * Cinematic AI-Hero — Prompt-Konsole + floating Use-Case-Artefakte.
 * Ersetzt den Laptop aus MarkeHero. Zentrum ist ein „Copilot"-Chat, in dem
 * eine Frage live mit Typewriter-Effekt beantwortet wird; rundherum
 * schweben Use-Case-Tiles (Power Automate Flow, Copilot-Card, n8n-Node,
 * Email-Draft, Excel-Formel-Card, Ticket-Inbox).
 */
export default function AiHero({ s }: { s: Service }) {
  return (
    <section
      aria-label={`Leistung ${s.title}`}
      className="relative w-screen overflow-hidden"
      style={{
        marginLeft: 'calc(-50vw + 50%)',
        background: 'var(--bg-base)',
        paddingTop: '120px',
        paddingBottom: 'clamp(48px, 6vw, 72px)',
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(55% 70% at 78% 28%, rgba(224, 168, 80, 0.18) 0%, transparent 60%),' +
            'radial-gradient(45% 55% at 18% 82%, rgba(200, 98, 42, 0.10) 0%, transparent 60%)',
          zIndex: 1,
        }}
      />

      <div className="relative z-[3] mx-auto w-full max-w-[var(--container-wide)] px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <Link
            href="/leistungen"
            data-cursor="link"
            className="inline-flex items-center gap-2 font-mono uppercase transition-colors duration-220 hover:text-[color:var(--brand)]"
            style={{
              fontSize: '11px',
              letterSpacing: '0.18em',
              color: 'var(--fg-muted)',
            }}
          >
            <ArrowLeft size={11} strokeWidth={1.6} />
            Alle Leistungen
          </Link>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
          {/* ── LEFT · Text ── */}
          <div>
            <motion.div
              className="flex flex-wrap items-baseline gap-x-6 gap-y-2"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            >
              <span
                className="inline-flex items-center gap-2 font-mono uppercase"
                style={{
                  fontSize: '12px',
                  letterSpacing: '0.20em',
                  color: 'var(--brand)',
                  padding: '6px 14px',
                  border: '1px solid rgba(220, 128, 68, 0.30)',
                  borderRadius: 'var(--r-pill)',
                }}
              >
                <Brain size={13} strokeWidth={1.5} />
                Leistung {s.num}
              </span>
              <span
                className="font-mono"
                style={{
                  fontSize: '11px',
                  color: 'var(--fg-muted)',
                  letterSpacing: '0.04em',
                }}
              >
                {s.duration}
              </span>
            </motion.div>

            <motion.h1
              className="mt-8 font-display font-bold"
              style={{
                fontSize: 'clamp(36px, 4.6vw, 68px)',
                lineHeight: 1.05,
                letterSpacing: 'var(--tr-display)',
                color: 'var(--fg-default)',
                whiteSpace: 'nowrap',
              }}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
            >
              KI &amp;{' '}
              <span
                style={{
                  fontFamily: 'var(--font-accent)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  color: 'var(--brand)',
                }}
              >
                Automatisierung
              </span>
            </motion.h1>

            <motion.p
              className="mt-6 font-body"
              style={{
                fontSize: 'clamp(16px, 1.5vw, 19px)',
                lineHeight: 1.55,
                color: 'var(--fg-muted)',
                maxWidth: '560px',
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              {s.lead}
            </motion.p>

            <motion.div
              className="mt-10 flex flex-wrap items-end gap-x-10 gap-y-6"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65, ease: EASE }}
            >
              <div>
                <p
                  className="font-mono uppercase"
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.20em',
                    color: 'var(--fg-muted)',
                    marginBottom: '10px',
                  }}
                >
                  Was rauskommt
                </p>
                <p
                  className="font-display font-black"
                  style={{
                    fontSize: 'clamp(42px, 5.4vw, 84px)',
                    lineHeight: 0.95,
                    letterSpacing: 'var(--tr-display)',
                    color: 'var(--accent)',
                  }}
                >
                  bis zu 90 %
                </p>
                <p
                  className="mt-2 font-mono uppercase"
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.16em',
                    color: 'var(--fg-default)',
                    opacity: 0.85,
                  }}
                >
                  Zeit weg · bei statischen Prozessen
                </p>
              </div>

              <dl className="flex flex-wrap gap-x-10 gap-y-5">
                <div>
                  <dt
                    className="font-mono uppercase"
                    style={{ fontSize: '9px', letterSpacing: '0.18em', color: 'var(--fg-subtle)' }}
                  >
                    Erster Pilot
                  </dt>
                  <dd
                    className="mt-2 font-display font-medium"
                    style={{ fontSize: '15px', color: 'var(--fg-default)' }}
                  >
                    in 90 Tagen live
                  </dd>
                </div>
                <div>
                  <dt
                    className="font-mono uppercase"
                    style={{ fontSize: '9px', letterSpacing: '0.18em', color: 'var(--fg-subtle)' }}
                  >
                    Datenraum
                  </dt>
                  <dd
                    className="mt-2 font-display font-medium"
                    style={{ fontSize: '15px', color: 'var(--fg-default)' }}
                  >
                    EU-only möglich
                  </dd>
                </div>
                <div>
                  <dt
                    className="font-mono uppercase"
                    style={{ fontSize: '9px', letterSpacing: '0.18em', color: 'var(--fg-subtle)' }}
                  >
                    Lock-in
                  </dt>
                  <dd
                    className="mt-2 font-display font-medium"
                    style={{ fontSize: '15px', color: 'var(--fg-default)' }}
                  >
                    keiner
                  </dd>
                </div>
              </dl>
            </motion.div>
          </div>

          {/* ── RIGHT · Prompt-Stage + Artefakte ── */}
          <PromptStage />
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────── */

function PromptStage() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      className="relative mx-auto mt-14 w-full lg:mt-0"
      style={{ maxWidth: '720px', height: 'clamp(440px, 56vw, 600px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {/* Soft glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(50% 38% at 50% 60%, rgba(224, 168, 80, 0.24) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />

      <PromptConsole inView={inView} reduceMotion={!!reduceMotion} />

      {/* Floating Use-Case Artefakte */}
      <FloatArtefact
        delay={1.4}
        floatDelay={0}
        reduceMotion={!!reduceMotion}
        style={{ top: '-2%', left: '-6%', zIndex: 7 }}
      >
        <CopilotCard />
      </FloatArtefact>

      <FloatArtefact
        delay={1.55}
        floatDelay={0.6}
        reduceMotion={!!reduceMotion}
        style={{ top: '0%', right: '-4%', zIndex: 7 }}
      >
        <FlowNodeCard />
      </FloatArtefact>

      <FloatArtefact
        delay={1.8}
        floatDelay={1.2}
        reduceMotion={!!reduceMotion}
        style={{ bottom: '4%', left: '-10%', zIndex: 7 }}
      >
        <ExcelFormulaCard />
      </FloatArtefact>

      <FloatArtefact
        delay={2.0}
        floatDelay={0.3}
        reduceMotion={!!reduceMotion}
        style={{ bottom: '-2%', right: '-6%', zIndex: 7 }}
      >
        <TicketInboxCard />
      </FloatArtefact>

      <FloatArtefact
        delay={2.2}
        floatDelay={0.9}
        reduceMotion={!!reduceMotion}
        style={{ top: '42%', right: '-14%', zIndex: 6 }}
      >
        <AgentBadge />
      </FloatArtefact>
    </motion.div>
  )
}

/* ── Prompt-Konsole im Zentrum (Glass-Card mit Typewriter-Antwort) ── */

const PROMPT_TEXT = 'Klassifiziere die letzten 20 Anfragen aus Outlook nach Priorität, fasse jede in einer Zeile zusammen und leg sie als Excel-Tabelle ab.'
const RESPONSE_LINES = [
  '✓ 20 Mails gelesen · 14 Hoch · 4 Mittel · 2 Niedrig',
  '✓ Zusammenfassung erzeugt · 1 Zeile / Mail',
  '✓ Excel-Datei ablegen in SharePoint /Tickets/2026-Q2/',
  '↳ Power Automate-Flow → triggert künftig automatisch um 08:00.',
]

function PromptConsole({ inView, reduceMotion }: { inView: boolean; reduceMotion: boolean }) {
  const [typed, setTyped] = useState(reduceMotion ? PROMPT_TEXT.length : 0)
  const [revealed, setRevealed] = useState(reduceMotion ? RESPONSE_LINES.length : 0)

  useEffect(() => {
    if (reduceMotion || !inView) return

    let mounted = true
    let typeTimer: ReturnType<typeof setTimeout>
    let revealTimer: ReturnType<typeof setTimeout>

    const startTyping = () => {
      let i = 0
      const tick = () => {
        if (!mounted) return
        i += 1
        setTyped(i)
        if (i < PROMPT_TEXT.length) {
          typeTimer = setTimeout(tick, 22)
        } else {
          revealTimer = setTimeout(() => {
            let j = 0
            const reveal = () => {
              if (!mounted) return
              j += 1
              setRevealed(j)
              if (j < RESPONSE_LINES.length) {
                revealTimer = setTimeout(reveal, 480)
              }
            }
            reveal()
          }, 380)
        }
      }
      typeTimer = setTimeout(tick, 950)
    }

    startTyping()
    return () => {
      mounted = false
      clearTimeout(typeTimer)
      clearTimeout(revealTimer)
    }
  }, [inView, reduceMotion])

  return (
    <motion.div
      className="absolute inset-x-0 mx-auto"
      style={{
        top: '14%',
        width: '78%',
        maxWidth: 480,
        background:
          'linear-gradient(145deg, rgba(28, 27, 24, 0.92) 0%, rgba(15, 14, 12, 0.96) 100%)',
        border: '1px solid rgba(245, 245, 250, 0.14)',
        borderRadius: '14px',
        padding: '18px 20px 22px',
        boxShadow:
          'inset 0 1px 0 rgba(255, 255, 255, 0.10), 0 30px 70px rgba(0, 0, 0, 0.55), 0 0 60px rgba(224, 168, 80, 0.10)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      }}
      initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : undefined}
      transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
    >
      {/* Header-Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center justify-center"
            style={{
              width: 22,
              height: 22,
              borderRadius: '6px',
              background:
                'linear-gradient(135deg, rgba(220, 128, 68, 0.30) 0%, rgba(146, 48, 30, 0.50) 100%)',
              border: '1px solid rgba(220, 128, 68, 0.40)',
            }}
          >
            <Sparkles size={11} strokeWidth={1.6} style={{ color: 'var(--brand)' }} />
          </span>
          <span
            className="font-mono uppercase"
            style={{
              fontSize: '9px',
              letterSpacing: '0.20em',
              color: 'var(--fg-muted)',
            }}
          >
            Copilot · GPT-4o
          </span>
        </div>
        <span
          className="font-mono inline-flex items-center gap-1.5"
          style={{
            fontSize: '8px',
            letterSpacing: '0.16em',
            color: '#28C840',
            textTransform: 'uppercase',
          }}
        >
          <span
            aria-hidden
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#28C840',
              boxShadow: '0 0 6px #28C840',
            }}
          />
          EU-West
        </span>
      </div>

      {/* User-Bubble */}
      <div className="mt-5 flex items-start gap-3">
        <span
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center font-display font-bold"
          style={{
            background: 'rgba(245, 245, 250, 0.10)',
            border: '1px solid rgba(245, 245, 250, 0.16)',
            borderRadius: '6px',
            fontSize: '11px',
            color: 'var(--fg-default)',
          }}
        >
          SB
        </span>
        <div className="flex-1 min-w-0">
          <p
            className="font-mono uppercase"
            style={{
              fontSize: '8px',
              letterSpacing: '0.16em',
              color: 'var(--fg-subtle)',
              marginBottom: '4px',
            }}
          >
            Du · 09:42
          </p>
          <p
            className="font-body"
            style={{
              fontSize: '13px',
              lineHeight: 1.5,
              color: 'var(--fg-default)',
              minHeight: '40px',
            }}
          >
            {PROMPT_TEXT.slice(0, typed)}
            {!reduceMotion && typed < PROMPT_TEXT.length && (
              <span
                aria-hidden
                style={{
                  display: 'inline-block',
                  width: '2px',
                  height: '0.95em',
                  background: 'var(--brand)',
                  marginLeft: '2px',
                  verticalAlign: 'text-bottom',
                  animation: 'aiCaretBlink 0.8s steps(2) infinite',
                }}
              />
            )}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div
        aria-hidden
        className="my-4"
        style={{
          height: 1,
          background:
            'linear-gradient(90deg, transparent 0%, rgba(245, 245, 250, 0.12) 50%, transparent 100%)',
        }}
      />

      {/* Assistant-Bubble */}
      <div className="flex items-start gap-3">
        <span
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center"
          style={{
            background:
              'linear-gradient(135deg, var(--brand) 0%, #92301E 100%)',
            border: '1px solid rgba(220, 128, 68, 0.40)',
            borderRadius: '6px',
            color: 'white',
            boxShadow: '0 0 16px rgba(220, 128, 68, 0.35)',
          }}
        >
          <Brain size={12} strokeWidth={1.8} />
        </span>
        <div className="flex-1 min-w-0">
          <p
            className="font-mono uppercase"
            style={{
              fontSize: '8px',
              letterSpacing: '0.16em',
              color: 'var(--brand)',
              marginBottom: '6px',
            }}
          >
            Copilot · denkt 1,2 s
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {RESPONSE_LINES.map((line, i) => (
              <li
                key={i}
                className="font-mono"
                style={{
                  fontSize: '11px',
                  lineHeight: 1.55,
                  color: line.startsWith('↳') ? 'var(--brand)' : 'var(--fg-default)',
                  opacity: i < revealed ? 1 : 0,
                  transform: i < revealed ? 'translateY(0)' : 'translateY(4px)',
                  transition: 'opacity 280ms ease, transform 280ms ease',
                  marginTop: i === 0 ? 0 : 6,
                  letterSpacing: '0.01em',
                }}
              >
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style jsx>{`
        @keyframes aiCaretBlink {
          0%, 50% { opacity: 1; }
          50.01%, 100% { opacity: 0; }
        }
      `}</style>
    </motion.div>
  )
}

/* ── Floating Wrapper ──────────────────────────────────────────── */

function FloatArtefact({
  children,
  style,
  delay,
  floatDelay,
  reduceMotion,
}: {
  children: React.ReactNode
  style: React.CSSProperties
  delay: number
  floatDelay: number
  reduceMotion: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduceMotion) return
    const el = ref.current
    if (!el) return
    let raf = 0
    const start = performance.now() + floatDelay * 1000
    const tick = (now: number) => {
      const t = (now - start) / 1000
      const y = Math.sin(t * 0.85) * 6
      const r = Math.sin(t * 0.6) * 1.2
      el.style.transform = `translateY(${y}px) rotate(${r}deg)`
      raf = requestAnimationFrame(tick)
    }
    // Loop nur laufen lassen, solange das Artefakt sichtbar ist — spart CPU beim Wegscrollen.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          if (!raf) raf = requestAnimationFrame(tick)
        } else if (raf) {
          cancelAnimationFrame(raf)
          raf = 0
        }
      },
      { threshold: 0 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [reduceMotion, floatDelay])

  return (
    <motion.div
      className="absolute"
      style={style}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.6, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      <div ref={ref}>{children}</div>
    </motion.div>
  )
}

/* ── Artefakte ─────────────────────────────────────────────────── */

function CopilotCard() {
  return (
    <div
      style={{
        width: 168,
        padding: '12px 14px',
        background:
          'linear-gradient(145deg, rgba(245, 245, 248, 0.14) 0%, rgba(40, 120, 220, 0.10) 100%)',
        border: '1px solid rgba(245, 245, 250, 0.20)',
        borderRadius: '12px',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)',
      }}
    >
      <div className="flex items-center gap-2">
        <span
          className="inline-flex h-7 w-7 items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #2074d4 0%, #0a4790 100%)',
            borderRadius: '6px',
            color: 'white',
          }}
        >
          <MessageSquare size={12} strokeWidth={1.8} />
        </span>
        <div>
          <p
            className="font-display font-semibold"
            style={{ fontSize: 11, color: 'var(--fg-default)', lineHeight: 1.1 }}
          >
            Microsoft Copilot
          </p>
          <p
            className="font-mono uppercase"
            style={{ fontSize: 7, letterSpacing: '0.16em', color: 'var(--fg-subtle)' }}
          >
            Outlook · Aktiv
          </p>
        </div>
      </div>
      <p
        className="mt-2 font-body"
        style={{ fontSize: 10, lineHeight: 1.5, color: 'var(--fg-muted)' }}
      >
        Zieht Antwort aus M365-Daten · DSGVO-Region EU
      </p>
      <div className="mt-2 flex items-center gap-1.5">
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 7,
            letterSpacing: '0.14em',
            color: '#28C840',
            background: 'rgba(40, 200, 64, 0.12)',
            border: '1px solid rgba(40, 200, 64, 0.30)',
            borderRadius: '999px',
            padding: '2px 6px',
          }}
        >
          live
        </span>
        <span
          className="font-mono"
          style={{ fontSize: 8, color: 'var(--fg-subtle)' }}
        >
          120 User
        </span>
      </div>
    </div>
  )
}

function FlowNodeCard() {
  return (
    <div
      style={{
        width: 178,
        padding: '12px 14px',
        background: 'rgba(15, 14, 12, 0.92)',
        border: '1px solid rgba(245, 245, 250, 0.18)',
        borderRadius: '12px',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)',
      }}
    >
      <p
        className="font-mono uppercase"
        style={{
          fontSize: 7,
          letterSpacing: '0.18em',
          color: 'var(--fg-subtle)',
          marginBottom: 8,
        }}
      >
        n8n · Workflow
      </p>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {[
          { Icon: Mail, label: 'Outlook · Trigger' },
          { Icon: Brain, label: 'GPT-4o · Klassifiziere' },
          { Icon: FileSpreadsheet, label: 'Excel · Append-Row' },
        ].map((n, i, arr) => (
          <li key={n.label} className="relative">
            <div
              className="flex items-center gap-2 py-1.5"
              style={{
                padding: '6px 8px',
                background: i === 1 ? 'rgba(220, 128, 68, 0.12)' : 'rgba(245, 245, 250, 0.04)',
                border: `1px solid ${i === 1 ? 'rgba(220, 128, 68, 0.35)' : 'rgba(245, 245, 250, 0.10)'}`,
                borderRadius: 6,
              }}
            >
              <n.Icon size={11} strokeWidth={1.6} style={{ color: i === 1 ? 'var(--brand)' : 'var(--fg-muted)' }} />
              <span
                className="font-mono"
                style={{ fontSize: 9, color: 'var(--fg-default)' }}
              >
                {n.label}
              </span>
            </div>
            {i < arr.length - 1 && (
              <span
                aria-hidden
                className="mx-auto block"
                style={{
                  width: 1,
                  height: 8,
                  background: 'rgba(220, 128, 68, 0.40)',
                  marginLeft: '15px',
                }}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

function ExcelFormulaCard() {
  return (
    <div
      style={{
        width: 200,
        padding: '12px 14px',
        background: 'rgba(28, 27, 24, 0.94)',
        border: '1px solid rgba(40, 200, 64, 0.22)',
        borderRadius: '12px',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)',
      }}
    >
      <div className="flex items-center justify-between">
        <p
          className="font-mono uppercase"
          style={{
            fontSize: 7,
            letterSpacing: '0.18em',
            color: 'var(--fg-subtle)',
          }}
        >
          Excel · Copilot-Formula
        </p>
        <FileSpreadsheet size={11} strokeWidth={1.6} style={{ color: '#28C840' }} />
      </div>
      <div
        className="mt-3"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          background: '#0F0E0C',
          border: '1px solid rgba(245, 245, 250, 0.08)',
          borderRadius: 4,
          padding: '6px 8px',
          color: '#E0A850',
          lineHeight: 1.5,
        }}
      >
        =COPILOT(<span style={{ color: '#92C8FF' }}>&quot;Fasse&quot;</span>, A2:A50)
      </div>
      <p
        className="mt-2 font-mono"
        style={{ fontSize: 9, color: 'var(--fg-muted)', lineHeight: 1.4 }}
      >
        49 Zeilen · 6 s · −82 % Zeit
      </p>
    </div>
  )
}

function TicketInboxCard() {
  return (
    <div
      style={{
        width: 192,
        padding: 12,
        background: 'rgba(15, 14, 12, 0.92)',
        border: '1px solid rgba(245, 245, 250, 0.18)',
        borderRadius: '12px',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        boxShadow: '0 18px 44px rgba(0, 0, 0, 0.5)',
      }}
    >
      <div className="flex items-center justify-between">
        <p
          className="font-mono uppercase"
          style={{
            fontSize: 7,
            letterSpacing: '0.18em',
            color: 'var(--fg-subtle)',
          }}
        >
          Ticket-Klassifizierung
        </p>
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 6,
            letterSpacing: '0.14em',
            color: 'var(--brand)',
          }}
        >
          live
        </span>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, marginTop: 8 }}>
        {[
          { label: 'Rechnung Storno', tag: 'Finanz', tone: 'finanz' as const },
          { label: 'VPN Fehler', tag: 'IT · P1', tone: 'p1' as const },
          { label: 'Onboarding', tag: 'HR', tone: 'hr' as const },
        ].map(t => (
          <li
            key={t.label}
            className="flex items-center justify-between border-b py-1.5 last:border-b-0"
            style={{ borderColor: 'rgba(245, 245, 250, 0.06)' }}
          >
            <span className="flex items-center gap-1.5">
              <Check size={9} strokeWidth={2.2} style={{ color: '#28C840' }} />
              <span
                className="font-body"
                style={{ fontSize: 9, color: 'var(--fg-default)' }}
              >
                {t.label}
              </span>
            </span>
            <span
              className="font-mono uppercase"
              style={{
                fontSize: 7,
                letterSpacing: '0.14em',
                padding: '2px 6px',
                borderRadius: '999px',
                color:
                  t.tone === 'p1'
                    ? '#FF6B5C'
                    : t.tone === 'finanz'
                    ? '#E0A850'
                    : '#7FB8E8',
                background:
                  t.tone === 'p1'
                    ? 'rgba(255, 107, 92, 0.10)'
                    : t.tone === 'finanz'
                    ? 'rgba(224, 168, 80, 0.10)'
                    : 'rgba(127, 184, 232, 0.10)',
                border: `1px solid ${
                  t.tone === 'p1'
                    ? 'rgba(255, 107, 92, 0.30)'
                    : t.tone === 'finanz'
                    ? 'rgba(224, 168, 80, 0.30)'
                    : 'rgba(127, 184, 232, 0.30)'
                }`,
              }}
            >
              {t.tag}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function AgentBadge() {
  return (
    <div
      style={{
        width: 138,
        padding: '12px 14px',
        background:
          'linear-gradient(145deg, rgba(220, 128, 68, 0.16) 0%, rgba(146, 48, 30, 0.10) 100%)',
        border: '1px solid rgba(220, 128, 68, 0.32)',
        borderRadius: '12px',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        boxShadow:
          'inset 0 1px 0 rgba(255, 255, 255, 0.18), 0 16px 40px rgba(0, 0, 0, 0.45)',
      }}
    >
      <div className="flex items-center gap-2">
        <span
          className="inline-flex h-7 w-7 items-center justify-center"
          style={{
            background:
              'linear-gradient(135deg, var(--brand) 0%, #92301E 100%)',
            border: '1px solid rgba(220, 128, 68, 0.40)',
            borderRadius: '999px',
            color: 'white',
          }}
        >
          <Bot size={12} strokeWidth={1.8} />
        </span>
        <div>
          <p
            className="font-display font-semibold"
            style={{ fontSize: 11, color: 'var(--fg-default)', lineHeight: 1.1 }}
          >
            Copilot-Agent
          </p>
          <p
            className="font-mono uppercase"
            style={{ fontSize: 7, letterSpacing: '0.16em', color: 'var(--brand)' }}
          >
            QS-Team
          </p>
        </div>
      </div>
      <p
        className="mt-2 font-mono"
        style={{ fontSize: 9, color: 'var(--fg-muted)', letterSpacing: '0.02em' }}
      >
        24/7 · Tickets · Mails
      </p>
    </div>
  )
}

/* Suppress unused-import warnings — Workflow + Zap reserved for future use */
void Workflow; void Zap;
