'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { Post } from '@/lib/posts'
import PostLinkPreview from '@/components/ui/PostLinkPreview'

interface PostCardProps {
  post: Post
}

const DATE_FORMATTER = new Intl.DateTimeFormat('de-DE', {
  day:   'numeric',
  month: 'short',
  year:  'numeric',
})

function formatDate(iso: string): string {
  return DATE_FORMATTER.format(new Date(iso)).toUpperCase()
}

/**
 * Card für einen einzelnen Blog-Post (intern oder extern).
 * - intern: Link auf /blog/[slug], Hover mit Accent-Glow
 * - extern: Link direkt auf externe URL, Quellen-Tag oben rechts,
 *   dezenter Outline-Hover ohne Glow, plus Floating-Glass-Tooltip
 *   beim Hover (Desktop) mit Quelle, Titel-Echo, Excerpt + Datum.
 */
export default function PostCard({ post }: PostCardProps) {
  const isExternal = post.kind === 'external'
  const href = isExternal ? post.url : `/blog/${post.slug}`
  const [hovered, setHovered] = useState(false)

  const hoverHandlers = isExternal
    ? {
        onMouseEnter: () => setHovered(true),
        onMouseLeave: () => setHovered(false),
        onFocus:      () => setHovered(true),
        onBlur:       () => setHovered(false),
      }
    : {}

  return (
    <div className="relative" style={{ height: '100%' }} {...hoverHandlers}>
      <Link
        href={href}
        data-cursor="magnetic"
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className={
          'glass-card group flex flex-col p-8 md:p-10 ' +
          (isExternal ? 'glass-card--external' : '')
        }
        style={{ height: '100%' }}
      >
        <div className="relative z-[3] flex h-full flex-col">
          {/* Top-Row: Datum + ggf. externer Source-Tag */}
          <div className="flex items-start justify-between gap-3">
            <p
              className="font-mono uppercase"
              style={{
                fontSize: 'var(--t-micro)',
                letterSpacing: 'var(--tr-eyebrow)',
                color: 'var(--brand)',
              }}
            >
              {formatDate(post.date)}
            </p>

            {isExternal && (
              <span
                className="inline-flex items-center gap-1 font-mono uppercase"
                style={{
                  fontSize: '10px',
                  letterSpacing: 'var(--tr-eyebrow)',
                  color: 'var(--fg-muted)',
                  padding: '3px 8px',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--r-pill)',
                }}
              >
                <ArrowUpRight size={10} strokeWidth={1.5} />
                {post.source}
              </span>
            )}
          </div>

          <h3
            className="mt-6 font-display font-semibold"
            style={{
              fontSize: 'clamp(18px, 1.6vw, 22px)',
              lineHeight: 1.25,
              letterSpacing: 'var(--tr-heading)',
              color: 'var(--fg-default)',
            }}
          >
            {post.title}
          </h3>

          <p
            className="mt-4 font-body"
            style={{
              fontSize: 'var(--t-body-sm)',
              lineHeight: 1.55,
              color: 'var(--fg-muted)',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {post.excerpt}
          </p>

          <div className="mt-auto flex items-center justify-between pt-8">
            {post.kind === 'internal' ? (
              <span
                className="font-mono uppercase"
                style={{
                  fontSize: 'var(--t-micro)',
                  letterSpacing: 'var(--tr-eyebrow)',
                  color: 'var(--fg-subtle)',
                }}
              >
                {post.reading} min Lesezeit
              </span>
            ) : <span />}

            <span
              className="inline-flex items-center gap-2 font-body transition-colors duration-220 group-hover:text-[color:var(--accent)]"
              style={{
                fontSize: 'var(--t-body-sm)',
                color: 'var(--fg-default)',
              }}
            >
              Lesen
              <ArrowUpRight
                size={14}
                strokeWidth={1.5}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </span>
          </div>
        </div>
      </Link>

      {isExternal && <PostLinkPreview post={post} show={hovered} />}
    </div>
  )
}
