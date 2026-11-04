import type { Metadata } from 'next'
import Link from 'next/link'
import { Mail, MapPin, Clock } from 'lucide-react'
import Section from '@/components/ui/Section'
import Eyebrow from '@/components/ui/Eyebrow'
import ItalicAccent from '@/components/ui/ItalicAccent'
import AccentGlow from '@/components/ui/AccentGlow'
import ObfuscatedEmail from '@/components/ui/ObfuscatedEmail'
import BigHero from '@/components/sections/BigHero'
import { KontaktVisual } from '@/components/ui/PageHeroVisuals'
import FooterTimeGreeting from '@/components/ui/FooterTimeGreeting'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import ContactForm from './ContactForm'

export const metadata: Metadata = {
  alternates: { canonical: '/kontakt' },
  title: 'Kontakt',
  description:
    'Erstgespräch in 30 Minuten. Stefan Braum direkt, ohne Vertriebsfilter, ohne Account-Theater.',
}

/** Tool-Kürzel (aus ?tool=…) → Formular-Anliegen + einleitender Satz. */
const TOOL_PREFILL: Record<string, { subject: string; lead: string }> = {
  nis2:      { subject: 'strategie', lead: 'Ich habe den NIS2-Betroffenheits-Check gemacht' },
  iso:       { subject: 'strategie', lead: 'Ich habe den ISO-27001-Readiness-Check gemacht' },
  m365:      { subject: 'm365',      lead: 'Ich habe den M365-Migrations-Check gemacht' },
  ki:        { subject: 'ai',        lead: 'Ich habe den KI-Readiness-Check gemacht' },
  workspace: { subject: 'm365',      lead: 'Ich habe den Microsoft-365-vs-Google-Workspace-Check gemacht' },
  website:   { subject: 'marke',     lead: 'Ich habe den Website-Check gemacht' },
  roi:       { subject: 'ai',        lead: 'Ich habe den Automatisierungs-ROI-Rechner genutzt' },
  'ki-dsgvo': { subject: 'ai',       lead: 'Ich habe den KI-DSGVO-Schnellcheck gemacht' },
  phishing:  { subject: 'strategie', lead: 'Wir haben das Phishing-Quiz gemacht' },
}

