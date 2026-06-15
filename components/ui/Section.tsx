import { cn } from '@/lib/cn'

interface SectionProps {
  id?: string
  surface?: 'dark' | 'light'
  fullBleed?: boolean
  grain?: boolean
  background?: React.ReactNode
  className?: string
  children: React.ReactNode
}

export default function Section({
  id,
  surface = 'dark',
  fullBleed = false,
  grain = true,
  background,
  className,
  children,
}: SectionProps) {
  const isLight = surface === 'light'

  return (
    <section
      id={id}
      className={cn(
        'relative overflow-hidden',
        isLight ? 'surface-light' : '',
        className,
      )}
      style={{
        background: 'var(--bg-base)',
        color: 'var(--fg-default)',
      }}
    >
      {background}

      {grain && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'var(--noise-svg)',
            mixBlendMode: isLight ? 'multiply' : 'overlay',
            opacity: isLight ? 0.04 : 0.06,
            zIndex: 1,
          }}
        />
      )}

      <div
        className={cn(
          'relative z-[2]',
          fullBleed
            ? ''
            : 'mx-auto w-full max-w-[var(--container-wide)] px-6 md:px-12',
        )}
      >
        {children}
      </div>
    </section>
  )
}
