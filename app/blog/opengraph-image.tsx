import { renderBrandOg } from '@/lib/og-template'

export const runtime     = 'edge'
export const alt         = 'Notizen · Long-Form aus laufenden Engagements'
export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpenGraphImage() {
  return renderBrandOg({
    eyebrowNum: '02',
    eyebrow:    'Notizen',
    title:      'Long-Form rund um die Praxis.',
    italic:     'Praxis',
    section:    'BLOG · 2026',
  })
}
