import { test, expect } from '@playwright/test'

/**
 * Smoke-Baseline: jede Hauptroute lädt mit 200, hat einen Titel und ein <h1>.
 * Plus gezielte Checks für Kontakt-Formular, Lagebild-CTA und SEO-Dateien.
 *
 * Setzt voraus, dass der Dev-Server auf baseURL (Default :3000) erreichbar ist.
 */

const ROUTES = [
  '/',
  '/ueber',
  '/leistungen/marke',
  '/leistungen/m365',
  '/leistungen/ai',
  '/leistungen/strategie',
  '/cases',
  '/blog',
  '/kontakt',
  '/lagebild',
  '/methodik',
  '/lexikon',
  '/impressum',
  '/datenschutz',
] as const

test.describe('Hauptrouten liefern 200, Titel und <h1>', () => {
  for (const route of ROUTES) {
    test(`GET ${route}`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: 'domcontentloaded' })

      expect(response, `keine Response für ${route}`).not.toBeNull()
      expect(response!.status(), `unerwarteter Status für ${route}`).toBe(200)

      // Title darf nicht leer sein
      await expect(page).toHaveTitle(/.+/)

      // Mindestens eine sichtbare <h1>
      const h1 = page.locator('h1').first()
      await expect(h1).toBeVisible()
      await expect(h1).not.toBeEmpty()
    })
  }
})

test.describe('/kontakt — Formular & Validierung', () => {
  test('Formular ist vorhanden', async ({ page }) => {
    await page.goto('/kontakt', { waitUntil: 'domcontentloaded' })

    await expect(page.locator('form')).toBeVisible()
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('textarea[name="message"]')).toBeVisible()
    await expect(page.getByRole('button', { name: /senden/i })).toBeVisible()
  })

  test('Absenden ohne Pflichtfelder zeigt Validierungsfehler', async ({ page }) => {
    await page.goto('/kontakt', { waitUntil: 'domcontentloaded' })

    await page.getByRole('button', { name: /senden/i }).click()

    // Client-Validierung rendert Fehler-Texte mit role="alert"
    const alerts = page.getByRole('alert')
    await expect(alerts.first()).toBeVisible()
    expect(await alerts.count()).toBeGreaterThan(0)

    // Wir bleiben auf /kontakt (kein erfolgreicher Submit)
    expect(new URL(page.url()).pathname).toBe('/kontakt')
  })
})

test.describe('/lagebild — prominenter Kontakt-CTA', () => {
  test('verlinkt auf /kontakt', async ({ page }) => {
    await page.goto('/lagebild', { waitUntil: 'domcontentloaded' })

    const cta = page.locator('a[href="/kontakt"]').first()
    await expect(cta).toBeVisible()
  })
})

test.describe('Detail-Routen (dynamisch) liefern 200, Titel und <h1>', () => {
  // Pro Liste den ersten echten Detail-Link einsammeln und ihm folgen —
  // robust gegen Content-Änderungen (keine hartkodierten Slugs).
  const SECTIONS = [
    { list: '/cases',   prefix: '/cases/',   name: 'Case' },
    { list: '/blog',    prefix: '/blog/',    name: 'Blog-Post' },
    { list: '/lexikon', prefix: '/lexikon/', name: 'Lexikon-Eintrag' },
  ] as const

  for (const { list, prefix, name } of SECTIONS) {
    test(`erster ${name} unter ${list}`, async ({ page }) => {
      await page.goto(list, { waitUntil: 'domcontentloaded' })

      const hrefs = await page.$$eval('a[href]', els =>
        els.map(e => e.getAttribute('href') ?? ''),
      )
      // genau ein Segment hinter dem Prefix (schließt /blog/tag/... aus)
      const detail = hrefs.find(
        h => h.startsWith(prefix) && h.slice(prefix.length).length > 0 && !h.slice(prefix.length).includes('/'),
      )
      expect(detail, `kein Detail-Link unter ${list} gefunden`).toBeTruthy()

      const response = await page.goto(detail!, { waitUntil: 'domcontentloaded' })
      expect(response!.status(), `unerwarteter Status für ${detail}`).toBe(200)
      await expect(page).toHaveTitle(/.+/)

      const h1 = page.locator('h1').first()
      await expect(h1).toBeVisible()
      await expect(h1).not.toBeEmpty()
    })
  }
})

test.describe('SEO- & PWA-Dateien erreichbar', () => {
  const files = [
    { path: '/robots.txt', contains: 'User-Agent' },
    { path: '/sitemap.xml', contains: 'urlset' },
    { path: '/manifest.webmanifest', contains: 'name' },
  ]

  for (const { path, contains } of files) {
    test(`GET ${path}`, async ({ request }) => {
      const response = await request.get(path)
      expect(response.status(), `${path} nicht erreichbar`).toBe(200)
      const body = await response.text()
      expect(body.toLowerCase()).toContain(contains.toLowerCase())
    })
  }
})
