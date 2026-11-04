'use client'

/**
 * Marke-Showcase — Full-Ausbau-Pattern für /leistungen/marke.
 *
 * Bewusst client-side für Motion + interaktive Tabs + Before/After-Slider.
 * Demo der Liquid-Glass-Möglichkeiten + viel atmosphärisches Storytelling.
 *
 * Before/After-Slider zeigt die echten Logo-SVGs aus /public/assets/logo/.
 */

import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion, useInView, AnimatePresence } from 'motion/react'
import {
  ArrowRight, Zap, Code, Search, Mail,
  Server, KeyRound, Scale, Minus,
  CheckCircle2, Megaphone, Target, MailCheck, TrendingUp, Check,
} from 'lucide-react'
import ItalicAccent from '@/components/ui/ItalicAccent'
import GlossarHighlight from '@/components/ui/GlossarHighlight'
import CountUp from '@/components/ui/CountUp'

const EASE = [0.16, 1, 0.3, 1] as const

/* ── 1 · Brand-System-Showcase mit Brandbook-Demo am eigenen Beispiel ─── */

const BRAUM_TOKENS = [
  { hex: '#0F0E0C', name: 'bg-base',     role: 'Canvas' },
  { hex: '#1C1B18', name: 'bg-overlay',  role: 'Surface' },
  { hex: '#DC8044', name: 'brand',       role: 'Identity-Akzent' },
  { hex: '#C8622A', name: 'accent',      role: 'CTA-Primary' },
  { hex: '#F2F0EB', name: 'fg-default',  role: 'Text-Primary' },
  { hex: '#8C8880', name: 'fg-muted',    role: 'Text-Secondary' },
]

const BRAUM_FONTS = [
  { font: 'Akmorn Grotesque, sans-serif', sample: 'Display',     weight: 800, role: 'Headlines, Eyebrows-Numbers' },
  { font: 'Geist Sans, sans-serif',       sample: 'Body Copy',   weight: 400, role: 'Lese-Text, UI-Komponenten' },
  { font: 'Geist Mono, monospace',        sample: 'mono · 01',   weight: 500, role: 'Eyebrows, Service-Nummern' },
  { font: 'Instrument Serif, serif',      sample: 'Akzent',      weight: 400, role: 'Italic-Highlight max 2× / Page', italic: true },
]

const BRAUM_VOICE = [
  { dont: 'Wir unterstützen Sie ganzheitlich bei der digitalen Transformation Ihres Unternehmens.', do: 'Du bekommst ein Lagebild. Dann entscheiden wir, was wirklich brennt.' },
  { dont: 'State-of-the-Art Microsoft 365 Implementierung mit Best Practices.', do: 'M365, sauber aufgesetzt. Keine Lizenz-Leichen, keine 17 Teams-Channels für drei Leute.' },
  { dont: 'Unsere KI-Lösungen revolutionieren Ihre Geschäftsprozesse.', do: 'AI da, wo sie spürbar Arbeit abnimmt — nicht da, wo sie nach Berater-PowerPoint klingt.' },
]

const BRAUM_RULES = [
  'Du-Form, immer. Niemals Sie.',
  'Sentence Case Headlines, nie Title Case.',
  'Italic-Accent max 2× pro Page, nur in Headlines.',
  'Logo immer als SVG aus /public/assets/logo, nie als Text.',
  'Border-Radius: 6px Buttons · 10px Cards · 14–20px Hero-Panels.',
  'Monogramm-Outline max 1× pro Section als Hintergrund-Akzent.',
]

/* ── 2 · Process Tabs ── */

const PROCESS = [
  {
    num: '01',
    title: 'Brand-Discovery',
    body: 'Workshop mit Geschäftsführung + Marketing. Was steht die Marke heute, wo sind die wirklichen Unterschiede zum Wettbewerb, welche Sprache greift bei Wunsch-Kunden.',
    duration: 'Woche 1',
  },
  {
    num: '02',
    title: 'System-Definition',
    body: 'Logo, Farben, Typografie, Voice-of-Brand, dokumentiert in einem Tokens-Repo. Keine 80-Seiten-Brandbook, sondern Code-readable Tokens die direkt in die Implementierung fliegen.',
    duration: 'Woche 2-3',
  },
  {
    num: '03',
    title: 'Website-Build',
    body: 'Next.js mit Tailwind oder WordPress mit eigenem Theme — je nach Editier-Anforderung. Performance-budget hart: Lighthouse 90+, kein „nice to have".',
    duration: 'Woche 4-9',
  },
  {
    num: '04',
    title: 'Reichweiten-Setup',
    body: 'SEO-Grundlage, Schema.org-Markup, RSS-Feed, llms.txt für LLM-Crawler, Newsletter-Anbindung, Tracking ohne Cookies (Umami). Erste Content-Konvertierung.',
    duration: 'Woche 10-12',
  },
]

/* ── 3 · Hosting-Modelle + Stack ── */

// Self-managed: nur das, was du selbst sauber betreiben kannst.
const SELF_STACK = ['WordPress', 'Elementor', 'Umami']

// Managed by me: der volle moderne Stack — läuft ausschließlich bei mir.
const MANAGED_STACK = [
  'WordPress', 'Next.js 16', 'Astro', 'React 19', 'TypeScript', 'Tailwind 4',
  'Motion', 'Three.js · R3F', 'GSAP', 'Sanity · Payload', 'Resend',
  'Cloudflare', 'Self-Hosted DE/EU', 'Backups · Monitoring',
]

const TIERS: Array<{
  Icon: typeof KeyRound
  badge: string
  title: string
  body: string
  stack: string[]
  featured: boolean
}> = [
  {
    Icon: KeyRound,
    badge: 'Self-managed',
    title: 'Du hostest, du pflegst.',
    body:  'Klassisches WordPress, sauber aufgesetzt und dir vollständig übergeben. Du pflegst im vertrauten Backend, ich schule dein Team. Volle Hoheit, keine Bindung.',
    stack: SELF_STACK,
    featured: false,
  },
  {
    Icon: Server,
    badge: 'Managed by me',
    title: 'Ich hoste, pflege, warte.',
    body:  'Der volle moderne Stack — du machst nichts. Hosting auf DE/EU-Servern (Hetzner, OVH, IONOS), Updates, Backups, Security-Patches, Monitoring. Fester monatlicher Rahmen.',
    stack: MANAGED_STACK,
    featured: true,
  },
]

// Kachel 3: Vergleich — was sich zwischen den beiden Wegen unterscheidet.
// boolean → Haken/Strich, string → Wert.
const COMPARE: Array<{ label: string; self: string | boolean; managed: string | boolean }> = [
  { label: 'Hosting',              self: 'bei dir',    managed: 'ich · DE/EU' },
  { label: 'Pflege & Updates',     self: 'du selbst',  managed: 'ich' },
  { label: 'Moderner Stack',       self: false,        managed: true },
  { label: 'Backups & Monitoring', self: false,        managed: true },
  { label: 'DE/EU-Server',         self: 'deine Wahl', managed: true },
  { label: 'Abrechnung',           self: 'einmalig',   managed: 'monatlich' },
]

