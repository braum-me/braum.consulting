import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import portraitShirt from '@/public/assets/portrait/stefan-shirt.webp'
import Section from '@/components/ui/Section'
import Eyebrow from '@/components/ui/Eyebrow'
import ItalicAccent from '@/components/ui/ItalicAccent'
import AccentGlow from '@/components/ui/AccentGlow'
import Reveal, { RevealGroup, RevealItem } from '@/components/ui/Reveal'
import CountUp from '@/components/ui/CountUp'

const STATS: Array<{ to: number; suffix: string; label: string }> = [
  { to: 12, suffix: '+', label: 'Jahre IT-Praxis · Industrie-Mittelstand' },
  { to: 30, suffix: '+', label: 'Dokumentierte Projekte' },
  { to: 20, suffix: '+', label: 'Mandate seit 2023' },
]

export default function OperatorStory() {
  return (
    <Section
      className="relative py-28 md:py-36"
      background={<AccentGlow position="top-right" intensity="medium" />}
    >
      <div className="grid grid-cols-1 gap-14 md:grid-cols-12 md:gap-16">

        {/* Linke Spalte: Portrait + Stats darunter, beide sticky */}
        <div className="md:col-span-5 md:sticky md:top-32 md:self-start">
          <Reveal y={24} duration={0.8}>
            <div
              data-cursor="magnetic"
              className="relative overflow-hidden"
              style={{
                borderRadius: 'var(--r-lg)',
                aspectRatio: '4 / 5',
                border: '1px solid var(--border-brand)',
                boxShadow: 'var(--sh-glow)',
              }}
            >
              <Image
                src={portraitShirt}
                alt="Stefan Braum, Operator und IT-Lead im Automotive-Mittelstand"
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
                priority={false}
                loading="lazy"
                placeholder="blur"
                style={{ objectPosition: '50% 22%' }}
              />
            </div>
          </Reveal>

          {/* Stats direkt unter dem Bild */}
          <RevealGroup
            className="mt-6 overflow-hidden"
            style={{
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--r-md)',
              background: 'var(--bg-elevated)',
            }}
            staggerDelay={0.1}
            staggerInitial={0.15}
          >
            {STATS.map((s, i) => (
              <RevealItem key={s.label}>
                <div
                  className="flex items-baseline gap-5 px-5 py-5"
                  style={{
                    borderTop: i > 0 ? '1px solid var(--border-subtle)' : 'none',
                  }}
                >
                  <CountUp
                    to={s.to}
                    suffix={s.suffix}
                    className="font-display font-bold shrink-0"
                    style={{
                      fontSize: 'clamp(28px, 2.6vw, 36px)',
                      lineHeight: 1,
                      letterSpacing: 'var(--tr-display)',
                      color: 'var(--accent)',
                      minWidth: '64px',
                    }}
                  />
                  <p
                    className="font-mono uppercase"
                    style={{
                      fontSize: 'var(--t-micro)',
                      letterSpacing: 'var(--tr-eyebrow)',
                      color: 'var(--fg-muted)',
                      lineHeight: 1.4,
                    }}
                  >
                    {s.label}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        {/* Rechte Spalte: kompletter Text-Block */}
        <div className="md:col-span-7">
          <Reveal>
            <Eyebrow num="07">Über Stefan</Eyebrow>
          </Reveal>

          <Reveal delay={0.1} y={20}>
            <h2
              className="mt-6 font-display font-bold"
              style={{
                fontSize: 'clamp(36px, 4.6vw, 64px)',
                lineHeight: 'var(--lh-display)',
                letterSpacing: 'var(--tr-display)',
                color: 'var(--fg-default)',
              }}
            >
              Nicht Berater. <ItalicAccent>Operator</ItalicAccent>.<br />Digitaler <ItalicAccent>Lotse</ItalicAccent>.
            </h2>
          </Reveal>

          <RevealGroup
            className="mt-10 space-y-7 font-body"
            style={{
              fontSize: '18px',
              lineHeight: 1.55,
              color: 'var(--fg-default)',
              maxWidth: '620px',
            }}
            staggerDelay={0.12}
            staggerInitial={0.25}
          >
            <RevealItem>
              <p>
                Hauptberuflich verantworte ich IT Applications und
                stellvertretend die globale IT/SAP-Organisation bei einem
                Automotive-Tier-2 im DACH-Raum. Genau die Themen, die in
                deinem Haus auch auf dem Tisch landen: M365 in der Breite,
                KI im Alltag, Security im Hintergrund, Architektur unter
                Druck. Themen, die unter Industrie-Last bestehen müssen. Das
                ist <ItalicAccent>Substanz</ItalicAccent>.
              </p>
            </RevealItem>

            <RevealItem>
              <p style={{ color: 'var(--fg-muted)' }}>
                Diese operative Praxis läuft beim Engagement mit dir weiter.
                Du arbeitest mit jemandem, der die Industrie-Realität gerade
                kurz aus der Hand legt, um sich auf dein Vorhaben zu
                konzentrieren. Antworten aus laufenden Programmen, nicht
                aus Folien.
              </p>
            </RevealItem>

            <RevealItem>
              <p style={{ color: 'var(--fg-muted)' }}>
                Als Lotse bringe ich Richtung in den kritischen Anfang.
                Orientierung, Priorisierung, erste produktive Strukturen,
                sauberer Handover. Ziel ist nicht, mich dauerhaft zu
                brauchen. Ziel ist, dass dein Team danach sicher selbst
                weiterarbeitet.{' '}
                <ItalicAccent>Architekt, Führungskraft, Practitioner.</ItalicAccent>{' '}
                In dieser Reihenfolge.
              </p>
            </RevealItem>
          </RevealGroup>

          <Reveal delay={0.4} className="mt-12">
            <Link
              data-cursor="magnetic"
              href="https://www.linkedin.com/in/stefanbraum"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 font-body font-medium transition-colors duration-220 hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
              style={{
                fontSize: '14px',
                color: 'var(--fg-default)',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--r-sm)',
              }}
            >
              Auf LinkedIn ansehen
              <ArrowUpRight size={14} strokeWidth={1.5} />
            </Link>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}
