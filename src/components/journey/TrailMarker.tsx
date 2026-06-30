'use client'

import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { Z_TOP, Z_BOTTOM, pathX, terrainHeight } from '@/lib/journey'

export default function TrailMarker() {
  const geometry = useMemo(() => {
    const pts: THREE.Vector3[] = []
    const steps = 140
    // empieza algo más abajo para que no aparezca como un pilar bajo la cámara
    for (let i = 0; i <= steps; i++) {
      const z = THREE.MathUtils.lerp(Z_TOP - 26, Z_BOTTOM, i / steps)
      const x = pathX(z)
      pts.push(new THREE.Vector3(x, terrainHeight(x, z) + 0.5, z))
    }
    const path = new THREE.CatmullRomCurve3(pts)
    return new THREE.TubeGeometry(path, 220, 0.5, 6, false)
  }, [])

  useEffect(() => () => geometry.dispose(), [geometry])

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color="#e8a04c"
        emissive="#e8a04c"
        emissiveIntensity={0.12}
        roughness={0.8}
      />
    </mesh>
  )
}
