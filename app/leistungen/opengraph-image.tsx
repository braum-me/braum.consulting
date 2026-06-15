import { renderBrandOg } from '@/lib/og-template'

export const runtime     = 'edge'
export const alt         = 'Leistungen · Vier Felder, eine Hand'
export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpenGraphImage() {
  return renderBrandOg({
    eyebrowNum: '03',
    eyebrow:    'Leistungen',
    title:      'Vier Felder. Eine Hand.',
    italic:     'Hand',
    section:    'LEISTUNGEN',
  })
}
