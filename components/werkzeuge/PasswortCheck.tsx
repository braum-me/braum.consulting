'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import Link from 'next/link'
import { ArrowRight, Eye, EyeOff, ShieldCheck, Lock } from 'lucide-react'
import TrackedLink from '@/components/layout/TrackedLink'
import { trackEvent } from '@/lib/analytics'
import { EASE, primaryCtaStyle } from './styles'

/* ── Berechnung (alles lokal, nichts verlässt den Browser) ─────────────── */

// Annahme: schnelle Offline-Attacke auf einen schwachen Hash, ~100 Mrd. Versuche/Sek.
const LOG10_RATE = 11
const LOG10_HALF = Math.log10(2)

function charsetSize(pw: string): number {
  let n = 0
  if (/[a-z]/.test(pw)) n += 26
  if (/[A-Z]/.test(pw)) n += 26
  if (/[0-9]/.test(pw)) n += 10
  if (/[^a-zA-Z0-9]/.test(pw)) n += 33
  return n
}

type Band = 'sehr schwach' | 'schwach' | 'okay' | 'stark' | 'sehr stark'

const TIERS: { max: number; text: string }[] = [
  { max: 0,        text: 'sofort' },
  { max: 1.78,     text: 'in Sekunden' },
  { max: 3.56,     text: 'in Minuten' },
  { max: 4.94,     text: 'in wenigen Stunden' },
  { max: 6.43,     text: 'in wenigen Tagen' },
  { max: 7.5,      text: 'in Wochen bis Monaten' },
  { max: 9.5,      text: 'in einigen Jahren' },
  { max: 11.5,     text: 'in Jahrhunderten' },
  { max: Infinity, text: 'praktisch unknackbar' },
]

function bandFor(log10s: number): Band {
  if (log10s < 3.56) return 'sehr schwach'
  if (log10s < 6.43) return 'schwach'
  if (log10s < 9.5)  return 'okay'
  if (log10s < 11.5) return 'stark'
  return 'sehr stark'
}

const BAND_META: Record<Band, { color: string; segments: number }> = {
  'sehr schwach': { color: 'var(--error-fg, #E37261)', segments: 1 },
  'schwach':      { color: 'var(--error-fg, #E37261)', segments: 2 },
  'okay':         { color: 'var(--brand)',             segments: 3 },
  'stark':        { color: 'var(--success-fg, #6CB082)', segments: 4 },
  'sehr stark':   { color: 'var(--success-fg, #6CB082)', segments: 5 },
}

function evaluate(pw: string) {
  const cs = charsetSize(pw)
  if (!pw || cs === 0) return null
  const log10seconds = pw.length * Math.log10(cs) - LOG10_HALF - LOG10_RATE
  const tier = TIERS.find(t => log10seconds < t.max) ?? TIERS[TIERS.length - 1]
  return { log10seconds, time: tier.text, band: bandFor(log10seconds), charset: cs }
}

const PRESETS = ['123456', 'Sommer2024!', 'pferd-tisch-mond-lampe-42']

const TIPS = [
  'Länge schlägt Komplexität: vier zufällige Wörter sind stärker und merkbarer als „P@ssw0rt!".',
  'Pro Dienst ein eigenes Passwort — sonst öffnet ein Leak gleich mehrere Türen.',
  'Ein Passwort-Manager erzeugt und merkt lange Zufallspasswörter für dich.',
  'Wo möglich Passkeys oder MFA — dann ist das Passwort allein nie der einzige Schlüssel.',
]

/* ── Komponente ────────────────────────────────────────────────────────── */

