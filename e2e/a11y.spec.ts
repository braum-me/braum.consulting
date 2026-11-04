import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/**
 * Automatisierte A11y-Smoke-Checks mit axe-core.
 *
 * Für eine Auswahl Schlüsselrouten wird der DOM nach dem Laden gegen die
 * WCAG-2.0/2.1-A- und -AA-Regeln geprüft. Wir lassen den Build nur bei
 * Violations der Schweregrade `serious` und `critical` scheitern — `minor`
 * und `moderate` sind als Hinweise erlaubt, damit die Smoke-Suite robust
 * gegen kosmetische Befunde bleibt.
 *
 * Setzt voraus, dass der Dev-Server auf baseURL (Default :3000) erreichbar ist.
 */

const ROUTES = [
  '/',
  '/ueber',
  '/leistungen/marke',
  '/leistungen/m365',
  '/cases',
  '/blog',
  '/kontakt',
  '/lagebild',
  '/methodik',
] as const

const BLOCKING_IMPACTS = ['serious', 'critical'] as const

test.describe('A11y — keine serious/critical WCAG-Violations', () => {
  for (const route of ROUTES) {
    test(`axe ${route}`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: 'domcontentloaded' })
      expect(response, `keine Response für ${route}`).not.toBeNull()
      expect(response!.status(), `unerwarteter Status für ${route}`).toBe(200)

      // <h1> als Render-Anker: erst messen, wenn die Seite Inhalt zeigt.
      await expect(page.locator('h1').first()).toBeVisible()

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()

      const blocking = results.violations.filter(
        (v) => v.impact != null && (BLOCKING_IMPACTS as readonly string[]).includes(v.impact),
      )

      // Lesbare Fehlermeldung: Regel-ID, Impact und betroffene Nodes.
      const report = blocking
        .map((v) => {
          const targets = v.nodes
            .map((n) => n.target.join(' '))
            .slice(0, 5)
            .join('\n      ')
          return `  [${v.impact}] ${v.id}: ${v.help}\n    ${v.helpUrl}\n      ${targets}`
        })
        .join('\n')

      expect(
        blocking,
        `serious/critical A11y-Violations auf ${route}:\n${report}`,
      ).toEqual([])
    })
  }
})
