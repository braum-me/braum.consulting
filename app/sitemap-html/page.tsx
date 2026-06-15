import type { Metadata } from 'next'
import Link from 'next/link'
import AccentGlow from '@/components/ui/AccentGlow'
import {
  getCases,
  getServices,
  getInternalPosts,
  getGlossaryTerms,
} from '@/lib/cms'

export const metadata: Metadata = {
  title: 'Sitemap',
  description:
    'HTML-Übersicht aller Seiten auf braum.consulting: Leistungen, Cases, Notizen, Lexikon, rechtliche Seiten.',
}

const TOP_LEVEL = [
  { href: '/',          label: 'Startseite',         hint: 'Operator-Position, Hero, Lotsenprinzip' },
  { href: '/ueber',     label: 'Über Stefan',        hint: 'Werdegang, Stack, Prinzipien' },
  { href: '/cases',     label: 'Portfolio',          hint: 'Engagement-Board + Bento-Grid' },
  { href: '/leistungen', label: 'Leistungen',         hint: 'Marke · M365 · AI · Strategie' },
  { href: '/blog',      label: 'Notizen',            hint: 'Long-Form + Cross-Links' },
  { href: '/methodik',  label: 'Methodik',           hint: 'Lotsenprinzip im Detail' },
  { href: '/lexikon',   label: 'Lexikon',            hint: 'Brand-Sprache + Domain-Glossar' },
  { href: '/kontakt',   label: 'Kontakt',            hint: 'Direkter Draht zu Stefan' },
]

const LEGAL = [
  { href: '/impressum',   label: 'Impressum' },
  { href: '/datenschutz', label: 'Datenschutz' },
]

export default function SitemapHtmlPage() {
  const cases    = getCases()
  const services = getServices()
  const posts    = getInternalPosts()
  const terms    = getGlossaryTerms()

  return (
    <>
      <section
        className="relative w-screen overflow-hidden"
        style={{
          marginLeft: 'calc(-50vw + 50%)',
          background: 'var(--bg-base)',
          padding: 'clamp(120px, 14vw, 200px) 0 clamp(64px, 8vw, 96px)',
        }}
      >
        <AccentGlow position="bottom-left" intensity="low" />
        <div className="relative z-[3] mx-auto w-full max-w-[var(--container-wide)] px-6 md:px-12">
          <p
            className="font-mono uppercase"
            style={{
              fontSize: '11px',
              letterSpacing: '0.20em',
              color: 'var(--brand)',
              marginBottom: '24px',
            }}
          >
            Sitemap
          </p>
          <h1
            className="font-display font-bold"
            style={{
              fontSize: 'clamp(40px, 5.6vw, 80px)',
              lineHeight: 1,
              letterSpacing: 'var(--tr-display)',
              color: 'var(--fg-default)',
            }}
          >
            Alles auf einer Karte.
          </h1>
          <p
            className="mt-8 font-body"
            style={{
              fontSize: '17px',
              lineHeight: 1.65,
              color: 'var(--fg-muted)',
              maxWidth: '560px',
            }}
          >
            HTML-Übersicht aller Seiten — Power-User-Friendly + Discovery
            für Suchmaschinen und LLM-Crawler.
          </p>
        </div>
      </section>

      <section
        style={{
          maxWidth: '960px',
          margin: '0 auto',
          padding: '0 24px clamp(96px, 12vw, 160px)',
        }}
      >
        <SitemapGroup
          title="Hauptnavigation"
          items={TOP_LEVEL.map(t => ({ href: t.href, label: t.label, hint: t.hint }))}
        />

        <SitemapGroup
          title={`Leistungen · ${services.length}`}
          items={services.map(s => ({
            href:  `/leistungen/${s.slug}`,
            label: s.title,
            hint:  s.short,
          }))}
        />

        <SitemapGroup
          title={`Cases · ${cases.length}`}
          items={cases.map(c => ({
            href:  `/cases/${c.num}`,
            label: c.title,
            hint:  `${c.fieldLabel} · ${c.year} · ${c.duration}`,
          }))}
        />

        <SitemapGroup
          title={`Notizen · ${posts.length}`}
          items={posts.map(p => ({
            href:  `/blog/${p.slug}`,
            label: p.title,
            hint:  p.excerpt.slice(0, 100) + '…',
          }))}
        />

        <SitemapGroup
          title={`Lexikon · ${terms.length}`}
          items={terms.map(t => ({
            href:  `/lexikon/${t.slug}`,
            label: t.term,
            hint:  t.definition.slice(0, 100) + '…',
          }))}
        />

        <SitemapGroup
          title="Rechtliches"
          items={LEGAL}
        />

        <SitemapGroup
          title="Maschinen-lesbar"
          items={[
            { href: '/sitemap.xml', label: 'sitemap.xml', hint: 'XML-Sitemap für Crawler' },
            { href: '/robots.txt',  label: 'robots.txt',  hint: 'Crawler-Direktiven' },
          ]}
        />
      </section>
    </>
  )
}

function SitemapGroup({
  title,
  items,
}: {
  title: string
  items: Array<{ href: string; label: string; hint?: string }>
}) {
  return (
    <div style={{ marginBottom: '56px' }}>
      <p
        className="font-mono uppercase"
        style={{
          fontSize: '11px',
          letterSpacing: '0.18em',
          color: 'var(--brand)',
          marginBottom: '16px',
          paddingBottom: '12px',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        {title}
      </p>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {items.map(item => (
          <li key={item.href}>
            <Link
              href={item.href}
              data-cursor="link"
              className="group flex items-baseline justify-between gap-6 transition-colors duration-220 hover:text-[color:var(--brand)]"
              style={{ padding: '10px 0' }}
            >
              <span className="flex-1">
                <span
                  className="font-body"
                  style={{
                    fontSize: '15px',
                    color: 'var(--fg-default)',
                  }}
                >
                  {item.label}
                </span>
                {item.hint && (
                  <span
                    className="ml-3 font-body"
                    style={{
                      fontSize: '13px',
                      color: 'var(--fg-muted)',
                    }}
                  >
                    — {item.hint}
                  </span>
                )}
              </span>
              <span
                className="font-mono shrink-0"
                style={{
                  fontSize: '11px',
                  color: 'var(--fg-subtle)',
                  letterSpacing: '0.02em',
                }}
              >
                {item.href}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
