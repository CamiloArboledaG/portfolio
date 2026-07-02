'use client'

import { useRef } from 'react'
import { Sky } from '@react-three/drei'
import { useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function SkyDome() {
  const scroll = useScroll()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>(null)
  const sun = new THREE.Vector3()

  useFrame(() => {
    const t = THREE.MathUtils.clamp(scroll.offset, 0, 1)
    // El sol se eleva durante el ascenso y, al coronar la cumbre, desciende
    // hacia el horizonte (atardecer dorado). setK: fase final del descenso.
    const setK = THREE.MathUtils.clamp((t - 0.72) / 0.28, 0, 1)
    const climb = Math.min(t / 0.72, 1)
    const climbEl = THREE.MathUtils.lerp(5, 22, climb)
    const elevation = THREE.MathUtils.lerp(climbEl, 2, setK) * (Math.PI / 180)
    // El mirador aéreo mira hacia -z, así que en la cumbre giramos el azimut
    // para que el sol poniente quede en el horizonte que enmarca la cámara.
    const climbAz = THREE.MathUtils.lerp(150, 176, climb)
    const azimuth = THREE.MathUtils.lerp(climbAz, 258, setK) * (Math.PI / 180)
    const r = 450
    sun.set(
      r * Math.cos(elevation) * Math.cos(azimuth),
      r * Math.sin(elevation),
      r * Math.cos(elevation) * Math.sin(azimuth),
    )
    if (ref.current) {
      const u = ref.current.material.uniforms
      u.sunPosition.value.copy(sun)
      // Más turbidez/rayleigh al final → naranjas y rosas de atardecer.
      u.turbidity.value = THREE.MathUtils.lerp(8, 10, setK)
      u.rayleigh.value = THREE.MathUtils.lerp(2.5, 3.4, setK)
      u.mieCoefficient.value = THREE.MathUtils.lerp(0.005, 0.03, setK)
      u.mieDirectionalG.value = THREE.MathUtils.lerp(0.8, 0.95, setK)
    }
  })

  return <Sky ref={ref} distance={450} sunPosition={[0, 20, -100]} />
}
