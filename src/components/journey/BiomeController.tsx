'use client'

import { useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'
import { BIOMES } from '@/lib/journey'

const _fogA = new THREE.Color()
const _fogB = new THREE.Color()
const _fog = new THREE.Color()
const _sunB = new THREE.Color()

function biomeBlend(t: number) {
  for (let i = 0; i < BIOMES.length; i++) {
    const b = BIOMES[i]
    if (t <= b.range[1] || i === BIOMES.length - 1) {
      const next = BIOMES[Math.min(i + 1, BIOMES.length - 1)]
      const span = b.range[1] - b.range[0] || 1
      const local = THREE.MathUtils.clamp((t - b.range[0]) / span, 0, 1)
      return { from: b, to: next, local }
    }
  }
  return { from: BIOMES[0], to: BIOMES[0], local: 0 }
}

export default function BiomeController() {
  const scene = useThree((s) => s.scene)
  const scroll = useScroll()
  const lightRef = useRef<THREE.DirectionalLight>(null)

  if (!scene.fog) scene.fog = new THREE.Fog('#dfe9f2', 30, 180)

  useFrame(() => {
    const t = THREE.MathUtils.clamp(scroll.offset, 0, 1)
    const { from, to, local } = biomeBlend(t)
    _fogA.set(from.fog)
    _fogB.set(to.fog)
    _fog.copy(_fogA).lerp(_fogB, local)
    ;(scene.fog as THREE.Fog).color.copy(_fog)
    if (!(scene.background instanceof THREE.Color)) scene.background = new THREE.Color()
    ;(scene.background as THREE.Color).copy(_fog)
    if (lightRef.current) {
      lightRef.current.color.set(from.sun).lerp(_sunB.set(to.sun), local)
      lightRef.current.intensity = THREE.MathUtils.lerp(from.ambient, to.ambient, local) + 0.4
    }
  })

  return <directionalLight ref={lightRef} position={[25, 50, 15]} intensity={1.2} />
}
