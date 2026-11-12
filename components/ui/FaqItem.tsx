'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

interface FaqItemProps {
  q: string
  a: React.ReactNode
  defaultOpen?: boolean
}

export default function FaqItem({ q, a, defaultOpen = false }: FaqItemProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <li
      className="border-b"
      style={{ borderColor: 'var(--border-subtle)' }}
    >
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        className="group flex w-full items-center justify-between gap-6 py-7 text-left transition-colors duration-220 md:py-8"
      >
        <span
          className="font-display font-semibold"
          style={{
            fontSize: 'clamp(18px, 1.7vw, 24px)',
            lineHeight: 1.25,
            letterSpacing: 'var(--tr-heading)',
            color: 'var(--fg-default)',
          }}
        >
          {q}
        </span>
        <span
          aria-hidden
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center transition-all duration-300"
          style={{
            background: open ? 'rgba(200, 98, 42, 0.16)' : 'var(--bg-elevated)',
            border: '1px solid ' + (open ? 'rgba(200, 98, 42, 0.46)' : 'var(--border-subtle)'),
            borderRadius: 'var(--r-sm)',
            color: open ? 'var(--accent)' : 'var(--fg-muted)',
            transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
          }}
        >
          <Plus size={16} strokeWidth={1.5} />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div
              className="pb-7 font-body md:pb-8"
              style={{
                fontSize: 'var(--t-body-lg)',
                lineHeight: 1.55,
                color: 'var(--fg-muted)',
                maxWidth: '760px',
              }}
            >
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}
