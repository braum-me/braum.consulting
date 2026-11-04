import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Calendar, Clock, ShieldCheck } from 'lucide-react'
import BigHero from '@/components/sections/BigHero'
import ItalicAccent from '@/components/ui/ItalicAccent'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import { KontaktVisual } from '@/components/ui/PageHeroVisuals'
import { getSafeCalUrl, CAL_FRAME_SANDBOX } from '@/lib/cal'

/**
 * ── Launch-Flag (v1) ─────────────────────────────────────────────────
 * Die Direktbuchung ist beim v1-Launch noch NICHT live. `false` blendet
 * den Buchungs-Slot (CalSlot) aus und zeigt stattdessen einen
 * „Coming soon"-Zustand mit Fallback-CTA → /kontakt.
 *
 * Zum Re-Aktivieren: einfach auf `true` setzen. Der gesamte Buchungs-Code
 * (CalSlot, Cal.com-Embed/Fallback) bleibt erhalten und wird dann wieder
 * gerendert. Beim Aktivieren auch `robots`-Metadata unten wieder auf
 * indexierbar prüfen.
 */
const BOOKING_LIVE = false

export const metadata: Metadata = {
  title: 'Termin · Lagebild-Gespräch',
  description:
    'Direkt-Buchung für ein 30-Minuten-Lagebild-Gespräch mit Stefan Braum. Bewusst am Abend und am Wochenende — voller Fokus, ungeteilte Aufmerksamkeit.',
  alternates: { canonical: '/termin' },
  // Solange die Buchung nicht live ist (BOOKING_LIVE = false): nicht indexieren.
  ...(BOOKING_LIVE ? {} : { robots: { index: false, follow: false } }),
}

/**
 * /termin — Pfad B des Lagebild-Funnels.
 *
 *   Direkter Termin ohne Wizard zuerst. Cal.com-Buchung schreibt Lead
 *   via Webhook. In Cal-Confirmation-Mail wird Link auf
 *   /lagebild/check?token=… eingebaut für Vorbereitung.
 *
 * Bis Cal.com live ist, rendert hier ein E-Mail-Fallback (siehe CalSlot).
 */
export default function TerminPage() {
  return (
    <>
      <BigHero
        eyebrowNum="01"
        eyebrow={BOOKING_LIVE ? 'Termin · 30 Minuten' : 'Termin · bald verfügbar'}
        title={
          BOOKING_LIVE
            ? <><ItalicAccent>Termin</ItalicAccent> direkt buchen.</>
            : <><ItalicAccent>Termin</ItalicAccent> vorbereiten.</>
        }
        lede={
          BOOKING_LIVE
            ? 'Du willst lieber gleich reden statt vorher schreiben? Wähl einen Slot, in der Cal-Bestätigung kommt der Link zum Lagebild-Briefing — als Vorbereitung, optional. Beide Wege landen bei mir.'
            : 'Die Online-Buchung kommt bald. Du willst lieber gleich reden statt vorher schreiben? Nimm direkt Kontakt auf, dann finden wir einen Slot — Mo–Do ab 17:00, Fr ab 15:00, Sa und So ganztägig.'
        }
        facts={[
          { label: 'Dauer',  value: '30 Minuten' },
          { label: 'Format', value: 'Video / Telefon' },
          { label: 'Wann',   value: 'Mo–Do 17+, Fr 15+, Sa+So' },
        ]}
        visual={<KontaktVisual />}
      />

      <section
        className="relative w-screen overflow-hidden"
        style={{
          marginLeft: 'calc(-50vw + 50%)',
          background: 'var(--bg-base)',
          paddingTop: 48,
          paddingBottom: 128,
        }}
      >
        <div className="relative z-[2] mx-auto" style={{ maxWidth: 880, padding: '0 24px' }}>
          {/* Breadcrumbs ohne JSON-LD: /termin ist solange BOOKING_LIVE=false noindex,
              ein BreadcrumbList-Schema auf einer nicht-indexierten Seite bringt nichts.
              Lagebild als Eltern-Bereich, da /termin Pfad B des Lagebild-Funnels ist. */}
          <Breadcrumbs
            className="mb-12"
            items={[
              { label: 'Lagebild', href: '/lagebild' },
              { label: 'Termin' },
            ]}
          />
          {BOOKING_LIVE ? (
            <>
              {/* Pfad-A Hint oben — viele Leser sind besser bedient mit dem Briefing-Vorab */}
              <PfadAHint />

              {/* Cal-Embed-Slot */}
              <section style={{ marginTop: 48, marginBottom: 80 }}>
                <SectionLabel num="02" label="Slot wählen" />
                <CalSlot />
              </section>
            </>
          ) : (
            <section style={{ marginBottom: 80 }}>
              <ComingSoon />
            </section>
          )}

          {/* Zweite-Schicht-Block */}
          <ZweiteSchichtBlock />

          {/* Footer */}
          <footer
            className="font-body"
            style={{
              marginTop: 96,
              paddingTop: 32,
              borderTop: '1px solid rgba(242, 240, 235, 0.06)',
              fontSize: 13,
              lineHeight: 1.65,
              color: 'var(--fg-subtle)',
            }}
          >
            Kein Termin gefunden, der passt? Schreib mir an{' '}
            <a
              href="mailto:info@braum.consulting"
              style={{ color: 'var(--brand)', textDecoration: 'underline', textDecorationThickness: 1 }}
            >
              info@braum.consulting
            </a>{' '}
            mit drei Lieblings-Zeitfenstern.
          </footer>
        </div>
      </section>
    </>
  )
}

