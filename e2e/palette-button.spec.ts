import { test, expect } from '@playwright/test'

/**
 * Der ⌘K-Button ist oben auf der Seite ausgeblendet (aria-hidden). Dann darf
 * er nicht per Tab erreichbar sein (axe: aria-hidden-focus, Audit 2026-11).
 */
test('Ausgeblendeter Palette-Button ist nicht fokussierbar, eingeblendet schon', async ({ page }) => {
  await page.goto('/impressum', { waitUntil: 'networkidle' })
  const btn = page.getByRole('button', { name: 'Command-Palette öffnen', includeHidden: true })
  await expect(btn).toHaveAttribute('aria-hidden', 'true')
  await expect(btn).toHaveAttribute('tabindex', '-1')

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await expect(btn).not.toHaveAttribute('aria-hidden', 'true')
  await expect(btn).toHaveAttribute('tabindex', '0')
})
