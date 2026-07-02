'use client'

import { useState } from 'react'
import * as THREE from 'three'
import { ThreeEvent } from '@react-three/fiber'
import { pathX, terrainHeight, Z_TOP, Z_BOTTOM, SCROLL_PAGES } from '@/lib/journey'
import { scrollBridge } from '@/lib/scrollBridge'

const SIGNS = [
  { page: 1, offset: 0.22 }, // About
  { page: 2, offset: 0.45 }, // Experience
  { page: 3, offset: 0.68 }, // Projects
]

function Sign({ page, offset }: { page: number; offset: number }) {
  const [hover, setHover] = useState(false)
  const z = THREE.MathUtils.lerp(Z_BOTTOM, Z_TOP, offset / 0.85)
  const x = pathX(z) + 9
  const y = terrainHeight(x, z)

  const go = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    const el = scrollBridge.el
    if (el) el.scrollTo({ top: page * el.clientHeight, behavior: 'smooth' })
  }

  return (
    <group
      position={[x, y, z]}
      onClick={go}
      onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { setHover(false); document.body.style.cursor = '' }}
      scale={hover ? 1.12 : 1}
    >
      <mesh position={[0, 1.4, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 3, 6]} />
        <meshStandardMaterial color="#8a7a63" />
      </mesh>
      <mesh position={[0, 2.6, 0]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[1.6, 0.5, 0.08]} />
        <meshStandardMaterial color={hover ? '#6b8a52' : '#566f42'} flatShading />
      </mesh>
    </group>
  )
}

export default function PointsOfInterest() {
  void SCROLL_PAGES
  return (
    <group>
      {SIGNS.map((s) => (
        <Sign key={s.page} page={s.page} offset={s.offset} />
      ))}
    </group>
  )
}
