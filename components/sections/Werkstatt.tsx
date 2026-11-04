import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import Section from '@/components/ui/Section'
import Eyebrow from '@/components/ui/Eyebrow'
import ItalicAccent from '@/components/ui/ItalicAccent'
import AccentGlow from '@/components/ui/AccentGlow'
import PostCard from '@/components/ui/PostCard'
import Reveal, { RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { getInternalPosts } from '@/lib/posts'

export default function Werkstatt() {
  const posts = getInternalPosts()
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3)

  return (
    <Section
      className="relative py-28 md:py-36"
      background={<AccentGlow position="top-right" intensity="medium" />}
    >
      <Reveal>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[760px]">
            <Eyebrow num="08">Werkstatt</Eyebrow>
            <h2
              className="mt-6 font-display font-bold"
              style={{
                fontSize: 'clamp(40px, 5vw, 72px)',
                lineHeight: 'var(--lh-display)',
                letterSpacing: 'var(--tr-display)',
                color: 'var(--fg-default)',
              }}
            >
              Aus dem <ItalicAccent>Blog</ItalicAccent>.
            </h2>
            <p
              className="mt-8 font-body"
              style={{
                fontSize: 'var(--t-body-lg)',
                lineHeight: 1.55,
                color: 'var(--fg-muted)',
                maxWidth: '60ch',
              }}
            >
              Notizen aus laufenden Engagements, Tool-Bewertungen und
              Praxisreflexionen. Long-Form zu Marke, M365, KI und Strategie.
            </p>
          </div>

          <Link
            href="/blog"
            data-cursor="magnetic"
            className="cta-ghost inline-flex items-center gap-2 font-body transition-colors duration-220 hover:text-[color:var(--fg-default)]"
            style={{
              fontSize: 'var(--t-body)',
              color: 'var(--fg-muted)',
            }}
          >
            Alle Notizen ansehen
            <ArrowUpRight size={14} strokeWidth={1.5} />
          </Link>
        </div>
      </Reveal>

      <RevealGroup
        className={
          'mt-14 grid grid-cols-1 gap-6 md:mt-16 ' +
          (posts.length >= 3
            ? 'md:grid-cols-3'
            : posts.length === 2
              ? 'md:grid-cols-2'
              : 'md:grid-cols-1 md:max-w-[440px]')
        }
        staggerDelay={0.1}
        staggerInitial={0.15}
      >
        {posts.map(post => (
          <RevealItem key={post.slug} y={20}>
            <PostCard post={post} />
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  )
}
