import { readFileSync } from 'node:fs'
import { test, expect, type Page } from '@playwright/test'
import {
  TOOL_SLUGS, classifyLink, cleanPath, consumePendingLead, createBeforeSend, eventData,
  leadOrigin, markLeadPending, sanitizeUrl, type ToolSlug,
} from '../lib/analytics'

/**
 * Umami-Conversion-Tracking (docs/analytics-goals.md).
 * Umami wird im Browser durch einen Stub ersetzt, der alle Events sammelt;
 * das echte Script lädt in automatisierten Browsern nicht. Für den positiven
 * Formularfall muss der Server mit CONTACT_DRY_RUN=1 laufen (nur localhost).
 */

type Ev = [string, Record<string, unknown> | undefined]

async function stubUmami(page: Page, { failing = false } = {}) {
  await page.addInitScript(f => {
    const w = window as unknown as { __ev: unknown[]; umami: { track: (n: string, d?: unknown) => void } }
    w.__ev = []
    w.umami = { track: (n, d) => { if (f) throw new Error('umami down'); w.__ev.push([n, d]) } }
  }, failing)
}
const events = (page: Page) => page.evaluate(() => (window as unknown as { __ev: Ev[] }).__ev)
const named = (evs: Ev[], ...names: string[]) => evs.filter(([n]) => names.includes(n))

/** Erlaubte Felder je Event; Werte nur kurze Kategorien (kein @, keine Leerzeichen). */
const SCHEMA: Record<string, string[]> = {
  contact_started: ['form', 'source', 'tool', 'from'],
  contact_submitted: ['form', 'source', 'tool', 'from', 'subject'],
  contact_error: ['form', 'source', 'tool', 'from', 'reason'],
  tool_started: ['tool'],
  tool_completed: ['tool'],
  tool_contact_clicked: ['tool', 'placement', 'target'],
  cta_clicked: ['target', 'placement', 'page'],
  booking_clicked: ['placement', 'page', 'tool'],
  werkzeug_share_copied: ['tool'],
  lagebild_step_view: ['step'],
  'web-vital': ['name', 'value', 'rating'],
}
function expectClean(evs: Ev[]) {
  for (const [name, data] of evs) {
    expect(Object.keys(SCHEMA), `unbekanntes Event ${name}`).toContain(name)
    for (const [k, v] of Object.entries(data ?? {})) {
      expect(SCHEMA[name], `${name}.${k}`).toContain(k)
      expect(String(v), `${name}.${k}`).toMatch(/^[a-z0-9/_.-]{1,100}$/i)
    }
  }
}

/* ── Reine Logik ───────────────────────────────────────────────────────── */

