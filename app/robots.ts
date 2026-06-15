import type { MetadataRoute } from 'next'

const SITE = 'https://braum.consulting'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow:     '/',
        // Funnel-Routen, die (noch) nicht indexiert werden sollen. Die
        // Haupt-Landingpage /lagebild bleibt bewusst crawlbar — nur die
        // coming-soon/privaten Unterseiten werden ausgeschlossen.
        //
        // Bewusste, konsistente Stufung (kein Widerspruch zu den per-Page
        // robots-noindex-Metas):
        //   • PRE-LAUNCH (jetzt): `disallow` ist das operative Signal — die
        //     Seiten sollen gar nicht gecrawlt werden. Das per-Page `noindex`
        //     (WIZARD_LIVE/BOOKING_LIVE=false) ist redundanter Schutz und
        //     greift als Fallback beim Go-Live, sobald der disallow-Eintrag
        //     hier entfernt wird (dann crawlbar + noindex, bis final live).
        //   • /briefing bleibt dauerhaft disallow (private, tokenbasiert).
        disallow:  ['/lagebild/check', '/lagebild/danke', '/termin', '/briefing'],
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host:    SITE,
  }
}
