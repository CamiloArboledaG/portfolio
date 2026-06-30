'use client'

import dynamic from 'next/dynamic'
import { useWebGLSupport } from '@/hooks/useWebGLSupport'
import WebGLFallback from './WebGLFallback'

const JourneyCanvas = dynamic(() => import('./JourneyCanvas'), { ssr: false })

export default function JourneyExperience() {
  const webgl = useWebGLSupport()

  if (webgl === false || webgl === null) return <WebGLFallback />
  return <JourneyCanvas />
}
