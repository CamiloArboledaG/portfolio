'use client'

import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { terrainHeight } from '@/lib/journey'

function colorAt(y: number, target: THREE.Color) {
  if (y > 95) target.set('#f5f9ff') // nieve
  else if (y > 60) target.set('#dbe2ea') // hielo
  else if (y > 30) target.set('#8a8275') // roca
  else if (y > 8) target.set('#6f8a52') // pasto alto
  else target.set('#4f7a3a') // valle
}

export default function Terrain() {
  const geometry = useMemo(() => {
    // Plano amplio que cubre el recorrido z ∈ [-250, 30] tras el translate.
    const geo = new THREE.PlaneGeometry(240, 280, 220, 280)
    geo.rotateX(-Math.PI / 2)
    geo.translate(0, 0, -110)
    const pos = geo.attributes.position as THREE.BufferAttribute
    const colors: number[] = []
    const c = new THREE.Color()
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      const y = terrainHeight(x, z)
      pos.setY(i, y)
      colorAt(y, c)
      colors.push(c.r, c.g, c.b)
    }
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
    geo.computeVertexNormals()
    return geo
  }, [])

  useEffect(() => () => geometry.dispose(), [geometry])

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial vertexColors flatShading roughness={1} metalness={0} />
    </mesh>
  )
}
