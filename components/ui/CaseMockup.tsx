/**
 * Inline-SVG-Mockups je Service-Feld.
 * Generierter Code, kein Bild-Asset. Skaliert sauber, Brand-Farben.
 *
 * Felder: 'marke' (Browser-Frame mit Website), 'm365' (Dashboard mit
 * Tenants), 'ai' (Code-Editor mit RAG-Pipeline), 'strategie' (Monitoring-
 * Dashboard mit Gauges).
 */

import type { CaseStudy } from '@/lib/cases'

interface CaseMockupProps {
  field: CaseStudy['field']
  className?: string
}

export default function CaseMockup({ field, className }: CaseMockupProps) {
  switch (field) {
    case 'marke':     return <BrowserMockup className={className} />
    case 'm365':      return <TenantsMockup className={className} />
    case 'ai':        return <PipelineMockup className={className} />
    case 'strategie': return <DashboardMockup className={className} />
  }
}

/* ── 1. Browser-Frame mit Website-Layout ───────────────────────────── */
function BrowserMockup({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 450"
      className={className}
      aria-hidden
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Browser-Frame */}
      <rect x="40" y="40" width="720" height="380" rx="8" fill="#1C1B18" stroke="rgba(242,240,235,0.10)" strokeWidth="1" />
      <rect x="40" y="40" width="720" height="36" rx="8" fill="#232220" />
      <rect x="40" y="68" width="720" height="2" fill="rgba(242,240,235,0.06)" />

      {/* Browser-Dots */}
      <circle cx="62" cy="58" r="5" fill="rgba(220,128,68,0.4)" />
      <circle cx="78" cy="58" r="5" fill="rgba(242,240,235,0.16)" />
      <circle cx="94" cy="58" r="5" fill="rgba(242,240,235,0.16)" />

      {/* URL-Bar */}
      <rect x="150" y="50" width="500" height="16" rx="8" fill="rgba(15,14,12,0.6)" />
      <text x="170" y="62" fill="rgba(242,240,235,0.5)" fontSize="10" fontFamily="ui-monospace, monospace">
        kunde-website.de/lead-funnel
      </text>

      {/* Hero-Headline */}
      <rect x="80" y="110" width="380" height="16" rx="2" fill="rgba(242,240,235,0.85)" />
      <rect x="80" y="136" width="280" height="16" rx="2" fill="rgba(242,240,235,0.85)" />
      <rect x="80" y="162" width="340" height="16" rx="2" fill="rgba(220,128,68,0.7)" />

      {/* Body */}
      <rect x="80" y="200" width="420" height="6" rx="3" fill="rgba(242,240,235,0.30)" />
      <rect x="80" y="214" width="380" height="6" rx="3" fill="rgba(242,240,235,0.30)" />
      <rect x="80" y="228" width="320" height="6" rx="3" fill="rgba(242,240,235,0.30)" />

      {/* CTA */}
      <rect x="80" y="262" width="160" height="40" rx="6" fill="rgba(200,98,42,0.9)" />
      <rect x="100" y="277" width="100" height="10" rx="2" fill="rgba(15,14,12,0.85)" />
      <rect x="216" y="282" width="10" height="2" fill="rgba(15,14,12,0.85)" />

      {/* Hero-Bild rechts */}
      <rect x="520" y="100" width="200" height="240" rx="8" fill="rgba(220,128,68,0.10)" stroke="rgba(220,128,68,0.30)" strokeWidth="1" />
      <circle cx="620" cy="200" r="30" fill="rgba(220,128,68,0.40)" />
      <rect x="540" y="250" width="160" height="8" rx="2" fill="rgba(220,128,68,0.40)" />
      <rect x="540" y="266" width="120" height="6" rx="2" fill="rgba(220,128,68,0.30)" />

      {/* Bottom-Section: Metrics */}
      <rect x="80" y="354" width="120" height="46" rx="6" fill="rgba(242,240,235,0.04)" stroke="rgba(242,240,235,0.10)" strokeWidth="1" />
      <text x="92" y="372" fill="rgba(220,128,68,0.9)" fontSize="14" fontWeight="700" fontFamily="ui-monospace, monospace">3.2×</text>
      <text x="92" y="388" fill="rgba(242,240,235,0.4)" fontSize="8" fontFamily="ui-monospace, monospace">MQL</text>

      <rect x="216" y="354" width="120" height="46" rx="6" fill="rgba(242,240,235,0.04)" stroke="rgba(242,240,235,0.10)" strokeWidth="1" />
      <text x="228" y="372" fill="rgba(220,128,68,0.9)" fontSize="14" fontWeight="700" fontFamily="ui-monospace, monospace">0.7s</text>
      <text x="228" y="388" fill="rgba(242,240,235,0.4)" fontSize="8" fontFamily="ui-monospace, monospace">TTI</text>

      <rect x="352" y="354" width="120" height="46" rx="6" fill="rgba(242,240,235,0.04)" stroke="rgba(242,240,235,0.10)" strokeWidth="1" />
      <text x="364" y="372" fill="rgba(220,128,68,0.9)" fontSize="14" fontWeight="700" fontFamily="ui-monospace, monospace">A+</text>
      <text x="364" y="388" fill="rgba(242,240,235,0.4)" fontSize="8" fontFamily="ui-monospace, monospace">SEO</text>
    </svg>
  )
}

