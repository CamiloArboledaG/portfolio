'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { terrainHeight } from '@/lib/journey'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { getParticleTexture } from '@/lib/particleTexture'

// Cóndor planea sobre el páramo (z ≈ -120).
const CONDOR_Z = -120
const CONDOR_Y = 62

export default function Wildlife() {
  const condor = useRef<THREE.Group>(null)
  const wingL = useRef<THREE.Mesh>(null)
  const wingR = useRef<THREE.Mesh>(null)
  const reducedMotion = useReducedMotion()
  const sprite = useMemo(() => getParticleTexture(), [])

  const fireflies = useMemo(() => {
    const arr = new Float32Array(120 * 3)
    for (let i = 0; i < 120; i++) {
      // luciérnagas en el bosque (z -150..-192), justo sobre el suelo
      const x = (Math.random() - 0.5) * 90
      const z = THREE.MathUtils.lerp(-150, -192, Math.random())
      arr[i * 3] = x
      arr[i * 3 + 1] = terrainHeight(x, z) + 1.5 + Math.random() * 6
      arr[i * 3 + 2] = z
    }
    return arr
  }, [])

  useFrame((state) => {
    if (reducedMotion || !condor.current) return
    const tm = state.clock.elapsedTime * 0.15
    condor.current.position.set(Math.cos(tm) * 34, CONDOR_Y, CONDOR_Z + Math.sin(tm) * 26)
    condor.current.rotation.y = -tm

    // aleteo sutil: diedro oscilante en ambas alas
    const flap = Math.sin(state.clock.elapsedTime * 4) * 0.18
    if (wingL.current) wingL.current.rotation.z = Math.PI / 2 + flap
    if (wingR.current) wingR.current.rotation.z = -Math.PI / 2 - flap
  })

  return (
    <group>
      <group ref={condor}>
        {/* cuerpo */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.45, 2.4, 6]} />
          <meshStandardMaterial color="#14110f" flatShading />
        </mesh>
        {/* collar blanco del cóndor andino */}
        <mesh position={[0, 0, 0.7]}>
          <torusGeometry args={[0.42, 0.14, 5, 10]} />
          <meshStandardMaterial color="#e8e3d8" flatShading />
        </mesh>
        {/* alas: conos triangulares tendidos en x, barridos atrás y con diedro */}
        <mesh ref={wingL} position={[-2.1, 0.25, -0.3]} rotation={[0.5, 0, Math.PI / 2]}>
          <coneGeometry args={[0.8, 4.4, 3]} />
          <meshStandardMaterial color="#1c1714" flatShading side={THREE.DoubleSide} />
        </mesh>
        <mesh ref={wingR} position={[2.1, 0.25, -0.3]} rotation={[0.5, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.8, 4.4, 3]} />
          <meshStandardMaterial color="#1c1714" flatShading side={THREE.DoubleSide} />
        </mesh>
      </group>

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[fireflies, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#ffd27a"
          size={1.1}
          map={sprite}
          alphaMap={sprite}
          transparent
          depthWrite={false}
          opacity={0.95}
          sizeAttenuation
        />
      </points>
    </group>
  )
}
