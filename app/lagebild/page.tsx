import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Compass, FileText, Calendar, Crosshair, Route, PenLine } from 'lucide-react'
import TrackedLink from '@/components/layout/TrackedLink'
import ItalicAccent from '@/components/ui/ItalicAccent'
import AnimatedGradient from '@/components/ui/AnimatedGradient'
import Breadcrumbs from '@/components/ui/Breadcrumbs'

const SITE = 'https://braum.consulting'

/**
 * ── Launch-Flag (v1) ─────────────────────────────────────────────────
 * Beim v1-Launch sind beide Funnel-Pfade (Wizard-Check + Direkttermin)
 * noch NICHT live. `false` markiert die beiden PathCards dezent als
 * „Bald verfügbar" (Badge + CTA-Text). Die Hub-Seite selbst bleibt voll
 * sichtbar, einladend und indexierbar — sie dient als Teaser/Landing.
 *
 * Zum Re-Aktivieren: auf `true` setzen. Muss zu den Flags in
 * app/lagebild/check/page.tsx (WIZARD_LIVE) und app/termin/page.tsx
 * (BOOKING_LIVE) passen, damit Hub und Zielseiten konsistent sind.
 */
const PATHS_LIVE = false

export const metadata: Metadata = {
  title: 'Lagebild',
  description:
    'Das digitale Lagebild — strukturierte erste Einschätzung vor jedem Projekt. Selbst-Check und Direkt-Termin sind in Vorbereitung; bis dahin führt die direkte Anfrage zu Stefan Braum persönlich.',
  alternates: { canonical: '/lagebild' },
}

const HOWTO_JSONLD = {
  '@context': 'https://schema.org',
  '@type':    'HowTo',
  name:       'Lagebild starten',
  description:
    'Strukturierter Einstieg in eine Digital-Beratung mit Stefan Braum. Zwei Wege: Selbst-Check mit Briefing, oder Direkt-Termin.',
  totalTime:  'PT4M',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Pfad wählen',
      text: 'Selbst-Check mit Wizard und Briefing per Mail, oder direkter Termin.',
      url: `${SITE}/lagebild`,
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Selbst-Check (4 Min)',
      text: '12 bis 15 Fragen zu Identität, Anliegen, heutiger Lage, Säulen, Zielbild und Rahmen. Conditional Tiefe pro gewählter Säule.',
      url: `${SITE}/lagebild/check`,
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Briefing per E-Mail',
      text: 'Persönliches Lagebild mit drei Reibungspunkten, Roadmap-Skizze und konkreten ersten Schritten.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Termin buchen',
      text: '30 Minuten Erstgespräch, Mo–Do ab 17:00, Fr ab 15:00, Samstag und Sonntag ganztägig.',
      url: `${SITE}/termin`,
    },
  ],
}

const SERVICE_JSONLD = {
  '@context': 'https://schema.org',
  '@type':    'Service',
  name:       'Digitales Lagebild',
  description:
    'Vorgeschalteter Selbst-Check für Mittelstand und Industrie. Strukturierter Wizard mit individuellem Briefing — Roadmap-Skizze, Reibungspunkte, erste Schritte.',
  provider: {
    '@type': 'Person',
    name:    'Stefan Braum',
    url:     'https://braum.consulting/ueber',
  },
  areaServed: { '@type': 'Country', name: 'Deutschland' },
  serviceType: 'Discovery-Beratung',
  offers: {
    '@type': 'Offer',
    price:        '0',
    priceCurrency: 'EUR',
    description:  'Selbst-Check kostenfrei, kein Verkaufsdruck.',
  },
}

/**
 * /lagebild — Hub mit zwei Eingängen (Pfad A + Pfad B).
 *
 *   Pfad A → /lagebild/check     (Wizard + Briefing per Mail, dann Termin)
 *   Pfad B → /termin             (Direkt-Termin ohne Wizard)
 *
 * Indexed (war vorher noindex/Easter-Egg). Direkt-CTA-Hub ohne
 * Marketing-Drumherum.
 */
