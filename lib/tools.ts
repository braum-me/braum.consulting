/**
 * Werkzeuge — Single Source of Truth für die interaktiven Selbst-Checks.
 * Genutzt vom Hub (/werkzeuge), dem Homepage-Teaser und für Cross-Links.
 * Neues Tool: hier ergänzen + Seite unter app/werkzeuge/{slug}/ anlegen.
 */

import { ShieldQuestion, Gauge, FileCheck, Sparkles, Scale, Layers, Globe, Timer, Lock, MailWarning, AlertTriangle, KeyRound, type LucideIcon } from 'lucide-react'

export interface Tool {
  href: string
  num: string
  eyebrow: string
  title: string
  text: string
  time: string
  Icon: LucideIcon
}

export const TOOLS: Tool[] = [
  {
    href: '/werkzeuge/ai-stack-fit',
    Icon: Layers,
    num: '01',
    eyebrow: 'KI-Stack',
    title: 'Welcher KI-Stack passt zu dir?',
    text: 'In 90 Sekunden aus 52 KI- und Business-Systemen die passenden ermitteln — mit EU-Souveränitäts-Score, Friction-Check und PDF-Export.',
    time: '~2 Min',
  },
  {
    href: '/werkzeuge/nis2-betroffenheit',
    Icon: ShieldQuestion,
    num: '02',
    eyebrow: 'NIS2',
    title: 'Bin ich von NIS2 betroffen?',
    text: 'Drei Fragen zu Größe, Sektor und Lieferkette — und eine erste Einordnung, ob dich die Richtlinie direkt, mittelbar oder gar nicht trifft.',
    time: '~2 Min',
  },
  {
    href: '/werkzeuge/m365-migration-kosten',
    Icon: Gauge,
    num: '03',
    eyebrow: 'M365',
    title: 'Was treibt meine M365-Migration?',
    text: 'Fünf Fragen zu deiner Ausgangslage — du bekommst Komplexität, Dauer und die Treiber eingeordnet, an denen der Aufwand wirklich hängt.',
    time: '~2 Min',
  },
  {
    href: '/werkzeuge/iso-27001-readiness',
    Icon: FileCheck,
    num: '04',
    eyebrow: 'ISO 27001',
    title: 'Wie weit ist mein ISMS?',
    text: 'Sechs Fragen entlang der Kernbausteine — du siehst deinen Reifegrad und die Lücken, die zwischen dir und einem Audit liegen.',
    time: '~2 Min',
  },
  {
    href: '/werkzeuge/ki-readiness',
    Icon: Sparkles,
    num: '05',
    eyebrow: 'KI',
    title: 'Ist mein Betrieb bereit für KI?',
    text: 'Sechs Fragen zu den Voraussetzungen eines Copilot-Rollouts — Berechtigungen, Daten, Governance — mit ehrlichem Reifegrad statt Hype.',
    time: '~2 Min',
  },
  {
    href: '/werkzeuge/microsoft-365-oder-google-workspace',
    Icon: Scale,
    num: '06',
    eyebrow: 'Cloud-Suite',
    title: 'Microsoft 365 oder Google Workspace?',
    text: 'Sechs Fragen zu Stack, Arbeitsweise und Compliance — du bekommst eine ehrliche, vendor-neutrale Tendenz statt einer Glaubensfrage.',
    time: '~2 Min',
  },
  {
    href: '/werkzeuge/website-check',
    Icon: Globe,
    num: '07',
    eyebrow: 'Website',
    title: 'Bringt deine Website Anfragen?',
    text: 'Sechs Fragen zu Google-Profil, lokaler Auffindbarkeit, Technik und Anfrage-Wegen — für Handwerk, Praxen und Dienstleister.',
    time: '~2 Min',
  },
  {
    href: '/werkzeuge/automatisierung-roi',
    Icon: Timer,
    num: '08',
    eyebrow: 'Automatisierung',
    title: 'Was spart Automatisierung wirklich?',
    text: 'Häufigkeit, Dauer, Beteiligte eingeben — und sehen, wie viele Stunden und Arbeitstage pro Jahr in einem Routine-Ablauf stecken.',
    time: '~30 Sek',
  },
  {
    href: '/werkzeuge/ki-dsgvo-check',
    Icon: Lock,
    num: '09',
    eyebrow: 'KI & DSGVO',
    title: 'Darf ich dieses KI-Tool so nutzen?',
    text: 'Fünf Fragen zu Datenart, Vertrag und Verarbeitungsort — als Ampel beantwortet, mit konkreten nächsten Schritten.',
    time: '~2 Min',
  },
  {
    href: '/werkzeuge/phishing-quiz',
    Icon: MailWarning,
    num: '10',
    eyebrow: 'Security',
    title: 'Erkennst du die Fälschung?',
    text: 'Sieben realistische Mails — Phishing oder seriös? Mit den Erkennungszeichen nach jeder Antwort. Ideal fürs Team.',
    time: '~3 Min',
  },
  {
    href: '/werkzeuge/cyber-schaden',
    Icon: AlertTriangle,
    num: '11',
    eyebrow: 'Risiko',
    title: 'Was kostet ein Tag Stillstand?',
    text: 'Drei Angaben zu Umsatz, IT-Abhängigkeit und Vorbereitung — und du siehst die grobe Schadens-Größenordnung eines ernsten IT-Ausfalls.',
    time: '~1 Min',
  },
  {
    href: '/werkzeuge/passwort-check',
    Icon: KeyRound,
    num: '12',
    eyebrow: 'Security',
    title: 'Wie sicher ist dein Passwort?',
    text: 'Tippe ein Muster und sieh live, wie schnell es geknackt wäre. Läuft rein im Browser — nichts wird gesendet. Ideal fürs Team.',
    time: '~1 Min',
  },
]

