import { renderBrandOg } from '@/lib/og-template'
import { getPostsByTag } from '@/lib/posts'

export const runtime     = 'edge'
export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt         = 'Tag · Braum Consulting'

interface Props {
  params: Promise<{ tag: string }>
}

export default async function OpenGraphImage({ params }: Props) {
  const { tag } = await params
  const decoded = decodeURIComponent(tag)
  const posts = getPostsByTag(decoded)

  return renderBrandOg({
    eyebrowNum: '02',
    eyebrow:    `Tag · ${posts.length} ${posts.length === 1 ? 'Beitrag' : 'Beiträge'}`,
    title:      decoded,
    italic:     decoded,
    section:    'BLOG · TAG',
  })
}
