import * as THREE from 'three'

export const SCROLL_PAGES = 5

// El viaje recorre el eje -z, descendiendo por un valle.
export const Z_TOP = 0
export const Z_BOTTOM = -240
export const CAM_CLEARANCE = 14

// Serpenteo suave del sendero/cámara dentro del valle.
export function pathX(z: number): number {
  return Math.sin(z * 0.025) * 14
}

// Fuente única de altura del terreno (mundo). La usan Terrain, cámara,
// vegetación y sendero para mantenerse coherentes.
export function terrainHeight(x: number, z: number): number {
  const base = THREE.MathUtils.mapLinear(z, Z_TOP, Z_BOTTOM, 70, -8)
  // paredes del valle: el terreno sube hacia los lados (montañas que enmarcan).
  const valley = (1 - Math.exp(-Math.pow(x / 55, 2))) * 90
  // micro-relieve facetado (estilo low-poly).
  const ridges =
    Math.sin(x * 0.07) * 3 +
    Math.cos(z * 0.05) * 4 +
    Math.sin(x * 0.3 + z * 0.2) * 1.6 +
    Math.sin(x * 0.18 - z * 0.11) * 2.2 +
    Math.cos(x * 0.5 + z * 0.4) * 0.9
  return base + valley + ridges
}

// Ascenso: offset 0 = valle (z = Z_BOTTOM), offset 1 = cumbre (z = Z_TOP).
export function cameraPosition(offset: number, out: THREE.Vector3): THREE.Vector3 {
  const z = THREE.MathUtils.lerp(Z_BOTTOM, Z_TOP, offset)
  const x = pathX(z)
  return out.set(x, terrainHeight(x, z) + CAM_CLEARANCE, z)
}

export function cameraTarget(offset: number, out: THREE.Vector3): THREE.Vector3 {
  // mira hacia adelante/arriba en la dirección del ascenso (hacia la cumbre).
  const z = Math.min(THREE.MathUtils.lerp(Z_BOTTOM, Z_TOP, offset) + 30, Z_TOP)
  const x = pathX(z)
  return out.set(x, terrainHeight(x, z) + CAM_CLEARANCE * 0.9, z)
}

export interface Biome {
  name: string
  range: [number, number]
  fog: string
  ambient: number
  sun: string
}

// Orden de abajo (valle, offset 0) hacia arriba (cumbre, offset 1) — ascenso.
export const BIOMES: Biome[] = [
  { name: 'valle', range: [0.0, 0.2], fog: '#9fb87a', ambient: 0.7, sun: '#ffd9a0' },
  { name: 'bosque', range: [0.2, 0.4], fog: '#6f8a64', ambient: 0.55, sun: '#cfe0b0' },
  { name: 'paramo', range: [0.4, 0.6], fog: '#c9c2a6', ambient: 0.7, sun: '#f0e2c0' },
  { name: 'glaciar', range: [0.6, 0.8], fog: '#aebfcf', ambient: 0.8, sun: '#dfe7f0' },
  { name: 'cumbre', range: [0.8, 1.0], fog: '#dfe9f2', ambient: 0.9, sun: '#fff4e0' },
]
