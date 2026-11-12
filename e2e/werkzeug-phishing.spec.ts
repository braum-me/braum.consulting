import { test, expect, type Page } from '@playwright/test'

/**
 * Phishing-Quiz: Bewertung aus übersehenem Phishing UND Fehlalarmen.
 * Pauschal „Phishing“ zu klicken darf nicht „Solide“ ergeben.
 * Reihenfolge der Mails: Phishing, seriös, Phishing, Phishing, seriös, Phishing, Phishing.
 */

const ECHT = [true, false, true, true, false, true, true]

async function quiz(page: Page, antworten: boolean[]) {
  await page.goto('/werkzeuge/phishing-quiz')
  for (const [i, phishing] of antworten.entries()) {
    await page.getByRole('button', { name: phishing ? 'Phishing' : 'Seriös', exact: true }).click()
    await page.getByRole('button', { name: i === antworten.length - 1 ? 'Zum Ergebnis' : 'Nächste Mail' }).click()
  }
}

const PROFILE: Array<[string, boolean[], string, string]> = [
  ['alles richtig', ECHT, 'Radar sitzt', '7 von 7 erkannt.'],
  ['pauschal „Phishing“', ECHT.map(() => true), 'Übervorsichtig', '5 von 7 erkannt.'],
  ['pauschal „Seriös“', ECHT.map(() => false), 'Trainingsbedarf', '2 von 7 erkannt.'],
  ['ein Phishing übersehen', ECHT.map((x, i) => (i === 0 ? false : x)), 'Solide', '6 von 7 erkannt.'],
  ['zwei Phishing übersehen', ECHT.map((x, i) => (i === 0 || i === 2 ? false : x)), 'Trainingsbedarf', '5 von 7 erkannt.'],
]

for (const [viewport, size] of [['Desktop', { width: 1440, height: 900 }], ['Mobil', { width: 390, height: 844 }]] as const) {
  test.describe(`Phishing-Quiz ${viewport}`, () => {
    test.use({ viewport: size })
    for (const [name, antworten, band, summe] of PROFILE) {
      test(name, async ({ page }) => {
        const fehler: string[] = []
        page.on('pageerror', e => fehler.push(e.message))
        await quiz(page, antworten)
        await expect(page.getByText(`Ergebnis · ${band}`, { exact: true })).toBeVisible()
        await expect(page.getByText(summe, { exact: true })).toBeVisible()
        expect(fehler, fehler.join('\n')).toEqual([])
      })
    }
  })
}

test('Ausgeliefertes HTML enthält keine zusammenhängende E-Mail-Adresse (Cloudflare-Verschleierung, #418)', async ({ request }) => {
  const html = await (await request.get('/werkzeuge/phishing-quiz')).text()
  const ohneSkripte = html.replace(/<script[\s\S]*?<\/script>/g, '')
  expect(ohneSkripte).not.toMatch(/[\w.+-]+@[\w-]+\.[a-z]{2,}/i)
})
