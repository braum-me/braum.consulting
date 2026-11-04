import { renderBrandOg } from '@/lib/og-template'

export const runtime     = 'edge'
export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt         = 'Termin · 30 Minuten Lagebild-Gespräch mit Stefan Braum'

export default async function OpenGraphImage() {
  return renderBrandOg({
    eyebrow:       'Termin · 30 Minuten · Video / Telefon',
    eyebrowAccent: true,
    title:         'Termin direkt buchen.',
    italic:        'Termin',
    titleSize:     112,
    lede:          'Bewusst am Abend und am Wochenende. Mo–Do ab 17:00, Fr ab 15:00, Sa + So ganztägig. Voller Fokus, ungeteilte Aufmerksamkeit.',
    footerNote:    { lead: 'Kein Pitch.', accent: 'Nur Lage.' },
  })
}
