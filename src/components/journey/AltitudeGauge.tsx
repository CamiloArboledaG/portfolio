'use client'

import { useEffect, useState } from 'react'
import { scrollBridge } from '@/lib/scrollBridge'
import { BIOMES } from '@/lib/journey'

// DOM overlay — must render OUTSIDE the R3F Canvas (a react-dom portal from
// inside the Canvas is reconciled by the three.js host config and throws
// "Span is not part of the THREE namespace"). Reads the scroll progress from
// scrollBridge.el (set by ScrollBridge inside the Canvas) via rAF.
export default function AltitudeGauge() {
  const [pct, setPct] = useState(0)
  const [biome, setBiome] = useState(BIOMES[0].name)

  useEffect(() => {
    let raf = 0
    const read = () => {
      const el = scrollBridge.el
      if (el) {
        const max = el.scrollHeight - el.clientHeight
        const t = max > 0 ? Math.min(Math.max(el.scrollTop / max, 0), 1) : 0
        setPct(Math.round(t * 100))
        const b = BIOMES.find((bi) => t <= bi.range[1]) ?? BIOMES[BIOMES.length - 1]
        setBiome(b.name)
      }
      raf = requestAnimationFrame(read)
    }
    raf = requestAnimationFrame(read)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div
      className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-2 pointer-events-none"
      aria-hidden="true"
    >
      <span className="text-xs font-semibold text-bark/80 capitalize">{biome}</span>
      <div className="h-40 w-1.5 rounded-full bg-bark/15 overflow-hidden flex flex-col-reverse">
        <div className="w-full bg-sage rounded-full transition-[height] duration-150" style={{ height: `${pct}%` }} />
      </div>
      <span className="text-xs font-semibold text-sage">{pct}%</span>
    </div>
  )
}
