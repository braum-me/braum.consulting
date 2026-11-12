import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/**
 * AI-Stack-Fit, P1 (Audit 2026-11): Du-Form und deutsche Beschriftungen,
 * stimmige Fragenanzahl, keine Selbstwidersprüche zwischen Empfehlung und
 * „Brüchen im Stack“, Zielkonflikt bei „EU-souverän“ erklärt, keine
 * Kontrastfehler.
 */

const KLEIN = { mode: /Wir fangen frisch an/, picks: ['1-10 MA', 'Beratung / Services', '< 1 Mio €', 'Kosten-optimiert'] }
const GROSS_EU = { mode: /Wir haben bereits einen Stack/, picks: ['251-1.000 MA', 'Industrie / Maschinenbau', '50-250 Mio €', ['Microsoft 365', 'SAP'], 'EU-souverän'] }

async function durch(page: Page, p: { mode: RegExp; picks: Array<string | string[]> }) {
  await page.goto('/werkzeuge/ai-stack-fit')
  await page.locator('.asf-mode-card', { hasText: p.mode }).click()
  let schritte = 0
  for (const pick of p.picks) {
    for (const o of ([] as string[]).concat(pick)) await page.locator('.asf-opt-card', { hasText: o }).first().click()
    await page.getByRole('button', { name: /Weiter|Empfehlung berechnen/ }).click()
    schritte++
  }
  await expect(page.locator('.asf-cta-big')).toBeVisible({ timeout: 15_000 })
  return schritte
}

const VERBOTEN = /\b(Ihre|Ihnen|Ihrem|Ihren|Ihrer)\b|Sie sind|WORTH WATCHING|PEER-NOTE|AI-FIRST|AUDIT_PRO|OSS \/ VENDOR-NEUTRAL|Rund 70\s?%|DACH-Sample/

test('Einstieg: Du-Form, deutsche Labels, Fragenanzahl stimmt mit dem Wizard überein', async ({ page }) => {
  await page.goto('/werkzeuge/ai-stack-fit')
  const text = await page.locator('.asf-app').innerText()
  expect(text).not.toMatch(VERBOTEN)
  await expect(page.locator('.asf-mode-card', { hasText: /Wir fangen frisch an/ })).toContainText('4 Fragen')
  await expect(page.locator('.asf-mode-card', { hasText: /Wir haben bereits einen Stack/ })).toContainText('5 Fragen')
  expect(await durch(page, KLEIN)).toBe(4)
  expect(await durch(page, GROSS_EU)).toBe(5)
})

test('Google-Office und Kosten-Leitstern: KI-Empfehlung passt zum Office, keine Selbstwarnung', async ({ page }) => {
  await durch(page, KLEIN)
  await expect(page.getByText('Gemini wäre die natürlichere Wahl')).toHaveCount(0)
  await expect(page.getByText('AI bricht aus dem Office-Backbone')).toHaveCount(0)
  expect(await page.locator('.asf-app').innerText()).not.toMatch(VERBOTEN)
})

test('EU-souverän mit M365/SAP: Zielkonflikt wird erklärt', async ({ page }) => {
  await durch(page, GROSS_EU)
  const hinweis = page.locator('.asf-industry-banner', { hasText: 'Zielkonflikt · EU-souverän' })
  await expect(hinweis).toBeVisible()
  await expect(hinweis).toContainText('Microsoft 365, SAP')
  expect(await page.locator('.asf-app').innerText()).not.toMatch(VERBOTEN)
})

test('Keine Kontrastfehler auf Einstieg und Ergebnis', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
  const page = await ctx.newPage()
  await page.goto('/werkzeuge/ai-stack-fit')
  const pruefen = async () => {
    const r = await new AxeBuilder({ page }).include('.asf-app').withRules(['color-contrast']).analyze()
    return r.violations.flatMap(v => v.nodes.map(n => `${n.target.join(' ')} ${n.any[0]?.data?.contrastRatio}`))
  }
  expect(await pruefen()).toEqual([])
  await durch(page, GROSS_EU)
  await page.waitForTimeout(2500)
  expect(await pruefen()).toEqual([])
  await ctx.close()
})
