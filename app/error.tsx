'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, RotateCcw, AlertTriangle } from 'lucide-react'
import ItalicAccent from '@/components/ui/ItalicAccent'
import AnimatedGradient from '@/components/ui/AnimatedGradient'
import ObfuscatedEmail from '@/components/ui/ObfuscatedEmail'
import { TopLinks } from '@/components/ui/TopLinks'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[page error]', error)
  }, [error])

  return (
    <div
      className="relative flex w-screen flex-col items-center justify-center overflow-hidden"
      style={{
        marginLeft: 'calc(-50vw + 50%)',
        minHeight: '100vh',
        background: 'var(--bg-base)',
        padding: '120px 24px',
      }}
    >
      <AnimatedGradient variant="hero" />

      <div
        className="relative z-[3] flex flex-col items-center text-center"
        style={{ maxWidth: '640px' }}
      >
        <span
          className="inline-flex items-center gap-2 font-mono uppercase"
          style={{
            fontSize: '11px',
            letterSpacing: '0.20em',
            color: 'var(--brand)',
            marginBottom: '32px',
          }}
        >
          <AlertTriangle size={14} strokeWidth={1.5} />
          500 · Etwas hat geknallt
        </span>

        <h1
          className="font-display font-black"
          style={{
            fontSize: 'clamp(44px, 6vw, 88px)',
            lineHeight: 1,
            letterSpacing: 'var(--tr-display)',
            color: 'var(--fg-default)',
          }}
        >
          Da ging was <ItalicAccent>schief</ItalicAccent>.
        </h1>

        <p
          className="font-body"
          style={{
            fontSize: '18px',
            lineHeight: 1.6,
            color: 'var(--fg-muted)',
            maxWidth: '480px',
            marginTop: '32px',
          }}
        >
          Unerwarteter Fehler beim Laden dieser Seite. Versuch's nochmal.
          Sollte das Problem bestehen bleiben, schreib mir kurz an{' '}
          <ObfuscatedEmail
            showAddress
            className="underline decoration-[var(--border-default)] underline-offset-4 hover:text-[color:var(--fg-default)]"
          />
          .
        </p>

        {error.digest && (
          <p
            className="font-mono"
            style={{
              fontSize: '11px',
              color: 'var(--fg-faint)',
              letterSpacing: '0.04em',
              marginTop: '20px',
            }}
          >
            Fehler-ID: {error.digest}
          </p>
        )}

        <div
          className="flex flex-wrap items-center justify-center"
          style={{ gap: '24px', marginTop: '48px' }}
        >
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 font-body font-semibold transition-transform duration-220 hover:-translate-y-px"
            style={{
              padding: '16px 28px',
              fontSize: '15px',
              background: 'var(--accent)',
              color: 'var(--on-accent)',
              borderRadius: 'var(--r-sm)',
              boxShadow: 'var(--sh-2)',
            }}
          >
            <RotateCcw size={16} strokeWidth={1.5} />
            Nochmal versuchen
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-body transition-colors duration-220 hover:text-[color:var(--fg-default)]"
            style={{
              fontSize: '15px',
              color: 'var(--fg-muted)',
            }}
          >
            Zur Startseite
            <ArrowRight size={14} strokeWidth={1.5} />
          </Link>
        </div>

        <div
          className="w-full"
          style={{
            marginTop: '56px',
            paddingTop: '40px',
            borderTop: '1px solid var(--border-default)',
          }}
        >
          <TopLinks heading="Oder hier weiter" align="center" />
        </div>
      </div>
    </div>
  )
}