test.describe('Logik', () => {
  test('Werkzeug-Slugs entsprechen lib/tools.ts', () => {
    const src = readFileSync('lib/tools.ts', 'utf8')
    const slugs = [...src.matchAll(/href: '\/werkzeuge\/([a-z0-9-]+)'/g)].map(m => m[1])
    expect([...slugs].sort()).toEqual([...TOOL_SLUGS].sort())
    expect(TOOL_SLUGS).toHaveLength(12)
  })

  test('URLs: nur Pfad plus utm_*, fremde Referrer nur als Ursprung', () => {
    const host = 'braum.consulting'
    expect(sanitizeUrl('https://braum.consulting/werkzeuge/nis2-betroffenheit?mitarbeitende=u50&finanzen=gross&sektor=Energie#x', host))
      .toBe('https://braum.consulting/werkzeuge/nis2-betroffenheit')
    expect(sanitizeUrl('https://braum.consulting/kontakt?tool=nis2&ergebnis=Voraussichtlich%20wichtig&utm_source=linkedin&utm_campaign=nis2', host))
      .toBe('https://braum.consulting/kontakt?utm_source=linkedin&utm_campaign=nis2')
    expect(sanitizeUrl('https://braum.consulting/lagebild/danke?token=geheim', host)).toBe('https://braum.consulting/lagebild/danke')
    expect(sanitizeUrl('https://braum.consulting/?utm_source=a@b.de', host)).toBe('https://braum.consulting/')
    expect(sanitizeUrl('https://mail.example.com/inbox/123?q=max@example.com', host)).toBe('https://mail.example.com/')
    expect(sanitizeUrl('', host)).toBe('')
    // Zugangs-Token im Pfad (persönliches Briefing) wird gekürzt
    expect(sanitizeUrl('https://braum.consulting/briefing/0123456789abcdef0123456789abcdef', host)).toBe('https://braum.consulting/briefing')
    expect(cleanPath('/briefing/0123456789abcdef0123456789abcdef')).toBe('/briefing')
    // selbst eingetippte Pfade mit E-Mail, Leerzeichen oder Kodierung
    expect(sanitizeUrl('https://braum.consulting/kontakt/max@example.com', host)).toBe('https://braum.consulting/unbekannt')
    expect(sanitizeUrl('https://braum.consulting/max%20mustermann', host)).toBe('https://braum.consulting/unbekannt')
    expect(sanitizeUrl('https://braum.consulting/blog/wordpress-oder-astro#tabelle', host)).toBe('https://braum.consulting/blog/wordpress-oder-astro')
    // utm-Werte nur als kurze Kennung
    expect(sanitizeUrl('https://braum.consulting/?utm_content=Max Mustermann&utm_source=LinkedIn', host)).toBe('https://braum.consulting/?utm_source=LinkedIn')
  })

  test('before-send: Seitenaufrufe nach Antwort-Änderungen im Query nicht doppelt', () => {
    const send = createBeforeSend('braum.consulting')
    const pv = (url: string) => send('event', { url, referrer: '' })
    expect(pv('https://braum.consulting/werkzeuge/website-check')).not.toBe(false)
    expect(pv('https://braum.consulting/werkzeuge/website-check?r=a.1')).toBe(false)
    expect(pv('https://braum.consulting/werkzeuge/website-check?r=a.2')).toBe(false)
    expect(send('event', { url: 'https://braum.consulting/werkzeuge/website-check?r=a.2', name: 'tool_completed' }))
      .toMatchObject({ url: 'https://braum.consulting/werkzeuge/website-check', name: 'tool_completed' })
    expect(pv('https://braum.consulting/kontakt?tool=website&ergebnis=x')).toMatchObject({ url: 'https://braum.consulting/kontakt' })
  })

  test('Event-Daten: nur erlaubte Felder und Kategorie-Werte', () => {
    const d = eventData('contact_submitted', {
      form: 'kontakt', source: 'seite', from: '/blog/x', subject: 'max@example.com',
      ...({ name: 'Max', email: 'max@example.com' } as object),
    } as never)
    expect(d).toEqual({ form: 'kontakt', source: 'seite', from: '/blog/x' })
    expect(cleanPath('/kontakt?x=1')).toBeUndefined()
    expect(cleanPath('/blog/wordpress-oder-astro/')).toBe('/blog/wordpress-oder-astro')
  })

  test('Herkunft: Werkzeug aus ?tool= oder aus der vorherigen Seite', () => {
    expect(leadOrigin('ki-readiness', '/blog/x')).toEqual({ source: 'werkzeug', tool: 'ki-readiness', from: '/blog/x' })
    expect(leadOrigin(undefined, '/werkzeuge/website-check')).toEqual({ source: 'werkzeug', tool: 'website-check', from: '/werkzeuge/website-check' })
    expect(leadOrigin(undefined, '/leistungen/m365')).toEqual({ source: 'seite', from: '/leistungen/m365' })
    expect(leadOrigin(undefined, undefined)).toEqual({ source: 'direkt' })
  })

  test('Lagebild: Erfolg wird genau einmal übergeben', () => {
    markLeadPending({ form: 'lagebild', source: 'direkt' })
    expect(consumePendingLead()).toEqual({ form: 'lagebild', source: 'direkt' })
    expect(consumePendingLead()).toBeNull()
  })

  test('Link-Klicks: Kontakt, Lagebild, Termin, Werkzeug — sonst nichts', () => {
    const o = 'https://braum.consulting'
    expect(classifyLink('/kontakt', '/blog/x', 'inhalt', o)).toEqual([{ name: 'cta_clicked', data: { target: 'kontakt', placement: 'inhalt', page: 'blog' } }])
    expect(classifyLink('/lagebild', '/', 'navigation', o)).toEqual([{ name: 'cta_clicked', data: { target: 'lagebild', placement: 'navigation', page: 'start' } }])
    expect(classifyLink('/werkzeuge/ki-readiness', '/leistungen/ai', 'inhalt', o)).toEqual([{ name: 'cta_clicked', data: { target: 'werkzeug', placement: 'inhalt', page: 'leistung' } }])
    expect(classifyLink('/termin', '/lagebild', 'inhalt', o)).toEqual([{ name: 'booking_clicked', data: { placement: 'inhalt', page: 'lagebild' } }])
    expect(classifyLink('/kontakt?tool=nis2&ergebnis=x', '/werkzeuge/nis2-betroffenheit', 'ergebnis', o))
      .toEqual([{ name: 'tool_contact_clicked', data: { tool: 'nis2-betroffenheit', placement: 'ergebnis', target: 'kontakt' } }])
    // Navigation auf einer Werkzeug-Seite ist kein Werkzeug-CTA
    expect(classifyLink('/kontakt', '/werkzeuge/nis2-betroffenheit', 'navigation', o))
      .toEqual([{ name: 'cta_clicked', data: { target: 'kontakt', placement: 'navigation', page: 'werkzeug' } }])
    expect(classifyLink('https://cal.braum.consulting/stefan/30min', '/termin', 'inhalt', o)).toEqual([{ name: 'booking_clicked', data: { placement: 'inhalt', page: 'sonstige' } }])
    expect(classifyLink('/leistungen/m365', '/', 'inhalt', o)).toEqual([])
    expect(classifyLink('/werkzeuge/ki-readiness', '/werkzeuge', 'inhalt', o)).toEqual([])
    expect(classifyLink('https://example.com/', '/', 'inhalt', o)).toEqual([])
    expect(classifyLink('/kontakt', '/kontakt', 'navigation', o)).toEqual([])
  })
})

