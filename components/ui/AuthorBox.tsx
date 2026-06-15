/**
 * Author-Box + CTA am Ende eines Blog-Posts.
 * Stefan-Bio mit Portrait, kurze Selbstbeschreibung, Link auf /ueber +
 * LinkedIn, plus Brand-CTA „Lagebild starten" als Conversion-Hook.
 *
 * Server-Component.
 */

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

export default function AuthorBox() {
  return (
    <section
      aria-label="Über den Autor"
      className="mt-20"
      style={{
        padding: 'clamp(28px, 4vw, 40px)',
        background:
          'linear-gradient(145deg, rgba(28, 27, 24, 0.85), rgba(15, 14, 12, 0.92))',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--r-md)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="flex flex-col gap-8 md:flex-row md:items-start">
        {/* Portrait */}
        <div className="shrink-0">
          <div
            className="relative overflow-hidden"
            style={{
              width: 96,
              height: 96,
              borderRadius: 'var(--r-md)',
              border: '1px solid var(--border-brand)',
              boxShadow: 'var(--sh-glow)',
            }}
          >
            <Image
              src="/assets/portrait/stefan-shirt.webp"
              alt="Stefan Braum"
              fill
              sizes="96px"
              className="object-cover"
              style={{ objectPosition: 'center 22%' }}
            />
          </div>
        </div>

        {/* Text */}
        <div className="flex-1">
          <p
            className="font-mono uppercase"
            style={{
              fontSize: 10,
              letterSpacing: '0.22em',
              color: 'var(--brand)',
              marginBottom: 10,
            }}
          >
            Über den Autor
          </p>
          <p
            className="font-display font-semibold"
            style={{
              fontSize: 22,
              lineHeight: 1.2,
              letterSpacing: '-0.01em',
              color: 'var(--fg-default)',
              marginBottom: 12,
            }}
          >
            Stefan Braum
          </p>
          <p
            className="font-body"
            style={{
              fontSize: 15,
              lineHeight: 1.6,
              color: 'var(--fg-muted)',
              marginBottom: 18,
              maxWidth: 560,
            }}
          >
            Operator statt Berater. IT-Verantwortung in der DACH-Industrie und
            eigene Praxis für KMU. Schreibt aus laufenden Engagements — keine
            Folien, keine Theorie ohne Substanz.
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href="/ueber"
              data-cursor="link"
              className="cta-ghost inline-flex items-center gap-1.5 font-body transition-colors duration-220"
              style={{
                fontSize: 14,
                color: 'var(--fg-default)',
              }}
            >
              Über Stefan
              <ArrowUpRight size={13} strokeWidth={1.5} />
            </Link>
            <a
              href="https://www.linkedin.com/in/stefanbraum"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              className="cta-ghost inline-flex items-center gap-1.5 font-body transition-colors duration-220"
              style={{
                fontSize: 14,
                color: 'var(--fg-default)',
              }}
            >
              LinkedIn
              <ArrowUpRight size={13} strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </div>

      {/* Conversion-CTA */}
      <div
        className="mt-8 flex flex-col items-start gap-4 border-t pt-7 md:flex-row md:items-center md:justify-between"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div>
          <p
            className="font-display font-medium"
            style={{
              fontSize: 17,
              lineHeight: 1.4,
              color: 'var(--fg-default)',
              letterSpacing: '-0.005em',
            }}
          >
            Klingt nach deiner Lage?
          </p>
          <p
            className="font-body"
            style={{
              fontSize: 14,
              lineHeight: 1.45,
              color: 'var(--fg-muted)',
              marginTop: 4,
            }}
          >
            4 Minuten Selbst-Check, persönliches Briefing per Mail.
          </p>
        </div>
        <Link
          href="/lagebild/check"
          data-cursor="magnetic"
          className="cta-primary inline-flex shrink-0 items-center gap-2 font-body font-semibold"
          style={{
            padding: '14px 24px',
            fontSize: 14,
            background: 'var(--accent)',
            color: 'var(--on-accent)',
            borderRadius: 'var(--r-sm)',
            boxShadow: 'var(--sh-2)',
          }}
        >
          Lagebild starten
          <ArrowRight size={14} strokeWidth={1.5} />
        </Link>
      </div>
    </section>
  )
}
