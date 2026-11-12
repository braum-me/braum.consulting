import { test, expect, type Page } from '@playwright/test'

/**
 * NIS2-Betroffenheit: Einstufung nach § 28 BSIG.
 * Größe = Mitarbeitende ODER (Umsatz UND Bilanzsumme); das höhere Kriterium zählt.
 * Referenz: die offizielle BSI-NIS-2-Betroffenheitsprüfung
 * (https://betroffenheitspruefung-nis-2.bsi.de/), am 12.11.2026 mit denselben
 * Angaben durchgespielt (P01–P14 und G01–G12). Weitere Fälle prüfen Sonderfälle
 * und Unsicherheiten, die das BSI-Werkzeug nicht abfragt.
 */

type Ma = 'Unter 50' | '50 bis 249' | '250 oder mehr' | 'Weiß ich nicht genau'
type Fin = 'Umsatz oder Bilanzsumme höchstens 10 Mio. €' | 'Umsatz und Bilanzsumme je über 10 Mio. €' | 'Umsatz über 50 Mio. € und Bilanzsumme über 43 Mio. €' | 'Weiß ich nicht genau'

/** Zahl → Antwort, genau nach den Beschriftungen (Grenzen inklusive). */
function maAus(n: number): Ma {
  return n >= 250 ? '250 oder mehr' : n >= 50 ? '50 bis 249' : 'Unter 50'
}
function finAus(umsatzMio: number, bilanzMio: number): Fin {
  if (umsatzMio > 50 && bilanzMio > 43) return 'Umsatz über 50 Mio. € und Bilanzsumme über 43 Mio. €'
  if (umsatzMio > 10 && bilanzMio > 10) return 'Umsatz und Bilanzsumme je über 10 Mio. €'
  return 'Umsatz oder Bilanzsumme höchstens 10 Mio. €'
}

const LIEFERT = /^Ja, wir liefern/
const KEINE_LIEFERUNG = /^Nein, unsere Kunden/

const BW = 'Voraussichtlich besonders wichtige Einrichtung'
const W = 'Voraussichtlich wichtige Einrichtung'
const NICHT = 'Voraussichtlich nicht direkt betroffen'

const ENERGIE = 'Energie'                 // Anlage 1
const MASCHINENBAU = 'Maschinenbau'       // Anlage 2
const TK = 'Öffentliche Telekommunikationsnetze oder -dienste'

