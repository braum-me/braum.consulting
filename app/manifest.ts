import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Braum Consulting',
    short_name: 'Braum',
    description:
      'Digitaler Lotse für Mittelstand und Industrie. Marke, Microsoft 365 oder Google Workspace, KI & Automatisierung und digitale Transformation.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0F0E0C',
    theme_color: '#0F0E0C',
    lang: 'de',
    icons: [
      {
        src: '/icon.png',
        sizes: '500x500',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/apple-icon.png',
        sizes: '500x500',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
