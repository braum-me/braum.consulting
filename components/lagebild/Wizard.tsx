'use client'

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowLeft, ArrowRight, Compass, Loader2, RotateCcw, AlertCircle } from 'lucide-react'

import { submitLagebild, type LagebildState } from '@/app/lagebild/check/actions'
import { STEPS, getActiveSteps, type Step, type Field } from '@/lib/lagebild-questions'
import type { Saeule } from '@/lib/notion'
import { trackEvent } from '@/lib/analytics'
import Dropdown from './Dropdown'
import TrustBanner from './TrustBanner'

/* ── Typen ───────────────────────────────────────────────────────────── */

type Values = Record<string, string | string[]>

interface DraftPayload {
  values:   Values
  stepIdx:  number
  savedAt:  string
}

const STORAGE_KEY = 'lagebild-wizard-draft-v1'
const DRAFT_TTL_DAYS = 30
const EMAIL_RX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
const EASE = [0.16, 1, 0.3, 1] as const

/* ── Validation ──────────────────────────────────────────────────────── */

function getFieldValue(values: Values, name: string): string | string[] {
  return values[name] ?? (name === 'saeulen' ? [] : '')
}

function isFieldFilled(field: Field, values: Values): boolean {
  const v = getFieldValue(values, field.name)
  if (field.type === 'multi-select') {
    return Array.isArray(v) && v.length > 0
  }
  if (typeof v !== 'string') return false
  const trimmed = v.trim()
  if (!trimmed) return false
  if (field.type === 'email') return EMAIL_RX.test(trimmed)
  if (field.minChars && trimmed.length < field.minChars) return false
  return true
}

function fieldErrorHint(field: Field, values: Values): string | null {
  const v = getFieldValue(values, field.name)
  if (field.type === 'multi-select') {
    return Array.isArray(v) && v.length > 0 ? null : 'Mindestens eine Auswahl.'
  }
  if (typeof v !== 'string' || !v.trim()) {
    return field.required ? 'Pflichtfeld.' : null
  }
  const trimmed = v.trim()
  if (field.type === 'email' && !EMAIL_RX.test(trimmed)) {
    return 'Gültige E-Mail-Adresse, bitte.'
  }
  if (field.minChars && trimmed.length < field.minChars) {
    const left = field.minChars - trimmed.length
    return `Noch ${left} Zeichen.`
  }
  return null
}

function isStepValid(step: Step, values: Values): boolean {
  return step.fields.every(f => {
    if (f.type === 'honeypot') return true
    if (!f.required) return true
    return isFieldFilled(f, values)
  })
}

/* ── Draft-Storage Helpers ──────────────────────────────────────────── */

function loadDraft(): DraftPayload | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as DraftPayload
    const age = Date.now() - new Date(parsed.savedAt).getTime()
    if (age > DRAFT_TTL_DAYS * 86_400_000) {
      window.localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return parsed
  } catch {
    return null
  }
}

function saveDraft(payload: DraftPayload) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    /* quota exceeded, private mode etc — silent */
  }
}

function clearDraft() {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* */
  }
}

/* ── URL-State Helpers ──────────────────────────────────────────────── */

function readStepFromURL(): number | null {
  if (typeof window === 'undefined') return null
  const sp = new URLSearchParams(window.location.search)
  const n = parseInt(sp.get('step') ?? '', 10)
  return Number.isFinite(n) && n >= 0 ? n : null
}

function syncURLToStep(idx: number) {
  if (typeof window === 'undefined') return
  const sp = new URLSearchParams(window.location.search)
  sp.set('step', String(idx))
  const url = `${window.location.pathname}?${sp.toString()}`
  window.history.replaceState({ step: idx }, '', url)
}

/* ── Wizard ──────────────────────────────────────────────────────────── */

