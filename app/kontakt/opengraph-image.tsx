import { renderBrandOg } from '@/lib/og-template'

export const runtime     = 'edge'
export const alt         = 'Kontakt · Reden wir. Ohne Folien.'
export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpenGraphImage() {
  return renderBrandOg({
    eyebrowNum: '04',
    eyebrow:    'Kontakt',
    title:      'Reden wir. Ohne Folien.',
    italic:     'Ohne',
    section:    'KONTAKT',
  })
}
