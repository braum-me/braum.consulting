'use client'

import { motion } from 'motion/react'
import { Check } from 'lucide-react'
import Eyebrow from '@/components/ui/Eyebrow'
import ItalicAccent from '@/components/ui/ItalicAccent'
import AccentGlow from '@/components/ui/AccentGlow'

const EASE = [0.16, 1, 0.3, 1] as const

interface Station {
  years: string
  role:  string
  body:  string
  state: 'done' | 'current'
}

const STATIONS: Station[] = [
  {
    years: '2014 – 2017',
    role: 'Ausbildung Fachinformatiker',
    body:
      'Drei Jahre Ausbildung zum Fachinformatiker bei Anvis (heute SumiRiko AVS Germany), Tier-1-Automotive. Erste Berührung mit Industrie-IT, Netzwerken und User-Support im produzierenden Umfeld.',
    state: 'done',
  },
  {
    years: '2018',
    role: 'IT System Specialist · Adecco',
    body:
      'Automatisiertes Software-Deployment für über 5.200 Clients im DACH-Raum, M365-Cloud-Einführung. Enterprise-Scale und Cloud-Migration zum ersten Mal in den Händen.',
    state: 'done',
  },
  {
    years: '2018 – 2021',
    role: 'IT-Projektmanager · ODW-Elektrik',
    body:
      'Digitalisierung der Unternehmens-IT auf Microsoft-365-Basis: Modern Workplace, Cloud-Migration, SharePoint-Intranet, Identity & Access Management, PLM-Themen.',
    state: 'done',
  },
  {
    years: '2021 – heute',
    role: 'Teamleader IT Applications · Deputy Global Head IT & SAP',
    body:
      'Strategische und operative Verantwortung für die digitale Transformation und den IT-Betrieb bei einem Automotive-Zulieferer mit globaler IT-Landschaft. Microsoft Copilot, KI-Themen, Architektur.',
    state: 'current',
  },
  {
    years: '2022 – heute',
    role: 'Deputy Teamleader Data Analytics / BI',
    body:
      'Parallel-Rolle: stellvertretende Verantwortung für die Weiterentwicklung der Data- und Analytics-Plattform. Modernes Reporting, datengetriebene Entscheidungsunterstützung.',
    state: 'current',
  },
  {
    years: '2023 – heute',
    role: 'Braum Consulting',
    body:
      'Eigene Praxis parallel zum Hauptjob. Digitale Beratung für KMU mit Schwerpunkt WordPress, Microsoft 365, Modern Work und AI-First-Strategien. Über zehn Jahre an der Schnittstelle zwischen IT-Betrieb und Geschäftsstrategie.',
    state: 'current',
  },
]

/**
 * UeberTimeline als vertikale Stages-Liste — analog Section7Growth in MarkeShowcase.
 * Connection-Line links + Status-Dots (done = grün-check, current = pulsierend brand),
 * Glass-Cards rechts, Bounce-In bei Scroll-Into-View.
 */
