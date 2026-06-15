import { renderBrandOg } from '@/lib/og-template'

export const runtime     = 'edge'
export const alt         = 'NIS2-Betroffenheit prüfen'
export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpenGraphImage() {
  return renderBrandOg({
    eyebrowNum: '01',
    eyebrow:    'Werkzeug · NIS2',
    title:      'Bin ich von NIS2 betroffen?',
    italic:     'betroffen',
    section:    'WERKZEUG',
  })
}
