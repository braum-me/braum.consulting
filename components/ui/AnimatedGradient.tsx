interface AnimatedGradientProps {
  variant?: 'hero' | 'mesh' | 'subtle'
  className?: string
}

/**
 * Full-bleed animated background.
 * 3-4 wandernde Radial-Gradients in Brand-Farben, CSS-animation only
 * (kein JS, läuft im Compositor, keine Layout-/Paint-Kosten auf Scroll).
 *
 * `prefers-reduced-motion: reduce` stoppt die Animation komplett.
 */
export default function AnimatedGradient({
  variant = 'hero',
  className,
}: AnimatedGradientProps) {
  return (
    <div
      aria-hidden
      className={'pointer-events-none absolute inset-0 overflow-hidden ' + (className ?? '')}
      style={{ background: '#0F0E0C' }}
    >
      <div className={'ag-blob ag-blob--1 ag-' + variant} />
      <div className={'ag-blob ag-blob--2 ag-' + variant} />
      <div className={'ag-blob ag-blob--3 ag-' + variant} />
      <div className={'ag-blob ag-blob--4 ag-' + variant} />

      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: 'var(--noise-svg)',
          mixBlendMode: 'overlay',
          opacity: variant === 'subtle' ? 0.06 : 0.10,
        }}
      />
    </div>
  )
}
