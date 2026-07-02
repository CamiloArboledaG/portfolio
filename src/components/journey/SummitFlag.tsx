'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { pathX, terrainHeight, Z_TOP } from '@/lib/journey'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export default function SummitFlag() {
  const flagRef = useRef<THREE.Mesh>(null)
  const reducedMotion = useReducedMotion()
  const x = pathX(Z_TOP)
  const y = terrainHeight(x, Z_TOP)

  useFrame((state) => {
    if (reducedMotion || !flagRef.current) return
    const t = state.clock.elapsedTime
    flagRef.current.rotation.y = Math.sin(t * 2) * 0.15
    flagRef.current.scale.x = 1 + Math.sin(t * 3) * 0.06
  })

  return (
    <group position={[x, y, Z_TOP]}>
      {/* cairn */}
      <mesh position={[0.8, 0.5, 0]} castShadow>
        <dodecahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial color="#6b6257" flatShading />
      </mesh>
      {/* pole */}
      <mesh position={[0, 2.4, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 5, 6]} />
        <meshStandardMaterial color="#8a7a63" />
      </mesh>
      {/* flag */}
      <mesh ref={flagRef} position={[0.75, 4.2, 0]}>
        <planeGeometry args={[1.5, 0.9]} />
        <meshStandardMaterial color="#6b8a52" side={THREE.DoubleSide} flatShading />
      </mesh>
    </group>
  )
}