/* ── 2. M365 Tenants Dashboard ─────────────────────────────────────── */
function TenantsMockup({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 450"
      className={className}
      aria-hidden
      preserveAspectRatio="xMidYMid meet"
    >
      {/* App-Frame */}
      <rect x="40" y="40" width="720" height="380" rx="8" fill="#1C1B18" stroke="rgba(242,240,235,0.10)" strokeWidth="1" />

      {/* Sidebar */}
      <rect x="40" y="40" width="160" height="380" fill="rgba(15,14,12,0.6)" />
      <rect x="42" y="40" width="2" height="380" fill="rgba(220,128,68,0.4)" />

      {/* Sidebar items */}
      <rect x="60" y="64" width="100" height="6" rx="2" fill="rgba(242,240,235,0.6)" />
      <rect x="60" y="84" width="80" height="4" rx="2" fill="rgba(242,240,235,0.25)" />
      <rect x="60" y="106" width="90" height="4" rx="2" fill="rgba(242,240,235,0.25)" />
      <rect x="60" y="128" width="100" height="4" rx="2" fill="rgba(220,128,68,0.6)" />
      <rect x="60" y="150" width="70" height="4" rx="2" fill="rgba(242,240,235,0.25)" />
      <rect x="60" y="172" width="90" height="4" rx="2" fill="rgba(242,240,235,0.25)" />

      {/* Header */}
      <rect x="220" y="62" width="180" height="14" rx="2" fill="rgba(242,240,235,0.85)" />
      <rect x="220" y="84" width="240" height="6" rx="2" fill="rgba(242,240,235,0.30)" />

      {/* Tenant-Konsolidierungs-Visualisierung */}
      {/* 12 Tenants */}
      {Array.from({ length: 12 }).map((_, i) => {
        const col = i % 4
        const row = Math.floor(i / 4)
        const x = 220 + col * 30
        const y = 130 + row * 30
        return (
          <g key={i}>
            <rect x={x} y={y} width="24" height="24" rx="4" fill="rgba(242,240,235,0.06)" stroke="rgba(242,240,235,0.20)" strokeWidth="1" />
            <circle cx={x + 12} cy={y + 12} r="3" fill="rgba(242,240,235,0.40)" />
          </g>
        )
      })}

      {/* Arrow → */}
      <path d="M 360 175 L 420 175" stroke="rgba(220,128,68,0.9)" strokeWidth="2" fill="none" />
      <path d="M 415 170 L 420 175 L 415 180" stroke="rgba(220,128,68,0.9)" strokeWidth="2" fill="none" />

      {/* 1 Tenant */}
      <rect x="440" y="130" width="100" height="100" rx="8" fill="rgba(220,128,68,0.15)" stroke="rgba(220,128,68,0.5)" strokeWidth="1.5" />
      <circle cx="490" cy="180" r="18" fill="rgba(220,128,68,0.4)" />
      <text x="490" y="186" fill="rgba(15,14,12,0.9)" fontSize="14" fontWeight="700" fontFamily="ui-monospace, monospace" textAnchor="middle">1</text>

      {/* Stats */}
      <rect x="220" y="260" width="160" height="76" rx="6" fill="rgba(242,240,235,0.04)" stroke="rgba(242,240,235,0.10)" strokeWidth="1" />
      <text x="232" y="282" fill="rgba(220,128,68,0.9)" fontSize="22" fontWeight="700" fontFamily="ui-monospace, monospace">12→1</text>
      <text x="232" y="302" fill="rgba(242,240,235,0.6)" fontSize="9" fontFamily="ui-monospace, monospace">TENANTS</text>
      <text x="232" y="322" fill="rgba(242,240,235,0.4)" fontSize="9" fontFamily="ui-monospace, monospace">9 Wochen Engagement</text>

      <rect x="392" y="260" width="160" height="76" rx="6" fill="rgba(242,240,235,0.04)" stroke="rgba(242,240,235,0.10)" strokeWidth="1" />
      <text x="404" y="282" fill="rgba(108,176,130,0.9)" fontSize="22" fontWeight="700" fontFamily="ui-monospace, monospace">100%</text>
      <text x="404" y="302" fill="rgba(242,240,235,0.6)" fontSize="9" fontFamily="ui-monospace, monospace">COMPLIANCE</text>
      <text x="404" y="322" fill="rgba(242,240,235,0.4)" fontSize="9" fontFamily="ui-monospace, monospace">Audit erfolgreich</text>

      <rect x="564" y="260" width="160" height="76" rx="6" fill="rgba(242,240,235,0.04)" stroke="rgba(242,240,235,0.10)" strokeWidth="1" />
      <text x="576" y="282" fill="rgba(220,128,68,0.9)" fontSize="22" fontWeight="700" fontFamily="ui-monospace, monospace">0</text>
      <text x="576" y="302" fill="rgba(242,240,235,0.6)" fontSize="9" fontFamily="ui-monospace, monospace">DOWNTIME</text>
      <text x="576" y="322" fill="rgba(242,240,235,0.4)" fontSize="9" fontFamily="ui-monospace, monospace">Standorte ungestört</text>

      {/* Status-Bar */}
      <rect x="220" y="372" width="500" height="24" rx="4" fill="rgba(108,176,130,0.10)" stroke="rgba(108,176,130,0.30)" strokeWidth="1" />
      <circle cx="234" cy="384" r="3" fill="rgba(108,176,130,0.9)" />
      <text x="246" y="388" fill="rgba(108,176,130,0.9)" fontSize="9" fontFamily="ui-monospace, monospace">CONSOLIDATION COMPLETE · ALL USERS MIGRATED</text>
    </svg>
  )
}

