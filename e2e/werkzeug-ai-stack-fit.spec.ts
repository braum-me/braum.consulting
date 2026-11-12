import { test, expect, type Page } from '@playwright/test'

/**
 * AI-Stack-Fit: Der Anfrage-Button im Ergebnis führt im selben Tab auf
 * /kontakt?tool=ai-stack-fit (mit Vorbefüllung), keine internen Platzhalter.
 */

const PROFILE: Record<string, { mode: RegExp; picks: Array<string | string[]> }> = {
  'klein, frischer Start': { mode: /Wir fangen frisch an/, picks: ['1-10 MA', 'Beratung / Services', '< 1 Mio €', 'Kosten-optimiert'] },
  'groß, bestehender Stack': { mode: /Wir haben bereits einen Stack/, picks: ['251-1.000 MA', 'Industrie / Maschinenbau', '50-250 Mio €', ['Microsoft 365', 'SAP'], 'EU-souverän'] },
}

async function bisZumErgebnis(page: Page, p: (typeof PROFILE)[string]) {
  await page.goto('/werkzeuge/ai-stack-fit')
  await page.locator('.asf-mode-card', { hasText: p.mode }).click()
  for (const pick of p.picks) {
    for (const option of ([] as string[]).concat(pick)) {
      await page.locator('.asf-opt-card', { hasText: option }).first().click()
    }
    await page.getByRole('button', { name: /Weiter|Empfehlung berechnen/ }).click()
  }
}

for (const [viewport, size] of [['Desktop', { width: 1440, height: 900 }], ['Mobil', { width: 390, height: 844 }]] as const) {
  test.describe(`AI-Stack-Fit ${viewport}`, () => {
    test.use({ viewport: size })
    for (const [name, profil] of Object.entries(PROFILE)) {
      test(`${name}: Anfrage-Button führt zu /kontakt`, async ({ page }) => {
        await bisZumErgebnis(page, profil)
        const cta = page.locator('.asf-cta-big')
        await expect(cta).toBeVisible({ timeout: 15_000 })
        await expect(cta).toHaveAttribute('href', '/kontakt?tool=ai-stack-fit')
        await expect(cta).not.toHaveAttribute('target', /.+/)
        await expect(page.getByText('AUDIT_PRO')).toHaveCount(0)
        await cta.click()
        await expect(page).toHaveURL(/\/kontakt\?tool=ai-stack-fit/)
        await expect(page.locator('textarea[name="message"]')).toHaveValue(/AI-Stack-Fit/)
      })
    }
  })
}
