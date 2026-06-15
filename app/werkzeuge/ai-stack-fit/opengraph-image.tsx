import { renderBrandOg } from '@/lib/og-template'

export const runtime     = 'edge'
export const alt         = 'AI-Stack-Fit · Welcher KI-Stack passt zu dir?'
export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpenGraphImage() {
  return renderBrandOg({
    eyebrowNum: '01',
    eyebrow:    'Werkzeug · KI-Stack',
    title:      'Welcher KI-Stack passt zu dir?',
    italic:     'Stack',
    section:    'WERKZEUG',
  })
}