/* ── Werkzeuge ─────────────────────────────────────────────────────────── */

async function ersteAntworten(page: Page) {
  const fragen = page.locator('fieldset.wz-frage')
  const n = await fragen.count()
  for (let i = 0; i < n; i++) await fragen.nth(i).locator('button').first().click()
}

const SPIELE: Record<ToolSlug, (page: Page) => Promise<void>> = {
  'iso-27001-readiness': ersteAntworten,
  'ki-readiness': ersteAntworten,
  'microsoft-365-oder-google-workspace': ersteAntworten,
  'website-check': ersteAntworten,
  'ki-dsgvo-check': ersteAntworten,
  'm365-migration-kosten': ersteAntworten,
  'cyber-schaden': async page => {
    for (const l of ['5–25 Mio. €', 'Das meiste', 'Backup vorhanden, ungeübt']) await page.getByRole('button', { name: l, exact: true }).click()
  },
  'nis2-betroffenheit': async page => {
    await page.getByRole('button', { name: '50 bis 249', exact: true }).click()
    await page.getByRole('button', { name: 'Umsatz oder Bilanzsumme höchstens 10 Mio. €', exact: true }).click()
    await page.getByLabel('Sektor').selectOption('Maschinenbau')
    await page.getByRole('button', { name: /^Nein, unsere Kunden/ }).click()
  },
  'automatisierung-roi': async page => {
    const f = page.locator('fieldset').first().locator('input')
    await f.nth(0).fill('20'); await f.nth(1).fill('15'); await f.nth(2).fill('2')
    await page.getByRole('button', { name: 'Größtenteils (~70 %)' }).click()
  },
  'phishing-quiz': async page => {
    for (let i = 0; i < 7; i++) {
      await page.getByRole('button', { name: 'Phishing', exact: true }).click()
      await page.getByRole('button', { name: i === 6 ? 'Zum Ergebnis' : 'Nächste Mail' }).click()
    }
  },
  'passwort-check': async page => {
    await page.locator('input[autocomplete="off"], input[type="password"]').first().fill('Sommer2024!')
  },
  'ai-stack-fit': async page => {
    await page.locator('.asf-mode-card', { hasText: /Wir fangen frisch an/ }).click()
    for (const pick of ['1-10 MA', 'Beratung / Services', '< 1 Mio €', 'Kosten-optimiert']) {
      await page.locator('.asf-opt-card', { hasText: pick }).first().click()
      await page.getByRole('button', { name: /Weiter|Empfehlung berechnen/ }).click()
    }
    await expect(page.locator('.asf-cta-big')).toBeVisible({ timeout: 15_000 })
  },
}

