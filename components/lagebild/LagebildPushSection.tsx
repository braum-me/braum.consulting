import Link from 'next/link'
import { ArrowRight, Compass, Calendar } from 'lucide-react'
import ItalicAccent from '@/components/ui/ItalicAccent'
import type { ServiceSlug } from '@/lib/services'

/**
 * Wiederverwendbarer Lagebild-Push.
 *
 * Drop-in-Section für Service-Detail-Pages, Case-Detail-Pages, etc.
 * Zeigt zwei Pfade-CTAs (Wizard + Direkt-Termin) plus optional einen
 * Säulen-Kontext, der im Wizard pre-selectable wäre (zukünftig via
 * Query-Param ?saeule=m365).
 *
 * Server-Component, keine 'use client'-Direktive nötig.
 */

export interface LagebildPushSectionProps {
  /** Optional: Service-Slug für Säulen-Kontext im Heading-Tilt. */
  saeule?: ServiceSlug
  /** Optional: eigene Headline. Default = generisches Lagebild-CTA. */
  headline?: React.ReactNode
  /** Optional: spezielle Body-Copy. */
  body?: React.ReactNode
}

const SAEULE_LABEL: Record<ServiceSlug, string> = {
  marke:     'Marke & Reichweite',
  m365:      'M365 & Cloud',
  ai:        'KI & Automatisierung',
  strategie: 'Strategie & Security',
}

export default function LagebildPushSection({
  saeule,
  headline,
  body,
}: LagebildPushSectionProps) {
  const defaultHeadline = saeule ? (
    <>Klare Lage für <ItalicAccent>{SAEULE_LABEL[saeule]}</ItalicAccent>?</>
  ) : (
    <>Erst <ItalicAccent>Lage</ItalicAccent>, dann Kurs.</>
  )

  const defaultBody = saeule
    ? `4 Minuten Selbst-Check, du bekommst ein persönliches Briefing per Mail — drei Reibungspunkte, Roadmap-Skizze, erste Schritte. Speziell für ${SAEULE_LABEL[saeule]}.`
    : '4 Minuten Selbst-Check, du bekommst ein persönliches Briefing per Mail — drei Reibungspunkte aus deinen Antworten, Roadmap-Skizze, erste Schritte.'

  const checkHref = saeule
    ? `/lagebild/check?saeule=${saeule}`
    : '/lagebild/check'

  return (
    <section
      className="relative w-screen overflow-hidden"
      style={{
        marginLeft: 'calc(-50vw + 50%)',
        marginTop: 'clamp(96px, 12vw, 160px)',
        marginBottom: 0,
        background: 'var(--bg-base)',
      }}
    >
      <div
        className="mx-auto"
        style={{ maxWidth: 1240, padding: '0 24px' }}
      >
        <div
          style={{
            position: 'relative',
            padding: 'clamp(40px, 6vw, 64px)',
            borderRadius: 14,
            background:
              'linear-gradient(145deg, rgba(220, 128, 68, 0.10) 0%, rgba(220, 128, 68, 0.02) 100%)',
            border: '1px solid rgba(220, 128, 68, 0.32)',
            boxShadow:
              '0 0 0 1px rgba(220, 128, 68, 0.10), 0 24px 48px -16px rgba(0, 0, 0, 0.55), 0 0 32px rgba(220, 128, 68, 0.12)',
            overflow: 'hidden',
          }}
        >
          {/* Glow-Akzent unten rechts */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: '-30%',
              right: '-15%',
              width: '60%',
              height: '120%',
              background:
                'radial-gradient(50% 50% at 50% 50%, rgba(220, 128, 68, 0.18) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ position: 'relative', zIndex: 2 }}>
            <p
              className="font-mono uppercase"
              style={{
                fontSize: 11,
                letterSpacing: '0.20em',
                color: 'var(--brand)',
                marginBottom: 24,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Compass size={12} strokeWidth={1.5} />
              Lagebild
            </p>

            <h2
              className="font-display"
              style={{
                fontSize: 'clamp(32px, 4.5vw, 52px)',
                fontWeight: 600,
                lineHeight: 1.05,
                letterSpacing: '-0.028em',
                color: 'var(--fg-default)',
                margin: '0 0 24px',
                maxWidth: 640,
              }}
            >
              {headline ?? defaultHeadline}
            </h2>

            <p
              className="font-body"
              style={{
                fontSize: 17,
                lineHeight: 1.6,
                color: 'var(--fg-muted)',
                maxWidth: 560,
                margin: '0 0 36px',
              }}
            >
              {body ?? defaultBody}
            </p>

            <div
              style={{
                display: 'flex',
                gap: 16,
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              <Link
                href={checkHref}
                className="group font-mono uppercase"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 28px',
                  fontSize: 13,
                  letterSpacing: '0.06em',
                  color: '#FBF0EA',
                  background: 'linear-gradient(135deg, #DC8044 0%, #C8622A 100%)',
                  borderRadius: 6,
                  textDecoration: 'none',
                  fontWeight: 600,
                  boxShadow: '0 4px 16px rgba(200, 98, 42, 0.24)',
                  transition: 'transform 220ms, box-shadow 220ms',
                }}
              >
                Selbst-Check starten
                <ArrowRight
                  size={14}
                  strokeWidth={2.25}
                  className="transition-transform duration-220 group-hover:translate-x-0.5"
                />
              </Link>

              <Link
                href="/termin"
                className="group font-mono uppercase"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 24px',
                  fontSize: 13,
                  letterSpacing: '0.06em',
                  color: 'var(--fg-default)',
                  background: 'transparent',
                  border: '1px solid rgba(242, 240, 235, 0.22)',
                  borderRadius: 6,
                  textDecoration: 'none',
                  fontWeight: 500,
                  transition: 'background 220ms, border-color 220ms',
                }}
              >
                <Calendar size={14} strokeWidth={1.75} />
                Direkt-Termin
              </Link>

              <span
                className="font-body"
                style={{
                  fontSize: 13,
                  color: 'var(--fg-subtle)',
                  marginLeft: 8,
                }}
              >
                ~4 Min · Briefing kommt automatisch
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
