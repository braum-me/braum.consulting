import Section from '@/components/ui/Section'
import Eyebrow from '@/components/ui/Eyebrow'
import AnimatedGradient from '@/components/ui/AnimatedGradient'
import MonogramOutline from '@/components/ui/MonogramOutline'

interface PageHeroProps {
  eyebrowNum?: string
  eyebrow:    string
  title:      React.ReactNode
  lede?:      React.ReactNode
  children?:  React.ReactNode
  /**
   * Kompaktes Spacing für textlastige Pages (Blog).
   * Default-Hero ist auf Banner-Wirkung getrimmt, Blog braucht straffer.
   */
  compact?:   boolean
}

/**
 * Banner-Hero für alle Sub-Pages (/cases, /ueber, /kontakt, /leistungen, /blog).
 * Entspricht dem Footer-Treatment: AnimatedGradient + Top-Accent-Line +
 * Outline-Monogramm rechts + Editorial-Headline-Block links.
 */
export default function PageHero({
  eyebrowNum,
  eyebrow,
  title,
  lede,
  children,
  compact = false,
}: PageHeroProps) {
  const outerPadding = compact
    ? 'overflow-hidden pb-20 pt-32 md:pb-32 md:pt-44'
    : 'overflow-hidden pb-24 pt-40 md:pb-48 md:pt-72'
  const innerPadding = compact
    ? 'px-6 py-4 md:px-12 md:py-6'
    : 'px-6 py-6 md:px-12 md:py-10'

  return (
    <Section
      grain={false}
      fullBleed
      className={outerPadding}
    >
      <AnimatedGradient variant="mesh" />

      {/* Outline-Monogramm rechts, vertikal mittig, wie Footer-Banner */}
      <div
        aria-hidden
        className="pointer-events-none absolute hidden md:block"
        style={{
          right: '-8vw',
          top: '50%',
          transform: 'translateY(-50%)',
          width: 'clamp(420px, 48vw, 760px)',
          aspectRatio: '2 / 1',
          color: '#F2F0EB',
          opacity: 0.12,
          filter:
            'drop-shadow(0 0 50px rgba(200, 98, 42, 0.55)) drop-shadow(0 0 16px rgba(220, 128, 68, 0.38))',
          zIndex: 1,
        }}
      >
        <MonogramOutline strokeWidth={0.85} style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Top-Accent-Line */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(200, 98, 42, 0.50) 22%, rgba(220, 128, 68, 0.70) 50%, rgba(200, 98, 42, 0.50) 78%, transparent 100%)',
        }}
      />

      <div className={`relative z-[3] mx-auto w-full max-w-[var(--container-wide)] ${innerPadding}`}>
        <div className="max-w-[960px]">
          <Eyebrow num={eyebrowNum}>{eyebrow}</Eyebrow>
          <h1
            className="mt-12 font-display font-black"
            style={{
              fontSize: 'clamp(40px, 6.4vw, 96px)',
              lineHeight: 'var(--lh-display)',
              letterSpacing: 'var(--tr-display)',
              color: 'var(--fg-default)',
            }}
          >
            {title}
          </h1>
          {lede && (
            <p
              className="mt-10 max-w-[620px] font-body"
              style={{
                fontSize: 'var(--t-body-lg)',
                lineHeight: 1.6,
                color: 'var(--fg-muted)',
              }}
            >
              {lede}
            </p>
          )}
          {children}
        </div>
      </div>
    </Section>
  )
}
