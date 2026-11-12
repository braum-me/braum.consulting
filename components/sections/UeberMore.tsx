'use client'

import { motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import Eyebrow from '@/components/ui/Eyebrow'
import ItalicAccent from '@/components/ui/ItalicAccent'
import AccentGlow from '@/components/ui/AccentGlow'
import MonogramOutline from '@/components/ui/MonogramOutline'

const EASE = [0.16, 1, 0.3, 1] as const

const ELSEWHERE: Array<{
  source:  string
  href:    string
  title:   string
  body:    string
}> = [
  {
    source: 'stefanbraum.de',
    href:   'https://stefanbraum.de',
    title:  'Long-Form, Engagement-Notizen, Talks.',
    body:
      'Was sich nicht in einen Auftrag faltet, schreibt sich woanders nieder. Aktuelle Notizen, Tool-Bewertungen, Vorträge, Hintergrund.',
  },
  {
    source: 'LinkedIn · /in/stefanbraum',
    href:   'https://www.linkedin.com/in/stefanbraum',
    title:  'Werdegang im Detail.',
    body:
      'Vollständiger Werdegang mit Stationen, Verantwortlichkeiten und ausgewählten Projekten. Anbahnungen gern hier.',
  },
  {
    source: 'GitHub',
    href:   'https://github.com/braum-me',
    title:  'Snippets und Tools, wenn freigegeben.',
    body:
      'PowerShell-Helpers, Next.js-Templates, kleine Werkzeuge aus laufenden Mandaten. Veröffentlicht, wenn der Kunde freigibt.',
  },
]

/**
 * Bridge-Sektion „Außerhalb der Site": Stefan-Brand erstreckt sich auf
 * stefanbraum.de, LinkedIn, GitHub. Eigene Mini-Karten mit Source-Tags
 * und Body-Texten. Atmospheric, Footer-CTA folgt nicht hier (Footer global).
 */
export default function UeberMore() {
  return (
    <section
      className="relative w-screen overflow-hidden"
      style={{
        marginLeft: 'calc(-50vw + 50%)',
        background: 'var(--bg-base)',
        padding: 'clamp(80px, 10vw, 128px) 0',
      }}
    >
      <AccentGlow position="spread" intensity="medium" />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          right: '-22vw',
          bottom: '-10%',
          width: 'clamp(700px, 95vw, 1400px)',
          aspectRatio: '2 / 1',
          color: '#F2F0EB',
          opacity: 0.10,
          filter:
            'drop-shadow(0 0 60px rgba(200, 98, 42, 0.4)) drop-shadow(0 0 16px rgba(220, 128, 68, 0.30))',
          zIndex: 1,
        }}
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 0.10, x: 0 }}
        viewport={{ once: true, margin: '-15%' }}
        transition={{ duration: 1.4, ease: EASE }}
      >
        <MonogramOutline strokeWidth={0.6} style={{ width: '100%', height: '100%' }} />
      </motion.div>

      <div className="relative z-[3] mx-auto w-full max-w-[var(--container-wide)] px-6 md:px-12">
        <Eyebrow num="05">Außerhalb dieser Site</Eyebrow>
        <motion.h2
          className="mt-8 font-display font-bold"
          style={{
            fontSize: 'clamp(36px, 5vw, 76px)',
            lineHeight: 1.05,
            letterSpacing: 'var(--tr-display)',
            color: 'var(--fg-default)',
            maxWidth: '920px',
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          Für die ganze Geschichte, geht's <ItalicAccent>woanders</ItalicAccent> weiter.
        </motion.h2>
        <motion.p
          className="mt-8 font-body"
          style={{
            fontSize: '17px',
            lineHeight: 1.7,
            color: 'var(--fg-muted)',
            maxWidth: '620px',
          }}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          braum.consulting ist die Praxis. Stefan-Brand und Engagement-Hintergrund
          haben ihren eigenen Ort.
        </motion.p>

        <ul
          className="mt-16 grid grid-cols-1 gap-6 md:mt-20 md:grid-cols-3 md:gap-6"
          style={{ listStyle: 'none', padding: 0 }}
        >
          {ELSEWHERE.map((e, i) => (
            <motion.li
              key={e.source}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: EASE }}
            >
              <a
                href={e.href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="magnetic"
                className="group flex h-full flex-col"
                style={{
                  padding: '28px 28px 32px',
                  background: 'rgba(15, 14, 12, 0.42)',
                  backdropFilter: 'blur(14px) saturate(140%)',
                  WebkitBackdropFilter: 'blur(14px) saturate(140%)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--r-md)',
                  transition: 'border-color 220ms, transform 220ms',
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className="inline-flex items-center gap-1.5 font-mono uppercase"
                    style={{
                      fontSize: '10px',
                      letterSpacing: '0.18em',
                      color: 'var(--brand)',
                      padding: '4px 10px',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--r-pill)',
                    }}
                  >
                    <ArrowUpRight size={10} strokeWidth={1.6} />
                    {e.source}
                  </span>
                </div>
                <h3
                  className="mt-8 font-display font-semibold"
                  style={{
                    fontSize: 'clamp(20px, 1.8vw, 24px)',
                    lineHeight: 1.25,
                    letterSpacing: 'var(--tr-heading)',
                    color: 'var(--fg-default)',
                  }}
                >
                  {e.title}
                </h3>
                <p
                  className="mt-3 font-body"
                  style={{
                    fontSize: '15px',
                    lineHeight: 1.6,
                    color: 'var(--fg-muted)',
                  }}
                >
                  {e.body}
                </p>
                <span
                  className="mt-auto inline-flex items-center gap-2 pt-8 font-body transition-colors duration-220 group-hover:text-[color:var(--accent)]"
                  style={{
                    fontSize: 'var(--t-body-sm)',
                    color: 'var(--fg-default)',
                  }}
                >
                  Öffnen
                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.6}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </span>
              </a>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
