/**
 * RelatedPosts — Abschluss-Section auf der Blog-Detailseite.
 *
 * Zeigt 2–3 verwandte interne Posts (Tag-Overlap, sonst aktuellste) als
 * PostCards. Daten kommen via getRelatedPosts() aus lib/posts.ts und werden
 * von der Detail-Page reingereicht — diese Komponente rendert nur.
 *
 * Server-Component, brand-konform (Eyebrow → Headline → Cards).
 */

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import Section from '@/components/ui/Section'
import Eyebrow from '@/components/ui/Eyebrow'
import AccentGlow from '@/components/ui/AccentGlow'
import PostCard from '@/components/ui/PostCard'
import type { InternalPost } from '@/lib/posts'

interface RelatedPostsProps {
  posts: InternalPost[]
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null

  return (
    <Section
      className="py-20 md:py-28"
      background={<AccentGlow position="bottom-left" intensity="low" />}
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <Eyebrow>Verwandte Notizen</Eyebrow>
          <h2
            className="mt-6 max-w-[720px] font-display font-bold"
            style={{
              fontSize: 'clamp(28px, 3.2vw, 40px)',
              lineHeight: 'var(--lh-display)',
              letterSpacing: 'var(--tr-display)',
              color: 'var(--fg-default)',
            }}
          >
            Was in der gleichen Richtung läuft.
          </h2>
        </div>
        <Link
          href="/blog"
          data-cursor="magnetic"
          className="inline-flex items-center gap-2 font-body transition-colors duration-220 hover:text-[color:var(--fg-default)]"
          style={{
            fontSize: 'var(--t-body)',
            color: 'var(--fg-muted)',
          }}
        >
          Alle ansehen
          <ArrowUpRight size={14} strokeWidth={1.5} />
        </Link>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {posts.map(p => (
          <PostCard key={p.slug} post={p} />
        ))}
      </div>
    </Section>
  )
}
