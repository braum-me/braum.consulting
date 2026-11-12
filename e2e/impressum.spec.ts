import { test, expect } from '@playwright/test'

/**
 * Regression Impressum (Hotfix 2026-11):
 * - keine Steuernummer / Steuer-IdNr. im Impressum (nicht pflichtig nach § 5 DDG,
 *   unnötiges Missbrauchsrisiko). Pflichtig wäre nur eine USt-IdNr. oder W-IdNr.
 * - kein Verweis mehr auf die zum 20.07.2025 abgeschaltete EU-OS-Plattform.
 */
test('Impressum ohne Steuernummer und ohne OS-Plattform', async ({ page }) => {
  const response = await page.goto('/impressum', { waitUntil: 'domcontentloaded' })
  expect(response?.status()).toBe(200)

  const text = (await page.locator('body').textContent()) ?? ''
  expect(text.length).toBeGreaterThan(200)
  // 10–13 Ziffern in Gruppen (Steuernummer-/IdNr-Muster)
  expect(text).not.toMatch(/\b\d{2,3}[ /]\d{3}[ /]\d{4,5}\b/)
  expect(text).not.toMatch(/Steuer-?ID|Steuernummer|Steuer-Nr/i)

  await expect(page.locator('a[href*="ec.europa.eu/consumers/odr"]')).toHaveCount(0)
  expect(text).not.toMatch(/Online-Streitbeilegung/)

  // Pflichtangaben bleiben
  // W-IdNr. mit Unterscheidungsmerkmal (BZSt: DE + 9 Ziffern + -00001)
  expect(text).toMatch(/Wirtschafts-Identifikationsnummer[^D]*DE\d{9}-\d{5}/)
  expect(text).toMatch(/Kleinunternehmer nach § 19 UStG/)
  expect(text).toMatch(/§ 36 VSBG/)
})
