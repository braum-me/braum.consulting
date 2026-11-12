import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/**
 * Werkzeuge, P1 (Audit 2026-11): Nach der letzten Antwort steht das Ergebnis
 * im Bild und hat den Fokus; Auswahl-Pills melden ihren Zustand; Tap-Ziele
 * ≥ 24 px; Frage-Überschriften liegen in der Karte; Phishing-Quiz führt den
 * Fokus; axe: keine Verstöße bei Überschriften-Reihenfolge und Zustand.
 */

const WEGE: Record<string, { pfad: string; spielen: (page: Page) => Promise<void> }> = {
  'Website-Check (Assessment)': {
    pfad: '/werkzeuge/website-check',
    spielen: async page => {
      for (const l of ['Ja, vollständig mit Fotos & Zeiten', 'Ja, weit vorne', 'Ja, regelmäßig', 'Geht so', 'Ab und zu', 'Unsicher']) {
        await page.getByRole('button', { name: l, exact: true }).first().click()
      }
    },
  },
  'NIS2': {
    pfad: '/werkzeuge/nis2-betroffenheit',
    spielen: async page => {
      await page.getByRole('button', { name: '50 bis 249', exact: true }).click()
      await page.getByRole('button', { name: 'Umsatz oder Bilanzsumme höchstens 10 Mio. €', exact: true }).click()
      await page.getByLabel('Sektor').selectOption('Maschinenbau')
      await page.getByRole('button', { name: /^Nein, unsere Kunden/ }).click()
    },
  },
  'M365-Migration': {
    pfad: '/werkzeuge/m365-migration-kosten',
    spielen: async page => {
      for (const l of ['Über die Jahre gewachsen, teils unklar', '25–100', 'Ein lokales Active Directory', 'Keine besonderen', 'Auf dem Weg modernisieren']) {
        await page.getByRole('button', { name: l, exact: true }).click()
      }
    },
  },
  'Automatisierungs-ROI': {
    pfad: '/werkzeuge/automatisierung-roi',
    spielen: async page => {
      const felder = page.locator('fieldset').first().locator('input')
      await felder.nth(0).fill('20')
      await felder.nth(1).fill('15')
      await felder.nth(2).fill('2')
      await page.getByRole('button', { name: 'Größtenteils (~70 %)' }).click()
    },
  },
  'Cyber-Schaden': {
    pfad: '/werkzeuge/cyber-schaden',
    spielen: async page => {
      for (const l of ['5–25 Mio. €', 'Das meiste', 'Backup vorhanden, ungeübt']) {
        await page.getByRole('button', { name: l, exact: true }).click()
      }
    },
  },
}

for (const [viewport, size] of [['Desktop', { width: 1440, height: 900 }], ['Mobil', { width: 390, height: 844 }]] as const) {
  test.describe(`Werkzeug-UX ${viewport}`, () => {
    test.use({ viewport: size })

    for (const [name, weg] of Object.entries(WEGE)) {
      test(`${name}: Ergebnis im Bild und fokussiert`, async ({ page }) => {
        await page.goto(weg.pfad)
        await weg.spielen(page)
        const ueberschrift = page.locator('h2[tabindex="-1"]')
        await expect(ueberschrift).toBeFocused()
        // nach dem (ggf. weichen) Scrollen vollständig sichtbar
        await expect(ueberschrift).toBeInViewport({ ratio: 1, timeout: 5_000 })
        // Auswahl-Pills melden ihren Zustand
        expect(await page.locator('main [aria-pressed="true"]').count()).toBeGreaterThan(0)
        // Frage-Überschriften liegen innerhalb der Karte
        const boxen = await page.locator('fieldset.wz-frage').evaluateAll(fs => fs.map(f => {
          const l = f.querySelector('legend')!.getBoundingClientRect(), r = f.getBoundingClientRect()
          return l.top >= r.top && l.left >= r.left && l.right <= r.right + 0.5
        }))
        expect(boxen.every(Boolean)).toBe(true)
        // Tap-Ziele „Teilen“ / „Neu starten“
        for (const b of await page.getByRole('button', { name: /Ergebnis teilen|Link kopiert|Neu starten/ }).all()) {
          expect((await b.boundingBox())!.height).toBeGreaterThanOrEqual(24)
        }
      })
    }
  })
}

test('Phishing-Quiz: Fokus folgt Antwort, nächster Mail und Ergebnis', async ({ page }) => {
  await page.goto('/werkzeuge/phishing-quiz')
  for (let i = 0; i < 7; i++) {
    await page.getByRole('button', { name: 'Phishing', exact: true }).click()
    await expect(page.locator('[aria-live="polite"][tabindex="-1"]')).toBeFocused()
    const weiter = page.getByRole('button', { name: i === 6 ? 'Zum Ergebnis' : 'Nächste Mail' })
    await weiter.click()
    if (i < 6) await expect(page.getByRole('group', { name: `Mail ${i + 2} von 7` })).toBeFocused()
  }
  await expect(page.locator('h2[tabindex="-1"]')).toBeFocused()
})

test('Passwort-Schalter hat eine ausreichende Tap-Fläche', async ({ page }) => {
  await page.goto('/werkzeuge/passwort-check')
  const box = (await page.getByRole('button', { name: 'Passwort anzeigen' }).boundingBox())!
  expect(box.width).toBeGreaterThanOrEqual(44)
  expect(box.height).toBeGreaterThanOrEqual(44)
})

for (const pfad of ['/werkzeuge/website-check', '/werkzeuge/nis2-betroffenheit', '/werkzeuge/m365-migration-kosten', '/werkzeuge/cyber-schaden']) {
  test(`axe ohne Befunde zu Überschriften und Bedienelementen: ${pfad}`, async ({ page }) => {
    await page.goto(pfad)
    await (WEGE[Object.keys(WEGE).find(k => WEGE[k].pfad === pfad)!]).spielen(page)
    await page.waitForTimeout(600)
    const r = await new AxeBuilder({ page }).withRules(['heading-order', 'aria-allowed-attr', 'aria-valid-attr-value', 'button-name', 'color-contrast', 'target-size']).analyze()
    const befunde = r.violations.flatMap(v => v.nodes.map(n => `${v.id}: ${n.target.join(' ')}`))
    expect(befunde, befunde.join('\n')).toEqual([])
  })
}
