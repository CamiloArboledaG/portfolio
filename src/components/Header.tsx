'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Mountain } from 'lucide-react'
import { NAV_ITEMS } from '@/lib/constants'
import { scrollBridge } from '@/lib/scrollBridge'
import { SCROLL_PAGES } from '@/lib/journey'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const SECTION_INDEX: Record<string, number> = {
    '#about': 1,
    '#experience': 2,
    '#projects': 3,
    '#contact': 4,
  }

  const scrollToSection = (idx: number) => {
    const el = scrollBridge.el
    if (!el) return
    const threshold = el.scrollHeight - el.clientHeight
    const step = threshold / (SCROLL_PAGES - 1)
    // Evita que SnapScroll cancele el scroll programático de navegación.
    scrollBridge.suppressUntil = performance.now() + 900
    el.scrollTo({ top: Math.min(idx * step, threshold), behavior: 'smooth' })
  }

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const idx = SECTION_INDEX[href]
    if (!scrollBridge.el || idx === undefined) return
    e.preventDefault()
    scrollToSection(idx)
  }

  const handleHome = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!scrollBridge.el) return
    e.preventDefault()
    scrollToSection(0)
  }

  const menuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.2 },
    },
  }

  const menuItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  }

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-parchment/85 backdrop-blur-md border-b border-[var(--line)]"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <nav className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.a
            href="#"
            onClick={handleHome}
            aria-label="Ir al inicio"
            className="flex items-center gap-2 text-xl font-bold text-bark hover:text-sage transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Mountain size={20} className="text-sage" aria-hidden="true" />
            CA
          </motion.a>

          <ul className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item, index) => (
              <motion.li
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                <a
                  href={item.href}
                  onClick={(e) => handleNav(e, item.href)}
                  className="text-muted hover:text-sage transition-colors text-sm font-medium relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sage transition-all duration-300 group-hover:w-full" />
                </a>
              </motion.li>
            ))}
            <motion.li
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: NAV_ITEMS.length * 0.1 + 0.3 }}
            >
              <motion.a
                href="#contact"
                onClick={(e) => handleNav(e, '#contact')}
                className="px-4 py-2 bg-sage text-parchment rounded-lg hover:bg-[var(--sage-deep)] transition-colors text-sm font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact
              </motion.a>
            </motion.li>
          </ul>

          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-bark p-2"
            aria-label="Toggle menu"
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden mt-4 pb-4 overflow-hidden"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <ul className="flex flex-col gap-4">
                {NAV_ITEMS.map((item) => (
                  <motion.li key={item.href} variants={menuItemVariants}>
                    <a
                      href={item.href}
                      onClick={(e) => { handleNav(e, item.href); setIsMenuOpen(false) }}
                      className="text-muted hover:text-sage transition-colors text-sm font-medium block py-2"
                    >
                      {item.label}
                    </a>
                  </motion.li>
                ))}
                <motion.li variants={menuItemVariants}>
                  <a
                    href="#contact"
                    onClick={(e) => { handleNav(e, '#contact'); setIsMenuOpen(false) }}
                    className="inline-block px-4 py-2 bg-sage text-parchment rounded-lg hover:bg-[var(--sage-deep)] transition-colors text-sm font-medium"
                  >
                    Contact
                  </a>
                </motion.li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
}
