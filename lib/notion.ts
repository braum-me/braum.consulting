/**
 * Notion-CRM-Client für Lagebild-Leads.
 *
 * Persistiert in der existierenden "Agency Companies"-Data-Source der
 * Sales-CRM-Page. Lagebild-Leads sind durch Property "Lead-Type" =
 * "premium-lagebild" von den Boutique-Outreach-Leads abgegrenzt.
 *
 * Property-Mapping in PROPS — wenn deine Notion-Property-Namen abweichen,
 * nur diese Map anpassen, der restliche Code bleibt unverändert.
 *
 * Verwendung:
 *   const { id, token } = await createLead(input)
 *   await updateLeadBriefing(id, briefingUrl, 'ready')
 *   const lead = await findLeadByToken(token)
 *   await updateLeadBooking(id, 'BOOK-123', new Date())
 */

import { Client } from '@notionhq/client'
import { randomBytes } from 'node:crypto'

export class NotionConfigError extends Error { constructor(m: string) { super(m); this.name = 'NotionConfigError' } }
export class NotionNotFoundError extends Error { constructor(m: string) { super(m); this.name = 'NotionNotFoundError' } }

/* ── Property-Namen in der "Agency Companies"-DB ──────────────────────────
 * Existierend (Boutique):
 *   Company (Title), Email, Phone, Outreach Status, …
 * Neu (Lagebild-Erweiterung):
 *   Lead-Type, Name (Person), Rolle, Anrede, MA-Anzahl, Branche-Premium,
 *   Säulen, Heutige Lage, Zielbild, Kernfrage, Bisherige Versuche,
 *   IT-Reifegrad, Zeithorizont, Budget, Entscheidungslage, Token,
 *   Briefing-URL, Briefing-Status, Cal-Booking-ID, Cal-Termin, Source
 * ────────────────────────────────────────────────────────────────────── */
export const PROPS = {
  // Bestehend (Boutique)
  company:        'Company',          // Title
  email:          'Email',
  phone:          'Phone',
  outreachStatus: 'Outreach Status',
  pointOfContact: 'Point of Contact',
  // Neu (Lagebild)
  leadType:          'Lead-Type',
  name:              'Name (Person)',
  rolle:             'Rolle',
  anrede:            'Anrede',
  maAnzahl:          'MA-Anzahl',
  branche:           'Branche-Premium',
  saeulen:           'Säulen',
  heutigeLage:       'Heutige Lage',
  zielbild:          'Zielbild',
  kernfrage:         'Kernfrage',
  bisherigeVersuche: 'Bisherige Versuche',
  itReifegrad:       'IT-Reifegrad',
  zeithorizont:      'Zeithorizont',
  budget:            'Budget',
  entscheidungslage: 'Entscheidungslage',
  token:             'Token',
  // Token-Härtung (optionale Felder — fehlen sie in der DB, greifen sichere
  // Defaults: nicht widerrufen / kein Ablauf, siehe findLeadByToken).
  tokenExpiresAt:    'Token-ExpiresAt',  // Date
  tokenRevoked:      'Token-Revoked',    // Checkbox
  briefingUrl:       'Briefing-URL',
  briefingStatus:    'Briefing-Status',
  calBookingId:      'Cal-Booking-ID',
  calTermin:         'Cal-Termin',
  source:            'Source',
} as const

export type Saeule       = 'marke' | 'm365' | 'ai' | 'strategie'
export type Anrede       = 'du' | 'sie'
export type Source       = 'pfad-a' | 'pfad-b'
export type BriefingState = 'pending' | 'generating' | 'ready' | 'failed'
export type LeadStatus   =
  | 'Lagebild-only'
  | 'Termin-ohne-Check'
  | 'Termin-mit-Check'
  | 'Im Lagebild'
  | 'Im Mandat'
  | 'Closed Won'
  | 'Closed Lost'

export interface LagebildAnswers {
  name:              string
  email:             string
  firma:             string
  rolle:             string
  anrede:            Anrede
  telefon?:          string
  branche:           string
  maAnzahl:          string
  saeulen:           Saeule[]
  heutigeLage:       string
  zielbild:          string
  kernfrage:         string
  bisherigeVersuche: string
  zeithorizont:      string
  budget:            string
  entscheidungslage: string
  /** Conditional Steps 5-8: per gewählter Säule. JSON-serialisiert in Notion. */
  tiefe?: Record<Saeule, Record<string, string> | undefined>
}

