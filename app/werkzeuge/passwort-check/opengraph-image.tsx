import { renderBrandOg } from '@/lib/og-template'

export const runtime     = 'edge'
export const alt         = 'Passwort-Check: Wie schnell ist dein Passwort geknackt?'
export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpenGraphImage() {
  return renderBrandOg({
    eyebrowNum: '12',
    eyebrow:    'Werkzeug · Security',
    title:      'Wie schnell ist dein Passwort geknackt?',
    italic:     'geknackt',
    section:    'WERKZEUG',
  })
}
