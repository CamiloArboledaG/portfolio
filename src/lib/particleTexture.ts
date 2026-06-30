import * as THREE from 'three'

let tex: THREE.CanvasTexture | null = null

// Textura radial suave para que las partículas (nieve, luciérnagas) sean
// puntos redondos difusos en vez de cuadrados duros.
export function getParticleTexture(): THREE.CanvasTexture {
  if (tex) return tex
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.45, 'rgba(255,255,255,0.7)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  tex = new THREE.CanvasTexture(canvas)
  return tex
}