export default function LagebildHubPage() {
  return (
    <div
      className="relative w-screen overflow-hidden"
      style={{
        marginLeft: 'calc(-50vw + 50%)',
        background: 'var(--bg-base)',
        paddingTop: 120,
        paddingBottom: 128,
        minHeight: '100vh',
      }}
    >
      {/* HowTo/Service-Schema nur ausspielen, wenn der Funnel wirklich live
          ist — sonst verspricht das Markup einen Prozess (Wizard, Termin),
          den die Seite gar nicht anbietet. Solange PATHS_LIVE=false bleibt
          /lagebild eine „Kontakt zuerst"-Landingpage ohne Prozess-Schema. */}
      {PATHS_LIVE && (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_JSONLD) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICE_JSONLD) }}
          />
        </>
      )}
      <AnimatedGradient variant="hero" />

      <div className="relative z-[3] mx-auto" style={{ maxWidth: 960, padding: '0 24px' }}>
        {/* Breadcrumbs — Lagebild ist indexierbar, daher mit JSON-LD */}
        <Breadcrumbs withJsonLd className="mb-16" items={[{ label: 'Lagebild' }]} />
        {/* Hero-Block */}
        <header style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 80px' }}>
          <span
            className="inline-flex items-center gap-2 font-mono uppercase"
            style={{
              fontSize: 11,
              letterSpacing: '0.20em',
              color: 'var(--brand)',
              marginBottom: 32,
            }}
          >
            <Compass size={14} strokeWidth={1.5} />
            Lagebild
          </span>

          <h1
            className="font-display font-black"
            style={{
              fontSize: 'clamp(44px, 6.5vw, 88px)',
              lineHeight: 1,
              letterSpacing: 'var(--tr-display)',
              color: 'var(--fg-default)',
            }}
          >
            Erst <ItalicAccent>Lage</ItalicAccent>, dann Kurs.
          </h1>

          <p
            className="font-body"
            style={{
              fontSize: 18,
              lineHeight: 1.6,
              color: 'var(--fg-muted)',
              maxWidth: 560,
              margin: '32px auto 0',
            }}
          >
            {PATHS_LIVE
              ? 'Bevor irgendetwas gebaut wird, klären wir die Lage. Zwei Wege rein — der eine bereitet dich vor, der andere ist direkter. Beide enden bei mir persönlich.'
              : 'Bevor irgendetwas gebaut wird, klären wir die Lage. Der strukturierte Selbst-Check und der Direkt-Termin sind in Vorbereitung — bis dahin ist der direkte Draht zu mir der schnellste Weg rein.'}
          </p>

          {!PATHS_LIVE && (
            <div style={{ marginTop: 40, display: 'flex', justifyContent: 'center' }}>
              <TrackedLink
                href="/kontakt"
                event="cta_lagebild_kontakt"
                className="group inline-flex items-center transition-transform duration-220 hover:-translate-y-0.5"
                style={{
                  gap: 10,
                  fontSize: 15,
                  fontWeight: 600,
                  letterSpacing: '0.01em',
                  color: '#FBF0EA',
                  background: 'linear-gradient(135deg, #DC8044 0%, #C8622A 100%)',
                  padding: '15px 30px',
                  borderRadius: 6,
                  boxShadow: '0 12px 28px -10px rgba(200, 98, 42, 0.6)',
                }}
              >
                Digitales Lagebild anfragen
                <ArrowRight
                  size={16}
                  strokeWidth={2.25}
                  className="transition-transform duration-220 group-hover:translate-x-0.5"
                />
              </TrackedLink>
            </div>
          )}
        </header>

        {PATHS_LIVE ? (
          <>
            {/* Zwei Pfade als Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: 24,
                marginBottom: 96,
              }}
            >
              <PathCard
                num="01"
                icon={<FileText size={20} strokeWidth={1.5} />}
                label="Pfad A · Selbst-Check zuerst"
                title="Erst der Check, dann Briefing, dann Termin"
                features={[
                  { label: '4 Min',  text: '12–15 Fragen, conditional' },
                  { label: '~2 Min', text: 'Briefing per Mail' },
                  { label: '30 Min', text: 'Gespräch danach' },
                ]}
                description="Strukturierter Fragebogen, du bekommst ein persönliches Briefing mit Roadmap-Skizze per Mail, danach den Termin. Beste Vorbereitung für ein scharfes Erstgespräch."
                cta="Selbst-Check starten"
                href="/lagebild/check"
                featured
              />
              <PathCard
                num="02"
                icon={<Calendar size={20} strokeWidth={1.5} />}
                label="Pfad B · Termin zuerst"
                title="Direkt buchen, Vorbereitung kommt mit"
                features={[
                  { label: '30 Min', text: 'Erstgespräch' },
                  { label: 'Optional', text: 'Briefing zur Vorbereitung' },
                  { label: 'Slots',   text: 'Mo–Do ab 17, Fr ab 15, Sa+So ganztägig' },
                ]}
                description="Wer eilig ist oder schon weiß, was er fragen will: direkt einen Termin buchen. Mit der Terminbestätigung kommt der Briefing-Link als optionale Vorbereitung."
                cta="Termin auswählen"
                href="/termin"
              />
            </div>

            {/* Begründung — warum zwei Pfade */}
            <section style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
              <p
                className="font-mono uppercase"
                style={{
                  fontSize: 11,
                  letterSpacing: '0.20em',
                  color: 'var(--fg-muted)',
                  marginBottom: 20,
                }}
              >
                Warum zwei Wege
              </p>
              <p
                className="font-body"
                style={{
                  fontSize: 16,
                  lineHeight: 1.65,
                  color: 'var(--fg-muted)',
                }}
              >
                Manche Themen sind klar, andere sind unscharf. Wer scharfe Fragen hat,
                braucht keine 15 Multiple-Choice-Antworten. Wer noch sortiert, was
                eigentlich das Problem ist, fährt mit dem geführten Check besser — das Briefing
                sortiert mit. Beide enden im selben Gespräch.
              </p>
            </section>
          </>
        ) : (
          <>
            {/* !PATHS_LIVE: nicht „bald verfügbar", sondern was ein Lagebild
                konkret liefert. Der Wert steht im Mittelpunkt, der Weg rein
                ist die direkte Anfrage. */}
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <p
                className="font-mono uppercase"
                style={{ fontSize: 11, letterSpacing: '0.20em', color: 'var(--fg-muted)' }}
              >
                Was am Ende auf dem Tisch liegt
              </p>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 24,
                marginBottom: 80,
              }}
            >
              <DeliverableCard
                num="01"
                icon={<Crosshair size={20} strokeWidth={1.5} />}
                title="Drei echte Reibungspunkte"
                text="Benannt, nicht geraten: was wirklich blockiert — nicht das, was am lautesten ist. Schriftlich, mit Begründung."
              />
              <DeliverableCard
                num="02"
                icon={<Route size={20} strokeWidth={1.5} />}
                title="Eine Roadmap-Skizze"
                text="Priorisierte nächste Schritte mit grobem Aufwand pro Phase. Du weißt, was zuerst kommt und warum."
              />
              <DeliverableCard
                num="03"
                icon={<PenLine size={20} strokeWidth={1.5} />}
                title="Klarer erster Schritt"
                text="Eine Einschätzung in Du-Form, keine Folien-Wand. Ob ich der Richtige bin oder nicht — auch das steht drin."
              />
            </div>

            {/* Schon jetzt nutzbar: die zwei Mini-Checks, während der volle
                geführte Check noch in Vorbereitung ist. */}
            <div
              style={{
                maxWidth: 720,
                margin: '0 auto 80px',
                padding: 'clamp(20px, 3vw, 28px)',
                borderRadius: 14,
                background: 'rgba(242, 240, 235, 0.03)',
                border: '1px solid rgba(242, 240, 235, 0.10)',
              }}
            >
              <p className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.20em', color: 'var(--brand)', marginBottom: 16, textAlign: 'center' }}>
                Schon jetzt: zwei Selbst-Checks in zwei Minuten
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <TrackedLink
                  href="/werkzeuge/nis2-betroffenheit"
                  event="cta_werkzeug_nis2_lagebild"
                  className="group flex-1 transition-transform duration-220 hover:-translate-y-0.5"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                    padding: '14px 18px', borderRadius: 8,
                    background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
                  }}
                >
                  <span className="font-body" style={{ fontSize: 14, color: 'var(--fg-default)' }}>Bin ich von NIS2 betroffen?</span>
                  <ArrowRight size={15} strokeWidth={1.75} style={{ color: 'var(--brand)' }} className="transition-transform duration-220 group-hover:translate-x-0.5" />
                </TrackedLink>
                <TrackedLink
                  href="/werkzeuge/m365-migration-kosten"
                  event="cta_werkzeug_m365_lagebild"
                  className="group flex-1 transition-transform duration-220 hover:-translate-y-0.5"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                    padding: '14px 18px', borderRadius: 8,
                    background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
                  }}
                >
                  <span className="font-body" style={{ fontSize: 14, color: 'var(--fg-default)' }}>Was treibt meine M365-Migration?</span>
                  <ArrowRight size={15} strokeWidth={1.75} style={{ color: 'var(--brand)' }} className="transition-transform duration-220 group-hover:translate-x-0.5" />
                </TrackedLink>
              </div>
            </div>

            <section style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
              <p
                className="font-body"
                style={{ fontSize: 16, lineHeight: 1.65, color: 'var(--fg-muted)' }}
              >
                Der vollständige geführte Check und der Direkt-Termin sind in Vorbereitung.
                Bis dahin läuft das Lagebild über ein kurzes Erstgespräch — schreib mir
                in zwei, drei Sätzen, worum es geht, und wir finden einen Slot.
              </p>
              <div style={{ marginTop: 32, display: 'flex', justifyContent: 'center' }}>
                <TrackedLink
                  href="/kontakt"
                  event="cta_lagebild_kontakt_mid"
                  className="group inline-flex items-center font-mono uppercase transition-transform duration-220 hover:-translate-y-0.5"
                  style={{
                    gap: 10,
                    fontSize: 12,
                    letterSpacing: '0.06em',
                    color: 'var(--fg-default)',
                    background: 'rgba(242, 240, 235, 0.06)',
                    border: '1px solid rgba(242, 240, 235, 0.22)',
                    padding: '12px 22px',
                    borderRadius: 6,
                  }}
                >
                  Situation schildern
                  <ArrowRight size={14} strokeWidth={1.75} className="transition-transform duration-220 group-hover:translate-x-0.5" />
                </TrackedLink>
              </div>
            </section>
          </>
        )}

        {/* Direkt-Mail-Notfall */}
        <footer
          style={{
            marginTop: 96,
            paddingTop: 32,
            borderTop: '1px solid rgba(242, 240, 235, 0.06)',
            textAlign: 'center',
            fontSize: 13,
            color: 'var(--fg-subtle)',
          }}
        >
          <p className="font-body" style={{ margin: 0 }}>
            Wenn dir beides nicht zusagt:{' '}
            <a
              href="mailto:info@braum.consulting"
              style={{ color: 'var(--brand)', textDecoration: 'underline', textDecorationThickness: 1 }}
            >
              info@braum.consulting
            </a>{' '}
            geht auch.
          </p>
        </footer>
      </div>
    </div>
  )
}

