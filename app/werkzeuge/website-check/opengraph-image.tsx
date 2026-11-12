import { renderBrandOg } from '@/lib/og-template'

export const runtime     = 'edge'
export const alt         = 'Website-Check: Bringt deine Website Anfragen?'
export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpenGraphImage() {
  return renderBrandOg({
    eyebrowNum: '07',
    eyebrow:    'Werkzeug · Website',
    title:      'Bringt deine Website Anfragen?',
    italic:     'Anfragen',
    section:    'WERKZEUG',
  })
}
