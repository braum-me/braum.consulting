import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/**
 * /kontakt ohne Kontrastfehler (Audit 2026-11): Das Live-Status-Label
 * „Frankfurt · hh:mm“ lag mit fg-subtle auf der Orange-Tönung bei 3,6:1.
 */
test('/kontakt hat keine color-contrast-Befunde', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  // load statt networkidle: Umami/Turnstile halten live das Netz offen
  await page.goto('/kontakt', { waitUntil: 'load' })
  // Uhrzeit-Snapshot wird clientseitig gesetzt
  await expect(page.getByText(/Frankfurt · \d{2}:\d{2}/)).toBeVisible()
  const result = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze()
  const nodes = result.violations.flatMap(v => v.nodes.map(n => `${n.target.join(' ')} ${n.any[0]?.data?.contrastRatio ?? ''}`))
  expect(nodes, nodes.join('\n')).toEqual([])
})