/* ── PathCard ───────────────────────────────────────────────────────── */

function PathCard({
  num,
  icon,
  label,
  title,
  features,
  description,
  cta,
  href,
  featured = false,
  soon = false,
}: {
  num: string
  icon: React.ReactNode
  label: string
  title: string
  features: Array<{ label: string; text: string }>
  description: string
  cta: string
  href: string
  featured?: boolean
  /** Pfad noch nicht live → dezentes „Bald verfügbar"-Badge, kein Link */
  soon?: boolean
}) {
  const cardStyle: React.CSSProperties = {
    padding: 32,
    borderRadius: 14,
    background: featured
      ? 'linear-gradient(145deg, rgba(220, 128, 68, 0.10) 0%, rgba(220, 128, 68, 0.02) 100%)'
      : 'rgba(242, 240, 235, 0.03)',
    border: `1px solid ${featured ? 'rgba(220, 128, 68, 0.32)' : 'rgba(242, 240, 235, 0.10)'}`,
    boxShadow: featured
      ? '0 0 0 1px rgba(220, 128, 68, 0.12), 0 24px 48px -16px rgba(0, 0, 0, 0.55), 0 0 32px rgba(220, 128, 68, 0.12)'
      : '0 16px 32px -8px rgba(0, 0, 0, 0.32)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
    opacity: soon ? 0.92 : 1,
  }

  const inner = (
    <>
      {soon ? (
        <span
          className="font-mono uppercase"
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            fontSize: 10,
            letterSpacing: '0.18em',
            color: 'var(--brand)',
            background: 'rgba(220, 128, 68, 0.12)',
            padding: '4px 8px',
            borderRadius: 4,
          }}
        >
          Bald verfügbar
        </span>
      ) : (
        featured && (
          <span
            className="font-mono uppercase"
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              fontSize: 10,
              letterSpacing: '0.18em',
              color: 'var(--brand)',
              background: 'rgba(220, 128, 68, 0.12)',
              padding: '4px 8px',
              borderRadius: 4,
            }}
          >
            Empfohlen
          </span>
        )
      )}

      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 44,
          height: 44,
          borderRadius: 8,
          background: 'rgba(220, 128, 68, 0.10)',
          color: 'var(--brand)',
          marginBottom: 20,
        }}
      >
        {icon}
      </span>

      <p
        className="font-mono uppercase"
        style={{
          fontSize: 11,
          letterSpacing: '0.20em',
          color: 'var(--brand)',
          marginBottom: 8,
        }}
      >
        {num} · {label}
      </p>

      <h2
        className="font-display"
        style={{
          fontSize: 24,
          fontWeight: 600,
          lineHeight: 1.15,
          letterSpacing: '-0.022em',
          color: 'var(--fg-default)',
          margin: '0 0 16px',
        }}
      >
        {title}
      </h2>

      <p
        className="font-body"
        style={{
          fontSize: 14.5,
          lineHeight: 1.6,
          color: 'var(--fg-muted)',
          margin: '0 0 24px',
        }}
      >
        {description}
      </p>

      <ul
        style={{
          margin: '0 0 28px',
          padding: '20px 0 0',
          borderTop: '1px solid rgba(242, 240, 235, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          listStyle: 'none',
        }}
      >
        {features.map((f, i) => (
          <li
            key={i}
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'baseline',
              fontSize: 13,
            }}
          >
            <span
              className="font-mono"
              style={{
                color: 'var(--brand)',
                minWidth: 60,
                fontSize: 11,
                letterSpacing: '0.04em',
              }}
            >
              {f.label}
            </span>
            <span className="font-body" style={{ color: 'var(--fg-muted)' }}>
              {f.text}
            </span>
          </li>
        ))}
      </ul>

      <span
        className="font-mono uppercase"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          fontSize: 12,
          letterSpacing: '0.06em',
          color: soon
            ? 'var(--fg-muted)'
            : featured
              ? '#FBF0EA'
              : 'var(--fg-default)',
          background: soon
            ? 'rgba(242, 240, 235, 0.04)'
            : featured
              ? 'linear-gradient(135deg, #DC8044 0%, #C8622A 100%)'
              : 'rgba(242, 240, 235, 0.06)',
          border: soon
            ? '1px dashed rgba(242, 240, 235, 0.20)'
            : featured
              ? 'none'
              : '1px solid rgba(242, 240, 235, 0.22)',
          padding: '12px 20px',
          borderRadius: 6,
          alignSelf: 'flex-start',
          fontWeight: featured && !soon ? 600 : 500,
          marginTop: 'auto',
        }}
      >
        {cta}
        {!soon && (
          <ArrowRight
            size={14}
            strokeWidth={featured ? 2.25 : 1.75}
            className="transition-transform duration-220 group-hover:translate-x-0.5"
          />
        )}
      </span>
    </>
  )

  // Bald-verfügbar: nicht klickbar (kein Link), nur Teaser-Card.
  if (soon) {
    return (
      <div
        aria-disabled="true"
        style={{ ...cardStyle, cursor: 'default' }}
      >
        {inner}
      </div>
    )
  }

  return (
    <Link
      href={href}
      className="group block transition-transform duration-300 hover:-translate-y-1"
      style={cardStyle}
    >
      {inner}
    </Link>
  )
}

