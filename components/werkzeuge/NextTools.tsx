import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { relatedTools } from '@/lib/tools'

/**
 * Cross-Tool-Empfehlung (#6): zeigt unter einem Werkzeug zwei thematisch
 * passende nächste Checks, damit Besucher in der Suite bleiben. Server-
 * Komponente, rein aus lib/tools.ts gespeist.
 */
export default function NextTools({ current }: { current: string }) {
  const next = relatedTools(current, 2)
  if (next.length === 0) return null

  return (
    <div style={{ maxWidth: 720, margin: '64px auto 0' }}>
      <p className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.20em', color: 'var(--fg-subtle)', marginBottom: 16 }}>
        Passt als Nächstes
      </p>
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        {next.map(t => (
          <Link
            key={t.href}
            href={t.href}
            className="group flex items-center transition-transform duration-220 hover:-translate-y-0.5"
            style={{ gap: 14, padding: '16px 18px', borderRadius: 10, background: 'rgba(242, 240, 235, 0.03)', border: '1px solid rgba(242, 240, 235, 0.10)' }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, borderRadius: 8, flexShrink: 0, background: 'rgba(220, 128, 68, 0.10)', color: 'var(--brand)' }}>
              <t.Icon size={17} strokeWidth={1.5} />
            </span>
            <span className="flex-1">
              <span className="block font-display" style={{ fontSize: 14.5, fontWeight: 600, lineHeight: 1.25, color: 'var(--fg-default)' }}>{t.title}</span>
              <span className="block font-mono uppercase" style={{ marginTop: 3, fontSize: 10, letterSpacing: '0.16em', color: 'var(--brand)' }}>{t.eyebrow} · {t.time}</span>
            </span>
            <ArrowRight size={15} strokeWidth={1.75} style={{ color: 'var(--fg-muted)', flexShrink: 0 }} className="transition-transform duration-220 group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </div>
  )
}
