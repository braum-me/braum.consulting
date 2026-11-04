/* eslint-disable */
/**
 * AI-Stack-Fit · System catalogue (auto-generated)
 *
 * Source: data/ai-stack-fit/data.csv · Generated: 2026-06-15
 * Last data refresh: 2026-05-09
 *
 * DO NOT EDIT BY HAND. Edit data/ai-stack-fit/data.csv instead, then run:
 *   pnpm gen:data
 *
 * Score logic, NEXT_STEPS, INDUSTRY_INSIGHTS etc. live in data.ts and are
 * human-curated.
 */

import type { System } from "./data";

/** ISO-date string of the last data refresh (manual operator review). */
export const DATA_REFRESH_DATE = "2026-05-09";

/** Human-friendly label for the data freshness banner in the UI. */
export const DATA_REFRESH_LABEL = "2026-Q2";

export const SYSTEMS: System[] = [
  { id: "m365", cat: "office", label: "Microsoft 365", family: "ms", sizes: ["small", "mid", "large", "xl"], strat: ["ms", "best"], base: 78, ai: 88, eu: 60, cost: 3, note: "Standard im Mittelstand. Copilot setzt darauf auf." },
  { id: "gworkspace", cat: "office", label: "Google Workspace", family: "google", sizes: ["micro", "small", "mid"], strat: ["google", "cost"], base: 70, ai: 82, eu: 55, cost: 2, note: "Schneller Rollout, Gemini nativ integriert." },
  { id: "libre", cat: "office", label: "LibreOffice + OnlyOffice", family: "oss", sizes: ["micro", "small"], strat: ["cost", "eu"], base: 45, ai: 30, eu: 90, cost: 1, note: "Souverän, AI-Anbindung schwach.", flag: "underdog" },
  { id: "copilot", cat: "ai", label: "Microsoft 365 Copilot", family: "ms", sizes: ["small", "mid", "large", "xl"], strat: ["ms"], base: 72, ai: 90, eu: 65, cost: 4, note: "Pflicht, wenn M365 das Backbone ist." },
  { id: "chatgpt", cat: "ai", label: "ChatGPT Enterprise", family: "oss", sizes: ["micro", "small", "mid", "large", "xl"], strat: ["best"], base: 80, ai: 95, eu: 50, cost: 4, note: "Stärkstes Allround-Modell, EU-Standort optional." },
  { id: "claude", cat: "ai", label: "Claude for Work", family: "oss", sizes: ["small", "mid", "large", "xl"], strat: ["best"], base: 78, ai: 94, eu: 55, cost: 3, note: "Stärker bei Long-Form und Code-Reasoning.", flag: "rising" },
  { id: "gemini", cat: "ai", label: "Gemini for Workspace", family: "google", sizes: ["small", "mid", "large"], strat: ["google"], base: 74, ai: 88, eu: 55, cost: 3, note: "Sinnvoll nur mit Google Workspace darunter." },
  { id: "mistral", cat: "ai", label: "Mistral Le Chat Enterprise", family: "oss", sizes: ["mid", "large", "xl"], strat: ["eu", "cost"], base: 65, ai: 80, eu: 95, cost: 2, note: "EU-Hosting, AI-Act-konform, etwas geringere Modelltiefe." },
  { id: "alephalpha", cat: "ai", label: "Aleph Alpha (Pharia)", family: "oss", sizes: ["mid", "large", "xl"], strat: ["eu"], base: 58, ai: 72, eu: 96, cost: 3, note: "DACH-Anbieter mit BSI-C5-zertifiziertem EU-Hosting, FOSS-nahe Enterprise." },
  { id: "teams", cat: "comm", label: "Microsoft Teams", family: "ms", sizes: ["small", "mid", "large", "xl"], strat: ["ms", "best"], base: 75, ai: 80, eu: 60, cost: 2, note: "Mit M365 inklusive. Copilot in Meetings." },
  { id: "slack", cat: "comm", label: "Slack", family: "oss", sizes: ["micro", "small", "mid", "large"], strat: ["best"], base: 72, ai: 75, eu: 50, cost: 3, note: "Tech- und Software-Branche bevorzugt." },
  { id: "gchat", cat: "comm", label: "Google Chat / Meet", family: "google", sizes: ["micro", "small", "mid"], strat: ["google"], base: 60, ai: 70, eu: 55, cost: 1, note: "Reicht, wenn Workspace gesetzt ist." },
  { id: "mattermost", cat: "comm", label: "Mattermost", family: "oss", sizes: ["small", "mid", "large"], strat: ["eu", "cost", "best"], base: 62, ai: 55, eu: 94, cost: 1, note: "OSS-Slack-Alternative, self-hostbar, hoher Souveränitäts-Score.", flag: "underdog" },
  { id: "sharepoint", cat: "knowledge", label: "SharePoint + OneDrive", family: "ms", sizes: ["small", "mid", "large", "xl"], strat: ["ms"], base: 70, ai: 80, eu: 60, cost: 2, note: "Voraussetzung für Copilot-Findbarkeit." },
  { id: "confluence", cat: "knowledge", label: "Confluence", family: "atlassian", sizes: ["small", "mid", "large", "xl"], strat: ["best"], base: 68, ai: 65, eu: 55, cost: 3, note: "Stark wenn Atlassian eh da ist." },
  { id: "notion", cat: "knowledge", label: "Notion", family: "oss", sizes: ["micro", "small", "mid"], strat: ["best", "cost"], base: 72, ai: 80, eu: 50, cost: 2, note: "Schöne UX, eingebaute AI. Limit bei Compliance." },
  { id: "outline", cat: "knowledge", label: "Outline (self-hosted)", family: "oss", sizes: ["micro", "small", "mid"], strat: ["eu", "cost"], base: 55, ai: 55, eu: 90, cost: 1, note: "Souverän hostbar, weniger Polish.", flag: "underdog" },
  { id: "hubspot", cat: "crm", label: "HubSpot", family: "oss", sizes: ["micro", "small", "mid", "large"], strat: ["best", "cost"], base: 78, ai: 85, eu: 55, cost: 3, note: "Schneller Rollout, AI für Sales gut." },
  { id: "salesforce", cat: "crm", label: "Salesforce", family: "salesforce", sizes: ["mid", "large", "xl"], strat: ["best"], base: 75, ai: 88, eu: 55, cost: 5, note: "Standard ab 250 MA. Hohe TCO." },
  { id: "dynamicscrm", cat: "crm", label: "Dynamics 365 Sales", family: "ms", sizes: ["mid", "large", "xl"], strat: ["ms"], base: 70, ai: 82, eu: 60, cost: 4, note: "Logisch, wenn der Rest Microsoft ist." },
  { id: "pipedrive", cat: "crm", label: "Pipedrive", family: "oss", sizes: ["micro", "small"], strat: ["cost"], base: 60, ai: 65, eu: 60, cost: 2, note: "Solo bis ~30 MA." },
  { id: "zoho", cat: "crm", label: "Zoho CRM", family: "oss", sizes: ["small", "mid", "large"], strat: ["cost", "best"], base: 66, ai: 70, eu: 60, cost: 2, note: "Mid-Market-CRM mit eigener Suite, in DACH stark im Mittelstand.", flag: "underdog" },
  { id: "sap", cat: "erp", label: "SAP S/4HANA", family: "sap", sizes: ["large", "xl"], strat: ["best"], base: 72, ai: 75, eu: 75, cost: 5, note: "Quasi-Standard ab 1.000 MA. Migration mehrjährig." },
  { id: "dynamics", cat: "erp", label: "Dynamics 365 Business Central", family: "ms", sizes: ["small", "mid", "large"], strat: ["ms"], base: 70, ai: 78, eu: 60, cost: 3, note: "Schmaler Mittelstand-ERP, Copilot-fähig." },
  { id: "odoo", cat: "erp", label: "Odoo", family: "oss", sizes: ["micro", "small", "mid"], strat: ["cost", "eu"], base: 62, ai: 55, eu: 80, cost: 2, note: "Modular, hostbar, AI rudimentär.", flag: "underdog" },
  { id: "netsuite", cat: "erp", label: "NetSuite", family: "oss", sizes: ["mid", "large"], strat: ["best"], base: 60, ai: 65, eu: 50, cost: 4, note: "USA-lastig, in DACH selten." },
  { id: "fabric", cat: "data", label: "Microsoft Fabric", family: "ms", sizes: ["mid", "large", "xl"], strat: ["ms"], base: 72, ai: 88, eu: 60, cost: 4, note: "Lake + Warehouse + AI in einem, M365-nah." },
  { id: "bigquery", cat: "data", label: "BigQuery + Looker", family: "google", sizes: ["mid", "large", "xl"], strat: ["google", "best"], base: 74, ai: 90, eu: 55, cost: 4, note: "Erstklassig wenn GCP gesetzt ist." },
  { id: "snowflake", cat: "data", label: "Snowflake", family: "oss", sizes: ["mid", "large", "xl"], strat: ["best"], base: 78, ai: 85, eu: 60, cost: 5, note: "Cloud-agnostisch, hohe Datenmengen." },
  { id: "databricks", cat: "data", label: "Databricks", family: "oss", sizes: ["large", "xl"], strat: ["best"], base: 70, ai: 92, eu: 60, cost: 5, note: "AI/ML-zentriert, Data-Engineering schwer." },
  { id: "supabase", cat: "data", label: "Supabase", family: "oss", sizes: ["micro", "small", "mid"], strat: ["best", "cost"], base: 64, ai: 75, eu: 72, cost: 2, note: "Postgres-managed mit Auth/Storage/Realtime, Lite-Stack-Liebling.", flag: "rising" },
  { id: "powerauto", cat: "automation", label: "Power Automate", family: "ms", sizes: ["small", "mid", "large", "xl"], strat: ["ms"], base: 72, ai: 80, eu: 60, cost: 2, note: "Im M365-Lock-in eingeschlossen." },
  { id: "n8n", cat: "automation", label: "n8n (self-hosted)", family: "oss", sizes: ["small", "mid", "large"], strat: ["eu", "cost", "best"], base: 74, ai: 75, eu: 95, cost: 1, note: "OSS, EU-Hosting, sehr flexibel.", flag: "underdog" },
  { id: "make", cat: "automation", label: "Make", family: "oss", sizes: ["micro", "small", "mid"], strat: ["cost", "best"], base: 65, ai: 65, eu: 55, cost: 2, note: "Visueller Builder, schnell für Solo/Klein." },
  { id: "zapier", cat: "automation", label: "Zapier", family: "oss", sizes: ["micro", "small"], strat: ["best"], base: 60, ai: 70, eu: 50, cost: 3, note: "Breit, aber teuer pro Task." },
  { id: "ghcopilot", cat: "dev", label: "GitHub + Copilot", family: "ms", sizes: ["micro", "small", "mid", "large", "xl"], strat: ["ms", "best"], base: 80, ai: 90, eu: 55, cost: 3, note: "Industriestandard. Mit Microsoft synergetisch." },
  { id: "gitlab", cat: "dev", label: "GitLab Duo", family: "oss", sizes: ["small", "mid", "large", "xl"], strat: ["eu", "best"], base: 70, ai: 80, eu: 80, cost: 3, note: "Selfhost-fähig, vollständige DevSecOps-Pipeline." },
  { id: "cursor", cat: "dev", label: "Cursor", family: "oss", sizes: ["micro", "small", "mid"], strat: ["best"], base: 74, ai: 92, eu: 50, cost: 2, note: "AI-Editor, ergänzt GitHub Copilot.", flag: "rising" },
  { id: "hsmkt", cat: "marketing", label: "HubSpot Marketing", family: "oss", sizes: ["small", "mid", "large"], strat: ["best", "cost"], base: 78, ai: 82, eu: 55, cost: 3, note: "Wenn HubSpot CRM gesetzt ist, immer." },
  { id: "marketo", cat: "marketing", label: "Marketo", family: "oss", sizes: ["large", "xl"], strat: ["best"], base: 65, ai: 75, eu: 55, cost: 5, note: "Enterprise-B2B." },
  { id: "customerio", cat: "marketing", label: "Customer.io", family: "oss", sizes: ["small", "mid"], strat: ["best", "cost"], base: 62, ai: 70, eu: 50, cost: 2, note: "Eventbasiert, schlank." },
  { id: "brevo", cat: "marketing", label: "Brevo", family: "oss", sizes: ["micro", "small"], strat: ["cost", "eu"], base: 55, ai: 55, eu: 80, cost: 1, note: "EU-Anbieter, niedrigschwellig." },
  { id: "klaviyo", cat: "marketing", label: "Klaviyo", family: "oss", sizes: ["small", "mid", "large"], strat: ["best"], base: 70, ai: 80, eu: 50, cost: 3, note: "DTC-Marketing-Standard, AI-Segments, US-zentriert.", flag: "rising" },
  { id: "zendesk", cat: "support", label: "Zendesk", family: "oss", sizes: ["mid", "large", "xl"], strat: ["best"], base: 72, ai: 85, eu: 55, cost: 4, note: "Standard im B2C-Support." },
  { id: "intercom", cat: "support", label: "Intercom Fin", family: "oss", sizes: ["small", "mid", "large"], strat: ["best"], base: 70, ai: 90, eu: 50, cost: 4, note: "AI-Agent (Fin) sehr stark, teuer.", flag: "rising" },
  { id: "freshdesk", cat: "support", label: "Freshdesk", family: "oss", sizes: ["small", "mid"], strat: ["cost"], base: 60, ai: 65, eu: 55, cost: 2, note: "Solide, preislich attraktiv." },
  { id: "hsservice", cat: "support", label: "HubSpot Service", family: "oss", sizes: ["small", "mid"], strat: ["best", "cost"], base: 65, ai: 75, eu: 55, cost: 2, note: "Sinnvoll bei HubSpot CRM." },
  { id: "azure", cat: "cloud", label: "Azure", family: "ms", sizes: ["mid", "large", "xl"], strat: ["ms"], base: 78, ai: 88, eu: 65, cost: 4, note: "Wenn Microsoft, dann hier." },
  { id: "aws", cat: "cloud", label: "AWS", family: "aws", sizes: ["mid", "large", "xl"], strat: ["best"], base: 80, ai: 90, eu: 60, cost: 4, note: "Breitestes Service-Portfolio." },
  { id: "gcp", cat: "cloud", label: "Google Cloud", family: "google", sizes: ["mid", "large", "xl"], strat: ["google", "best"], base: 74, ai: 92, eu: 60, cost: 4, note: "Stärkste AI/ML-Tooling." },
  { id: "hetzner", cat: "cloud", label: "Hetzner / OVHcloud", family: "oss", sizes: ["micro", "small", "mid"], strat: ["eu", "cost"], base: 60, ai: 50, eu: 95, cost: 1, note: "EU-souverän, aber DIY." },
  { id: "ionos", cat: "cloud", label: "IONOS Cloud", family: "oss", sizes: ["small", "mid", "large"], strat: ["eu", "cost"], base: 58, ai: 45, eu: 96, cost: 2, note: "Deutsche EU-Cloud, BSI-C5, AI-Tooling rudimentär.", flag: "underdog" },
];
