import { renderBrandOg } from '@/lib/og-template'

export const runtime     = 'edge'
export const alt         = 'KI & DSGVO: Darf ich dieses KI-Tool so nutzen?'
export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpenGraphImage() {
  return renderBrandOg({
    eyebrowNum: '09',
    eyebrow:    'Werkzeug · KI & DSGVO',
    title:      'Darf ich dieses KI-Tool so nutzen?',
    italic:     'nutzen',
    section:    'WERKZEUG',
  })
}
