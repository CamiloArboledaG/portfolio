'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { pathX, terrainHeight } from '@/lib/journey'

function colored(input: THREE.BufferGeometry, hex: string) {
  // a no-indexado para que todas las partes sean compatibles al unir.
  const geo = input.index ? input.toNonIndexed() : input
  const c = new THREE.Color(hex)
  const n = geo.attributes.position.count
  const arr = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    arr[i * 3] = c.r
    arr[i * 3 + 1] = c.g
    arr[i * 3 + 2] = c.b
  }
  geo.setAttribute('color', new THREE.BufferAttribute(arr, 3))
  return geo
}

// Pino de capas: tronco + 3 conos apilados, con su base en y=0.
// `scale` varía altura/radio y `tint` el verdor entre variantes (variedad determinista por índice).
function makePine(scale = 1, tint: [string, string, string] = ['#2c4d30', '#356139', '#3f7344']): THREE.BufferGeometry {
  return mergeGeometries([
    colored(new THREE.CylinderGeometry(0.28 * scale, 0.4 * scale, 2 * scale, 5).translate(0, 1 * scale, 0), '#5b3d28'),
    colored(new THREE.ConeGeometry(2.2 * scale, 3 * scale, 8).translate(0, 3.4 * scale, 0), tint[0]),
    colored(new THREE.ConeGeometry(1.7 * scale, 2.6 * scale, 8).translate(0, 5.1 * scale, 0), tint[1]),
    colored(new THREE.ConeGeometry(1.1 * scale, 2.1 * scale, 8).translate(0, 6.7 * scale, 0), tint[2]),
  ])
}

// Roca facetada de baja poli, gris, para los tramos altos de páramo/glaciar.
function makeRock(): THREE.BufferGeometry {
  return colored(new THREE.DodecahedronGeometry(1, 0).translate(0, 0.7, 0), '#8a8a86')
}

// Hash entero determinista → variante estable por índice (sin Math.random).
function variantOf(i: number, count: number): number {
  return (i * 2654435761) % count
}

// Frailejón: tallo grueso + roseta facetada arriba.
function makeFrailejon(): THREE.BufferGeometry {
  return mergeGeometries([
    colored(new THREE.CylinderGeometry(0.4, 0.55, 2.6, 6).translate(0, 1.3, 0), '#6b5a3a'),
    colored(new THREE.IcosahedronGeometry(1, 0).translate(0, 3, 0), '#9bA86a'),
  ])
}

// Arbusto/matorral redondeado.
function makeBush(): THREE.BufferGeometry {
  return colored(new THREE.IcosahedronGeometry(1.3, 0).translate(0, 1, 0), '#4f7a3a')
}

function scatter(count: number, zMin: number, zMax: number) {
  const m = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const up = new THREE.Vector3(0, 1, 0)
  const scl = new THREE.Vector3()
  const pos = new THREE.Vector3()
  const arr: THREE.Matrix4[] = []
  for (let i = 0; i < count; i++) {
    const z = THREE.MathUtils.lerp(zMin, zMax, Math.random())
    const side = Math.random() < 0.5 ? -1 : 1
    const x = pathX(z) + side * (9 + Math.random() * 48)
    const s = 0.7 + Math.random() * 0.9
    // geometría con base en y=0 → se apoya en la superficie
    q.setFromAxisAngle(up, Math.random() * Math.PI * 2)
    scl.set(s, s, s)
    pos.set(x, terrainHeight(x, z), z)
    m.compose(pos, q, scl)
    arr.push(m.clone())
  }
  return arr
}

function InstancedGroup({
  geometry,
  matrices,
}: {
  geometry: THREE.BufferGeometry
  matrices: THREE.Matrix4[]
}) {
  const ref = (inst: THREE.InstancedMesh | null) => {
    if (!inst) return
    matrices.forEach((mtx, i) => inst.setMatrixAt(i, mtx))
    inst.instanceMatrix.needsUpdate = true
  }
  return (
    <instancedMesh ref={ref} args={[geometry, undefined, matrices.length]}>
      <meshStandardMaterial vertexColors flatShading roughness={1} />
    </instancedMesh>
  )
}

export default function Vegetation() {
  // 3 variantes de pino (altura/radio/tinte) repartidas de forma determinista por índice.
  const pineGeoA = useMemo(() => makePine(0.85, ['#26452a', '#2f5533', '#38663c']), [])
  const pineGeoB = useMemo(() => makePine(1, ['#2c4d30', '#356139', '#3f7344']), [])
  const pineGeoC = useMemo(() => makePine(1.2, ['#33582f', '#3e6b3a', '#4c8046']), [])
  const frailejonGeo = useMemo(makeFrailejon, [])
  const bushGeo = useMemo(makeBush, [])
  const rockGeo = useMemo(makeRock, [])

  // bosque z -144..-200, páramo z -96..-144, valle z -200..-238
  const pines = useMemo(() => scatter(110, -144, -200), [])
  const frailejones = useMemo(() => scatter(60, -96, -144), [])
  const bushes = useMemo(() => scatter(80, -200, -238), [])
  // rocas dispersas en la franja alta páramo/glaciar (offset ~0.4–0.8 → z -144..-48)
  const rocks = useMemo(() => scatter(22, -48, -144), [])

  const [pinesA, pinesB, pinesC] = useMemo(() => {
    const groups: THREE.Matrix4[][] = [[], [], []]
    pines.forEach((m, i) => groups[variantOf(i, 3)].push(m))
    return groups
  }, [pines])

  return (
    <group>
      <InstancedGroup geometry={pineGeoA} matrices={pinesA} />
      <InstancedGroup geometry={pineGeoB} matrices={pinesB} />
      <InstancedGroup geometry={pineGeoC} matrices={pinesC} />
      <InstancedGroup geometry={frailejonGeo} matrices={frailejones} />
      <InstancedGroup geometry={bushGeo} matrices={bushes} />
      <InstancedGroup geometry={rockGeo} matrices={rocks} />
    </group>
  )
}
