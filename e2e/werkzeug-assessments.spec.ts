import { test, expect, type Page } from '@playwright/test'

/**
 * Ergebnis-Logik der Assessment-Werkzeuge (Audit 2026-11):
 * - KI & DSGVO: Kombinationen statt Punktesumme. AVV + EU-Region ist kein
 *   Risiko an sich, sensible Daten nie „Grün“, keine widersprüchlichen Hinweise.
 * - Website-Check: unterschiedliche Profile → nachvollziehbar unterschiedliche
 *   Ergebnisse, wichtigster Hinweis zuerst.
 */

async function beantworten(page: Page, pfad: string, antworten: string[]) {
  await page.goto(pfad)
  for (const [i, label] of antworten.entries()) {
    const nr = String(i + 1).padStart(2, '0')
    await page
      .locator('fieldset', { has: page.locator('legend', { hasText: `${nr} ·` }) })
      .getByRole('button', { name: label, exact: true })
      .click()
  }
}

const hinweise = (page: Page) => page.locator('[aria-live] li')

// [Name, Antworten 01–05, erwartete Ampel]
const KI_DSGVO: Array<[string, string[], string]> = [
  ['keine PBD, alles sauber', ['Keine personenbezogenen Daten', 'Ja, Business-Vertrag mit AVV', 'EU-Region / EU-Datenresidenz', 'Ja, klare KI-Richtlinie', 'Nein, nur freigegebene Tools'], 'Grün'],
  ['PBD mit AVV + EU, alles sauber', ['Personenbezogene Daten (Kunden, Mitarbeiter)', 'Ja, Business-Vertrag mit AVV', 'EU-Region / EU-Datenresidenz', 'Ja, klare KI-Richtlinie', 'Nein, nur freigegebene Tools'], 'Grün'],
  ['Audit-Fall: PBD, AVV + EU, informelle Regeln, vermutlich Schatten-KI', ['Personenbezogene Daten (Kunden, Mitarbeiter)', 'Ja, Business-Vertrag mit AVV', 'EU-Region / EU-Datenresidenz', 'Mündlich / informell', 'Vermutlich ja'], 'Gelb'],
  ['sensible Daten, sauber aufgesetzt', ['Sensible Daten (Gesundheit, Finanzen, Personal)', 'Ja, Business-Vertrag mit AVV', 'EU-Region / EU-Datenresidenz', 'Ja, klare KI-Richtlinie', 'Nein, nur freigegebene Tools'], 'Gelb'],
  ['PBD mit AVV, aber USA', ['Personenbezogene Daten (Kunden, Mitarbeiter)', 'Ja, Business-Vertrag mit AVV', 'USA / außerhalb der EU', 'Ja, klare KI-Richtlinie', 'Nein, nur freigegebene Tools'], 'Gelb'],
  ['keine PBD, private Accounts, USA', ['Keine personenbezogenen Daten', 'Nein, freie/private Accounts', 'USA / außerhalb der EU', 'Ja, klare KI-Richtlinie', 'Nein, nur freigegebene Tools'], 'Gelb'],
  ['PBD, AVV unklar', ['Personenbezogene Daten (Kunden, Mitarbeiter)', 'Weiß nicht', 'EU-Region / EU-Datenresidenz', 'Ja, klare KI-Richtlinie', 'Nein, nur freigegebene Tools'], 'Gelb'],
  ['sensible Daten ohne AVV', ['Sensible Daten (Gesundheit, Finanzen, Personal)', 'Nein, freie/private Accounts', 'EU-Region / EU-Datenresidenz', 'Ja, klare KI-Richtlinie', 'Nein, nur freigegebene Tools'], 'Rot'],
  ['alles im Argen', ['Personenbezogene Daten (Kunden, Mitarbeiter)', 'Nein, freie/private Accounts', 'USA / außerhalb der EU', 'Keine', 'Ja, sicher'], 'Rot'],
]

