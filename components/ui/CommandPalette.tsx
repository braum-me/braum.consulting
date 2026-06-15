'use client'

/**
 * Cmd+K (Ctrl+K) Command-Palette für Power-User-Navigation.
 *
 * Keyboard:
 *   ⌘K / Ctrl+K / „/"  → öffnen
 *   ⎋ Esc              → schließen
 *   ↑ / ↓              → Auswahl
 *   ⏎ Enter            → navigieren
 *
 * Fuzzy-Match: einfaches case-insensitive substring + Tokenisierung
 * (kein externes Lib, bleibt im Budget). Routes + Cases + Easter Egg
 * werden aus lib/cases.ts und der ROUTES-Konstante gespeist.
 */

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import {
  ArrowRight,
  Briefcase,
  Compass,
  FileText,
  Home,
  Mail,
  Search,
  Sparkles,
  User,
  type LucideIcon,
} from 'lucide-react'
import { CASES } from '@/lib/cases'
import { SERVICES } from '@/lib/services'
import { getInternalPosts } from '@/lib/posts'
import { GLOSSARY } from '@/lib/glossary'

interface CommandItem {
  id:        string
  label:     string
  hint?:     string
  href:      string
  Icon:      LucideIcon
  group:     'Seiten' | 'Leistungen' | 'Cases' | 'Notizen' | 'Lexikon'
  /** Tags für Fuzzy-Match */
  tags?:     string[]
  /** Volltext für Search-Matching (Body-Content, nicht im UI sichtbar) */
  text?:     string
  /** Optionaler Snippet der bei Volltext-Match angezeigt wird */
  snippet?:  string
}

const ROUTES: CommandItem[] = [
  { id: 'home',       label: 'Startseite',           hint: '/',            href: '/',            Icon: Home,      group: 'Seiten' },
  { id: 'ueber',      label: 'Über Stefan',          hint: '/ueber',       href: '/ueber',       Icon: User,      group: 'Seiten', tags: ['lebenslauf', 'cv', 'portrait'] },
  { id: 'portfolio',  label: 'Portfolio',            hint: '/cases',       href: '/cases',       Icon: Briefcase, group: 'Seiten', tags: ['engagements', 'cases', 'projekte'] },
  { id: 'blog',       label: 'Blog · Notizen',       hint: '/blog',        href: '/blog',        Icon: FileText,  group: 'Seiten', tags: ['notizen', 'long-form'] },
  { id: 'methodik',   label: 'Methodik · Lotsenprinzip', hint: '/methodik', href: '/methodik',   Icon: Compass,   group: 'Seiten', tags: ['lotsenprinzip', 'engagement-modell', 'phasen'] },
  { id: 'lexikon',    label: 'Lexikon',              hint: '/lexikon',     href: '/lexikon',     Icon: FileText,  group: 'Seiten', tags: ['glossar', 'begriffe', 'definitionen'] },
  { id: 'lagebild',   label: 'Lagebild anfragen',    hint: '/lagebild',    href: '/lagebild',    Icon: Sparkles,  group: 'Seiten', tags: ['lagebild', 'anfrage', 'einschätzung', 'erstgespräch'] },
  { id: 'kontakt',    label: 'Kontakt',              hint: '/kontakt',     href: '/kontakt',     Icon: Mail,      group: 'Seiten', tags: ['anfrage', 'mail'] },

  { id: 'marke',      label: 'Marke, Website & Reichweite',         hint: '/leistungen/marke',     href: '/leistungen/marke',     Icon: Compass, group: 'Leistungen' },
  { id: 'm365',       label: 'State of the Art IT & Cloud',         hint: '/leistungen/m365',      href: '/leistungen/m365',      Icon: Compass, group: 'Leistungen', tags: ['microsoft', 'azure', 'modern work'] },
  { id: 'ai',         label: 'KI & Automatisierung',                hint: '/leistungen/ai',        href: '/leistungen/ai',        Icon: Compass, group: 'Leistungen', tags: ['copilot', 'gpt'] },
  { id: 'strategie',  label: 'Digitale Transformation',             hint: '/leistungen/strategie', href: '/leistungen/strategie', Icon: Compass, group: 'Leistungen', tags: ['sparring'] },
]

