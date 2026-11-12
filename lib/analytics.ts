/**
 * Umami-Tracking — eine zentrale, typisierte Stelle für alle Events.
 *
 * Grundsätze (Datenschutz, Audit 2026-11):
 * - Nur Kategorien, nie Inhalte: keine Namen, E-Mails, Telefonnummern,
 *   Nachrichten, Passwörter, Antworten oder Ergebniswerte.
 * - Event-Daten sind auf die Felder im `EventMap` beschränkt; `track()`
 *   verwirft alles andere.
 * - URLs gehen nur als Pfad plus `utm_*` an Umami (`sanitizePayload`).
 * - Throw-safe: Ohne Umami, bei Opt-Out oder Fehlern ein No-op. Tracking darf
 *   nie eine Funktion der Seite blockieren.
 *
 * Event-Katalog und Umami-Einrichtung: docs/analytics-goals.md
 */

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, unknown>) => void
    }
    /** Von Umami vor jedem Versand aufgerufen (`data-before-send`). */
    braumUmamiBeforeSend?: (type: string, payload: UmamiPayload) => UmamiPayload | false
  }
}

const OPT_OUT_KEY = 'braum.analytics-opt-out'

/* ── Werkzeuge ─────────────────────────────────────────────────────────── */

/** Stabile Werkzeug-Kennungen = URL-Slug unter /werkzeuge/. */
export const TOOL_SLUGS = [
  'ai-stack-fit',
  'nis2-betroffenheit',
  'm365-migration-kosten',
  'iso-27001-readiness',
  'ki-readiness',
  'microsoft-365-oder-google-workspace',
  'website-check',
  'automatisierung-roi',
  'ki-dsgvo-check',
  'phishing-quiz',
  'cyber-schaden',
  'passwort-check',
] as const
export type ToolSlug = (typeof TOOL_SLUGS)[number]

export function isToolSlug(v: unknown): v is ToolSlug {
  return typeof v === 'string' && (TOOL_SLUGS as readonly string[]).includes(v)
}

/** Kurz-IDs aus `/kontakt?tool=…` (Vorbefüllung) → Werkzeug-Slug. */
export const TOOL_IDS: Record<string, ToolSlug> = {
  'ai-stack-fit': 'ai-stack-fit',
  nis2:           'nis2-betroffenheit',
  m365:           'm365-migration-kosten',
  iso:            'iso-27001-readiness',
  ki:             'ki-readiness',
  workspace:      'microsoft-365-oder-google-workspace',
  website:        'website-check',
  roi:            'automatisierung-roi',
  'ki-dsgvo':     'ki-dsgvo-check',
  phishing:       'phishing-quiz',
  cyber:          'cyber-schaden',
  passwort:       'passwort-check',
}

/* ── Event-Katalog ─────────────────────────────────────────────────────── */

/** Anfrage-Formulare: Kontaktformular, Lagebild-Anfrage, AI-Stack-Fit-PDF. */
export type LeadForm = 'kontakt' | 'lagebild' | 'pdf'
/** Woher die Anfrage kommt: aus einem Werkzeug, von einer Seite, direkt. */
export type LeadSource = 'werkzeug' | 'seite' | 'direkt'
export type ContactErrorReason = 'validierung' | 'bot_schutz' | 'rate_limit' | 'versand' | 'unbekannt'
export type Placement = 'navigation' | 'footer' | 'suche' | 'ergebnis' | 'inhalt'
export type PageType = 'start' | 'leistung' | 'blog' | 'werkzeug' | 'case' | 'lexikon' | 'lagebild' | 'sonstige'
export type ContactTarget = 'kontakt' | 'lagebild' | 'termin'

export type LeadOrigin = {
  source: LeadSource
  tool?: ToolSlug
  /** Letzte Seite vor dem Formular (nur Pfad, ohne Parameter). */
  from?: string
}

export interface EventMap {
  contact_started:      LeadOrigin & { form: LeadForm }
  contact_submitted:    LeadOrigin & { form: LeadForm; subject?: string }
  contact_error:        LeadOrigin & { form: LeadForm; reason: ContactErrorReason }
  tool_started:         { tool: ToolSlug }
  tool_completed:       { tool: ToolSlug }
  tool_contact_clicked: { tool: ToolSlug; placement: Placement; target: ContactTarget }
  cta_clicked:          { target: 'kontakt' | 'lagebild' | 'werkzeug'; placement: Placement; page: PageType }
  booking_clicked:      { placement: Placement; page: PageType; tool?: ToolSlug }
}
export type EventName = keyof EventMap

/** Erlaubte Felder je Event — alles andere wird vor dem Versand verworfen. */
const ALLOWED: { [E in EventName]: ReadonlyArray<keyof EventMap[E]> } = {
  contact_started:      ['form', 'source', 'tool', 'from'],
  contact_submitted:    ['form', 'source', 'tool', 'from', 'subject'],
  contact_error:        ['form', 'source', 'tool', 'from', 'reason'],
  tool_started:         ['tool'],
  tool_completed:       ['tool'],
  tool_contact_clicked: ['tool', 'placement', 'target'],
  cta_clicked:          ['target', 'placement', 'page'],
  booking_clicked:      ['placement', 'page', 'tool'],
}

