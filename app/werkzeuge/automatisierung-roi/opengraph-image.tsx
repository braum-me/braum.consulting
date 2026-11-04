import { renderBrandOg } from '@/lib/og-template'

export const runtime     = 'edge'
export const alt         = 'Automatisierungs-ROI: Was spart Automatisierung wirklich?'
export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpenGraphImage() {
  return renderBrandOg({
    eyebrowNum: '08',
    eyebrow:    'Werkzeug · Automatisierung',
    title:      'Was spart Automatisierung wirklich?',
    italic:     'wirklich',
    section:    'WERKZEUG',
  })
}
