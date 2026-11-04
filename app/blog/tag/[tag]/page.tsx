import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ItalicAccent from '@/components/ui/ItalicAccent'
import BigHero from '@/components/sections/BigHero'
import PostCard from '@/components/ui/PostCard'
import { getAllTags, getPostsByTag } from '@/lib/posts'
// getAllTags wird sowohl für generateStaticParams als auch für die
// Filter-Chip-Leiste verwendet.

export async function generateStaticParams() {
  return getAllTags().map(t => ({ tag: t.tag }))
}

interface PageProps {
  params: Promise<{ tag: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)
  const posts = getPostsByTag(decodedTag)
  if (posts.length === 0) return {}

  return {
    title: `Notizen: ${decodedTag}`,
    description: `Alle Blog-Posts zum Tag „${decodedTag}". ${posts.length} Beiträge.`,
    alternates: { canonical: `/blog/tag/${encodeURIComponent(decodedTag)}` },
  }
}

export default async function BlogTagPage({ params }: PageProps) {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)
  const posts = getPostsByTag(decodedTag)
  if (posts.length === 0) notFound()

  const allTags = getAllTags()
  const activeLower = decodedTag.toLowerCase()

  return (
    <>
      <BigHero
        eyebrowNum="07"
        eyebrow={`Tag · ${posts.length} ${posts.length === 1 ? 'Beitrag' : 'Beiträge'}`}
        title={<><ItalicAccent>{decodedTag}</ItalicAccent></>}
        lede={`Alle Notizen mit dem Tag „${decodedTag}". Long-Form aus laufenden Engagements zu diesem Themenbereich.`}
        backLink={{ label: 'Alle Notizen', href: '/blog' }}
      />

      <section
        style={{
          maxWidth: 'var(--container-wide)',
          margin: '0 auto',
          padding: 'clamp(64px, 8vw, 112px) 24px clamp(96px, 12vw, 160px)',
        }}
      >
        {/* Filter-Chips: aktiver Tag hervorgehoben, „Alle" setzt zurück auf /blog */}
        <nav aria-label="Nach Tag filtern" className="mb-12">
          <p
            className="font-mono uppercase"
            style={{
              fontSize: '10px',
              letterSpacing: '0.20em',
              color: 'var(--fg-subtle)',
              marginBottom: '14px',
            }}
          >
            Filter
          </p>
          <ul
            className="flex flex-wrap gap-1.5"
            style={{ listStyle: 'none', padding: 0, margin: 0 }}
          >
            <li>
              <Link
                href="/blog#blog-posts"
                data-cursor="link"
                className="inline-flex items-center font-mono uppercase transition-all duration-220 hover:border-[color:var(--brand)] hover:text-[color:var(--brand)]"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.16em',
                  padding: '7px 14px',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--r-pill)',
                  color: 'var(--fg-muted)',
                  background: 'transparent',
                }}
              >
                Alle
              </Link>
            </li>
            {allTags.map(({ tag: t, count }) => {
              const isActive = t.toLowerCase() === activeLower
              return (
                <li key={t}>
                  <Link
                    href={`/blog/tag/${encodeURIComponent(t)}`}
                    data-cursor="link"
                    aria-current={isActive ? 'page' : undefined}
                    className={
                      'inline-flex items-center gap-1.5 font-mono uppercase transition-all duration-220 ' +
                      (isActive
                        ? ''
                        : 'hover:border-[color:var(--brand)] hover:text-[color:var(--brand)]')
                    }
                    style={{
                      fontSize: '11px',
                      letterSpacing: '0.16em',
                      padding: '7px 12px',
                      border: isActive
                        ? '1px solid var(--accent)'
                        : '1px solid var(--border-subtle)',
                      borderRadius: 'var(--r-pill)',
                      color: isActive ? 'var(--on-accent)' : 'var(--fg-muted)',
                      background: isActive ? 'var(--accent)' : 'transparent',
                    }}
                  >
                    {t}
                    <span style={{ opacity: 0.6, marginLeft: 2 }}>{count}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map(p => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>

        <div
          className="mt-20 border-t pt-10"
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
      </section>
    </>
  )
}
