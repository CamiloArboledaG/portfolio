'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { pathX, terrainHeight, Z_BOTTOM } from '@/lib/journey'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export default function Water() {
  const meshRef = useRef<THREE.Mesh>(null)
  const reducedMotion = useReducedMotion()
  const geo = useMemo(() => new THREE.PlaneGeometry(60, 90, 24, 24), [])
  const base = useMemo(() => geo.attributes.position.array.slice(0), [geo])

  const x = pathX(Z_BOTTOM)
  const y = terrainHeight(x, Z_BOTTOM) - 2.5
  const z = Z_BOTTOM + 30

  // eslint-disable-next-line react-hooks/immutability -- imperative BufferGeometry vertex animation is the standard r3f pattern
  useFrame((state) => {
    if (reducedMotion || !meshRef.current) return
    const t = state.clock.elapsedTime
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const bx = base[i * 3]
      const bz = base[i * 3 + 1]
      pos.setZ(i, Math.sin(bx * 0.3 + t) * 0.4 + Math.cos(bz * 0.2 + t * 0.7) * 0.3)
    }
    // eslint-disable-next-line react-hooks/immutability -- flag geometry for GPU re-upload
    pos.needsUpdate = true
  })

  return (
    <mesh ref={meshRef} geometry={geo} position={[x, y, z]} rotation={[-Math.PI / 2, 0, 0]}>
      <meshStandardMaterial color="#3f6f7a" transparent opacity={0.72} flatShading metalness={0.3} roughness={0.4} />
    </mesh>
  )
}
