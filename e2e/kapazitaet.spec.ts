import { readFileSync } from 'node:fs'
import { test, expect, type Page } from '@playwright/test'
import { getNextQuarter } from '../lib/quarter'
import { CAPACITY_TOTAL, computeCapacity, type CapacityEngagement } from '../lib/capacity'

/**
 * Projekt- und Kapazitätsanzeige: nur die Vereinswebsite läuft, 2 Projektslots,
 * Bezug immer auf das nächste Kalenderquartal (im Browser berechnet).
 */

const d = (iso: string) => new Date(iso)

test.describe('Logik', () => {
  test('nächstes Quartal inkl. Jahreswechsel', () => {
    const faelle: Array<[string, string]> = [
      ['2026-11-12T12:00:00', 'Q1 2027'],
      ['2027-01-15T12:00:00', 'Q2 2027'],
      ['2027-04-01T00:00:00', 'Q3 2027'],
      ['2026-01-01T00:00:00', 'Q2 2026'],
      ['2026-03-31T23:59:59', 'Q2 2026'],
      ['2026-06-30T23:59:59', 'Q3 2026'],
      ['2026-09-30T23:59:59', 'Q4 2026'],
      ['2026-10-01T00:00:00', 'Q1 2027'],
      ['2026-12-31T23:59:59', 'Q1 2027'],
    ]
    for (const [jetzt, erwartet] of faelle) expect(getNextQuarter(d(jetzt)).label, jetzt).toBe(erwartet)
    const q = getNextQuarter(d('2026-11-12T12:00:00'))
    expect([q.quarter, q.year, q.start.getFullYear(), q.start.getMonth(), q.start.getDate()]).toEqual([1, 2027, 2027, 0, 1])
  })

  test('Kapazitätsgrenzen: 0, 1, 2 und mehr laufende Projekte', () => {
    expect(CAPACITY_TOTAL).toBe(2)
    const jetzt = d('2026-11-12T12:00:00')
    const laufend = (n: number): CapacityEngagement[] => Array.from({ length: n }, () => ({ state: 'active' }))
    const c = (n: number) => computeCapacity(laufend(n), jetzt)
    expect(c(0)).toMatchObject({ filled: 0, free: 2, full: false, label: '0 von 2 Projektslots belegt', quarter: 'Q1 2027' })
    expect(c(1)).toMatchObject({ filled: 1, free: 1, full: false, label: '1 von 2 Projektslots belegt' })
    expect(c(2)).toMatchObject({ filled: 2, free: 0, full: true, label: '2 von 2 Projektslots belegt' })
    expect(c(3)).toMatchObject({ filled: 2, free: 0, full: true, label: '2 von 2 Projektslots belegt' })
  })

  test('Abschlussdatum: nur ein Ende vor Quartalsbeginn gibt den Slot frei', () => {
    const jetzt = d('2026-11-12T12:00:00') // Bezug Q1 2027, Beginn 01.01.2027
    expect(computeCapacity([{ state: 'active' }], jetzt).filled).toBe(1)                          // kein Datum: läuft weiter
    expect(computeCapacity([{ state: 'active', endDate: '2026-12-20' }], jetzt).filled).toBe(0)   // endet vorher
    expect(computeCapacity([{ state: 'active', endDate: '2027-01-01' }], jetzt).filled).toBe(1)   // endet im Quartal
    expect(computeCapacity([{ state: 'done' }, { state: 'scoping' }], jetzt).filled).toBe(1)      // done zählt nicht
    expect(computeCapacity([{ state: 'active', endDate: '2026-12-20' }], null)).toMatchObject({ filled: 1, quarter: null }) // ohne Datum: konservativ
  })

  test('Daten: genau ein laufendes Projekt, die Vereinswebsite', () => {
    const daten = JSON.parse(readFileSync('content/engagements.json', 'utf8'))
    expect(daten).toEqual([{ project: 'Vereinswebsite', client: 'Verein & Community', state: 'active', detail: 'ongoing' }])
  })
})

async function kapazitaet(page: Page) {
  // HeroStatus gibt es je Layout einmal; geprüft wird die sichtbare Fassung
  const balken = page.locator('[data-kapazitaet-balken]:visible')
  const karte = balken.locator('xpath=ancestor::div[contains(@class,"relative")][1]')
  return {
    titel: karte.locator('p').first(),
    karte,
    segmente: balken.locator('> span'),
    belegt: balken.locator('> span[data-belegt]'),
  }
}

for (const [viewport, size] of [['Desktop', { width: 1440, height: 900 }], ['Mobil', { width: 390, height: 844 }]] as const) {
  test(`Startseite ${viewport}: nur Vereinswebsite, 1 von 2 Slots, nächstes Quartal`, async ({ page }) => {
    await page.setViewportSize(size)
    await page.goto('/')
    const projekte = page.locator('ul:visible', { has: page.getByText('Vereinswebsite') }).locator('li')
    await expect(projekte).toHaveCount(1)
    await expect(projekte.first()).toContainText('Verein & Community')
    await expect(projekte.first()).toContainText(/ongoing/i)
    const k = await kapazitaet(page)
    const erwartet = getNextQuarter(new Date()).label
    await expect(k.titel).toHaveText(`Kapazität · ${erwartet}`)
    await expect(k.karte).toContainText('1 von 2 Projektslots belegt')
    await expect(k.segmente).toHaveCount(2)
    await expect(k.belegt).toHaveCount(1)
    await expect(k.karte.getByRole('link', { name: /Neue Projekte für das kommende Quartal anfragen/ })).toHaveAttribute('href', '/kontakt')
  })
}

for (const [datum, erwartet] of [['2026-12-31T22:00:00', 'Q1 2027'], ['2027-01-15T10:00:00', 'Q2 2027'], ['2027-04-02T10:00:00', 'Q3 2027']] as const) {
  test(`Browser-Datum ${datum.slice(0, 10)} → ${erwartet}`, async ({ page }) => {
    await page.clock.setFixedTime(new Date(datum))
    await page.goto('/')
    const k = await kapazitaet(page)
    await expect(k.titel).toHaveText(`Kapazität · ${erwartet}`)
  })
}

test('/cases: Board zeigt Bezugsquartal und 1/2 Slots, ein Projekt in Arbeit', async ({ page }) => {
  await page.goto('/cases')
  const erwartet = getNextQuarter(new Date()).label
  await expect(page.getByText(`${erwartet} · 1/2 Slots belegt`)).toBeVisible()
  await expect(page.getByText('Vereinswebsite')).toBeVisible()
  for (const alt of ['Finanzbranche', 'Dienstleistungssektor']) await expect(page.getByText(alt, { exact: true })).toHaveCount(0)
})
