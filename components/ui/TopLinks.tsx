import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

interface TopLink {
  href: string
  label: string
  hint: string
}

/** Kuratierte Top-Links als Wegweiser auf 404/500. */
const TOP_LINKS: readonly TopLink[] = [
  { href: '/', label: 'Startseite', hint: 'Zurück zum Anfang' },
  { href: '/leistungen', label: 'Leistungen', hint: 'Marke, M365, KI, Strategie' },
  { href: '/lagebild', label: 'Lagebild', hint: 'Standort-Check in Minuten' },
  { href: '/kontakt', label: 'Kontakt', hint: 'Kurz schreiben' },
  { href: '/blog', label: 'Blog', hint: 'Notizen aus der Praxis' },
  { href: '/lexikon', label: 'Lexikon', hint: 'Begriffe ohne Buzzwords' },
  { href: '/methodik', label: 'Methodik', hint: 'Wie ich arbeite' },
]

interface TopLinksProps {
  /** Überschrift über dem Grid. */
  heading?: string
  /** Zentriert (500) statt linksbündig (404). */
  align?: 'start' | 'center'
}

/**
 * Hilfreiche Navigation für Fehler-Seiten — kuratierte Top-Links als Grid.
 * Brand-konform, Dark-Mode, sichtbarer Focus über globale Styles.
 */
export function TopLinks({ heading = 'Vielleicht suchst du das', align = 'start' }: TopLinksProps) {
  return (
    <nav
      aria-label="Wichtige Seiten"
      className="w-full"
      style={{ maxWidth: '640px', marginInline: align === 'center' ? 'auto' : undefined }}
    >
      <p
        className="font-mono uppercase"
        style={{
          fontSize: '11px',
          letterSpacing: '0.20em',
          color: 'var(--fg-muted)',
          marginBottom: '16px',
          textAlign: align === 'center' ? 'center' : 'left',
        }}
      >
        {heading}
      </p>

      <ul
        className="grid list-none"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '10px',
          padding: 0,
          margin: 0,
        }}
      >
        {TOP_LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group flex items-start justify-between gap-3 transition-colors duration-220"
              style={{
                padding: '14px 16px',
                borderRadius: 'var(--r-md)',
                border: '1px solid var(--border-default)',
                background: 'var(--bg-elevated)',
                textAlign: 'left',
              }}
            >
              <span className="flex flex-col" style={{ gap: '2px' }}>
                <span
                  className="font-body font-semibold transition-colors duration-220 group-hover:text-[color:var(--brand)]"
                  style={{ fontSize: '15px', color: 'var(--fg-default)' }}
                >
                  {link.label}
                </span>
                <span
                  className="font-body"
                  style={{ fontSize: '12.5px', lineHeight: 1.4, color: 'var(--fg-muted)' }}
                >
                  {link.hint}
                </span>
              </span>
              <ArrowUpRight
                size={15}
                strokeWidth={1.5}
                className="shrink-0 transition-transform duration-220 group-hover:translate-x-px group-hover:-translate-y-px"
                style={{ color: 'var(--fg-faint)', marginTop: '2px' }}
                aria-hidden
              />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
