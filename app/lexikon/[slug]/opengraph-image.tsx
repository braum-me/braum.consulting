import { renderBrandOg } from '@/lib/og-template'
import { getGlossaryTerm } from '@/lib/cms'

export const runtime     = 'edge'
export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt         = 'Lexikon · Braum Consulting'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function OpenGraphImage({ params }: Props) {
  const { slug } = await params
  const term = getGlossaryTerm(slug)
  if (!term) {
    return renderBrandOg({
      eyebrowNum: '06',
      eyebrow:    'Lexikon',
      title:      'Sprache vor Definition.',
      italic:     'Definition',
      section:    'LEXIKON',
    })
  }

  return renderBrandOg({
    eyebrowNum: '06',
    eyebrow:    `Lexikon · ${term.category}`,
    title:      term.term,
    italic:     term.term,
    section:    'BEGRIFF',
  })
}
