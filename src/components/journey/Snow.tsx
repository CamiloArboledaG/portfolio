'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { getParticleTexture } from '@/lib/particleTexture'

export default function Snow({ count = 600 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null)
  const reducedMotion = useReducedMotion()
  const sprite = useMemo(() => getParticleTexture(), [])

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      // concentrada en los biomas nevados (z 0..-120), bien arriba del terreno
      arr[i * 3] = (Math.random() - 0.5) * 180
      arr[i * 3 + 1] = 35 + Math.random() * 80
      arr[i * 3 + 2] = -Math.random() * 130
    }
    return arr
  }, [count])

  useFrame((_, delta) => {
    if (reducedMotion || !ref.current) return
    const pos = ref.current.geometry.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < count; i++) {
      let y = pos.getY(i) - delta * 6
      if (y < 35) y = 115
      pos.setY(i, y)
    }
    pos.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={0.9}
        map={sprite}
        alphaMap={sprite}
        transparent
        depthWrite={false}
        opacity={0.85}
        sizeAttenuation
      />
    </points>
  )
}
