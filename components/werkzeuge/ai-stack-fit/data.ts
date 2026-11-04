/* AI Techstack Configurator · data + scoring (typed) */

export type StrategyId = "ms" | "google" | "best" | "cost" | "eu";
export type SizeId = "micro" | "small" | "mid" | "large" | "xl";
export type RevenueId = "r1" | "r2" | "r3" | "r4" | "r5";
export type EcoId =
  | "ms365"
  | "google"
  | "atlassian"
  | "salesforce"
  | "sap"
  | "aws"
  | "apple"
  | "oss";
export type FamilyId =
  | "ms"
  | "google"
  | "atlassian"
  | "salesforce"
  | "sap"
  | "aws"
  | "apple"
  | "oss";
export type CategoryId =
  | "office"
  | "ai"
  | "comm"
  | "knowledge"
  | "crm"
  | "erp"
  | "data"
  | "automation"
  | "dev"
  | "marketing"
  | "support"
  | "cloud";
export type Mode = "greenfield" | "audit";

export interface Industry {
  id: string;
  label: string;
  code: string;
}
export interface SizeBucket {
  id: SizeId;
  label: string;
  short: string;
  desc: string;
}
export interface Revenue {
  id: RevenueId;
  label: string;
}
export interface Strategy {
  id: StrategyId;
  label: string;
  hint: string;
}
export interface Ecosystem {
  id: EcoId;
  label: string;
  family: FamilyId;
}
export interface Category {
  id: CategoryId;
  n: string;
  label: string;
  short: string;
}
export type SystemFlag = "underdog" | "rising";

export interface System {
  id: string;
  cat: CategoryId;
  label: string;
  family: FamilyId;
  sizes: SizeId[];
  strat: StrategyId[];
  base: number;
  ai: number;
  eu: number;
  cost: number;
  note: string;
  flag?: SystemFlag;
}

export interface Profile {
  mode: Mode | null;
  size: SizeId | null;
  industry: string | null;
  revenue: RevenueId | null;
  ecosystems: EcoId[];
  strategy: StrategyId | null;
}

export const DEFAULT_PROFILE: Profile = {
  mode: null,
  size: null,
  industry: null,
  revenue: null,
  ecosystems: [],
  strategy: null,
};

export const INDUSTRIES: Industry[] = [
  { id: "industrie", label: "Industrie / Maschinenbau", code: "C" },
  { id: "handel", label: "Handel / E-Commerce", code: "G" },
  { id: "finanz", label: "Finanz / Versicherung", code: "K" },
  { id: "gesundheit", label: "Gesundheit / Pharma", code: "Q" },
  { id: "professional", label: "Beratung / Services", code: "M" },
  { id: "software", label: "Software / IT", code: "J" },
  { id: "logistik", label: "Logistik / Transport", code: "H" },
  { id: "bau", label: "Bauwesen / Immobilien", code: "F" },
  { id: "oeffentlich", label: "Öffentlicher Sektor", code: "O" },
];

export const SIZES: SizeBucket[] = [
  { id: "micro", label: "1-10 MA", short: "S", desc: "Solo / Micro" },
  { id: "small", label: "11-50 MA", short: "M", desc: "Kleinunternehmen" },
  { id: "mid", label: "51-250 MA", short: "L", desc: "Mittelstand" },
  { id: "large", label: "251-1.000 MA", short: "XL", desc: "Größerer Mittelstand" },
  { id: "xl", label: "1.000+ MA", short: "XXL", desc: "Großunternehmen" },
];

export const REVENUES: Revenue[] = [
  { id: "r1", label: "< 1 Mio €" },
  { id: "r2", label: "1-10 Mio €" },
  { id: "r3", label: "10-50 Mio €" },
  { id: "r4", label: "50-250 Mio €" },
  { id: "r5", label: "> 250 Mio €" },
];

export const STRATEGIES: Strategy[] = [
  { id: "ms", label: "Microsoft-zentriert", hint: "M365 + Azure + Copilot als Backbone" },
  { id: "google", label: "Google-zentriert", hint: "Workspace + GCP + Gemini" },
  { id: "best", label: "Best-of-Breed", hint: "Beste Tools je Kategorie, hohe Integrationslast" },
  { id: "cost", label: "Kosten-optimiert", hint: "OSS und schlanke SaaS bevorzugt" },
  { id: "eu", label: "EU-souverän", hint: "DSGVO-first, EU-Hosting, AI-Act-ready" },
];

export const ECOSYSTEMS: Ecosystem[] = [
  { id: "ms365", label: "Microsoft 365", family: "ms" },
  { id: "google", label: "Google Workspace", family: "google" },
  { id: "atlassian", label: "Atlassian", family: "atlassian" },
  { id: "salesforce", label: "Salesforce", family: "salesforce" },
  { id: "sap", label: "SAP", family: "sap" },
  { id: "aws", label: "AWS", family: "aws" },
  { id: "apple", label: "Apple Business", family: "apple" },
  { id: "oss", label: "Open Source / Linux", family: "oss" },
];

