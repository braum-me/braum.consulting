import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import AccentGlow from '@/components/ui/AccentGlow'
import PageHero from '@/components/layout/PageHero'
import RelatedPosts from '@/components/sections/RelatedPosts'
import GlossarHighlight from '@/components/ui/GlossarHighlight'
import ReadingHighlight from '@/components/ui/ReadingHighlight'
import TableOfContents from '@/components/ui/TableOfContents'
import PostSummary from '@/components/ui/PostSummary'
import PostTakeaways from '@/components/ui/PostTakeaways'
import AuthorBox from '@/components/ui/AuthorBox'
import ArticleReadingProgress from '@/components/ui/ArticleReadingProgress'
import HeadingAnchor from '@/components/ui/HeadingAnchor'
import ShareBar from '@/components/ui/ShareBar'
import CodeBlock from '@/components/ui/CodeBlock'
import {
  getInternalPost,
  getInternalSlugs,
  getRelatedPosts,
  type Inline,
  type PostBlock,
} from '@/lib/posts'

export async function generateStaticParams() {
  return getInternalSlugs().map(slug => ({ slug }))
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getInternalPost(slug)
  if (!post) return {}

  const url = `/blog/${post.slug}`
  const images = post.ogImage ? [{ url: post.ogImage, width: 1200, height: 630, alt: post.title }] : undefined

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      url,
      publishedTime: post.date,
      authors: ['Stefan Braum'],
      tags: post.tags,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      ...(images ? { images } : {}),
    },
  }
}

