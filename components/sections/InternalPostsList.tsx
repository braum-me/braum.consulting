'use client'

/**
 * Blog-Liste der internen Posts.
 *
 * Layout: erster Post als Full-Width-Feature, der Rest in einem
 * 2-spaltigen Editorial-Grid (1-col auf Mobile). Statisch, kein Filter —
 * Tag-Surface läuft separat über die Tag-Cloud mit Deep-Links auf
 * `/blog/tag/[tag]`.
 */

import Link from 'next/link'
import Image from 'next/image'
import { ArrowDown, Clock } from 'lucide-react'
import type { InternalPost } from '@/lib/posts'

const MONTHS_DE = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli',  'August',  'September', 'Oktober', 'November', 'Dezember',
] as const

function formatDateDE(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  return `${d.getDate()}. ${MONTHS_DE[d.getMonth()]} ${d.getFullYear()}`
}

interface Props {
  posts: InternalPost[]
}

export default function InternalPostsList({ posts }: Props) {
  if (posts.length === 0) {
    return (
      <p
        className="mt-16 font-body"
        style={{ fontSize: 'var(--t-body-lg)', color: 'var(--fg-muted)' }}
      >
        Noch keine eigenen Posts veröffentlicht. Bald hier.
      </p>
    )
  }

  const [featured, ...rest] = posts

  return (
    <div style={{ marginTop: '64px' }}>
      {featured && <FeaturedPost post={featured} />}

      {rest.length > 0 && (
        <div
          className="mt-6 grid grid-cols-1 md:grid-cols-2"
          style={{ gap: '20px' }}
        >
          {rest.map(post => (
            <CompactPost key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Featured Post (Full-Width, Bild rechts) ────────────────────────── */

function FeaturedPost({ post }: { post: InternalPost }) {
  return (
    <article>
      <Link
        href={`/blog/${post.slug}`}
        data-cursor="card"
        data-cursor-label="lesen"
        className="glass-card group relative block overflow-hidden"
        style={{ padding: '24px' }}
      >
        {/* Featured-Marker oben rechts */}
        <span
          className="absolute font-mono uppercase"
          style={{
            top: '20px',
            right: '24px',
            fontSize: '9px',
            letterSpacing: '0.20em',
            color: 'var(--brand)',
            padding: '3px 9px',
            background: 'rgba(220, 128, 68, 0.10)',
            border: '1px solid rgba(220, 128, 68, 0.30)',
            borderRadius: 'var(--r-pill)',
            zIndex: 4,
          }}
        >
          Neuester
        </span>

        <div className="relative z-[3] grid grid-cols-1 gap-6 md:grid-cols-[1fr_320px] md:gap-10">
          {/* Text links */}
          <div className="flex flex-col" style={{ gap: '14px' }}>
            <div
              className="flex flex-wrap items-center"
              style={{ gap: '10px' }}
            >
              <span
                className="font-mono uppercase"
                style={{
                  fontSize: '10px',
                  letterSpacing: '0.18em',
                  color: 'var(--fg-muted)',
                }}
              >
                {formatDateDE(post.date)}
              </span>
              <span
                aria-hidden
                style={{
                  width: '12px',
                  height: '1px',
                  background: 'rgba(168, 117, 83, 0.30)',
                }}
              />
              <span
                className="inline-flex items-center font-mono uppercase"
                style={{
                  fontSize: '10px',
                  letterSpacing: '0.16em',
                  color: 'var(--fg-muted)',
                  gap: '5px',
                }}
              >
                <Clock size={10} strokeWidth={1.8} />
                {post.reading} Min
              </span>
            </div>

            <h3
              className="font-display font-semibold transition-colors duration-220 group-hover:text-[color:var(--brand)]"
              style={{
                fontSize: 'clamp(26px, 2.6vw, 34px)',
                lineHeight: 1.18,
                letterSpacing: 'var(--tr-heading)',
                color: 'var(--fg-default)',
              }}
            >
              {post.title}
            </h3>

            <p
              className="font-body"
              style={{
                fontSize: '16px',
                lineHeight: 1.6,
                color: 'var(--fg-muted)',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {post.excerpt}
            </p>

            {post.tags.length > 0 && (
              <ul
                className="mt-1 flex flex-wrap gap-1.5"
                style={{ listStyle: 'none', padding: 0, margin: 0 }}
              >
                {post.tags.slice(0, 4).map(t => (
                  <li
                    key={t}
                    className="font-mono"
                    style={{
                      fontSize: '10px',
                      letterSpacing: '0.02em',
                      padding: '3px 9px',
                      borderRadius: 'var(--r-pill)',
                      background: 'var(--bg-overlay)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--fg-default)',
                    }}
                  >
                    {t}
                  </li>
                ))}
              </ul>
            )}

            <span
              className="mt-3 inline-flex items-center gap-2 self-start font-mono uppercase transition-all duration-220 group-hover:translate-x-0.5"
              style={{
                fontSize: '11px',
                letterSpacing: '0.16em',
                color: 'var(--brand)',
              }}
            >
              Lesen
              <ArrowDown size={11} strokeWidth={1.6} />
            </span>
          </div>

          {/* OG-Bild rechts */}
          <div
            className="relative overflow-hidden"
            style={{
              aspectRatio: '1200 / 630',
              borderRadius: 'var(--r-sm)',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-base)',
            }}
          >
            {post.ogImage ? (
              <Image
                src={post.ogImage}
                alt=""
                fill
                sizes="(min-width: 768px) 320px, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
            ) : (
              <div
                className="flex h-full items-center justify-center"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(220, 128, 68, 0.20) 0%, rgba(146, 48, 30, 0.15) 100%)',
                }}
              >
                <span
                  className="font-mono uppercase"
                  style={{ fontSize: '9px', letterSpacing: '0.18em', color: 'var(--brand)' }}
                >
                  Notiz
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}

/* ── Compact Post (2-col Grid Tile) ─────────────────────────────────── */

function CompactPost({ post }: { post: InternalPost }) {
  return (
    <article className="h-full">
      <Link
        href={`/blog/${post.slug}`}
        data-cursor="card"
        data-cursor-label="lesen"
        className="glass-card group relative flex h-full flex-col overflow-hidden"
        style={{ padding: 0 }}
      >
        {/* OG-Bild oben */}
        <div
          className="relative overflow-hidden"
          style={{
            aspectRatio: '1200 / 630',
            background: 'var(--bg-base)',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          {post.ogImage ? (
            <Image
              src={post.ogImage}
              alt=""
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <div
              className="flex h-full items-center justify-center"
              style={{
                background:
                  'linear-gradient(135deg, rgba(220, 128, 68, 0.18) 0%, rgba(146, 48, 30, 0.12) 100%)',
              }}
            >
              <span
                className="font-mono uppercase"
                style={{ fontSize: '9px', letterSpacing: '0.18em', color: 'var(--brand)' }}
              >
                Notiz
              </span>
            </div>
          )}
        </div>

        {/* Text-Block */}
        <div
          className="relative z-[3] flex flex-1 flex-col"
          style={{ padding: '20px', gap: '10px' }}
        >
          <div
            className="flex flex-wrap items-center"
            style={{ gap: '10px' }}
          >
            <span
              className="font-mono uppercase"
              style={{
                fontSize: '10px',
                letterSpacing: '0.18em',
                color: 'var(--fg-muted)',
              }}
            >
              {formatDateDE(post.date)}
            </span>
            <span
              aria-hidden
              style={{
                width: '10px',
                height: '1px',
                background: 'rgba(168, 117, 83, 0.30)',
              }}
            />
            <span
              className="inline-flex items-center font-mono uppercase"
              style={{
                fontSize: '10px',
                letterSpacing: '0.16em',
                color: 'var(--fg-muted)',
                gap: '5px',
              }}
            >
              <Clock size={10} strokeWidth={1.8} />
              {post.reading} Min
            </span>
          </div>

          <h3
            className="font-display font-medium transition-colors duration-220 group-hover:text-[color:var(--brand)]"
            style={{
              fontSize: '20px',
              lineHeight: 1.25,
              letterSpacing: 'var(--tr-heading)',
              color: 'var(--fg-default)',
            }}
          >
            {post.title}
          </h3>

          <p
            className="font-body"
            style={{
              fontSize: '14px',
              lineHeight: 1.55,
              color: 'var(--fg-muted)',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {post.excerpt}
          </p>

          {post.tags.length > 0 && (
            <ul
              className="mt-1 flex flex-wrap gap-1.5"
              style={{ listStyle: 'none', padding: 0, margin: 0 }}
            >
              {post.tags.slice(0, 3).map(t => (
                <li
                  key={t}
                  className="font-mono"
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.02em',
                    padding: '3px 8px',
                    borderRadius: 'var(--r-pill)',
                    background: 'var(--bg-overlay)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--fg-default)',
                  }}
                >
                  {t}
                </li>
              ))}
            </ul>
          )}

          <span
            className="mt-auto inline-flex items-center gap-2 self-start font-mono uppercase transition-all duration-220 group-hover:translate-x-0.5"
            style={{
              fontSize: '11px',
              letterSpacing: '0.16em',
              color: 'var(--brand)',
              paddingTop: '6px',
            }}
          >
            Lesen
            <ArrowDown size={11} strokeWidth={1.6} />
          </span>
        </div>
      </Link>
    </article>
  )
}
