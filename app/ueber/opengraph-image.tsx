import { renderBrandOg } from '@/lib/og-template'

export const runtime     = 'edge'
export const alt         = 'Über Stefan Braum · Operator, Lotse, Praktiker'
export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpenGraphImage() {
  return renderBrandOg({
    eyebrowNum: '06',
    eyebrow:    'Über Stefan',
    title:      'Nicht Berater. Operator.',
    italic:     'Operator',
    section:    'PERSON',
  })
}
