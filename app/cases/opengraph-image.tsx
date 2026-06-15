import { renderBrandOg } from '@/lib/og-template'
import { CASES } from '@/lib/cases'

export const runtime     = 'edge'
export const alt         = 'Portfolio · Dokumentierte Cases aus Marke, M365, KI und Strategie'
export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpenGraphImage() {
  return renderBrandOg({
    eyebrowNum: '03',
    eyebrow:    `Portfolio · ${CASES.length} Cases`,
    title:      'Engagements aus der Substanz.',
    italic:     'Substanz',
    section:    'CASES · 2026',
  })
}
