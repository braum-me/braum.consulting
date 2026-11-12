'use client'

import { useEffect, useState } from 'react'
import type { ZxcvbnResult } from '@zxcvbn-ts/core'
import { motion, useReducedMotion } from 'motion/react'
import Link from 'next/link'
import { ArrowRight, Eye, EyeOff, ShieldCheck, Lock } from 'lucide-react'
import { useToolRun } from './useToolRun'
import { EASE, primaryCtaStyle } from './styles'
import { bewerten, ladeBewertung, type Band } from './passwort-bewertung'

/* ── Bewertung (alles lokal, nichts verlässt den Browser) ──────────────── */
const BAND_META: Record<Band, { color: string; segments: number }> = {
  'sehr schwach': { color: 'var(--error-fg, #E37261)', segments: 1 },
  'schwach':      { color: 'var(--error-fg, #E37261)', segments: 2 },
  'okay':         { color: 'var(--brand)',             segments: 3 },
  'stark':        { color: 'var(--success-fg, #6CB082)', segments: 4 },
  'sehr stark':   { color: 'var(--success-fg, #6CB082)', segments: 5 },
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
  const [estimator, setEstimator] = useState<{ check: (pw: string) => ZxcvbnResult } | null>(null)
  useEffect(() => {
    let aktiv = true
    ladeBewertung().then(z => { if (aktiv) setEstimator(z) }).catch(() => {})
    return () => { aktiv = false }
  }, [])
  const result = estimator ? bewerten(estimator, pw) : null
  const meta = result ? BAND_META[result.band] : null
  // Gezählt werden nur Start und Abschluss — nie Passwort oder Bewertung.
  const run = useToolRun('passwort-check')
  const bewertet = !!result && pw.length > 0
  useEffect(() => { if (bewertet) run.complete() }, [bewertet, run])

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
          onChange={e => { run.start(); setPw(e.target.value) }}
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
          type="button" onClick={() => setShow(s => !s)} aria-label={show ? 'Passwort verbergen' : 'Passwort anzeigen'}
          style={{ position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)', width: 44, height: 44, alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', color: 'var(--fg-muted)', cursor: 'pointer', display: 'inline-flex' }}
        >
          {show ? <EyeOff size={18} strokeWidth={1.6} /> : <Eye size={18} strokeWidth={1.6} />}
        </button>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono uppercase" style={{ fontSize: 10.5, letterSpacing: '0.16em', color: 'var(--fg-subtle)' }}>Beispiele:</span>
        {PRESETS.map(p => (
          <button key={p} type="button" onClick={() => { run.start(); setPw(p); setShow(true) }} className="font-mono" style={{ fontSize: 12, padding: '5px 10px', borderRadius: 999, background: 'var(--bg-elevated)', color: 'var(--fg-muted)', border: '1px solid var(--border-default)', cursor: 'pointer' }}>
            {p}
          </button>
        ))}
      </div>

      {/* Ergebnis */}
      {pw && !estimator && (
        <p className="font-body" style={{ fontSize: 14, color: 'var(--fg-muted)', margin: 0 }} aria-live="polite">Bewertung wird geladen …</p>
      )}
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
            Geschätzte Knackdauer: {result.dauer}
          </h3>
          {(result.warnung || result.tipps.length > 0) && (
            <ul className="flex flex-col" style={{ gap: 6, margin: '14px 0 0', padding: 0, listStyle: 'none' }}>
              {[result.warnung, ...result.tipps].filter(Boolean).map((t, i) => (
                <li key={i} className="font-body" style={{ fontSize: 14.5, lineHeight: 1.55, color: i === 0 && result.warnung ? 'var(--fg-default)' : 'var(--fg-muted)' }}>
                  {t}
                </li>
              ))}
            </ul>
          )}
          <p className="font-body" style={{ marginTop: 12, fontSize: 13.5, lineHeight: 1.6, color: 'var(--fg-muted)' }}>
            Geschätzt mit zxcvbn-ts: erkennt häufige Passwörter, Wörter, Namen, Jahreszahlen und
            Tastaturmuster. Die Dauer gilt für den günstigen Fall, dass ein Dienst Passwörter
            sorgfältig gespeichert hat (rund 10.000 Versuche pro Sekunde). Bei schlecht
            gesicherten Diensten geht es um ein Vielfaches schneller.
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
        <Link href="/kontakt?tool=passwort" data-track-placement="ergebnis" className="group transition-transform duration-220 hover:-translate-y-0.5" style={primaryCtaStyle}>
          Sichere Anmeldung im Betrieb umsetzen
          <ArrowRight size={16} strokeWidth={2.25} className="transition-transform duration-220 group-hover:translate-x-0.5" />
        </Link>
        <Link href="/lexikon/passkey" className="font-body" style={{ fontSize: 14, color: 'var(--brand)', textDecoration: 'underline', textDecorationThickness: 1, textUnderlineOffset: 3 }}>
          Warum Passkeys das Passwort ablösen
        </Link>
      </div>
    </div>
  )
}
