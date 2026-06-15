'use client'

import { motion } from 'motion/react'
import { ShieldCheck, Clock, Lock } from 'lucide-react'

/**
 * Trust-Banner — kompakte Mikrocopy-Zeile direkt über dem Wizard.
 *
 * Drei Trust-Anker: persönlich · 48h · DSGVO.
 * Wird im Wizard direkt zwischen Hero und Form gerendert.
 */
export default function TrustBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
        marginBottom: 40,
        padding: 20,
        borderRadius: 10,
        background:
          'linear-gradient(135deg, rgba(220, 128, 68, 0.06) 0%, rgba(220, 128, 68, 0.01) 100%)',
        border: '1px solid rgba(220, 128, 68, 0.16)',
      }}
    >
      <TrustItem
        icon={<ShieldCheck size={14} strokeWidth={1.5} />}
        label="Persönlich"
        text="Stefan liest jeden Lead selbst"
      />
      <TrustItem
        icon={<Clock size={14} strokeWidth={1.5} />}
        label="Antwort"
        text="Briefing in ~2 Min, Termin ≤ 48h"
      />
      <TrustItem
        icon={<Lock size={14} strokeWidth={1.5} />}
        label="DSGVO"
        text="Notion-CRM, kein Lead-Verkauf"
      />
    </motion.div>
  )
}

function TrustItem({
  icon,
  label,
  text,
}: {
  icon: React.ReactNode
  label: string
  text: string
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span
        className="font-mono"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 10,
          letterSpacing: '0.20em',
          textTransform: 'uppercase',
          color: 'var(--brand)',
        }}
      >
        {icon}
        {label}
      </span>
      <span
        className="font-body"
        style={{
          fontSize: 12.5,
          lineHeight: 1.4,
          color: 'var(--fg-muted)',
        }}
      >
        {text}
      </span>
    </div>
  )
}
