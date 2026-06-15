'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronDown, Check } from 'lucide-react'

/**
 * Custom Dropdown — Brand-konsistenter Ersatz für native <select>.
 *
 * Warum nicht <select>:
 *   - Native Options werden vom OS gerendert → weiß auf weiß im Dark-Mode
 *   - Kein Animation, kein Brand-Hover-State, kein konsistentes Visual
 *
 * Features:
 *   - Animated open/close mit motion/react
 *   - Keyboard-Nav (ArrowUp/Down, Enter, Escape, Tab)
 *   - Click-Outside-Close
 *   - Hidden native input für Form-Submit (Server-Action liest daraus)
 *   - ARIA Listbox-Pattern für Screenreader
 *   - Mobile-Touch-friendly (no select-on-hover)
 */

export interface DropdownOption {
  value: string
  label: string
}

export interface DropdownProps {
  name:        string
  options:     readonly DropdownOption[]
  value:       string
  onChange:    (value: string) => void
  placeholder?: string
  ariaLabel?:   string
  hasError?:    boolean
}

export default function Dropdown({
  name,
  options,
  value,
  onChange,
  placeholder = '— Auswählen —',
  ariaLabel,
  hasError = false,
}: DropdownProps) {
  const [open, setOpen]               = useState(false)
  const [focusedIdx, setFocusedIdx]   = useState<number>(-1)
  const triggerRef                    = useRef<HTMLButtonElement>(null)
  const panelRef                      = useRef<HTMLDivElement>(null)

  const selected = options.find(o => o.value === value)

  /* ── Click-outside-close ──────────────────────────────────── */
  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      const t = e.target as Node
      if (
        triggerRef.current && !triggerRef.current.contains(t) &&
        panelRef.current   && !panelRef.current.contains(t)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  /* ── Open: focus auf erstes Option oder current ───────────── */
  useEffect(() => {
    if (open) {
      const initialIdx = value
        ? options.findIndex(o => o.value === value)
        : 0
      setFocusedIdx(initialIdx >= 0 ? initialIdx : 0)
    }
  }, [open, value, options])

  /* ── Keyboard ─────────────────────────────────────────────── */
  const handleKey = useCallback((e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault()
        setOpen(true)
      }
      return
    }

    if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
      triggerRef.current?.focus()
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocusedIdx(i => Math.min(i + 1, options.length - 1))
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocusedIdx(i => Math.max(i - 1, 0))
      return
    }
    if (e.key === 'Home') {
      e.preventDefault()
      setFocusedIdx(0)
      return
    }
    if (e.key === 'End') {
      e.preventDefault()
      setFocusedIdx(options.length - 1)
      return
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      const opt = options[focusedIdx]
      if (opt) {
        onChange(opt.value)
        setOpen(false)
        triggerRef.current?.focus()
      }
      return
    }
    if (e.key === 'Tab') {
      setOpen(false)
    }
  }, [open, options, focusedIdx, onChange])

  function pick(v: string) {
    onChange(v)
    setOpen(false)
    triggerRef.current?.focus()
  }

  return (
    <div style={{ position: 'relative', width: '100%' }} onKeyDown={handleKey}>
      {/* Hidden native input — Form-Submit liest hier */}
      <input type="hidden" name={name} value={value} readOnly />

      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          padding: '12px 14px',
          paddingRight: 40,
          background: open
            ? 'rgba(220, 128, 68, 0.08)'
            : hasError
              ? 'rgba(227, 114, 97, 0.04)'
              : 'rgba(242, 240, 235, 0.04)',
          border: `1px solid ${
            hasError && !open
              ? 'rgba(227, 114, 97, 0.48)'
              : open
                ? 'var(--brand)'
                : 'rgba(242, 240, 235, 0.12)'
          }`,
          borderRadius: 6,
          color: selected ? 'var(--fg-default)' : 'var(--fg-faint)',
          fontSize: 15,
          fontFamily: 'var(--font-body)',
          fontWeight: 400,
          textAlign: 'left',
          cursor: 'pointer',
          outline: 'none',
          transition: 'border-color 180ms, background 180ms, box-shadow 180ms',
          position: 'relative',
          boxShadow: open
            ? '0 0 0 3px rgba(220, 128, 68, 0.12)'
            : hasError
              ? '0 0 0 3px rgba(227, 114, 97, 0.08)'
              : 'none',
        }}
      >
        <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selected?.label ?? placeholder}
        </span>
        <motion.span
          aria-hidden="true"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute',
            right: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'inline-flex',
            color: open ? 'var(--brand)' : 'var(--fg-muted)',
            pointerEvents: 'none',
          }}
        >
          <ChevronDown size={16} strokeWidth={1.75} />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            role="listbox"
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{    opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: 0,
              right: 0,
              zIndex: 50,
              padding: 4,
              background: 'rgba(22, 21, 19, 0.96)',
              backdropFilter: 'blur(20px) saturate(160%)',
              WebkitBackdropFilter: 'blur(20px) saturate(160%)',
              border: '1px solid rgba(242, 240, 235, 0.12)',
              borderRadius: 8,
              boxShadow:
                '0 4px 8px rgba(0,0,0,0.45), 0 16px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(242, 240, 235, 0.06)',
              maxHeight: 320,
              overflowY: 'auto',
              transformOrigin: 'top',
            }}
          >
            {options.map((opt, idx) => {
              const isSelected = opt.value === value
              const isFocused  = idx === focusedIdx
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => pick(opt.value)}
                  onMouseEnter={() => setFocusedIdx(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    width: '100%',
                    padding: '10px 12px',
                    background: isFocused
                      ? 'rgba(220, 128, 68, 0.12)'
                      : isSelected
                        ? 'rgba(220, 128, 68, 0.06)'
                        : 'transparent',
                    border: 'none',
                    borderRadius: 5,
                    color: isSelected
                      ? 'var(--brand)'
                      : isFocused
                        ? 'var(--fg-default)'
                        : 'var(--fg-default)',
                    fontSize: 14,
                    fontFamily: 'var(--font-body)',
                    fontWeight: isSelected ? 500 : 400,
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'background 120ms, color 120ms',
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 14,
                      height: 14,
                      flexShrink: 0,
                      color: 'var(--brand)',
                    }}
                  >
                    {isSelected && <Check size={14} strokeWidth={2.5} />}
                  </span>
                  <span style={{ flex: 1 }}>{opt.label}</span>
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