const CASE_ITEMS: CommandItem[] = CASES.map(c => ({
  id:    `case-${c.num}`,
  label: c.title,
  hint:  `${c.fieldLabel} · ${c.sector}`,
  href:  `/cases/${c.num}`,
  Icon:  Briefcase,
  group: 'Cases',
  tags:  [c.fieldLabel, c.sector, c.year, c.duration, ...c.tech],
  // Volltext: Brief, Context-Paragraphs, Approach-Steps, Outcome, Tech
  text: [
    c.brief,
    ...c.context,
    ...c.approach,
    ...c.outcome,
    c.tech.join(' '),
    c.impact,
    c.metricLabel,
  ].join(' '),
}))

const SERVICE_ITEMS: CommandItem[] = SERVICES.map(s => ({
  id:    `service-${s.slug}`,
  label: s.title,
  hint:  `/leistungen/${s.slug}`,
  href:  `/leistungen/${s.slug}`,
  Icon:  Compass,
  group: 'Leistungen',
  tags:  s.tags,
  text:  [s.short, s.bodyIntro ?? '', s.tags.join(' ')].join(' '),
}))

const POST_ITEMS: CommandItem[] = getInternalPosts().map(p => ({
  id:    `post-${p.slug}`,
  label: p.title,
  hint:  `/blog/${p.slug}`,
  href:  `/blog/${p.slug}`,
  Icon:  FileText,
  group: 'Notizen',
  tags:  p.tags,
  text:  [p.title, p.excerpt, p.tags.join(' ')].join(' '),
}))

const GLOSSARY_ITEMS: CommandItem[] = GLOSSARY.map(t => ({
  id:    `glossar-${t.slug}`,
  label: t.term,
  hint:  `/lexikon/${t.slug}`,
  href:  `/lexikon/${t.slug}`,
  Icon:  FileText,
  group: 'Lexikon',
  tags:  [t.category, ...(t.synonyms ?? [])],
  text:  [t.term, t.definition, t.longForm ?? '', ...(t.synonyms ?? [])].join(' '),
}))

// SERVICE_ITEMS ersetzen die statischen Leistungs-Routes mit den Live-Daten
const ROUTE_BASE = ROUTES.filter(r => r.group !== 'Leistungen')
const ALL_ITEMS: CommandItem[] = [
  ...ROUTE_BASE,
  ...SERVICE_ITEMS,
  ...CASE_ITEMS,
  ...POST_ITEMS,
  ...GLOSSARY_ITEMS,
]

/**
 * Score + Snippet-Extraction. Höher = besser.
 * Gewichtung:
 *   - Token in label-startswith         +3
 *   - Token in label/hint/tags          +2
 *   - Token im Volltext (text-field)    +1
 * Bei Volltext-Match wird ein Snippet rund um den ersten Treffer
 * extrahiert (max 80 chars).
 */
function score(item: CommandItem, q: string): { score: number; snippet?: string } {
  if (!q.trim()) return { score: 1 }
  const tokens = q.toLowerCase().split(/\s+/).filter(Boolean)
  const labelHint = [item.label, item.hint ?? '', ...(item.tags ?? [])]
    .join(' ')
    .toLowerCase()
  const fullText = (item.text ?? '').toLowerCase()
  let s = 0
  let snippet: string | undefined

  for (const t of tokens) {
    if (item.label.toLowerCase().startsWith(t)) s += 3
    if (labelHint.includes(t)) s += 2
    if (fullText.includes(t)) {
      s += 1
      // Snippet aus dem Original (case-preserving) — erster Treffer-Token
      if (!snippet && item.text) {
        const idx = fullText.indexOf(t)
        if (idx >= 0) {
          const start = Math.max(0, idx - 30)
          const end   = Math.min(item.text.length, idx + 50)
          let s2 = item.text.slice(start, end)
          if (start > 0) s2 = '…' + s2
          if (end < item.text.length) s2 = s2 + '…'
          snippet = s2
        }
      }
    }
  }
  return { score: s, snippet }
}

