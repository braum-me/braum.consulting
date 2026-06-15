import { renderBrandOg } from '@/lib/og-template'

export const runtime     = 'edge'
export const alt         = 'Cyber-Schaden: Was kostet ein Tag Stillstand?'
export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpenGraphImage() {
  return renderBrandOg({
    eyebrowNum: '11',
    eyebrow:    'Werkzeug · Risiko',
    title:      'Was kostet ein Tag Stillstand?',
    italic:     'Stillstand',
    section:    'WERKZEUG',
  })
}
