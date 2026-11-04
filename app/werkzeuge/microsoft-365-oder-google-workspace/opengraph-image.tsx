import { renderBrandOg } from '@/lib/og-template'

export const runtime     = 'edge'
export const alt         = 'Microsoft 365 oder Google Workspace?'
export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpenGraphImage() {
  return renderBrandOg({
    eyebrowNum: '05',
    eyebrow:    'Werkzeug · Cloud-Suite',
    title:      'Microsoft 365 oder Google?',
    italic:     'Google',
    section:    'WERKZEUG',
  })
}