export const CATEGORIES: Category[] = [
  { id: "office", n: "01", label: "Office & Produktivität", short: "Office" },
  { id: "ai", n: "02", label: "AI-Assistent", short: "AI" },
  { id: "comm", n: "03", label: "Kommunikation", short: "Comm" },
  { id: "knowledge", n: "04", label: "Wissensbasis", short: "Knowledge" },
  { id: "crm", n: "05", label: "CRM", short: "CRM" },
  { id: "erp", n: "06", label: "ERP", short: "ERP" },
  { id: "data", n: "07", label: "Daten / Warehouse", short: "Data" },
  { id: "automation", n: "08", label: "Workflow Automation", short: "Automation" },
  { id: "dev", n: "09", label: "Developer Tools", short: "Dev" },
  { id: "marketing", n: "10", label: "Marketing Automation", short: "Marketing" },
  { id: "support", n: "11", label: "Customer Support", short: "Support" },
  { id: "cloud", n: "12", label: "Cloud-Infrastruktur", short: "Cloud" },
];

// SYSTEMS array is generated from data/data.csv — see scripts/gen-data.mjs.
// Refresh workflow: edit data/data.csv (or update REFRESH_DATE), run `pnpm gen:data`.
import { SYSTEMS, DATA_REFRESH_DATE, DATA_REFRESH_LABEL } from "./systems.generated";
export { SYSTEMS, DATA_REFRESH_DATE, DATA_REFRESH_LABEL };
/* ── Scoring ─────────────────────────────────────────────────── */

export interface ScoreFactor {
  label: string;
  delta: number;
  reason?: string;
}

export interface Scored {
  sys: System;
  score: number;
  reasons: string[];
  breakdown: ScoreFactor[];
}

export function scoreSystem(
  sys: System,
  profile: Profile,
): { score: number; reasons: string[]; breakdown: ScoreFactor[] } {
  let s = sys.base;
  const reasons: string[] = [];
  const breakdown: ScoreFactor[] = [
    { label: "Basis-Score", delta: sys.base, reason: `Marktposition + Reife (${sys.label})` },
  ];

  if (profile.strategy && sys.strat.includes(profile.strategy)) {
    s += 12;
    reasons.push("passt zur Strategie");
    breakdown.push({ label: "Strategie-Fit", delta: 12, reason: "matcht Ihre Strategie-Wahl" });
  }

  if (profile.size && sys.sizes.includes(profile.size)) {
    s += 10;
    breakdown.push({ label: "Größenfit", delta: 10, reason: "passt zu Ihrer MA-Zahl" });
  } else if (profile.size) {
    s -= 8;
    reasons.push("Größenfit schwach");
    breakdown.push({ label: "Größenfit", delta: -8, reason: "nicht für Ihre MA-Zahl ausgelegt" });
  }

  const eco = profile.ecosystems ?? [];
  const familyToEco: Partial<Record<FamilyId, EcoId>> = {
    ms: "ms365",
    google: "google",
    atlassian: "atlassian",
    salesforce: "salesforce",
    sap: "sap",
    aws: "aws",
    apple: "apple",
  };
  const ecoMatch = familyToEco[sys.family] && eco.includes(familyToEco[sys.family]!);
  if (ecoMatch) {
    s += 18;
    reasons.push("synergiert mit bestehendem Stack");
    breakdown.push({
      label: "Ökosystem-Synergie",
      delta: 18,
      reason: "läuft auf bestehendem Stack auf",
    });
  }

  if (profile.strategy === "ms" && sys.cat === "ai" && sys.family !== "ms") {
    s -= 14;
    reasons.push("bricht aus dem MS-Backbone aus");
    breakdown.push({
      label: "Backbone-Bruch",
      delta: -14,
      reason: "AI-Tool außerhalb des MS-Universums",
    });
  }
  if (profile.strategy === "google" && sys.cat === "ai" && sys.family !== "google" && sys.id !== "claude") {
    s -= 8;
    breakdown.push({
      label: "Backbone-Bruch",
      delta: -8,
      reason: "AI-Tool außerhalb des Google-Universums",
    });
  }

  if (profile.strategy === "eu") {
    const euDelta = Math.round((sys.eu - 60) / 4);
    if (euDelta !== 0) {
      s += euDelta;
      breakdown.push({
        label: "EU-Souveränität",
        delta: euDelta,
        reason: `EU-Score ${sys.eu}/100 vs Strategie-Schwelle 60`,
      });
    }
    if (sys.eu < 55) reasons.push("DSGVO-Risiko");
  }

  if (profile.strategy === "cost") {
    const costDelta = -(sys.cost - 2) * 4;
    if (costDelta !== 0) {
      s += costDelta;
      breakdown.push({
        label: "Kosten-Optim",
        delta: costDelta,
        reason: `Kostenstufe ${sys.cost}/5`,
      });
    }
  }

  if (profile.industry === "finanz" && sys.eu < 60) {
    s -= 5;
    breakdown.push({ label: "Branche · Finanz", delta: -5, reason: "EU-Anforderung im Finanzsektor" });
  }
  if (profile.industry === "oeffentlich" && sys.eu < 70) {
    s -= 8;
    breakdown.push({
      label: "Branche · Öff. Sektor",
      delta: -8,
      reason: "EVB-IT / DSGVO im öff. Sektor",
    });
  }
  if (profile.industry === "software" && sys.id === "slack") {
    s += 5;
    breakdown.push({ label: "Branche · Software", delta: 5, reason: "Slack ist Tech-Standard" });
  }
  if (profile.industry === "software" && sys.id === "ghcopilot") {
    s += 4;
    breakdown.push({ label: "Branche · Software", delta: 4, reason: "GitHub Copilot Branchen-Default" });
  }
  if (profile.industry === "industrie" && sys.id === "sap") {
    s += 5;
    breakdown.push({ label: "Branche · Industrie", delta: 5, reason: "SAP quasi-Standard im Maschinenbau" });
  }
  if (profile.industry === "handel" && sys.id === "hubspot") {
    s += 4;
    breakdown.push({
      label: "Branche · Handel",
      delta: 4,
      reason: "HubSpot stark im Handel/E-Commerce",
    });
  }
  if (profile.industry === "gesundheit" && sys.eu < 70) {
    s -= 6;
    breakdown.push({
      label: "Branche · Gesundheit",
      delta: -6,
      reason: "Patientendaten brauchen EU-Hosting",
    });
  }
  if (profile.industry === "logistik" && sys.id === "n8n") {
    s += 3;
    breakdown.push({
      label: "Branche · Logistik",
      delta: 3,
      reason: "Workflow-Automation oft entscheidend",
    });
  }

  const revIdx = profile.revenue ? ["r1", "r2", "r3", "r4", "r5"].indexOf(profile.revenue) : -1;
  if ((sys.id === "sap" || sys.id === "salesforce" || sys.id === "marketo") && revIdx >= 0 && revIdx < 3) {
    s -= 12;
    breakdown.push({
      label: "Umsatz-Cap",
      delta: -12,
      reason: "Lizenzkosten amortisieren sich erst ab >50 Mio €",
    });
  }
  if (sys.id === "pipedrive" && revIdx > 2) {
    s -= 10;
    breakdown.push({
      label: "Umsatz-Cap",
      delta: -10,
      reason: "Pipedrive limitiert ab >50 Mio €",
    });
  }

  if (profile.mode === "greenfield" && (sys.id === "notion" || sys.id === "hubspot" || sys.id === "n8n")) {
    s += 4;
    breakdown.push({
      label: "Greenfield-Bonus",
      delta: 4,
      reason: "schneller Rollout ohne Legacy",
    });
  }

  const raw = s;
  s = Math.max(8, Math.min(98, Math.round(s)));
  if (raw !== s) {
    breakdown.push({
      label: "Score-Clamp",
      delta: s - raw,
      reason: "Score auf 8-98 begrenzt",
    });
  }
  return { score: s, reasons, breakdown };
}

