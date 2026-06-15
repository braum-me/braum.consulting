'use client'

/**
 * Portfolio-Case · Template-Blueprint
 * ───────────────────────────────────
 * Arbeits- und Referenzseite für das Überarbeiten aller Cases.
 * Zeigt die komplette Anatomie eines Case-Detail-Pages (1:1 zur echten
 * Struktur in app/cases/[id]/page.tsx) plus eine Widget-Bibliothek mit
 * wiederverwendbaren, animierten Modulen + Screenshot-Slots.
 *
 * NICHT für Production-Indexierung gedacht (noindex in page.tsx).
 * High-Fidelity-Wireframe: echte Tokens, echte Komponenten, Platzhalter-Inhalt.
 */

import { useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import {
  ArrowLeft, ArrowUpRight, Quote, ImageIcon, MonitorSmartphone,
  Sparkles, GitBranch, BarChart3, MoveHorizontal, LayoutTemplate,
} from 'lucide-react'
import Link from 'next/link'
import ItalicAccent from '@/components/ui/ItalicAccent'
import AnimatedMetric from '@/components/ui/AnimatedMetric'

/* ════════════════════════════════════════════════════════════════════════
   PRIMITIVE — Annotation, Slots, Frames
   ════════════════════════════════════════════════════════════════════════ */

/** Kleines Anatomie-Label: erklärt, was ein Block ist / welche Regel gilt. */
function Anno({
  children,
  tone = 'brand',
}: {
  children: React.ReactNode
  tone?: 'brand' | 'muted' | 'req'
}) {
  const color =
    tone === 'req' ? '#28C840' : tone === 'muted' ? 'var(--fg-subtle)' : 'var(--brand)'
  const border =
    tone === 'req'
      ? 'rgba(40, 200, 64, 0.35)'
      : tone === 'muted'
        ? 'var(--border-default)'
        : 'rgba(220, 128, 68, 0.35)'
  return (
    <span
      className="inline-flex items-center gap-1.5 font-mono uppercase"
      style={{
        fontSize: '9px',
        letterSpacing: '0.16em',
        color,
        padding: '3px 9px',
        border: `1px dashed ${border}`,
        borderRadius: 'var(--r-pill)',
        background: 'rgba(15, 14, 12, 0.6)',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  )
}

/** Erläuterungs-Note unter einer Block-Überschrift (was reinkommt, Voice). */
function Note({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="font-mono"
      style={{
        fontSize: '12px',
        lineHeight: 1.6,
        color: 'var(--fg-subtle)',
        borderLeft: '2px solid rgba(220, 128, 68, 0.3)',
        paddingLeft: '14px',
        margin: '14px 0 0',
        maxWidth: '640px',
      }}
    >
      {children}
    </p>
  )
}

/** Generischer Asset-Platzhalter mit Aspect-Ratio + Label (Screenshot-Slot). */
function Slot({
  ratio = '16 / 9',
  label,
  hint,
  icon: Icon = ImageIcon,
  maxWidth,
}: {
  ratio?: string
  label: string
  hint?: string
  icon?: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>
  maxWidth?: number
}) {
  return (
    <div
      className="relative flex flex-col items-center justify-center text-center"
      style={{
        aspectRatio: ratio,
        width: '100%',
        maxWidth,
        borderRadius: 'var(--r-md)',
        border: '1.5px dashed rgba(220, 128, 68, 0.4)',
        background:
          'repeating-linear-gradient(135deg, rgba(220,128,68,0.05) 0px, rgba(220,128,68,0.05) 1px, transparent 1px, transparent 11px), var(--bg-subtle)',
        color: 'var(--fg-muted)',
        padding: '16px',
        overflow: 'hidden',
      }}
    >
      <Icon size={26} strokeWidth={1.4} style={{ color: 'var(--brand)', opacity: 0.7 }} />
      <p
        className="mt-3 font-mono uppercase"
        style={{ fontSize: '11px', letterSpacing: '0.14em', color: 'var(--fg-default)' }}
      >
        {label}
      </p>
      {hint && (
        <p
          className="mt-1 font-mono"
          style={{ fontSize: '10px', letterSpacing: '0.04em', color: 'var(--fg-subtle)' }}
        >
          {hint}
        </p>
      )}
    </div>
  )
}

/** Browser-Chrome-Frame als Wrapper für Screenshots / Mockups. */
function BrowserFrame({
  url = 'kunde.example',
  children,
}: {
  url?: string
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        borderRadius: 'var(--r-md)',
        overflow: 'hidden',
        border: '1px solid var(--border-default)',
        background: 'var(--bg-base)',
        boxShadow: 'var(--sh-3)',
      }}
    >
      <div
        className="flex items-center gap-1.5"
        style={{
          padding: '8px 12px',
          background: 'rgba(245, 245, 250, 0.04)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        {['#FF5F57', '#FEBC2E', '#28C840'].map(c => (
          <span key={c} style={{ width: 9, height: 9, borderRadius: 999, background: c, opacity: 0.75 }} />
        ))}
        <span
          className="ml-3 flex-1 font-mono"
          style={{
            fontSize: 10,
            color: 'var(--fg-subtle)',
            background: 'var(--bg-base)',
            padding: '3px 10px',
            borderRadius: 4,
            textAlign: 'center',
            letterSpacing: '0.04em',
          }}
        >
          {url}
        </span>
      </div>
      {children}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   WIDGETS — wiederverwendbare, animierte Module für Cases
   ════════════════════════════════════════════════════════════════════════ */

/** Interaktiver Before/After-Slider — z.B. „alte Site → neue Site". */
function BeforeAfterWidget() {
  const [pos, setPos] = useState(52)
  return (
    <div>
      <div
        className="relative select-none overflow-hidden"
        style={{
          aspectRatio: '16 / 9',
          borderRadius: 'var(--r-md)',
          border: '1px solid var(--border-default)',
          background: 'var(--bg-subtle)',
        }}
      >
        {/* After (Hintergrund, „neu") */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{
            background:
              'radial-gradient(70% 90% at 50% 30%, rgba(220,128,68,0.18), transparent 70%), var(--bg-muted)',
          }}
        >
          <span className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.18em', color: 'var(--brand)' }}>
            Nachher
          </span>
        </div>
        {/* Before (clip, „alt") */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{
            clipPath: `inset(0 ${100 - pos}% 0 0)`,
            background:
              'repeating-linear-gradient(135deg, rgba(120,120,130,0.08) 0px, rgba(120,120,130,0.08) 1px, transparent 1px, transparent 9px), var(--bg-base)',
          }}
        >
          <span className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.18em', color: 'var(--fg-subtle)' }}>
            Vorher
          </span>
        </div>
        {/* Handle-Linie */}
        <div
          className="absolute top-0 bottom-0"
          style={{ left: `${pos}%`, width: 2, background: 'var(--brand)', boxShadow: '0 0 12px rgba(220,128,68,0.6)' }}
        >
          <span
            className="absolute top-1/2 flex items-center justify-center"
            style={{
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 30,
              height: 30,
              borderRadius: 999,
              background: 'var(--brand)',
              boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
            }}
          >
            <MoveHorizontal size={15} strokeWidth={2} style={{ color: '#0F0E0C' }} />
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={e => setPos(Number(e.target.value))}
          aria-label="Vorher/Nachher-Vergleich"
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
    </div>
  )
}

/** KPI-Counter-Cluster — animierte Outcome-Zahlen. */
function KpiClusterWidget() {
  const kpis = [
    { value: '−47%', label: 'Manuelle Tickets' },
    { value: '3,2×', label: 'Schnellere Freigabe' },
    { value: '90', label: 'Lighthouse-Score' },
  ]
  return (
    <div className="grid grid-cols-3 gap-4">
      {kpis.map(k => (
        <div
          key={k.label}
          className="flex flex-col items-start"
          style={{
            padding: '20px 18px',
            borderRadius: 'var(--r-md)',
            border: '1px solid var(--border-default)',
            background: 'var(--bg-subtle)',
          }}
        >
          <AnimatedMetric
            value={k.value}
            className="font-display font-black"
            style={{
              fontSize: 'clamp(28px, 4vw, 44px)',
              lineHeight: 1,
              letterSpacing: 'var(--tr-display)',
              color: 'var(--accent)',
            }}
          />
          <span
            className="mt-3 font-mono uppercase"
            style={{ fontSize: 9, letterSpacing: '0.14em', color: 'var(--fg-muted)' }}
          >
            {k.label}
          </span>
        </div>
      ))}
    </div>
  )
}

/** Mini-Architektur-Diagramm (Hub-Spoke) — animierte System-Skizze. */
function ArchitectureWidget() {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const reduce = useReducedMotion()
  const spokes = [
    { x2: 60, y2: 150 },
    { x2: 180, y2: 165 },
    { x2: 300, y2: 150 },
  ]
  return (
    <div
      className="relative"
      style={{
        borderRadius: 'var(--r-md)',
        border: '1px solid var(--border-default)',
        background:
          'radial-gradient(60% 60% at 50% 35%, rgba(220,128,68,0.12), transparent 70%), var(--bg-subtle)',
        padding: '14px',
      }}
    >
      <svg ref={ref} viewBox="0 0 360 200" style={{ width: '100%', height: 'auto' }}>
        <defs>
          <radialGradient id="tpl-hub" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(220,128,68,0.55)" />
            <stop offset="100%" stopColor="rgba(220,128,68,0)" />
          </radialGradient>
        </defs>
        <circle cx="180" cy="80" r="50" fill="url(#tpl-hub)" />
        {spokes.map((p, i) => (
          <g key={i}>
            <line x1="180" y1="80" x2={p.x2} y2={p.y2} stroke="rgba(220,128,68,0.25)" strokeWidth="1" strokeDasharray="2 3" />
            {!reduce && (
              <motion.circle
                cx="180" cy="80" r="2.5" fill="rgba(220,128,68,0.95)"
                initial={{ opacity: 0 }}
                animate={inView ? { cx: [180, p.x2], cy: [80, p.y2], opacity: [0, 1, 1, 0] } : undefined}
                transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.5, ease: 'easeInOut' }}
              />
            )}
          </g>
        ))}
        <rect x="146" y="58" width="68" height="44" rx="8" fill="rgba(15,14,12,0.95)" stroke="rgba(220,128,68,0.6)" strokeWidth="1.2" />
        <text x="180" y="78" textAnchor="middle" fill="#DC8044" fontSize="13" fontFamily="var(--font-display)" fontWeight="700">HUB</text>
        <text x="180" y="92" textAnchor="middle" fill="rgba(245,245,250,0.45)" fontSize="6" fontFamily="var(--font-mono)" letterSpacing="0.22em">SYSTEM</text>
        {[{ x: 25, y: 142, t: 'Knoten A' }, { x: 150, y: 158, t: 'Knoten B' }, { x: 275, y: 142, t: 'Knoten C' }].map(n => (
          <g key={n.t}>
            <rect x={n.x} y={n.y} width="64" height="24" rx="5" fill="rgba(15,14,12,0.92)" stroke="rgba(245,245,250,0.18)" strokeWidth="1" />
            <circle cx={n.x + 9} cy={n.y + 12} r="2.5" fill="#28C840" />
            <text x={n.x + 17} y={n.y + 15} fill="rgba(245,245,250,0.8)" fontSize="7" fontFamily="var(--font-mono)" letterSpacing="0.08em">{n.t}</text>
          </g>
        ))}
      </svg>
    </div>
  )
}