/* ── DeliverableCard ────────────────────────────────────────────────────
   Statische Wert-Karte für den !PATHS_LIVE-Zustand: zeigt, was ein
   Lagebild liefert (nicht klickbar, kein „bald verfügbar"). */

function DeliverableCard({
  num,
  icon,
  title,
  text,
}: {
  num: string
  icon: React.ReactNode
  title: string
  text: string
}) {
  return (
    <div
      style={{
        padding: 28,
        borderRadius: 14,
        background: 'rgba(242, 240, 235, 0.03)',
        border: '1px solid rgba(242, 240, 235, 0.10)',
        boxShadow: '0 16px 32px -8px rgba(0, 0, 0, 0.32)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 44,
          height: 44,
          borderRadius: 8,
          background: 'rgba(220, 128, 68, 0.10)',
          color: 'var(--brand)',
          marginBottom: 20,
        }}
      >
        {icon}
      </span>

      <p
        className="font-mono uppercase"
        style={{ fontSize: 11, letterSpacing: '0.20em', color: 'var(--brand)', marginBottom: 10 }}
      >
        {num}
      </p>

      <h2
        className="font-display"
        style={{
          fontSize: 20,
          fontWeight: 600,
          lineHeight: 1.2,
          letterSpacing: '-0.022em',
          color: 'var(--fg-default)',
          margin: '0 0 12px',
        }}
      >
        {title}
      </h2>

      <p
        className="font-body"
        style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--fg-muted)', margin: 0 }}
      >
        {text}
      </p>
    </div>
  )
}
