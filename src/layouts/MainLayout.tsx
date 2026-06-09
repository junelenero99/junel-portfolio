import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ScrollToTop } from '@/components/common/ScrollToTop'
import type { SectionId } from '@/types'

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const [activeSection, setActiveSection] = useState<SectionId>('home')

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('section[id]')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id as SectionId)
          }
        })
      },
      { rootMargin: '-40% 0px -60% 0px' }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="relative min-h-screen bg-[var(--background)]">
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-[var(--neon-cyan)] focus:px-4 focus:py-2 focus:text-[var(--background)] focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest"
      >
        Skip to main content
      </a>

      <Navbar activeSection={activeSection} />

      <main id="main-content">
        {children}
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  )
}