export interface CreateLeadInput extends LagebildAnswers {
  source: Source
}

export interface CreateLeadResult {
  /** Notion-Page-ID. */
  id:    string
  /** Opaque 16-char Token für Briefing-Permalink. */
  token: string
}

/* ── Client ──────────────────────────────────────────────────────────── */

let _client: Client | null = null
function getClient(): Client {
  if (_client) return _client
  const auth = process.env.NOTION_TOKEN
  if (!auth) throw new NotionConfigError('NOTION_TOKEN ist nicht gesetzt.')
  _client = new Client({ auth })
  return _client
}

function getDataSourceId(): string {
  const id = process.env.NOTION_LEADS_DATA_SOURCE_ID
  if (!id) throw new NotionConfigError('NOTION_LEADS_DATA_SOURCE_ID ist nicht gesetzt.')
  return id
}

/** Opaque, URL-safe Token (16 Zeichen Hex = 64 Bit Entropie). */
export function generateToken(): string {
  // 16 Bytes = 128 bit Entropie (vorher 8 Bytes = 64 bit). Bestehende, bereits
  // vergebene (kürzere) Token funktionieren weiter — findLeadByToken matcht per
  // String-Gleichheit, längen-unabhängig. Revocation/Ablauf greifen formatfrei
  // über die optionalen Notion-Felder „Token-Revoked"/„Token-ExpiresAt", die
  // findLeadByToken auswertet (siehe dort + revokeLeadToken).
  return randomBytes(16).toString('hex')
}

/* ── CRUD ───────────────────────────────────────────────────────────── */

/**
 * Legt einen neuen Lagebild-Lead in der Notion-DB an.
 * Title-Property "Company" bekommt den Firmen-Namen, "Name (Person)" bekommt
 * den Personen-Namen — beide werden sortier- und filterbar.
 */
export async function createLead(input: CreateLeadInput): Promise<CreateLeadResult> {
  const notion = getClient()
  const token  = generateToken()

  const itReifegradJson = input.tiefe
    ? JSON.stringify(input.tiefe, null, 2)
    : ''

  const response = await notion.pages.create({
    parent: { type: 'data_source_id', data_source_id: getDataSourceId() },
    properties: {
      [PROPS.company]:           { title:     [{ text: { content: input.firma } }] },
      [PROPS.email]:             { email:     input.email },
      [PROPS.phone]:             input.telefon ? { phone_number: input.telefon } : { phone_number: null },
      // Status-Mapping:
      //   "Potentiale"  = Lagebild-only / kein Termin
      //   "Contacted"   = Termin gebucht (mit/ohne Check, via Source unterschieden)
      //   "In Progress" = Im Lagebild oder im Mandat
      [PROPS.outreachStatus]:    { status:    { name: 'Potentiale' } },
      [PROPS.leadType]:          { select:    { name: 'premium-lagebild' } },
      [PROPS.name]:              { rich_text: [{ text: { content: input.name } }] },
      [PROPS.rolle]:             { select:    { name: input.rolle } },
      [PROPS.anrede]:            { select:    { name: input.anrede } },
      [PROPS.maAnzahl]:          { select:    { name: input.maAnzahl } },
      [PROPS.branche]:           { select:    { name: input.branche } },
      [PROPS.saeulen]:           { multi_select: input.saeulen.map(s => ({ name: s })) },
      [PROPS.heutigeLage]:       { rich_text: [{ text: { content: input.heutigeLage } }] },
      [PROPS.zielbild]:          { rich_text: [{ text: { content: input.zielbild } }] },
      [PROPS.kernfrage]:         { rich_text: [{ text: { content: input.kernfrage } }] },
      [PROPS.bisherigeVersuche]: { rich_text: [{ text: { content: input.bisherigeVersuche } }] },
      [PROPS.itReifegrad]:       { rich_text: [{ text: { content: itReifegradJson } }] },
      [PROPS.zeithorizont]:      { select:    { name: input.zeithorizont } },
      [PROPS.budget]:            { select:    { name: input.budget } },
      [PROPS.entscheidungslage]: { select:    { name: input.entscheidungslage } },
      [PROPS.token]:             { rich_text: [{ text: { content: token } }] },
      [PROPS.briefingStatus]:    { select:    { name: 'pending' } },
      [PROPS.source]:            { select:    { name: input.source } },
      [PROPS.pointOfContact]:    { rich_text: [{ text: { content: input.name } }] },
    } as Parameters<typeof notion.pages.create>[0]['properties'],
  })

  return { id: response.id, token }
}