/* ── Coming-soon-Zustand (BOOKING_LIVE = false) ─────────────────────── */

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
        Die Online-Buchung kommt bald.
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
        Wir schalten die direkte Terminbuchung in Kürze frei. Willst du nicht
        warten? Nimm direkt Kontakt auf — dann finden wir gemeinsam einen Slot.
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

/* ── Pfad-A-Hint ─────────────────────────────────────────────────────── */

function PfadAHint() {
  return (
    <Link
      href="/lagebild/check"
      className="group block transition-transform duration-220 hover:-translate-y-px"
      style={{
        padding: '20px 24px',
        borderRadius: 10,
        background:
          'linear-gradient(135deg, rgba(220, 128, 68, 0.06) 0%, rgba(220, 128, 68, 0.01) 100%)',
        border: '1px solid rgba(220, 128, 68, 0.16)',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        flexWrap: 'wrap',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ flex: 1, minWidth: 240 }}>
        <p
          className="font-mono uppercase"
          style={{
            fontSize: 11,
            letterSpacing: '0.18em',
            color: 'var(--brand)',
            marginBottom: 6,
          }}
        >
          Tipp · Pfad A
        </p>
        <p
          className="font-body"
          style={{ fontSize: 15, lineHeight: 1.55, color: 'var(--fg-default)', margin: 0 }}
        >
          Lieber erst ein <strong>Briefing als Vorbereitung</strong>? 4 Minuten
          Selbst-Check, du bekommst Roadmap-Skizze per Mail, danach den Termin.
        </p>
      </div>
      <span
        className="font-mono uppercase"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 12,
          letterSpacing: '0.06em',
          color: 'var(--brand)',
          padding: '10px 16px',
          background: 'rgba(220, 128, 68, 0.08)',
          borderRadius: 6,
          border: '1px solid rgba(220, 128, 68, 0.24)',
          transition: 'background 220ms, transform 220ms',
        }}
      >
        Lagebild starten
        <ArrowRight
          size={14}
          strokeWidth={1.75}
          className="transition-transform duration-220 group-hover:translate-x-0.5"
        />
      </span>
    </Link>
  )
}

/* ── Section-Label ──────────────────────────────────────────────────── */

function SectionLabel({ num, label }: { num: string; label: string }) {
  return (
    <p
      className="font-mono uppercase"
      style={{
        fontSize: 11,
        letterSpacing: '0.20em',
        color: 'var(--brand)',
        marginBottom: 24,
      }}
    >
      {num} · {label}
    </p>
  )
}

/* ── Cal-Slot mit Fallback ──────────────────────────────────────────── */

