const SITE_URL = 'https://braum.consulting'

export interface ToolInfoProps {
  /** Tool-Name fürs Schema, z.B. „NIS2-Betroffenheits-Check". */
  name: string
  /** Pfad der Tool-Seite, z.B. „/werkzeuge/nis2-betroffenheit". */
  path: string
  /** Kurzbeschreibung fürs Schema (≈ Meta-Description). */
  description: string
  /** 2–3 Absätze rankbarer Text unterhalb des Tools. */
  paragraphs: string[]
  /** 3–4 FAQ-Einträge — rendern sichtbar + als FAQPage-Schema. */
  faq: Array<{ q: string; a: string }>
}

/**
 * SEO-Unterbau für Werkzeug-Seiten. Die Tools selbst sind App-Shells mit
 * wenig indexierbarem Inhalt — diese Server-Komponente liefert darunter
 * Prosa (was es prüft, für wen, Methodik), sichtbare FAQ und das passende
 * Markup (WebApplication + FAQPage), damit die Tool-URLs ranken können.
 */
export default function ToolInfo({ name, path, description, paragraphs, faq }: ToolInfoProps) {
  const appJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    url: `${SITE_URL}${path}`,
    description,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    inLanguage: 'de',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
    provider: { '@type': 'Person', name: 'Stefan Braum', url: `${SITE_URL}/ueber` },
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <section
      aria-label={`Über das Werkzeug: ${name}`}
      style={{ maxWidth: 720, margin: '0 auto', paddingTop: 'clamp(64px, 8vw, 96px)' }}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <p
        className="font-mono uppercase"
        style={{ fontSize: 11, letterSpacing: '0.20em', color: 'var(--brand)', marginBottom: 20 }}
      >
        Über dieses Werkzeug
      </p>

      {paragraphs.map((p, i) => (
        <p
          key={i}
          className="font-body"
          style={{ fontSize: 15.5, lineHeight: 1.7, color: 'var(--fg-muted)', margin: i === 0 ? 0 : '16px 0 0' }}
        >
          {p}
        </p>
      ))}

      <h2
        className="font-display"
        style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--fg-default)', margin: '40px 0 4px' }}
      >
        Häufige Fragen
      </h2>
      <dl style={{ margin: 0 }}>
        {faq.map(f => (
          <div key={f.q} style={{ padding: '20px 0', borderBottom: '1px solid rgba(242, 240, 235, 0.08)' }}>
            <dt className="font-body font-semibold" style={{ fontSize: 15, color: 'var(--fg-default)' }}>
              {f.q}
            </dt>
            <dd className="font-body" style={{ margin: '8px 0 0', fontSize: 14.5, lineHeight: 1.65, color: 'var(--fg-muted)' }}>
              {f.a}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