export function rankCategory(catId: CategoryId, profile: Profile): Scored[] {
  return SYSTEMS.filter((x) => x.cat === catId)
    .map((sys) => {
      const r = scoreSystem(sys, profile);
      return { sys, score: r.score, reasons: r.reasons, breakdown: r.breakdown };
    })
    .sort((a, b) => b.score - a.score);
}

/* ── Cost mapping (€/Seat/Monat, indikativ für DACH-KMU) ──────── */

export const SYSTEM_PRICE_HINTS: Partial<Record<string, string>> = {
  m365: "ca. 23-40 €/User/Mo (Business Standard bis E5)",
  gworkspace: "ca. 12-23 €/User/Mo (Business Starter bis Plus)",
  libre: "0 € (OSS) + Hosting/Wartung",
  copilot: "30 €/User/Mo zusätzlich zu M365",
  chatgpt: "ca. 25 €/User/Mo (Enterprise per-quote)",
  claude: "ca. 25 €/User/Mo (Enterprise per-quote)",
  gemini: "ca. 22 €/User/Mo zusätzlich zu Workspace",
  mistral: "ca. 18 €/User/Mo (Le Chat Enterprise)",
  teams: "in M365 inklusive",
  slack: "ca. 8-13 €/User/Mo",
  gchat: "in Workspace inklusive",
  sharepoint: "in M365 inklusive",
  confluence: "ca. 5-10 €/User/Mo",
  notion: "ca. 8-15 €/User/Mo",
  outline: "0 € (selfhosted) + Server",
  hubspot: "ab ~50 €/User/Mo (Sales Hub Pro)",
  salesforce: "ab ~150 €/User/Mo",
  dynamicscrm: "ab ~95 €/User/Mo",
  pipedrive: "ab ~25 €/User/Mo",
  sap: "Lizenzen + Implementierung 6-stellig+",
  dynamics: "ab ~60 €/User/Mo (Business Central)",
  odoo: "ab ~10 €/User/Mo + Implementation",
  fabric: "ab ~250 €/Capacity/Mo",
  bigquery: "Pay-per-query, ab ~5 €/TB",
  snowflake: "Compute + Storage, ab 2-stellig pro User/Mo",
  databricks: "Pay-per-DBU, ab 4-stellig pro Monat",
  powerauto: "in M365 oft inklusive",
  n8n: "0 € (selfhosted) oder ab ~20 €/User/Mo",
  make: "ab ~9 €/User/Mo",
  zapier: "ab ~20 €/User/Mo (per-task)",
  ghcopilot: "ca. 19 €/User/Mo (Copilot Business)",
  gitlab: "ab ~25 €/User/Mo (Premium)",
  cursor: "ca. 18 €/User/Mo",
  hsmkt: "ab ~800 €/Mo (Marketing Hub Pro)",
  marketo: "5-stellig pro Jahr",
  customerio: "ab ~150 €/Mo",
  brevo: "ab ~25 €/Mo",
  zendesk: "ab ~50 €/Agent/Mo",
  intercom: "ab ~85 €/Seat/Mo + Fin pro Resolution",
  freshdesk: "ab ~15 €/Agent/Mo",
  hsservice: "ab ~50 €/User/Mo",
  azure: "Pay-per-use, breit konfigurierbar",
  aws: "Pay-per-use, breit konfigurierbar",
  gcp: "Pay-per-use, breit konfigurierbar",
  hetzner: "ab ~5 €/Server/Mo",
};