for (const [viewport, size] of [['Desktop', { width: 1440, height: 900 }], ['Mobil', { width: 390, height: 844 }]] as const) {
  test.describe(`Werkzeuge ${viewport}`, () => {
    test.use({ viewport: size })
    for (const tool of TOOL_SLUGS) {
      test(`${tool}: Seitenaufruf zählt nicht, Durchlauf genau einmal Start und Abschluss`, async ({ page }) => {
        await stubUmami(page)
        await page.goto(`/werkzeuge/${tool}`)
        await page.waitForTimeout(600)
        expect(named(await events(page), 'tool_started', 'tool_completed')).toEqual([])
        await SPIELE[tool](page)
        await page.waitForTimeout(500)
        const evs = await events(page)
        expect(named(evs, 'tool_started', 'tool_completed')).toEqual([['tool_started', { tool }], ['tool_completed', { tool }]])
        expectClean(evs)
      })
    }
  })
}

test('Geteilter Ergebnis-Link ist kein Durchlauf; „Neu starten“ zählt einen neuen', async ({ page }) => {
  await stubUmami(page)
  await page.goto('/werkzeuge/nis2-betroffenheit')
  await SPIELE['nis2-betroffenheit'](page)
  await expect(page).toHaveURL(/mitarbeitende=/)
  const geteilt = page.url()
  await page.goto(geteilt)
  await expect(page.locator('h2[tabindex="-1"]')).toBeVisible()
  await page.waitForTimeout(500)
  expect(named(await events(page), 'tool_started', 'tool_completed')).toEqual([])
  await page.getByRole('button', { name: /Neu starten/ }).click()
  await SPIELE['nis2-betroffenheit'](page)
  await page.waitForTimeout(400)
  // Antwort ändern nach dem Ergebnis: kein zweiter Abschluss
  await page.getByRole('button', { name: '250 oder mehr', exact: true }).click()
  await page.waitForTimeout(400)
  expect(named(await events(page), 'tool_started', 'tool_completed'))
    .toEqual([['tool_started', { tool: 'nis2-betroffenheit' }], ['tool_completed', { tool: 'nis2-betroffenheit' }]])
})

/* ── Kontaktformular ───────────────────────────────────────────────────── */

let ipZaehler = 0
async function eigeneIp(page: Page) {
  // eigenes Rate-Limit-Konto je Test (Server zählt 5 Anfragen pro IP und Stunde)
  await page.setExtraHTTPHeaders({ 'cf-connecting-ip': `203.0.113.${(Date.now() + ipZaehler++) % 250}` })
}

