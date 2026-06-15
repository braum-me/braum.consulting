import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Compass, BookOpen } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { Client } from '@notionhq/client'
import { findLeadByToken, readTitle, readSelect, readMultiSelect, PROPS, type Saeule } from '@/lib/notion'
import AccentGlow from '@/components/ui/AccentGlow'
import PendingPoller from '@/components/briefing/PendingPoller'
import BriefingActions from '@/components/briefing/BriefingActions'
import { GLOSSARY } from '@/lib/glossary'
import { getGlossarySlugsForSaeulen } from '@/lib/briefing-glossary'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://braum.consulting'

export const metadata: Metadata = {
  title: 'Lagebild-Briefing',
  description: 'Persönliches Lagebild-Briefing.',
  robots: { index: false, follow: false },
}

// PII-Seite (Lead-Daten aus Notion): nie prerendern oder cachen. Erzwingt
// dynamisches Rendering pro Request → de facto no-store für die HTML-Antwort.
export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ token: string }>
}

/**
 * Briefing-Permalink — privat, robots noindex.
 *
 * Lädt Lead aus Notion anhand Token, extrahiert Briefing-Markdown aus
 * dem Code-Block-Child der Page (von Server-Action persistiert), rendert
 * mit react-markdown und Brand-konsistenten Komponenten.
 *
 * Status-Flow:
 *   pending     → "Briefing wird erzeugt" (Polling-Hinweis)
 *   generating  → wie pending
 *   ready       → Briefing rendern
 *   failed      → Hinweis + direkter Kontakt
 *   token unknown → 404
 */
export default async function BriefingPage({ params }: PageProps) {
  const { token } = await params
  if (!token || token.length < 8) notFound()

  const lead = await findLeadByToken(token)
  if (!lead) notFound()

  const briefingStatus = readSelect(lead, PROPS.briefingStatus)
  const firma          = readTitle(lead, PROPS.company)
  const saeulenRaw     = readMultiSelect(lead, PROPS.saeulen)
  const saeulen        = saeulenRaw.filter((s): s is Saeule =>
    s === 'marke' || s === 'm365' || s === 'ai' || s === 'strategie',
  )

  if (briefingStatus === 'pending' || briefingStatus === 'generating') {
    return <BriefingPending firma={firma} token={token} />
  }
  if (briefingStatus === 'failed') {
    return <BriefingFailed firma={firma} />
  }

  const markdown = await fetchBriefingMarkdown(lead.id)
  if (!markdown) {
    return <BriefingPending firma={firma} token={token} />
  }

  return (
    <BriefingView
      firma={firma}
      markdown={markdown}
      token={token}
      saeulen={saeulen}
    />
  )
}

/* ── Markdown aus Notion-Code-Block lesen ──────────────────────────── */

async function fetchBriefingMarkdown(pageId: string): Promise<string | null> {
  const auth = process.env.NOTION_TOKEN
  if (!auth) return null
  const notion = new Client({ auth })

  const result = await notion.blocks.children.list({ block_id: pageId, page_size: 50 })
  for (const block of result.results) {
    if (!('type' in block)) continue
    if (block.type !== 'code') continue
    type CodeBlock = { code: { language: string; rich_text: Array<{ plain_text: string }> } }
    const codeBlock = block as unknown as CodeBlock
    if (codeBlock.code.language !== 'markdown') continue
    return codeBlock.code.rich_text.map(t => t.plain_text).join('')
  }
  return null
}

/* ── Pending-Variante ──────────────────────────────────────────────── */

function BriefingPending({ firma, token }: { firma: string; token: string }) {
  return (
    <PageShell title="Briefing wird vorbereitet">
      <p
        className="font-body"
        style={{
          fontSize: 18,
          lineHeight: 1.55,
          color: 'var(--fg-muted)',
          maxWidth: 600,
          marginBottom: 32,
        }}
      >
        Dein Lagebild für <strong style={{ color: 'var(--fg-default)' }}>{firma}</strong>{' '}
        wird gerade vom System aufbereitet. Das dauert in der Regel ein bis zwei
        Minuten. Diese Seite refresht sich automatisch, sobald es fertig ist.
      </p>

      <PendingPoller token={token} />

      <p
        className="font-body"
        style={{ fontSize: 15, color: 'var(--fg-subtle)' }}
      >
        Du kannst diese Seite gleich neu laden — oder einfach auf die E-Mail warten.
      </p>
    </PageShell>
  )
}