/* ── Next steps per system (top 20 picks) ────────────────────── */

export const NEXT_STEPS: Partial<Record<string, [string, string, string]>> = {
  m365: [
    "M365 Business Premium oder E5 Trial starten (kostenlos 30 Tage)",
    "Pilot mit 10-15 Power-Usern: SharePoint-Strukturen anlegen, Teams-Adoption",
    "Copilot-Lizenz für 5 User dazubuchen, Use-Cases dokumentieren",
  ],
  gworkspace: [
    "Workspace Business Plus Trial (14 Tage) anlegen",
    "Domain-Verifizierung + erste Konten migrieren (Google Migration Tool)",
    "Gemini Enterprise add-on für Pilot-Gruppe aktivieren",
  ],
  copilot: [
    "Voraussetzung prüfen: M365 E3/E5 vorhanden, SharePoint sauber strukturiert",
    "Copilot-Lizenz für 5-10 IT-/Power-User buchen, Hands-on-Workshop ansetzen",
    "ROI-Tracking: 4 Wochen messen wer was nutzt, dann Ausweitung beschließen",
  ],
  chatgpt: [
    "Enterprise-Plan anfragen (per Sales-Quote, kein Self-Service)",
    "EU-Datenresidenz im Vertrag ausverhandeln, AVV unterschreiben",
    "Custom GPTs für 3-5 wiederkehrende Aufgaben aufsetzen",
  ],
  claude: [
    "Claude for Work Plan anfragen, EU-Datenresidenz klären",
    "Pilot mit Long-Form/Code-Use-Cases (Vertragsanalyse, Code-Review)",
    "MCP-Integration zu eigenen Tools/Daten evaluieren",
  ],
  gemini: [
    "Workspace-Domain auf Gemini Enterprise upgraden",
    "Gemini in Docs/Sheets/Gmail aktivieren, Adoption beobachten",
    "NotebookLM für Wissensbasis-Suche pilotieren",
  ],
  mistral: [
    "Le Chat Enterprise Pilot starten (EU-Hosted, AI-Act-konform)",
    "Function-Calling + RAG mit eigenen Dokumenten testen",
    "Bei Erfolg: Modell-Tier ggf. selfhost (für Souveränitäts-Strategie)",
  ],
  hubspot: [
    "HubSpot Sales Hub Pro Trial (14 Tage) starten",
    "Bestehende Kontakte CSV-Import + Deal-Stages konfigurieren",
    "Marketing Hub dazubuchen wenn Lead-Gen-Bedarf vorhanden",
  ],
  salesforce: [
    "Salesforce Pro Suite oder Enterprise Edition anfragen",
    "Implementierungspartner einbinden (4-8 Wochen Setup-Zeit)",
    "Einstein AI / Agentforce für strukturierte Sales-Cases evaluieren",
  ],
  dynamicscrm: [
    "Dynamics 365 Sales Trial einrichten (mit M365 verknüpfen)",
    "Power Platform Connectoren zu bestehenden Systemen prüfen",
    "Copilot for Sales-Lizenz testen (Lead-Scoring, Email-Drafts)",
  ],
  sap: [
    "Bestandsaufnahme der aktuellen ERP-Landschaft + Migrations-Scope",
    "SAP-Beratungspartner einbinden (Migration ist 18-36 Monate)",
    "Joule (SAP-AI) Roadmap im Vertrag festhalten",
  ],
  dynamics: [
    "Business Central Trial mit SMB-Implementierungspartner",
    "Datenmodell + Workflows gegen Ist-Prozesse prüfen",
    "Integration mit M365 + Copilot from Day 1 mitdenken",
  ],
  odoo: [
    "Odoo Online Trial für Module Sales/Inventory/Accounting",
    "EU-Hosting vs Selfhost-Entscheidung treffen (Datensensitivität)",
    "Module sukzessiv aktivieren, nicht alles auf einmal",
  ],
  notion: [
    "Notion Plus Plan für 5-10 Power-User starten",
    "Wiki + Projektsystem aufsetzen, Templates definieren",
    "Notion AI add-on aktivieren, Use-Cases sammeln",
  ],
  sharepoint: [
    "Sharepoint-Site-Architektur planen (Hub + Sites pro Bereich)",
    "Datenklassifizierung + Berechtigungskonzept definieren",
    "Copilot-Indizierung sicherstellen: Inhalte tagged + permissioned",
  ],
  confluence: [
    "Confluence Standard für Team-Wiki starten",
    "Atlassian Intelligence aktivieren (in Premium-Tier)",
    "Bei M365-Stack: SharePoint als Primärspeicher mitdenken",
  ],
  ghcopilot: [
    "Copilot Business für 5-10 Devs (kostenloser 30-Tage-Trial)",
    "Custom Instructions + Repo-Indexing aufsetzen",
    "Code-Review-Disziplin etablieren: AI-generierter Code wird reviewt",
  ],
  cursor: [
    "Cursor Pro für 3-5 Senior-Devs als ergänzendes Tool zu Copilot",
    "Workspace-Indexing + Custom Rules definieren",
    "Bei Erfolg: Lizenz-Pool ausweiten oder Cursor Business",
  ],
  n8n: [
    "n8n Cloud Trial oder Selfhost auf Hetzner-VM",
    "5-10 wiederkehrende Workflows automatisieren (Lead-Routing, Reports)",
    "Bei Skalierung: Selfhost mit Worker-Setup für Last-Trennung",
  ],
  fabric: [
    "Fabric Capacity F2/F4 als Pilot starten",
    "Lakehouse-Architektur mit OneLake aufsetzen, ETL planen",
    "Power BI als Frontend nahtlos einbinden",
  ],
  azure: [
    "Azure Subscription mit FinOps-Tagging anlegen",
    "Cost-Management + Budgets/Alerts konfigurieren",
    "Hub-and-Spoke-Netzwerk für saubere Trennung Workloads",
  ],
  aws: [
    "AWS Organization mit Control Tower aufsetzen",
    "Cost Explorer + Reserved Instances für stabile Workloads",
    "Bedrock für AI-Use-Cases evaluieren (EU-Region!)",
  ],
};