// [Name, Antworten 01–06, erwartetes Band]
const WEBSITE: Array<[string, string[], string]> = [
  ['alles gut', ['Ja, vollständig mit Fotos & Zeiten', 'Ja, weit vorne', 'Ja, regelmäßig', 'Ja, schnell und lesbar', 'Ja, regelmäßig und nachvollziehbar', 'Ja, alles aktuell'], 'Gut aufgestellt'],
  ['eine mittlere Lücke', ['Ja, vollständig mit Fotos & Zeiten', 'Ja, weit vorne', 'Es kommen welche, aber unsystematisch', 'Ja, schnell und lesbar', 'Ja, regelmäßig und nachvollziehbar', 'Ja, alles aktuell'], 'Gut aufgestellt'],
  ['eine große Lücke, sonst gut', ['Nein / weiß nicht', 'Ja, weit vorne', 'Ja, regelmäßig', 'Ja, schnell und lesbar', 'Ja, regelmäßig und nachvollziehbar', 'Ja, alles aktuell'], 'Luft nach oben'],
  ['überall Mittelmaß (Audit-Fall)', ['Existiert, aber halb gepflegt', 'Irgendwo, aber nicht vorne', 'Es kommen welche, aber unsystematisch', 'Geht so', 'Ab und zu', 'Unsicher'], 'Luft nach oben'],
  ['mehrere große Lücken', ['Nein / weiß nicht', 'Nein / nie geprüft', 'Es kommen welche, aber unsystematisch', 'Eher langsam / veraltet', 'Ab und zu', 'Unsicher'], 'Baustelle'],
  ['alles schlecht', ['Nein / weiß nicht', 'Nein / nie geprüft', 'Kaum / keine', 'Eher langsam / veraltet', 'Selten / wird nicht gemessen', 'Da gibt es Lücken'], 'Baustelle'],
]

for (const [viewport, size] of [['Desktop', { width: 1440, height: 900 }], ['Mobil', { width: 390, height: 844 }]] as const) {
  test.describe(`KI & DSGVO ${viewport}`, () => {
    test.use({ viewport: size })
    for (const [name, antworten, ampel] of KI_DSGVO) {
      test(name, async ({ page }) => {
        await beantworten(page, '/werkzeuge/ki-dsgvo-check', antworten)
        await expect(page.getByText(`DSGVO-Ampel · ${ampel}`, { exact: true })).toBeVisible()
        // kein Widerspruch: mit AVV kein Hinweis auf fehlenden AVV
        if (antworten[1].startsWith('Ja, Business-Vertrag')) {
          await expect(hinweise(page).filter({ hasText: /ohne (gesicherten )?AVV|kein AVV/ })).toHaveCount(0)
        }
        // ohne personenbezogene Daten keine Drittland-Mahnung
        if (antworten[0] === 'Keine personenbezogenen Daten') {
          await expect(hinweise(page).filter({ hasText: /Drittland|Verarbeitungsort/ })).toHaveCount(0)
        }
      })
    }
  })

  test.describe(`Website-Check ${viewport}`, () => {
    test.use({ viewport: size })
    for (const [name, antworten, band] of WEBSITE) {
      test(name, async ({ page }) => {
        await beantworten(page, '/werkzeuge/website-check', antworten)
        await expect(page.getByText(`Web-Reifegrad · ${band}`, { exact: true })).toBeVisible()
      })
    }
  })
}

test('Website-Check: rechtliche Lücken stehen vor kleineren Hinweisen', async ({ page }) => {
  await beantworten(page, '/werkzeuge/website-check', ['Ja, vollständig mit Fotos & Zeiten', 'Ja, weit vorne', 'Es kommen welche, aber unsystematisch', 'Ja, schnell und lesbar', 'Ab und zu', 'Da gibt es Lücken'])
  await expect(hinweise(page).first()).toContainText('SSL/Impressum/Datenschutz')
})

test('KI & DSGVO: sensible Daten verlangen auch sauber aufgesetzt DSFA und DSB', async ({ page }) => {
  await beantworten(page, '/werkzeuge/ki-dsgvo-check', KI_DSGVO[3][1])
  await expect(hinweise(page).first()).toContainText('Datenschutz-Folgenabschätzung')
})