function BriefingFailed({ firma }: { firma: string }) {
  return (
    <PageShell title="Briefing konnte nicht erzeugt werden">
      <p
        className="font-body"
        style={{
          fontSize: 18,
          lineHeight: 1.55,
          color: 'var(--fg-muted)',
          maxWidth: 600,
          marginBottom: 32,
        }}
      >
        Bei der Aufbereitung deines Lagebilds für{' '}
        <strong style={{ color: 'var(--fg-default)' }}>{firma}</strong> ist etwas
        schiefgegangen. Schreib mir kurz an{' '}
        <a
          href="mailto:info@braum.consulting"
          style={{ color: 'var(--brand)', textDecoration: 'underline' }}
        >
          info@braum.consulting
        </a>{' '}
        — ich melde mich persönlich.
      </p>
    </PageShell>
  )
}

/* ── Briefing-Render ────────────────────────────────────────────────── */

function BriefingView({
  firma,
  markdown,
  token,
  saeulen,
}: {
  firma: string
  markdown: string
  token: string
  saeulen: Saeule[]
}) {
  const permalinkUrl = `${SITE_URL}/briefing/${token}`
  const glossarySlugs = getGlossarySlugsForSaeulen(saeulen)
  const glossaryItems = glossarySlugs
    .map(slug => GLOSSARY.find(g => g.slug === slug))
    .filter((g): g is NonNullable<typeof g> => Boolean(g))
    .slice(0, 8)

  return (
    <>
    <style>{BRIEFING_PRINT_CSS}</style>
    <div
      className="briefing-page relative w-screen overflow-hidden"
      style={{
        marginLeft: 'calc(-50vw + 50%)',
        minHeight: '100vh',
        background: 'var(--bg-base)',
        paddingTop: 96,
        paddingBottom: 128,
      }}
    >
      <AccentGlow />

      <div
        className="relative z-[2] mx-auto"
        style={{ maxWidth: 760, padding: '0 24px' }}
      >
        <header style={{ marginBottom: 32 }} className="briefing-screen-only">
          <span
            className="font-mono"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 11,
              letterSpacing: '0.20em',
              textTransform: 'uppercase',
              color: 'var(--brand)',
              marginBottom: 24,
            }}
          >
            <Compass size={12} strokeWidth={1.5} />
            Lagebild · Briefing
          </span>
        </header>

        <BriefingActions permalinkUrl={permalinkUrl} />

        <article className="briefing-prose" style={{ color: 'var(--fg-default)' }}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
            // Whitelist sicherer Block-/Inline-Elemente. img wird entfernt (keine
            // Bilder), raw HTML ist ohnehin aus (kein rehype-raw aktiv). react-markdown
            // sanitisiert URLs zusätzlich per Default-urlTransform (javascript: etc. raus).
            allowedElements={[
              'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
              'strong', 'em', 'del', 'a', 'code', 'pre', 'blockquote',
              'ul', 'ol', 'li', 'hr', 'br',
              'table', 'thead', 'tbody', 'tr', 'th', 'td',
            ]}
            unwrapDisallowed
          >
            {markdown}
          </ReactMarkdown>
        </article>

        {glossaryItems.length > 0 && (
          <section
            className="briefing-glossary"
            style={{
              marginTop: 80,
              padding: 32,
              borderRadius: 14,
              background: 'rgba(242, 240, 235, 0.03)',
              border: '1px solid rgba(242, 240, 235, 0.08)',
            }}
          >
            <p
              className="font-mono uppercase"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 11,
                letterSpacing: '0.20em',
                color: 'var(--brand)',
                marginBottom: 20,
              }}
            >
              <BookOpen size={12} strokeWidth={1.5} />
              Vertiefung · Lexikon
            </p>
            <h3
              className="font-display"
              style={{
                fontSize: 22,
                fontWeight: 600,
                lineHeight: 1.2,
                letterSpacing: '-0.018em',
                color: 'var(--fg-default)',
                margin: '0 0 16px',
              }}
            >
              Begriffe aus diesem Briefing
            </h3>
            <p
              className="font-body"
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                color: 'var(--fg-muted)',
                margin: '0 0 24px',
                maxWidth: 540,
              }}
            >
              Vor dem Gespräch hilft es, zentrale Begriffe parat zu haben. Hier
              die Einträge aus meinem Lexikon, die zu eurer Auswahl passen.
            </p>
            <ul
              style={{
                margin: 0,
                padding: 0,
                listStyle: 'none',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: 10,
              }}
            >
              {glossaryItems.map(item => (
                <li key={item.slug}>
                  <Link
                    href={`/lexikon/${item.slug}`}
                    className="group"
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: 8,
                      padding: '10px 14px',
                      borderRadius: 6,
                      background: 'rgba(242, 240, 235, 0.03)',
                      border: '1px solid rgba(242, 240, 235, 0.08)',
                      textDecoration: 'none',
                      transition: 'background 180ms, border-color 180ms',
                    }}
                  >
                    <span
                      className="font-body"
                      style={{
                        fontSize: 13.5,
                        color: 'var(--fg-default)',
                        fontWeight: 500,
                      }}
                    >
                      {item.term}
                    </span>
                    <ArrowRight
                      size={11}
                      strokeWidth={1.75}
                      className="ml-auto transition-transform duration-220 group-hover:translate-x-0.5"
                      style={{ color: 'var(--brand)', flexShrink: 0 }}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div
          style={{
            marginTop: 96,
            padding: 32,
            borderRadius: 14,
            border: '1px solid rgba(204, 96, 53, 0.32)',
            background:
              'linear-gradient(145deg, rgba(200, 98, 42, 0.10) 0%, rgba(200, 98, 42, 0.02) 100%)',
          }}
        >
          <h2
            className="font-display"
            style={{
              fontSize: 28,
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: '-0.022em',
              color: 'var(--fg-default)',
              margin: '0 0 12px',
            }}
          >
            Bereit für das Gespräch?
          </h2>
          <p
            className="font-body"
            style={{
              fontSize: 16,
              lineHeight: 1.55,
              color: 'var(--fg-muted)',
              maxWidth: 560,
              margin: '0 0 24px',
            }}
          >
            30 Minuten, kein Folien-Theater. Wir gehen die drei Reibungspunkte
            durch und schärfen die Roadmap-Skizze gemeinsam.
          </p>
          <Link
            href={`/lagebild/danke?token=${encodeURIComponent(token)}`}
            className="font-mono"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '14px 28px',
              fontSize: 14,
              letterSpacing: '0.04em',
              color: '#FBF0EA',
              background: 'var(--accent, #C8622A)',
              borderRadius: 6,
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            Termin auswählen
            <ArrowRight size={14} strokeWidth={2} />
          </Link>
        </div>

        <footer
          className="font-body"
          style={{
            marginTop: 64,
            paddingTop: 24,
            borderTop: '1px solid rgba(242, 240, 235, 0.06)',
            fontSize: 12,
            color: 'var(--fg-subtle)',
          }}
        >
          Diese Seite ist privat — nicht indexiert, nicht öffentlich. Nur du und
          ich sehen das Briefing. {firma && `· Erstellt für ${firma}.`}
        </footer>
      </div>
    </div>
    </>
  )
}

