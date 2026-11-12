'use client'

import { useState } from 'react'
import { Printer, Link as LinkIcon, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

/**
 * Briefing-Actions — Toolbar mit Print- und Share-Button.
 *
 * Render auf /briefing/[token] direkt unter dem H1.
 * - Print: triggert window.print() (Print-Stylesheet siehe globals.css)
 * - Share: kopiert die aktuelle Permalink-URL in die Zwischenablage
 */

interface Props {
  /** Volle Permalink-URL (mit https://...) — vom Server berechnet. */
  permalinkUrl: string
}

export default function BriefingActions({ permalinkUrl }: Props) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(permalinkUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback: select + execCommand (legacy browsers)
      const ta = document.createElement('textarea')
      ta.value = permalinkUrl
      ta.style.position = 'absolute'
      ta.style.left = '-9999px'
      document.body.appendChild(ta)
      ta.select()
      try { document.execCommand('copy') } catch { /* */ }
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  function handlePrint() {
    window.print()
  }

  return (
    <div
      className="briefing-actions"
      style={{
        display: 'flex',
        gap: 10,
        marginBottom: 56,
        flexWrap: 'wrap',
      }}
    >
      <ActionButton
        icon={<Printer size={13} strokeWidth={1.75} />}
        label="Als PDF speichern"
        onClick={handlePrint}
      />
      <ActionButton
        icon={
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="check"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1,    opacity: 1 }}
                exit={{    scale: 0.7, opacity: 0 }}
                transition={{ duration: 0.18 }}
                style={{ display: 'inline-flex', color: 'var(--success-fg)' }}
              >
                <Check size={13} strokeWidth={2.25} />
              </motion.span>
            ) : (
              <motion.span
                key="link"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1,    opacity: 1 }}
                exit={{    scale: 0.7, opacity: 0 }}
                transition={{ duration: 0.18 }}
                style={{ display: 'inline-flex' }}
              >
                <LinkIcon size={13} strokeWidth={1.75} />
              </motion.span>
            )}
          </AnimatePresence>
        }
        label={copied ? 'Kopiert' : 'Link kopieren'}
        onClick={handleCopy}
      />
    </div>
  )
}

function ActionButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -1 }}
      className="font-mono"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 14px',
        fontSize: 11,
        letterSpacing: '0.10em',
        textTransform: 'uppercase',
        color: 'var(--fg-default)',
        background: 'rgba(242, 240, 235, 0.04)',
        border: '1px solid rgba(242, 240, 235, 0.16)',
        borderRadius: 6,
        cursor: 'pointer',
        fontWeight: 500,
        transition: 'background 180ms, border-color 180ms',
      }}
    >
      {icon}
      {label}
    </motion.button>
  )
}
