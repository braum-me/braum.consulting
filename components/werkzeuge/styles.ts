/**
 * Geteilte Style-Helfer für die Werkzeug-Mini-Funnels (NIS2-Check,
 * M365-Aufwand). Hält die beiden Tools visuell konsistent — gleiche
 * Pill-/Label-/Karten-Sprache wie das Kontaktformular und die Lagebild-Cards.
 */

import type { CSSProperties } from 'react'

export const EASE = [0.16, 1, 0.3, 1] as const

export const labelStyle: CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--t-micro)',
  letterSpacing: 'var(--tr-eyebrow)',
  textTransform: 'uppercase',
  color: 'var(--fg-subtle)',
  marginBottom: 14,
}

export function pillStyle(active: boolean): CSSProperties {
  return {
    padding: '11px 17px',
    fontSize: 'var(--t-body-sm)',
    fontFamily: 'var(--font-body)',
    textAlign: 'left',
    background: active ? 'rgba(200, 98, 42, 0.14)' : 'var(--bg-elevated)',
    color: active ? 'var(--accent)' : 'var(--fg-muted)',
    border: '1px solid ' + (active ? 'rgba(200, 98, 42, 0.46)' : 'var(--border-default)'),
    borderRadius: 'var(--r-pill)',
    cursor: 'pointer',
    transition: 'all 220ms cubic-bezier(0.16, 1, 0.3, 1)',
    fontWeight: active ? 600 : 400,
  }
}

/** Karten-Hülle für einen Frage-Block. */
export const questionCard: CSSProperties = {
  padding: 'clamp(20px, 3vw, 28px)',
  borderRadius: 14,
  background: 'rgba(242, 240, 235, 0.03)',
  border: '1px solid rgba(242, 240, 235, 0.10)',
}

/** Ergebnis-Panel-Hülle (brand-akzentuiert). */
export const resultCard: CSSProperties = {
  padding: 'clamp(24px, 4vw, 40px)',
  borderRadius: 16,
  background: 'linear-gradient(145deg, rgba(220, 128, 68, 0.10) 0%, rgba(220, 128, 68, 0.02) 100%)',
  border: '1px solid rgba(220, 128, 68, 0.32)',
  boxShadow: '0 0 0 1px rgba(220, 128, 68, 0.12), 0 24px 48px -16px rgba(0, 0, 0, 0.55), 0 0 32px rgba(220, 128, 68, 0.12)',
}

export const primaryCtaStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 10,
  fontSize: 15,
  fontWeight: 600,
  letterSpacing: '0.01em',
  color: '#FBF0EA',
  background: 'linear-gradient(135deg, #DC8044 0%, #C8622A 100%)',
  padding: '15px 28px',
  borderRadius: 6,
  boxShadow: '0 12px 28px -10px rgba(200, 98, 42, 0.6)',
}
