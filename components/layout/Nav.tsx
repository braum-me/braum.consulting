'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import TransitionLink from '@/components/ui/TransitionLink'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown, ArrowUpRight } from 'lucide-react'
import { motion } from 'motion/react'
import { ServiceVisual } from '@/components/ui/ServiceVisuals'
import { SERVICES } from '@/lib/services'
import { trackEvent } from '@/lib/analytics'

const MEGA_LIST_VARIANTS = {
  closed: {},
  open: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
} as const

const MEGA_CARD_VARIANTS = {
  closed: { opacity: 0, y: -10 },
  open:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
} as const

const NAV_ITEMS: Array<{ href: string; label: string; hasMega?: boolean }> = [
  { href: '/',           label: 'Home' },
  { href: '/ueber',      label: 'Über' },
  { href: '/leistungen', label: 'Leistungen', hasMega: true },
  { href: '/cases',      label: 'Portfolio' },
  { href: '/blog',       label: 'Blog' },
  { href: '/werkzeuge',  label: 'Werkzeuge' },
  { href: '/kontakt',    label: 'Kontakt' },
]

function isActive(href: string, pathname: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(href + '/')
}

export default function Nav() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const [mega, setMega] = useState(false)
  const [navHeight, setNavHeight] = useState(96)
  const headerRef = useRef<HTMLElement>(null)
  const megaCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prevScrollY = useRef(0)

  // Header-Höhe live messen — wird als top-Offset für das Mega-Sibling gebraucht
  useEffect(() => {
    const update = () => {
      if (headerRef.current) setNavHeight(headerRef.current.offsetHeight)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    // Smart-Sticky: down = hide, up = show. Top der Seite + offenes
    // Drawer/Mega → immer sichtbar. Threshold gegen Jitter beim Bouncen.
    const SHOW_THRESHOLD = 80          // Pixel-Höhe, ab der wir überhaupt verstecken
    const DELTA          = 8           // minimale Scroll-Bewegung pro Tick

    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 12)

      if (y < SHOW_THRESHOLD) {
        setHidden(false)
        prevScrollY.current = y
        return
      }

      const dy = y - prevScrollY.current
      if (Math.abs(dy) < DELTA) return

      if (dy > 0) setHidden(true)
      else        setHidden(false)

      prevScrollY.current = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMega(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  function openMega() {
    if (megaCloseTimer.current) {
      clearTimeout(megaCloseTimer.current)
      megaCloseTimer.current = null
    }
    setMega(true)
  }

  function scheduleCloseMega() {
    if (megaCloseTimer.current) clearTimeout(megaCloseTimer.current)
    megaCloseTimer.current = setTimeout(() => setMega(false), 180)
  }

  const isOverlayOpen = mega || open
  const shouldHide    = hidden && !isOverlayOpen

  return (
    <>
    <header
      ref={headerRef}
      className="site-header fixed inset-x-0 top-0 z-50 transition-[transform,backdrop-filter,background-color,border-color] duration-300"
      style={{
        backgroundColor:
          scrolled || mega ? 'rgba(15, 14, 12, 0.78)' : 'transparent',
        backdropFilter:
          scrolled || mega ? 'blur(14px) saturate(140%)' : 'none',
        WebkitBackdropFilter:
          scrolled || mega ? 'blur(14px) saturate(140%)' : 'none',
        // Keine Trennlinie zwischen Header und Mega-Menu — wirkt sonst abgekapselt
        borderBottom:
          mega
            ? '1px solid transparent'
            : scrolled
            ? '1px solid var(--border-subtle)'
            : '1px solid transparent',
        transform: shouldHide ? 'translateY(-110%)' : 'translateY(0)',
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div className="mx-auto flex w-full max-w-[var(--container-wide)] items-center justify-between px-6 py-4 md:px-12">
        <TransitionLink
          href="/"
          className="site-logo group relative flex items-center"
          aria-label="Braum Consulting, Startseite"
        >
          <Image
            src="/assets/logo/logo-04.svg"
            alt="Braum Consulting"
            width={200}
            height={100}
            priority
            unoptimized
            className="h-20 w-auto transition-[filter] duration-300 md:h-24"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background:
                'radial-gradient(60% 100% at 50% 50%, rgba(200, 98, 42, 0.30) 0%, transparent 70%)',
              filter: 'blur(20px)',
            }}
          />
        </TransitionLink>

        <nav className="hidden items-center gap-10 md:flex" aria-label="Hauptnavigation">
          {NAV_ITEMS.map(item => {
            const active = isActive(item.href, pathname)
            return item.hasMega ? (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={openMega}
                onMouseLeave={scheduleCloseMega}
                onFocus={openMega}
                onBlur={scheduleCloseMega}
              >
                <TransitionLink
                  href={item.href}
                  aria-haspopup="true"
                  aria-expanded={mega}
                  aria-controls="mega-menu-leistungen"
                  className="group/nav relative inline-flex items-center gap-1.5 font-body text-[14px] transition-colors duration-220 hover:text-[color:var(--fg-default)]"
                  style={{
                    color: active || mega ? 'var(--fg-default)' : 'var(--fg-muted)',
                    letterSpacing: '-0.005em',
                  }}
                >
                  {item.label}
                  <ChevronDown
                    size={14}
                    strokeWidth={1.5}
                    className="transition-transform duration-220"
                    style={{ transform: mega ? 'rotate(180deg)' : 'none' }}
                  />
                  <span
                    aria-hidden
                    className="absolute -bottom-1.5 left-0 h-px transition-all duration-300"
                    style={{
                      width: active || mega ? '100%' : '0%',
                      background:
                        'linear-gradient(90deg, transparent, var(--accent), transparent)',
                      boxShadow:
                        active || mega ? '0 0 8px rgba(200, 98, 42, 0.6)' : 'none',
                    }}
                  />
                </TransitionLink>
              </div>
            ) : (
              <TransitionLink
                key={item.href}
                href={item.href}
                className="group/nav relative font-body text-[14px] transition-colors duration-220 hover:text-[color:var(--fg-default)]"
                style={{
                  color: active ? 'var(--fg-default)' : 'var(--fg-muted)',
                  letterSpacing: '-0.005em',
                }}
              >
                {item.label}
                <span
                  aria-hidden
                  className="absolute -bottom-1.5 left-0 h-px transition-all duration-300 group-hover/nav:w-full"
                  style={{
                    width: active ? '100%' : '0%',
                    background:
                      'linear-gradient(90deg, transparent, var(--accent), transparent)',
                    boxShadow: active ? '0 0 8px rgba(200, 98, 42, 0.6)' : 'none',
                  }}
                />
              </TransitionLink>
            )
          })}
        </nav>

        <TransitionLink
          href="/lagebild"
          onClick={() => trackEvent('cta_lagebild_nav')}
          className="hidden items-center gap-2 px-5 py-2.5 font-body font-medium transition-transform duration-220 hover:-translate-y-px md:inline-flex"
          style={{
            fontSize: '13px',
            background: 'var(--accent)',
            color: 'var(--on-accent)',
            borderRadius: 'var(--r-sm)',
            boxShadow: 'var(--sh-1)',
          }}
        >
          Digitales Lagebild anfragen
        </TransitionLink>

        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          aria-label={open ? 'Menü schließen' : 'Menü öffnen'}
          aria-expanded={open}
          className="md:hidden inline-flex h-10 w-10 items-center justify-center"
          style={{ color: 'var(--fg-default)' }}
        >
          {open ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          className="md:hidden"
          style={{
            background: 'rgba(15, 14, 12, 0.96)',
            backdropFilter: 'blur(20px) saturate(140%)',
            WebkitBackdropFilter: 'blur(20px) saturate(140%)',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <nav
            className="mx-auto flex w-full max-w-[var(--container-wide)] flex-col gap-1 px-6 py-6"
            aria-label="Mobile Navigation"
          >
            {NAV_ITEMS.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="font-display py-3 text-[24px] font-medium transition-colors duration-220 hover:text-[color:var(--accent)]"
                style={{
                  color: 'var(--fg-default)',
                  letterSpacing: 'var(--tr-heading)',
                  lineHeight: 1.1,
                }}
              >
                {item.label}
              </Link>
            ))}

            {/* Service-Schwerpunkte auf Mobile */}
            <div
              className="mt-6 border-t pt-6"
              style={{ borderColor: 'var(--border-subtle)' }}
            >
              <p
                className="mb-4 font-mono uppercase"
                style={{
                  fontSize: 'var(--t-micro)',
                  letterSpacing: 'var(--tr-eyebrow)',
                  color: 'var(--fg-subtle)',
                }}
              >
                Schwerpunkte
              </p>
              <ul className="space-y-1">
                {SERVICES.map(s => (
                  <li key={s.slug}>
                    <Link
                      href={`/leistungen/${s.slug}`}
                      onClick={() => setOpen(false)}
                      className="inline-flex items-center gap-2 py-2 font-body transition-colors duration-220 hover:text-[color:var(--accent)]"
                      style={{
                        fontSize: 'var(--t-body)',
                        color: 'var(--fg-muted)',
                      }}
                    >
                      <span style={{ color: 'var(--brand)' }}>{s.num}</span>
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/lagebild"
              onClick={() => {
                trackEvent('cta_lagebild_nav_mobile')
                setOpen(false)
              }}
              className="mt-8 inline-flex items-center justify-center px-5 py-3 font-body font-medium"
              style={{
                fontSize: '14px',
                background: 'var(--accent)',
                color: 'var(--on-accent)',
                borderRadius: 'var(--r-sm)',
                boxShadow: 'var(--sh-1)',
              }}
            >
              Digitales Lagebild anfragen
            </Link>
          </nav>
        </div>
      )}
    </header>

    {/* ── Mega-Menu als Sibling ─────────────────────────────────────────────
        Außerhalb von <header>, damit der eigene backdrop-filter nicht durch
        den Header-Filter isoliert wird — sonst greift der Blur nicht auf den
        Seiten-Content durch. Position: fixed, top = gemessene Header-Höhe. */}
    <div
      id="mega-menu-leistungen"
      role="region"
      aria-label="Leistungen-Übersicht"
      aria-hidden={!mega}
      inert={!mega}
      className="pointer-events-none fixed inset-x-0 hidden overflow-hidden md:block"
      style={{
        top: navHeight,
        zIndex: 49,
        maxHeight: mega ? '760px' : '0',
        opacity:   mega ? 1     : 0,
        transform: shouldHide ? 'translateY(-110%)' : 'translateY(0)',
        transition:
          'max-height 320ms cubic-bezier(0.16, 1, 0.3, 1), opacity 220ms ease, transform 300ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      onMouseEnter={openMega}
      onMouseLeave={scheduleCloseMega}
    >
      <div
        className="pointer-events-auto"
        style={{
          // Weniger opak als Header (0.55 statt 0.78) damit der echte Blur
          // sichtbar arbeitet — backdrop-filter greift jetzt auf Page-Content
          background:        'rgba(15, 14, 12, 0.55)',
          backdropFilter:        'blur(28px) saturate(160%)',
          WebkitBackdropFilter:  'blur(28px) saturate(160%)',
          borderBottom: '1px solid var(--border-subtle)',
          boxShadow:    '0 24px 48px -16px rgba(0, 0, 0, 0.55)',
        }}
      >
        <div className="mx-auto w-full max-w-[var(--container-wide)] px-6 py-10 md:px-12 md:py-12">
          <motion.div
            className="grid grid-cols-1 gap-4 md:grid-cols-4"
            variants={MEGA_LIST_VARIANTS}
            initial="closed"
            animate={mega ? 'open' : 'closed'}
          >
            {SERVICES.map(s => {
              const Icon = s.icon
              return (
                <motion.div
                  key={s.slug}
                  variants={MEGA_CARD_VARIANTS}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full"
                >
                <Link
                  href={`/leistungen/${s.slug}`}
                  onClick={() => setMega(false)}
                  data-cursor="card"
                  data-cursor-label="öffnen"
                  className="mega-card glass-card group relative flex h-full flex-col overflow-hidden"
                >
                  {/* Hover-Glow Ring */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background:
                        'radial-gradient(80% 90% at 50% 0%, rgba(220, 128, 68, 0.20) 0%, transparent 65%)',
                      zIndex: 6,
                    }}
                  />
                  {/* Accent-Line oben — wächst on hover */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute left-0 top-0 h-px"
                    style={{
                      width: '100%',
                      background:
                        'linear-gradient(90deg, transparent 0%, var(--accent) 50%, transparent 100%)',
                      transform: 'scaleX(0)',
                      transformOrigin: 'left center',
                      transition: 'transform 480ms cubic-bezier(0.16, 1, 0.3, 1)',
                      zIndex: 7,
                    }}
                  />

                  {/* Visual-Stage oben */}
                  <div
                    className="relative w-full overflow-hidden"
                    style={{
                      aspectRatio: '16 / 10',
                      borderBottom: '1px solid var(--border-subtle)',
                      background:
                        'radial-gradient(75% 90% at 50% 50%, rgba(146, 48, 30, 0.16) 0%, rgba(15, 14, 12, 0.6) 60%, var(--bg-base) 100%)',
                    }}
                  >
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0"
                      style={{
                        backgroundImage: 'var(--noise-svg)',
                        mixBlendMode: 'overlay',
                        opacity: 0.06,
                      }}
                    />
                    <ServiceVisual slug={s.slug} />
                  </div>

                  <div className="relative z-[3] flex flex-1 flex-col p-5 md:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className="inline-flex h-10 w-10 items-center justify-center transition-all duration-300 group-hover:bg-[rgba(200,98,42,0.16)] group-hover:scale-110 group-hover:rotate-3"
                        style={{
                          background: 'var(--bg-overlay)',
                          borderRadius: 'var(--r-sm)',
                          color: 'var(--brand)',
                        }}
                      >
                        <Icon size={18} strokeWidth={1.5} />
                      </span>
                      <ArrowUpRight
                        size={16}
                        strokeWidth={1.5}
                        className="opacity-30 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        style={{ color: 'var(--accent)' }}
                      />
                    </div>

                    <p
                      className="mt-4 font-mono uppercase"
                      style={{
                        fontSize: 'var(--t-micro)',
                        letterSpacing: 'var(--tr-eyebrow)',
                        color: 'var(--brand)',
                      }}
                    >
                      {s.num}
                    </p>
                    <h3
                      className="mt-2 font-display font-semibold leading-tight"
                      style={{
                        fontSize: 'var(--t-h4)',
                        letterSpacing: 'var(--tr-heading)',
                        color: 'var(--fg-default)',
                      }}
                    >
                      {s.title}
                    </h3>
                    <p
                      className="mt-2 font-body"
                      style={{
                        fontSize: 'var(--t-body-sm)',
                        lineHeight: 1.5,
                        color: 'var(--fg-muted)',
                      }}
                    >
                      {s.short}
                    </p>

                    <div
                      className="mt-auto flex items-center gap-2 border-t pt-4 font-mono uppercase"
                      style={{
                        fontSize: '10px',
                        letterSpacing: 'var(--tr-eyebrow)',
                        color: 'var(--fg-subtle)',
                        borderColor: 'var(--border-subtle)',
                        marginTop: 'auto',
                      }}
                    >
                      <span style={{ color: 'var(--accent)' }}>Laufzeit</span>
                      <span style={{ color: 'var(--fg-faint)' }}>·</span>
                      <span>{s.duration}</span>
                    </div>
                  </div>
                </Link>
                </motion.div>
              )
            })}
          </motion.div>

          <motion.div
            className="mt-8 flex flex-wrap items-center justify-end gap-4 border-t pt-6"
            style={{ borderColor: 'var(--border-subtle)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: mega ? 1 : 0 }}
            transition={{ duration: 0.4, delay: mega ? 0.35 : 0, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href="/leistungen"
              onClick={() => setMega(false)}
              className="inline-flex items-center gap-2 font-body transition-colors duration-220 hover:text-[color:var(--accent)]"
              style={{
                fontSize: 'var(--t-body-sm)',
                color: 'var(--fg-default)',
              }}
            >
              Alle Leistungen ansehen
              <ArrowUpRight size={14} strokeWidth={1.5} />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
    </>
  )
}