export default function MarkeShowcase() {
  return (
    <>
      <Section1BrandSystem />
      <Section2BeforeAfter />
      <Section3Process />
      <Section4Hosting />
      <Section5Showcase />
      <Section6Growth />
    </>
  )
}

/* ─────────────────────────────────────────────────────────────────── */

function Section1BrandSystem() {
  return (
    <section
      aria-label="Brand-System am eigenen Beispiel"
      style={{
        maxWidth: 'var(--container-wide)',
        margin: '0 auto',
        padding: 'clamp(80px, 10vw, 128px) 24px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-15%' }}
        transition={{ duration: 0.7, ease: EASE }}
        style={{ maxWidth: '900px' }}
      >
        <p
          className="font-mono uppercase"
          style={{
            fontSize: '11px',
            letterSpacing: '0.20em',
            color: 'var(--brand)',
            marginBottom: '20px',
          }}
        >
          01 · Was du bekommst — am eigenen Beispiel
        </p>
        <h2
          className="font-display font-bold"
          style={{
            fontSize: 'clamp(36px, 4.8vw, 64px)',
            lineHeight: 1.05,
            letterSpacing: 'var(--tr-display)',
            color: 'var(--fg-default)',
          }}
        >
          Ein komplettes <ItalicAccent>Brand-System</ItalicAccent> — nicht
          nur ein Logo.
        </h2>
        <p
          className="mt-6 font-body"
          style={{
            fontSize: '17px',
            lineHeight: 1.65,
            color: 'var(--fg-muted)',
            maxWidth: '720px',
          }}
        >
          <GlossarHighlight text="Positionierung, Logo-System, Color-Tokens, Type-Stack, Brand-Rules, Tone of Voice — dokumentiert, code-getrieben, jederzeit nachvollziehbar. Genau das, was du in dieser Section live siehst, ist das Setup von Braum Consulting selbst." />
        </p>
      </motion.div>

      <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-12">
        {/* Positionierung — wide */}
        <BrandPanel cols="lg:col-span-12" eyebrow="Positionierung" delay={0}>
          <p
            className="font-display font-medium"
            style={{
              fontSize: 'clamp(22px, 2.6vw, 32px)',
              lineHeight: 1.25,
              letterSpacing: 'var(--tr-heading)',
              color: 'var(--fg-default)',
              maxWidth: '900px',
            }}
          >
            Digitaler Lotse für Mittelstand und Industrie. Marke, M365, AI
            &amp; Automatisierung, Transformation — vier Felder, eine{' '}
            <ItalicAccent>Hand</ItalicAccent>.
          </p>
        </BrandPanel>

        {/* Logo-System */}
        <BrandPanel cols="lg:col-span-7" eyebrow="Logo-System" delay={0.08}>
          <div className="flex flex-col gap-3">
            <LogoSlot
              variant="wordmark"
              caption="Wordmark · primary lockup"
            />
            <div className="grid grid-cols-2 gap-3">
              <LogoSlot variant="icon-solid" caption="Icon · solid" />
              <LogoSlot variant="icon-outline" caption="Icon · outline" />
            </div>
          </div>
        </BrandPanel>

        {/* Color-Tokens */}
        <BrandPanel cols="lg:col-span-5" eyebrow="Color-Tokens" delay={0.16}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {BRAUM_TOKENS.map(t => (
              <li
                key={t.name}
                className="flex items-center gap-3 border-b py-2.5 last:border-b-0"
                style={{ borderColor: 'var(--border-subtle)' }}
              >
                <span
                  aria-hidden
                  className="shrink-0"
                  style={{
                    width: 30,
                    height: 30,
                    background: t.hex,
                    borderRadius: 'var(--r-sm)',
                    border: '1px solid rgba(245, 245, 250, 0.08)',
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p
                    className="font-mono"
                    style={{
                      fontSize: '11px',
                      color: 'var(--fg-default)',
                    }}
                  >
                    --{t.name}
                  </p>
                  <p
                    className="font-mono"
                    style={{
                      fontSize: '10px',
                      color: 'var(--fg-subtle)',
                    }}
                  >
                    {t.role}
                  </p>
                </div>
                <span
                  className="font-mono uppercase shrink-0"
                  style={{
                    fontSize: '9px',
                    letterSpacing: '0.10em',
                    color: 'var(--fg-muted)',
                  }}
                >
                  {t.hex}
                </span>
              </li>
            ))}
          </ul>
        </BrandPanel>

        {/* Type-Stack */}
        <BrandPanel cols="lg:col-span-7" eyebrow="Type-Stack" delay={0.24}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {BRAUM_FONTS.map(f => (
              <li
                key={f.sample}
                className="border-b py-3 last:border-b-0"
                style={{ borderColor: 'var(--border-subtle)' }}
              >
                <div className="flex items-baseline justify-between gap-6">
                  <span
                    style={{
                      fontFamily: f.font,
                      fontSize: 'clamp(20px, 2.4vw, 28px)',
                      fontWeight: f.weight,
                      fontStyle: f.italic ? 'italic' : 'normal',
                      color: 'var(--fg-default)',
                    }}
                  >
                    {f.sample}
                  </span>
                  <span
                    className="font-mono uppercase shrink-0"
                    style={{
                      fontSize: '9px',
                      letterSpacing: '0.16em',
                      color: 'var(--fg-subtle)',
                    }}
                  >
                    {f.font.split(',')[0]}
                  </span>
                </div>
                <p
                  className="mt-1 font-mono"
                  style={{
                    fontSize: '11px',
                    color: 'var(--fg-muted)',
                  }}
                >
                  {f.role}
                </p>
              </li>
            ))}
          </ul>
        </BrandPanel>

        {/* Brand-Rules */}
        <BrandPanel cols="lg:col-span-5" eyebrow="Brand-Rules · Hard Nos" delay={0.32}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {BRAUM_RULES.map(r => (
              <li key={r} className="flex items-start gap-3 py-1.5">
                <span
                  aria-hidden
                  className="font-mono"
                  style={{
                    fontSize: '11px',
                    color: 'var(--accent)',
                    paddingTop: '2px',
                  }}
                >
                  ✓
                </span>
                <span
                  className="font-body"
                  style={{
                    fontSize: '13px',
                    lineHeight: 1.5,
                    color: 'var(--fg-default)',
                  }}
                >
                  {r}
                </span>
              </li>
            ))}
          </ul>
        </BrandPanel>

        {/* Tone of Voice — wide */}
        <BrandPanel cols="lg:col-span-12" eyebrow="Tone of Voice — quiet, expert, plain" delay={0.4}>
          <ul
            className="grid grid-cols-1 gap-6 md:grid-cols-3"
            style={{ listStyle: 'none', padding: 0, margin: 0 }}
          >
            {BRAUM_VOICE.map((v, i) => (
              <li key={i}>
                <p
                  className="font-mono uppercase"
                  style={{
                    fontSize: '9px',
                    letterSpacing: '0.20em',
                    color: '#92301E',
                    marginBottom: '8px',
                  }}
                >
                  ✗ statt
                </p>
                <p
                  className="font-body italic"
                  style={{
                    fontSize: '13px',
                    lineHeight: 1.55,
                    color: 'var(--fg-subtle)',
                    marginBottom: '18px',
                  }}
                >
                  „{v.dont}"
                </p>
                <p
                  className="font-mono uppercase"
                  style={{
                    fontSize: '9px',
                    letterSpacing: '0.20em',
                    color: 'var(--brand)',
                    marginBottom: '8px',
                  }}
                >
                  ✓ so
                </p>
                <p
                  className="font-body"
                  style={{
                    fontSize: '14px',
                    lineHeight: 1.55,
                    color: 'var(--fg-default)',
                  }}
                >
                  „{v.do}"
                </p>
              </li>
            ))}
          </ul>
        </BrandPanel>
      </div>
    </section>
  )
}

function BrandPanel({
  cols,
  eyebrow,
  delay,
  children,
}: {
  cols:     string
  eyebrow:  string
  delay:    number
  children: React.ReactNode
}) {
  return (
    <motion.article
      className={`glass-card relative ${cols}`}
      style={{ padding: '28px 30px', minHeight: '200px' }}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.55, delay, ease: EASE }}
    >
      <div className="relative z-[3]">
        <p
          className="font-mono uppercase"
          style={{
            fontSize: '10px',
            letterSpacing: '0.18em',
            color: 'var(--fg-subtle)',
            marginBottom: '20px',
          }}
        >
          {eyebrow}
        </p>
        {children}
      </div>
    </motion.article>
  )
}