export default function PasswortCheck() {
  const reduce = useReducedMotion()
  const [pw, setPw]       = useState('')
  const [show, setShow]   = useState(false)
  const result = evaluate(pw)
  const meta = result ? BAND_META[result.band] : null
  const lastBand = useRef<string>('')

  useEffect(() => {
    if (result && result.band !== lastBand.current) {
      lastBand.current = result.band
      // Nur das Stärke-Band wird getrackt — niemals das Passwort selbst.
      trackEvent('werkzeug_passwort_used', { band: result.band })
    }
  }, [result])

  return (
    <div className="flex flex-col" style={{ gap: 20 }}>
      {/* Privacy-Hinweis prominent */}
      <div className="flex items-start gap-3" style={{ padding: '14px 18px', borderRadius: 10, background: 'rgba(108,176,130,0.08)', border: '1px solid rgba(108,176,130,0.22)' }}>
        <Lock size={16} strokeWidth={1.75} style={{ color: 'var(--success-fg, #6CB082)', marginTop: 2, flexShrink: 0 }} />
        <p className="font-body" style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--fg-muted)', margin: 0 }}>
          Läuft komplett in deinem Browser. Deine Eingabe wird <strong style={{ color: 'var(--fg-default)' }}>nie gesendet, nie gespeichert</strong>.
          Tipp: Tippe nicht dein echtes Passwort, sondern eines nach demselben Muster.
        </p>
      </div>

      {/* Eingabe */}
      <div style={{ position: 'relative' }}>
        <input
          type={show ? 'text' : 'password'}
          value={pw}
          onChange={e => setPw(e.target.value)}
          placeholder="Passwort eingeben …"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          aria-label="Passwort zum Testen"
          style={{
            width: '100%', padding: '16px 52px 16px 18px', fontSize: 16,
            fontFamily: 'var(--font-mono)',
            background: 'var(--bg-elevated)', color: 'var(--fg-default)',
            border: '1px solid var(--border-default)', borderRadius: 10, outline: 'none',
          }}
        />
        <button
          type="button" onClick={() => setShow(s => !s)} aria-label={show ? 'Verbergen' : 'Anzeigen'}
          style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--fg-muted)', cursor: 'pointer', display: 'inline-flex' }}
        >
          {show ? <EyeOff size={18} strokeWidth={1.6} /> : <Eye size={18} strokeWidth={1.6} />}
        </button>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono uppercase" style={{ fontSize: 10.5, letterSpacing: '0.16em', color: 'var(--fg-subtle)' }}>Beispiele:</span>
        {PRESETS.map(p => (
          <button key={p} type="button" onClick={() => { setPw(p); setShow(true) }} className="font-mono" style={{ fontSize: 12, padding: '5px 10px', borderRadius: 999, background: 'var(--bg-elevated)', color: 'var(--fg-muted)', border: '1px solid var(--border-default)', cursor: 'pointer' }}>
            {p}
          </button>
        ))}
      </div>

      {/* Ergebnis */}
      {result && meta && (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          style={{ padding: 'clamp(20px, 3vw, 28px)', borderRadius: 14, background: 'rgba(242,240,235,0.03)', border: '1px solid rgba(242,240,235,0.10)' }}
          aria-live="polite"
        >
          {/* Meter */}
          <div className="flex gap-1.5" style={{ marginBottom: 18 }}>
            {[1, 2, 3, 4, 5].map(i => (
              <span key={i} style={{ flex: 1, height: 6, borderRadius: 3, background: i <= meta.segments ? meta.color : 'rgba(242,240,235,0.10)', transition: 'background 220ms' }} />
            ))}
          </div>

          <p className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.18em', color: meta.color, margin: 0 }}>
            {result.band}
          </p>
          <h3 className="font-display" style={{ fontSize: 'clamp(24px, 3.4vw, 36px)', lineHeight: 1.1, letterSpacing: '-0.02em', color: 'var(--fg-default)', margin: '8px 0 0' }}>
            Geknackt {result.time}.
          </h3>
          <p className="font-body" style={{ marginTop: 12, fontSize: 14.5, lineHeight: 1.6, color: 'var(--fg-muted)' }}>
            {result.charset} mögliche Zeichen, {pw.length} Stellen — geschätzt gegen eine schnelle
            Offline-Attacke (~100 Mrd. Versuche/Sekunde).
          </p>
        </motion.div>
      )}

      {/* Tipps */}
      <div style={{ padding: 'clamp(20px, 3vw, 28px)', borderRadius: 14, background: 'rgba(242,240,235,0.03)', border: '1px solid rgba(242,240,235,0.10)' }}>
        <p className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.18em', color: 'var(--fg-subtle)', marginBottom: 14 }}>
          Was wirklich hilft
        </p>
        <ul className="flex flex-col" style={{ gap: 10, margin: 0, padding: 0, listStyle: 'none' }}>
          {TIPS.map((t, i) => (
            <li key={i} className="flex gap-3" style={{ fontSize: 14.5, lineHeight: 1.55, color: 'var(--fg-default)' }}>
              <ShieldCheck size={16} strokeWidth={1.7} style={{ color: 'var(--success-fg, #6CB082)', marginTop: 2, flexShrink: 0 }} />
              <span className="font-body">{t}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <TrackedLink href="/kontakt" event="cta_lagebild_werkzeug_passwort" className="group transition-transform duration-220 hover:-translate-y-0.5" style={primaryCtaStyle}>
          Sichere Anmeldung im Betrieb umsetzen
          <ArrowRight size={16} strokeWidth={2.25} className="transition-transform duration-220 group-hover:translate-x-0.5" />
        </TrackedLink>
        <Link href="/lexikon/passkey" className="font-body" style={{ fontSize: 14, color: 'var(--brand)', textDecoration: 'underline', textDecorationThickness: 1, textUnderlineOffset: 3 }}>
          Warum Passkeys das Passwort ablösen
        </Link>
      </div>
    </div>
  )
}