export default function Wizard() {
  const [hydrated,  setHydrated]    = useState(false)
  const [stepIdx,   setStepIdx]     = useState(0)
  const [direction, setDirection]   = useState<1 | -1>(1)
  const [values,    setValues]      = useState<Values>({ anrede: 'du' })
  const [touched,   setTouched]     = useState<Set<string>>(new Set())
  const [attemptedAdvance, setAttemptedAdvance] = useState(false)
  const [showRestored, setShowRestored] = useState(false)
  const [state, formAction]         = useActionState<LagebildState, FormData>(submitLagebild, null)
  const [isPending, startTransition] = useTransition()

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  /* ── Mount: load draft + URL-step ──────────────────────────── */
  useEffect(() => {
    const draft = loadDraft()
    const urlStep = readStepFromURL()

    if (draft && draft.values && Object.keys(draft.values).length > 1) {
      setValues(draft.values)
      setStepIdx(urlStep ?? draft.stepIdx)
      setShowRestored(true)
      trackEvent('lagebild_draft_restored', { step: urlStep ?? draft.stepIdx })
    } else if (urlStep != null) {
      setStepIdx(urlStep)
    }
    setHydrated(true)
    trackEvent('lagebild_wizard_mount', {})
  }, [])

  /* ── Browser-Back / popstate-Listener ──────────────────────── */
  useEffect(() => {
    function onPop() {
      const urlStep = readStepFromURL()
      if (urlStep != null) {
        setDirection(urlStep > stepIdx ? 1 : -1)
        setStepIdx(urlStep)
      }
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [stepIdx])

  /* ── Debounced Save to localStorage ────────────────────────── */
  useEffect(() => {
    if (!hydrated) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      saveDraft({ values, stepIdx, savedAt: new Date().toISOString() })
    }, 400)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [values, stepIdx, hydrated])

  /* ── URL-Sync auf stepIdx ──────────────────────────────────── */
  useEffect(() => {
    if (!hydrated) return
    syncURLToStep(stepIdx)
  }, [stepIdx, hydrated])

  /* ── Step-View-Tracking ───────────────────────────────────── */
  useEffect(() => {
    if (!hydrated) return
    trackEvent('lagebild_step_view', { step: stepIdx })
  }, [stepIdx, hydrated])

  /* ── Computed ──────────────────────────────────────────────── */

  const saeulen = (values.saeulen as string[] | undefined) ?? []
  const validSaeulen = saeulen.filter((s): s is Saeule =>
    s === 'marke' || s === 'm365' || s === 'ai' || s === 'strategie',
  )
  const activeSteps = getActiveSteps(validSaeulen)
  const safeStepIdx = Math.min(stepIdx, activeSteps.length - 1)
  const currentStep = activeSteps[safeStepIdx]
  const isLast      = safeStepIdx === activeSteps.length - 1
  const canAdvance  = isStepValid(currentStep, values)

  /* ── Mutators ──────────────────────────────────────────────── */

  function setField(name: string, value: string | string[]) {
    setValues(v => ({ ...v, [name]: value }))
    // wenn user beginnt zu tippen, attempt-flag wieder runter
    setAttemptedAdvance(false)
  }

  function markTouched(name: string) {
    setTouched(prev => {
      if (prev.has(name)) return prev
      const next = new Set(prev)
      next.add(name)
      return next
    })
  }

  function next() {
    if (!canAdvance) {
      const allNames = currentStep.fields.filter(f => f.type !== 'honeypot').map(f => f.name)
      setTouched(prev => {
        const out = new Set(prev)
        allNames.forEach(n => out.add(n))
        return out
      })
      setAttemptedAdvance(true)
      trackEvent('lagebild_attempted_invalid', { step: safeStepIdx })
      return
    }
    setDirection(1)
    setStepIdx(i => Math.min(i + 1, activeSteps.length - 1))
    setAttemptedAdvance(false)
    trackEvent('lagebild_advance', { from: safeStepIdx, to: safeStepIdx + 1 })
  }

  function back() {
    setDirection(-1)
    setStepIdx(i => Math.max(i - 1, 0))
    setAttemptedAdvance(false)
    trackEvent('lagebild_back', { from: safeStepIdx, to: safeStepIdx - 1 })
  }

  function resetDraft() {
    clearDraft()
    setValues({ anrede: 'du' })
    setTouched(new Set())
    setStepIdx(0)
    setShowRestored(false)
    setAttemptedAdvance(false)
    trackEvent('lagebild_draft_reset', {})
  }

  function handleSubmit(formData: FormData) {
    trackEvent('lagebild_submit_clicked', { saeulen: validSaeulen.length })
    startTransition(() => {
      clearDraft()
      formAction(formData)
    })
  }

  /* ── Render ────────────────────────────────────────────────── */

  // SSR / pre-hydration: render leeren Container, kein flash
  if (!hydrated) {
    return (
      <div style={{ minHeight: 480, opacity: 0.4 }} aria-hidden="true">
        <div
          style={{
            height: 3,
            width: '100%',
            background: 'rgba(242, 240, 235, 0.06)',
            borderRadius: 2,
            marginBottom: 56,
          }}
        />
      </div>
    )
  }

  return (
    <form
      action={handleSubmit}
      className="relative mx-auto w-full"
      style={{ maxWidth: 720 }}
    >
      <TrustBanner />

      <AnimatePresence>
        {showRestored && (
          <RestoredBanner onReset={resetDraft} onDismiss={() => setShowRestored(false)} />
        )}
      </AnimatePresence>

      <Progress current={safeStepIdx + 1} total={activeSteps.length} />

      <div style={{ position: 'relative', minHeight: 480 }}>
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={currentStep.id}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.32, ease: EASE }}
          >
            <StepView
              step={currentStep}
              values={values}
              touched={touched}
              attemptedAdvance={attemptedAdvance}
              onChange={setField}
              onBlur={markTouched}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {isLast && <HiddenValues values={values} />}

      <AnimatePresence>
        {state && !state.ok && (
          <motion.div
            role="alert"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{    opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="font-body"
            style={{
              marginTop: 24,
              padding: '12px 16px',
              borderRadius: 6,
              background: 'var(--error-bg)',
              color: 'var(--error-fg)',
              border: '1px solid rgba(227, 114, 97, 0.32)',
              fontSize: 14,
            }}
          >
            {state.error}
          </motion.div>
        )}
      </AnimatePresence>

      <Nav
        stepIdx={safeStepIdx}
        total={activeSteps.length}
        canAdvance={canAdvance}
        isLast={isLast}
        isPending={isPending}
        onBack={back}
        onNext={next}
      />
    </form>
  )
}

