'use client'

import { motion } from 'motion/react'
import ItalicAccent from '@/components/ui/ItalicAccent'
import AccentGlow from '@/components/ui/AccentGlow'

const EASE = [0.16, 1, 0.3, 1] as const

/**
 * Full-bleed Brand-Statement. Editorial Big-Type, sehr ruhig, atmospheric.
 * Antwortet auf „Warum Stefan für genau dieses Mandat".
 */
export default function UeberStatement() {
  return (
    <section
      aria-label="Brand-Statement"
      className="relative w-screen overflow-hidden"
      style={{
        marginLeft: 'calc(-50vw + 50%)',
        background: 'var(--bg-base)',
        padding: 'clamp(80px, 10vw, 140px) 0',
      }}
    >
      <AccentGlow position="top-left" intensity="low" />

      <div className="relative z-[3] mx-auto w-full max-w-[1100px] px-6 md:px-12">
        <motion.p
          className="font-mono uppercase"
          style={{
            fontSize: '11px',
            letterSpacing: '0.20em',
            color: 'var(--brand)',
          }}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20%' }}
          transition={{ duration: 0.5 }}
        >
          02 · Warum ich
        </motion.p>

        <motion.h2
          className="mt-10 font-display font-bold"
          style={{
            fontSize: 'clamp(36px, 5.4vw, 88px)',
            lineHeight: 1.05,
            letterSpacing: 'var(--tr-display)',
            color: 'var(--fg-default)',
            maxWidth: '980px',
          }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          Ich glaube nicht an die saubere Trennung zwischen{' '}
          <ItalicAccent>Strategie</ItalicAccent> und{' '}
          <ItalicAccent>Ausführung</ItalicAccent>.
        </motion.h2>

        {/* Dezenter Akzent-Strich — zieht auf Scroll von links ein.
            Editorial-Detail, das die Headline mit dem Fließtext verbindet. */}
        <motion.div
          aria-hidden
          className="mt-10 origin-left md:mt-12"
          style={{
            height: '2px',
            width: 'clamp(80px, 12vw, 160px)',
            background:
              'linear-gradient(90deg, var(--accent), color-mix(in srgb, var(--accent) 0%, transparent))',
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 1.1, delay: 0.35, ease: EASE }}
        />

        <motion.div
          className="mt-16 grid grid-cols-1 gap-12 md:mt-20 md:grid-cols-2 md:gap-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
        >
          <p
            className="font-body"
            style={{
              fontSize: '18px',
              lineHeight: 1.7,
              color: 'var(--fg-default)',
              opacity: 0.9,
            }}
          >
            Wer die Industrie-Realität nicht selber im Kopf hat, kann auch keine
            Roadmap dafür schreiben. Wer eine Roadmap schreibt, muss bereit
            sein, sie auch zu liefern. Beides in einer Person spart einer
            Mittelstands-Führung mindestens eine Beratungsphase.
          </p>
          <p
            className="font-body"
            style={{
              fontSize: '18px',
              lineHeight: 1.7,
              color: 'var(--fg-default)',
              opacity: 0.9,
            }}
          >
            Ich arbeite täglich operativ in der Industrie-IT — genau die
            Themen, die in deinem Haus auf dem Tisch landen, kommen bei mir
            auch auf den Tisch. Empfehlungen ziehe ich aus laufenden
            Programmen, nicht aus Folien.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