/** Prozess-/Timeline-Strip — N Schritte mit Konnektoren. */
function TimelineWidget() {
  const steps = ['Analyse', 'Konzept', 'Umsetzung', 'Betrieb']
  return (
    <div
      className="flex items-center justify-between"
      style={{
        padding: '24px 20px',
        borderRadius: 'var(--r-md)',
        border: '1px solid var(--border-default)',
        background: 'var(--bg-subtle)',
      }}
    >
      {steps.map((s, i) => (
        <div key={s} className="flex flex-1 items-center last:flex-none">
          <div className="flex flex-col items-center gap-2">
            <span
              className="flex items-center justify-center font-mono"
              style={{
                width: 30, height: 30, borderRadius: 999,
                border: '1px solid rgba(220,128,68,0.45)',
                background: 'var(--bg-base)',
                color: 'var(--brand)', fontSize: 11,
              }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: '0.12em', color: 'var(--fg-muted)' }}>
              {s}
            </span>
          </div>
          {i < steps.length - 1 && (
            <span
              className="mx-2 mb-5 h-px flex-1"
              style={{ background: 'linear-gradient(90deg, rgba(220,128,68,0.1), rgba(220,128,68,0.45), rgba(220,128,68,0.1))' }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   LAYOUT-HELFER
   ════════════════════════════════════════════════════════════════════════ */

function BlockHeader({ num, label, title, children }: { num: string; label: string; title: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div>
      <p className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.18em', color: 'var(--brand)' }}>
        {num} · {label}
      </p>
      <h2
        className="mt-5 font-display font-bold"
        style={{ fontSize: 'clamp(28px, 3.4vw, 44px)', lineHeight: 1.1, letterSpacing: 'var(--tr-heading)', color: 'var(--fg-default)' }}
      >
        {title}
      </h2>
      {children}
    </div>
  )
}

function Divider() {
  return <div style={{ height: 1, background: 'var(--border-subtle)', margin: 'clamp(72px, 9vw, 120px) 0' }} />
}

/* ════════════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════════════ */

export default function TemplateBlueprint() {
  return (
    <div style={{ background: 'var(--bg-base)', color: 'var(--fg-default)' }}>
      {/* ── Doc-Header ──────────────────────────────────────────────────── */}
      <header
        className="relative w-screen overflow-hidden"
        style={{
          marginLeft: 'calc(-50vw + 50%)',
          paddingTop: 128,
          paddingBottom: 64,
          background:
            'radial-gradient(60% 70% at 80% 10%, rgba(220,128,68,0.18), transparent 60%), var(--bg-base)',
          borderBottom: '1px solid var(--border-default)',
        }}
      >
        <div className="mx-auto w-full max-w-[var(--container-wide)] px-6 md:px-12">
          <Link
            href="/cases"
            className="inline-flex items-center gap-2 font-mono uppercase transition-colors duration-220 hover:text-[color:var(--brand)]"
            style={{ fontSize: 11, letterSpacing: '0.18em', color: 'var(--fg-muted)' }}
          >
            <ArrowLeft size={11} strokeWidth={1.6} /> Zum Portfolio
          </Link>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Anno tone="muted">Interne Vorlage · noindex</Anno>
            <Anno>Stand: Mai 2026</Anno>
          </div>
          <h1
            className="mt-8 font-display font-bold"
            style={{ fontSize: 'clamp(40px, 6vw, 84px)', lineHeight: 1.02, letterSpacing: 'var(--tr-display)', maxWidth: 1000 }}
          >
            Portfolio-Case <ItalicAccent>Blueprint</ItalicAccent>.
          </h1>
          <p className="mt-8 font-body" style={{ fontSize: 'clamp(17px, 1.6vw, 21px)', lineHeight: 1.55, color: 'var(--fg-muted)', maxWidth: 720 }}>
            Die vollständige Anatomie eines Case-Detail-Pages — 1:1 zur echten Struktur,
            mit Screenshot-Slots, Browser-Mockups und einer Widget-Bibliothek. Referenz
            für das Überarbeiten aller Cases.
          </p>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[var(--container-wide)] px-6 py-24 md:px-12 md:py-32">

        {/* ════ TEIL 1 · ANATOMIE ════════════════════════════════════════ */}
        <p className="font-mono uppercase" style={{ fontSize: 12, letterSpacing: '0.22em', color: 'var(--fg-subtle)' }}>
          Teil 1 — Anatomie eines Cases
        </p>

        {/* ── A · Hero ────────────────────────────────────────────────── */}
        <section className="mt-12">
          <div className="flex flex-wrap items-center gap-3">
            <Anno tone="req">Pflicht</Anno>
            <Anno>Komponente: CaseHero.tsx</Anno>
          </div>
          <BlockHeader num="A" label="Case-Hero" title={<>Der <ItalicAccent>Einstieg</ItalicAccent>.</>}>
            <Note>
              Eyebrow (Field-Label) → großer Titel → Lede (1 Satz, was war die Aufgabe) →
              Outcome-Metric als animierter Counter → Fakten-Grid (Sektor · Jahr · Laufzeit).
              Voice: ruhig, Du-Form, keine Superlative.
            </Note>
          </BlockHeader>

          <div
            className="mt-10 overflow-hidden"
            style={{
              borderRadius: 'var(--r-lg)',
              border: '1px solid var(--border-default)',
              background: 'radial-gradient(60% 70% at 80% 10%, rgba(220,128,68,0.12), transparent 60%), var(--bg-subtle)',
              padding: 'clamp(28px, 4vw, 56px)',
            }}
          >
            <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
              <span className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.18em', color: 'var(--brand)', padding: '5px 12px', border: '1px solid rgba(220,128,68,0.3)', borderRadius: 'var(--r-pill)' }}>
                Field-Label
              </span>
              <span className="font-mono" style={{ fontSize: 11, color: 'var(--fg-muted)' }}>2026 · 10 Wochen</span>
            </div>
            <p className="mt-8 font-display font-bold" style={{ fontSize: 'clamp(32px, 5vw, 68px)', lineHeight: 1.04, letterSpacing: 'var(--tr-display)', maxWidth: 900 }}>
              Case-Titel — was wurde gebaut
            </p>
            <p className="mt-6 font-body" style={{ fontSize: 'clamp(16px, 1.5vw, 20px)', lineHeight: 1.55, color: 'var(--fg-muted)', maxWidth: 640 }}>
              Lede: Ein Satz, der die Aufgabe und das Ergebnis auf den Punkt bringt — ohne Marketing-Floskeln.
            </p>
            <div className="mt-12 flex flex-wrap items-end gap-x-14 gap-y-8">
              <div>
                <p className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--fg-muted)', marginBottom: 12 }}>Outcome</p>
                <AnimatedMetric value="−47%" className="font-display font-black" style={{ fontSize: 'clamp(48px, 7vw, 96px)', lineHeight: 0.92, letterSpacing: 'var(--tr-display)', color: 'var(--accent)', display: 'inline-block' }} />
                <p className="mt-3 font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.18em', opacity: 0.85 }}>Metric-Label</p>
              </div>
              <dl className="flex flex-wrap gap-x-10 gap-y-5">
                {[['Sektor', 'Branche · Region'], ['Jahr', '2026'], ['Laufzeit', '10 Wochen']].map(([l, v]) => (
                  <div key={l}>
                    <dt className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: '0.18em', color: 'var(--fg-subtle)' }}>{l}</dt>
                    <dd className="mt-2 font-display font-medium" style={{ fontSize: 15 }}>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <Divider />

        {/* ── B · Visual-Banner ───────────────────────────────────────── */}
        <section>
          <div className="flex flex-wrap items-center gap-3">
            <Anno tone="req">Pflicht</Anno>
            <Anno>3 Varianten — eine wählen</Anno>
          </div>
          <BlockHeader num="B" label="Visual-Banner" title={<>Das <ItalicAccent>Schaustück</ItalicAccent>.</>}>
            <Note>
              16:9-Bühne direkt unter dem Hero. Pro Case genau eine Variante: echter
              Screenshot, Browser-Mockup oder animiertes Widget. Links daneben das
              prägnanteste Outcome-Zitat.
            </Note>
          </BlockHeader>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <div className="mb-3"><Anno tone="muted">Variante 1 · Screenshot</Anno></div>
              <Slot label="Screenshot 16:9" hint="z.B. /cases/{slug}.webp" />
            </div>
            <div>
              <div className="mb-3"><Anno tone="muted">Variante 2 · Browser</Anno></div>
              <BrowserFrame>
                <Slot ratio="16 / 10" label="Site-Screenshot" icon={LayoutTemplate} />
              </BrowserFrame>
            </div>
            <div>
              <div className="mb-3"><Anno tone="muted">Variante 3 · Widget</Anno></div>
              <ArchitectureWidget />
            </div>
          </div>
        </section>

        <Divider />

        {/* ── C · Story-Blöcke ────────────────────────────────────────── */}
        <section>
          <div className="flex flex-wrap items-center gap-3">
            <Anno tone="req">Pflicht</Anno>
            <Anno>Sticky Side-Nav: 01–04</Anno>
          </div>
          <BlockHeader num="C" label="Story-Blöcke" title={<>Der <ItalicAccent>Verlauf</ItalicAccent>.</>}>
            <Note>
              Vier nummerierte Abschnitte mit Sticky-Side-Nav. Content max. 780px breit.
              Dazwischen ein Pull-Quote als Atempause.
            </Note>
          </BlockHeader>

          <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[200px_1fr] lg:gap-16">
            {/* Fake Sticky-Nav */}
            <div>
              <div className="sticky top-32 flex flex-col gap-3">
                {[['01', 'Kontext'], ['02', 'Vorgehen'], ['03', 'Outcome'], ['04', 'Bausteine']].map(([n, l]) => (
                  <div key={n} className="flex items-center gap-3 font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.12em', color: 'var(--fg-muted)' }}>
                    <span style={{ color: 'var(--brand)' }}>{n}</span> {l}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ maxWidth: 780 }}>
              {/* 01 Kontext */}
              <article>
                <p className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.18em', color: 'var(--brand)' }}>01 · Kontext</p>
                <h3 className="mt-4 font-display font-bold" style={{ fontSize: 'clamp(26px, 3.2vw, 40px)', lineHeight: 1.1, letterSpacing: 'var(--tr-heading)' }}>
                  Wo wir <ItalicAccent>angefangen</ItalicAccent> haben.
                </h3>
                <Note>2–3 Absätze Fließtext. Ausgangslage, Auftrag. Erster Absatz hell, Rest gedimmt.</Note>
                <div className="mt-8 space-y-5 font-body" style={{ fontSize: 18, lineHeight: 1.7 }}>
                  <p>Absatz 1 — Ausgangslage. Welches Problem, welche Stakeholder, welcher Druck.</p>
                  <p style={{ color: 'var(--fg-muted)' }}>Absatz 2 — der konkrete Auftrag und die Rahmenbedingungen.</p>
                </div>
              </article>

              {/* 02 Vorgehen */}
              <article style={{ marginTop: 'clamp(64px, 9vw, 112px)' }}>
                <p className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.18em', color: 'var(--brand)' }}>02 · Vorgehen</p>
                <h3 className="mt-4 font-display font-bold" style={{ fontSize: 'clamp(26px, 3.2vw, 40px)', lineHeight: 1.1, letterSpacing: 'var(--tr-heading)' }}>
                  Was wir gemacht haben.
                </h3>
                <Note>Nummerierte Schritte (3–6). Je ein Satz, aktiv formuliert.</Note>
                <ol className="mt-8 space-y-6">
                  {['Schritt eins — was zuerst passiert ist.', 'Schritt zwei — der nächste Hebel.', 'Schritt drei — die Umsetzung.'].map((s, i) => (
                    <li key={i} className="grid grid-cols-[44px_1fr] items-baseline gap-6 border-b pb-6 last:border-0" style={{ borderColor: 'var(--border-subtle)' }}>
                      <span className="font-mono" style={{ fontSize: 14, color: 'var(--accent)', fontWeight: 500 }}>{String(i + 1).padStart(2, '0')}</span>
                      <p className="font-body" style={{ fontSize: 18, lineHeight: 1.6 }}>{s}</p>
                    </li>
                  ))}
                </ol>

                {/* Pull-Quote */}
                <div style={{ marginTop: 'clamp(48px, 7vw, 80px)' }}>
                  <Anno>Optional · Pull-Quote</Anno>
                  <Quote size={32} strokeWidth={1.4} style={{ color: 'var(--accent)', marginTop: 16 }} />
                  <blockquote className="mt-4 font-display" style={{ fontSize: 'clamp(24px, 3.4vw, 42px)', lineHeight: 1.25, letterSpacing: 'var(--tr-heading)', fontStyle: 'italic', fontFamily: 'var(--font-accent)', fontWeight: 400 }}>
                    „Der prägnanteste Satz aus dem Engagement."
                  </blockquote>
                  <p className="mt-5 font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--fg-subtle)' }}>Aus dem Engagement · Sektor</p>
                </div>
              </article>

              {/* 03 Outcome */}
              <article style={{ marginTop: 'clamp(64px, 9vw, 112px)' }}>
                <p className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.18em', color: 'var(--brand)' }}>03 · Outcome</p>
                <h3 className="mt-4 font-display font-bold" style={{ fontSize: 'clamp(26px, 3.2vw, 40px)', lineHeight: 1.1, letterSpacing: 'var(--tr-heading)' }}>
                  Was am Ende auf dem <ItalicAccent>Tisch</ItalicAccent> lag.
                </h3>
                <Note>Bullet-Liste mit Glow-Dots. Konkrete, prüfbare Ergebnisse. Optional KPI-Cluster (Widget unten).</Note>
                <ul className="mt-8 space-y-4">
                  {['Ergebnis eins — messbar, konkret.', 'Ergebnis zwei — was sich für den Kunden geändert hat.', 'Ergebnis drei — der bleibende Effekt.'].map((o, i) => (
                    <li key={i} className="flex items-start gap-4 font-body" style={{ fontSize: 18, lineHeight: 1.6 }}>
                      <span className="mt-3 inline-block h-1.5 w-1.5 shrink-0" style={{ background: 'var(--accent)', borderRadius: 999, boxShadow: '0 0 8px rgba(200,98,42,0.6)' }} />
                      {o}
                    </li>
                  ))}
                </ul>
              </article>

              {/* 04 Bausteine */}
              <article style={{ marginTop: 'clamp(64px, 9vw, 112px)' }}>
                <div className="flex items-baseline justify-between gap-4">
                  <p className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.18em', color: 'var(--brand)' }}>04 · Bausteine</p>
                  <span className="inline-flex items-center gap-2 font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.16em', color: 'var(--fg-muted)' }}>
                    Mehr zur Leistung <ArrowUpRight size={12} strokeWidth={1.6} />
                  </span>
                </div>
                <h3 className="mt-4 font-display font-bold" style={{ fontSize: 'clamp(26px, 3.2vw, 40px)', lineHeight: 1.1, letterSpacing: 'var(--tr-heading)' }}>
                  Was zusammenkam.
                </h3>
                <Note>Tech-/Tool-Pills. Verlinkt unten rechts auf die passende Leistungs-Subpage.</Note>
                <ul className="mt-8 flex flex-wrap gap-3">
                  {['Tool A', 'Tool B', 'Framework C', 'Plattform D', 'Methode E'].map(t => (
                    <li key={t} className="font-mono" style={{ fontSize: 13, color: 'var(--fg-default)', padding: '10px 18px', border: '1px solid var(--border-default)', borderRadius: 'var(--r-pill)', background: 'var(--bg-elevated)' }}>{t}</li>
                  ))}
                </ul>
              </article>
            </div>
          </div>
        </section>

        <Divider />

        {/* ── D · Abschluss ───────────────────────────────────────────── */}
        <section>
          <div className="flex flex-wrap items-center gap-3">
            <Anno tone="req">Pflicht</Anno>
            <Anno>Komponenten: LagebildPushSection + NextCasePeek</Anno>
          </div>
          <BlockHeader num="D" label="Abschluss" title={<>Der <ItalicAccent>Übergang</ItalicAccent>.</>}>
            <Note>Lagebild-CTA (Selbst-Check zum Thema des Cases) + „Nächster Case"-Peek. Beide aus bestehenden Komponenten — hier nur als Slot markiert.</Note>
          </BlockHeader>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            <Slot ratio="16 / 7" label="LagebildPushSection" hint="thematischer Selbst-Check-CTA" icon={Sparkles} />
            <Slot ratio="16 / 7" label="NextCasePeek" hint="Vorschau nächster Case" icon={ArrowUpRight} />
          </div>
        </section>

        <Divider />

        {/* ════ TEIL 2 · WIDGET-BIBLIOTHEK ═══════════════════════════════ */}
        <p className="font-mono uppercase" style={{ fontSize: 12, letterSpacing: '0.22em', color: 'var(--fg-subtle)' }}>
          Teil 2 — Widget-Bibliothek
        </p>
        <h2 className="mt-6 font-display font-bold" style={{ fontSize: 'clamp(28px, 3.6vw, 48px)', lineHeight: 1.08, letterSpacing: 'var(--tr-heading)', maxWidth: 720 }}>
          Module, die ein Case <ItalicAccent>einbetten</ItalicAccent> kann.
        </h2>
        <Note>Pro Case 1–3 davon einsetzen — dort, wo sie die Story tragen. Nicht stapeln.</Note>

        <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-16 md:grid-cols-2">
          <WidgetCard icon={MoveHorizontal} title="Before/After-Slider" desc="Alte vs. neue Lösung, interaktiv vergleichbar.">
            <BeforeAfterWidget />
          </WidgetCard>

          <WidgetCard icon={BarChart3} title="KPI-Counter-Cluster" desc="Animierte Outcome-Zahlen, zählen beim Scrollen hoch.">
            <KpiClusterWidget />
          </WidgetCard>

          <WidgetCard icon={GitBranch} title="Architektur-Diagramm" desc="Hub-Spoke-Skizze für System-/Plattform-Cases.">
            <ArchitectureWidget />
          </WidgetCard>

          <WidgetCard icon={LayoutTemplate} title="Prozess-/Timeline-Strip" desc="Phasen eines Engagements als Zeitachse.">
            <TimelineWidget />
          </WidgetCard>

          <WidgetCard icon={MonitorSmartphone} title="Device-Frames" desc="Screenshots in Browser- und Phone-Rahmen.">
            <div className="grid grid-cols-[1fr_92px] items-end gap-4">
              <BrowserFrame><Slot ratio="16 / 10" label="Desktop" icon={LayoutTemplate} /></BrowserFrame>
              <div style={{ borderRadius: 18, border: '1px solid var(--border-default)', background: 'var(--bg-base)', padding: 5, boxShadow: 'var(--sh-2)' }}>
                <Slot ratio="9 / 19" label="Mobil" icon={MonitorSmartphone} />
              </div>
            </div>
          </WidgetCard>

          <WidgetCard icon={ImageIcon} title="Screenshot-Slots" desc="Reine Bild-Platzhalter in den gängigen Ratios.">
            <div className="grid grid-cols-2 gap-4">
              <Slot ratio="4 / 3" label="4:3" />
              <Slot ratio="1 / 1" label="1:1 quadratisch" />
            </div>
          </WidgetCard>
        </div>
      </div>
    </div>
  )
}

function WidgetCard({ icon: Icon, title, desc, children }: { icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>; title: string; desc: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center" style={{ width: 34, height: 34, borderRadius: 'var(--r-sm)', border: '1px solid var(--border-default)', background: 'var(--bg-elevated)' }}>
          <Icon size={16} strokeWidth={1.6} style={{ color: 'var(--brand)' }} />
        </span>
        <div>
          <h3 className="font-display font-bold" style={{ fontSize: 18, letterSpacing: '-0.01em' }}>{title}</h3>
        </div>
      </div>
      <p className="mt-2 font-body" style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--fg-muted)' }}>{desc}</p>
      <div className="mt-6">{children}</div>
    </div>
  )
}