/* ── Print-Stylesheet ───────────────────────────────────────────────────
 * Beim Druck:
 *   - Light-Mode (schwarz auf weiß) für Tinten-Sparsamkeit
 *   - Hide: Nav, Footer (Page-Layout), Briefing-Actions, Eyebrow-Header
 *   - Page-Break-Avoid für Section-Headers + Listen
 *   - Tighter typography
 */
const BRIEFING_PRINT_CSS = `
@media print {
  html, body {
    background: #ffffff !important;
    color: #1f1e1c !important;
    color-scheme: light !important;
  }
  .site-header, .site-footer, .briefing-screen-only, .briefing-actions {
    display: none !important;
  }
  .briefing-page {
    background: #ffffff !important;
    padding: 0 !important;
    margin-left: 0 !important;
    min-height: 0 !important;
    width: 100% !important;
  }
  .briefing-page * {
    color: #1f1e1c !important;
    background: transparent !important;
    box-shadow: none !important;
    text-shadow: none !important;
  }
  .briefing-prose h1, .briefing-prose h2, .briefing-prose h3,
  .briefing-glossary h3 {
    color: #1f1e1c !important;
    page-break-after: avoid;
  }
  .briefing-prose ul, .briefing-prose ol, .briefing-prose p {
    page-break-inside: avoid;
  }
  .briefing-prose em, .briefing-glossary em {
    color: #92301E !important;
  }
  .briefing-glossary {
    border: 1px solid #d9d6cf !important;
    page-break-inside: avoid;
  }
  a[href]::after {
    content: " (" attr(href) ")";
    font-size: 0.85em;
    color: #5f5c57 !important;
  }
  /* CTA-Card unten optional drucken, aber abgespeckt */
  .briefing-page a[href^="/lagebild/danke"]::after {
    content: "";
  }
}
`

