import { renderBrandOg } from '@/lib/og-template'
import { getCase } from '@/lib/cases'

export const runtime     = 'edge'
export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt         = 'Case · Braum Consulting'

interface Props {
  params: Promise<{ id: string }>
}

export default async function OpenGraphImage({ params }: Props) {
  const { id } = await params
  const c = getCase(id)
  if (!c) {
    return renderBrandOg({
      eyebrowNum: '03',
      eyebrow:    'Portfolio',
      title:      'Engagements aus der Substanz.',
      italic:     'Substanz',
      section:    'CASES',
    })
  }

  return renderBrandOg({
    eyebrowNum: '03',
    eyebrow:    `${c.fieldLabel} · ${c.year}`,
    title:      c.title,
    section:    c.anonymized ? 'CASE · ANONYM' : 'CASE',
  })
}
