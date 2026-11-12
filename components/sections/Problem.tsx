'use client'

import { motion } from 'motion/react'
import Section from '@/components/ui/Section'
import Eyebrow from '@/components/ui/Eyebrow'
import ItalicAccent from '@/components/ui/ItalicAccent'
import AccentGlow from '@/components/ui/AccentGlow'
import { ProblemDriftVisual } from '@/components/ui/ProblemDriftVisual'

const SYMPTOMS: Array<{
  num: string
  title: string
  body: string
}> = [
  {
    num: '01',
    title: 'Außendarstellung ohne Botschaft.',
    body:
      'Die Website ist da, erklärt aber nicht mehr sauber, wofür das Unternehmen heute steht.',
  },
  {
    num: '02',
    title: 'Tools ohne Priorität.',
    body:
      'Lizenzen sind schnell gekauft. Produktive Routinen entstehen erst durch konkrete Use Cases, sauberen Rollout und Verankerung im Arbeitsalltag.',
  },
  {
    num: '03',
    title: 'Prompts ohne Prozess.',
    body:
      'Ein guter Prompt allein hilft wenig. Rollen, Daten, Qualität und Wiederholbarkeit entscheiden, ob daraus echte Workflows werden.',
  },
  {
    num: '04',
    title: 'Setup ohne Anker.',
    body:
      'Nach Projektende fehlt die Doku, niemand im Team kennt das Setup, und der nächste Anbieter beginnt wieder bei null.',
  },
]

const EASE = [0.16, 1, 0.3, 1] as const

export default function Problem() {
  return (
    <Section
      className="relative py-28 md:py-36"
      background={<AccentGlow position="top-left" intensity="medium" />}
    >
      <motion.div
        className="max-w-[920px]"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-15%' }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <Eyebrow num="02">Problem</Eyebrow>
        <h2
          className="mt-6 font-display font-bold"
          style={{
            fontSize: 'clamp(36px, 4.8vw, 68px)',
            lineHeight: 'var(--lh-display)',
            letterSpacing: 'var(--tr-display)',
            color: 'var(--fg-default)',
          }}
        >
          Diese vier Probleme sehe ich{' '}
          <ItalicAccent>immer wieder</ItalicAccent>.
        </h2>
        <p
          className="mt-8 max-w-[620px] font-body"
          style={{
            fontSize: 'var(--t-body-lg)',
            lineHeight: 1.55,
            color: 'var(--fg-muted)',
          }}
        >
          Aus laufenden Engagements und Lagebild-Gesprächen: digitale
          Vorhaben kippen an wiederkehrenden Stellen. Wer früh den Kurs
          setzt, vermeidet den Schwebezustand.
        </p>
      </motion.div>

      {/* Drift-Dashboard — visueller Spiegel zum Schwebezustand */}
      <motion.div
        className="mt-14 md:mt-16"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-15%' }}
        transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
      >
        <ProblemDriftVisual />
      </motion.div>

      <div className="mt-10 grid grid-cols-1 gap-6 md:mt-14 md:grid-cols-2 md:gap-8">
        {SYMPTOMS.map((s, i) => (
          <motion.article
            key={s.num}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
            whileHover={{ y: -4, scale: 1.012 }}
            className="problem-glass group relative overflow-hidden p-8 md:p-10"
            style={{
              background:
                'linear-gradient(145deg, rgba(245, 245, 248, 0.13) 0%, rgba(220, 220, 228, 0.05) 35%, rgba(200, 200, 210, 0.04) 70%, rgba(180, 180, 195, 0.02) 100%)',
              border: '1px solid rgba(245, 245, 250, 0.16)',
              borderRadius: 'var(--r-md)',
              backdropFilter: 'blur(32px) saturate(170%)',
              WebkitBackdropFilter: 'blur(32px) saturate(170%)',
              boxShadow:
                'inset 0 1px 0 rgba(255, 255, 255, 0.22), inset 0 -1px 0 rgba(0, 0, 0, 0.35), 0 28px 64px -16px rgba(0, 0, 0, 0.55), 0 12px 28px -8px rgba(0, 0, 0, 0.40)',
              minHeight: '280px',
              transition: 'box-shadow 360ms cubic-bezier(0.22, 1, 0.36, 1), transform 360ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            {/* Top specular highlight (silvery 1px Glow-Linie) */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.65) 50%, transparent 100%)',
              }}
            />

            {/* Cool side-light oben links (silbern, default) */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(50% 60% at 10% 0%, rgba(255, 255, 255, 0.10) 0%, transparent 55%)',
              }}
            />

            {/* Bottom-Refraction (silbern, default) */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(60% 50% at 100% 100%, rgba(220, 225, 230, 0.06) 0%, transparent 60%)',
              }}
            />

            {/* Amber-Bloom — nur on-hover */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background:
                  'radial-gradient(80% 70% at 100% 0%, rgba(220, 128, 68, 0.28) 0%, transparent 55%),' +
                  'radial-gradient(70% 60% at 0% 100%, rgba(200, 98, 42, 0.10) 0%, transparent 60%)',
              }}
            />

            {/* Watermark-Nummer — nur on-hover sichtbar */}
            <span
              aria-hidden
              className="pointer-events-none absolute font-display font-black opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                right: '-12px',
                bottom: '-32px',
                fontSize: 'clamp(140px, 18vw, 220px)',
                lineHeight: 0.85,
                letterSpacing: 'var(--tr-display)',
                color: 'rgba(220, 128, 68, 0.12)',
                userSelect: 'none',
              }}
            >
              {s.num}
            </span>

            {/* Content */}
            <div className="relative z-[3]">
              <p
                className="font-mono uppercase"
                style={{
                  fontSize: 'var(--t-micro)',
                  letterSpacing: 'var(--tr-eyebrow)',
                  color: 'var(--brand)',
                  textShadow: '0 0 12px rgba(220, 128, 68, 0.25)',
                }}
              >
                {s.num}
              </p>
              <h3
                className="mt-5 font-display font-semibold"
                style={{
                  fontSize: 'var(--t-h3)',
                  lineHeight: 1.18,
                  letterSpacing: 'var(--tr-heading)',
                  color: 'var(--fg-default)',
                }}
              >
                {s.title}
              </h3>
              <p
                className="mt-4 font-body"
                style={{
                  fontSize: 'var(--t-body)',
                  lineHeight: 'var(--lh-body)',
                  color: 'var(--fg-default)',
                  opacity: 0.78,
                }}
              >
                {s.body}
              </p>
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  )
}
