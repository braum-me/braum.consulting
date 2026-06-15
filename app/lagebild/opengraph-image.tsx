import { renderBrandOg } from '@/lib/og-template'

export const runtime     = 'edge'
export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt         = 'Lagebild · Erst Lage, dann Kurs'

export default async function OpenGraphImage() {
  return renderBrandOg({
    eyebrow:       'Lagebild · Selbst-Check oder Termin',
    eyebrowAccent: true,
    title:         'Erst Lage, dann Kurs.',
    italic:        'Lage',
    titleSize:     120,
    lede:          'Strukturierter Selbst-Check mit persönlichem Briefing — oder direkter Termin.',
    footerNote:    { lead: 'Operator,', accent: 'kein Berater.' },
  })
}
