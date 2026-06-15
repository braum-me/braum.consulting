/**
 * Phase-1-Migration: TS-Arrays → JSON-Files unter content/
 *
 * Liest die Daten aus den bestehenden lib/*.ts Files (via dynamic import)
 * und schreibt strukturierte JSON-Files je Item / Single-Files für Listen.
 *
 * Ausführung: `node scripts/migrate-content-to-files.mjs`
 *
 * Idempotent: bei mehrfachem Lauf überschreibt es die Files (gewollt).
 */

import { writeFileSync } from 'node:fs'
import path from 'node:path'

import { CASES }       from '../lib/cases'
import { SERVICES }    from '../lib/services'
import { GLOSSARY }    from '../lib/glossary'
import { ENGAGEMENTS } from '../lib/engagements'

const ROOT = process.cwd()

function write(file: string, data: unknown) {
  writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8')
  console.log('  ✓', path.relative(ROOT, file))
}

console.log('Cases ('+CASES.length+'):')
for (const c of CASES) {
  write(path.join(ROOT, 'content/cases', `${c.num}.json`), c)
}

console.log('\nServices ('+SERVICES.length+'):')
for (const s of SERVICES) {
  // Icon-LucideIcon ist eine Funktion, kann nicht serialisiert werden.
  // Lösung: nur den Icon-Namen als String speichern, beim Load via Map auflösen.
  const { icon: _, ...rest } = s
  const iconName = (s.icon && s.icon.displayName) || (s.icon && s.icon.name) || null
  write(path.join(ROOT, 'content/services', `${s.slug}.json`), { ...rest, iconName })
}

console.log('\nGlossary ('+GLOSSARY.length+'):')
for (const t of GLOSSARY) {
  write(path.join(ROOT, 'content/glossary', `${t.slug}.json`), t)
}

console.log('\nEngagements ('+ENGAGEMENTS.length+'):')
write(path.join(ROOT, 'content/engagements.json'), ENGAGEMENTS)

console.log('\n✓ Migration complete')