/* ── Industry insights (banner + frictions) ──────────────────── */

export interface IndustryInsight {
  banner: string;
  frictionPatterns: Array<(picks: Partial<Record<CategoryId, System>>) => Friction | null>;
}

export const INDUSTRY_INSIGHTS: Partial<Record<string, { banner: string; bannerNote: string }>> = {
  industrie: {
    banner: "Maschinenbau / Industrie",
    bannerNote:
      "SAP ist quasi-Standard im ERP. AI-Frage ist meistens: Copilot drauf oder EU-souveräne Alternative wie Mistral. PLM/MES bleibt Insellösung.",
  },
  handel: {
    banner: "Handel / E-Commerce",
    bannerNote:
      "Fokus auf CRM-Marketing-Symbiose: HubSpot oder Salesforce + Marketing-Automation. Inventory + Order-Management oft separater Stack.",
  },
  finanz: {
    banner: "Finanz / Versicherung",
    bannerNote:
      "Compliance + EU-Hosting sind nicht verhandelbar. BaFin-relevante Daten brauchen on-prem oder zertifizierte EU-Cloud. AI-Use-Cases werden vor Rollout durch Compliance.",
  },
  gesundheit: {
    banner: "Gesundheit / Pharma",
    bannerNote:
      "Patientendaten = besondere Kategorie. EU-Hosting Pflicht. AI-Tools nur mit AVV + Auftragsverarbeitungs-Zertifikat. Bevorzugt Mistral/Aleph Alpha über US-Hyperscaler.",
  },
  professional: {
    banner: "Beratung / Services",
    bannerNote:
      "Time-to-Value zählt: HubSpot/Notion/n8n schnell live. M365 oder Workspace meist gesetzt. Differenzierung über AI-Layer-Wahl (Co-Pilot vs ChatGPT vs Claude).",
  },
  software: {
    banner: "Software / IT",
    bannerNote:
      "GitHub + Copilot + Slack ist der DACH-Tech-Standard. Cursor ergänzt für Senior-Devs. EU-Hosting meist sekundär, AI-Reife primär.",
  },
  logistik: {
    banner: "Logistik / Transport",
    bannerNote:
      "Workflow-Automation ist oft das versteckte Kern-Tooling: n8n oder Power Automate für Schnittstellen. ERP meistens SAP oder Dynamics, je nach Größe.",
  },
  bau: {
    banner: "Bauwesen / Immobilien",
    bannerNote:
      "Mobile-First in der Ausführung, ERP/CRM-Light im Backoffice. Bauspezifische Tools (PlanRadar, Capmo) bleiben Sonderlösung neben dem AI-Stack.",
  },
  oeffentlich: {
    banner: "Öffentlicher Sektor",
    bannerNote:
      "EVB-IT-Verträge + DSGVO + AI-Act = SaaS ohne EU-Hosting ist No-Go. Open-Source und EU-Anbieter (Mistral, IONOS, Hetzner) bevorzugt. Beschaffung dauert lange.",
  },
};

