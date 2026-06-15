import { renderBrandOg } from '@/lib/og-template'

export const runtime     = 'edge'
export const alt         = 'Werkzeuge · Selbst-Checks für den Einstieg'
export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpenGraphImage() {
  return renderBrandOg({
    eyebrow: 'Werkzeuge',
    title:   'Erst mal selbst sortieren.',
    italic:  'sortieren',
    section: 'WERKZEUGE',
  })
}
