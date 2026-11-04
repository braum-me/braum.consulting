'use client'

import { motion } from 'motion/react'
import type { CSSProperties } from 'react'

/* ── Live-Demo-Previews für die Werkzeug-Karten ─────────────────────────────
   Geteilt von Homepage-Teaser (components/sections/WerkzeugeTeaser) und dem
   Hub (/werkzeuge). Jede Karte zeigt beim Hover eine kleine animierte Demo.
   Vier Archetypen decken alle 12 Tools ab. Werte sind illustrativ (Teaser,
   kein echtes Ergebnis) — bewusst plausibel, nie als echte Zahl misszuverstehen.

   Props pro Preview:
   - active: wird beim Hover/Fokus true → Animation läuft
   - still:  prefers-reduced-motion → alles statisch im Endzustand zeigen */

const EASE = [0.16, 1, 0.3, 1] as const

type PreviewSpec =
  | { kind: 'meter'; label: string; value: string; fill: number; hot?: boolean }
  | { kind: 'assess'; steps: string[]; result: string }
  | { kind: 'quiz' }
  | { kind: 'stack'; score: number; label: string }

const PREVIEW: Record<string, PreviewSpec> = {
  'ai-stack-fit':                        { kind: 'stack', score: 82, label: 'EU-Souveränität' },
  'nis2-betroffenheit':                  { kind: 'assess', steps: ['Größe', 'Sektor', 'Lieferkette'], result: 'Mittelbar betroffen' },
  'm365-migration-kosten':               { kind: 'meter', label: 'Komplexität', value: 'Mittel', fill: 0.56 },
  'iso-27001-readiness':                 { kind: 'assess', steps: ['Scope', 'Risiken', 'Kontrollen'], result: 'Reifegrad 2 von 4' },
  'ki-readiness':                        { kind: 'assess', steps: ['Daten', 'Rechte', 'Governance'], result: 'Bedingt bereit' },
  'microsoft-365-oder-google-workspace': { kind: 'assess', steps: ['Stack', 'Arbeit', 'Compliance'], result: 'Eher Microsoft 365' },
  'website-check':                       { kind: 'assess', steps: ['Profil', 'Technik', 'Wege'], result: '3 Hebel offen' },
  'automatisierung-roi':                 { kind: 'meter', label: 'Spart pro Jahr', value: '148 h', fill: 0.74, hot: true },
  'ki-dsgvo-check':                      { kind: 'assess', steps: ['Daten', 'Vertrag', 'Ort'], result: 'Gelb · mit Auflagen' },
  'phishing-quiz':                       { kind: 'quiz' },
  'cyber-schaden':                       { kind: 'meter', label: 'Ein Tag Stillstand', value: '~12.400 €', fill: 0.64, hot: true },
  'passwort-check':                      { kind: 'meter', label: 'Geknackt in', value: '3 Wochen', fill: 0.38 },
}

/** Letzter Pfad-Teil eines /werkzeuge/…-Hrefs. */
export function slugOf(href: string) {
  return href.split('/').filter(Boolean).pop() ?? ''
}

/** Gibt es für diesen Slug eine Live-Demo? */
export function hasPreview(slug: string) {
  return slug in PREVIEW
}

/** Geteilter Stage-Hintergrund (16:10) für den Teaser. */
export const stageBase: CSSProperties = {
  position: 'relative',
  aspectRatio: '16 / 10',
  borderBottom: '1px solid var(--border-subtle)',
  overflow: 'hidden',
  background: 'radial-gradient(80% 90% at 50% 12%, rgba(146, 48, 30, 0.18) 0%, rgba(15, 14, 12, 0.65) 58%, var(--bg-base) 100%)',
}

