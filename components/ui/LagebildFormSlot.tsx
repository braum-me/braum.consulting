import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

/**
 * Platzhalter-Component für das Lagebild-Formular.
 * Aktuell: rendert nur den Primary-CTA mit Link auf /kontakt.
 * Später: kann durch echten Mini-Fragebogen ersetzt werden, ohne die
 * Lagebild-Section selbst anzufassen.
 */
export default function LagebildFormSlot() {
  return (
    <div className="flex flex-col items-start gap-3">
      <Link
        href="/kontakt"
        data-cursor="magnetic"
        className="btn-accent-pulse inline-flex items-center gap-2 px-6 py-[14px] font-body font-semibold transition-transform duration-220 hover:-translate-y-px"
        style={{
          fontSize: '14px',
          background: 'var(--accent)',
          color: 'var(--on-accent)',
          borderRadius: 'var(--r-sm)',
        }}
      >
        Lagebild anfragen
        <ArrowRight size={16} strokeWidth={1.5} />
      </Link>

      <Link
        href="#lotsenprinzip"
        data-cursor="magnetic"
        className="inline-flex items-center gap-1.5 font-body transition-colors duration-220 hover:text-[color:var(--fg-default)]"
        style={{
          fontSize: '13px',
          color: 'var(--fg-muted)',
        }}
      >
        Wie das genau abläuft <span aria-hidden>↓</span>
      </Link>
    </div>
  )
}