/* ── Page-Shell für Pending/Failed ──────────────────────────────────── */

function PageShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="relative w-screen overflow-hidden"
      style={{
        marginLeft: 'calc(-50vw + 50%)',
        minHeight: '100vh',
        background: 'var(--bg-base)',
        paddingTop: 128,
        paddingBottom: 96,
      }}
    >
      <AccentGlow />
      <div className="relative z-[2] mx-auto" style={{ maxWidth: 640, padding: '0 24px' }}>
        <span
          className="font-mono"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 11,
            letterSpacing: '0.20em',
            textTransform: 'uppercase',
            color: 'var(--brand)',
            marginBottom: 24,
          }}
        >
          <Compass size={12} strokeWidth={1.5} />
          Lagebild
        </span>
        <h1
          className="font-display"
          style={{
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: 600,
            lineHeight: 1.05,
            letterSpacing: '-0.022em',
            color: 'var(--fg-default)',
            margin: '0 0 32px',
          }}
        >
          {title}
        </h1>
        {children}
      </div>
    </div>
  )
}

/* ── Markdown-Komponenten (Brand-konsistent) ────────────────────────── */

const markdownComponents = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1
      className="font-display"
      style={{
        fontSize: 'clamp(40px, 6vw, 64px)',
        fontWeight: 600,
        lineHeight: 1,
        letterSpacing: '-0.035em',
        color: 'var(--fg-default)',
        margin: '0 0 32px',
      }}
    >
      {children}
    </h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2
      className="font-display"
      style={{
        fontSize: 28,
        fontWeight: 600,
        lineHeight: 1.15,
        letterSpacing: '-0.022em',
        color: 'var(--fg-default)',
        margin: '56px 0 20px',
      }}
    >
      {children}
    </h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3
      className="font-display"
      style={{
        fontSize: 20,
        fontWeight: 600,
        lineHeight: 1.25,
        letterSpacing: '-0.018em',
        color: 'var(--fg-default)',
        margin: '32px 0 12px',
      }}
    >
      {children}
    </h3>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p
      className="font-body"
      style={{
        fontSize: 17,
        lineHeight: 1.65,
        color: 'var(--fg-default)',
        margin: '0 0 18px',
      }}
    >
      {children}
    </p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul
      className="font-body"
      style={{
        fontSize: 17,
        lineHeight: 1.65,
        color: 'var(--fg-default)',
        margin: '0 0 18px',
        paddingLeft: 24,
        listStyleType: 'none',
      }}
    >
      {children}
    </ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol
      className="font-body"
      style={{
        fontSize: 17,
        lineHeight: 1.65,
        color: 'var(--fg-default)',
        margin: '0 0 18px',
        paddingLeft: 28,
      }}
    >
      {children}
    </ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li style={{ marginBottom: 8, position: 'relative' }}>
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: -20,
          top: '0.65em',
          width: 6,
          height: 1,
          background: 'var(--brand)',
        }}
      />
      {children}
    </li>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong style={{ fontWeight: 600, color: 'var(--fg-default)' }}>{children}</strong>
  ),
  em: ({ children }: { children?: React.ReactNode }) => (
    <em
      style={{
        fontFamily: 'var(--font-accent)',
        fontStyle: 'italic',
        fontWeight: 400,
        color: 'var(--brand)',
      }}
    >
      {children}
    </em>
  ),
  hr: () => (
    <hr
      style={{
        border: 'none',
        borderTop: '1px solid rgba(242, 240, 235, 0.10)',
        margin: '48px 0',
      }}
    />
  ),
  code: ({ children }: { children?: React.ReactNode }) => (
    <code
      className="font-mono"
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.9em',
        background: 'rgba(242, 240, 235, 0.06)',
        padding: '2px 6px',
        borderRadius: 3,
        color: 'var(--fg-default)',
      }}
    >
      {children}
    </code>
  ),
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => {
    const url = typeof href === 'string' ? href : ''
    const external = /^https?:\/\//i.test(url)
    return (
      <a
        href={url || undefined}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer nofollow ugc' } : {})}
        style={{ color: 'var(--brand)', textDecoration: 'underline', textDecorationThickness: 1 }}
      >
        {children}
      </a>
    )
  },
}