function MeterPreview({ spec, active, still }: { spec: Extract<PreviewSpec, { kind: 'meter' }>; active: boolean; still: boolean }) {
  const col = spec.hot ? 'var(--accent)' : 'var(--brand)'
  return (
    <div className="absolute inset-0 flex flex-col justify-center" style={{ padding: '0 28px', gap: 12 }}>
      <span className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.16em', color: 'var(--fg-muted)' }}>
        {spec.label}
      </span>
      <motion.span
        className="font-display font-bold"
        style={{ fontSize: 34, lineHeight: 1, color: col, letterSpacing: 'var(--tr-display)' }}
        initial={false}
        animate={still ? { opacity: 1 } : { opacity: active ? 1 : 0.45, y: active ? 0 : 4 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        {spec.value}
      </motion.span>
      <div style={{ height: 6, borderRadius: 'var(--r-pill)', background: 'rgba(242,240,235,0.08)', overflow: 'hidden' }}>
        <motion.div
          style={{ height: '100%', borderRadius: 'var(--r-pill)', background: col, transformOrigin: 'left' }}
          initial={false}
          animate={{ scaleX: still ? spec.fill : active ? spec.fill : 0.001 }}
          transition={{ duration: 0.7, ease: EASE }}
        />
      </div>
    </div>
  )
}

function AssessPreview({ spec, active, still }: { spec: Extract<PreviewSpec, { kind: 'assess' }>; active: boolean; still: boolean }) {
  const on = active || still
  return (
    <div className="absolute inset-0 flex flex-col justify-center" style={{ padding: '0 24px', gap: 9 }}>
      <div className="flex flex-wrap" style={{ gap: 7 }}>
        {spec.steps.map((s, i) => (
          <motion.span
            key={s}
            className="font-body"
            style={{ fontSize: 12, padding: '5px 11px', borderRadius: 'var(--r-pill)', color: 'var(--fg-default)', border: '1px solid rgba(242,240,235,0.14)', whiteSpace: 'nowrap' }}
            initial={false}
            animate={{
              borderColor: on ? 'rgba(220,128,68,0.55)' : 'rgba(242,240,235,0.14)',
              background: on ? 'rgba(220,128,68,0.10)' : 'rgba(242,240,235,0.03)',
            }}
            transition={{ duration: 0.3, ease: EASE, delay: on ? i * 0.12 : 0 }}
          >
            {s}
          </motion.span>
        ))}
      </div>
      <motion.div
        className="flex items-center"
        style={{ gap: 8, marginTop: 6 }}
        initial={false}
        animate={{ opacity: on ? 1 : 0, y: on ? 0 : 8 }}
        transition={{ duration: 0.4, ease: EASE, delay: on ? spec.steps.length * 0.12 + 0.05 : 0 }}
      >
        <span aria-hidden style={{ width: 7, height: 7, borderRadius: 'var(--r-pill)', background: 'var(--accent)', flexShrink: 0 }} />
        <span className="font-display font-semibold" style={{ fontSize: 17, color: 'var(--fg-default)', lineHeight: 1.1 }}>
          {spec.result}
        </span>
      </motion.div>
    </div>
  )
}

function QuizPreview({ active, still }: { active: boolean; still: boolean }) {
  const on = active || still
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ padding: '0 26px' }}>
      <div style={{ width: '100%', maxWidth: 230, borderRadius: 10, padding: 14, background: 'rgba(242,240,235,0.04)', border: '1px solid rgba(242,240,235,0.12)' }}>
        <div className="flex items-center" style={{ gap: 8, marginBottom: 10 }}>
          <span style={{ width: 22, height: 22, borderRadius: 'var(--r-pill)', background: 'rgba(220,128,68,0.18)', flexShrink: 0 }} />
          <span style={{ height: 7, flex: 1, borderRadius: 'var(--r-pill)', background: 'rgba(242,240,235,0.16)' }} />
        </div>
        <span style={{ display: 'block', height: 6, width: '90%', borderRadius: 'var(--r-pill)', background: 'rgba(242,240,235,0.10)', marginBottom: 6 }} />
        <span style={{ display: 'block', height: 6, width: '62%', borderRadius: 'var(--r-pill)', background: 'rgba(242,240,235,0.10)' }} />
        <motion.div
          className="font-mono uppercase inline-flex items-center"
          style={{ marginTop: 12, gap: 6, fontSize: 10, letterSpacing: '0.14em', padding: '5px 10px', borderRadius: 6, color: 'var(--accent)', border: '1px solid rgba(200,98,42,0.5)', background: 'rgba(200,98,42,0.12)' }}
          initial={false}
          animate={{ opacity: on ? 1 : 0, scale: on ? 1 : 0.85, rotate: on ? -2 : 4 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          Phishing erkannt
        </motion.div>
      </div>
    </div>
  )
}

function StackPreview({ spec, active, still }: { spec: Extract<PreviewSpec, { kind: 'stack' }>; active: boolean; still: boolean }) {
  const on = active || still
  const tiles = Array.from({ length: 12 })
  return (
    <div className="absolute inset-0 flex items-center" style={{ padding: '0 24px', gap: 18 }}>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, flex: 1 }}>
        {tiles.map((_, i) => (
          <motion.span
            key={i}
            style={{ aspectRatio: '1', borderRadius: 5, background: 'rgba(220,128,68,0.5)' }}
            initial={false}
            animate={{ opacity: on ? (i % 5 === 0 ? 0.9 : 0.34) : 0.12 }}
            transition={{ duration: 0.3, ease: EASE, delay: on ? i * 0.035 : 0 }}
          />
        ))}
      </div>
      <div className="flex flex-col items-center" style={{ flexShrink: 0, width: 78 }}>
        <motion.span
          className="font-display font-bold"
          style={{ fontSize: 30, lineHeight: 1, color: 'var(--brand)' }}
          initial={false}
          animate={{ opacity: on ? 1 : 0.4, scale: on ? 1 : 0.9 }}
          transition={{ duration: 0.4, ease: EASE, delay: on ? 0.3 : 0 }}
        >
          {spec.score}
        </motion.span>
        <span className="font-mono uppercase" style={{ marginTop: 6, fontSize: 8.5, letterSpacing: '0.14em', color: 'var(--fg-muted)', textAlign: 'center', lineHeight: 1.3 }}>
          {spec.label}
        </span>
      </div>
    </div>
  )
}

/** Rendert die zum Slug passende Live-Demo (füllt den Eltern-Container, der
 *  `position: relative` sein muss). Gibt null zurück, wenn kein Spec existiert. */
export function ToolPreview({ slug, active, still }: { slug: string; active: boolean; still: boolean }) {
  const spec = PREVIEW[slug]
  if (!spec) return null
  switch (spec.kind) {
    case 'meter':  return <MeterPreview spec={spec} active={active} still={still} />
    case 'assess': return <AssessPreview spec={spec} active={active} still={still} />
    case 'quiz':   return <QuizPreview active={active} still={still} />
    case 'stack':  return <StackPreview spec={spec} active={active} still={still} />
  }
}
