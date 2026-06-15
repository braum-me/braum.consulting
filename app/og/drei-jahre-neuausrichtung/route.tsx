import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

export const runtime = 'nodejs'
export const dynamic = 'force-static'

// Satori (next/og) braucht unkomprimierte OTF/TTF, keine WOFF2.
// Entpackte Kopien liegen unter public/fonts/og/, frisch dekomprimiert via woff2_decompress.
const FONT_DIR = path.join(process.cwd(), 'public/fonts/og')

async function loadFonts() {
  const [akmornExtraBold, akmornSemiBold, instrumentItalic] = await Promise.all([
    readFile(path.join(FONT_DIR, 'AkmornGrotesque-ExtraBold.ttf')),
    readFile(path.join(FONT_DIR, 'AkmornGrotesque-SemiBold.ttf')),
    readFile(path.join(FONT_DIR, 'InstrumentSerif-Italic.ttf')),
  ])
  return [
    { name: 'Akmorn', data: akmornExtraBold, weight: 800 as const, style: 'normal' as const },
    { name: 'Mono', data: akmornSemiBold, weight: 600 as const, style: 'normal' as const },
    { name: 'Instrument', data: instrumentItalic, weight: 400 as const, style: 'italic' as const },
  ]
}

export async function GET() {
  const fonts = await loadFonts()

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          backgroundColor: '#0F0E0C',
          backgroundImage: [
            'radial-gradient(55% 48% at 18% 0%, rgba(220, 128, 68, 0.30) 0%, rgba(146, 48, 30, 0.16) 45%, transparent 72%)',
            'radial-gradient(40% 60% at 95% 90%, rgba(146, 48, 30, 0.24) 0%, transparent 60%)',
          ].join(', '),
          color: '#F2F0EB',
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontFamily: 'Mono',
            fontSize: 18,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: '#9F9B92',
          }}
        >
          <span style={{ color: '#DC8044' }}>01</span>
          <span style={{ margin: '0 14px' }}>/</span>
          <span>Braum Consulting · Neuausrichtung</span>
          <span
            style={{
              marginLeft: 14,
              width: 6,
              height: 6,
              borderRadius: 999,
              background: '#92301E',
            }}
          />
        </div>

        {/* Headline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'Akmorn',
            fontWeight: 800,
            fontSize: 96,
            letterSpacing: '-0.035em',
            lineHeight: 0.96,
            color: '#F2F0EB',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <span>Drei Jahre. Vier&nbsp;</span>
            <span
              style={{
                fontFamily: 'Instrument',
                fontStyle: 'italic',
                fontWeight: 400,
                color: '#DC8044',
              }}
            >
              Felder
            </span>
            <span>.</span>
          </div>
          <div style={{ display: 'flex' }}>Eine Hand.</div>
          <div
            style={{
              display: 'flex',
              marginTop: 28,
              fontFamily: 'Mono',
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: '-0.010em',
              color: '#9F9B92',
            }}
          >
            Lotsenprinzip statt Berater-Folien.
          </div>
        </div>

        {/* Signature */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: 'Mono',
            fontSize: 16,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: '#6C6862',
          }}
        >
          <span>Stefan Braum · braum.consulting</span>
          <span style={{ color: '#DC8044' }}>cb</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts,
    },
  )
}
