'use client'

import { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls, PerformanceMonitor, AdaptiveDpr, Preload, useScroll } from '@react-three/drei'
import { scrollBridge } from '@/lib/scrollBridge'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { SCROLL_PAGES } from '@/lib/journey'
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
      <Canvas camera={{ position: [0, 10, -238], fov: 50, near: 0.1, far: 700 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.4} color="#ffe6c4" />
        <PerformanceMonitor onDecline={() => setDegraded(true)} />
        <AdaptiveDpr pixelated />
        <Suspense fallback={null}>
          <ScrollControls pages={SCROLL_PAGES} damping={0.3}>
            <ScrollBridge />
            <PointsOfInterest />
            <BiomeController />
            <CameraRig />
            <TrailMarker />
            <SummitFlag />
            <SkyDome />
            <DistantRange />
            <Terrain />
            <Water />
            <Snow count={degraded ? 200 : 450} />
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
