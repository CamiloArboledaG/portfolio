'use client'

import { useEffect, useState } from 'react'
import { Mountain } from 'lucide-react'

export default function LoadingScreen() {
  const [pct, setPct] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const start = performance.now()
    const dur = 1600
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min(100, ((now - start) / dur) * 100)
      setPct(p)
      if (p < 100) raf = requestAnimationFrame(tick)
      else setTimeout(() => setDone(true), 250)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-canopy transition-opacity duration-700 ${
        done ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-hidden="true"
    >
      <Mountain size={48} className="text-amber mb-6" />
      <div className="w-56 h-1.5 rounded-full bg-pine overflow-hidden">
        <div className="h-full bg-amber transition-[width] duration-200" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-4 text-stone text-sm tabular-nums">{Math.round(pct)}% — preparando la ruta</p>
    </div>
  )
}
