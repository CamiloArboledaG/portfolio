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
import BiomeController from './BiomeController'
import Snow from './Snow'
import Vegetation from './Vegetation'
import Wildlife from './Wildlife'
import TrailMarker from './TrailMarker'
import ContentOverlay from './ContentOverlay'
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

// Autocentrado: al soltar el scroll, encaja suavemente en la sección más cercana.
function SnapScroll() {
  const data = useScroll()
  const reducedMotion = useReducedMotion()
  useEffect(() => {
    if (reducedMotion) return
    const el = data.el
    let idleTimer: ReturnType<typeof setTimeout>
    let settleTimer: ReturnType<typeof setTimeout>
    let snapping = false
    const onScroll = () => {
      if (snapping) return
      clearTimeout(idleTimer)
      idleTimer = setTimeout(() => {
        const page = Math.round(el.scrollTop / el.clientHeight)
        const target = page * el.clientHeight
        if (Math.abs(target - el.scrollTop) < 2) return
        snapping = true
        el.scrollTo({ top: target, behavior: 'smooth' })
        clearTimeout(settleTimer)
        settleTimer = setTimeout(() => {
          snapping = false
        }, 700)
      }, 150)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      el.removeEventListener('scroll', onScroll)
      clearTimeout(idleTimer)
      clearTimeout(settleTimer)
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
      <Canvas camera={{ position: [0, 10, -238], fov: 50, near: 0.1, far: 360 }} dpr={[1, 2]}>
        <ambientLight intensity={0.6} />
        <PerformanceMonitor onDecline={() => setDegraded(true)} />
        <AdaptiveDpr pixelated />
        <Suspense fallback={null}>
          <ScrollControls pages={SCROLL_PAGES} damping={0.25}>
            <ScrollBridge />
            <SnapScroll />
            <BiomeController />
            <CameraRig />
            <TrailMarker />
            <Terrain />
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
      <LoadingScreen />
    </div>
  )
}
