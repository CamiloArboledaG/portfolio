'use client'

import { useThree, useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'
import { cameraPosition, cameraTarget } from '@/lib/journey'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const _pos = new THREE.Vector3()
const _look = new THREE.Vector3()

export default function CameraRig() {
  const camera = useThree((s) => s.camera)
  const scroll = useScroll()
  const reducedMotion = useReducedMotion()

  useFrame(() => {
    const t = THREE.MathUtils.clamp(scroll.offset, 0, 1)
    cameraPosition(t, _pos)
    cameraTarget(t, _look)
    if (reducedMotion) {
      camera.position.copy(_pos)
    } else {
      camera.position.lerp(_pos, 0.1)
    }
    camera.lookAt(_look)
  })

  return null
}