function LogoSlot({
  variant,
  caption,
}: {
  variant: 'wordmark' | 'icon-solid' | 'icon-outline'
  caption: string
}) {
  // Alle SVGs sind unfilled (cls-1 ohne style) → mit brightness(0) invert(1) garantiert weiß.
  // Outline-SVG benutzt currentColor via stroke — Brand-Orange erbt aus color.
  const src =
    variant === 'wordmark'     ? '/assets/logo/logo-04.svg'
  : variant === 'icon-solid'   ? '/assets/logo/logo-icon-white.svg'
  : /* outline */                '/assets/logo/logo-icon-outline.svg'

  const ratio   = variant === 'wordmark' ? '4 / 1' : '1.3 / 1'
  const padding = variant === 'wordmark' ? '20px 28px' : '18px'

  return (
    <div
      style={{
        background:
          variant === 'icon-outline'
            ? 'transparent'
            : 'var(--bg-overlay)',
        borderRadius: 'var(--r-sm)',
        border: variant === 'icon-outline'
          ? '1px solid var(--border-strong)'
          : '1px solid var(--border-subtle)',
        padding,
        position: 'relative',
        color: undefined,
      }}
    >
      <div
        style={{
          aspectRatio: ratio,
          position: 'relative',
          width: '100%',
        }}
      >
        <Image
          src={src}
          alt={`Braum Consulting · ${caption}`}
          fill
          sizes="(min-width: 1024px) 320px, 100vw"
          style={{
            objectFit: 'contain',
            // Alle SVGs auf weiß zwingen — currentColor greift bei <img>-Rendering nicht.
            filter: 'brightness(0) invert(1)',
          }}
        />
      </div>
      <p
        className="mt-3 font-mono uppercase"
        style={{
          fontSize: '9px',
          letterSpacing: '0.18em',
          color: 'var(--fg-subtle)',
        }}
      >
        {caption}
      </p>
    </div>
  )
}

/* ── 2 · Before/After Slider ──────────────────────────────────────── */

function Section2BeforeAfter() {
  const [pos, setPos] = useState(50)
  const reduceMotion = useReducedMotion()

  return (
    <section
      aria-label="Vorher / Nachher"
      style={{
        maxWidth: 'var(--container-wide)',
        margin: '0 auto',
        padding: 'clamp(80px, 10vw, 128px) 24px',
      }}
    >
      <div style={{ maxWidth: '780px', marginBottom: '40px' }}>
        <p
          className="font-mono uppercase"
          style={{
            fontSize: '11px',
            letterSpacing: '0.20em',
            color: 'var(--brand)',
            marginBottom: '20px',
          }}
        >
          02 · Vorher / Nachher
        </p>
        <h2
          className="font-display font-bold"
          style={{
            fontSize: 'clamp(36px, 4.8vw, 64px)',
            lineHeight: 1.05,
            letterSpacing: 'var(--tr-display)',
            color: 'var(--fg-default)',
          }}
        >
          Der <ItalicAccent>Unterschied</ItalicAccent> ist sichtbar.
        </h2>
        <p
          className="mt-4 font-body"
          style={{
            fontSize: '17px',
            lineHeight: 1.65,
            color: 'var(--fg-muted)',
            maxWidth: '560px',
          }}
        >
          Schieb den Slider, um den Wechsel von altem Brand-Setup zur neuen
          Identity zu sehen.
        </p>
      </div>

      <div
        className="relative overflow-hidden"
        style={{
          aspectRatio: '16 / 9',
          borderRadius: 'var(--r-md)',
          border: '1px solid var(--border-subtle)',
          background: 'var(--bg-elevated)',
        }}
      >
        {/* After (Basis-Layer — wird vom Before-Clip auf der LINKEN Seite überdeckt) */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 70% at 70% 30%, rgba(220, 128, 68, 0.25) 0%, transparent 65%),' +
              'radial-gradient(50% 60% at 20% 80%, rgba(146, 48, 30, 0.20) 0%, transparent 60%),' +
              'linear-gradient(135deg, #1C1B18 0%, #0F0E0C 100%)',
          }}
        >
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ padding: '24px' }}
          >
            <span
              className="font-mono uppercase"
              style={{
                fontSize: '10px',
                letterSpacing: '0.20em',
                color: 'var(--brand)',
                marginBottom: '12px',
              }}
            >
              Nachher
            </span>
            <span
              className="font-display font-black"
              style={{
                fontSize: 'clamp(28px, 4vw, 56px)',
                color: 'var(--fg-default)',
                lineHeight: 1,
                letterSpacing: 'var(--tr-display)',
              }}
            >
              Brand mit <ItalicAccent>Kante</ItalicAccent>.
            </span>
            <span
              className="font-mono"
              style={{
                fontSize: '12px',
                color: 'var(--fg-muted)',
                marginTop: '12px',
                letterSpacing: '0.08em',
              }}
            >
              · präzise · differenziert · merkfähig
            </span>
          </div>
        </div>

        {/* Before (clip-path: nur links sichtbar) */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            clipPath: `inset(0 ${100 - pos}% 0 0)`,
            background:
              'linear-gradient(135deg, #4A4742 0%, #2E2D2A 60%, #1F1E1C 100%)',
            transition: reduceMotion ? 'none' : 'clip-path 100ms linear',
          }}
        >
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ padding: '24px' }}
          >
            <span
              className="font-mono uppercase"
              style={{
                fontSize: '10px',
                letterSpacing: '0.20em',
                color: 'var(--fg-subtle)',
                marginBottom: '12px',
              }}
            >
              Vorher
            </span>
            <span
              style={{
                fontFamily: 'Times, serif',
                fontSize: 'clamp(28px, 4vw, 56px)',
                color: '#BAB6AE',
                fontWeight: 400,
                letterSpacing: '0.02em',
              }}
            >
              Generische Stock-Optik
            </span>
            <span
              style={{
                fontFamily: 'Times, serif',
                fontSize: '14px',
                color: '#6C6862',
                marginTop: '12px',
              }}
            >
              · langweilig · austauschbar · ohne Position ·
            </span>
          </div>
        </div>

        {/* Slider-Handle */}
        <div
          className="absolute inset-y-0 z-10"
          style={{
            left: `${pos}%`,
            transform: 'translateX(-50%)',
            width: '4px',
            background: 'var(--accent)',
            boxShadow: '0 0 16px rgba(220, 128, 68, 0.7)',
          }}
        >
          <span
            className="absolute top-1/2 flex items-center justify-center"
            style={{
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'var(--accent)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5), 0 0 24px rgba(220, 128, 68, 0.5)',
              cursor: 'ew-resize',
            }}
          >
            <span style={{ color: 'var(--on-accent)', fontSize: '12px' }}>↔</span>
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={e => setPos(Number(e.target.value))}
          aria-label="Vorher/Nachher-Slider"
          className="absolute inset-0 z-20 w-full cursor-ew-resize opacity-0"
          style={{ appearance: 'none' }}
        />
      </div>
    </section>
  )
}