/* ── Cross-Tool-Empfehlung (#6) ────────────────────────────────────────────
   Pro Tool zwei thematisch passende nächste Schritte. Slug = letzter
   Pfad-Teil. Fällt auf die nächsten Tools der Liste zurück, falls nichts
   Passendes hinterlegt ist. */

const RELATED: Record<string, string[]> = {
  'nis2-betroffenheit':                  ['iso-27001-readiness', 'cyber-schaden'],
  'iso-27001-readiness':                 ['nis2-betroffenheit', 'cyber-schaden'],
  'cyber-schaden':                       ['nis2-betroffenheit', 'passwort-check'],
  'passwort-check':                      ['phishing-quiz', 'ki-dsgvo-check'],
  'phishing-quiz':                       ['passwort-check', 'cyber-schaden'],
  'ki-readiness':                        ['ki-dsgvo-check', 'ai-stack-fit'],
  'ki-dsgvo-check':                      ['ki-readiness', 'ai-stack-fit'],
  'ai-stack-fit':                        ['ki-readiness', 'microsoft-365-oder-google-workspace'],
  'm365-migration-kosten':               ['microsoft-365-oder-google-workspace', 'iso-27001-readiness'],
  'microsoft-365-oder-google-workspace': ['m365-migration-kosten', 'ai-stack-fit'],
  'website-check':                       ['automatisierung-roi', 'm365-migration-kosten'],
  'automatisierung-roi':                 ['website-check', 'ki-readiness'],
}

function slugOf(href: string): string {
  return href.split('/').filter(Boolean).pop() ?? ''
}

/** Liefert bis zu `count` thematisch passende andere Tools zum gegebenen Pfad. */
export function relatedTools(href: string, count = 2): Tool[] {
  const slug = slugOf(href)
  const wanted = RELATED[slug] ?? []
  const bySlug = new Map(TOOLS.map(t => [slugOf(t.href), t]))
  const picks = wanted.map(s => bySlug.get(s)).filter((t): t is Tool => Boolean(t))
  if (picks.length < count) {
    for (const t of TOOLS) {
      if (picks.length >= count) break
      if (slugOf(t.href) !== slug && !picks.includes(t)) picks.push(t)
    }
  }
  return picks.slice(0, count)
}
