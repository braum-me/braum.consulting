import { renderBrandOg } from '@/lib/og-template'

export const runtime     = 'edge'
export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt         = 'Braum Consulting · Digitales Handwerk für den Industriemittelstand'

export default async function OpenGraphImage() {
  return renderBrandOg({
    eyebrowNum: '01',
    eyebrow:    'Boutique-Praxis · Industriemittelstand',
    title:      'Digitales Handwerk für Unternehmen mit Substanz.',
    italic:     'Substanz',
    titleSize:  84,
    section:    'BRAUM · 2026',
  })
}
