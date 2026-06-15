import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import ItalicAccent from '@/components/ui/ItalicAccent'
import AnimatedGradient from '@/components/ui/AnimatedGradient'
import { LostCompassVisual } from '@/components/ui/LostCompassVisual'
import { TopLinks } from '@/components/ui/TopLinks'

export default function NotFound() {
  return (
    <div
      className="relative flex w-screen flex-col items-center justify-center overflow-hidden"
      style={{
        marginLeft: 'calc(-50vw + 50%)',
        minHeight: '100vh',
        background: 'var(--bg-base)',
        padding: '120px 24px',
      }}
    >
      <AnimatedGradient variant="hero" />

      <div
        className="relative z-[3] grid w-full items-center"
        style={{
          maxWidth: '1080px',
          gridTemplateColumns: '1fr',
          gap: '48px',
        }}
      >
        <div
          className="md:grid md:items-center"
          style={{
            gridTemplateColumns: '360px 1fr',
            gap: 'clamp(36px, 5vw, 72px)',
          }}
        >
          <div className="flex justify-center md:justify-start">
            <LostCompassVisual />
          </div>

          <div className="text-center md:text-left">
            <span
              className="inline-flex items-center gap-2 font-mono uppercase"
              style={{
                fontSize: '11px',
                letterSpacing: '0.20em',
                color: 'var(--brand)',
                marginBottom: '24px',
              }}
            >
              404 · Diese Seite gibt es nicht
            </span>

            <h1
              className="font-display font-black"
              style={{
                fontSize: 'clamp(44px, 6vw, 88px)',
                lineHeight: 1,
                letterSpacing: 'var(--tr-display)',
                color: 'var(--fg-default)',
              }}
            >
              Hier ist <ItalicAccent>nichts</ItalicAccent> mehr.
            </h1>

            <p
              className="mx-auto font-body md:mx-0"
              style={{
                fontSize: '18px',
                lineHeight: 1.6,
                color: 'var(--fg-muted)',
                maxWidth: '440px',
                marginTop: '24px',
              }}
            >
              Sieht aus, als hättest du dich verlaufen. Entweder hat ein
              alter Link das Ziel verloren, oder ich habe aufgeräumt. Beides
              passiert — hier geht's weiter.
            </p>

            <div
              className="flex flex-wrap items-center justify-center md:justify-start"
              style={{ gap: '24px', marginTop: '40px' }}
            >
              <Link
                href="/"
                data-cursor="magnetic"
                className="cta-primary inline-flex items-center gap-2 font-body font-semibold"
                style={{
                  padding: '16px 28px',
                  fontSize: '15px',
                  background: 'var(--accent)',
                  color: 'var(--on-accent)',
                  borderRadius: 'var(--r-sm)',
                  boxShadow: 'var(--sh-2)',
                }}
              >
                Zur Startseite
                <ArrowRight size={16} strokeWidth={1.5} />
              </Link>
              <Link
                href="/kontakt"
                data-cursor="magnetic"
                className="cta-ghost inline-flex items-center gap-2 font-body transition-colors duration-220 hover:text-[color:var(--fg-default)]"
                style={{
                  fontSize: '15px',
                  color: 'var(--fg-muted)',
                }}
              >
                Stattdessen Kontakt
                <ArrowUpRight size={14} strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </div>

        <div
          style={{
            paddingTop: '40px',
            borderTop: '1px solid var(--border-default)',
          }}
        >
          <TopLinks heading="Vielleicht suchst du das" align="start" />
        </div>
      </div>
    </div>
  )
}
