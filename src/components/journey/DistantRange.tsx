'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { Z_TOP } from '@/lib/journey'

function ridge(width: number, depth: number, seed: number, height: number) {
  const seg = 40
  const geo = new THREE.PlaneGeometry(width, depth, seg, 4)
  const pos = geo.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const peak =
      Math.sin(x * 0.02 + seed) * height +
      Math.sin(x * 0.06 + seed * 2) * height * 0.4 +
      Math.abs(Math.sin(x * 0.11 + seed)) * height * 0.3
    pos.setZ(i, Math.max(0, peak) * (pos.getY(i) > 0 ? 1 : 0.2))
  }
  geo.rotateX(-Math.PI / 2)
  geo.computeVertexNormals()
  return geo
}

export default function DistantRange() {
  const near = useMemo(() => ridge(600, 40, 1.3, 95), [])
  const far = useMemo(() => ridge(800, 40, 4.1, 150), [])
  return (
    <group>
      <mesh geometry={far} position={[0, -20, Z_TOP + 260]}>
        <meshStandardMaterial color="#e6ebf1" flatShading fog roughness={1} />
      </mesh>
      <mesh geometry={near} position={[0, -10, Z_TOP + 190]}>
        <meshStandardMaterial color="#d0d7de" flatShading fog roughness={1} />
      </mesh>
    </group>
  )
}
