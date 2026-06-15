import { renderBrandOg } from '@/lib/og-template'

export const runtime     = 'edge'
export const alt         = 'ISO 27001 Readiness-Check'
export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpenGraphImage() {
  return renderBrandOg({
    eyebrowNum: '03',
    eyebrow:    'Werkzeug · ISO 27001',
    title:      'Wie weit ist dein ISMS?',
    italic:     'ISMS',
    section:    'WERKZEUG',
  })
}
