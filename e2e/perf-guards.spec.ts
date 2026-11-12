import { test, expect } from '@playwright/test'

/**
 * Regressionstests für die Performance-Fixes aus dem Audit 2026-11
 * (docs/audit-2026-11/README.md). Prüfen Strukturmerkmale, keine Zeiten:
 * Zeiten schwanken je nach Maschine, die Ursachen nicht.
 */

test('Keine Konsolenfehler auf Kernseiten', async ({ page }) => {
  const errors: string[] = []
  page.on('console', m => {
    if (m.type() === 'error') errors.push(m.text())
  })
  page.on('pageerror', e => errors.push(e.message))
  for (const route of ['/', '/impressum', '/leistungen/marke']) {
    await page.goto(route, { waitUntil: 'networkidle' })
    await page.mouse.wheel(0, 2000)
    await page.waitForTimeout(800)
  }
  expect(errors, errors.join('\n')).toEqual([])
})

test('Nur kritische Schriften werden vorgeladen', async ({ request }) => {
  const html = await (await request.get('/impressum')).text()
  const preloads = html.match(/<link rel="preload"[^>]*as="font"[^>]*>/g) ?? []
  // Geist + 4 aufrechte Akmorn-Schnitte + Instrument Serif Italic
  expect(preloads.length).toBeLessThanOrEqual(6)
  // Akmorn-Italics und Geist Mono werden nicht vorgeladen (Instrument Serif
  // Italic schon: Akzentwort in Hero-Headlines).
  expect(html).not.toMatch(/<link rel="preload"[^>]*(Akmorn[^"]*Ita|GeistMono)[^>]*>/i)
})

test('GSAP nicht im initialen Bundle einer Unterseite', async ({ request }) => {
  const html = await (await request.get('/impressum')).text()
  const scripts = [...html.matchAll(/src="(\/_next\/static\/chunks\/[^"]+\.js)"/g)].map(m => m[1])
  expect(scripts.length).toBeGreaterThan(0)
  for (const src of scripts) {
    const js = await (await request.get(src)).text()
    expect(js.includes('ScrollTrigger') || js.includes('GreenSock'), src).toBe(false)
  }
})

test('Favicon bleibt klein', async ({ request }) => {
  const res = await request.get('/icon.png')
  expect(res.status()).toBe(200)
  expect((await res.body()).length).toBeLessThan(20 * 1024)
})

test.describe('Mobile', () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
  test('Kein backdrop-filter innerhalb von main section', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    const count = await page.evaluate(() =>
      [...document.querySelectorAll('main section, main section *')]
        .filter(e => getComputedStyle(e).backdropFilter !== 'none').length,
    )
    expect(count).toBe(0)
  })
})
