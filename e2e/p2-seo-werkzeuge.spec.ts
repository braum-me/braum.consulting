import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/**
 * P2 (Audit 2026-11): Snippet-Längen, Werkzeug-Übersicht in vier Bereichen,
 * vier Werkzeuge auf der Startseite, Blogbeitrag „WordPress oder Astro?“.
 */

const BEREICHE = ['Website und Sichtbarkeit', 'Microsoft 365 und Google Workspace', 'KI und Automatisierung', 'Sicherheit und Pflichten']
const START = ['/werkzeuge/nis2-betroffenheit', '/werkzeuge/ki-readiness', '/werkzeuge/website-check', '/werkzeuge/microsoft-365-oder-google-workspace']

test('Alle Sitemap-Seiten: Titel ≤ 65, Description 70–160 Zeichen', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text()
  const pfade = [...xml.matchAll(/<loc>https?:\/\/[^/]+([^<]*)<\/loc>/g)].map(m => m[1] || '/')
  expect(pfade.length).toBeGreaterThan(90)
  const fehler: string[] = []
  for (const p of pfade) {
    const html = await (await request.get(p)).text()
    const dekodiere = (s: string) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    const titel = dekodiere(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '')
    const desc = dekodiere(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '')
    if (titel.length > 65) fehler.push(`${p} Titel ${titel.length}: ${titel}`)
    if (desc.length < 70 || desc.length > 160) fehler.push(`${p} Description ${desc.length}`)
  }
  expect(fehler, fehler.join('\n')).toEqual([])
})

for (const [viewport, size] of [['Desktop', { width: 1440, height: 900 }], ['Mobil', { width: 390, height: 844 }]] as const) {
  test.describe(`P2 ${viewport}`, () => {
    test.use({ viewport: size })

    test('/werkzeuge: vier Bereiche, alle zwölf Werkzeuge genau einmal', async ({ page }) => {
      await page.goto('/werkzeuge')
      await expect(page.locator('main h2')).toHaveText(BEREICHE)
      const hrefs = await page.locator('main a[href^="/werkzeuge/"]').evaluateAll(as => as.map(a => a.getAttribute('href')))
      const werkzeuge = hrefs.filter(h => h && h.split('/').length === 3)
      expect(werkzeuge).toHaveLength(12)
      expect(new Set(werkzeuge).size).toBe(12)
      // NIS2 im Bereich Sicherheit, Website-Check im Bereich Website
      await expect(page.locator('section#sicherheit a[href="/werkzeuge/nis2-betroffenheit"]')).toHaveCount(1)
      await expect(page.locator('section#website a[href="/werkzeuge/website-check"]')).toHaveCount(1)
    })

    test('Startseite: genau vier Werkzeuge, Link auf die Übersicht', async ({ page }) => {
      await page.goto('/')
      const karten = page.locator('[data-tool-card] a')
      await expect(karten).toHaveCount(4)
      expect(await karten.evaluateAll(as => as.map(a => a.getAttribute('href')))).toEqual(START)
      await expect(page.getByRole('link', { name: /Alle 12 Werkzeuge in vier Bereichen/ })).toHaveAttribute('href', '/werkzeuge')
    })
  })
}

test('Blogbeitrag „WordPress oder Astro?“: Aufbau, Sitemap, interne Links', async ({ page, request }) => {
  const res = await page.goto('/blog/wordpress-oder-astro')
  expect(res?.status()).toBe(200)
  await expect(page.locator('h1')).toContainText('WordPress oder Astro?')
  await expect(page).toHaveTitle('WordPress oder Astro? Die Website-Entscheidung · Braum Consulting')
  await expect(page.locator('main table')).toHaveCount(1)
  // Inhaltsverzeichnis ohne das dekorative „#“ der Überschriften-Anker
  await page.locator('aside[aria-label="Inhalt"] a').first().waitFor({ state: 'attached' })
  const toc = await page.locator('aside[aria-label="Inhalt"] a').evaluateAll(as => as.map(a => a.textContent ?? ''))
  expect(toc.length).toBeGreaterThan(5)
  expect(toc.filter(t => t.trim().endsWith('#'))).toEqual([])
  await expect(page.getByText('landet schnell bei der Frage', { exact: false })).toBeVisible()
  const sitemap = await (await request.get('/sitemap.xml')).text()
  expect(sitemap).toContain('/blog/wordpress-oder-astro')
  const intern = await page.locator('main a[href^="/"]').evaluateAll(as => [...new Set(as.map(a => a.getAttribute('href')!.split('#')[0]))])
  for (const href of intern) expect((await request.get(href)).status(), href).toBe(200)
})

for (const pfad of ['/werkzeuge', '/blog/wordpress-oder-astro']) {
  test(`axe: Überschriften und Kontrast ${pfad}`, async ({ browser }) => {
    // Bewegung reduziert: Die Blog-Absätze blenden Wort für Wort beim Scrollen
    // ein; noch nicht eingeblendete Wörter wären sonst Messartefakte.
    const ctx = await browser.newContext({ reducedMotion: 'reduce' })
    const page = await ctx.newPage()
    await page.goto(pfad)
    await page.waitForTimeout(800)
    const r = await new AxeBuilder({ page }).withRules(['heading-order', 'color-contrast', 'link-name', 'list', 'listitem']).analyze()
    const befunde = r.violations.flatMap(v => v.nodes.map(n => `${v.id}: ${n.target.join(' ')}`))
    expect(befunde, befunde.join('\n')).toEqual([])
    await ctx.close()
  })
}

/* ── Lesbarkeit der Wort-Einblendung (ReadingHighlight) ─────────────────── */

for (const pfad of ['/blog/wordpress-oder-astro', '/cases/stewart-consult']) {
  test(`Wort-Einblendung hält 4,5:1 auch mit Bewegung: ${pfad}`, async ({ page }) => {
    await page.goto(pfad)
    await page.waitForTimeout(800)
    for (const y of [0, 900, 1800]) {
      await page.evaluate(v => window.scrollTo(0, v), y)
      await page.waitForTimeout(500)
      const r = await new AxeBuilder({ page }).include('main').withRules(['color-contrast']).analyze()
      const befunde = r.violations.flatMap(v => v.nodes.map(n => `${n.target.join(' ')} ${n.any[0]?.data?.contrastRatio}`))
      expect(befunde, `Scroll ${y}: ${befunde.slice(0, 5).join('\n')}`).toEqual([])
    }
  })
}

test('Wort-Einblendung: ausgeliefertes HTML voll deckend, am Seitenende nichts gedimmt', async ({ page, request }) => {
  const html = await (await request.get('/blog/wordpress-oder-astro')).text()
  const stile = [...html.matchAll(/<span data-rh="true" style="([^"]*)"/g)].map(m => m[1])
  expect(stile.length).toBeGreaterThan(100)
  expect(stile.filter(s => !/opacity:1(;|$)/.test(s))).toEqual([])
  // wie beim Lesen schrittweise bis ans Ende scrollen
  await page.goto('/blog/wordpress-oder-astro')
  for (let i = 0; i < 60; i++) {
    const unten = await page.evaluate(() => { window.scrollBy(0, 400); return scrollY + innerHeight >= document.documentElement.scrollHeight - 4 })
    await page.waitForTimeout(80)
    if (unten) break
  }
  await page.waitForTimeout(900)
  // der letzte Absatz ist vollständig eingeblendet
  const letzte = await page.locator('main [data-rh]').evaluateAll(ws => ws.slice(-40).map(w => Number((w as HTMLElement).style.opacity || 1)))
  expect(letzte.length).toBe(40)
  expect(Math.min(...letzte)).toBe(1)
})