async function ausfuellen(page: Page, { zeitraum = true } = {}) {
  await page.getByText('Brand, Webdesign, SEO').click()
  await page.getByRole('button', { name: /Weiß ich noch nicht/ }).click()
  if (zeitraum) await page.getByRole('button', { name: 'sofort', exact: true }).click()
  await page.locator('input[name="name"]').fill('Erika Mustermann')
  await page.locator('input[name="email"]').fill('erika@example.invalid')
  await page.locator('textarea[name="message"]').fill('Automatischer Testversand, bitte ignorieren.')
}

test.describe('Kontaktformular', () => {
  test.beforeEach(async ({ page }) => { await eigeneIp(page); await stubUmami(page) })

  test('Erfolg: genau ein contact_submitted, ohne Eingaben, auch bei Doppelklick', async ({ page }) => {
    await page.goto('/kontakt', { waitUntil: 'load' })
    await ausfuellen(page)
    await page.getByRole('button', { name: /senden/i }).dblclick()
    await expect(page.getByText('Angekommen.')).toBeVisible({ timeout: 15_000 })
    await page.waitForTimeout(800)
    const evs = await events(page)
    expect(named(evs, 'contact_started')).toEqual([['contact_started', { form: 'kontakt', source: 'direkt' }]])
    expect(named(evs, 'contact_submitted')).toEqual([['contact_submitted', { form: 'kontakt', source: 'direkt', subject: 'marke' }]])
    expect(named(evs, 'contact_error')).toEqual([])
    expect(JSON.stringify(evs)).not.toMatch(/Erika|Mustermann|example\.invalid|Testversand/)
    expectClean(evs)
  })

  test('Seitenaufruf allein ist kein Formularstart', async ({ page }) => {
    await page.goto('/kontakt', { waitUntil: 'load' })
    await page.locator('input[name="name"]').focus()
    await page.waitForTimeout(300)
    expect(named(await events(page), 'contact_started')).toEqual([])
  })

  test('Honeypot: Erfolgsmeldung für den Bot, aber kein Lead', async ({ page }) => {
    await page.goto('/kontakt', { waitUntil: 'load' })
    await ausfuellen(page)
    await page.locator('input[name="website"]').evaluate((el: HTMLInputElement) => { el.value = 'spam' })
    await page.getByRole('button', { name: /senden/i }).click()
    await expect(page.getByText('Angekommen.')).toBeVisible({ timeout: 15_000 })
    await page.waitForTimeout(800)
    expect(named(await events(page), 'contact_submitted', 'contact_error')).toEqual([])
  })

  test('Fehler im Browser und vom Server: contact_error, kein Lead', async ({ page }) => {
    await page.goto('/kontakt', { waitUntil: 'load' })
    await page.getByRole('button', { name: /senden/i }).click()
    await page.waitForTimeout(300)
    expect(named(await events(page), 'contact_error')).toEqual([['contact_error', { form: 'kontakt', source: 'direkt', reason: 'validierung' }]])
    // Zeitraum prüft nur der Server
    await ausfuellen(page, { zeitraum: false })
    await page.getByRole('button', { name: /senden/i }).click()
    await expect(page.locator('form [role="alert"]')).toContainText('Zeitraum')
    await page.waitForTimeout(300)
    const evs = await events(page)
    expect(named(evs, 'contact_error')).toHaveLength(2)
    expect(named(evs, 'contact_error')[1]).toEqual(['contact_error', { form: 'kontakt', source: 'direkt', reason: 'validierung' }])
    expect(named(evs, 'contact_submitted')).toEqual([])
  })

  test('Tracking-Ausfall: Formular und Werkzeug funktionieren trotzdem', async ({ page }) => {
    await stubUmami(page, { failing: true })
    await page.goto('/kontakt', { waitUntil: 'load' })
    await ausfuellen(page)
    await page.getByRole('button', { name: /senden/i }).click()
    await expect(page.getByText('Angekommen.')).toBeVisible({ timeout: 15_000 })
    await page.goto('/werkzeuge/website-check')
    await SPIELE['website-check'](page)
    await expect(page.locator('h2[tabindex="-1"]')).toBeVisible()
  })
})

