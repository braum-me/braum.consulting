import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ArrowUpRight, Mail, MapPin } from 'lucide-react'
import ItalicAccent from '@/components/ui/ItalicAccent'
import MonogramOutline from '@/components/ui/MonogramOutline'
import AnimatedGradient from '@/components/ui/AnimatedGradient'
import ObfuscatedEmail from '@/components/ui/ObfuscatedEmail'
import Reveal, { RevealGroup, RevealItem } from '@/components/ui/Reveal'
import SlotLabel from './SlotLabel'
import TrackedLink from './TrackedLink'
import { SERVICES } from '@/lib/services'

const FOOTER_COLUMNS: Array<{
  eyebrow: string
  items: Array<{ label: string; href: string; external?: boolean }>
}> = [
  {
    eyebrow: 'Navigation',
    items: [
      { label: 'Über',       href: '/ueber' },
      { label: 'Leistungen', href: '/leistungen' },
      { label: 'Portfolio',  href: '/cases' },
      { label: 'Blog',       href: '/blog' },
      { label: 'Kontakt',    href: '/kontakt' },
    ],
  },
  {
    eyebrow: 'Schwerpunkte',
    // Single Source of Truth: direkt aus lib/services.ts gemappt
    items: SERVICES.map(s => ({
      label: s.title,
      href:  `/leistungen/${s.slug}`,
    })),
  },
  {
    eyebrow: 'Weiterführendes',
    items: [
      { label: 'Methodik',  href: '/methodik' },
      { label: 'Werkzeuge', href: '/werkzeuge' },
      { label: 'Lexikon',   href: '/lexikon' },
    ],
  },
  {
    eyebrow: 'Rechtliches',
    items: [
      { label: 'Impressum',   href: '/impressum' },
      { label: 'Datenschutz', href: '/datenschutz' },
    ],
  },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="site-footer relative overflow-hidden"
      style={{
        background: 'var(--bg-base)',
      }}
    >
      {/* Mesh-Gradient mit Top-Mask. Erste ~30 % bleiben komplett transparent
          — dort ist Footer-Background reines bg-base, identisch zur Content-
          Section darüber, kein Helligkeits-Cut. Ab 30 % fadet der Mesh sanft
          und langsam bis zum Footer-Boden ein. Reden-wir-Headline sitzt im
          transparenten Bereich.                                            */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          maskImage:
            'linear-gradient(to bottom, transparent 0%, transparent 30%, rgba(0,0,0,0.10) 42%, rgba(0,0,0,0.28) 55%, rgba(0,0,0,0.48) 68%, rgba(0,0,0,0.68) 80%, rgba(0,0,0,0.86) 92%, black 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0%, transparent 30%, rgba(0,0,0,0.10) 42%, rgba(0,0,0,0.28) 55%, rgba(0,0,0,0.48) 68%, rgba(0,0,0,0.68) 80%, rgba(0,0,0,0.86) 92%, black 100%)',
        }}
      >
        <AnimatedGradient variant="mesh" />
      </div>

      {/* Brand-Cognac in der UNTEREN Hälfte — atmosphärische Tiefe, ohne
          den oberen Übergang aufzuhellen. Sitzt unterhalb der Reden-wir-
          Headline und verstärkt nur den Mesh-Bereich.                      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{
          height: '65%',
          background:
            'radial-gradient(70% 80% at 50% 70%, rgba(220, 128, 68, 0.14) 0%, rgba(146, 48, 30, 0.06) 50%, transparent 85%)',
          mixBlendMode: 'screen',
          zIndex: 2,
        }}
      />

      {/* Ein einzelnes, sehr großes Monogramm, schwach + dominant in der Fläche */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          right: '-15vw',
          bottom: '-25%',
          width: 'clamp(900px, 140vw, 2000px)',
          aspectRatio: '2 / 1',
          color: '#F2F0EB',
          opacity: 0.07,
          filter:
            'drop-shadow(0 0 60px rgba(200, 98, 42, 0.45)) drop-shadow(0 0 18px rgba(220, 128, 68, 0.30))',
          zIndex: 1,
        }}
      >
        <MonogramOutline strokeWidth={0.6} style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Grain overlay durchgehend */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'var(--noise-svg)',
          mixBlendMode: 'overlay',
          opacity: 0.06,
          zIndex: 2,
        }}
      />

      <div className="relative z-[3] mx-auto w-full max-w-[var(--container-wide)] px-6 pb-12 pt-32 md:px-12 md:pb-16 md:pt-48">

        {/* ── Closing-CTA ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-14 md:grid-cols-12 md:items-end md:gap-16">

          {/* Headline links */}
          <Reveal y={24} duration={0.8} className="md:col-span-7">
            <p
              className="font-mono uppercase"
              style={{
                fontSize: 'var(--t-micro)',
                letterSpacing: 'var(--tr-eyebrow)',
                color: 'var(--fg-subtle)',
              }}
            >
              <span style={{ color: 'var(--brand)' }}>09</span>
              <span style={{ color: 'var(--fg-faint)', margin: '0 12px' }}>/</span>
              Erste Etappe
            </p>

            <h2
              className="mt-10 font-display font-black"
              style={{
                fontSize: 'clamp(42px, 6.6vw, 112px)',
                lineHeight: 'var(--lh-display)',
                letterSpacing: 'var(--tr-display)',
                color: 'var(--fg-default)',
              }}
            >
              Reden wir.<br />
              <ItalicAccent>Ohne</ItalicAccent> Folien.
            </h2>

            <p
              className="mt-12 max-w-[560px] font-body"
              style={{
                fontSize: '17px',
                lineHeight: 1.6,
                color: 'var(--fg-muted)',
              }}
            >
              In 30 Minuten klären wir, wo du stehst, was blockiert und
              welcher nächste digitale Schritt sinnvoll ist.
            </p>
          </Reveal>

          {/* Glass-Card rechts */}
          <Reveal y={24} delay={0.15} duration={0.8} className="md:col-span-5">
            <div
              className="p-7 md:p-8"
              style={{
                background: 'rgba(15, 14, 12, 0.42)',
                backdropFilter: 'blur(14px) saturate(140%)',
                WebkitBackdropFilter: 'blur(14px) saturate(140%)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--r-md)',
              }}
            >
              <TrackedLink
                event="cta_lagebild_footer"
                href="/lagebild"
                data-cursor="magnetic"
                className="btn-accent-pulse inline-flex w-full items-center justify-center gap-2 px-6 py-4 font-body font-semibold transition-transform duration-220 hover:-translate-y-px"
                style={{
                  fontSize: '14px',
                  background: 'var(--accent)',
                  color: 'var(--on-accent)',
                  borderRadius: 'var(--r-sm)',
                }}
              >
                Digitales Lagebild anfragen
                <ArrowRight size={16} strokeWidth={1.5} />
              </TrackedLink>
              <p
                className="mt-3 text-center font-body italic"
                style={{
                  fontSize: '13px',
                  lineHeight: 1.4,
                  color: 'var(--fg-muted)',
                }}
              >
                Kein Pitch. Kein Tool-Verkauf. Nur Orientierung und nächste
                Schritte.
              </p>

              <ul
                className="mt-6 space-y-3 border-t pt-6"
                style={{ borderColor: 'var(--border-subtle)' }}
              >
                <li>
                  <span className="group flex items-center gap-3 transition-colors duration-220 hover:text-[color:var(--accent)]">
                    <Mail size={15} strokeWidth={1.5} style={{ color: 'var(--brand)' }} />
                    <ObfuscatedEmail
                      showAddress
                      cursorType="magnetic"
                      className="font-body transition-colors duration-220 hover:text-[color:var(--accent)]"
                      style={{ fontSize: 'var(--t-body-sm)', color: 'var(--fg-default)' }}
                    />
                  </span>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/stefanbraum"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="magnetic"
                    className="group flex items-center gap-3 transition-colors duration-220 hover:text-[color:var(--accent)]"
                  >
                    <ArrowUpRight size={15} strokeWidth={1.5} style={{ color: 'var(--brand)' }} />
                    <span
                      className="font-body"
                      style={{ fontSize: 'var(--t-body-sm)', color: 'var(--fg-default)' }}
                    >
                      LinkedIn · /in/stefanbraum
                    </span>
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <MapPin size={15} strokeWidth={1.5} style={{ color: 'var(--brand)' }} />
                  <span
                    className="font-body"
                    style={{ fontSize: 'var(--t-body-sm)', color: 'var(--fg-muted)' }}
                  >
                    Main-Kinzig-Kreis · Hessen
                  </span>
                </li>
              </ul>

              <div
                className="mt-6 flex items-center gap-2.5 border-t pt-6"
                style={{ borderColor: 'var(--border-subtle)' }}
              >
                <span className="relative inline-flex h-2 w-2">
                  <span
                    aria-hidden
                    className="absolute inset-0 animate-ping"
                    style={{
                      background: 'var(--success-fg)',
                      borderRadius: 'var(--r-pill)',
                      opacity: 0.5,
                    }}
                  />
                  <span
                    className="relative inline-block h-2 w-2"
                    style={{
                      background: 'var(--success-fg)',
                      borderRadius: 'var(--r-pill)',
                      boxShadow: '0 0 10px rgba(108, 176, 130, 0.6)',
                    }}
                  />
                </span>
                <p
                  className="font-mono uppercase"
                  style={{
                    fontSize: 'var(--t-micro)',
                    letterSpacing: 'var(--tr-eyebrow)',
                    color: 'var(--fg-muted)',
                  }}
                >
                  1 Slot frei · <SlotLabel prefix="" />
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* ── Spalten ─────────────────────────────────────────────── */}
        <RevealGroup
          className="mt-24 grid grid-cols-1 gap-12 border-t pt-16 md:mt-32 md:grid-cols-12 md:gap-10 md:pt-20"
          style={{ borderColor: 'var(--border-subtle)' }}
          staggerDelay={0.08}
          staggerInitial={0.1}
          margin="-5%"
        >
          <RevealItem className="flex flex-col items-center text-center md:col-span-5 md:items-start md:text-left">
            <Link href="/" aria-label="Braum Consulting, Startseite" className="inline-flex">
              <Image
                src="/assets/logo/logo-04.svg"
                alt="Braum Consulting"
                width={400}
                height={200}
                unoptimized
                loading="lazy"
                className="h-32 w-auto md:h-44"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </Link>

            <p
              className="max-w-[420px] font-body"
              style={{
                fontSize: 'var(--t-body)',
                lineHeight: 'var(--lh-body)',
                color: 'var(--fg-muted)',
                marginTop: '-8px',
              }}
            >
              Digitaler Lotse für Mittelstand und Industrie. Direkt
              mit Stefan Braum.
            </p>
          </RevealItem>

          <div className="grid grid-cols-1 gap-10 text-center sm:grid-cols-2 md:col-span-7 md:grid-cols-4 md:gap-8 md:text-left">
            {FOOTER_COLUMNS.map(col => (
              <RevealItem key={col.eyebrow}>
                <p
                  className="font-mono uppercase"
                  style={{
                    fontSize: 'var(--t-micro)',
                    letterSpacing: 'var(--tr-eyebrow)',
                    color: 'var(--fg-subtle)',
                  }}
                >
                  {col.eyebrow}
                </p>
                <ul className="mt-5 flex flex-col items-center gap-3 md:items-start">
                  {col.items.map(item => {
                    const linkClass =
                      'group inline-flex items-center gap-1.5 font-body transition-all duration-220 hover:text-[color:var(--fg-default)] md:hover:translate-x-0.5'
                    const linkStyle = {
                      fontSize: 'var(--t-body-sm)',
                      color: 'var(--fg-muted)',
                    } as const
                    const externalProps = item.external
                      ? { target: '_blank', rel: 'noreferrer' }
                      : {}
                    const inner = (
                      <>
                        {item.label}
                        {item.external && (
                          <ArrowUpRight
                            size={12}
                            strokeWidth={1.5}
                            className="opacity-60 transition-opacity group-hover:opacity-100"
                          />
                        )}
                      </>
                    )
                    return (
                      <li key={item.label}>
                        {item.href === '/kontakt' ? (
                          <TrackedLink
                            event="cta_kontakt_footer"
                            href={item.href}
                            className={linkClass}
                            style={linkStyle}
                          >
                            {inner}
                          </TrackedLink>
                        ) : (
                          <Link
                            href={item.href}
                            {...externalProps}
                            className={linkClass}
                            style={linkStyle}
                          >
                            {inner}
                          </Link>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </RevealItem>
            ))}
          </div>
        </RevealGroup>

        {/* ── Baseline ────────────────────────────────────────────── */}
        <div
          className="mt-20 flex flex-col gap-4 border-t pt-8 md:flex-row md:items-center md:justify-between"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <p
            className="font-mono"
            style={{
              fontSize: 'var(--t-micro)',
              letterSpacing: '0.02em',
              color: 'var(--fg-subtle)',
            }}
          >
            © {year} Stefan Braum · Braum Consulting · Made im Main-Kinzig-Kreis.
          </p>
          <a
            href="https://www.linkedin.com/in/stefanbraum"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 font-body transition-colors duration-220 hover:text-[color:var(--accent)]"
            style={{
              fontSize: 'var(--t-body-sm)',
              color: 'var(--fg-muted)',
            }}
          >
            LinkedIn · /in/stefanbraum
            <ArrowUpRight
              size={12}
              strokeWidth={1.5}
              className="opacity-60 transition-opacity group-hover:opacity-100"
            />
          </a>
        </div>
      </div>
    </footer>
  )
}
