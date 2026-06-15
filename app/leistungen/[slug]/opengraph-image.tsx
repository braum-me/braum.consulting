import { renderBrandOg } from '@/lib/og-template'
import { getService } from '@/lib/services'

export const runtime     = 'edge'
export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt         = 'Leistung · Braum Consulting'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function OpenGraphImage({ params }: Props) {
  const { slug } = await params
  const s = getService(slug)
  if (!s) {
    return renderBrandOg({
      eyebrowNum: '03',
      eyebrow:    'Leistungen',
      title:      'Vier Felder. Eine Hand.',
      italic:     'Hand',
      section:    'LEISTUNGEN',
    })
  }

  return renderBrandOg({
    eyebrowNum: s.num,
    eyebrow:    `Leistung · ${s.duration}`,
    title:      s.title,
    section:    'LEISTUNG',
  })
}