const stepVariants = {
  enter:  (direction: 1 | -1) => ({ opacity: 0, x: direction * 32, filter: 'blur(2px)' }),
  center: { opacity: 1, x: 0,  filter: 'blur(0px)' },
  exit:   (direction: 1 | -1) => ({ opacity: 0, x: direction * -32, filter: 'blur(2px)' }),
}

/* ── Restored-Banner ────────────────────────────────────────────────── */

function RestoredBanner({
  onReset,
  onDismiss,
}: {
  onReset: () => void
  onDismiss: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      exit={{    opacity: 0, y: -8, height: 0 }}
      transition={{ duration: 0.32, ease: EASE }}
      style={{
        marginBottom: 32,
        padding: '12px 16px',
        borderRadius: 8,
        background: 'rgba(124, 169, 204, 0.06)',
        border: '1px solid rgba(124, 169, 204, 0.24)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap',
      }}
    >
      <span
        className="font-body"
        style={{
          fontSize: 13,
          color: 'var(--fg-default)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <RotateCcw size={14} strokeWidth={1.5} style={{ color: 'var(--info-fg)' }} />
        Letzten Entwurf wiederhergestellt.
      </span>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          type="button"
          onClick={onDismiss}
          className="font-mono"
          style={{
            fontSize: 11,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--fg-muted)',
            background: 'transparent',
            border: 'none',
            padding: '6px 10px',
            cursor: 'pointer',
          }}
        >
          OK
        </button>
        <button
          type="button"
          onClick={onReset}
          className="font-mono"
          style={{
            fontSize: 11,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--fg-default)',
            background: 'rgba(242, 240, 235, 0.06)',
            border: '1px solid rgba(242, 240, 235, 0.16)',
            borderRadius: 4,
            padding: '6px 10px',
            cursor: 'pointer',
          }}
        >
          Neu starten
        </button>
      </div>
    </motion.div>
  )
}

/* ── Progress ────────────────────────────────────────────────────────── */

