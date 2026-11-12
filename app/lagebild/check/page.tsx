import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Wizard from '@/components/lagebild/Wizard'
import ItalicAccent from '@/components/ui/ItalicAccent'
import BigHero from '@/components/sections/BigHero'
import { LagebildVisualHero } from '@/components/ui/PageHeroVisuals'

/**
 * ── Launch-Flag (v1) ─────────────────────────────────────────────────
 * Der Wizard ist beim v1-Launch noch NICHT live. `false` blendet den
 * interaktiven Selbst-Check aus und zeigt stattdessen einen
 * „Coming soon"-Zustand mit Fallback-CTA → /kontakt.
 *
 * Zum Re-Aktivieren: einfach auf `true` setzen. Der gesamte Wizard-Code
 * bleibt erhalten und wird dann wieder gerendert. Beim Aktivieren auch
 * `robots`-Metadata unten wieder auf indexierbar prüfen.
 */
const WIZARD_LIVE = false

export const metadata: Metadata = {
  title: 'Lagebild-Check',
  description:
    'Strukturierter Selbst-Check für euer Digital-Vorhaben. 4 Minuten, 12 bis 15 Fragen, im Anschluss bekommt ihr per E-Mail ein persönliches Lagebild-Briefing mit Roadmap-Skizze und ersten Schritten.',
  // Solange der Funnel nicht live ist (WIZARD_LIVE = false): nicht indexieren.
  ...(WIZARD_LIVE ? {} : { robots: { index: false, follow: false } }),
}

/**
 * Lagebild-Check — Pfad A des Lagebild-Funnels.
 *
 * Struktur: BigHero (dramatic) + Wizard-Container + Footer-Note.
 */
export default function LagebildCheckPage() {
  return (
    <>
      <BigHero
        eyebrowNum="01"
        eyebrow={WIZARD_LIVE ? 'Lagebild · 4 Minuten' : 'Lagebild · bald verfügbar'}
        title={<>Lass uns <ItalicAccent>Lage</ItalicAccent> machen.</>}
        lede={
          WIZARD_LIVE
            ? 'Ein paar strukturierte Fragen, vier Minuten. Im Anschluss kommt per E-Mail ein persönliches Briefing: drei Reibungspunkte aus euren Antworten, eine Roadmap-Skizze, konkrete erste Schritte.'
            : 'Der digitale Lagebild-Check kommt bald: ein paar strukturierte Fragen, vier Minuten, danach ein persönliches Briefing per Mail. Bis dahin sprichst du am schnellsten direkt mit mir.'
        }
        facts={[
          { label: 'Dauer',    value: '4 Minuten' },
          { label: 'Fragen',   value: '12 – 15 (conditional)' },
          { label: 'Ergebnis', value: 'Briefing per E-Mail' },
        ]}
        visual={<LagebildVisualHero />}
      />

      <section
        className="relative w-screen overflow-hidden"
        style={{
          marginLeft: 'calc(-50vw + 50%)',
          background: 'var(--bg-base)',
          paddingTop: 32,
          paddingBottom: 128,
        }}
      >
        <div
          className="relative z-[2] mx-auto"
          style={{ maxWidth: 880, padding: '0 24px' }}
        >
          {WIZARD_LIVE ? <Wizard /> : <ComingSoon />}

          <footer
            className="font-body"
            style={{
              marginTop: 96,
              paddingTop: 32,
              borderTop: '1px solid rgba(242, 240, 235, 0.06)',
              fontSize: 13,
              lineHeight: 1.65,
              color: 'var(--fg-subtle)',
              maxWidth: 600,
            }}
          >
            <p style={{ margin: 0 }}>
              Eure Antworten gehen in mein Notion-CRM. Ich lese sie persönlich.
              Das Briefing wird automatisch erzeugt, dann von mir geprüft. Keine
              Weitergabe, kein Lead-Verkauf, keine Werbe-Tracker — nur
              cookieless Umami. Details in der{' '}
              <a
                href="/datenschutz"
                style={{ color: 'var(--brand)', textDecoration: 'underline', textDecorationThickness: 1 }}
              >
                Datenschutzerklärung
              </a>
              .
            </p>
          </footer>
        </div>
      </section>
    </>
  )
}

/* ── Coming-soon-Zustand (WIZARD_LIVE = false) ──────────────────────── */

function ComingSoon() {
  return (
    <div
      style={{
        padding: 48,
        borderRadius: 14,
        border: '1px solid rgba(220, 128, 68, 0.22)',
        background:
          'linear-gradient(145deg, rgba(220, 128, 68, 0.08) 0%, rgba(220, 128, 68, 0.015) 100%)',
        textAlign: 'center',
      }}
    >
      <span
        className="font-mono uppercase"
        style={{
          display: 'inline-block',
          fontSize: 11,
          letterSpacing: '0.20em',
          color: 'var(--brand)',
          background: 'rgba(220, 128, 68, 0.12)',
          padding: '6px 12px',
          borderRadius: 6,
          marginBottom: 24,
        }}
      >
        Bald verfügbar
      </span>
      <h2
        className="font-display"
        style={{
          fontSize: 28,
          fontWeight: 600,
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
          color: 'var(--fg-default)',
          margin: '0 0 16px',
        }}
      >
        Der digitale Lagebild-Check kommt bald.
      </h2>
      <p
        className="font-body"
        style={{
          fontSize: 16,
          lineHeight: 1.65,
          color: 'var(--fg-muted)',
          margin: '0 auto 32px',
          maxWidth: 460,
        }}
      >
        Wir bauen gerade den strukturierten Selbst-Check fertig. Willst du nicht
        warten? Nimm direkt Kontakt auf — dann klären wir deine Lage im Gespräch.
      </p>
      <Link
        href="/kontakt"
        className="font-mono uppercase"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          padding: '12px 24px',
          fontSize: 13,
          letterSpacing: '0.06em',
          color: '#FBF0EA',
          background: 'linear-gradient(135deg, #DC8044 0%, #C8622A 100%)',
          borderRadius: 6,
          textDecoration: 'none',
          fontWeight: 600,
          boxShadow: '0 4px 16px rgba(200, 98, 42, 0.20)',
        }}
      >
        Stattdessen Kontakt aufnehmen
        <ArrowRight size={14} strokeWidth={2.25} />
      </Link>
    </div>
  )
}
