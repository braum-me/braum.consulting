import { test, expect } from '@playwright/test'

/**
 * Passwort-Check: Bewertung mit zxcvbn-ts. Typische schwache Passwörter
 * (Wörter, Jahreszahlen, Tastaturmuster, Wiederholungen) dürfen nie als stark
 * gelten; lange Zufallspasswörter und Passphrasen schon. Das Passwort darf
 * keine Netzwerkanfrage verlassen.
 */

const SCHWACH = /^(sehr schwach|schwach)$/
const STARK = /^(stark|sehr stark)$/

const FAELLE: Array<[string, RegExp]> = [
  ['123456', SCHWACH],
  ['passwort', SCHWACH],
  ['Sommer2024!', SCHWACH],
  ['Frankfurt2025!', SCHWACH],
  ['Qwertz123456!', SCHWACH],
  ['aaaaaaaaaaaaaaaa', SCHWACH],
  ['P@ssw0rt!', SCHWACH],
  ['Stefan1990', SCHWACH],
  ['pferd-tisch-mond-lampe-42', STARK],
  ['x7#Kq9!vLm2$Rt8w', STARK],
]

for (const [viewport, size] of [['Desktop', { width: 1440, height: 900 }], ['Mobil', { width: 390, height: 844 }]] as const) {
  test.describe(`Passwort-Check ${viewport}`, () => {
    test.use({ viewport: size })
    test('Bewertung typischer Passwörter', async ({ page }) => {
      const geheim = 'Sommer2024!'
      const urls: string[] = []
      page.on('request', r => urls.push(r.url() + ' ' + (r.postData() ?? '')))
      await page.goto('/werkzeuge/passwort-check')
      const feld = page.getByLabel('Passwort zum Testen')
      for (const [pw, erwartet] of FAELLE) {
        await feld.fill(pw)
        const band = page.locator('[aria-live="polite"] p.uppercase').first()
        await expect(band).toHaveText(erwartet)
        await expect(page.getByText(/^Geschätzte Knackdauer: /)).toBeVisible()
      }
      // keine kaputte Formulierung mehr
      await expect(page.getByText(/Geknackt/)).toHaveCount(0)
      // Passwort verlässt den Browser nicht
      expect(urls.filter(u => u.includes(geheim) || u.includes(encodeURIComponent(geheim)))).toEqual([])
    })
  })
}

test('Warnung und Tipps auf Deutsch bei Wörterbuch-Passwort', async ({ page }) => {
  await page.goto('/werkzeuge/passwort-check')
  await page.getByLabel('Passwort zum Testen').fill('passwort')
  await expect(page.getByText(/(oft|häufig) verwendetes Passwort/)).toBeVisible()
})