/* ── 3. AI Pipeline / Code-Editor ──────────────────────────────────── */
function PipelineMockup({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 450"
      className={className}
      aria-hidden
      preserveAspectRatio="xMidYMid meet"
    >
      <rect x="40" y="40" width="720" height="380" rx="8" fill="#1C1B18" stroke="rgba(242,240,235,0.10)" strokeWidth="1" />

      {/* Title */}
      <text x="64" y="74" fill="rgba(242,240,235,0.85)" fontSize="14" fontWeight="700" fontFamily="ui-monospace, monospace">AI-WORKFLOW</text>
      <text x="64" y="92" fill="rgba(242,240,235,0.4)" fontSize="10" fontFamily="ui-monospace, monospace">copilot studio · n8n · sharepoint rag</text>

      {/* Pipeline nodes */}
      {/* Node 1: Input */}
      <rect x="64" y="130" width="120" height="60" rx="6" fill="rgba(242,240,235,0.04)" stroke="rgba(242,240,235,0.20)" strokeWidth="1" />
      <text x="76" y="152" fill="rgba(242,240,235,0.85)" fontSize="11" fontWeight="600" fontFamily="ui-monospace, monospace">SHAREPOINT</text>
      <text x="76" y="168" fill="rgba(242,240,235,0.4)" fontSize="9" fontFamily="ui-monospace, monospace">4.200 Docs</text>
      <text x="76" y="180" fill="rgba(220,128,68,0.7)" fontSize="9" fontFamily="ui-monospace, monospace">→ Embeddings</text>

      {/* Arrow */}
      <path d="M 184 160 L 234 160" stroke="rgba(220,128,68,0.6)" strokeWidth="1.5" fill="none" />
      <path d="M 230 156 L 234 160 L 230 164" stroke="rgba(220,128,68,0.6)" strokeWidth="1.5" fill="none" />

      {/* Node 2: Vector DB */}
      <rect x="234" y="130" width="120" height="60" rx="6" fill="rgba(220,128,68,0.10)" stroke="rgba(220,128,68,0.50)" strokeWidth="1.5" />
      <text x="246" y="152" fill="rgba(220,128,68,0.95)" fontSize="11" fontWeight="600" fontFamily="ui-monospace, monospace">PGVECTOR</text>
      <text x="246" y="168" fill="rgba(242,240,235,0.4)" fontSize="9" fontFamily="ui-monospace, monospace">on-prem · EU</text>
      <text x="246" y="180" fill="rgba(242,240,235,0.4)" fontSize="9" fontFamily="ui-monospace, monospace">audit-logged</text>

      {/* Arrow */}
      <path d="M 354 160 L 404 160" stroke="rgba(220,128,68,0.6)" strokeWidth="1.5" fill="none" />
      <path d="M 400 156 L 404 160 L 400 164" stroke="rgba(220,128,68,0.6)" strokeWidth="1.5" fill="none" />

      {/* Node 3: LLM */}
      <rect x="404" y="130" width="120" height="60" rx="6" fill="rgba(242,240,235,0.04)" stroke="rgba(242,240,235,0.20)" strokeWidth="1" />
      <text x="416" y="152" fill="rgba(242,240,235,0.85)" fontSize="11" fontWeight="600" fontFamily="ui-monospace, monospace">AZURE OPENAI</text>
      <text x="416" y="168" fill="rgba(242,240,235,0.4)" fontSize="9" fontFamily="ui-monospace, monospace">EU-region</text>
      <text x="416" y="180" fill="rgba(108,176,130,0.7)" fontSize="9" fontFamily="ui-monospace, monospace">DSGVO ✓</text>

      {/* Arrow */}
      <path d="M 524 160 L 574 160" stroke="rgba(220,128,68,0.6)" strokeWidth="1.5" fill="none" />
      <path d="M 570 156 L 574 160 L 570 164" stroke="rgba(220,128,68,0.6)" strokeWidth="1.5" fill="none" />

      {/* Node 4: Output */}
      <rect x="574" y="130" width="160" height="60" rx="6" fill="rgba(242,240,235,0.04)" stroke="rgba(242,240,235,0.20)" strokeWidth="1" />
      <text x="586" y="152" fill="rgba(242,240,235,0.85)" fontSize="11" fontWeight="600" fontFamily="ui-monospace, monospace">COPILOT STUDIO</text>
      <text x="586" y="168" fill="rgba(242,240,235,0.4)" fontSize="9" fontFamily="ui-monospace, monospace">QS-Bot · 40 User</text>
      <text x="586" y="180" fill="rgba(220,128,68,0.7)" fontSize="9" fontFamily="ui-monospace, monospace">−38% Draft-Zeit</text>

      {/* Console / Logs */}
      <rect x="64" y="230" width="670" height="170" rx="6" fill="rgba(15,14,12,0.7)" stroke="rgba(242,240,235,0.10)" strokeWidth="1" />
      <text x="76" y="252" fill="rgba(108,176,130,0.7)" fontSize="9" fontFamily="ui-monospace, monospace">→ embed_chargen_reports.py --batch=200</text>
      <text x="76" y="270" fill="rgba(242,240,235,0.4)" fontSize="9" fontFamily="ui-monospace, monospace">  [#####....] 47% · 1.847 / 4.200 docs · ETA 6m</text>
      <text x="76" y="294" fill="rgba(108,176,130,0.7)" fontSize="9" fontFamily="ui-monospace, monospace">→ rag_query("Charge 24-A-1138 deviation report")</text>
      <text x="76" y="312" fill="rgba(242,240,235,0.6)" fontSize="9" fontFamily="ui-monospace, monospace">  ✓ 8 matches in 142ms · top similarity 0.87</text>
      <text x="76" y="336" fill="rgba(108,176,130,0.7)" fontSize="9" fontFamily="ui-monospace, monospace">→ copilot.draft("Q3 audit summary, Charge 24-A-1138")</text>
      <text x="76" y="354" fill="rgba(242,240,235,0.6)" fontSize="9" fontFamily="ui-monospace, monospace">  ✓ Draft generated · 1.247 tokens · 4.2s</text>
      <text x="76" y="378" fill="rgba(220,128,68,0.9)" fontSize="9" fontFamily="ui-monospace, monospace">⚡ READY · operator review pending</text>
    </svg>
  )
}

/* ── 4. Strategy / Monitoring Dashboard ────────────────────────────── */
function DashboardMockup({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 450"
      className={className}
      aria-hidden
      preserveAspectRatio="xMidYMid meet"
    >
      <rect x="40" y="40" width="720" height="380" rx="8" fill="#1C1B18" stroke="rgba(242,240,235,0.10)" strokeWidth="1" />

      {/* Title */}
      <text x="64" y="74" fill="rgba(242,240,235,0.85)" fontSize="14" fontWeight="700" fontFamily="ui-monospace, monospace">DUE DILIGENCE · TARGET-IT</text>
      <text x="64" y="92" fill="rgba(242,240,235,0.4)" fontSize="10" fontFamily="ui-monospace, monospace">acquisition review · NDA · stand 14d</text>

      {/* Risk-Score-Gauge */}
      <g transform="translate(120 170)">
        <circle cx="0" cy="0" r="50" fill="none" stroke="rgba(242,240,235,0.10)" strokeWidth="8" />
        <circle
          cx="0" cy="0" r="50" fill="none"
          stroke="rgba(220,128,68,0.9)" strokeWidth="8"
          strokeDasharray="220 314" strokeDashoffset="0"
          transform="rotate(-90)"
          strokeLinecap="round"
        />
        <text x="0" y="-2" fill="rgba(242,240,235,0.95)" fontSize="22" fontWeight="700" fontFamily="ui-monospace, monospace" textAnchor="middle">6.8</text>
        <text x="0" y="14" fill="rgba(242,240,235,0.4)" fontSize="8" fontFamily="ui-monospace, monospace" textAnchor="middle">/ 10</text>
      </g>
      <text x="120" y="248" fill="rgba(242,240,235,0.6)" fontSize="9" fontFamily="ui-monospace, monospace" textAnchor="middle">RISK SCORE · MEDIUM</text>

      {/* Findings */}
      <text x="220" y="138" fill="rgba(242,240,235,0.85)" fontSize="11" fontWeight="600" fontFamily="ui-monospace, monospace">FINDINGS</text>

      <rect x="220" y="146" width="500" height="32" rx="4" fill="rgba(227,114,97,0.10)" stroke="rgba(227,114,97,0.30)" strokeWidth="1" />
      <circle cx="234" cy="162" r="3" fill="rgba(227,114,97,0.9)" />
      <text x="246" y="166" fill="rgba(242,240,235,0.85)" fontSize="10" fontFamily="ui-monospace, monospace">ERP veraltet · Migration €1.8M · Risiko hoch</text>

      <rect x="220" y="184" width="500" height="32" rx="4" fill="rgba(224,176,85,0.10)" stroke="rgba(224,176,85,0.30)" strokeWidth="1" />
      <circle cx="234" cy="200" r="3" fill="rgba(224,176,85,0.9)" />
      <text x="246" y="204" fill="rgba(242,240,235,0.85)" fontSize="10" fontFamily="ui-monospace, monospace">Lizenzen unklar · 47 Audit-Punkte offen</text>

      <rect x="220" y="222" width="500" height="32" rx="4" fill="rgba(224,176,85,0.10)" stroke="rgba(224,176,85,0.30)" strokeWidth="1" />
      <circle cx="234" cy="238" r="3" fill="rgba(224,176,85,0.9)" />
      <text x="246" y="242" fill="rgba(242,240,235,0.85)" fontSize="10" fontFamily="ui-monospace, monospace">Cybersecurity-Versicherung fehlt</text>

      <rect x="220" y="260" width="500" height="32" rx="4" fill="rgba(108,176,130,0.10)" stroke="rgba(108,176,130,0.30)" strokeWidth="1" />
      <circle cx="234" cy="276" r="3" fill="rgba(108,176,130,0.9)" />
      <text x="246" y="280" fill="rgba(242,240,235,0.85)" fontSize="10" fontFamily="ui-monospace, monospace">M365 sauber · Entra ID modern · Compliance OK</text>

      {/* Recommendation */}
      <rect x="64" y="320" width="660" height="80" rx="6" fill="rgba(220,128,68,0.06)" stroke="rgba(220,128,68,0.30)" strokeWidth="1" />
      <text x="76" y="342" fill="rgba(220,128,68,0.95)" fontSize="10" fontWeight="700" fontFamily="ui-monospace, monospace">EMPFEHLUNG</text>
      <text x="76" y="362" fill="rgba(242,240,235,0.85)" fontSize="11" fontFamily="ui-monospace, monospace">Kaufpreis-Abschlag −6% wegen ERP-Risiko.</text>
      <text x="76" y="378" fill="rgba(242,240,235,0.6)" fontSize="10" fontFamily="ui-monospace, monospace">Roadmap-Anlage: 18 Monate post-Closing, €2.4M Budget.</text>
    </svg>
  )
}