// [Name, Mitarbeitende, Umsatz/Bilanz, Tätigkeit, Lieferkette, erwartet]
const PROFILE: Array<[string, Ma, Fin, string, RegExp, string]> = [
  ['P01 BSI: Maschinenbau klein → nicht betroffen', 'Unter 50', finAus(8, 8), MASCHINENBAU, KEINE_LIEFERUNG, NICHT],
  ['P02 BSI: Maschinenbau 30 MA, Umsatz und Bilanz > 10 Mio → wichtig', 'Unter 50', finAus(12, 12), MASCHINENBAU, KEINE_LIEFERUNG, W],
  ['P03 BSI: Energie 100 MA → wichtig', '50 bis 249', finAus(8, 8), ENERGIE, KEINE_LIEFERUNG, W],
  ['P04 BSI: Energie 200 MA, Umsatz > 50 und Bilanz > 43 Mio → besonders wichtig', '50 bis 249', finAus(60, 50), ENERGIE, KEINE_LIEFERUNG, BW],
  ['P05 BSI: Energie 200 MA, Umsatz > 50, Bilanz ≤ 43 Mio → wichtig', '50 bis 249', finAus(60, 40), ENERGIE, KEINE_LIEFERUNG, W],
  ['P06 BSI: KRITIS-Betreiber klein → besonders wichtig', 'Unter 50', finAus(2, 2), 'Betreiber einer kritischen Anlage (KRITIS)', KEINE_LIEFERUNG, BW],
  ['P07 BSI: TK klein → wichtig', 'Unter 50', finAus(5, 5), TK, KEINE_LIEFERUNG, W],
  ['P07b BSI: TK 20 MA, Umsatz und Bilanz > 10 Mio → besonders wichtig', 'Unter 50', finAus(12, 12), TK, KEINE_LIEFERUNG, BW],
  ['P08 BSI: TK 60 MA → besonders wichtig', '50 bis 249', finAus(5, 5), TK, KEINE_LIEFERUNG, BW],
  ['P09 BSI: qualifizierter Vertrauensdienst/DNS/TLD klein → besonders wichtig', 'Unter 50', finAus(1, 1), 'Qualifizierter Vertrauensdienst, DNS-Dienst oder TLD-Registry', KEINE_LIEFERUNG, BW],
  ['P10 BSI: Vertrauensdienst klein → wichtig', 'Unter 50', finAus(1, 1), 'Vertrauensdiensteanbieter (nicht qualifiziert)', KEINE_LIEFERUNG, W],
  ['P11 BSI: kein Sektor, groß → nicht betroffen', '250 oder mehr', finAus(200, 150), 'Keiner davon', KEINE_LIEFERUNG, NICHT],
  ['P12 BSI: Energie klein → nicht betroffen', 'Unter 50', finAus(5, 5), ENERGIE, KEINE_LIEFERUNG, NICHT],
  ['P13 BSI: Maschinenbau 300 MA (Anlage 2) → wichtig, nicht besonders wichtig', '250 oder mehr', finAus(8, 8), MASCHINENBAU, KEINE_LIEFERUNG, W],
  ['P14 BSI: Energie 300 MA → besonders wichtig', '250 oder mehr', finAus(8, 8), ENERGIE, KEINE_LIEFERUNG, BW],
  ['Managed Services mittel (Anlage 1) → wichtig', '50 bis 249', finAus(8, 8), 'IT-Betrieb für andere (Managed Services, Managed Security)', KEINE_LIEFERUNG, W],
  ['Maschinenbau klein, Zulieferer → mittelbar', 'Unter 50', finAus(3, 3), MASCHINENBAU, LIEFERT, 'Mittelbar betroffen'],
  ['Mitarbeitende unbekannt, Finanzen klein, Anlage 1 → genauer prüfen', 'Weiß ich nicht genau', finAus(5, 5), 'Gesundheit', KEINE_LIEFERUNG, 'Genauer prüfen'],
  ['Mitarbeitende unbekannt, Finanzen groß, Anlage 1 → besonders wichtig (Finanzen reichen)', 'Weiß ich nicht genau', finAus(60, 50), 'Gesundheit', KEINE_LIEFERUNG, BW],
  ['Tätigkeit unbekannt → genauer prüfen', '50 bis 249', finAus(8, 8), 'Weiß ich nicht', KEINE_LIEFERUNG, 'Genauer prüfen'],
  ['Öffentliche Verwaltung → eigene Regeln', '250 oder mehr', finAus(8, 8), 'Öffentliche Verwaltung (Bund, Land, Kommune)', KEINE_LIEFERUNG, 'Eigene Regeln für die Verwaltung'],
]

