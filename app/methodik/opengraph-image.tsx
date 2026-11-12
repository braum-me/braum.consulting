import { renderBrandOg } from '@/lib/og-template'

export const runtime     = 'edge'
export const alt         = 'Methodik · Das Lotsenprinzip in vier Phasen'
export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpenGraphImage() {
  return renderBrandOg({
    eyebrowNum: '05',
    eyebrow:    'Methodik',
    title:      'Das Lotsenprinzip.',
    italic:     'Lotsenprinzip',
    section:    'METHODIK',
  })
}
