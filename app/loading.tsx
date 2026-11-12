/**
 * Globaler Loading-State (Next.js App Router Convention).
 * Wird angezeigt während eine Route asynchron lädt (Server-Component
 * mit await, oder lazy chunks).
 *
 * Bewusst minimal: ein full-bleed dim-cover in bg-base mit einem
 * subtilen Pulsing-Brand-Glow zentral. KEINE Skeleton-Cards mehr —
 * die wurden als „Filmstreifen" wahrgenommen weil sie in einem
 * schmalen Container links rendern wenn die Page noch nicht fertig
 * gestreamt ist.
 *
 * So sieht der User nur ein einheitliches Dunkel + Brand-Atmen,
 * statt halb-gerenderte Container-Stümpfe.
 */
export default function Loading() {
  return (
    <div
      aria-label="Lädt"
      role="status"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--bg-base)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 40, // unter Nav (50), über content
      }}
    >
      {/* Subtle Brand-Glow als Atmen */}
      <div
        aria-hidden
        style={{
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(220, 128, 68, 0.18) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'loading-pulse 1.8s ease-in-out infinite',
        }}
      />

      <style>{`
        @keyframes loading-pulse {
          0%, 100% { transform: scale(0.92); opacity: 0.6; }
          50%      { transform: scale(1.08); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          [role="status"] > div { animation: none !important; }
        }
      `}</style>
    </div>
  )
}
