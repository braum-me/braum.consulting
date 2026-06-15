import { renderBrandOg } from '@/lib/og-template'

export const runtime     = 'edge'
export const alt         = 'Phishing-Quiz: Erkennst du die Fälschung?'
export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpenGraphImage() {
  return renderBrandOg({
    eyebrowNum: '10',
    eyebrow:    'Werkzeug · Security',
    title:      'Erkennst du die Fälschung?',
    italic:     'Fälschung',
    section:    'WERKZEUG',
  })
}