export interface CreateToolLeadInput {
  /** Firma — wird Title der Notion-Page. */
  company: string
  email:   string
  name:    string
  /** Welches Werkzeug, z.B. "ai-stack-fit". Landet als Source-Select. */
  tool:    string
  /** Kompakte Ergebnis-Zusammenfassung (Profil, Scores, Picks). */
  summary: string
}

/**
 * Legt einen leichten Werkzeug-Lead in derselben Leads-DB an.
 *
 * Bewusst minimal: nur Company/Email/Name/Lead-Type/Source + die Zusammen-
 * fassung in „Heutige Lage". Die Lagebild-Pflichtfelder (Säulen, Budget, …)
 * bleiben leer — Notion verlangt nur den Title. Select-Optionen wie
 * "tool-lead" legt Notion beim ersten Schreiben automatisch an.
 */
export async function createToolLead(input: CreateToolLeadInput): Promise<{ id: string }> {
  const notion = getClient()
  const response = await notion.pages.create({
    parent: { type: 'data_source_id', data_source_id: getDataSourceId() },
    properties: {
      [PROPS.company]:        { title:     [{ text: { content: input.company } }] },
      [PROPS.email]:          { email:     input.email },
      [PROPS.name]:           { rich_text: [{ text: { content: input.name } }] },
      [PROPS.outreachStatus]: { status:    { name: 'Potentiale' } },
      [PROPS.leadType]:       { select:    { name: 'tool-lead' } },
      [PROPS.source]:         { select:    { name: `tool-${input.tool}` } },
      [PROPS.heutigeLage]:    { rich_text: [{ text: { content: input.summary.slice(0, 1900) } }] },
      [PROPS.pointOfContact]: { rich_text: [{ text: { content: input.name } }] },
    } as Parameters<typeof notion.pages.create>[0]['properties'],
  })
  return { id: response.id }
}

/**
 * Aktualisiert Lead nach erfolgreicher Briefing-Generierung.
 * Setzt Briefing-URL, Briefing-Status auf "ready".
 */
export async function updateLeadBriefing(
  pageId: string,
  briefingUrl: string,
  status: BriefingState = 'ready',
): Promise<void> {
  const notion = getClient()
  await notion.pages.update({
    page_id: pageId,
    properties: {
      [PROPS.briefingUrl]:    { url: briefingUrl },
      [PROPS.briefingStatus]: { select: { name: status } },
    } as Parameters<typeof notion.pages.update>[0]['properties'],
  })
}

/**
 * Findet einen Lead anhand seines Briefing-Tokens.
 * Wird in /briefing/[token] und /api/briefing/status/[token] aufgerufen.
 *
 * Token-Härtung: ein widerrufenes (Token-Revoked = true) oder abgelaufenes
 * (Token-ExpiresAt in der Vergangenheit) Token gilt als ungültig → null, als
 * gäbe es den Lead nicht (die Aufrufer mappen null auf 404/notFound). Beide
 * Felder sind optional; fehlen sie, greift der sichere Default (gültig), so
 * dass Bestands-Leads ohne diese Felder weiter funktionieren. Zum Entwerten
 * eines Permalinks genügt es, in Notion „Token-Revoked" zu setzen.
 */
export async function findLeadByToken(token: string): Promise<NotionLeadPage | null> {
  const notion = getClient()
  const result = await notion.dataSources.query({
    data_source_id: getDataSourceId(),
    filter: {
      property: PROPS.token,
      rich_text: { equals: token },
    },
    page_size: 1,
  })
  const page = result.results[0]
  if (!page || !('properties' in page)) return null
  const lead = page as NotionLeadPage

  if (readCheckbox(lead, PROPS.tokenRevoked)) return null
  const expiresAt = readDate(lead, PROPS.tokenExpiresAt)
  if (expiresAt && expiresAt.getTime() < Date.now()) return null

  return lead
}