/* ── 3 · Process Tabs ─────────────────────────────────────────────── */

function Section3Process() {
  const [active, setActive] = useState(0)
  const current = PROCESS[active]

  return (
    <section
      aria-label="Prozess"
      style={{
        maxWidth: 'var(--container-wide)',
        margin: '0 auto',
        padding: 'clamp(80px, 10vw, 128px) 24px',
      }}
    >
      <div style={{ marginBottom: '48px' }}>
        <p
          className="font-mono uppercase"
          style={{
            fontSize: '11px',
            letterSpacing: '0.20em',
            color: 'var(--brand)',
            marginBottom: '20px',
          }}
        >
          03 · So entsteht es
        </p>
        <h2
          className="font-display font-bold"
          style={{
            fontSize: 'clamp(36px, 4.8vw, 64px)',
            lineHeight: 1.05,
            letterSpacing: 'var(--tr-display)',
            color: 'var(--fg-default)',
          }}
        >
          Vier Phasen, ein <ItalicAccent>Bogen</ItalicAccent>.
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[260px_1fr] md:gap-16">
        {/* Tabs */}
        <ul role="tablist" aria-label="Prozess-Phasen" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {PROCESS.map((p, i) => (
            <li key={p.num}>
              <button
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`Phase ${p.num}: ${p.title}`}
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                data-cursor="link"
                className="flex w-full items-start gap-4 text-left transition-all duration-300"
                style={{
                  padding: '16px 18px',
                  background: i === active ? 'rgba(220, 128, 68, 0.08)' : 'transparent',
                  borderLeft: i === active
                    ? '2px solid var(--accent)'
                    : '2px solid transparent',
                }}
              >
                <span
                  className="font-mono"
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.18em',
                    color: i === active ? 'var(--accent)' : 'var(--fg-subtle)',
                    paddingTop: '2px',
                  }}
                >
                  {p.num}
                </span>
                <div className="flex-1">
                  <p
                    className="font-display font-medium"
                    style={{
                      fontSize: '16px',
                      color: i === active ? 'var(--fg-default)' : 'var(--fg-muted)',
                      transition: 'color 220ms',
                    }}
                  >
                    {p.title}
                  </p>
                  <p
                    className="mt-1 font-mono uppercase"
                    style={{
                      fontSize: '9px',
                      letterSpacing: '0.18em',
                      color: 'var(--fg-subtle)',
                    }}
                  >
                    {p.duration}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>

        {/* Detail */}
        <div className="md:sticky md:top-32 md:self-start">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.num}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="glass-card relative"
              style={{ padding: '40px 36px' }}
            >
              <div className="relative z-[3]">
                <p
                  className="font-mono uppercase"
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.20em',
                    color: 'var(--brand)',
                  }}
                >
                  {current.num} · {current.duration}
                </p>
                <h3
                  className="mt-4 font-display font-bold"
                  style={{
                    fontSize: 'clamp(28px, 3.4vw, 44px)',
                    lineHeight: 1.1,
                    letterSpacing: 'var(--tr-heading)',
                    color: 'var(--fg-default)',
                  }}
                >
                  {current.title}
                </h3>
                <p
                  className="mt-6 font-body"
                  style={{
                    fontSize: '17px',
                    lineHeight: 1.7,
                    color: 'var(--fg-default)',
                    opacity: 0.85,
                  }}
                >
                  <GlossarHighlight text={current.body} />
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

/* ── 4 · Hosting-Modelle + Stack-Strip ────────────────────────────── */

/** Zelle der Vergleichs-Matrix: bool → Haken/Strich, string → Wert. */
function CompareCell({ value, managed }: { value: string | boolean; managed: boolean }) {
  if (value === true) return <Check size={15} strokeWidth={2.5} style={{ color: 'var(--accent)' }} />
  if (value === false) return <Minus size={14} strokeWidth={2} style={{ color: 'var(--fg-faint)' }} />
  return (
    <span
      className="font-mono"
      style={{ fontSize: '10px', lineHeight: 1.2, textAlign: 'center', color: managed ? 'var(--brand)' : 'var(--fg-muted)' }}
    >
      {value}
    </span>
  )
}