export function findIndustryFrictions(
  profile: Profile,
  picksByCat: Partial<Record<CategoryId, System>>,
): Friction[] {
  const out: Friction[] = [];
  const office = picksByCat.office;
  const ai = picksByCat.ai;
  const cloud = picksByCat.cloud;

  if (profile.industry === "oeffentlich") {
    const nonEu = Object.values(picksByCat).filter(
      (s): s is System => Boolean(s) && s!.eu < 70,
    );
    if (nonEu.length > 0) {
      out.push({
        severity: "warn",
        title: `${nonEu.length} System${nonEu.length === 1 ? "" : "e"} nicht beschaffungsfähig`,
        body: `Im öffentlichen Sektor scheitert ${nonEu.map((s) => s.label).join(", ")} an EVB-IT/AI-Act-Anforderungen. Mistral, IONOS Cloud oder Hetzner als Ersatz prüfen.`,
      });
    }
  }
  if (profile.industry === "gesundheit") {
    if (ai && ai.eu < 70) {
      out.push({
        severity: "warn",
        title: "AI-Tool ohne EU-Patientendaten-Konformität",
        body: `${ai.label} hat EU-Score ${ai.eu}/100. Patientendaten brauchen besondere Kategorie nach DSGVO Art. 9 - das geht nur mit AVV + verifiziertem EU-Hosting. Mistral oder Aleph Alpha prüfen.`,
      });
    }
  }
  if (profile.industry === "industrie" && office?.family === "ms" && ai?.id === "claude") {
    out.push({
      severity: "info",
      title: "Claude im Maschinenbau ist eine bewusste Wahl",
      body: "Im SAP/M365-dominierten Industrie-Stack ist Copilot der Default-Pfad. Claude lohnt sich nur für spezifische Long-Form/Code-Cases (z.B. Vertragsanalyse, Service-Manuals) - sonst bricht es den Stack.",
    });
  }
  if (profile.industry === "finanz" && cloud && cloud.eu < 65) {
    out.push({
      severity: "warn",
      title: "Cloud-Region kritisch für Finanz-Compliance",
      body: `${cloud.label} mit EU-Score ${cloud.eu}/100 reicht für BaFin-relevante Workloads nicht. Azure Germany / IONOS Cloud / Hetzner für regulierte Daten.`,
    });
  }
  if (profile.industry === "handel" && picksByCat.crm && picksByCat.marketing) {
    if (picksByCat.crm.family !== picksByCat.marketing.family && picksByCat.marketing.id !== "hsmkt") {
      out.push({
        severity: "info",
        title: "CRM und Marketing aus unterschiedlichen Welten",
        body: `${picksByCat.crm.label} (CRM) + ${picksByCat.marketing.label} (Marketing) brauchen aktive Datensynchronisation. Im Handel ist konsolidierter Stack (HubSpot all-in-one) oft schneller live.`,
      });
    }
  }
  return out;
}

export interface SynergyResult {
  synergy: number;
  dominant: FamilyId;
  distribution: Partial<Record<FamilyId, number>>;
}

export function computeSynergy(profile: Profile): SynergyResult {
  const picks = CATEGORIES.map((c) => rankCategory(c.id, profile)[0]).filter(Boolean) as Scored[];
  const families = picks.map((p) => p.sys.family);
  const counts: Partial<Record<FamilyId, number>> = {};
  for (const f of families) counts[f] = (counts[f] ?? 0) + 1;
  const sorted = Object.entries(counts).sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0));
  const dominant = (sorted[0]?.[0] as FamilyId) ?? "oss";
  const ratio = (sorted[0]?.[1] ?? 0) / Math.max(1, families.length);
  const synergy = Math.max(40, Math.min(96, Math.round(50 + (ratio - 0.3) * 90)));
  return { synergy, dominant, distribution: counts };
}

export function computeMonthlyCost(profile: Profile): number {
  const picks = CATEGORIES.map((c) => rankCategory(c.id, profile)[0]).filter(Boolean) as Scored[];
  const sizeMultiplier: Record<SizeId, number> = {
    micro: 8,
    small: 30,
    mid: 130,
    large: 500,
    xl: 1500,
  };
  const mult = profile.size ? sizeMultiplier[profile.size] : 100;
  const baseCostPerSeat = picks.reduce((sum, s) => sum + s.sys.cost * 4, 0);
  return Math.round((baseCostPerSeat * mult) / 100) * 100;
}

export function computeAIReadiness(profile: Profile): number {
  const picks = CATEGORIES.map((c) => rankCategory(c.id, profile)[0]).filter(Boolean) as Scored[];
  if (picks.length === 0) return 0;
  return Math.round(picks.reduce((s, p) => s + p.sys.ai, 0) / picks.length);
}

export interface Friction {
  severity: "warn" | "info" | "ok";
  title: string;
  body: string;
}

