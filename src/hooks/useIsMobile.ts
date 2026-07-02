'use client'

import { useEffect, useState } from 'react'

// null = aún sin determinar (evita flash de canvas antes del mount en SSR).
export function useIsMobile(query = '(max-width: 767px)'): boolean | null {
  const [isMobile, setIsMobile] = useState<boolean | null>(null)

  useEffect(() => {
    const mq = window.matchMedia(query)
    setIsMobile(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])

  return isMobile
}