function Section4Hosting() {
  return (
    <section
      aria-label="Hosting-Modelle"
      style={{
        maxWidth: 'var(--container-wide)',
        margin: '0 auto',
        padding: 'clamp(80px, 10vw, 128px) 24px',
      }}
    >
      <div className="mb-12 max-w-[760px]">
        <p
          className="font-mono uppercase"
          style={{
            fontSize: '11px',
            letterSpacing: '0.20em',
            color: 'var(--brand)',
            marginBottom: '20px',
          }}
        >
          04 · Wie es läuft
        </p>
        <h2
          className="font-display font-bold"
          style={{
            fontSize: 'clamp(36px, 4.8vw, 64px)',
            lineHeight: 1.05,
            letterSpacing: 'var(--tr-display)',
            color: 'var(--fg-default)',
          }}
        >
          Zwei Wege — du hostest,
          oder <ItalicAccent>ich übernehme</ItalicAccent>.
        </h2>
        <p
          className="mt-6 font-body"
          style={{
            fontSize: '17px',
            lineHeight: 1.65,
            color: 'var(--fg-muted)',
          }}
        >
          <GlossarHighlight text="Zwei Wege: Das klassische WordPress-Setup betreibst du selbst — den vollen modernen Stack betreibe ich für dich, standardmäßig auf Servern in Deutschland und der EU." />
        </p>
      </div>

      <ul
        className="grid grid-cols-1 gap-5 md:grid-cols-3"
        style={{ listStyle: 'none', padding: 0, margin: 0 }}
      >
        {/* ── Kachel 1 + 2 — Self-managed & Managed by me ── */}
        {TIERS.map((t, i) => (
          <motion.li
            key={t.badge}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.55, delay: i * 0.08, ease: EASE }}
            className="glass-card relative h-full"
            style={{
              padding: '28px 26px',
              border: t.featured ? '1px solid rgba(220, 128, 68, 0.40)' : undefined,
              background: t.featured
                ? 'linear-gradient(160deg, rgba(220,128,68,0.10) 0%, rgba(220,128,68,0.02) 60%)'
                : undefined,
            }}
          >
            <div className="relative z-[3] flex h-full flex-col">
              <div className="flex items-start justify-between gap-3">
                <span
                  className="inline-flex h-10 w-10 items-center justify-center"
                  style={{
                    background: 'rgba(220, 128, 68, 0.10)',
                    border: '1px solid rgba(220, 128, 68, 0.22)',
                    borderRadius: 'var(--r-sm)',
                    color: 'var(--brand)',
                  }}
                >
                  <t.Icon size={16} strokeWidth={1.5} />
                </span>
                {t.featured && (
                  <span
                    className="font-mono uppercase"
                    style={{
                      fontSize: '9px',
                      letterSpacing: '0.18em',
                      color: 'var(--accent)',
                      padding: '4px 10px',
                      background: 'rgba(220, 128, 68, 0.10)',
                      border: '1px solid rgba(220, 128, 68, 0.30)',
                      borderRadius: 'var(--r-pill)',
                    }}
                  >
                    Empfehlung
                  </span>
                )}
              </div>

              <p className="mt-5 font-mono uppercase" style={{ fontSize: '10px', letterSpacing: '0.18em', color: 'var(--brand)' }}>
                {t.badge}
              </p>
              <h3 className="mt-2 font-display font-semibold" style={{ fontSize: '20px', lineHeight: 1.2, letterSpacing: 'var(--tr-heading)', color: 'var(--fg-default)' }}>
                {t.title}
              </h3>
              <p className="mt-3 font-body" style={{ fontSize: '14px', lineHeight: 1.55, color: 'var(--fg-muted)' }}>
                <GlossarHighlight text={t.body} />
              </p>

              <p className="mt-auto pt-6 font-mono uppercase" style={{ fontSize: '9px', letterSpacing: '0.18em', color: t.featured ? 'var(--accent)' : 'var(--fg-subtle)', marginBottom: '10px' }}>
                {t.featured ? 'Voller Stack — bei mir' : 'Läuft self-managed'}
              </p>
              <ul className="flex flex-wrap gap-1.5" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {t.stack.map(s => (
                  <li
                    key={s}
                    className="font-mono"
                    style={{
                      fontSize: '10.5px',
                      padding: '5px 10px',
                      borderRadius: 'var(--r-pill)',
                      letterSpacing: '0.02em',
                      background: t.featured ? 'rgba(220, 128, 68, 0.12)' : 'var(--bg-overlay)',
                      border: t.featured ? '1px solid rgba(220, 128, 68, 0.35)' : '1px solid var(--border-subtle)',
                      color: t.featured ? 'var(--brand)' : 'var(--fg-default)',
                    }}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </motion.li>
        ))}

        {/* ── Kachel 3 — Vergleich: Was ich wie liefere ── */}
        <motion.li
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.55, delay: 0.16, ease: EASE }}
          className="glass-card relative h-full"
          style={{ padding: '28px 26px' }}
        >
          <div className="relative z-[3] flex h-full flex-col">
            <span
              className="inline-flex h-10 w-10 items-center justify-center"
              style={{ background: 'rgba(220, 128, 68, 0.10)', border: '1px solid rgba(220, 128, 68, 0.22)', borderRadius: 'var(--r-sm)', color: 'var(--brand)' }}
            >
              <Scale size={16} strokeWidth={1.5} />
            </span>
            <p className="mt-5 font-mono uppercase" style={{ fontSize: '10px', letterSpacing: '0.18em', color: 'var(--brand)' }}>
              Vergleich
            </p>
            <h3 className="mt-2 font-display font-semibold" style={{ fontSize: '20px', lineHeight: 1.2, letterSpacing: 'var(--tr-heading)', color: 'var(--fg-default)' }}>
              Was ich wie liefere.
            </h3>
            <p className="mt-3 font-body" style={{ fontSize: '14px', lineHeight: 1.55, color: 'var(--fg-muted)' }}>
              Ein Blick, alle Unterschiede — wer hostet, wer pflegt, welcher Stack.
            </p>

            {/* Matrix */}
            <div className="mt-auto" style={{ paddingTop: '22px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 70px 92px', alignItems: 'center', gap: 8, paddingBottom: 10 }}>
                <span />
                <span className="font-mono uppercase" style={{ fontSize: '9px', letterSpacing: '0.12em', color: 'var(--fg-subtle)', textAlign: 'center' }}>Self</span>
                <span className="font-mono uppercase" style={{ fontSize: '9px', letterSpacing: '0.12em', color: 'var(--accent)', textAlign: 'center' }}>Managed</span>
              </div>
              {COMPARE.map(row => (
                <div
                  key={row.label}
                  style={{ display: 'grid', gridTemplateColumns: '1fr 70px 92px', alignItems: 'center', gap: 8, padding: '9px 0', borderTop: '1px solid var(--border-subtle)' }}
                >
                  <span className="font-body" style={{ fontSize: '12.5px', color: 'var(--fg-default)' }}>{row.label}</span>
                  <span style={{ display: 'flex', justifyContent: 'center' }}><CompareCell value={row.self} managed={false} /></span>
                  <span style={{ display: 'flex', justifyContent: 'center' }}><CompareCell value={row.managed} managed /></span>
                </div>
              ))}
            </div>
          </div>
        </motion.li>
      </ul>
    </section>
  )
}


