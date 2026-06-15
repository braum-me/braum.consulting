'use client'

import ToolHubCard from '@/components/werkzeuge/ToolHubCard'
import { TOOLS } from '@/lib/tools'

/**
 * Client-Grid für den Werkzeug-Hub. Importiert TOOLS selbst (statt sie von der
 * Server-Page durchzureichen) — so überquert die `Icon`-Funktion nie die
 * Server→Client-Grenze, und die Karten können ihren Hover-State halten.
 */
export default function ToolHubGrid() {
  return (
    <div
      className="grid gap-6"
      style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', maxWidth: 900, margin: '0 auto' }}
    >
      {TOOLS.map(t => (
        <ToolHubCard key={t.href} tool={t} />
      ))}
    </div>
  )
}