export function findFrictions(profile: Profile): Friction[] {
  const frictions: Friction[] = [];
  const picksByCat: Partial<Record<CategoryId, System>> = {};
  for (const c of CATEGORIES) {
    const top = rankCategory(c.id, profile)[0];
    if (top) picksByCat[c.id] = top.sys;
  }
  const office = picksByCat.office;
  const ai = picksByCat.ai;
  const knowledge = picksByCat.knowledge;
  const crm = picksByCat.crm;
  const marketing = picksByCat.marketing;
  const erp = picksByCat.erp;

  if (office?.family === "ms" && ai && ai.family !== "ms") {
    frictions.push({
      severity: "warn",
      title: "AI bricht aus dem Office-Backbone",
      body: `${ai.label} setzt nicht auf Ihrem ${office.label} auf. Copilot würde Ihre SharePoint-Inhalte direkt finden - ${ai.label} braucht eine separate Indexierung.`,
    });
  }
  if (office?.family === "google" && ai && ai.family !== "google") {
    frictions.push({
      severity: "warn",
      title: "Gemini wäre die natürlichere Wahl",
      body: "Ihr Office-Layer ist Google. Ein Wechsel zu Gemini erspart die zweite Identity-Schicht.",
    });
  }
  if (office?.family === "ms" && knowledge && knowledge.family !== "ms" && knowledge.family !== "atlassian") {
    frictions.push({
      severity: "info",
      title: "Wissensbasis sitzt außerhalb von M365",
      body: `${knowledge.label} ist gut, aber Copilot indexiert es nicht out-of-the-box. Prüfen Sie SharePoint als Primärspeicher mit ${knowledge.label} als Layer obenauf.`,
    });
  }
  if (crm?.id === "salesforce" && marketing?.id === "hsmkt") {
    frictions.push({
      severity: "warn",
      title: "Salesforce + HubSpot Marketing ist redundant",
      body: "Beide Systeme wollen die Kundendaten besitzen. Entscheiden Sie sich vor dem Kauf, oder kalkulieren Sie 6 Monate Datenmigration ein.",
    });
  }
  if (profile.strategy === "eu") {
    const risky = Object.values(picksByCat).filter((s): s is System => Boolean(s) && s!.eu < 60);
    if (risky.length) {
      frictions.push({
        severity: "warn",
        title: `${risky.length} System${risky.length === 1 ? "" : "e"} mit EU-Souveränitäts-Risiko`,
        body: `${risky.map((s) => s.label).join(", ")} haben begrenzte EU-Hosting-Optionen. Bei AI-Act-Pflicht ist das ein Show-Stopper.`,
      });
    }
  }
  const revIdx = profile.revenue ? ["r1", "r2", "r3", "r4", "r5"].indexOf(profile.revenue) : -1;
  if (erp?.id === "sap" && revIdx >= 0 && revIdx < 3) {
    frictions.push({
      severity: "warn",
      title: "SAP ist überdimensioniert",
      body: "Bei Ihrem Umsatz amortisiert sich SAP S/4HANA in der Regel nicht. Dynamics oder Odoo decken denselben Funktionsumfang zu einem Bruchteil ab.",
    });
  }
  // Industry-specific frictions (added on top of cross-cutting ones)
  const industrySpecific = findIndustryFrictions(profile, picksByCat);
  frictions.push(...industrySpecific);

  if (frictions.length === 0) {
    frictions.push({
      severity: "ok",
      title: "Stack ist konsistent",
      body: "Alle Empfehlungen synergieren miteinander. Keine offensichtlichen Brüche.",
    });
  }
  return frictions;
}

export const FAMILY_LABEL: Record<FamilyId, string> = {
  ms: "Microsoft",
  google: "Google",
  oss: "Best-of-Breed",
  atlassian: "Atlassian",
  salesforce: "Salesforce",
  sap: "SAP",
  aws: "AWS",
  apple: "Apple",
};

export const FAMILY_SHORT: Record<FamilyId, string> = {
  ms: "MS",
  google: "GOOGLE",
  atlassian: "ATL",
  salesforce: "SFDC",
  sap: "SAP",
  aws: "AWS",
  oss: "OSS / VENDOR-NEUTRAL",
  apple: "APPLE",
};

/* ────────────────────────────────────────────────
 * Tier-D Insights: Sovereignty, Risk, Trade-offs, Peer
 * ──────────────────────────────────────────────── */

const HYPERSCALER_FAMILIES: FamilyId[] = ["ms", "google", "aws"];

const FAMILY_LOCKIN_BIAS: Record<FamilyId, number> = {
  // 0..100 — wie schwer fällt der Wechsel weg von dieser Familie
  ms: 78,
  google: 70,
  salesforce: 80,
  sap: 88,
  atlassian: 60,
  aws: 65,
  apple: 55,
  oss: 18,
};

export interface SovereigntyResult {
  euCount: number;
  total: number;
  ratio: number; // 0..1
  score: number; // 0..100
  weakest: System[]; // Picks mit eu < 50, sortiert aufsteigend
}

export function computeSovereignty(profile: Profile): SovereigntyResult {
  const picks = CATEGORIES.map((c) => rankCategory(c.id, profile)[0]).filter(Boolean) as Scored[];
  const total = picks.length;
  if (!total) return { euCount: 0, total: 0, ratio: 0, score: 0, weakest: [] };
  const euCount = picks.filter((p) => p.sys.eu >= 70).length;
  const avgEu = picks.reduce((s, p) => s + p.sys.eu, 0) / total;
  const ratio = euCount / total;
  // Score balanciert Anzahl-EU-fähiger Picks und Durchschnittswert
  const score = Math.round(0.55 * avgEu + 0.45 * (ratio * 100));
  const weakest = picks
    .map((p) => p.sys)
    .filter((s) => s.eu < 50)
    .sort((a, b) => a.eu - b.eu);
  return { euCount, total, ratio, score, weakest };
}

export type RiskLevel = "low" | "med" | "high";

export interface RiskProfile {
  vendorLock: RiskLevel;
  hyperscaler: RiskLevel;
  euRisk: RiskLevel;
}