const DATE_FORMATTER = new Intl.DateTimeFormat('de-DE', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const SITE_URL = 'https://braum.consulting'

/** Lesegeschwindigkeit für die Lesezeit-Schätzung (Wörter pro Minute). */
const WORDS_PER_MINUTE = 200

/** Schätzt die Wortzahl aus Post-Body-Blocks für JSON-LD-Schema. */
function estimateWordCount(blocks: PostBlock[]): number {
  let count = 0
  for (const b of blocks) {
    if (b.type === 'paragraph') {
      const text = typeof b.text === 'string'
        ? b.text
        : b.text.map(p => (typeof p === 'string' ? p : p.text)).join(' ')
      count += text.split(/\s+/).length
    } else if (b.type === 'heading') {
      count += b.text.split(/\s+/).length
    } else if (b.type === 'list') {
      count += b.items.reduce((n, i) => n + i.split(/\s+/).length, 0)
    } else if (b.type === 'quote') {
      count += b.text.split(/\s+/).length
    }
  }
  return count
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = getInternalPost(slug)
  if (!post) notFound()

  // Tag-basiert verwandte Posts (fallback aktuellste)
  const relatedPosts = getRelatedPosts(post.slug, 3)

  const wordCount = estimateWordCount(post.body)
  // Lesezeit aus dem tatsächlichen Body ableiten (mind. 1 Min), nicht aus
  // dem statischen reading-Feld. Hält Anzeige + Schema synchron mit dem Text.
  const readingMinutes = Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE))

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Start', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog',  item: SITE_URL + '/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${SITE_URL}/blog/${post.slug}` },
    ],
  }

  const postJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id':       `${SITE_URL}/blog/${post.slug}`,
    headline:    post.title,
    description: post.excerpt,
    abstract:    post.excerpt,
    datePublished: post.date,
    dateModified:  post.date,
    inLanguage:  'de-DE',
    keywords:    post.tags.join(', '),
    articleSection: post.tags[0] ?? 'Blog',
    wordCount,
    timeRequired: `PT${readingMinutes}M`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id':   `${SITE_URL}/blog/${post.slug}`,
    },
    author:    { '@id': SITE_URL + '/#person-stefan-braum' },
    publisher: { '@id': SITE_URL + '/#organization' },
    ...(post.takeaways && post.takeaways.length > 0
      ? {
          mentions: {
            '@type': 'ItemList',
            name: 'Key Takeaways',
            itemListElement: post.takeaways.map((t, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              item: t,
            })),
          },
        }
      : {}),
    ...(post.ogImage ? { image: post.ogImage } : {}),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(postJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ArticleReadingProgress />
      <PageHero
        compact
        eyebrowNum=""
        eyebrow={`Blog · ${DATE_FORMATTER.format(new Date(post.date))}`}
        title={post.title}
        lede={post.excerpt}
      >
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2">
          <span
            className="font-mono uppercase"
            style={{
              fontSize: 'var(--t-micro)',
              letterSpacing: 'var(--tr-eyebrow)',
              color: 'var(--fg-muted)',
            }}
          >
            {readingMinutes} min Lesezeit
          </span>
          {post.tags.length > 0 && (
            <>
              <span style={{ color: 'var(--fg-faint)' }}>·</span>
              <ul className="flex flex-wrap items-center gap-2">
                {post.tags.map(t => (
                  <li
                    key={t}
                    className="font-mono uppercase"
                    style={{
                      fontSize: '10px',
                      letterSpacing: 'var(--tr-eyebrow)',
                      color: 'var(--fg-muted)',
                      padding: '3px 8px',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--r-pill)',
                    }}
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </PageHero>

      {/* Article-Section: KEIN overflow-hidden hier, sonst bricht Sticky-TOC */}
      <section
        className="relative py-20 md:py-28"
        style={{ background: 'var(--bg-base)', color: 'var(--fg-default)' }}
      >
        <AccentGlow position="top-right" intensity="low" />
        <div className="relative z-[2] mx-auto w-full max-w-[var(--container-wide)] px-6 md:px-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16 xl:grid-cols-[240px_minmax(0,720px)_1fr] xl:gap-20">
            {/* Sticky TOC links */}
            <div className="lg:pt-2">
              <TableOfContents containerSelector="article.blog-article" />
            </div>

            {/* Article-Body */}
            <article className="blog-article mx-auto w-full max-w-[720px] lg:mx-0">
              <PostSummary text={post.excerpt} />

              {post.body.map((block, i) => (
                <Block key={i} block={block} />
              ))}

              {post.takeaways && post.takeaways.length > 0 && (
                <PostTakeaways items={post.takeaways} />
              )}

              <div
                className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t pt-8"
                style={{ borderColor: 'var(--border-subtle)' }}
              >
                <p
                  className="font-mono uppercase"
                  style={{
                    fontSize: 10,
                    letterSpacing: '0.22em',
                    color: 'var(--fg-subtle)',
                  }}
                >
                  Gefällt dir? Teile den Post.
                </p>
                <ShareBar title={post.title} position="inline" />
              </div>

              <AuthorBox />

              <div className="mt-12 border-t pt-10"
                style={{ borderColor: 'var(--border-subtle)' }}
              >
                <Link
                  href="/blog"
                  data-cursor="magnetic"
                  className="inline-flex items-center gap-2 font-body transition-colors duration-220 hover:text-[color:var(--fg-default)]"
                  style={{
                    fontSize: 'var(--t-body)',
                    color: 'var(--fg-muted)',
                  }}
                >
                  <ArrowLeft size={14} strokeWidth={1.5} />
                  Alle Notizen
                </Link>
              </div>
            </article>

            {/* Optionale rechte Marginalspalte für Pull-Quotes / Cross-Links — derzeit leer */}
            <div className="hidden xl:block" />
          </div>
        </div>
      </section>

      <RelatedPosts posts={relatedPosts} />
    </>
  )
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[äöüß]/g, c => ({ ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss' }[c] ?? c))
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

/** Rendert ein einzelnes Post-Block-Element. */
function Block({ block }: { block: PostBlock }) {
  switch (block.type) {
    case 'heading': {
      const Tag = block.level === 2 ? 'h2' : 'h3'
      const size = block.level === 2
        ? 'clamp(26px, 2.8vw, 38px)'
        : 'clamp(20px, 2vw, 26px)'
      const slug = slugifyHeading(block.text)
      return (
        <Tag
          id={slug}
          className={
            'group font-display font-semibold first:mt-0 ' +
            (block.level === 2 ? 'mt-16' : 'mt-12')
          }
          style={{
            fontSize: size,
            lineHeight: 1.2,
            letterSpacing: 'var(--tr-heading)',
            color: 'var(--fg-default)',
            scrollMarginTop: 96,
          }}
        >
          <HeadingAnchor slug={slug}>{block.text}</HeadingAnchor>
        </Tag>
      )
    }
    case 'paragraph':
      return (
        <p
          className="mt-7 font-body first:mt-0 blog-paragraph"
          style={{
            fontSize: 'clamp(17px, 1.5vw, 19px)',
            lineHeight: 1.72,
            color: 'var(--fg-default)',
            letterSpacing: '-0.005em',
          }}
        >
          {typeof block.text === 'string'
            ? <ReadingHighlight text={block.text} />
            : block.text.map((part, i) => <InlinePart key={i} part={part} />)}
        </p>
      )
    case 'list':
      return (
        <ul className="mt-6 space-y-3">
          {block.items.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-3 font-body"
              style={{
                fontSize: 'var(--t-body-lg)',
                lineHeight: 1.55,
                color: 'var(--fg-default)',
              }}
            >
              <span
                aria-hidden
                className="mt-3 inline-block h-1.5 w-1.5 shrink-0"
                style={{
                  background: 'var(--accent)',
                  borderRadius: 'var(--r-pill)',
                }}
              />
              <ReadingHighlight text={item} />
            </li>
          ))}
        </ul>
      )
    case 'quote':
      return (
        <blockquote
          className="mt-12 border-l-2 pl-6 font-display first:mt-0"
          style={{
            borderColor: 'var(--accent)',
            fontSize: 'clamp(20px, 2.2vw, 28px)',
            lineHeight: 1.35,
            letterSpacing: 'var(--tr-heading)',
            color: 'var(--fg-default)',
            fontStyle: 'italic',
            fontFamily: 'var(--font-accent)',
            fontWeight: 400,
          }}
        >
          „{block.text}"
        </blockquote>
      )
    case 'code':
      return <CodeBlock code={block.code} language={block.language} />
    case 'table':
      return (
        <div
          className="mt-10 overflow-x-auto first:mt-0"
          style={{
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--r-md)',
          }}
        >
          <table
            className="w-full font-body"
            style={{
              borderCollapse: 'collapse',
              fontSize: 'var(--t-body-sm)',
              color: 'var(--fg-default)',
            }}
          >
            <thead>
              <tr>
                {block.headers.map((h, i) => (
                  <th
                    key={i}
                    scope="col"
                    className="font-mono uppercase"
                    style={{
                      textAlign: 'left',
                      padding: '14px 18px',
                      borderBottom: '1px solid var(--border-subtle)',
                      fontSize: 'var(--t-micro)',
                      letterSpacing: 'var(--tr-eyebrow)',
                      fontWeight: 500,
                      color: 'var(--fg-muted)',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      style={{
                        padding: '14px 18px',
                        borderTop: ri === 0 ? 'none' : '1px solid var(--border-subtle)',
                        verticalAlign: 'top',
                        lineHeight: 1.55,
                        color: ci === 0 ? 'var(--brand)' : 'var(--fg-default)',
                        fontFamily: ci === 0 ? 'var(--font-mono)' : 'var(--font-body)',
                        fontSize: ci === 0 ? 'var(--t-micro)' : 'var(--t-body-sm)',
                        letterSpacing: ci === 0 ? 'var(--tr-eyebrow)' : 'normal',
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
  }
}

function InlinePart({ part }: { part: Inline }) {
  if (typeof part === 'string') return <GlossarHighlight text={part} />
  const isExternal = /^https?:\/\//.test(part.href)
  const className =
    'underline decoration-[color:var(--accent)] decoration-1 underline-offset-[6px] transition-colors duration-220 hover:text-[color:var(--accent)]'
  if (isExternal) {
    return (
      <a
        href={part.href}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="magnetic"
        className={className}
      >
        {part.text}
      </a>
    )
  }
  return (
    <Link href={part.href} data-cursor="magnetic" className={className}>
      {part.text}
    </Link>
  )
}