export default async function KontaktPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const sp = await searchParams
  const tool = typeof sp.tool === 'string' ? sp.tool : undefined
  const ergebnis = typeof sp.ergebnis === 'string' ? sp.ergebnis : undefined
  const map = tool ? TOOL_PREFILL[tool] : undefined
  const prefill = map
    ? {
        subject: map.subject,
        message: `${map.lead}${ergebnis ? `, Ergebnis: ${ergebnis}` : ''}. Das würde ich gern mit dir einordnen.\n\n`,
      }
    : undefined

  return (
    <>
      <BigHero
        eyebrowNum="04"
        eyebrow="Kontakt"
        title={<>Reden wir. <ItalicAccent>Ohne</ItalicAccent> Folien.</>}
        lede="Dreißig Minuten Erstgespräch. Du beschreibst die Situation, ich gebe eine direkte Einschätzung, ob ich der Richtige bin oder nicht. Keine Vertriebsschleife, kein Account-Theater."
        facts={[
          { label: 'Format',      value: '30 Min · Telefon/Video' },
          { label: 'Antwortzeit', value: 'In 48 h, meist schneller' },
          { label: 'Direkter Draht', value: 'Stefan persönlich' },
        ]}
        visual={<KontaktVisual />}
      />

      <Section
        className="pb-32 pt-12 md:pb-44 md:pt-16"
        background={<AccentGlow position="spread" intensity="medium" />}
      >
        <Breadcrumbs
          withJsonLd
          className="mb-12"
          items={[{ label: 'Kontakt' }]}
        />
        <div className="grid grid-cols-1 gap-14 md:grid-cols-12 md:gap-20">
          <div className="md:col-span-7">
            <ContactForm prefill={prefill} />
          </div>

          <aside className="md:col-span-5">
            <div
              className="space-y-10 p-8 md:p-10"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--r-md)',
              }}
            >
              {/* Live-Status: Frankfurt-TZ + Erreichbarkeits-Hinweis */}
              <div
                className="rounded-lg p-5"
                style={{
                  background: 'rgba(220, 128, 68, 0.06)',
                  border: '1px solid rgba(220, 128, 68, 0.18)',
                }}
              >
                <FooterTimeGreeting />
              </div>

              <div>
                <Eyebrow>Direkter Draht</Eyebrow>
                <div className="mt-6 space-y-5">
                  <span className="group flex items-start gap-4 transition-colors duration-220 hover:text-[color:var(--accent)]">
                    <Mail
                      size={18}
                      strokeWidth={1.5}
                      className="mt-1 shrink-0"
                      style={{ color: 'var(--brand)' }}
                    />
                    <div>
                      <ObfuscatedEmail
                        showAddress
                        className="font-body font-medium transition-colors duration-220 hover:text-[color:var(--accent)]"
                        style={{
                          fontSize: 'var(--t-body)',
                          color: 'inherit',
                        }}
                      />
                      <p
                        className="mt-1 font-mono uppercase"
                        style={{
                          fontSize: 'var(--t-micro)',
                          letterSpacing: 'var(--tr-eyebrow)',
                          color: 'var(--fg-subtle)',
                        }}
                      >
                        Antwort in 48 Stunden
                      </p>
                    </div>
                  </span>

                  <div className="flex items-start gap-4">
                    <MapPin
                      size={18}
                      strokeWidth={1.5}
                      className="mt-1 shrink-0"
                      style={{ color: 'var(--brand)' }}
                    />
                    <div>
                      <p
                        className="font-body font-medium"
                        style={{
                          fontSize: 'var(--t-body)',
                          color: 'var(--fg-default)',
                        }}
                      >
                        Main-Kinzig-Kreis · Hessen
                      </p>
                      <p
                        className="mt-1 font-mono uppercase"
                        style={{
                          fontSize: 'var(--t-micro)',
                          letterSpacing: 'var(--tr-eyebrow)',
                          color: 'var(--fg-subtle)',
                        }}
                      >
                        Engagements im DACH-Raum
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Clock
                      size={18}
                      strokeWidth={1.5}
                      className="mt-1 shrink-0"
                      style={{ color: 'var(--brand)' }}
                    />
                    <div>
                      <p
                        className="font-body font-medium"
                        style={{
                          fontSize: 'var(--t-body)',
                          color: 'var(--fg-default)',
                        }}
                      >
                        Nach Vereinbarung
                      </p>
                      <p
                        className="mt-1 font-mono uppercase"
                        style={{
                          fontSize: 'var(--t-micro)',
                          letterSpacing: 'var(--tr-eyebrow)',
                          color: 'var(--fg-subtle)',
                        }}
                      >
                        Antwort in 48 h, Termin nach Abstimmung
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="border-t pt-8"
                style={{ borderColor: 'var(--border-subtle)' }}
              >
                <Eyebrow>So läuft's ab</Eyebrow>
                <ol className="mt-6 space-y-5">
                  {[
                    'Du schickst die Nachricht oder eine E-Mail.',
                    'Ich antworte innerhalb von 48 Stunden, meist deutlich schneller.',
                    'Wir vereinbaren 30 Minuten am Telefon oder per Video.',
                    'Falls es passt: NDA, dann Discovery-Phase.',
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span
                        className="font-mono"
                        style={{
                          fontSize: 'var(--t-micro)',
                          color: 'var(--brand)',
                          letterSpacing: '0.04em',
                          minWidth: '24px',
                        }}
                      >
                        0{i + 1}
                      </span>
                      <span
                        className="font-body"
                        style={{
                          fontSize: 'var(--t-body-sm)',
                          color: 'var(--fg-muted)',
                          lineHeight: 'var(--lh-body)',
                        }}
                      >
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              <div
                className="border-t pt-8"
                style={{ borderColor: 'var(--border-subtle)' }}
              >
                <p
                  className="font-mono uppercase"
                  style={{
                    fontSize: 'var(--t-micro)',
                    letterSpacing: 'var(--tr-eyebrow)',
                    color: 'var(--fg-subtle)',
                  }}
                >
                  Lieber zuerst LinkedIn?
                </p>
                <Link
                  href="https://www.linkedin.com/in/stefanbraum"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center font-body transition-colors duration-220 hover:text-[color:var(--accent)]"
                  style={{
                    fontSize: 'var(--t-body-sm)',
                    color: 'var(--fg-default)',
                  }}
                >
                  /in/stefanbraum
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </Section>
    </>
  )
}