export function computeSystemRisk(sys: System, picks: System[]): RiskProfile {
  const familyShare = picks.filter((p) => p.family === sys.family).length / Math.max(1, picks.length);
  const lockBias = FAMILY_LOCKIN_BIAS[sys.family] ?? 40;
  // Lock-in steigt mit Family-Konzentration im Stack und Family-Bias
  const lockScore = lockBias * 0.6 + familyShare * 100 * 0.4;
  const vendorLock: RiskLevel = lockScore >= 70 ? "high" : lockScore >= 45 ? "med" : "low";

  const isHyper = HYPERSCALER_FAMILIES.includes(sys.family);
  const hyperShare = picks.filter((p) => HYPERSCALER_FAMILIES.includes(p.family)).length /
    Math.max(1, picks.length);
  const hyperscaler: RiskLevel = isHyper && hyperShare >= 0.6
    ? "high"
    : isHyper && hyperShare >= 0.35
      ? "med"
      : isHyper
        ? "low"
        : "low";

  const euRisk: RiskLevel = sys.eu < 50 ? "high" : sys.eu < 70 ? "med" : "low";
  return { vendorLock, hyperscaler, euRisk };
}

export interface Tradeoffs {
  speed: number; // Time-to-Value (hoch = schnell)
  costEff: number; // Kostenwirkung pro Seat (hoch = günstig)
  sovereignty: number; // EU-Score
  lockRisk: number; // 0..100 (hoch = stärker gebunden)
}

export function computeTradeoffs(profile: Profile): Tradeoffs {
  const picks = CATEGORIES.map((c) => rankCategory(c.id, profile)[0]).filter(Boolean) as Scored[];
  if (!picks.length) return { speed: 0, costEff: 0, sovereignty: 0, lockRisk: 0 };
  const sov = computeSovereignty(profile).score;
  const avgCost = picks.reduce((s, p) => s + p.sys.cost, 0) / picks.length; // 1..5
  const costEff = Math.round(100 - (avgCost - 1) * 22); // cost 1 → 100, cost 5 → 12
  const families = picks.map((p) => p.sys.family);
  const counts: Partial<Record<FamilyId, number>> = {};
  for (const f of families) counts[f] = (counts[f] ?? 0) + 1;
  const dominantShare = Math.max(...Object.values(counts).map((v) => v ?? 0)) / picks.length;
  const dominant = (Object.entries(counts).sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))[0]?.[0] ?? "oss") as FamilyId;
  const lockBias = FAMILY_LOCKIN_BIAS[dominant] ?? 40;
  const lockRisk = Math.round(lockBias * 0.55 + dominantShare * 100 * 0.45);
  // Speed: konsolidierte (high dominantShare) und reife (high avg ai) Stacks rollen schneller
  const avgAi = picks.reduce((s, p) => s + p.sys.ai, 0) / picks.length;
  const speed = Math.round(0.5 * avgAi + 0.5 * dominantShare * 100);
  return {
    speed: Math.max(15, Math.min(98, speed)),
    costEff: Math.max(15, Math.min(98, costEff)),
    sovereignty: Math.max(15, Math.min(98, sov)),
    lockRisk: Math.max(10, Math.min(98, lockRisk)),
  };
}

/* Underdog / Rising-Star Auswahl pro Kategorie — flag-getrieben aus CSV */
export interface FlaggedSystem {
  cat: CategoryId;
  catLabel: string;
  sys: System;
}
export function listFlaggedSystems(): FlaggedSystem[] {
  const out: FlaggedSystem[] = [];
  for (const c of CATEGORIES) {
    const flagged = SYSTEMS.find((s) => s.cat === c.id && s.flag);
    if (flagged) out.push({ cat: c.id, catLabel: c.label, sys: flagged });
  }
  return out;
}

/* Branchen-Peer-Note — kuratierte 1-Liner per Industrie */
export const INDUSTRY_PEER_NOTE: Partial<Record<string, string>> = {
  industrie: "Rund 70% der Maschinenbau-Mittelständler fahren SAP + M365 als Backbone und ergänzen einen einzelnen AI-Layer.",
  handel: "Im Handel kombinieren Marken-DTC-Player typisch HubSpot oder Salesforce mit Klaviyo/Mailchimp - nicht zwei CRMs.",
  finanz: "BaFin-regulierte Häuser starten AI-Use-Cases fast immer mit Azure OpenAI in Frankfurt, nicht mit Anthropic oder OpenAI direkt.",
  gesundheit: "Pharma + Klinik präferieren EU-Modelle (Mistral/Aleph Alpha) über Hyperscaler-LLMs - Kostenaufschlag wird in Kauf genommen.",
  professional: "Beratungshäuser zeigen den höchsten Cursor-/Claude-Anteil im DACH-Sample - Time-to-Value schlägt Compliance-Tiefe.",
  software: "Tech-Firmen stacken mit Abstand am stärksten Best-of-Breed: GitHub + Linear + Slack + Cursor + Claude in der Regel.",
  logistik: "n8n oder Power Automate sind in der Logistik der unterschätzte Hebel - Schnittstellen-Last frisst sonst das AI-Budget.",
  bau: "Bauunternehmen fahren oft 'M365 leicht' im Backoffice und PlanRadar/Capmo on top - der AI-Stack bleibt schlank.",
  oeffentlich: "Öffentliche Auftraggeber starten 2026 fast nur noch mit IONOS / Hetzner / Mistral - US-Hyperscaler scheitern an EVB-IT.",
};
