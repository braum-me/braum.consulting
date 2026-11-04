/**
 * Glossar / Lexikon — Browser-safe Loader via static JSON-Imports.
 * Bei neuem Term: content/glossary/{slug}.json anlegen + Import-Liste
 * hier erweitern.
 */

import gai_governance       from '../content/glossary/ai-governance.json'
import gavv                 from '../content/glossary/avv.json'
import gazure               from '../content/glossary/azure.json'
import gbackup_321          from '../content/glossary/backup-321.json'
import gburnt_amber         from '../content/glossary/burnt-amber.json'
import gchange_management   from '../content/glossary/change-management.json'
import gcim_database        from '../content/glossary/cim-database.json'
import gconditional_access  from '../content/glossary/conditional-access.json'
import gcopilot             from '../content/glossary/copilot.json'
import gcore_web_vitals     from '../content/glossary/core-web-vitals.json'
import gdsgvo               from '../content/glossary/dsgvo.json'
import gentra_id            from '../content/glossary/entra-id.json'
import gfestpreis           from '../content/glossary/festpreis.json'
import gintune              from '../content/glossary/intune.json'
import giso_27001           from '../content/glossary/iso-27001.json'
import gisms                from '../content/glossary/isms.json'
import glagebild            from '../content/glossary/lagebild.json'
import glotsenprinzip       from '../content/glossary/lotsenprinzip.json'
import gm365_tenant         from '../content/glossary/m365-tenant.json'
import gmdm                 from '../content/glossary/mdm.json'
import gmfa                 from '../content/glossary/mfa.json'
import gmicrosoft_defender  from '../content/glossary/microsoft-defender.json'
import gn8n                 from '../content/glossary/n8n.json'
import gnext_js             from '../content/glossary/next-js.json'
import gnis2                from '../content/glossary/nis2.json'
import goperator            from '../content/glossary/operator.json'
import gpasskey             from '../content/glossary/passkey.json'
import gpower_platform      from '../content/glossary/power-platform.json'
import grag                 from '../content/glossary/rag.json'
import gs4hana              from '../content/glossary/s4hana.json'
import gsap_cutover         from '../content/glossary/sap-cutover.json'
import gschatten_it         from '../content/glossary/schatten-it.json'
import gsharepoint_dms      from '../content/glossary/sharepoint-dms.json'
import gsso                 from '../content/glossary/sso.json'
import gtisax               from '../content/glossary/tisax.json'
import guebergabe           from '../content/glossary/uebergabe.json'
import gwarm_ink            from '../content/glossary/warm-ink.json'
import gwordpress           from '../content/glossary/wordpress.json'
import gzero_trust          from '../content/glossary/zero-trust.json'
import gkritis              from '../content/glossary/kritis.json'
import gbcm                 from '../content/glossary/bcm.json'
import gransomware          from '../content/glossary/ransomware.json'
import gphishing            from '../content/glossary/phishing.json'
import giam                 from '../content/glossary/iam.json'
import gcloud_migration     from '../content/glossary/cloud-migration.json'
import glocal_seo           from '../content/glossary/local-seo.json'
import gworkflow_automation from '../content/glossary/workflow-automatisierung.json'
import gki_agenten          from '../content/glossary/ki-agenten.json'
import gcyber_versicherung  from '../content/glossary/cyber-versicherung.json'

export type GlossaryCategory = 'brand' | 'methodik' | 'technik' | 'industrie' | 'recht'

export interface GlossaryTerm {
  slug:        string
  term:        string
  synonyms?:   string[]
  category:    GlossaryCategory
  definition:  string
  longForm?:   string
  related?:    string[]
  source?:     { label: string; url: string }
  /** Optionaler Verweis auf ein passendes Werkzeug (/werkzeuge/…). */
  tool?:       { href: string; label: string }
}

export const GLOSSARY: GlossaryTerm[] = [
  gai_governance, gavv, gazure, gbackup_321, gburnt_amber,
  gchange_management, gcim_database, gconditional_access, gcopilot, gcore_web_vitals,
  gdsgvo, gentra_id, gfestpreis, gintune, giso_27001,
  gisms, glagebild, glotsenprinzip, gm365_tenant, gmdm,
  gmfa, gmicrosoft_defender, gn8n, gnext_js, gnis2,
  goperator, gpasskey, gpower_platform, grag, gs4hana,
  gsap_cutover, gschatten_it, gsharepoint_dms, gsso, gtisax,
  guebergabe, gwarm_ink, gwordpress, gzero_trust, gkritis,
  gbcm, gransomware, gphishing, giam, gcloud_migration,
  glocal_seo, gworkflow_automation, gki_agenten, gcyber_versicherung,
] as GlossaryTerm[]

/* ── Helpers ──────────────────────────────────────────────────────── */

export function getAllTerms(): GlossaryTerm[] {
  return [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term, 'de'))
}

export function getTerm(slug: string): GlossaryTerm | undefined {
  return GLOSSARY.find(t => t.slug === slug)
}

export function getTermSlugs(): string[] {
  return GLOSSARY.map(t => t.slug)
}

/* ── Auto-Highlight Match-Finder ──────────────────────────────────── */

export interface TermMatch {
  term:  GlossaryTerm
  match: string
  start: number
  end:   number
}

export function findMatches(text: string): TermMatch[] {
  if (!text) return []
  const matches: TermMatch[] = []

  const sortedTerms = [...GLOSSARY].sort((a, b) => {
    const aLen = Math.max(a.term.length, ...(a.synonyms?.map(s => s.length) ?? []))
    const bLen = Math.max(b.term.length, ...(b.synonyms?.map(s => s.length) ?? []))
    return bLen - aLen
  })

  const taken: Array<[number, number]> = []
  function overlaps(s: number, e: number): boolean {
    return taken.some(([ts, te]) => !(e <= ts || s >= te))
  }

  for (const t of sortedTerms) {
    const variants = [t.term, ...(t.synonyms ?? [])]
    for (const variant of variants) {
      const escaped = variant.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
      const re = new RegExp(`\\b${escaped}\\b`, 'gi')
      let m: RegExpExecArray | null
      while ((m = re.exec(text)) !== null) {
        const start = m.index
        const end   = start + m[0].length
        if (!overlaps(start, end)) {
          matches.push({ term: t, match: m[0], start, end })
          taken.push([start, end])
        }
      }
    }
  }

  return matches.sort((a, b) => a.start - b.start)
}
