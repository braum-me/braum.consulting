'use client'

import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import Link from 'next/link'
import { ArrowRight, RotateCcw, MailWarning, ShieldCheck, ShieldAlert } from 'lucide-react'
import TrackedLink from '@/components/layout/TrackedLink'
import { trackEvent } from '@/lib/analytics'
import { EASE, questionCard, resultCard, primaryCtaStyle } from './styles'

/* ── Beispiel-Mails (fiktiv, typische Muster) ──────────────────────────── */

interface QuizMail {
  from: string
  subject: string
  body: string
  /** Sichtbares Link-Ziel (Lehrmittel: „wohin führt der Link wirklich?"). */
  linkTarget?: string
  isPhishing: boolean
  /** Erklärung nach der Antwort — was die Erkennungszeichen waren. */
  explain: string
}

const MAILS: QuizMail[] = [
  {
    from: 'M365 Support <support@microsoft-verify-login.com>',
    subject: 'Ihr Passwort läuft in 24 Stunden ab',
    body: 'Sehr geehrter Nutzer, Ihr Microsoft-365-Passwort läuft in 24 Stunden ab. Bestätigen Sie jetzt Ihre Identität, um eine Kontosperrung zu vermeiden.',
    linkTarget: 'microsoft-verify-login.com/auth',
    isPhishing: true,
    explain: 'Phishing. Die Absender-Domain ist nicht microsoft.com, sondern eine Fantasie-Domain — plus künstliche Dringlichkeit („24 Stunden", „Kontosperrung"). Microsoft fordert nie per Mail-Link zur Passwort-Bestätigung auf.',
  },
  {
    from: 'IT-Abteilung <it@deine-firma.de>',
    subject: 'Wartungsfenster am Samstag, 02:00–06:00 Uhr',
    body: 'Hallo zusammen, am Samstag werden zwischen 02:00 und 06:00 Uhr die Server aktualisiert. E-Mail und Telefonie können kurz ausfallen. Ihr müsst nichts tun. Fragen wie immer an die IT.',
    isPhishing: false,
    explain: 'Seriös. Interne Domain, kein Link, keine Datenabfrage, keine Dringlichkeit — nur eine Information mit bekanntem Rückkanal. Genau so sehen legitime IT-Mails aus.',
  },
  {
    from: 'Stefan Brandt <s.brandt.gf@gmail.com>',
    subject: 'Bist du gerade am Platz?',
    body: 'Ich sitze in einem Termin und kann nicht telefonieren. Ich brauche dringend deine Hilfe bei einer vertraulichen Besorgung — bitte kurz per Mail antworten, dann erkläre ich es. Es muss heute noch passieren. Danke, Stefan.',
    isPhishing: true,
    explain: 'Phishing (CEO-Fraud). Der „Geschäftsführer" schreibt plötzlich von einer Gmail-Adresse, baut Zeitdruck auf und verlangt Vertraulichkeit — die klassische Masche vor der Gutscheinkarten- oder Überweisungs-Bitte. Im Zweifel: anrufen, über die bekannte Nummer.',
  },
  {
    from: 'Paket-Service <noreply@zustellung-paket-info.net>',
    subject: 'Ihre Sendung wartet: Zollgebühr von 1,99 € offen',
    body: 'Ihre Sendung konnte nicht zugestellt werden, da eine Zollgebühr von 1,99 € aussteht. Begleichen Sie den Betrag innerhalb von 48 Stunden, sonst geht die Sendung zurück.',
    linkTarget: 'zustellung-paket-info.net/zahlung',
    isPhishing: true,
    explain: 'Phishing. Kleinbeträge senken die Hemmschwelle — es geht nicht um die 1,99 €, sondern um deine Kartendaten. Paketdienste kassieren Zoll nicht über Mail-Links; echte Sendungsverfolgung läuft über die App oder die offizielle Website.',
  },
  {
    from: 'Anna Weber <anna.weber@mueller-partner.de>',
    subject: 'Terminbestätigung: Projektbesprechung Donnerstag 14 Uhr',
    body: 'Hallo, wie eben telefonisch besprochen die Bestätigung für Donnerstag, 14 Uhr. Den Teams-Link habe ich in die Kalendereinladung gepackt. Bis dann, Anna Weber.',
    isPhishing: false,
    explain: 'Seriös. Erwarteter Kontext („wie eben telefonisch besprochen"), bekannte Absenderin und Domain, kein Druck, keine Datenabfrage. Kontext ist das stärkste Echtheits-Signal: Die Mail passt zu etwas, das wirklich passiert ist.',
  },
  {
    from: 'Postmaster <postmaster@mail-quota-service.com>',
    subject: 'Ihre Mailbox ist zu 98 % voll',
    body: 'Ihre Mailbox hat das Speicherlimit fast erreicht. Um den Empfang weiterer E-Mails sicherzustellen, geben Sie jetzt Speicher frei. Andernfalls werden eingehende Nachrichten abgewiesen.',
    linkTarget: 'mail-quota-service.com/cleanup',
    isPhishing: true,
    explain: 'Phishing. Speicher-Warnungen kommen vom eigenen Mail-System (eigene Domain), nicht von einem externen „Quota-Service". Der Link führt auf eine Login-Kopie, die das Passwort abgreift.',
  },
  {
    from: 'Rechnungsstelle <rechnung@buero-bedarf-schmidt-gmbh.de>',
    subject: 'DRINGEND: Offene Rechnung 4711 — letzte Mahnung vor Inkasso',
    body: 'Sehr geehrte Damen und Herren, trotz mehrfacher Aufforderung ist die beigefügte Rechnung über 2.470,00 € nicht beglichen. Öffnen Sie die angehängte Datei „Mahnung_4711.zip" für Details. Bei Nichtzahlung übergeben wir an unser Inkassobüro.',
    linkTarget: 'Anhang: Mahnung_4711.zip',
    isPhishing: true,
    explain: 'Phishing. Unbekannter Lieferant, Drohkulisse („Inkasso") und vor allem: ein ZIP-Anhang als „Mahnung" — der Klassiker für Schadsoftware. Echte Mahnungen kommen als PDF von bekannten Geschäftspartnern, und im Zweifel klärt ein Anruf in der Buchhaltung.',
  },
]

