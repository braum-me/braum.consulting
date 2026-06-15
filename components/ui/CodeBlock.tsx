'use client'

/**
 * Code-Block mit Header-Bar (Sprache + Copy-Button) und Monospace-Body.
 * Kein echtes Syntax-Highlighting (kein Shiki) — aber professionellere
 * Optik als plain `<pre>`. Copy-Button zeigt Toast bei Erfolg.
 */

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { showToast } from './ShareToast'

interface CodeBlockProps {
  code:      string
  language?: string
}

export default function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      showToast('Code kopiert')
      setTimeout(() => setCopied(false), 1600)
    } catch {
      showToast('Kopieren fehlgeschlagen')
    }
  }

  return (
    <div
      className="mt-10 overflow-hidden first:mt-0"
      style={{
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--r-sm)',
        background: 'var(--bg-elevated)',
      }}
    >
      {/* Header-Bar */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: '8px 14px',
          background: 'rgba(15, 14, 12, 0.5)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div className="flex items-center gap-2">
          {/* Traffic-light Dots */}
          <span style={{ width: 8, height: 8, borderRadius: 999, background: 'rgba(255, 95, 86, 0.6)' }} />
          <span style={{ width: 8, height: 8, borderRadius: 999, background: 'rgba(255, 189, 46, 0.6)' }} />
          <span style={{ width: 8, height: 8, borderRadius: 999, background: 'rgba(40, 200, 64, 0.6)' }} />
          {language && (
            <span
              className="font-mono uppercase"
              style={{
                marginLeft: 12,
                fontSize: 9,
                letterSpacing: '0.22em',
                color: 'var(--fg-subtle)',
              }}
            >
              {language}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          aria-label="Code kopieren"
          className="inline-flex items-center gap-1.5 font-mono uppercase transition-colors duration-220 hover:text-[color:var(--brand)]"
          style={{
            fontSize: 9,
            letterSpacing: '0.18em',
            color: copied ? 'var(--brand)' : 'var(--fg-subtle)',
          }}
        >
          {copied ? <Check size={11} strokeWidth={1.8} /> : <Copy size={11} strokeWidth={1.6} />}
          {copied ? 'Kopiert' : 'Kopieren'}
        </button>
      </div>

      {/* Code-Body */}
      <pre
        className="overflow-x-auto p-5 font-mono"
        style={{
          fontSize: 13,
          lineHeight: 1.55,
          color: 'var(--fg-default)',
          margin: 0,
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  )
}
