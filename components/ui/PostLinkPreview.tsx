'use client'

import { motion, AnimatePresence } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import type { ExternalPost } from '@/lib/posts'

interface PostLinkPreviewProps {
  post: ExternalPost
  show: boolean
}

const DATE_FORMATTER = new Intl.DateTimeFormat('de-DE', {
  day:   'numeric',
  month: 'short',
  year:  'numeric',
})

/**
 * Floating Glass-Card-Tooltip für externe Posts.
 * Erscheint bei Hover unterhalb der PostCard mit Quelle, Titel, Excerpt, Datum.
 * Desktop-Enhancement (Touch-Geräte triggern kein Hover).
 */
export default function PostLinkPreview({ post, show }: PostLinkPreviewProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          aria-hidden
          initial={{ opacity: 0, y: -6, scale: 0.96 }}
          animate={{ opacity: 1, y: 0,  scale: 1 }}
          exit={{    opacity: 0, y: -4, scale: 0.98 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none absolute left-0 z-30 hidden md:block"
          style={{
            top: 'calc(100% + 12px)',
            width: '320px',
            maxWidth: 'calc(100vw - 32px)',
            background: 'rgba(15, 14, 12, 0.88)',
            backdropFilter: 'blur(20px) saturate(160%)',
            WebkitBackdropFilter: 'blur(20px) saturate(160%)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--r-md)',
            padding: '16px 18px',
            boxShadow:
              '0 18px 44px -12px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(220, 128, 68, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
          }}
        >
          <p
            className="inline-flex items-center gap-1.5 font-mono uppercase"
            style={{
              fontSize: '10px',
              letterSpacing: 'var(--tr-eyebrow)',
              color: 'var(--brand)',
            }}
          >
            <ArrowUpRight size={11} strokeWidth={1.6} />
            {post.source}
          </p>

          <div
            aria-hidden
            className="my-3"
            style={{ height: '1px', background: 'var(--border-subtle)' }}
          />

          <h4
            className="font-display font-semibold"
            style={{
              fontSize: '14px',
              lineHeight: 1.3,
              letterSpacing: 'var(--tr-heading)',
              color: 'var(--fg-default)',
            }}
          >
            {post.title}
          </h4>

          <p
            className="mt-2 font-body"
            style={{
              fontSize: '12px',
              lineHeight: 1.5,
              color: 'var(--fg-muted)',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {post.excerpt}
          </p>

          <p
            className="mt-3 font-mono uppercase"
            style={{
              fontSize: '10px',
              letterSpacing: 'var(--tr-eyebrow)',
              color: 'var(--fg-subtle)',
            }}
          >
            {DATE_FORMATTER.format(new Date(post.date)).toUpperCase()}
            <span style={{ color: 'var(--fg-faint)', margin: '0 8px' }}>·</span>
            Externer Beitrag
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
