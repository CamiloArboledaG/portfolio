'use client'

import dynamic from 'next/dynamic'
import { useWebGLSupport } from '@/hooks/useWebGLSupport'
import { useIsMobile } from '@/hooks/useIsMobile'
import WebGLFallback from './WebGLFallback'

const JourneyCanvas = dynamic(() => import('./JourneyCanvas'), { ssr: false })

export default function JourneyExperience() {
  const webgl = useWebGLSupport()
  const isMobile = useIsMobile()

  // Sin WebGL, en mobile, o mientras se determina → layout de scroll natural.
  // La escena 3D con scroll-hijack solo se monta en desktop con WebGL.
  if (webgl === false || webgl === null || isMobile === null || isMobile) {
    return <WebGLFallback />
  }
  return <JourneyCanvas />
}
