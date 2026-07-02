'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export default function RevealPanel({ children, className }: { children: ReactNode; className?: string }) {
  const reducedMotion = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, scale: 0.97, y: 24 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ amount: 0.5 }}
      transition={{ duration: reducedMotion ? 0 : 0.5, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
