'use client'

import ToolHubCard from '@/components/werkzeuge/ToolHubCard'
import Eyebrow from '@/components/ui/Eyebrow'
import { TOOL_GROUPS, toolsBySlugs } from '@/lib/tools'

/**
 * Client-Grid für den Werkzeug-Hub, gegliedert in die vier Bereiche aus
 * lib/tools.ts. Importiert TOOLS selbst (statt sie von der Server-Page
 * durchzureichen) — so überquert die `Icon`-Funktion nie die
 * Server→Client-Grenze, und die Karten können ihren Hover-State halten.
 */
export default function ToolHubGrid() {
  return (
    <div className="flex flex-col" style={{ gap: 'clamp(56px, 7vw, 88px)', maxWidth: 900, margin: '0 auto' }}>
      {TOOL_GROUPS.map((g, i) => (
        <section key={g.id} id={g.id} aria-labelledby={`bereich-${g.id}`}>
          <Eyebrow num={String(i + 1).padStart(2, '0')}>
            {g.slugs.length} {g.slugs.length === 1 ? 'Werkzeug' : 'Werkzeuge'}
          </Eyebrow>
          <h2
            id={`bereich-${g.id}`}
            className="mt-4 font-display font-bold"
            style={{ fontSize: 'clamp(26px, 3vw, 34px)', lineHeight: 1.15, letterSpacing: '-0.02em', color: 'var(--fg-default)' }}
          >
            {g.title}
          </h2>
          <p className="mt-3 font-body" style={{ fontSize: 'var(--t-body)', lineHeight: 1.55, color: 'var(--fg-muted)', maxWidth: 620 }}>
            {g.intro}
          </p>
          <div
            className="mt-8 grid gap-6"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}
          >
            {toolsBySlugs(g.slugs).map(t => (
              <ToolHubCard key={t.href} tool={t} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
