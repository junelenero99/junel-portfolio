import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Zap } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'

// Map pathname → nav item id for active highlighting
const routeToId: Record<string, string> = {
  '/':               'home',
  '/about':          'about',
  '/experience':     'experience',
  '/projects':       'projects',
  '/education':      'education',
  '/certifications': 'certifications',
  '/resume':         'resume',
  '/contact':        'contact',
}

// Deduplicate nav items (Skills shares /about with About)
const navItems = siteConfig.nav.filter(
  (item, idx, arr) => arr.findIndex((n) => n.href === item.href) === idx
)

export function Navbar() {
  const [scrolled, setScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const activeId = routeToId[location.pathname] ?? 'home'

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Auto-close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-300',
          scrolled
            ? 'glass border-b border-[var(--neon-cyan)]/15'
            : 'bg-transparent'
        )}
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 group"
              aria-label="Junel Enero — Home"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded border border-[var(--neon-cyan)]/40 bg-[var(--neon-cyan)]/5 group-hover:border-[var(--neon-cyan)]/70 group-hover:shadow-[0_0_12px_rgba(34,211,238,0.3)] transition-all duration-300">
                <Zap className="h-4 w-4 text-[var(--neon-cyan)]" />
              </div>
              <span className="font-heading text-sm font-bold tracking-widest text-[var(--foreground)] group-hover:text-[var(--neon-cyan)] transition-colors duration-300">
                JE<span className="text-[var(--neon-cyan)]">.</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
              {navItems.slice(1).map((item) => {
                const isActive = activeId === item.id
                return (
                  <Link
                    key={item.id}
                    to={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'relative font-mono text-xs uppercase tracking-wider px-3 py-2 transition-all duration-300 rounded',
                      isActive
                        ? 'text-[var(--neon-cyan)]'
                        : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute inset-0 bg-[var(--neon-cyan)]/8 rounded border border-[var(--neon-cyan)]/20"
                        transition={{ type: 'spring', duration: 0.4 }}
                      />
                    )}
                    <span className="relative">{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Mobile toggle */}
            <button
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded border border-[var(--neon-cyan)]/20 text-[var(--muted-foreground)] hover:text-[var(--neon-cyan)] hover:border-[var(--neon-cyan)]/50 transition-all duration-200"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="fixed inset-y-0 right-0 z-40 w-72 glass border-l border-[var(--neon-cyan)]/15 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-[var(--neon-cyan)]/10">
              <span className="font-heading text-sm font-bold tracking-widest text-[var(--neon-cyan)]">
                NAVIGATION
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-[var(--muted-foreground)] hover:text-[var(--neon-cyan)] transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex flex-col p-6 gap-2 flex-1" aria-label="Mobile navigation">
              {navItems.map((item) => {
                const isActive = activeId === item.id
                return (
                  <Link
                    key={item.id}
                    to={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'font-mono text-xs uppercase tracking-wider px-4 py-3 rounded border transition-all duration-200',
                      isActive
                        ? 'text-[var(--neon-cyan)] border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/5'
                        : 'text-[var(--muted-foreground)] border-transparent hover:text-[var(--foreground)] hover:border-[var(--neon-cyan)]/20'
                    )}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            <div className="p-4 border-t border-[var(--neon-cyan)]/10">
              <p className="font-mono text-[10px] text-[var(--muted-foreground)] uppercase tracking-widest">
                <span className="text-[var(--neon-cyan)]">■</span> System Online
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/60 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