/* ── 5 · Final-Showcase: Tech & Performance ──────────────────────── */

function Section5Showcase() {
  return (
    <section
      aria-label="Showcase"
      style={{
        maxWidth: 'var(--container-wide)',
        margin: '0 auto',
        padding: 'clamp(80px, 10vw, 128px) 24px',
      }}
    >
      <div style={{ marginBottom: '40px', maxWidth: '760px' }}>
        <p
          className="font-mono uppercase"
          style={{
            fontSize: '11px',
            letterSpacing: '0.20em',
            color: 'var(--brand)',
            marginBottom: '20px',
          }}
        >
          05 · Tech & Performance
        </p>
        <h2
          className="font-display font-bold"
          style={{
            fontSize: 'clamp(36px, 4.8vw, 64px)',
            lineHeight: 1.05,
            letterSpacing: 'var(--tr-display)',
            color: 'var(--fg-default)',
          }}
        >
          Auch unter der <ItalicAccent>Haube</ItalicAccent> sauber.
        </h2>
        <p
          className="mt-4 font-body"
          style={{
            fontSize: '17px',
            lineHeight: 1.65,
            color: 'var(--fg-muted)',
            maxWidth: '620px',
          }}
        >
          <GlossarHighlight text="Next.js 16, Cloudflare-CDN, self-hosted Schriftarten, cookieless Analytics — Performance fest im Budget (Lighthouse 90+). Schauen ist erlaubt, die Sources liegen auf GitHub." />
        </p>
      </div>

      <motion.div
        className="glass-card relative"
        style={{ padding: '40px', overflow: 'hidden' }}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <div className="relative z-[3] grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                { Icon: Zap,    label: 'Lighthouse 90+ Performance', sub: 'Production-Build, mobile + desktop' },
                { Icon: Code,   label: 'TypeScript strict',           sub: 'Zero any-types, alle Surfaces typed' },
                { Icon: Search, label: 'SEO + AISEO ready',           sub: 'Schema.org, OG, llms.txt, Sitemap-XML' },
                { Icon: Mail,   label: 'Cookieless Analytics',        sub: 'Umami self-hosted, kein Consent-Banner nötig' },
              ].map((f, i) => (
                <motion.li
                  key={f.label}
                  className="flex items-start gap-4 border-b py-5 last:border-b-0"
                  style={{ borderColor: 'var(--border-subtle)' }}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.08, ease: EASE }}
                >
                  <span
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center"
                    style={{
                      background: 'rgba(220, 128, 68, 0.10)',
                      border: '1px solid rgba(220, 128, 68, 0.22)',
                      borderRadius: 'var(--r-sm)',
                      color: 'var(--brand)',
                    }}
                  >
                    <f.Icon size={16} strokeWidth={1.6} />
                  </span>
                  <div>
                    <p
                      className="font-display font-semibold"
                      style={{ fontSize: '16px', color: 'var(--fg-default)' }}
                    >
                      {f.label}
                    </p>
                    <p
                      className="mt-1 font-mono"
                      style={{
                        fontSize: '11px',
                        letterSpacing: '0.04em',
                        color: 'var(--fg-muted)',
                      }}
                    >
                      {f.sub}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>

            <Link
              href="https://github.com/braum-me"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="external"
              className="mt-8 inline-flex items-center gap-2 font-mono uppercase transition-colors duration-220 hover:text-[color:var(--brand)]"
              style={{
                fontSize: '12px',
                letterSpacing: '0.16em',
                color: 'var(--fg-muted)',
              }}
            >
              Sources auf GitHub
              <ArrowRight size={12} strokeWidth={1.6} />
            </Link>
          </div>

          {/* Live-Performance-Widget: Lighthouse-Ringe + Core Web Vitals */}
          <PerformanceWidget />
        </div>
      </motion.div>
    </section>
  )
}

/* ── Performance-Widget · Lighthouse-Ringe + Core Web Vitals ─────────
 *
 * Beweist das „schnelle Sites"-Können am eigenen Beispiel:
 * Ringe füllen sich beim Reinscrollen (stroke-dashoffset), die Zahl in
 * der Mitte zählt synchron hoch (CountUp). Richtwerte/Momentaufnahme aus dem
 * Production-Build, im Einklang mit dem 90+-Performance-Budget der Seite.
 *
 * BELEG-TODO vor Launch: echten Production-Lighthouse (mobile + desktop)
 * laufen lassen und entweder die Werte hier verifizieren ODER als
 * Screenshot-Nachweis verlinken. Bis dahin bewusst als Momentaufnahme
 * gerahmt, kein Absolutheits-Claim.
 */

const LIGHTHOUSE_SCORES = [
  { label: 'Performance',   score: 96 },
  { label: 'Accessibility', score: 100 },
  { label: 'SEO',           score: 100 },
] as const

const WEB_VITALS = [
  { label: 'LCP', to: 0.9, decimals: 1, suffix: ' s',  hint: 'Largest Contentful Paint' },
  { label: 'CLS', to: 0.01, decimals: 2, suffix: '',   hint: 'Cumulative Layout Shift' },
  { label: 'INP', to: 80,  decimals: 0, suffix: ' ms', hint: 'Interaction to Next Paint' },
] as const