export default function CommandPalette() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [activeIdx, setActiveIdx] = useState(0)

  /* ── Open-Shortcut ⌘K / Ctrl+K / „/" + Custom-Event ──────────────── */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const targetIsInput =
        (e.target as HTMLElement | null)?.tagName === 'INPUT' ||
        (e.target as HTMLElement | null)?.tagName === 'TEXTAREA' ||
        (e.target as HTMLElement | null)?.isContentEditable

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen(v => !v)
        return
      }
      if (e.key === '/' && !targetIsInput && !open) {
        e.preventDefault()
        setOpen(true)
      }
    }
    function onCustom() {
      setOpen(v => !v)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('bc-toggle-palette', onCustom)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('bc-toggle-palette', onCustom)
    }
  }, [open])

  /* ── Reset bei Close ──────────────────────────────────────────────── */
  useEffect(() => {
    if (!open) {
      setQ('')
      setActiveIdx(0)
    }
  }, [open])

  /* ── Filtered + Sorted Items (mit Volltext-Snippets) ──────────────── */
  const filtered = useMemo(() => {
    const scored = ALL_ITEMS.map(it => {
      const r = score(it, q)
      return { it: { ...it, snippet: r.snippet }, s: r.score }
    })
      .filter(x => x.s > 0)
      .sort((a, b) => b.s - a.s)
    return scored.map(x => x.it)
  }, [q])

  /* ── Group by group, preserving order ─────────────────────────────── */
  const grouped = useMemo(() => {
    const order: CommandItem['group'][] = ['Seiten', 'Leistungen', 'Cases', 'Notizen', 'Lexikon']
    const map = new Map<CommandItem['group'], CommandItem[]>()
    for (const it of filtered) {
      if (!map.has(it.group)) map.set(it.group, [])
      map.get(it.group)!.push(it)
    }
    return order
      .filter(g => map.has(g))
      .map(g => ({ group: g, items: map.get(g)! }))
  }, [filtered])

  const flatList = useMemo(
    () => grouped.flatMap(g => g.items),
    [grouped],
  )

  /* ── Arrow-Key Navigation + Enter ─────────────────────────────────── */
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
        return
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIdx(i => Math.min(flatList.length - 1, i + 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIdx(i => Math.max(0, i - 1))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const item = flatList[activeIdx]
        if (item) {
          setOpen(false)
          router.push(item.href)
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, flatList, activeIdx, router])

  /* ── Bei Filter-Change: Active-Index resetten ─────────────────────── */
  useEffect(() => {
    setActiveIdx(0)
  }, [q])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="palette-overlay"
          className="fixed inset-0 z-[120] flex items-start justify-center"
          style={{
            background: 'rgba(15, 14, 12, 0.65)',
            backdropFilter: 'blur(10px)',
            paddingTop: 'min(15vh, 120px)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={() => setOpen(false)}
          role="dialog"
          aria-label="Command-Palette"
        >
          <motion.div
            className="relative w-[min(620px,92vw)]"
            style={{
              background:
                'linear-gradient(145deg, rgba(245, 245, 248, 0.10) 0%, rgba(220, 220, 228, 0.05) 50%, rgba(200, 200, 210, 0.04) 100%)',
              border: '1px solid rgba(245, 245, 250, 0.18)',
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
              borderRadius: '12px',
              boxShadow:
                'inset 0 1px 0 rgba(255, 255, 255, 0.28), 0 32px 80px rgba(0, 0, 0, 0.65), 0 0 56px rgba(220, 128, 68, 0.10)',
              overflow: 'hidden',
            }}
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}
          >
            {/* Top specular */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.65) 50%, transparent 100%)',
              }}
            />

            {/* Search-Input */}
            <div
              className="flex items-center gap-3"
              style={{
                padding: '18px 22px',
                borderBottom: '1px solid rgba(245, 245, 250, 0.10)',
              }}
            >
              <Search size={16} strokeWidth={1.6} style={{ color: 'var(--fg-muted)' }} />
              <input
                type="text"
                placeholder={`Wo soll's hingehen? z.B. „cases", „ai", „011"`}
                value={q}
                onChange={e => setQ(e.target.value)}
                autoFocus
                className="flex-1 bg-transparent font-body outline-none"
                style={{
                  fontSize: '15px',
                  color: 'var(--fg-default)',
                  caretColor: 'var(--accent)',
                  letterSpacing: '-0.005em',
                }}
              />
              <kbd
                className="font-mono"
                style={{
                  fontSize: '10px',
                  letterSpacing: '0.08em',
                  color: 'var(--fg-muted)',
                  padding: '4px 8px',
                  border: '1px solid rgba(245, 245, 250, 0.16)',
                  borderRadius: '4px',
                  background: 'rgba(0, 0, 0, 0.25)',
                }}
              >
                ESC
              </kbd>
            </div>

            {/* Result-List — `data-lenis-prevent` damit Lenis das Mousewheel
                durchlässt und nativ scrollen kann (statt smooth-scrolling
                das Document dahinter) */}
            <div
              role="listbox"
              data-lenis-prevent
              style={{
                maxHeight: 'min(60vh, 480px)',
                overflowY: 'auto',
                overscrollBehavior: 'contain',
              }}
            >
              {grouped.length === 0 ? (
                <div
                  style={{
                    padding: '40px 22px',
                    textAlign: 'center',
                    color: 'var(--fg-muted)',
                    fontSize: '14px',
                  }}
                >
                  Keine Treffer. Versuch eine andere Suche.
                </div>
              ) : (
                grouped.map(({ group, items }) => {
                  return (
                    <div key={group}>
                      <p
                        className="font-mono uppercase"
                        style={{
                          fontSize: '9px',
                          letterSpacing: '0.20em',
                          color: 'var(--fg-subtle)',
                          padding: '14px 22px 8px',
                        }}
                      >
                        {group}
                      </p>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {items.map(item => {
                          const globalIdx = flatList.findIndex(x => x.id === item.id)
                          const isActive = globalIdx === activeIdx
                          const Icon = item.Icon
                          return (
                            <li key={item.id}>
                              <button
                                type="button"
                                role="option"
                                aria-selected={isActive}
                                onMouseEnter={() => setActiveIdx(globalIdx)}
                                onClick={() => {
                                  setOpen(false)
                                  router.push(item.href)
                                }}
                                className="flex w-full flex-col gap-1 text-left transition-colors duration-150"
                                style={{
                                  padding: '12px 22px',
                                  background: isActive
                                    ? 'rgba(220, 128, 68, 0.12)'
                                    : 'transparent',
                                  borderLeft: isActive
                                    ? '2px solid var(--accent)'
                                    : '2px solid transparent',
                                  color: isActive ? 'var(--fg-default)' : 'var(--fg-muted)',
                                }}
                              >
                                <div className="flex w-full items-center gap-3">
                                  <Icon
                                    size={15}
                                    strokeWidth={1.6}
                                    style={{
                                      color: isActive ? 'var(--accent)' : 'var(--fg-muted)',
                                      flexShrink: 0,
                                    }}
                                  />
                                  <span
                                    className="flex-1 truncate font-body"
                                    style={{
                                      fontSize: '14px',
                                      color: 'inherit',
                                    }}
                                  >
                                    {item.label}
                                  </span>
                                  {item.hint && (
                                    <span
                                      className="font-mono"
                                      style={{
                                        fontSize: '10px',
                                        letterSpacing: '0.04em',
                                        color: isActive
                                          ? 'var(--brand)'
                                          : 'var(--fg-subtle)',
                                      }}
                                    >
                                      {item.hint}
                                    </span>
                                  )}
                                  {isActive && (
                                    <ArrowRight
                                      size={13}
                                      strokeWidth={1.6}
                                      style={{ color: 'var(--accent)' }}
                                    />
                                  )}
                                </div>
                                {item.snippet && (
                                  <p
                                    className="font-body italic"
                                    style={{
                                      fontSize: '11px',
                                      lineHeight: 1.4,
                                      color: 'var(--fg-subtle)',
                                      paddingLeft: '24px',
                                      maxWidth: '100%',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    „{item.snippet}"
                                  </p>
                                )}
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )
                })
              )}
            </div>

            {/* Footer mit Shortcut-Hints */}
            <div
              className="flex items-center justify-between"
              style={{
                padding: '12px 22px',
                borderTop: '1px solid rgba(245, 245, 250, 0.10)',
                fontSize: '10px',
                color: 'var(--fg-subtle)',
                letterSpacing: '0.04em',
              }}
            >
              <div className="flex items-center gap-4">
                <span className="font-mono">
                  <kbd
                    style={{
                      padding: '2px 6px',
                      border: '1px solid rgba(245, 245, 250, 0.16)',
                      borderRadius: '3px',
                      marginRight: '6px',
                    }}
                  >
                    ↑↓
                  </kbd>
                  Navigation
                </span>
                <span className="font-mono">
                  <kbd
                    style={{
                      padding: '2px 6px',
                      border: '1px solid rgba(245, 245, 250, 0.16)',
                      borderRadius: '3px',
                      marginRight: '6px',
                    }}
                  >
                    ⏎
                  </kbd>
                  Öffnen
                </span>
              </div>
              <span
                className="font-mono uppercase"
                style={{ letterSpacing: '0.18em', color: 'var(--brand)' }}
              >
                ⌘K · Power-User
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
