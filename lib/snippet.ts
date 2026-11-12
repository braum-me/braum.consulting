/**
 * Meta-Description aus längerem Text: bis `max` Zeichen, bevorzugt am
 * Satzende, sonst an der letzten Wortgrenze mit „…“ — nie mitten im Wort.
 */
export function snippet(text: string, max = 155): string {
  const t = text.replace(/\s+/g, ' ').trim()
  if (t.length <= max) return t
  const cut = t.slice(0, max)
  const satz = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('? '), cut.lastIndexOf('! '))
  if (satz >= 70) return cut.slice(0, satz + 1)
  const wort = cut.slice(0, max - 1).lastIndexOf(' ')
  return cut.slice(0, wort > 0 ? wort : max - 1).replace(/[\s,;:—–-]+$/, '') + '…'
}
