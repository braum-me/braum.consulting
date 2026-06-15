import { renderBrandOg } from '@/lib/og-template'

export const runtime     = 'edge'
export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt         = 'Lagebild-Check · 4 Minuten Selbst-Check, Briefing per Mail'

export default async function OpenGraphImage() {
  return renderBrandOg({
    eyebrowNum:    '01',
    eyebrow:       'Lagebild · 4 Minuten',
    eyebrowAccent: true,
    title:         'Lass uns Lage machen.',
    italic:        'Lage',
    titleSize:     112,
    lede:          '12 – 15 Fragen, conditional. Im Anschluss kommt ein persönliches Briefing mit drei Reibungspunkten, Roadmap-Skizze und konkreten ersten Schritten.',
    section:       'MARKE · M365 · AI · STRATEGIE',
  })
}
