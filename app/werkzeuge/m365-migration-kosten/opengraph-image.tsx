import { renderBrandOg } from '@/lib/og-template'

export const runtime     = 'edge'
export const alt         = 'M365-Migration: Aufwand einschätzen'
export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpenGraphImage() {
  return renderBrandOg({
    eyebrowNum: '02',
    eyebrow:    'Werkzeug · M365',
    title:      'Was treibt deine Migration?',
    italic:     'Migration',
    section:    'WERKZEUG',
  })
}
