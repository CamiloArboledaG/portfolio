'use client'

import { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls, PerformanceMonitor, AdaptiveDpr, Preload, useScroll } from '@react-three/drei'
import { scrollBridge } from '@/lib/scrollBridge'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { SCROLL_PAGES } from '@/lib/journey'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import CameraRig from './CameraRig'
import Terrain from './Terrain'
import Water from './Water'
import BiomeController from './BiomeController'
import SkyDome from './SkyDome'
import DistantRange from './DistantRange'
import Snow from './Snow'
import Vegetation from './Vegetation'
import Wildlife from './Wildlife'
import PointsOfInterest from './PointsOfInterest'
import TrailMarker from './TrailMarker'
import SummitFlag from './SummitFlag'
import ContentOverlay from './ContentOverlay'
import AltitudeGauge from './AltitudeGauge'
import LoadingScreen from './LoadingScreen'

function ScrollBridge() {
  const data = useScroll()
  useEffect(() => {
    scrollBridge.el = data.el
    return () => {
      if (scrollBridge.el === data.el) scrollBridge.el = null
    }
  }, [data])
  return null
}

function SnapScroll() {
  const data = useScroll()
  const reducedMotion = useReducedMotion()
  useEffect(() => {
    if (reducedMotion) return
    const el = data.el
    let snapping = false
    let idle: ReturnType<typeof setTimeout>
    let release: ReturnType<typeof setTimeout>

    const snap = () => {
      if (snapping) return
      if (performance.now() < scrollBridge.suppressUntil) return
      // drei sitúa la sección i en offset i/(SCROLL_PAGES-1) y su scrollThreshold
      // es pages*clientHeight, así que el paso por sección es threshold/(pages-1),
      // no clientHeight. Snapear en clientHeight desencuadra las secciones.
      const threshold = el.scrollHeight - el.clientHeight
      const step = threshold / (SCROLL_PAGES - 1)
      const page = Math.round(el.scrollTop / step)
      const target = Math.min(page * step, threshold)
      if (Math.abs(target - el.scrollTop) < 2) return
      snapping = true
      el.scrollTo({ top: target, behavior: 'smooth' })
      clearTimeout(release)
      release = setTimeout(() => { snapping = false }, 650)
    }

    const supportsScrollEnd = 'onscrollend' in el
    const onScrollEnd = () => { if (!snapping) snap() }
    const onScroll = () => {
      if (snapping) return
      clearTimeout(idle)
      idle = setTimeout(snap, 140)
    }

    const addEventListener = (eventName: string, handler: EventListener) => {
      (el as EventTarget).addEventListener(eventName, handler, { passive: true })
    }

    const removeEventListener = (eventName: string, handler: EventListener) => {
      (el as EventTarget).removeEventListener(eventName, handler)
    }

    if (supportsScrollEnd) {
      addEventListener('scrollend', onScrollEnd as EventListener)
    } else {
      addEventListener('scroll', onScroll as EventListener)
    }

    return () => {
      removeEventListener('scrollend', onScrollEnd as EventListener)
      removeEventListener('scroll', onScroll as EventListener)
      clearTimeout(idle)
      clearTimeout(release)
    }
  }, [data, reducedMotion])
  return null
}

export default function JourneyCanvas() {
  const [degraded, setDegraded] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div className="fixed inset-0">
      <Canvas camera={{ position: [0, 10, -238], fov: 50, near: 0.1, far: 700 }} dpr={[1, 2]}>
        <ambientLight intensity={0.4} color="#ffe6c4" />
        <PerformanceMonitor onDecline={() => setDegraded(true)} />
        <AdaptiveDpr pixelated />
        <Suspense fallback={null}>
          <ScrollControls pages={SCROLL_PAGES} damping={0.25}>
            <ScrollBridge />
            <SnapScroll />
            <PointsOfInterest />
            <BiomeController />
            <CameraRig />
            <TrailMarker />
            <SummitFlag />
            <SkyDome />
            <DistantRange />
            <Terrain />
            <Water />
            <Snow count={degraded ? 200 : 600} />
            <Vegetation />
            <Wildlife />
            <ContentOverlay />
          </ScrollControls>
          {!degraded && (
            <EffectComposer>
              <Bloom intensity={0.18} luminanceThreshold={0.9} mipmapBlur />
              <Vignette eskil={false} offset={0.25} darkness={0.5} />
            </EffectComposer>
          )}
          <Preload all />
        </Suspense>
      </Canvas>
      <AltitudeGauge />
      <LoadingScreen />
    </div>
  )
}