/** Nur erlaubte Felder, nur kurze Kategorie-Strings. */
export function eventData<E extends EventName>(name: E, data: EventMap[E]): Record<string, string> {
  const out: Record<string, string> = {}
  for (const key of ALLOWED[name] as ReadonlyArray<string>) {
    const v = (data as Record<string, unknown>)[key]
    if (typeof v === 'string' && /^[a-z0-9/_-]{1,100}$/.test(v)) out[key] = v
  }
  return out
}

/** Typisiertes Tracking für den Event-Katalog. */
export function track<E extends EventName>(name: E, data: EventMap[E]): void {
  trackEvent(name, eventData(name, data))
}

/**
 * Low-Level-Versand. Für bestehende Hilfs-Events (`web-vital`,
 * `werkzeug_share_copied`, `lagebild_step_view`); neue Events über `track()`.
 */
export function trackEvent(name: string, props?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return
  try {
    if (window.localStorage.getItem(OPT_OUT_KEY) === '1') return
  } catch {
    /* localStorage blocked */
  }
  try {
    window.umami?.track(name, props)
  } catch {
    /* umami not loaded or failing — never break the page */
  }
}

/* ── Doppelzählung ─────────────────────────────────────────────────────── */

const recent = new Map<string, number>()

/** true, wenn derselbe Schlüssel innerhalb von `ms` schon gezählt wurde. */
export function seenRecently(key: string, ms = 1500, now = Date.now()): boolean {
  const last = recent.get(key)
  recent.set(key, now)
  return last !== undefined && now - last < ms
}

/* ── Herkunft einer Anfrage ────────────────────────────────────────────── */

let currentPath: string | undefined
let previousPath: string | undefined

/** Vom Layout bei jeder Navigation aufgerufen (nur im Speicher, kein Storage). */
export function notePath(pathname: string): void {
  const p = cleanPath(pathname)
  if (!p || p === currentPath) return
  previousPath = currentPath
  currentPath = p
}

/** Routen mit Zugangs-Token im Pfad: nur der feste Teil geht an Umami. */
const TOKEN_ROUTES = ['/briefing']

/** `/briefing/<token>` → `/briefing`; alle anderen Pfade unverändert. */
export function maskPath(pathname: string): string {
  for (const r of TOKEN_ROUTES) if (pathname === r || pathname.startsWith(`${r}/`)) return r
  return pathname
}

/** Pfad ohne Parameter und ohne Token, nur erwartbare Zeichen, sonst undefined. */
export function cleanPath(pathname: string | null | undefined): string | undefined {
  if (!pathname) return undefined
  const p = maskPath(pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname)
  return /^\/[a-z0-9/-]{0,99}$/.test(p) ? p : undefined
}

/** Werkzeug-Slug aus einem Pfad /werkzeuge/<slug>. */
export function toolFromPath(path: string | undefined): ToolSlug | undefined {
  const m = path?.match(/^\/werkzeuge\/([a-z0-9-]+)$/)
  return m && isToolSlug(m[1]) ? m[1] : undefined
}

/**
 * Herkunft für ein Anfrage-Event: ein ausdrücklich übergebenes Werkzeug
 * (`/kontakt?tool=…`) gewinnt, sonst die zuletzt besuchte Seite.
 */
export function leadOrigin(tool?: ToolSlug, from: string | undefined = previousPath): LeadOrigin {
  const viaPath = toolFromPath(from)
  if (tool || viaPath) return { source: 'werkzeug', tool: tool ?? viaPath, ...(from ? { from } : {}) }
  if (from) return { source: 'seite', from }
  return { source: 'direkt' }
}

/* Lagebild: Erfolg zeigt erst die Danke-Seite nach dem Redirect. Die Herkunft
   wird beim Absenden gemerkt (nur im Speicher) und dort genau einmal gezählt. */
let pendingLead: EventMap['contact_submitted'] | null = null
export function markLeadPending(data: EventMap['contact_submitted'] | null): void {
  pendingLead = data
}
export function consumePendingLead(): EventMap['contact_submitted'] | null {
  const d = pendingLead
  pendingLead = null
  return d
}

/* ── Seiten und Links ──────────────────────────────────────────────────── */

export function pageType(path: string | undefined): PageType {
  if (!path) return 'sonstige'
  if (path === '/') return 'start'
  if (path.startsWith('/leistungen')) return 'leistung'
  if (path.startsWith('/blog')) return 'blog'
  if (path.startsWith('/werkzeuge')) return 'werkzeug'
  if (path.startsWith('/cases')) return 'case'
  if (path.startsWith('/lexikon')) return 'lexikon'
  if (path.startsWith('/lagebild')) return 'lagebild'
  return 'sonstige'
}

