import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const slug = 'licht-und-liebe-photography'
const route = `/cases/${slug}`

for (const width of [1440, 768, 390, 360, 320]) {
  test(`Licht & Liebe: Highlights und Detail bei ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/cases')
    const highlights = page.getByRole('region', { name: 'Highlights', exact: true })
    const cards = highlights.locator('li > div > a')
    await expect(cards).toHaveCount(4)
    await expect(cards.first()).toHaveAttribute('href', route)
    await expect(page.getByRole('region', { name: 'Weitere Projekte' }).locator(`a[href="${route}"]`)).toHaveCount(0)
    await expect(cards.first()).toContainText('100')
    await cards.first().scrollIntoViewIfNeeded()
    await expect(cards.first().locator('img')).toBeVisible()
    await expect.poll(() => cards.first().locator('img').evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true)
    await page.waitForTimeout(1000)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.screenshot({ path: testInfo.outputPath(`highlights-${width}.png`) })
    await cards.first().screenshot({ path: testInfo.outputPath(`card-${width}.png`) })
    await page.getByRole('textbox', { name: 'Cases durchsuchen' }).fill('Licht & Liebe')
    await expect(cards).toHaveCount(1)
    await cards.first().click()
    await expect(page).toHaveURL(new RegExp(`${route}$`))
    await expect(page.locator('h1')).toContainText('Ein digitaler Auftritt aus einem Guss')
    const website = page.getByRole('link', { name: 'Zur Kundenwebsite' })
    await expect(website).toHaveAttribute('href', 'https://lichtundliebe.photography/')
    await expect(website).toHaveAttribute('rel', 'noopener noreferrer')
    for (const id of ['case-context', 'case-approach', 'case-outcome', 'case-tech']) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded()
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    }
    await expect(page.locator('#case-approach ol > li')).toHaveCount(6)
    await expect(page.locator('#case-outcome')).toContainText('100')
    // Auch Offscreen-Reveals vor dem vollständigen Screenshot auslösen.
    for (let y = 0; y < await page.locator('body').evaluate(el => el.scrollHeight); y += 600) {
      await page.evaluate(scrollY => scrollTo(0, scrollY), y)
      await page.waitForTimeout(50)
    }
    await page.locator('footer').scrollIntoViewIfNeeded()
    await page.locator('main img').first().scrollIntoViewIfNeeded()
    await expect.poll(() => page.locator('main img').first().evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true)
    await page.waitForTimeout(1000)
    await page.evaluate(() => scrollTo(0, 0))
    await page.waitForTimeout(1000)
    await page.screenshot({ path: testInfo.outputPath(`detail-hero-${width}.png`) })
    await page.screenshot({ path: testInfo.outputPath(`detail-${width}.png`), fullPage: true })
  })
}

test('Licht & Liebe: SEO, Bildmaße, Sitemap und interne Navigation', async ({ page, request }) => {
  const response = await page.goto(route)
  expect(response?.status()).toBe(200)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://braum.consulting${route}`)
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /Portfolio-Website/)
  await expect(page.locator('meta[property="og:image"]').first()).toHaveAttribute('content', /licht-und-liebe-photography-mockup.webp/)
  await expect(page.locator('meta[property="og:image:width"]').first()).toHaveAttribute('content', '1448')
  await expect(page.locator('meta[property="og:image:height"]').first()).toHaveAttribute('content', '1086')
  const schemas = await page.locator('script[type="application/ld+json"]').allTextContents()
  expect(schemas.map(s => JSON.parse(s)).find(s => s['@type'] === 'Article').image).toContain('licht-und-liebe-photography-mockup.webp')
  expect(await (await request.get('/sitemap.xml')).text()).toContain(`https://braum.consulting${route}`)
  const hrefs = await page.locator('a[href^="/cases"]').evaluateAll(links => [...new Set(links.map(l => l.getAttribute('href')!))])
  for (const href of hrefs) expect((await request.get(href)).status(), href).toBe(200)
})

for (const target of [
  { route: '/cases', selectors: ['#portfolio-list'] },
  { route, selectors: [`section[aria-label="Case ${slug}"]`, '[data-case-article]'] },
]) {
  test(`Case-Inhalt: keine serious/critical Accessibility-Befunde auf ${target.route}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto(target.route)
    // Hydration und initiale Opacity-Transitions vollständig abwarten.
    await page.waitForTimeout(1000)
    let scan = new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    for (const selector of target.selectors) scan = scan.include(selector)
    const results = await scan.analyze()
    const blocking = results.violations.filter(v => ['serious', 'critical'].includes(v.impact ?? ''))
    expect(blocking.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) }))).toEqual([])
  })
}

for (const width of [1440, 390]) {
  test(`Homepage-Highlights und normale Bewegung bei ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    const grid = page.locator('ul').filter({ has: page.locator(`a[href="${route}"]`) })
    await expect(grid.locator(':scope > li')).toHaveCount(4)
    await expect(grid.locator(':scope > li').first().locator('a')).toHaveAttribute('href', route)
    await grid.scrollIntoViewIfNeeded()
    await expect.poll(() => grid.locator('li').first().locator('img').evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.goto(route)
    await page.getByRole('link', { name: 'Zur Kundenwebsite' }).focus()
    await expect(page.getByRole('link', { name: 'Zur Kundenwebsite' })).toBeFocused()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  })
}