// Grenzfälle in Zahlen: [Name, Mitarbeitende, Umsatz Mio €, Bilanz Mio €, Tätigkeit, erwartet]
const GRENZEN: Array<[string, number, number, number, string, string]> = [
  ['G01 49 MA, Anlage 1 → nicht betroffen', 49, 8, 8, ENERGIE, NICHT],
  ['G02 50 MA, Anlage 1 → wichtig', 50, 8, 8, ENERGIE, W],
  ['G03 249 MA, Anlage 1 → wichtig', 249, 8, 8, ENERGIE, W],
  ['G04 250 MA, Anlage 1 → besonders wichtig', 250, 8, 8, ENERGIE, BW],
  ['G05 40 MA, Umsatz und Bilanz genau 10 Mio, Anlage 2 → nicht betroffen', 40, 10, 10, MASCHINENBAU, NICHT],
  ['G06 40 MA, Umsatz und Bilanz 10,1 Mio, Anlage 2 → wichtig', 40, 10.1, 10.1, MASCHINENBAU, W],
  ['G07 40 MA, Umsatz 12 Mio, Bilanz 9 Mio, Anlage 2 → nicht betroffen (UND)', 40, 12, 9, MASCHINENBAU, NICHT],
  ['G08 100 MA, Umsatz genau 50, Bilanz genau 43 Mio, Anlage 1 → wichtig', 100, 50, 43, ENERGIE, W],
  ['G09 100 MA, Umsatz 51, Bilanz 44 Mio, Anlage 1 → besonders wichtig', 100, 51, 44, ENERGIE, BW],
  ['G10 100 MA, Umsatz 60, Bilanz 43 Mio, Anlage 1 → wichtig (Bilanz nicht über 43)', 100, 60, 43, ENERGIE, W],
  ['G11 30 MA, Umsatz 60, Bilanz 50 Mio, Anlage 1 → besonders wichtig (Finanzen reichen)', 30, 60, 50, ENERGIE, BW],
  ['G12 300 MA, Umsatz 5, Bilanz 5 Mio, Anlage 2 → wichtig (Mitarbeitende reichen)', 300, 5, 5, MASCHINENBAU, W],
]

async function durchspielen(page: Page, ma: Ma, fin: Fin, taetigkeit: string, lieferung: RegExp) {
  await page.goto('/werkzeuge/nis2-betroffenheit')
  const frage = (nr: string) => page.locator('fieldset', { has: page.locator('legend', { hasText: `${nr} ·` }) })
  await frage('01').getByRole('button', { name: ma, exact: true }).click()
  await frage('02').getByRole('button', { name: fin, exact: true }).click()
  await page.getByLabel('Sektor').selectOption(taetigkeit)
  await page.getByRole('button', { name: lieferung }).click()
}

for (const [viewport, size] of [['Desktop', { width: 1440, height: 900 }], ['Mobil', { width: 390, height: 844 }]] as const) {
  test.describe(`NIS2 ${viewport}`, () => {
    test.use({ viewport: size })
    for (const [name, ma, fin, taetigkeit, lieferung, erwartet] of PROFILE) {
      test(name, async ({ page }) => {
        await durchspielen(page, ma, fin, taetigkeit, lieferung)
        await expect(page.getByText(erwartet, { exact: true })).toBeVisible()
        // immer als unverbindliche Ersteinschätzung gekennzeichnet, mit BSI-Verweis
        await expect(page.getByText(/Unverbindliche Ersteinschätzung nach § 28 BSIG/)).toBeVisible()
        await expect(page.getByRole('link', { name: 'NIS-2-Betroffenheitsprüfung des BSI' })).toHaveAttribute('href', 'https://betroffenheitspruefung-nis-2.bsi.de/')
      })
    }
  })
}

test.describe('NIS2 Grenzfälle (§ 28 BSIG)', () => {
  for (const [name, ma, umsatz, bilanz, taetigkeit, erwartet] of GRENZEN) {
    test(name, async ({ page }) => {
      await durchspielen(page, maAus(ma), finAus(umsatz, bilanz), taetigkeit, KEINE_LIEFERUNG)
      await expect(page.getByText(erwartet, { exact: true })).toBeVisible()
    })
  }
})

test('Sonderregel-Hinweis: Finanzwesen nennt DORA', async ({ page }) => {
  await durchspielen(page, '250 oder mehr', finAus(8, 8), 'Finanzwesen (Banken, Finanzmarktinfrastruktur)', KEINE_LIEFERUNG)
  await expect(page.getByText(BW, { exact: true })).toBeVisible()
  await expect(page.getByText(/DORA statt über das BSIG/)).toBeVisible()
})

test('Geteilter Link stellt alle vier Antworten wieder her', async ({ page }) => {
  await durchspielen(page, 'Unter 50', finAus(60, 50), ENERGIE, KEINE_LIEFERUNG)
  await expect(page).toHaveURL(/mitarbeitende=u50.*finanzen=gross/)
  await page.reload()
  await expect(page.getByText(BW, { exact: true })).toBeVisible()
})