function Progress({ current, total }: { current: number; total: number }) {
  const pct = (current / total) * 100
  return (
    <div style={{ marginBottom: 56 }}>
      <div
        className="font-mono"
        style={{
          fontSize: 11,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--fg-muted)',
          marginBottom: 14,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <Compass size={12} strokeWidth={1.5} />
          Lagebild · Schritt {current} von {total}
        </span>
        <motion.span
          key={Math.round(pct)}
          initial={{ opacity: 0, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: EASE }}
          style={{ color: 'var(--brand)' }}
        >
          {Math.round(pct)}%
        </motion.span>
      </div>

      <div
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Lagebild-Wizard, Schritt ${current} von ${total}`}
        style={{
          position: 'relative',
          height: 3,
          width: '100%',
          background: 'rgba(242, 240, 235, 0.06)',
          overflow: 'hidden',
          borderRadius: 2,
        }}
      >
        <motion.div
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.46, ease: EASE }}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, var(--brand) 0%, var(--cognac-300) 100%)',
            boxShadow: '0 0 12px rgba(220, 128, 68, 0.45)',
          }}
        />
      </div>

      <div style={{ marginTop: 14, display: 'flex', gap: 4 }}>
        {Array.from({ length: total }).map((_, i) => {
          const done   = i < current - 1
          const active = i === current - 1
          return (
            <motion.div
              key={i}
              initial={false}
              animate={{
                background: done
                  ? 'var(--brand)'
                  : active
                    ? 'var(--brand)'
                    : 'rgba(242, 240, 235, 0.08)',
                scale: active ? 1 : 0.7,
              }}
              transition={{ duration: 0.32, ease: EASE }}
              style={{ flex: 1, height: 2, borderRadius: 1, transformOrigin: 'left center' }}
            />
          )
        })}
      </div>
    </div>
  )
}

/* ── StepView ────────────────────────────────────────────────────────── */

function StepView({
  step,
  values,
  touched,
  attemptedAdvance,
  onChange,
  onBlur,
}: {
  step: Step
  values: Values
  touched: Set<string>
  attemptedAdvance: boolean
  onChange: (name: string, value: string | string[]) => void
  onBlur: (name: string) => void
}) {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: EASE, delay: 0.05 }}
        className="font-mono"
        style={{
          fontSize: 11,
          letterSpacing: '0.20em',
          textTransform: 'uppercase',
          color: 'var(--brand)',
          marginBottom: 16,
        }}
      >
        {step.num} · {step.title}
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.34, ease: EASE, delay: 0.08 }}
        className="font-display"
        style={{
          fontSize: 'clamp(28px, 4vw, 44px)',
          fontWeight: 600,
          lineHeight: 1.05,
          letterSpacing: '-0.022em',
          color: 'var(--fg-default)',
          marginBottom: 16,
        }}
      >
        {step.title}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.34, ease: EASE, delay: 0.12 }}
        className="font-body"
        style={{
          fontSize: 16,
          lineHeight: 1.55,
          color: 'var(--fg-muted)',
          marginBottom: 36,
          maxWidth: 560,
        }}
      >
        {step.lede}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.36, ease: EASE, delay: 0.16 }}
        style={{
          display: 'grid',
          // Mobile: 1-col automatisch (auto-fit + minmax greift, sobald
          // Container < 2×min + gap). Ab ~480px wieder 2-col.
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))',
          gap: 20,
        }}
      >
        {step.fields.map(field => {
          const showError = Boolean(
            (touched.has(field.name) || attemptedAdvance) &&
            field.type !== 'honeypot' &&
            field.required &&
            !isFieldFilled(field, values),
          )
          const errorHint = showError ? fieldErrorHint(field, values) : null
          return (
            <FieldWrap
              key={field.name}
              field={field}
              value={getFieldValue(values, field.name)}
              showError={showError}
              errorHint={errorHint}
              onChange={v => onChange(field.name, v)}
              onBlur={() => onBlur(field.name)}
            />
          )
        })}
      </motion.div>
    </div>
  )
}

/* ── FieldWrap (grid-span based on width + error props) ──────────────── */

function FieldWrap({
  field,
  value,
  showError,
  errorHint,
  onChange,
  onBlur,
}: {
  field: Field
  value: string | string[]
  showError: boolean
  errorHint: string | null
  onChange: (v: string | string[]) => void
  onBlur: () => void
}) {
  if (field.type === 'honeypot') {
    return (
      <input
        type="text"
        name={field.name}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', opacity: 0 }}
        onChange={e => onChange(e.target.value)}
        value={value as string}
      />
    )
  }

  const span =
    field.type === 'multi-select' || field.type === 'long-text' || field.width === 'full'
      ? 2
      : 1

  return (
    <div style={{ gridColumn: `span ${span}` }}>
      <FieldView
        field={field}
        value={value}
        showError={showError}
        errorHint={errorHint}
        onChange={onChange}
        onBlur={onBlur}
      />
    </div>
  )
}

/* ── FieldView ──────────────────────────────────────────────────────── */

function FieldView({
  field,
  value,
  showError,
  errorHint,
  onChange,
  onBlur,
}: {
  field: Field
  value: string | string[]
  showError: boolean
  errorHint: string | null
  onChange: (v: string | string[]) => void
  onBlur: () => void
}) {
  const labelEl = (
    <label
      htmlFor={`f-${field.name}`}
      className="font-mono"
      style={{
        display: 'block',
        fontSize: 11,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: showError ? 'var(--error-fg)' : 'var(--fg-muted)',
        marginBottom: 10,
        fontWeight: 500,
        transition: 'color 220ms',
      }}
    >
      {field.label}
      {field.required && (
        <span style={{ color: 'var(--brand)', marginLeft: 4 }}>·</span>
      )}
    </label>
  )

  const errorEl = errorHint && (
    <motion.span
      role="alert"
      aria-live="polite"
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: 1, x: 0 }}
      className="font-mono"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 11,
        color: 'var(--error-fg)',
        marginTop: 6,
      }}
    >
      <AlertCircle size={11} strokeWidth={1.75} aria-hidden="true" />
      {errorHint}
    </motion.span>
  )

  /* ── Multi-Select (Säulen-Cards) ──────────────────────────── */
  if (field.type === 'multi-select') {
    const selected = Array.isArray(value) ? value : []
    return (
      <div>
        {labelEl}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {field.options?.map((opt, i) => {
            const isSelected = selected.includes(opt.value)
            return (
              <motion.button
                key={opt.value}
                type="button"
                aria-pressed={isSelected}
                onClick={() => {
                  const next = isSelected
                    ? selected.filter(s => s !== opt.value)
                    : [...selected, opt.value]
                  onChange(next)
                  onBlur()
                }}
                whileTap={{ scale: 0.985 }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, ease: EASE, delay: 0.04 * i }}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  borderRadius: 6,
                  textAlign: 'left',
                  cursor: 'pointer',
                  background: isSelected
                    ? 'linear-gradient(135deg, rgba(220, 128, 68, 0.14) 0%, rgba(220, 128, 68, 0.04) 100%)'
                    : 'rgba(242, 240, 235, 0.04)',
                  border: `1px solid ${
                    showError && !isSelected
                      ? 'rgba(227, 114, 97, 0.40)'
                      : isSelected
                        ? 'rgba(220, 128, 68, 0.48)'
                        : 'rgba(242, 240, 235, 0.12)'
                  }`,
                  boxShadow: isSelected
                    ? '0 0 0 1px rgba(220, 128, 68, 0.24), 0 0 24px rgba(220, 128, 68, 0.12)'
                    : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  position: 'relative',
                  transition: 'background 180ms, border-color 180ms, box-shadow 180ms',
                }}
              >
                <motion.span
                  aria-hidden="true"
                  animate={{
                    scale: isSelected ? 1 : 0.9,
                    background: isSelected ? 'var(--brand)' : 'transparent',
                    borderColor: isSelected ? 'var(--brand)' : 'rgba(242, 240, 235, 0.32)',
                  }}
                  transition={{ duration: 0.22, ease: EASE }}
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 4,
                    border: '1.5px solid',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <AnimatePresence>
                    {isSelected && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{    scale: 0, opacity: 0 }}
                        transition={{ duration: 0.18, ease: EASE }}
                        style={{ color: '#0F0E0C', fontSize: 12, fontWeight: 900, lineHeight: 1 }}
                      >
                        ✓
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.span>
                <span
                  style={{
                    color: isSelected ? 'var(--fg-default)' : 'var(--fg-muted)',
                    fontWeight: isSelected ? 500 : 400,
                    transition: 'color 180ms',
                  }}
                >
                  {opt.label}
                </span>
              </motion.button>
            )
          })}
        </div>
        {errorEl && <div style={{ marginTop: 4 }}>{errorEl}</div>}
      </div>
    )
  }

  /* ── Select → Custom Dropdown ─────────────────────────────── */
  if (field.type === 'select') {
    return (
      <div>
        {labelEl}
        <Dropdown
          name={field.name}
          options={field.options ?? []}
          value={value as string}
          onChange={v => { onChange(v); onBlur() }}
          ariaLabel={field.label}
          hasError={showError}
        />
        {errorEl}
      </div>
    )
  }

  /* ── Long-Text mit Char-Counter ──────────────────────────── */
  if (field.type === 'long-text') {
    const text  = (value as string) ?? ''
    const need  = field.minChars ?? 0
    const valid = need === 0 || text.trim().length >= need
    const left  = need > 0 ? Math.max(0, need - text.trim().length) : 0
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {labelEl}
          {need > 0 && (
            <span
              className="font-mono"
              style={{
                fontSize: 11,
                letterSpacing: '0.04em',
                color: valid ? 'var(--success-fg)' : 'var(--fg-faint)',
                marginBottom: 10,
                transition: 'color 220ms',
              }}
            >
              {valid ? '✓' : `noch ${left} Zeichen`}
            </span>
          )}
        </div>
        <FocusGlowTextarea
          id={`f-${field.name}`}
          name={field.name}
          value={text}
          onChange={e => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={field.placeholder}
          hasError={showError}
        />
        {errorEl}
      </div>
    )
  }

  /* ── Text / Email / Phone ─────────────────────────────────── */
  return (
    <div>
      {labelEl}
      <FocusGlowInput
        id={`f-${field.name}`}
        name={field.name}
        type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'}
        value={value as string}
        onChange={e => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={field.placeholder}
        hasError={showError}
        autoComplete={
          field.type === 'email' ? 'email' :
          field.type === 'phone' ? 'tel' :
          field.name === 'name'  ? 'name' :
          field.name === 'firma' ? 'organization' :
          'off'
        }
      />
      {errorEl}
    </div>
  )
}

/* ── Focus-Glow Wrapper für Inputs ───────────────────────────────────── */

interface ErrorInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean
}

function FocusGlowInput({ hasError, ...props }: ErrorInputProps) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      {...props}
      onFocus={e => { setFocused(true);  props.onFocus?.(e)  }}
      onBlur={ e => { setFocused(false); props.onBlur?.(e)   }}
      style={{
        width: '100%',
        padding: '12px 14px',
        background: focused
          ? 'rgba(220, 128, 68, 0.04)'
          : hasError
            ? 'rgba(227, 114, 97, 0.04)'
            : 'rgba(242, 240, 235, 0.04)',
        border: `1px solid ${
          hasError
            ? 'rgba(227, 114, 97, 0.48)'
            : focused
              ? 'var(--brand)'
              : 'rgba(242, 240, 235, 0.12)'
        }`,
        borderRadius: 6,
        color: 'var(--fg-default)',
        fontSize: 15,
        fontFamily: 'var(--font-body)',
        outline: 'none',
        transition: 'border-color 180ms, background 180ms, box-shadow 180ms',
        boxShadow: focused
          ? '0 0 0 3px rgba(220, 128, 68, 0.12)'
          : hasError
            ? '0 0 0 3px rgba(227, 114, 97, 0.08)'
            : 'none',
      }}
    />
  )
}

interface ErrorTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean
}

function FocusGlowTextarea({ hasError, ...props }: ErrorTextareaProps) {
  const [focused, setFocused] = useState(false)
  return (
    <textarea
      {...props}
      onFocus={e => { setFocused(true);  props.onFocus?.(e)  }}
      onBlur={ e => { setFocused(false); props.onBlur?.(e)   }}
      rows={5}
      style={{
        width: '100%',
        padding: '14px 16px',
        background: focused
          ? 'rgba(220, 128, 68, 0.04)'
          : hasError
            ? 'rgba(227, 114, 97, 0.04)'
            : 'rgba(242, 240, 235, 0.04)',
        border: `1px solid ${
          hasError
            ? 'rgba(227, 114, 97, 0.48)'
            : focused
              ? 'var(--brand)'
              : 'rgba(242, 240, 235, 0.12)'
        }`,
        borderRadius: 6,
        color: 'var(--fg-default)',
        fontSize: 15,
        fontFamily: 'var(--font-body)',
        lineHeight: 1.55,
        outline: 'none',
        resize: 'vertical',
        minHeight: 120,
        transition: 'border-color 180ms, background 180ms, box-shadow 180ms',
        boxShadow: focused
          ? '0 0 0 3px rgba(220, 128, 68, 0.12)'
          : hasError
            ? '0 0 0 3px rgba(227, 114, 97, 0.08)'
            : 'none',
      }}
    />
  )
}

/* ── Hidden Values (Submit-Payload) ──────────────────────────────────── */

function HiddenValues({ values }: { values: Values }) {
  const inputs: React.ReactElement[] = []
  for (const [name, value] of Object.entries(values)) {
    if (Array.isArray(value)) {
      value.forEach((v, i) => {
        inputs.push(
          <input key={`${name}-${i}`} type="hidden" name={name} value={v} readOnly />,
        )
      })
    } else if (typeof value === 'string') {
      inputs.push(
        <input key={name} type="hidden" name={name} value={value} readOnly />,
      )
    }
  }
  return <>{inputs}</>
}

/* ── Nav ─────────────────────────────────────────────────────────────── */

function Nav({
  stepIdx,
  total: _total,
  canAdvance,
  isLast,
  isPending,
  onBack,
  onNext,
}: {
  stepIdx: number
  total: number
  canAdvance: boolean
  isLast: boolean
  isPending: boolean
  onBack: () => void
  onNext: () => void
}) {
  return (
    <div
      style={{
        marginTop: 56,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16,
        flexWrap: 'wrap',
      }}
    >
      <motion.button
        type="button"
        onClick={onBack}
        disabled={stepIdx === 0 || isPending}
        whileTap={{ scale: 0.98 }}
        className="font-mono"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '12px 20px',
          fontSize: 12,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: stepIdx === 0 ? 'var(--fg-faint)' : 'var(--fg-muted)',
          background: 'transparent',
          border: 'none',
          cursor: stepIdx === 0 ? 'not-allowed' : 'pointer',
        }}
      >
        <ArrowLeft size={14} strokeWidth={1.5} />
        Zurück
      </motion.button>

      {isLast ? (
        <SubmitButton canAdvance={canAdvance} isPending={isPending} />
      ) : (
        <motion.button
          type="button"
          onClick={onNext}
          whileHover={canAdvance ? { x: 2 } : {}}
          whileTap={canAdvance ? { scale: 0.97 } : {}}
          className="font-mono"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '14px 28px',
            fontSize: 13,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: canAdvance ? 'var(--fg-default)' : 'var(--fg-faint)',
            background: canAdvance
              ? 'rgba(242, 240, 235, 0.06)'
              : 'rgba(242, 240, 235, 0.02)',
            border: `1px solid ${canAdvance ? 'rgba(242, 240, 235, 0.22)' : 'rgba(242, 240, 235, 0.08)'}`,
            borderRadius: 6,
            cursor: 'pointer',
            fontWeight: 500,
            transition: 'border-color 180ms, background 180ms, color 180ms',
          }}
        >
          Weiter
          <ArrowRight size={14} strokeWidth={1.75} />
        </motion.button>
      )}
    </div>
  )
}

function SubmitButton({ canAdvance, isPending }: { canAdvance: boolean; isPending: boolean }) {
  return (
    <motion.button
      type="submit"
      disabled={!canAdvance || isPending}
      whileHover={canAdvance && !isPending ? { y: -1, boxShadow: '0 8px 24px rgba(200, 98, 42, 0.32)' } : {}}
      whileTap={canAdvance && !isPending ? { scale: 0.97 } : {}}
      className="font-mono"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        padding: '16px 32px',
        fontSize: 13,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: canAdvance ? '#FBF0EA' : 'rgba(251, 240, 234, 0.4)',
        background: canAdvance
          ? 'linear-gradient(135deg, #DC8044 0%, #C8622A 100%)'
          : 'rgba(200, 98, 42, 0.32)',
        border: 'none',
        borderRadius: 6,
        cursor: canAdvance && !isPending ? 'pointer' : 'not-allowed',
        fontWeight: 600,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: canAdvance ? '0 4px 16px rgba(200, 98, 42, 0.20)' : 'none',
      }}
    >
      {isPending ? (
        <>
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1, ease: 'linear', repeat: Infinity }}
            style={{ display: 'inline-flex' }}
          >
            <Loader2 size={14} strokeWidth={2} />
          </motion.span>
          <span>Briefing läuft</span>
        </>
      ) : (
        <>
          <span>Briefing anfordern</span>
          <ArrowRight size={14} strokeWidth={2.25} />
        </>
      )}
    </motion.button>
  )
}

void STEPS
