import { renderBrandOg } from '@/lib/og-template'
import { getGlossaryTerms } from '@/lib/cms'

export const runtime     = 'edge'
export const alt         = 'Lexikon · Begriffe aus Engagement-Praxis'
export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpenGraphImage() {
  const count = getGlossaryTerms().length
  return renderBrandOg({
    eyebrowNum: '06',
    eyebrow:    `Lexikon · ${count} Einträge`,
    title:      'Sprache vor Definition.',
    italic:     'Definition',
    section:    'LEXIKON',
  })
}