function PerformanceWidget() {
  return (
    <div className="flex flex-col gap-7">
      {/* Lighthouse-Ringe */}
      <div className="grid grid-cols-3 gap-3 sm:gap-5">
        {LIGHTHOUSE_SCORES.map((s, i) => (
          <RingGauge key={s.label} {...s} delay={0.2 + i * 0.12} />
        ))}
      </div>

      {/* Core-Web-Vitals-Streifen */}
      <div
        className="glass-card"
        style={{ padding: '18px 20px' }}
      >
        <p
          className="font-mono uppercase"
          style={{
            fontSize: '9px',
            letterSpacing: '0.20em',
            color: 'var(--fg-muted)',
            marginBottom: '14px',
          }}
        >
          Core Web Vitals · Richtwerte
        </p>
        <div className="grid grid-cols-3 gap-2">
          {WEB_VITALS.map((v, i) => (
            <motion.div
              key={v.label}
              className="flex flex-col"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.1, ease: EASE }}
            >
              <CountUp
                to={v.to}
                decimals={v.decimals}
                suffix={v.suffix}
                duration={1.4}
                className="font-display font-bold tabular-nums"
                style={{
                  fontSize: 'clamp(20px, 2.4vw, 26px)',
                  lineHeight: 1,
                  color: 'var(--fg-default)',
                  letterSpacing: 'var(--tr-display)',
                }}
              />
              <span
                className="font-mono uppercase"
                style={{
                  fontSize: '9px',
                  letterSpacing: '0.16em',
                  color: 'var(--brand)',
                  marginTop: '7px',
                }}
              >
                {v.label}
              </span>
              <span
                className="font-mono"
                style={{
                  fontSize: '9px',
                  letterSpacing: '0.02em',
                  color: 'var(--fg-subtle)',
                  marginTop: '3px',
                }}
              >
                {v.hint}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* Ein Lighthouse-Stil-Ring: SVG-Bogen füllt sich beim Reinscrollen,
 * die Zahl in der Mitte zählt per CountUp synchron hoch. */
function RingGauge({
  label,
  score,
  delay,
}: {
  label: string
  score: number
  delay: number
}) {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15%' })
  const reduce = useReducedMotion()

  const SIZE = 96
  const STROKE = 7
  const R = (SIZE - STROKE) / 2
  const C = 2 * Math.PI * R
  // Voller Bogen bei score === 100
  const filled = C * (score / 100)
  const active = reduce || inView

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg
          ref={ref}
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          style={{ transform: 'rotate(-90deg)' }}
          aria-hidden
        >
          {/* Track */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke="rgba(220, 128, 68, 0.12)"
            strokeWidth={STROKE}
          />
          {/* Fortschritts-Bogen */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke="var(--brand)"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={active ? C - filled : C}
            style={{
              transition: reduce
                ? 'none'
                : `stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
              filter: 'drop-shadow(0 0 6px rgba(220, 128, 68, 0.45))',
            }}
          />
        </svg>
        {/* Zahl in der Mitte */}
        <div className="absolute inset-0 flex items-center justify-center">
          <CountUp
            to={score}
            duration={1.4}
            className="font-display font-black tabular-nums"
            style={{
              fontSize: 'clamp(22px, 2.6vw, 30px)',
              lineHeight: 1,
              color: 'var(--brand)',
              letterSpacing: 'var(--tr-display)',
            }}
          />
        </div>
      </div>
      <span
        className="font-mono uppercase"
        style={{
          fontSize: '9px',
          letterSpacing: '0.16em',
          color: 'var(--fg-muted)',
          marginTop: '12px',
          textAlign: 'center',
        }}
      >
        {label}
      </span>
    </div>
  )
}

/* ── 6 · Growth · Was danach kommt ───────────────────────────────── */

const GROWTH_STAGES = [
  {
    Icon: CheckCircle2,
    phase: 'Foundation',
    title: 'Brand · Website · Tech',
    body:  'Die Bühne, die wir gerade gemeinsam aufgesetzt haben. Sichtbar, schnell, dokumentiert, code-getrieben.',
    points: ['Markenidentität', 'Performance-Site', 'Hosting + Monitoring'],
    state: 'done' as const,
  },
  {
    Icon: Megaphone,
    phase: 'Reach',
    title: 'Sichtbarkeit aufbauen',
    body:  'Regelmäßiger Content, der gefunden wird und sich teilen lässt. LinkedIn als Mini-Funnel, SEO-Themencluster, Newsletter — und gelegentlich Instagram, YouTube oder Podcast, wenn dein Publikum dort ist.',
    points: ['Content-Strategie + Redaktionsplan', 'LinkedIn-Profil als Conversion-Asset', 'SEO-Themen-Hubs · pillar + cluster', 'Newsletter-Setup (Brevo · Beehiiv)'],
    state: 'next' as const,
  },
  {
    Icon: Target,
    phase: 'Performance',
    title: 'Bezahlt skalieren',
    body:  'Wenn organisch zieht, kommt Paid drauf. Google Ads für Intent-Suchen, LinkedIn Ads für B2B-Targeting, Meta für breite Awareness — alles mit sauberer Attribution.',
    points: ['Google Ads · Suchnetzwerk', 'LinkedIn Sponsored Content', 'Meta · Retargeting-Layer', 'Tracking + Attribution (GA4 · Plausible)'],
    state: 'later' as const,
  },
  {
    Icon: MailCheck,
    phase: 'Conversion',
    title: 'Aus Besucher werden Anfragen',
    body:  'Lead-Magnets, Email-Automation, CRM-Integration. Jeder Touchpoint trackbar, jede Conversion einer Quelle zuordenbar.',
    points: ['Lead-Magnets + Whitepaper-Funnel', 'Email-Sequenzen (Brevo · ConvertKit)', 'CRM-Anbindung (Pipedrive · HubSpot)', 'A/B-Tests auf den Conversion-Punkten'],
    state: 'later' as const,
  },
  {
    Icon: TrendingUp,
    phase: 'Scale',
    title: 'Optimieren statt raten',
    body:  'Daten-getriebene Iteration. Was funktioniert, kriegt mehr Budget. Was nicht, fliegt raus. Monatliche Reviews, klare Quartals-Ziele.',
    points: ['Performance-Reviews · monatlich', 'AB-Tests + Heatmaps (PostHog)', 'Budget-Reallocation', 'Internationalisierung — wenn relevant'],
    state: 'later' as const,
  },
]

function Section6Growth() {
  return (
    <section
      aria-label="Was danach kommt"
      className="relative overflow-hidden"
      style={{
        padding: 'clamp(96px, 12vw, 160px) 24px',
      }}
    >
      {/* Background-Atmosphere — pulsierender Glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(50% 60% at 50% 30%, rgba(220, 128, 68, 0.10) 0%, transparent 65%),' +
            'radial-gradient(40% 50% at 80% 80%, rgba(146, 48, 30, 0.08) 0%, transparent 60%)',
          zIndex: 0,
        }}
      />

      <div
        className="relative mx-auto"
        style={{ maxWidth: 'var(--container-wide)', zIndex: 1 }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ maxWidth: '860px', marginBottom: 'clamp(64px, 8vw, 96px)' }}
        >
          <p
            className="font-mono uppercase"
            style={{
              fontSize: '11px',
              letterSpacing: '0.20em',
              color: 'var(--brand)',
              marginBottom: '24px',
            }}
          >
            06 · Was danach kommt
          </p>
          <h2
            className="font-display font-bold"
            style={{
              fontSize: 'clamp(40px, 5.4vw, 84px)',
              lineHeight: 0.98,
              letterSpacing: 'var(--tr-display)',
              color: 'var(--fg-default)',
            }}
          >
            Die <ItalicAccent>Bühne</ItalicAccent> steht.<br />
            Jetzt kommt das Publikum.
          </h2>
          <p
            className="mt-8 font-body"
            style={{
              fontSize: '18px',
              lineHeight: 1.6,
              color: 'var(--fg-muted)',
              maxWidth: '680px',
            }}
          >
            Brand und Website sind die Foundation. Daraus wächst der Funnel —
            Reach, Performance Marketing, Conversion, Scale. Jeder Schritt
            optional, jeder im selben Stack, alles trackbar.
          </p>

          {/* Stage-Indicator-Pills */}
          <div className="mt-10 flex flex-wrap items-center gap-2">
            {GROWTH_STAGES.map((s, i) => (
              <div key={s.phase} className="flex items-center">
                <span
                  className="font-mono uppercase"
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.16em',
                    padding: '6px 12px',
                    borderRadius: 'var(--r-pill)',
                    color: s.state === 'done'
                      ? '#28C840'
                      : s.state === 'next'
                      ? 'var(--brand)'
                      : 'var(--fg-subtle)',
                    background: s.state === 'done'
                      ? 'rgba(40, 200, 64, 0.10)'
                      : s.state === 'next'
                      ? 'rgba(220, 128, 68, 0.10)'
                      : 'transparent',
                    border: s.state === 'done'
                      ? '1px solid rgba(40, 200, 64, 0.30)'
                      : s.state === 'next'
                      ? '1px solid rgba(220, 128, 68, 0.30)'
                      : '1px solid var(--border-subtle)',
                  }}
                >
                  {s.phase}
                </span>
                {i < GROWTH_STAGES.length - 1 && (
                  <span
                    aria-hidden
                    className="mx-2 font-mono"
                    style={{
                      color: 'var(--fg-subtle)',
                      fontSize: '11px',
                    }}
                  >
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Stages-Timeline */}
        <div className="relative">
          {/* Vertikale Connection-Line — verläuft links der Cards auf Desktop */}
          <div
            aria-hidden
            className="pointer-events-none absolute hidden md:block"
            style={{
              left: '23px',
              top: '32px',
              bottom: '40px',
              width: '2px',
              background:
                'linear-gradient(180deg, #28C840 0%, rgba(40, 200, 64, 0.40) 8%, var(--brand) 18%, rgba(220, 128, 68, 0.40) 32%, var(--border-subtle) 50%)',
              opacity: 0.6,
            }}
          />

          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {GROWTH_STAGES.map((s, i) => (
              <GrowthStage key={s.phase} stage={s} index={i} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function GrowthStage({
  stage,
  index,
}: {
  stage: typeof GROWTH_STAGES[number]
  index: number
}) {
  const isDone = stage.state === 'done'
  const isNext = stage.state === 'next'
  const accentColor = isDone ? '#28C840' : isNext ? 'var(--brand)' : 'var(--fg-subtle)'
  const dotShadow  = isDone
    ? '0 0 16px rgba(40, 200, 64, 0.65)'
    : isNext
    ? '0 0 18px rgba(220, 128, 68, 0.65)'
    : 'none'

  return (
    <motion.li
      className="relative md:pl-20"
      style={{ marginBottom: index === GROWTH_STAGES.length - 1 ? 0 : 'clamp(28px, 3vw, 40px)' }}
      initial={{ opacity: 0, x: 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-12%' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: EASE }}
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
        {isDone && <Check size={14} strokeWidth={2.4} style={{ color: '#28C840' }} />}
        {isNext && (
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
        {!isDone && !isNext && (
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--fg-subtle)',
              opacity: 0.6,
            }}
          />
        )}
      </div>

      <article
        className="glass-card relative"
        style={{
          padding: 'clamp(24px, 2.4vw, 36px)',
          border: isNext
            ? '1px solid rgba(220, 128, 68, 0.35)'
            : undefined,
          background: isNext
            ? 'linear-gradient(145deg, rgba(220, 128, 68, 0.05), rgba(220, 128, 68, 0.02))'
            : undefined,
        }}
      >
        <div className="relative z-[3]">
          {/* Top-Row: Icon + Phase + Status-Tag */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <span
                className="inline-flex items-center justify-center"
                style={{
                  width: 48,
                  height: 48,
                  background: isDone
                    ? 'rgba(40, 200, 64, 0.10)'
                    : isNext
                    ? 'rgba(220, 128, 68, 0.12)'
                    : 'var(--bg-overlay)',
                  border: isDone
                    ? '1px solid rgba(40, 200, 64, 0.28)'
                    : isNext
                    ? '1px solid rgba(220, 128, 68, 0.28)'
                    : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--r-sm)',
                  color: accentColor,
                }}
              >
                <stage.Icon size={22} strokeWidth={1.5} />
              </span>
              <div>
                <p
                  className="font-mono uppercase"
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.20em',
                    color: accentColor,
                    marginBottom: '4px',
                  }}
                >
                  Stage {String(index + 1).padStart(2, '0')} · {stage.phase}
                </p>
                <h3
                  className="font-display font-semibold"
                  style={{
                    fontSize: 'clamp(22px, 2.4vw, 30px)',
                    lineHeight: 1.15,
                    letterSpacing: 'var(--tr-heading)',
                    color: 'var(--fg-default)',
                  }}
                >
                  {stage.title}
                </h3>
              </div>
            </div>

            <span
              className="font-mono uppercase shrink-0"
              style={{
                fontSize: '9px',
                letterSpacing: '0.18em',
                padding: '5px 10px',
                borderRadius: 'var(--r-pill)',
                color: accentColor,
                background: isDone
                  ? 'rgba(40, 200, 64, 0.10)'
                  : isNext
                  ? 'rgba(220, 128, 68, 0.10)'
                  : 'transparent',
                border: `1px solid ${
                  isDone
                    ? 'rgba(40, 200, 64, 0.28)'
                    : isNext
                    ? 'rgba(220, 128, 68, 0.28)'
                    : 'var(--border-subtle)'
                }`,
                whiteSpace: 'nowrap',
              }}
            >
              {isDone ? '✓ Foundation' : isNext ? 'Empfehlung Next' : 'wenn relevant'}
            </span>
          </div>

          {/* Body */}
          <p
            className="mt-6 font-body"
            style={{
              fontSize: '16px',
              lineHeight: 1.6,
              color: 'var(--fg-muted)',
              maxWidth: '720px',
            }}
          >
            {stage.body}
          </p>

          {/* Sub-Points */}
          <ul
            className="mt-7 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2"
            style={{ listStyle: 'none', padding: 0, margin: 0 }}
          >
            {stage.points.map(p => (
              <li
                key={p}
                className="flex items-start gap-2.5 py-1.5 font-mono"
                style={{
                  fontSize: '12px',
                  color: 'var(--fg-default)',
                  letterSpacing: '0.02em',
                  borderBottom: '1px solid var(--border-subtle)',
                }}
              >
                <span
                  aria-hidden
                  style={{
                    color: accentColor,
                    fontSize: 10,
                    paddingTop: 4,
                  }}
                >
                  ▸
                </span>
                <span style={{ paddingTop: 1 }}>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </motion.li>
  )
}
