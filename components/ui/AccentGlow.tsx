interface AccentGlowProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'spread'
  intensity?: 'low' | 'medium' | 'high'
  className?: string
}

const POSITIONS: Record<NonNullable<AccentGlowProps['position']>, {
  one:   React.CSSProperties
  two?:  React.CSSProperties
}> = {
  'top-left': {
    one: { top: '-20%', left: '-15%', width: '60vw', height: '60vw' },
  },
  'top-right': {
    one: { top: '-20%', right: '-15%', width: '60vw', height: '60vw' },
  },
  'bottom-left': {
    one: { bottom: '-25%', left: '-15%', width: '55vw', height: '55vw' },
  },
  'bottom-right': {
    one: { bottom: '-25%', right: '-15%', width: '55vw', height: '55vw' },
  },
  'spread': {
    one: { top: '-20%', left: '-10%',   width: '55vw', height: '55vw' },
    two: { bottom: '-25%', right: '-10%', width: '50vw', height: '50vw' },
  },
}

const INTENSITY: Record<NonNullable<AccentGlowProps['intensity']>, {
  blur:    string
  opacity: number
  alphaA:  number
  alphaB:  number
}> = {
  low:    { blur: '120px', opacity: 0.45, alphaA: 0.16, alphaB: 0.10 },
  medium: { blur: '100px', opacity: 0.60, alphaA: 0.24, alphaB: 0.16 },
  high:   { blur: '90px',  opacity: 0.75, alphaA: 0.32, alphaB: 0.22 },
}

/**
 * Subtle accent-blobs als Section-Background.
 * Animiert über die globalen ag-drift-*-Keyframes.
 */
export default function AccentGlow({
  position = 'top-right',
  intensity = 'low',
  className,
}: AccentGlowProps) {
  const pos = POSITIONS[position]
  const i = INTENSITY[intensity]

  // Mask faded top + bottom edges aus, damit Blobs nicht hart abschneiden
  // wenn die Section in die nächste übergeht.
  const FADE_MASK =
    'linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)'

  return (
    <div
      aria-hidden
      className={'pointer-events-none absolute inset-0 overflow-hidden ' + (className ?? '')}
      style={{
        zIndex: 0,
        opacity: i.opacity,
        maskImage: FADE_MASK,
        WebkitMaskImage: FADE_MASK,
      }}
    >
      <div
        className="absolute"
        style={{
          ...pos.one,
          borderRadius: '50%',
          filter: `blur(${i.blur})`,
          background: `radial-gradient(circle, rgba(220, 128, 68, ${i.alphaA}) 0%, transparent 65%)`,
          animation: 'ag-drift-1 26s ease-in-out infinite',
          willChange: 'transform',
        }}
      />
      {pos.two && (
        <div
          className="absolute"
          style={{
            ...pos.two,
            borderRadius: '50%',
            filter: `blur(${i.blur})`,
            background: `radial-gradient(circle, rgba(146, 48, 30, ${i.alphaB}) 0%, transparent 65%)`,
            animation: 'ag-drift-3 32s ease-in-out infinite',
            willChange: 'transform',
          }}
        />
      )}
    </div>
  )
}