/**
 * Entwertet das Token eines Leads (Token-Revoked = true). Macht den
 * Briefing-Permalink sofort ungültig, ohne den Lead zu löschen. Setzt das
 * optionale Notion-Feld voraus; ist es nicht angelegt, wirft Notion einen
 * Validierungsfehler (dann das Feld in der DB ergänzen).
 */
export async function revokeLeadToken(pageId: string): Promise<void> {
  const notion = getClient()
  await notion.pages.update({
    page_id: pageId,
    properties: {
      [PROPS.tokenRevoked]: { checkbox: true },
    } as Parameters<typeof notion.pages.update>[0]['properties'],
  })
}

/**
 * Findet einen Lead anhand der E-Mail-Adresse.
 * Genutzt vom Cal-Webhook für Pfad-B-Convergence (Termin gebucht → existing Lead?).
 */
export async function findLeadByEmail(email: string): Promise<NotionLeadPage | null> {
  const notion = getClient()
  const result = await notion.dataSources.query({
    data_source_id: getDataSourceId(),
    filter: {
      and: [
        { property: PROPS.email,    email:  { equals: email.toLowerCase() } },
        { property: PROPS.leadType, select: { equals: 'premium-lagebild' } },
      ],
    },
    page_size: 1,
  })
  const page = result.results[0]
  if (!page || !('properties' in page)) return null
  return page as NotionLeadPage
}

/**
 * Persistiert Cal.com-Buchung im Lead.
 * Setzt Status je nachdem, ob bereits ein Briefing existiert.
 */
export async function updateLeadBooking(
  pageId: string,
  calBookingId: string,
  calTermin: Date,
  hasBriefing: boolean,
): Promise<void> {
  const notion = getClient()
  await notion.pages.update({
    page_id: pageId,
    properties: {
      [PROPS.calBookingId]:   { rich_text: [{ text: { content: calBookingId } }] },
      [PROPS.calTermin]:      { date: { start: calTermin.toISOString() } },
      // Beide Cal-Termin-Varianten → "Contacted". Unterscheidung via Source + Briefing-Status.
      [PROPS.outreachStatus]: { status: { name: 'Contacted' } },
    } as Parameters<typeof notion.pages.update>[0]['properties'],
  })
}

/* ── Lese-Hilfen ─────────────────────────────────────────────────────── */

export interface NotionLeadPage {
  id: string
  properties: Record<string, unknown>
}

/** Hilfe: extrahiert Title-Text aus einer Title-Property. */
export function readTitle(page: NotionLeadPage, propName: string): string {
  const prop = page.properties[propName] as { title?: Array<{ plain_text: string }> } | undefined
  return prop?.title?.map(t => t.plain_text).join('') ?? ''
}

/** Hilfe: extrahiert Plain-Text aus einer Rich-Text-Property. */
export function readRichText(page: NotionLeadPage, propName: string): string {
  const prop = page.properties[propName] as { rich_text?: Array<{ plain_text: string }> } | undefined
  return prop?.rich_text?.map(t => t.plain_text).join('') ?? ''
}

/** Hilfe: extrahiert Select-Wert. */
export function readSelect(page: NotionLeadPage, propName: string): string | null {
  const prop = page.properties[propName] as { select?: { name: string } | null } | undefined
  return prop?.select?.name ?? null
}

/** Hilfe: extrahiert Multi-Select-Werte. */
export function readMultiSelect(page: NotionLeadPage, propName: string): string[] {
  const prop = page.properties[propName] as { multi_select?: Array<{ name: string }> } | undefined
  return prop?.multi_select?.map(o => o.name) ?? []
}

/** Hilfe: extrahiert Email-Wert. */
export function readEmail(page: NotionLeadPage, propName: string): string | null {
  const prop = page.properties[propName] as { email?: string | null } | undefined
  return prop?.email ?? null
}

/** Hilfe: extrahiert Checkbox-Wert. Default false, wenn Property fehlt. */
export function readCheckbox(page: NotionLeadPage, propName: string): boolean {
  const prop = page.properties[propName] as { checkbox?: boolean } | undefined
  return prop?.checkbox ?? false
}

/** Hilfe: extrahiert ein Datum (date.start) als Date, oder null. */
export function readDate(page: NotionLeadPage, propName: string): Date | null {
  const prop = page.properties[propName] as { date?: { start?: string } | null } | undefined
  const start = prop?.date?.start
  if (!start) return null
  const d = new Date(start)
  return Number.isNaN(d.getTime()) ? null : d
}