export type LinkEvent =
  | { name: 'cta_clicked'; data: EventMap['cta_clicked'] }
  | { name: 'tool_contact_clicked'; data: EventMap['tool_contact_clicked'] }
  | { name: 'booking_clicked'; data: EventMap['booking_clicked'] }

/**
 * Welche Events ein Link-Klick auslöst. Gezählt werden nur Links zu Kontakt,
 * Lagebild, Terminbuchung und (außerhalb der Werkzeuge) zu einem Werkzeug —
 * keine sonstige Navigation.
 */
export function classifyLink(href: string, currentPathname: string, placement: Placement, origin: string): LinkEvent[] {
  let url: URL
  try {
    url = new URL(href, origin)
  } catch {
    return []
  }
  const here = cleanPath(currentPathname)
  const page = pageType(here)
  const tool = toolFromPath(here)
  const inContent = placement !== 'navigation' && placement !== 'footer'

  // Externe Buchung (Cal) — eigene Subdomain oder cal.com
  const external = url.origin !== origin
  if (external) {
    const isCal = /^cal\./.test(url.hostname) || url.hostname === 'cal.com'
    return isCal ? [{ name: 'booking_clicked', data: { placement, page, ...(tool ? { tool } : {}) } }] : []
  }

  const path = cleanPath(url.pathname)
  if (!path || path === here) return []

  let target: ContactTarget | 'werkzeug' | null = null
  if (path === '/kontakt') target = 'kontakt'
  else if (path === '/lagebild' || path === '/lagebild/check') target = 'lagebild'
  else if (path === '/termin') target = 'termin'
  else if (toolFromPath(path) && page !== 'werkzeug') target = 'werkzeug'
  if (!target) return []

  const out: LinkEvent[] = []
  if (tool && inContent && target !== 'werkzeug') {
    out.push({ name: 'tool_contact_clicked', data: { tool, placement, target } })
  }
  if (target === 'termin') {
    out.push({ name: 'booking_clicked', data: { placement, page, ...(tool ? { tool } : {}) } })
  } else if (!(tool && inContent)) {
    out.push({ name: 'cta_clicked', data: { target, placement, page } })
  }
  return out
}

/* ── URL-Bereinigung vor dem Versand an Umami ──────────────────────────── */

export type UmamiPayload = { url?: string; referrer?: string; [k: string]: unknown }

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']

/**
 * Eigene URLs: nur Pfad plus `utm_*` (Werkzeug-Antworten, Ergebnisse und
 * Tokens stehen sonst im Query), Token-Routen ohne Token. Fremde Referrer:
 * nur der Ursprung. `utm_*`-Werte nur als kurze Kennung ohne Leerzeichen.
 */
export function sanitizeUrl(raw: string | undefined, ownHost: string): string | undefined {
  if (!raw) return raw
  let u: URL
  try {
    u = new URL(raw)
  } catch {
    return ''
  }
  if (u.hostname !== ownHost) return `${u.origin}/`
  const keep = new URLSearchParams()
  for (const k of UTM_KEYS) {
    const v = u.searchParams.get(k)
    if (v && /^[A-Za-z0-9_.-]{1,40}$/.test(v)) keep.set(k, v)
  }
  const q = keep.toString()
  // Pfade mit unerwarteten Zeichen (z. B. selbst eingetippte 404-Adressen mit
  // E-Mail oder Leerzeichen) gehen nur als Platzhalter raus.
  const path = maskPath(u.pathname)
  return `${u.origin}${/^\/[A-Za-z0-9/._~-]{0,150}$/.test(path) ? path : '/unbekannt'}${q ? `?${q}` : ''}`
}

export function sanitizePayload(payload: UmamiPayload, ownHost: string): UmamiPayload {
  return {
    ...payload,
    url: sanitizeUrl(payload.url, ownHost),
    referrer: sanitizeUrl(payload.referrer, ownHost),
  }
}

/**
 * `data-before-send` für Umami: bereinigt jede Nutzlast und verwirft
 * Seitenaufrufe, deren bereinigte URL dem letzten entspricht. Werkzeuge
 * schreiben Antworten per `replaceState` in den Query; ohne diese Sperre
 * zählte jede Antwort als weiterer Seitenaufruf.
 */
export function createBeforeSend(ownHost: string) {
  let lastPageview: string | undefined
  return (_type: string, payload: UmamiPayload): UmamiPayload | false => {
    const clean = sanitizePayload(payload, ownHost)
    if (payload.name === undefined) {
      if (clean.url === lastPageview) return false
      lastPageview = clean.url
    }
    return clean
  }
}

/* ── Web Vitals ────────────────────────────────────────────────────────── */

/**
 * Web-Vitals (RUM) → Umami als Event `web-vital` mit { name, value, rating }.
 * CLS ist ein Score (4 Nachkommastellen), alle übrigen Werte ganze ms.
 */
export function reportVital(name: string, value: number, rating?: string): void {
  if (typeof window === 'undefined') return
  const rounded = name === 'CLS' ? Math.round(value * 10000) / 10000 : Math.round(value)
  trackEvent('web-vital', { name, value: rounded, ...(rating ? { rating } : {}) })
}