function bandFor(score: number): { name: string; note: string } {
  if (score === MAILS.length) return { name: 'Radar sitzt', note: 'Alle erkannt — dein Phishing-Radar funktioniert. Die Kunst ist, diese Aufmerksamkeit auch im hektischen Alltag zu halten: Genau dann schlagen die echten Angriffe zu.' }
  if (score >= MAILS.length - 2) return { name: 'Solide', note: 'Die meisten Muster erkennst du. Die übersehenen Beispiele zeigen, wo moderne Angriffe ansetzen — lies die Erklärungen nochmal, genau diese Maschen kommen im Alltag.' }
  return { name: 'Trainingsbedarf', note: 'Kein Grund zur Scham — moderne Phishing-Mails sind gut gemacht, und KI macht sie sprachlich fehlerfrei. Aber genau deshalb lohnt strukturierte Awareness im Team: regelmäßig, realistisch, ohne Bloßstellung.' }
}

/* ── Komponente ────────────────────────────────────────────────────────── */

export default function PhishingQuiz() {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<boolean | null>(null) // User-Antwort: ist Phishing?
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const mail = MAILS[index]
  const correct = picked !== null && picked === mail.isPhishing

  function answer(guess: boolean) {
    if (picked !== null) return
    setPicked(guess)
    if (guess === mail.isPhishing) setScore(s => s + 1)
  }

  function next() {
    if (index + 1 >= MAILS.length) {
      const final = score
      trackEvent('werkzeug_phishing_result', { score: final, total: MAILS.length })
      setDone(true)
    } else {
      setIndex(i => i + 1)
      setPicked(null)
    }
  }

  function reset() {
    setIndex(0); setPicked(null); setScore(0); setDone(false)
  }

  if (done) {
    const band = bandFor(score)
    return (
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        style={resultCard}
        aria-live="polite"
      >
        <div className="flex items-center gap-3" style={{ marginBottom: 18 }}>
          <MailWarning size={22} strokeWidth={1.6} style={{ color: 'var(--brand)' }} />
          <span className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.18em', color: 'var(--brand)' }}>
            Ergebnis · {band.name}
          </span>
        </div>
        <h3 className="font-display" style={{ fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.1, letterSpacing: '-0.02em', color: 'var(--fg-default)', margin: 0 }}>
          {score} von {MAILS.length} erkannt.
        </h3>
        <p className="font-body" style={{ marginTop: 14, fontSize: 15.5, lineHeight: 1.65, color: 'var(--fg-muted)' }}>
          {band.note}
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center" style={{ marginTop: 30 }}>
          <TrackedLink
            href={`/kontakt?tool=phishing&ergebnis=${encodeURIComponent(`${score}/${MAILS.length} erkannt`)}`}
            event="cta_lagebild_werkzeug_phishing"
            className="group transition-transform duration-220 hover:-translate-y-0.5"
            style={primaryCtaStyle}
          >
            Awareness im Team aufsetzen
            <ArrowRight size={16} strokeWidth={2.25} className="transition-transform duration-220 group-hover:translate-x-0.5" />
          </TrackedLink>
          <Link href="/lexikon/phishing" className="font-body" style={{ fontSize: 14, color: 'var(--brand)', textDecoration: 'underline', textDecorationThickness: 1, textUnderlineOffset: 3 }}>
            Phishing im Lexikon
          </Link>
        </div>

        <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid rgba(242, 240, 235, 0.08)' }}>
          <p className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.18em', color: 'var(--fg-subtle)', marginBottom: 12 }}>
            Passt dazu
          </p>
          <div className="flex flex-wrap" style={{ gap: 10 }}>
            {[
              { href: '/lexikon/ransomware', label: 'Ransomware im Lexikon' },
              { href: '/werkzeuge/iso-27001-readiness', label: 'Wie weit ist mein ISMS?' },
            ].map(r => (
              <Link key={r.href} href={r.href} className="group inline-flex items-center font-body" style={{ gap: 8, fontSize: 13.5, padding: '9px 14px', borderRadius: 'var(--r-pill)', color: 'var(--fg-default)', background: 'rgba(242, 240, 235, 0.05)', border: '1px solid rgba(242, 240, 235, 0.14)' }}>
                {r.label}
                <ArrowRight size={13} strokeWidth={1.75} style={{ color: 'var(--brand)' }} className="transition-transform duration-220 group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center" style={{ marginTop: 22, justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <p className="font-body" style={{ fontSize: 12.5, lineHeight: 1.55, color: 'var(--fg-subtle)', margin: 0, flex: 1, minWidth: 220 }}>
            Alle Beispiele sind fiktiv, zeigen aber reale Muster. Teile das Quiz gern im Team — die Diskussion danach ist die halbe Schulung.
          </p>
          <button type="button" onClick={reset} className="font-mono uppercase inline-flex items-center" style={{ gap: 8, fontSize: 11, letterSpacing: '0.12em', color: 'var(--fg-muted)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <RotateCcw size={13} strokeWidth={1.75} />
            Nochmal spielen
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="flex flex-col" style={{ gap: 20 }}>
      <p className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.20em', color: 'var(--fg-subtle)', margin: 0 }}>
        Mail {index + 1} von {MAILS.length} · {score} richtig
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease: EASE }}
          style={questionCard}
        >
          {/* Mail-Kopf */}
          <div style={{ paddingBottom: 16, borderBottom: '1px solid rgba(242, 240, 235, 0.08)', marginBottom: 16 }}>
            <p className="font-mono" style={{ fontSize: 12.5, color: 'var(--fg-muted)', margin: 0 }}>
              <span style={{ color: 'var(--fg-subtle)' }}>Von: </span>{mail.from}
            </p>
            <p className="font-body font-semibold" style={{ fontSize: 16, color: 'var(--fg-default)', margin: '8px 0 0' }}>
              {mail.subject}
            </p>
          </div>

          <p className="font-body" style={{ fontSize: 14.5, lineHeight: 1.65, color: 'var(--fg-muted)', margin: 0 }}>
            {mail.body}
          </p>

          {mail.linkTarget && (
            <p className="font-mono" style={{ fontSize: 12, color: 'var(--fg-subtle)', margin: '14px 0 0' }}>
              <span aria-hidden>↳ </span>Link/Anhang führt zu: <span style={{ color: 'var(--brand)' }}>{mail.linkTarget}</span>
            </p>
          )}

          {/* Antwort-Buttons oder Auflösung */}
          {picked === null ? (
            <div className="flex flex-col gap-3 sm:flex-row" style={{ marginTop: 24 }}>
              <button
                type="button"
                onClick={() => answer(true)}
                className="flex-1 font-body font-semibold transition-transform duration-220 hover:-translate-y-0.5"
                style={{ padding: '14px 20px', fontSize: 15, borderRadius: 'var(--r-sm)', background: 'rgba(227, 114, 97, 0.12)', color: 'var(--error-fg)', border: '1px solid rgba(227, 114, 97, 0.35)', cursor: 'pointer' }}
              >
                Phishing
              </button>
              <button
                type="button"
                onClick={() => answer(false)}
                className="flex-1 font-body font-semibold transition-transform duration-220 hover:-translate-y-0.5"
                style={{ padding: '14px 20px', fontSize: 15, borderRadius: 'var(--r-sm)', background: 'rgba(108, 176, 130, 0.10)', color: 'var(--success-fg)', border: '1px solid rgba(108, 176, 130, 0.32)', cursor: 'pointer' }}
              >
                Seriös
              </button>
            </div>
          ) : (
            <div style={{ marginTop: 24 }} aria-live="polite">
              <div className="flex items-center gap-2" style={{ marginBottom: 10 }}>
                {correct
                  ? <ShieldCheck size={18} strokeWidth={1.75} style={{ color: 'var(--success-fg)' }} />
                  : <ShieldAlert size={18} strokeWidth={1.75} style={{ color: 'var(--error-fg)' }} />}
                <span className="font-mono uppercase" style={{ fontSize: 11.5, letterSpacing: '0.16em', color: correct ? 'var(--success-fg)' : 'var(--error-fg)' }}>
                  {correct ? 'Richtig erkannt' : mail.isPhishing ? 'Das war Phishing' : 'Die war seriös'}
                </span>
              </div>
              <p className="font-body" style={{ fontSize: 14.5, lineHeight: 1.65, color: 'var(--fg-muted)', margin: 0 }}>
                {mail.explain}
              </p>
              <button
                type="button"
                onClick={next}
                className="group inline-flex items-center font-body font-semibold transition-transform duration-220 hover:-translate-y-0.5"
                style={{ marginTop: 20, gap: 8, padding: '12px 22px', fontSize: 14.5, borderRadius: 'var(--r-sm)', background: 'var(--accent)', color: 'var(--on-accent)', border: 'none', cursor: 'pointer' }}
              >
                {index + 1 >= MAILS.length ? 'Zum Ergebnis' : 'Nächste Mail'}
                <ArrowRight size={15} strokeWidth={2} className="transition-transform duration-220 group-hover:translate-x-0.5" />
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