function CalSlot() {
  const calUrl = getSafeCalUrl(process.env.CAL_EVENT_URL)

  if (!calUrl) {
    return (
      <div
        style={{
          padding: 48,
          borderRadius: 14,
          border: '1px dashed rgba(242, 240, 235, 0.16)',
          background: 'rgba(242, 240, 235, 0.02)',
          textAlign: 'center',
        }}
      >
        <Calendar
          size={36}
          strokeWidth={1.25}
          style={{ color: 'var(--brand)', marginBottom: 20, display: 'inline-block' }}
        />
        <h3
          className="font-display"
          style={{
            fontSize: 22,
            fontWeight: 600,
            color: 'var(--fg-default)',
            margin: '0 0 8px',
            letterSpacing: '-0.018em',
          }}
        >
          Online-Buchung kommt in Kürze.
        </h3>
        <p
          className="font-body"
          style={{
            fontSize: 14,
            lineHeight: 1.6,
            color: 'var(--fg-muted)',
            margin: '0 auto 24px',
            maxWidth: 380,
          }}
        >
          Solange Cal.com noch nicht live ist: Mail mit drei Lieblings-Zeitfenstern,
          du bekommst Antwort innerhalb 48h.
        </p>
        <a
          href="mailto:info@braum.consulting?subject=Lagebild-Termin"
          className="font-mono"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 24px',
            fontSize: 13,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: '#FBF0EA',
            background: 'linear-gradient(135deg, #DC8044 0%, #C8622A 100%)',
            borderRadius: 6,
            textDecoration: 'none',
            fontWeight: 600,
            boxShadow: '0 4px 16px rgba(200, 98, 42, 0.20)',
          }}
        >
          Termin per E-Mail
          <ArrowRight size={14} strokeWidth={2.25} />
        </a>
      </div>
    )
  }

  return (
    <div
      style={{
        borderRadius: 14,
        overflow: 'hidden',
        border: '1px solid rgba(242, 240, 235, 0.10)',
        background: 'rgba(242, 240, 235, 0.02)',
      }}
    >
      <iframe
        src={calUrl}
        style={{ width: '100%', height: 720, border: 'none', display: 'block' }}
        title="Lagebild-Termin auswählen"
        loading="lazy"
        sandbox={CAL_FRAME_SANDBOX}
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  )
}

/* ── Zweite-Schicht-Block ───────────────────────────────────────────── */

function ZweiteSchichtBlock() {
  return (
    <section
      style={{
        padding: 32,
        borderRadius: 14,
        background: 'rgba(242, 240, 235, 0.03)',
        border: '1px solid rgba(242, 240, 235, 0.08)',
        maxWidth: 720,
      }}
    >
      <div
        className="font-mono uppercase"
        style={{
          fontSize: 11,
          letterSpacing: '0.20em',
          color: 'var(--fg-muted)',
          marginBottom: 16,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Clock size={12} strokeWidth={1.5} />
        Hinweis zu meinen Slots
      </div>
      <p
        className="font-body"
        style={{
          fontSize: 16,
          lineHeight: 1.7,
          color: 'var(--fg-default)',
          margin: 0,
          fontWeight: 400,
        }}
      >
        Gespräche laufen am{' '}
        <strong style={{ color: 'var(--brand)' }}>Abend und am Wochenende</strong> —
        Mo–Do ab 17:00, Fr ab 15:00, Sa und So ganztägig. Bewusst ruhige Zeitfenster,
        in denen du die volle, ungeteilte Aufmerksamkeit bekommst. Wenige Slots,
        dafür ganz bei dir.
      </p>

      <div
        style={{
          marginTop: 24,
          paddingTop: 20,
          borderTop: '1px solid rgba(242, 240, 235, 0.06)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 20,
        }}
      >
        <PromiseItem
          icon={<ShieldCheck size={13} strokeWidth={1.5} />}
          label="Kein Pitch"
          text="30 Minuten Lagebild. Keine Folien, kein Tool-Verkauf."
        />
        <PromiseItem
          icon={<Calendar size={13} strokeWidth={1.5} />}
          label="Termin-Bestätigung"
          text="Terminbestätigung in < 1 Min, mit Briefing-Vorbereitung."
        />
        <PromiseItem
          icon={<Clock size={13} strokeWidth={1.5} />}
          label="Pünktlichkeit"
          text="Operator, kein Berater. Ich starte und ende auf die Minute."
        />
      </div>
    </section>
  )
}

function PromiseItem({
  icon,
  label,
  text,
}: {
  icon: React.ReactNode
  label: string
  text: string
}) {
  return (
    <div>
      <span
        className="font-mono uppercase"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 10,
          letterSpacing: '0.18em',
          color: 'var(--brand)',
          marginBottom: 6,
        }}
      >
        {icon}
        {label}
      </span>
      <p
        className="font-body"
        style={{
          fontSize: 13,
          lineHeight: 1.5,
          color: 'var(--fg-muted)',
          margin: 0,
        }}
      >
        {text}
      </p>
    </div>
  )
}