export default function UeberTimeline() {
  return (
    <section
      id="werdegang"
      aria-label="Werdegang"
      className="relative w-screen overflow-hidden"
      style={{
        marginLeft: 'calc(-50vw + 50%)',
        background: 'var(--bg-base)',
        padding: 'clamp(96px, 12vw, 160px) 0',
      }}
    >
      <AccentGlow position="bottom-left" intensity="low" />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(45% 60% at 25% 30%, rgba(220, 128, 68, 0.10) 0%, transparent 60%),' +
            'radial-gradient(40% 50% at 80% 80%, rgba(146, 48, 30, 0.08) 0%, transparent 60%)',
          zIndex: 0,
        }}
      />

      <div className="relative z-[3] mx-auto w-full max-w-[var(--container-wide)] px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ maxWidth: '820px', marginBottom: 'clamp(48px, 6vw, 80px)' }}
        >
          <Eyebrow num="03">Wo ich herkomme</Eyebrow>
          <h2
            className="mt-6 font-display font-bold"
            style={{
              fontSize: 'clamp(36px, 5vw, 64px)',
              lineHeight: 1.05,
              letterSpacing: 'var(--tr-display)',
              color: 'var(--fg-default)',
            }}
          >
            Sechs Stationen. Ein <ItalicAccent>Kurs</ItalicAccent>.
          </h2>
          <p
            className="mt-6 font-body"
            style={{
              fontSize: '17px',
              lineHeight: 1.55,
              color: 'var(--fg-muted)',
              maxWidth: '620px',
            }}
          >
            Vom Fachinformatiker in der Tier-1-Automotive über Enterprise-IT
            bis zur eigenen Praxis. Jede Station hat eine Schicht hinzugefügt —
            Industrie, Cloud, Strategie, Beratung.
          </p>
        </motion.div>

        <div className="relative">
          {/* Vertikale Connection-Line links */}
          <div
            aria-hidden
            className="pointer-events-none absolute hidden md:block"
            style={{
              left: '23px',
              top: '32px',
              bottom: '40px',
              width: '2px',
              background:
                'linear-gradient(180deg, rgba(40, 200, 64, 0.50) 0%, rgba(40, 200, 64, 0.30) 35%, var(--brand) 60%, rgba(220, 128, 68, 0.40) 100%)',
              opacity: 0.65,
            }}
          />

          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {STATIONS.map((s, i) => (
              <Stage key={s.years} station={s} index={i} total={STATIONS.length} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function Stage({
  station,
  index,
  total,
}: {
  station: Station
  index:   number
  total:   number
}) {
  const isCurrent = station.state === 'current'
  const accentColor = isCurrent ? 'var(--brand)' : '#28C840'
  const dotShadow = isCurrent
    ? '0 0 18px rgba(220, 128, 68, 0.65)'
    : '0 0 14px rgba(40, 200, 64, 0.55)'

  return (
    <motion.li
      className="relative md:pl-20"
      style={{ marginBottom: index === total - 1 ? 0 : 'clamp(24px, 3vw, 40px)' }}
      initial={{ opacity: 0, x: 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-12%' }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: EASE }}
    >
      {/* Status-Dot auf Connection-Line (Desktop) */}
      <div
        aria-hidden
        className="absolute hidden md:flex items-center justify-center"
        style={{
          left: '8px',
          top: '32px',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'var(--bg-base)',
          border: `2px solid ${accentColor}`,
          boxShadow: dotShadow,
        }}
      >
        {!isCurrent && <Check size={14} strokeWidth={2.4} style={{ color: '#28C840' }} />}
        {isCurrent && (
          <span
            className="animate-pulse"
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'var(--brand)',
            }}
          />
        )}
      </div>

      <article
        className="glass-card relative"
        style={{
          padding: 'clamp(24px, 2.4vw, 32px)',
          border: isCurrent
            ? '1px solid rgba(220, 128, 68, 0.35)'
            : undefined,
          background: isCurrent
            ? 'linear-gradient(145deg, rgba(220, 128, 68, 0.05), rgba(220, 128, 68, 0.02))'
            : undefined,
        }}
      >
        <div className="relative z-[3]">
          <div className="flex items-start justify-between gap-4">
            <p
              className="font-mono uppercase"
              style={{
                fontSize: '10px',
                letterSpacing: '0.20em',
                color: accentColor,
              }}
            >
              Station {String(index + 1).padStart(2, '0')} · {station.years}
            </p>
            <span
              className="font-mono uppercase shrink-0"
              style={{
                fontSize: '9px',
                letterSpacing: '0.18em',
                padding: '4px 10px',
                borderRadius: 'var(--r-pill)',
                color: accentColor,
                background: isCurrent
                  ? 'rgba(220, 128, 68, 0.10)'
                  : 'rgba(40, 200, 64, 0.10)',
                border: `1px solid ${
                  isCurrent ? 'rgba(220, 128, 68, 0.28)' : 'rgba(40, 200, 64, 0.28)'
                }`,
                whiteSpace: 'nowrap',
              }}
            >
              {isCurrent ? 'läuft' : '✓ abgeschlossen'}
            </span>
          </div>

          <h3
            className="mt-3 font-display font-semibold"
            style={{
              fontSize: 'clamp(20px, 2.2vw, 26px)',
              lineHeight: 1.2,
              letterSpacing: 'var(--tr-heading)',
              color: 'var(--fg-default)',
            }}
          >
            {station.role}
          </h3>

          <p
            className="mt-4 font-body"
            style={{
              fontSize: '15px',
              lineHeight: 1.6,
              color: 'var(--fg-muted)',
              maxWidth: '720px',
            }}
          >
            {station.body}
          </p>
        </div>
      </article>
    </motion.li>
  )
}
