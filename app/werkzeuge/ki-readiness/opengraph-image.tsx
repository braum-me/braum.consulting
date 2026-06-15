import { renderBrandOg } from '@/lib/og-template'

export const runtime     = 'edge'
export const alt         = 'KI-Readiness-Check für den Mittelstand'
export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpenGraphImage() {
  return renderBrandOg({
    eyebrowNum: '04',
    eyebrow:    'Werkzeug · KI',
    title:      'Bereit für KI?',
    italic:     'KI',
    section:    'WERKZEUG',
  })
}
