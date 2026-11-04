import { renderBrandOg } from '@/lib/og-template'
import { getInternalPost } from '@/lib/posts'

export const runtime     = 'edge'
export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt         = 'Blog-Post · Braum Consulting'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function OpenGraphImage({ params }: Props) {
  const { slug } = await params
  const post = getInternalPost(slug)
  if (!post) {
    return renderBrandOg({
      eyebrowNum: '02',
      eyebrow:    'Notizen',
      title:      'Long-Form rund um die Praxis.',
      italic:     'Praxis',
      section:    'BLOG',
    })
  }

  return renderBrandOg({
    eyebrowNum: '02',
    eyebrow:    `Notiz · ${post.reading} Min`,
    title:      post.title,
    section:    `BLOG · ${new Date(post.date).getFullYear()}`,
  })
}
