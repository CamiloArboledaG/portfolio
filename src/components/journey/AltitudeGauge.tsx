'use client'

import { useEffect, useState } from 'react'
import { scrollBridge } from '@/lib/scrollBridge'
import { BIOMES } from '@/lib/journey'

// DOM overlay — must render OUTSIDE the R3F Canvas (a react-dom portal from
// inside the Canvas is reconciled by the three.js host config and throws
// "Span is not part of the THREE namespace"). Reads the scroll progress from
// scrollBridge.el (set by ScrollBridge inside the Canvas) via rAF.

// Punto por bioma, ubicado en el punto medio de su rango (offset 0..1).
const STOPS = BIOMES.map((b) => ({
  name: b.name,
  offset: (b.range[0] + b.range[1]) / 2,
}))

export default function AltitudeGauge() {
  // Progreso en % entero: React salta el render cuando no cambia, así el overlay
  // no se re-renderiza en cada frame del scroll (causa de jank).
  const [pct, setPct] = useState(0)
  const t = pct / 100

  useEffect(() => {
    let raf = 0
    const read = () => {
      const el = scrollBridge.el
      if (el) {
        const max = el.scrollHeight - el.clientHeight
        const p = max > 0 ? Math.min(Math.max(el.scrollTop / max, 0), 1) : 0
        setPct(Math.round(p * 100))
      }
      raf = requestAnimationFrame(read)
    }
    raf = requestAnimationFrame(read)
    return () => cancelAnimationFrame(raf)
  }, [])

  const goTo = (offset: number) => {
    const el = scrollBridge.el
    if (!el) return
    const max = el.scrollHeight - el.clientHeight
    scrollBridge.suppressUntil = performance.now() + 900
    el.scrollTo({ top: offset * max, behavior: 'smooth' })
  }

  const activeIdx = STOPS.reduce(
    (best, s, i) => (Math.abs(s.offset - t) < Math.abs(STOPS[best].offset - t) ? i : best),
    0
  )

  return (
    <div className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center">
      {/* riel: cumbre arriba (offset 1), valle abajo (offset 0) */}
      <div className="relative h-56 w-px bg-bark/15">
        {/* progreso rellena desde abajo según t */}
        <div
          className="absolute inset-x-0 bottom-0 bg-sage transition-[height] duration-150"
          style={{ height: `${t * 100}%` }}
        />
        {STOPS.map((s, i) => {
          const active = i === activeIdx
          const reached = t >= s.offset - 0.001
          return (
            <button
              key={s.name}
              type="button"
              onClick={() => goTo(s.offset)}
              aria-label={`Ir a ${s.name}`}
              aria-current={active ? 'true' : undefined}
              className="group absolute left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center"
              style={{ top: `${(1 - s.offset) * 100}%` }}
            >
              <span
                className={`block rounded-full ring-2 ring-parchment transition-all ${
                  active
                    ? 'h-3.5 w-3.5 bg-sage scale-110'
                    : reached
                      ? 'h-2.5 w-2.5 bg-sage'
                      : 'h-2.5 w-2.5 bg-bark/25'
                }`}
              />
              <span
                className={`absolute right-full mr-2 whitespace-nowrap text-xs font-semibold capitalize transition-opacity ${
                  active ? 'text-sage opacity-100' : 'text-bark/70 opacity-0 group-hover:opacity-100'
                }`}
              >
                {s.name}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
