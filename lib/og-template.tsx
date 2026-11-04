import { ImageResponse } from 'next/og'

/**
 * Shared Brand-OG-Image-Template.
 *
 * Konsistenter Brand-Look für alle Open-Graph-Bilder:
 *   - Top: kleine Eyebrow-Zeile mit Nummer + Label
 *   - Mitte: Big-Type Headline (italic-Accent optional)
 *   - Bottom: Stefan-Braum-Name + Domain + Section-Tag
 *
 * Alle OG-Bilder laufen über diesen Helper — die einzige Quelle für
 * Brand-BG, Glow, Typo, Akzentfarben und Layout. Pro Route nur eigener
 * Eyebrow / Title / Lede / Section.
 */

export const OG_SIZE = { width: 1200, height: 630 } as const
export const OG_CONTENT_TYPE = 'image/png'
export const OG_RUNTIME = 'edge' as const

export interface BrandOgProps {
  /** Eyebrow-Number, z.B. „02" */
  eyebrowNum?: string
  /** Eyebrow-Label, z.B. „Notizen" oder „Leistung 02" */
  eyebrow: string
  /** Eyebrow ganz in Akzent-Orange (statt Number-Akzent + grauem Label). */
  eyebrowAccent?: boolean
  /** Main-Headline. String oder Array von Teilen (zum Italic-Accent). */
  title:   string
  /** Schriftgröße der Headline in px. Default 88. */
  titleSize?: number
  /** Optionaler Italic-Accent-Teil (Brand-Color) der innerhalb des Titles
   *  hervorgehoben wird. Falls gesetzt, wird das erste Vorkommen im Title
   *  durch ein Italic-Span ersetzt. */
  italic?: string
  /** Optionaler Lede-Absatz unter der Headline. */
  lede?: string
  /** Section-Tag unten rechts, z.B. „BLOG · 2026" oder „CASE 03-H1".
   *  Wird ignoriert, wenn footerNote gesetzt ist. */
  section?: string
  /** Optionaler Footer-Hinweis unten rechts (zweiteilig, zweiter Teil
   *  in Akzent-Orange), z.B. „Kein Pitch." / „Nur Lage." */
  footerNote?: { lead: string; accent: string }
  /** Alt-Text — durchgereicht für Konsistenz, optional. */
  alt?: string
}

export function renderBrandOg({
  eyebrowNum,
  eyebrow,
  eyebrowAccent,
  title,
  titleSize = 88,
  italic,
  lede,
  section,
  footerNote,
}: BrandOgProps): ImageResponse {
  // Title splitten falls italic darin vorkommt
  let titleParts: Array<{ text: string; italic: boolean }> = [{ text: title, italic: false }]
  if (italic && title.includes(italic)) {
    const idx = title.indexOf(italic)
    titleParts = [
      { text: title.slice(0, idx),                       italic: false },
      { text: italic,                                    italic: true  },
      { text: title.slice(idx + italic.length),          italic: false },
    ].filter(p => p.text.length > 0)
  }

  return new ImageResponse(
    (
      <div
        style={{
          width:  '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          background:
            'radial-gradient(55% 48% at 18% 0%, rgba(220,128,68,0.32) 0%, rgba(146,48,30,0.18) 45%, transparent 72%),' +
            'radial-gradient(40% 60% at 95% 90%, rgba(146,48,30,0.26) 0%, transparent 60%),' +
            'linear-gradient(180deg, #0F0E0C 0%, #1C1B18 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Eyebrow oben */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontFamily: 'monospace',
            fontSize: '20px',
            letterSpacing: eyebrowAccent ? '0.20em' : '0.16em',
            textTransform: 'uppercase',
            color: eyebrowAccent ? '#DC8044' : '#9F9B92',
          }}
        >
          {eyebrowNum && (
            <>
              <span style={{ color: '#DC8044' }}>{eyebrowNum}</span>
              <span style={{ color: '#4A4742' }}>/</span>
            </>
          )}
          <span>{eyebrow}</span>
        </div>

        {/* Headline mittig */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h1
            style={{
              fontSize: `${titleSize}px`,
              fontWeight: 800,
              lineHeight: 0.96,
              letterSpacing: '-0.035em',
              color: '#F2F0EB',
              margin: 0,
              maxWidth: '1000px',
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            {titleParts.map((p, i) =>
              p.italic ? (
                <span
                  key={i}
                  style={{
                    fontFamily: 'Georgia, serif',
                    fontStyle: 'italic',
                    color: '#DC8044',
                    fontWeight: 400,
                  }}
                >
                  {p.text}
                </span>
              ) : (
                <span key={i}>{p.text}</span>
              ),
            )}
          </h1>
          {lede && (
            <p
              style={{
                marginTop: 36,
                fontSize: '26px',
                lineHeight: 1.4,
                color: '#9F9B92',
                maxWidth: 820,
              }}
            >
              {lede}
            </p>
          )}
        </div>

        {/* Bottom — Stefan / Domain / Section */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            color: '#9F9B92',
            fontFamily: 'monospace',
            fontSize: '20px',
            letterSpacing: '0.04em',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ color: '#F2F0EB', fontSize: '24px', fontWeight: 600 }}>
              Stefan Braum
            </span>
            <span>braum.consulting</span>
          </div>
          {footerNote ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span>{footerNote.lead}</span>
              <span style={{ color: '#DC8044' }}>{footerNote.accent}</span>
            </div>
          ) : (
            section && (
              <span style={{ textTransform: 'uppercase' }}>{section}</span>
            )
          )}
        </div>
      </div>
    ),
    { ...OG_SIZE },
  )
}