/* ── Vom Werkzeug bis zur Anfrage ──────────────────────────────────────── */

test('Werkzeug → Kontakt-CTA → Anfrage: Werkzeug bleibt zugeordnet', async ({ page }) => {
  await eigeneIp(page)
  await stubUmami(page)
  await page.goto('/werkzeuge/nis2-betroffenheit')
  await SPIELE['nis2-betroffenheit'](page)
  await page.getByRole('link', { name: /Im Lagebild einordnen lassen/ }).click()
  await expect(page).toHaveURL(/\/kontakt\?tool=nis2/)
  await page.getByRole('button', { name: /Weiß ich noch nicht/ }).click()
  await page.getByRole('button', { name: 'sofort', exact: true }).click()
  await page.locator('input[name="name"]').fill('Erika Mustermann')
  await page.locator('input[name="email"]').fill('erika@example.invalid')
  await page.getByRole('button', { name: /senden/i }).click()
  await expect(page.getByText('Angekommen.')).toBeVisible({ timeout: 15_000 })
  await page.waitForTimeout(800)
  const evs = await events(page)
  const tool = 'nis2-betroffenheit'
  expect(named(evs, 'tool_contact_clicked')).toEqual([['tool_contact_clicked', { tool, placement: 'ergebnis', target: 'kontakt' }]])
  expect(named(evs, 'cta_clicked')).toEqual([])
  expect(named(evs, 'contact_submitted')).toEqual([['contact_submitted', { form: 'kontakt', source: 'werkzeug', tool, from: `/werkzeuge/${tool}`, subject: 'strategie' }]])
  expectClean(evs)
})

/* ── CTAs und Terminbuchung ────────────────────────────────────────────── */

test('Unbekannte ?tool=-Werte brechen die Kontaktseite nicht', async ({ page }) => {
  for (const t of ['constructor', 'toString', 'gibtsnicht']) {
    const res = await page.goto(`/kontakt?tool=${t}`)
    expect(res?.status(), t).toBe(200)
    await expect(page.locator('input[name="name"]')).toBeVisible()
  }
})

test('Terminbuchung: booking_clicked', async ({ page }) => {
  await stubUmami(page)
  await page.goto('/leistungen/m365')
  await page.locator('main a[href="/termin"]').first().click()
  await expect(page).toHaveURL(/\/termin$/)
  const evs = await events(page)
  expect(named(evs, 'booking_clicked')).toEqual([['booking_clicked', { placement: 'inhalt', page: 'leistung' }]])
  expectClean(evs)
})

test('Blog-CTA: cta_clicked mit Seitentyp blog', async ({ page }) => {
  await stubUmami(page)
  await page.goto('/blog/wordpress-oder-astro')
  await page.locator('main a[href="/kontakt"]').first().click()
  await expect(page).toHaveURL(/\/kontakt$/)
  expect(named(await events(page), 'cta_clicked')).toEqual([['cta_clicked', { target: 'kontakt', placement: 'inhalt', page: 'blog' }]])
})

test('Startseite: Werkzeug-Einstieg und Navigation', async ({ page }) => {
  await stubUmami(page)
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await page.locator('[data-tool-card] a').first().click()
  await expect(page).toHaveURL(/\/werkzeuge\/nis2-betroffenheit$/)
  await page.locator('header a[href="/lagebild"]:visible').first().click()
  // gezählt wird beim Klick; die Seitenüberblendung muss dafür nicht fertig sein
  await expect.poll(async () => named(await events(page), 'cta_clicked')).toEqual([
    ['cta_clicked', { target: 'werkzeug', placement: 'inhalt', page: 'start' }],
    ['cta_clicked', { target: 'lagebild', placement: 'navigation', page: 'werkzeug' }],
  ])
})
