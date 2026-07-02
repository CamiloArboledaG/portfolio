'use client'

import { useThree, useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'
import { getCameraFrame } from '@/lib/journey'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const _pos = new THREE.Vector3()
const _look = new THREE.Vector3()

export default function CameraRig() {
  const camera = useThree((s) => s.camera)
  const scroll = useScroll()
  const reducedMotion = useReducedMotion()

  useFrame((state) => {
    getCameraFrame(scroll.offset, _pos, _look)
    if (!reducedMotion) {
      _pos.x += state.pointer.x * 0.5
      _pos.y += state.pointer.y * 0.25
    }
    if (reducedMotion) camera.position.copy(_pos)
    else camera.position.lerp(_pos, 0.09)
    camera.lookAt(_look)
  })

  return null
}
