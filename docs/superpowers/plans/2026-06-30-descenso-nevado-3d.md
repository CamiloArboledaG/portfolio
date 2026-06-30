# "El Descenso del Nevado" — Plan de Implementación (3D)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convertir el portafolio en un viaje 3D donde el scroll desciende un nevado por 5 biomas (react-three-fiber v9), con contenido HTML sincronizado, pantalla de carga, autoescalado de calidad y fallback sin WebGL.

**Architecture:** Un `<Canvas>` cliente (`ssr:false`) con `ScrollControls` de drei envuelve la escena y un overlay HTML. Una `CatmullRomCurve3` define la ruta; `CameraRig` mueve la cámara según `useScroll().offset`. `BiomeController` interpola niebla/luz por progreso. Terreno y vegetación/fauna son procedurales. El contenido existente se reusa en `<Scroll html>`.

**Tech Stack:** Next.js 16, React 19, Tailwind 4, framer-motion, three ≥0.156, @react-three/fiber@9, @react-three/drei, @react-three/postprocessing.

## Global Constraints

- **NO ejecutar `git commit`** (regla del usuario). Pasos de commit documentados pero NO ejecutados; el usuario commitea.
- **NO ejecutar `eslint --fix`** sin autorización.
- **Sin framework de tests.** Verificación por tarea = `pnpm build` limpio + checkpoint visual humano (el agente no ve el render; reportar qué debe verse y pedir confirmación). NO inventar tests unitarios.
- Spec de referencia: `docs/superpowers/specs/2026-06-30-descenso-nevado-3d-design.md`.
- react-three-fiber v9 pairs con React 19; three ≥0.156; Next requiere `transpilePackages: ['three']`.
- El `<Canvas>` y todo lo 3D es decorativo → `aria-hidden="true"`. Texto/links viven en overlay HTML con su ARIA actual.
- Toda animación continua (cámara por frame, partículas) se desactiva bajo `useReducedMotion` (hook existente en `src/hooks/useReducedMotion.ts`, retorna boolean).
- Paleta UI (overlay), tokens Tailwind ya existentes: `canopy #1a2e1f, pine #2d4a35, moss #5a8a5c, fern #8fbf6f, amber #e8a04c, clay #c4733d, mist #eef2e9, stone #9aa896`.
- 5 biomas por rango de scroll `t`: Cumbre nevada [0–0.2] Hero, Glaciar [0.2–0.4] About, Páramo [0.4–0.6] Experience, Bosque [0.6–0.8] Projects, Valle [0.8–1.0] Contact.
- Gestor de paquetes: `pnpm`.
- **Modelos 3D:** vegetación/fauna se implementa PROCEDURAL (geometría en código). Sourcing de GLB con licencia queda fuera del alcance autónomo y se documenta como follow-up (Task 9). No bloquear el build por falta de GLB.

---

### Task 1: Dependencias, config y canvas vacío montado

**Files:**
- Modify: `package.json` (vía pnpm add)
- Modify: `next.config.ts`
- Create: `src/hooks/useWebGLSupport.ts`
- Create: `src/components/journey/JourneyCanvas.tsx`
- Create: `src/lib/journey.ts`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Produces: `useWebGLSupport(): boolean | null` (null = aún no determinado, client-only). `JourneyCanvas` default export (monta `<Canvas>` con `ScrollControls`). `src/lib/journey.ts` exporta `SCROLL_PAGES = 5` y `CAMERA_CURVE: THREE.CatmullRomCurve3`.

- [ ] **Step 1: Instalar dependencias**

Run:
```bash
pnpm add three@^0.171.0 @react-three/fiber@^9.0.0 @react-three/drei@^10.0.0 @react-three/postprocessing@^3.0.0
pnpm add -D @types/three
```
Expected: instala sin errores de peer (React 19 satisface fiber@9). Si drei@^10 no resuelve, usar la última `@react-three/drei@latest` compatible con fiber@9.

- [ ] **Step 2: Configurar Next para transpilar three**

Leer `next.config.ts`. Añadir `transpilePackages: ['three']` al objeto de config. Ejemplo de resultado:
```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['three'],
}

export default nextConfig
```
(Conservar cualquier opción ya presente en el archivo; solo añadir la clave.)

- [ ] **Step 3: Crear hook de detección WebGL**

Create `src/hooks/useWebGLSupport.ts`:
```ts
'use client'

import { useEffect, useState } from 'react'

export function useWebGLSupport(): boolean | null {
  const [supported, setSupported] = useState<boolean | null>(null)

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl =
        canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl')
      setSupported(!!gl)
    } catch {
      setSupported(false)
    }
  }, [])

  return supported
}
```

- [ ] **Step 4: Crear definición de viaje (curva + constantes)**

Create `src/lib/journey.ts`:
```ts
import * as THREE from 'three'

export const SCROLL_PAGES = 5

// Ruta de descenso: empieza alto (cumbre) y baja serpenteando al valle.
// y desciende monotónicamente; x/z serpentean para dar sensación de sendero.
export const CAMERA_CURVE = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(0, 60, 40),
    new THREE.Vector3(-15, 48, 20),
    new THREE.Vector3(12, 36, 0),
    new THREE.Vector3(-10, 24, -22),
    new THREE.Vector3(8, 12, -44),
    new THREE.Vector3(0, 4, -66),
  ],
  false,
  'catmullrom',
  0.5,
)

export interface Biome {
  name: string
  range: [number, number]
  fog: string
  ambient: number
  sun: string
}

export const BIOMES: Biome[] = [
  { name: 'cumbre', range: [0.0, 0.2], fog: '#dfe9f2', ambient: 0.9, sun: '#fff4e0' },
  { name: 'glaciar', range: [0.2, 0.4], fog: '#aebfcf', ambient: 0.8, sun: '#dfe7f0' },
  { name: 'paramo', range: [0.4, 0.6], fog: '#c9c2a6', ambient: 0.7, sun: '#f0e2c0' },
  { name: 'bosque', range: [0.6, 0.8], fog: '#5f7d5a', ambient: 0.55, sun: '#cfe0b0' },
  { name: 'valle', range: [0.8, 1.0], fog: '#9fb87a', ambient: 0.7, sun: '#ffd9a0' },
]
```

- [ ] **Step 5: Crear JourneyCanvas con canvas vacío + ScrollControls**

Create `src/components/journey/JourneyCanvas.tsx`:
```tsx
'use client'

import { Canvas } from '@react-three/fiber'
import { ScrollControls } from '@react-three/drei'
import { SCROLL_PAGES } from '@/lib/journey'

export default function JourneyCanvas() {
  return (
    <div className="fixed inset-0 -z-10" aria-hidden="true">
      <Canvas camera={{ position: [0, 60, 40], fov: 55, near: 0.1, far: 400 }} dpr={[1, 2]}>
        <color attach="background" args={['#dfe9f2']} />
        <ambientLight intensity={0.9} />
        <directionalLight position={[20, 40, 10]} intensity={1.2} />
        <ScrollControls pages={SCROLL_PAGES} damping={0.25}>
          <mesh position={[0, 30, 0]}>
            <boxGeometry args={[6, 6, 6]} />
            <meshStandardMaterial color="#e8a04c" />
          </mesh>
        </ScrollControls>
      </Canvas>
    </div>
  )
}
```

- [ ] **Step 6: Montar en page.tsx (client, ssr:false)**

Replace `src/app/page.tsx`:
```tsx
'use client'

import dynamic from 'next/dynamic'
import Header from '@/components/Header'

const JourneyCanvas = dynamic(() => import('@/components/journey/JourneyCanvas'), {
  ssr: false,
})

export default function Home() {
  return (
    <>
      <Header />
      <JourneyCanvas />
    </>
  )
}
```
(Esto deja temporalmente fuera las secciones de contenido; vuelven en Task 6 dentro del overlay. El objetivo de esta tarea es solo el andamiaje 3D.)

- [ ] **Step 7: Verificar build**

Run: `pnpm build`
Expected: compila sin errores de tipo. (El canvas es client-only; el build no lo prerenderiza.)

- [ ] **Step 8: Checkpoint visual (humano)**

Run: `pnpm dev` → abrir `http://localhost:3000`.
Expected: fondo azul claro con un cubo ámbar; al scrollear, la página tiene altura de 5 "páginas" (scrollbar). El Header sigue visible. PEDIR AL USUARIO que confirme que ve el cubo y puede scrollear.

- [ ] **Step 9: Commit (NO ejecutar)**

```bash
git add package.json pnpm-lock.yaml next.config.ts src/hooks/useWebGLSupport.ts src/components/journey/JourneyCanvas.tsx src/lib/journey.ts src/app/page.tsx
git commit -m "feat: andamiaje 3D con r3f y ScrollControls"
```

---

### Task 2: Cámara que desciende la curva + sendero visible

**Files:**
- Create: `src/components/journey/CameraRig.tsx`
- Create: `src/components/journey/TrailMarker.tsx`
- Modify: `src/components/journey/JourneyCanvas.tsx`

**Interfaces:**
- Consumes: `CAMERA_CURVE` de `src/lib/journey.ts`, `useReducedMotion`.
- Produces: `CameraRig` default export (componente sin props; dentro de `<ScrollControls>` y `<Canvas>`). `TrailMarker` default export (línea/estela del sendero a lo largo de la curva).

- [ ] **Step 1: Crear CameraRig**

Create `src/components/journey/CameraRig.tsx`:
```tsx
'use client'

import { useThree, useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'
import { CAMERA_CURVE } from '@/lib/journey'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const _pos = new THREE.Vector3()
const _look = new THREE.Vector3()

export default function CameraRig() {
  const camera = useThree((s) => s.camera)
  const scroll = useScroll()
  const reducedMotion = useReducedMotion()

  useFrame(() => {
    const t = THREE.MathUtils.clamp(scroll.offset, 0, 1)
    CAMERA_CURVE.getPointAt(t, _pos)
    CAMERA_CURVE.getPointAt(Math.min(t + 0.04, 1), _look)
    if (reducedMotion) {
      camera.position.copy(_pos)
    } else {
      camera.position.lerp(_pos, 0.1)
    }
    camera.lookAt(_look)
  })

  return null
}
```

- [ ] **Step 2: Crear TrailMarker (sendero visible a lo largo de la curva)**

Create `src/components/journey/TrailMarker.tsx`. Dibuja un tubo ámbar tenue
siguiendo la curva, ligeramente por debajo de la línea de cámara, como estela/sendero:
```tsx
'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { CAMERA_CURVE } from '@/lib/journey'

export default function TrailMarker() {
  const geometry = useMemo(() => {
    // curva desplazada hacia abajo para que se vea como sendero bajo la cámara
    const pts = CAMERA_CURVE.getPoints(120).map(
      (p) => new THREE.Vector3(p.x, p.y - 6, p.z),
    )
    const path = new THREE.CatmullRomCurve3(pts)
    return new THREE.TubeGeometry(path, 160, 0.35, 6, false)
  }, [])

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color="#e8a04c" emissive="#e8a04c" emissiveIntensity={0.3} roughness={0.7} />
    </mesh>
  )
}
```

- [ ] **Step 3: Insertar CameraRig, TrailMarker y puntos de referencia en JourneyCanvas**

En `src/components/journey/JourneyCanvas.tsx`, importar `CameraRig` y `TrailMarker` y, para verificar el movimiento, colocar cubos de referencia. Reemplazar el contenido de `<ScrollControls>`:
```tsx
<ScrollControls pages={SCROLL_PAGES} damping={0.25}>
  <CameraRig />
  <TrailMarker />
  {[60, 48, 36, 24, 12, 4].map((y, i) => (
    <mesh key={i} position={[i % 2 === 0 ? 8 : -8, y, -i * 12]}>
      <boxGeometry args={[3, 3, 3]} />
      <meshStandardMaterial color="#e8a04c" />
    </mesh>
  ))}
</ScrollControls>
```
Imports: `import CameraRig from './CameraRig'` y `import TrailMarker from './TrailMarker'`.

- [ ] **Step 4: Verificar build**

Run: `pnpm build`
Expected: compila sin errores.

- [ ] **Step 5: Checkpoint visual (humano)**

Run: `pnpm dev`. Al hacer scroll, la cámara debe descender pasando junto a los cubos siguiendo el sendero ámbar (tubo) hacia abajo. PEDIR confirmación de que el scroll mueve la cámara hacia abajo de forma fluida y se ve el sendero.

- [ ] **Step 6: Commit (NO ejecutar)**

```bash
git add src/components/journey/CameraRig.tsx src/components/journey/TrailMarker.tsx src/components/journey/JourneyCanvas.tsx
git commit -m "feat: camara desciende la curva con sendero visible"
```

---

### Task 3: Terreno procedural del nevado (sombreado por altitud)

**Files:**
- Create: `src/components/journey/Terrain.tsx`
- Modify: `src/components/journey/JourneyCanvas.tsx`

**Interfaces:**
- Produces: `Terrain` default export (malla del terreno; va dentro de `<Canvas>`).

- [ ] **Step 1: Crear Terrain**

Create `src/components/journey/Terrain.tsx`. Genera un plano grande deformado por ruido seno-acumulado (sin dependencias de ruido externas) y colorea por altura (nieve→roca→pasto) con vertex colors:
```tsx
'use client'

import { useMemo } from 'react'
import * as THREE from 'three'

function heightAt(x: number, z: number): number {
  // colina/montaña: alto cerca del inicio (z grande), baja hacia el valle (z negativo)
  const base = THREE.MathUtils.mapLinear(z, 60, -80, 70, -2)
  const ridges =
    Math.sin(x * 0.06) * 6 +
    Math.cos(z * 0.05) * 8 +
    Math.sin((x + z) * 0.09) * 4 +
    Math.cos((x - z) * 0.13) * 2.5
  return base + ridges
}

function colorAt(y: number, target: THREE.Color) {
  if (y > 45) target.set('#f5f9ff') // nieve
  else if (y > 28) target.set('#d8dee6') // nieve sucia / hielo
  else if (y > 14) target.set('#8a8275') // roca
  else if (y > 4) target.set('#6f7d4f') // pasto alto
  else target.set('#5f7d3a') // valle
}

export default function Terrain() {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(220, 260, 200, 240)
    geo.rotateX(-Math.PI / 2)
    const pos = geo.attributes.position as THREE.BufferAttribute
    const colors: number[] = []
    const c = new THREE.Color()
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      const y = heightAt(x, z)
      pos.setY(i, y)
      colorAt(y, c)
      colors.push(c.r, c.g, c.b)
    }
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
    geo.computeVertexNormals()
    return geo
  }, [])

  return (
    <mesh geometry={geometry} position={[0, 0, -10]} receiveShadow>
      <meshStandardMaterial vertexColors flatShading roughness={0.95} metalness={0} />
    </mesh>
  )
}
```

- [ ] **Step 2: Montar Terrain y quitar cubos de referencia**

En `JourneyCanvas.tsx`, importar `Terrain` y reemplazar los cubos de referencia (el `.map` de cubos) por `<Terrain />`. Mantener `<CameraRig />`. Resultado del contenido de `<ScrollControls>`:
```tsx
<ScrollControls pages={SCROLL_PAGES} damping={0.25}>
  <CameraRig />
  <Terrain />
</ScrollControls>
```
Añadir import: `import Terrain from './Terrain'`.

- [ ] **Step 3: Verificar build**

Run: `pnpm build`
Expected: compila sin errores.

- [ ] **Step 4: Checkpoint visual (humano)**

Run: `pnpm dev`. Debe verse una ladera: blanca (nieve) arriba, gris roca en medio, verde abajo; la cámara desciende sobre ella al scrollear. PEDIR confirmación.

- [ ] **Step 5: Commit (NO ejecutar)**

```bash
git add src/components/journey/Terrain.tsx src/components/journey/JourneyCanvas.tsx
git commit -m "feat: terreno procedural del nevado"
```

---

### Task 4: BiomeController (niebla/luz interpoladas) + nieve

**Files:**
- Create: `src/components/journey/BiomeController.tsx`
- Create: `src/components/journey/Snow.tsx`
- Modify: `src/components/journey/JourneyCanvas.tsx`

**Interfaces:**
- Consumes: `BIOMES` de `src/lib/journey.ts`, `useScroll`, `useReducedMotion`.
- Produces: `BiomeController` default export (sin props, dentro de `<Canvas>`+`<ScrollControls>`; controla `scene.fog`, `scene.background` y una luz). `Snow` default export (partículas).

- [ ] **Step 1: Crear BiomeController**

Create `src/components/journey/BiomeController.tsx`:
```tsx
'use client'

import { useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'
import { BIOMES } from '@/lib/journey'

const _fogA = new THREE.Color()
const _fogB = new THREE.Color()
const _fog = new THREE.Color()

function biomeBlend(t: number) {
  for (let i = 0; i < BIOMES.length; i++) {
    const b = BIOMES[i]
    if (t <= b.range[1] || i === BIOMES.length - 1) {
      const next = BIOMES[Math.min(i + 1, BIOMES.length - 1)]
      const span = b.range[1] - b.range[0] || 1
      const local = THREE.MathUtils.clamp((t - b.range[0]) / span, 0, 1)
      return { from: b, to: next, local }
    }
  }
  return { from: BIOMES[0], to: BIOMES[0], local: 0 }
}

export default function BiomeController() {
  const scene = useThree((s) => s.scene)
  const scroll = useScroll()
  const lightRef = useRef<THREE.DirectionalLight>(null)

  if (!scene.fog) scene.fog = new THREE.Fog('#dfe9f2', 30, 180)

  useFrame(() => {
    const t = THREE.MathUtils.clamp(scroll.offset, 0, 1)
    const { from, to, local } = biomeBlend(t)
    _fogA.set(from.fog)
    _fogB.set(to.fog)
    _fog.copy(_fogA).lerp(_fogB, local)
    ;(scene.fog as THREE.Fog).color.copy(_fog)
    scene.background = _fog.clone()
    if (lightRef.current) {
      lightRef.current.color.set(from.sun).lerp(new THREE.Color(to.sun), local)
      lightRef.current.intensity = THREE.MathUtils.lerp(from.ambient, to.ambient, local) + 0.4
    }
  })

  return <directionalLight ref={lightRef} position={[25, 50, 15]} intensity={1.2} />
}
```

- [ ] **Step 2: Crear Snow (partículas)**

Create `src/components/journey/Snow.tsx`:
```tsx
'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export default function Snow({ count = 600 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null)
  const reducedMotion = useReducedMotion()

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 160
      arr[i * 3 + 1] = Math.random() * 80
      arr[i * 3 + 2] = (Math.random() - 0.5) * 200 - 10
    }
    return arr
  }, [count])

  useFrame((_, delta) => {
    if (reducedMotion || !ref.current) return
    const pos = ref.current.geometry.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < count; i++) {
      let y = pos.getY(i) - delta * 6
      if (y < 0) y = 80
      pos.setY(i, y)
    }
    pos.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.5} sizeAttenuation transparent opacity={0.8} />
    </points>
  )
}
```

- [ ] **Step 3: Montar en JourneyCanvas**

En `JourneyCanvas.tsx`: importar `BiomeController` y `Snow`. Quitar el `<color attach="background" .../>` estático y la `directionalLight` estática (los gestiona BiomeController). Mantener `ambientLight`. Resultado:
```tsx
<Canvas camera={{ position: [0, 60, 40], fov: 55, near: 0.1, far: 400 }} dpr={[1, 2]}>
  <ambientLight intensity={0.6} />
  <ScrollControls pages={SCROLL_PAGES} damping={0.25}>
    <BiomeController />
    <CameraRig />
    <Terrain />
    <Snow />
  </ScrollControls>
</Canvas>
```
Imports: `import BiomeController from './BiomeController'` y `import Snow from './Snow'`.

- [ ] **Step 4: Verificar build**

Run: `pnpm build`
Expected: compila sin errores.

- [ ] **Step 5: Checkpoint visual (humano)**

Run: `pnpm dev`. Al descender, el color de niebla/fondo debe transicionar suave: blanco-azul (cumbre) → gris → ocre → verde → verde cálido. Nieve cayendo arriba. PEDIR confirmación de transición sin cortes.

- [ ] **Step 6: Commit (NO ejecutar)**

```bash
git add src/components/journey/BiomeController.tsx src/components/journey/Snow.tsx src/components/journey/JourneyCanvas.tsx
git commit -m "feat: biomas con niebla/luz interpolada y nieve"
```

---

### Task 5: Vegetación y fauna procedural por bioma

**Files:**
- Create: `src/components/journey/Vegetation.tsx`
- Create: `src/components/journey/Wildlife.tsx`
- Modify: `src/components/journey/JourneyCanvas.tsx`

**Interfaces:**
- Consumes: `useReducedMotion`. Reutiliza la función de altura del terreno — para evitar acoplar, Vegetation define su propia versión simple de altura o posiciona por rango z conocido. Aquí se usan posiciones fijas por bioma para simplicidad.
- Produces: `Vegetation` default export (pinos + frailejones instanciados). `Wildlife` default export (cóndor que planea + partículas de luciérnagas/mariposas).

- [ ] **Step 1: Crear Vegetation (pinos + frailejones procedurales, instanciados)**

Create `src/components/journey/Vegetation.tsx`:
```tsx
'use client'

import { useMemo } from 'react'
import * as THREE from 'three'

function scatter(count: number, zMin: number, zMax: number, spread: number) {
  const m = new THREE.Matrix4()
  const arr: THREE.Matrix4[] = []
  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * spread
    const z = THREE.MathUtils.lerp(zMin, zMax, Math.random())
    const yBase = THREE.MathUtils.mapLinear(z, 60, -80, 70, -2)
    const s = 0.7 + Math.random() * 0.8
    m.identity()
    m.makeScale(s, s, s)
    m.setPosition(x, yBase, z - 10)
    arr.push(m.clone())
  }
  return arr
}

function InstancedGroup({
  matrices,
  children,
}: {
  matrices: THREE.Matrix4[]
  children: React.ReactNode
}) {
  const ref = (inst: THREE.InstancedMesh | null) => {
    if (!inst) return
    matrices.forEach((mtx, i) => inst.setMatrixAt(i, mtx))
    inst.instanceMatrix.needsUpdate = true
  }
  return (
    // @ts-expect-error args length is the instance count
    <instancedMesh ref={ref} args={[undefined, undefined, matrices.length]}>
      {children}
    </instancedMesh>
  )
}

export default function Vegetation() {
  // Pinos en el bioma bosque (z ~ -30..-55)
  const pines = useMemo(() => scatter(60, -28, -56, 120), [])
  // Frailejones en el páramo (z ~ -8..-28)
  const frailejones = useMemo(() => scatter(40, -6, -28, 110), [])

  return (
    <group>
      <InstancedGroup matrices={pines}>
        <coneGeometry args={[1.6, 6, 7]} />
        <meshStandardMaterial color="#2f5132" flatShading roughness={1} />
      </InstancedGroup>
      <InstancedGroup matrices={frailejones}>
        <cylinderGeometry args={[0.5, 0.7, 3, 6]} />
        <meshStandardMaterial color="#7d8a52" flatShading roughness={1} />
      </InstancedGroup>
    </group>
  )
}
```
Nota: geometría procedural simple (conos = pinos, cilindros = frailejones). Realismo se mejora luego con GLB (Task 9). El build debe pasar sin assets externos.

- [ ] **Step 2: Crear Wildlife (cóndor que planea + luciérnagas)**

Create `src/components/journey/Wildlife.tsx`:
```tsx
'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export default function Wildlife() {
  const condor = useRef<THREE.Group>(null)
  const reducedMotion = useReducedMotion()

  const fireflies = useMemo(() => {
    const arr = new Float32Array(120 * 3)
    for (let i = 0; i < 120; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 80
      arr[i * 3 + 1] = 2 + Math.random() * 10
      arr[i * 3 + 2] = THREE.MathUtils.lerp(-30, -56, Math.random())
    }
    return arr
  }, [])

  useFrame((state) => {
    if (reducedMotion || !condor.current) return
    const tm = state.clock.elapsedTime * 0.15
    // cóndor planeando en círculo sobre el páramo
    condor.current.position.set(Math.cos(tm) * 30, 30, -18 + Math.sin(tm) * 20)
    condor.current.rotation.y = -tm
  })

  return (
    <group>
      <group ref={condor}>
        {/* cóndor estilizado: cuerpo + dos alas */}
        <mesh>
          <boxGeometry args={[1.2, 0.4, 0.6]} />
          <meshStandardMaterial color="#1c1c1c" />
        </mesh>
        <mesh position={[-2, 0, 0]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[3, 0.1, 1.2]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        <mesh position={[2, 0, 0]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[3, 0.1, 1.2]} />
          <meshStandardMaterial color="#222" />
        </mesh>
      </group>

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[fireflies, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#ffe69a" size={0.4} sizeAttenuation transparent opacity={0.9} />
      </points>
    </group>
  )
}
```

- [ ] **Step 3: Montar en JourneyCanvas**

En `JourneyCanvas.tsx` añadir `<Vegetation />` y `<Wildlife />` dentro de `<ScrollControls>`, tras `<Terrain />`. Imports: `import Vegetation from './Vegetation'` y `import Wildlife from './Wildlife'`.

- [ ] **Step 4: Verificar build**

Run: `pnpm build`
Expected: compila sin errores.

- [ ] **Step 5: Checkpoint visual (humano)**

Run: `pnpm dev`. En el páramo deben verse frailejones y un cóndor planeando; en el bosque, pinos y luciérnagas. PEDIR confirmación de que aparecen en los biomas correctos.

- [ ] **Step 6: Commit (NO ejecutar)**

```bash
git add src/components/journey/Vegetation.tsx src/components/journey/Wildlife.tsx src/components/journey/JourneyCanvas.tsx
git commit -m "feat: vegetacion y fauna procedural por bioma"
```

---

### Task 6: Overlay de contenido sincronizado + restyle glass de secciones

**Files:**
- Create: `src/components/journey/ContentOverlay.tsx`
- Modify: `src/components/journey/JourneyCanvas.tsx`
- Modify: `src/components/Hero.tsx`
- Modify: `src/components/About.tsx`
- Modify: `src/components/Experience.tsx`
- Modify: `src/components/Projects.tsx`
- Modify: `src/components/Contact.tsx`

**Interfaces:**
- Consumes: las 5 secciones existentes. `<Scroll html>` de drei.
- Produces: `ContentOverlay` default export (renderiza las secciones como HTML scrolleable sincronizado dentro de `<Scroll html>`).

- [ ] **Step 1: Quitar fondos opacos de las secciones (para ver el 3D detrás)**

En cada sección, quitar/transparentar el fondo opaco y envolver el contenido legible en un panel glass. Cambios mínimos:
- `src/components/Hero.tsx`: quitar `<MountainBackdrop />` (ya no se usa el backdrop 2D; el 3D lo sustituye) y su import. La `<section>` queda sin fondo propio.
- `src/components/Experience.tsx`: `className="py-20 bg-pine"` → `className="py-20"`.
- `src/components/Contact.tsx`: `className="py-20 bg-pine"` → `className="py-20"`.
- About y Projects no tienen fondo opaco; sin cambio de fondo.
- En las 5 secciones, envolver el contenedor interno principal (`max-w-*` div) añadiendo clases glass para legibilidad: agregar `rounded-3xl bg-canopy/55 backdrop-blur-md ring-1 ring-moss/20 px-6 py-10` al div interno de cada sección (ajustar padding si ya lo tiene). El objetivo: el texto se lee sobre el 3D mediante un panel translúcido oscuro.

(Aplicar con criterio: el panel glass debe envolver el texto, no toda la pantalla. Mantener todo el contenido y ARIA existentes.)

- [ ] **Step 2: Crear ContentOverlay**

Create `src/components/journey/ContentOverlay.tsx`:
```tsx
'use client'

import { Scroll } from '@react-three/drei'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Experience from '@/components/Experience'
import Projects from '@/components/Projects'
import Contact from '@/components/Contact'

export default function ContentOverlay() {
  return (
    <Scroll html>
      <div className="w-screen">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Contact />
      </div>
    </Scroll>
  )
}
```
Nota: drei `<Scroll html>` renderiza este DOM dentro del contenedor de scroll virtual, sincronizado con la escena. El ancho debe ser `w-screen`; cada sección ya usa `min-h-screen`/`py-20`.

- [ ] **Step 2b: Asegurar alturas para sincronía**

Cada sección debe ocupar ~1 página de viewport para alinear con `SCROLL_PAGES=5`. Verificar que Hero ya usa `min-h-screen`; añadir `min-h-screen flex items-center` al `<section>` de About, Experience, Projects y Contact si no lo tienen (conservando `py-20` como respaldo). Esto alinea cada sección con su bioma.

- [ ] **Step 3: Montar ContentOverlay dentro de ScrollControls**

En `JourneyCanvas.tsx`, añadir `<ContentOverlay />` como ÚLTIMO hijo dentro de `<ScrollControls>` (después de los elementos 3D). Import: `import ContentOverlay from './ContentOverlay'`. El `<div className="fixed inset-0 -z-10">` que envuelve el `<Canvas>` debe cambiar a `fixed inset-0` (sin `-z-10`) porque ahora el overlay HTML vive dentro del canvas DOM de drei; quitar también `aria-hidden` del wrapper (el contenido HTML necesita ser accesible). En su lugar, marcar solo los elementos 3D como decorativos no es posible a nivel de wrapper — drei pone el HTML fuera del `<canvas>`. Resultado del wrapper:
```tsx
<div className="fixed inset-0">
```
El `<canvas>` interno de r3f es inerte para lectores; el HTML de `<Scroll html>` queda accesible.

- [ ] **Step 4: Verificar build**

Run: `pnpm build`
Expected: compila sin errores.

- [ ] **Step 5: Checkpoint visual (humano)**

Run: `pnpm dev`. Al scrollear, el contenido (Hero→Contact) debe aparecer sincronizado sobre los biomas, legible mediante paneles glass, mientras la cámara desciende. Verificar que links/CV/tabs funcionan. PEDIR confirmación de legibilidad y sincronía.

- [ ] **Step 6: Commit (NO ejecutar)**

```bash
git add src/components/journey/ContentOverlay.tsx src/components/journey/JourneyCanvas.tsx src/components/Hero.tsx src/components/About.tsx src/components/Experience.tsx src/components/Projects.tsx src/components/Contact.tsx
git commit -m "feat: overlay de contenido sincronizado con glass"
```

---

### Task 7: Pantalla de carga + autoescalado de calidad + postprocesado

**Files:**
- Create: `src/components/journey/LoadingScreen.tsx`
- Modify: `src/components/journey/JourneyCanvas.tsx`

**Interfaces:**
- Consumes: `useProgress` de drei, `PerformanceMonitor` de drei, `EffectComposer`/`Bloom`/`Vignette` de @react-three/postprocessing.
- Produces: `LoadingScreen` default export (overlay HTML fuera del canvas, con progreso).

- [ ] **Step 1: Crear LoadingScreen**

Create `src/components/journey/LoadingScreen.tsx`:
```tsx
'use client'

import { useProgress } from '@react-three/drei'
import { Mountain } from 'lucide-react'

export default function LoadingScreen() {
  const { progress, active } = useProgress()
  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-canopy transition-opacity duration-700 ${
        active ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      aria-hidden="true"
    >
      <Mountain size={48} className="text-amber mb-6" />
      <div className="w-56 h-1.5 rounded-full bg-pine overflow-hidden">
        <div className="h-full bg-amber transition-[width] duration-200" style={{ width: `${progress}%` }} />
      </div>
      <p className="mt-4 text-stone text-sm tabular-nums">{Math.round(progress)}% — preparando la ruta</p>
    </div>
  )
}
```

- [ ] **Step 2: Añadir autoescalado, postprocesado y Suspense en JourneyCanvas**

En `JourneyCanvas.tsx`:
- Importar: `useState` de react; `PerformanceMonitor`, `AdaptiveDpr`, `Preload` de `@react-three/drei`; `EffectComposer, Bloom, Vignette` de `@react-three/postprocessing`; `Suspense` de react; `LoadingScreen` desde `./LoadingScreen`.
- Envolver el contenido 3D en `<Suspense fallback={null}>`.
- Añadir estado `const [degraded, setDegraded] = useState(false)` y `PerformanceMonitor` que lo active.
- Renderizar `<LoadingScreen />` FUERA del `<Canvas>` (hermano), dentro del wrapper.

Resultado:
```tsx
'use client'

import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls, PerformanceMonitor, AdaptiveDpr, Preload } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { SCROLL_PAGES } from '@/lib/journey'
import CameraRig from './CameraRig'
import Terrain from './Terrain'
import BiomeController from './BiomeController'
import Snow from './Snow'
import Vegetation from './Vegetation'
import Wildlife from './Wildlife'
import ContentOverlay from './ContentOverlay'
import LoadingScreen from './LoadingScreen'

export default function JourneyCanvas() {
  const [degraded, setDegraded] = useState(false)

  return (
    <div className="fixed inset-0">
      <Canvas camera={{ position: [0, 60, 40], fov: 55, near: 0.1, far: 400 }} dpr={[1, 2]}>
        <ambientLight intensity={0.6} />
        <PerformanceMonitor onDecline={() => setDegraded(true)} />
        <AdaptiveDpr pixelated />
        <Suspense fallback={null}>
          <ScrollControls pages={SCROLL_PAGES} damping={0.25}>
            <BiomeController />
            <CameraRig />
            <Terrain />
            <Snow count={degraded ? 200 : 600} />
            <Vegetation />
            <Wildlife />
            <ContentOverlay />
          </ScrollControls>
          {!degraded && (
            <EffectComposer>
              <Bloom intensity={0.4} luminanceThreshold={0.8} mipmapBlur />
              <Vignette eskil={false} offset={0.2} darkness={0.7} />
            </EffectComposer>
          )}
          <Preload all />
        </Suspense>
      </Canvas>
      <LoadingScreen />
    </div>
  )
}
```

- [ ] **Step 3: Verificar build**

Run: `pnpm build`
Expected: compila sin errores.

- [ ] **Step 4: Checkpoint visual (humano)**

Run: `pnpm dev`. Al cargar debe aparecer la pantalla de carga (ícono montaña + barra ámbar) y desaparecer al terminar, revelando la escena con bloom/vignette sutil. PEDIR confirmación. (Para probar degradado: DevTools → CPU throttling; los efectos deben desactivarse y la nieve reducirse.)

- [ ] **Step 5: Commit (NO ejecutar)**

```bash
git add src/components/journey/LoadingScreen.tsx src/components/journey/JourneyCanvas.tsx
git commit -m "feat: pantalla de carga, autoescalado y postprocesado"
```

---

### Task 8: Fallback sin WebGL + reduced-motion + pase de accesibilidad

**Files:**
- Create: `src/components/journey/WebGLFallback.tsx`
- Create: `src/components/journey/JourneyExperience.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: `useWebGLSupport` (Task 1), `JourneyCanvas`, secciones existentes.
- Produces: `JourneyExperience` default export (decide canvas vs fallback). `WebGLFallback` default export (secciones HTML normales + fondo estático).

- [ ] **Step 1: Crear WebGLFallback (contenido 2D legible sin canvas)**

Create `src/components/journey/WebGLFallback.tsx`:
```tsx
'use client'

import Hero from '@/components/Hero'
import About from '@/components/About'
import Experience from '@/components/Experience'
import Projects from '@/components/Projects'
import Contact from '@/components/Contact'

export default function WebGLFallback() {
  return (
    <main className="bg-gradient-to-b from-[#dfe9f2] via-[#8a8275] to-[#5f7d3a]">
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Contact />
    </main>
  )
}
```
Nota: degradado vertical cumbre→roca→valle como evocación estática del descenso, sin 3D. Las secciones conservan sus paneles glass (legibles sobre el degradado).

- [ ] **Step 2: Crear JourneyExperience (selector)**

Create `src/components/journey/JourneyExperience.tsx`:
```tsx
'use client'

import dynamic from 'next/dynamic'
import { useWebGLSupport } from '@/hooks/useWebGLSupport'
import WebGLFallback from './WebGLFallback'

const JourneyCanvas = dynamic(() => import('./JourneyCanvas'), { ssr: false })

export default function JourneyExperience() {
  const webgl = useWebGLSupport()

  // null = aún detectando (primer render cliente): mostrar fallback estático
  // para evitar layout shift; al confirmar WebGL, montar el canvas.
  if (webgl === false || webgl === null) return <WebGLFallback />
  return <JourneyCanvas />
}
```

- [ ] **Step 3: Actualizar page.tsx**

Replace `src/app/page.tsx`:
```tsx
'use client'

import Header from '@/components/Header'
import JourneyExperience from '@/components/journey/JourneyExperience'

export default function Home() {
  return (
    <>
      <Header />
      <JourneyExperience />
    </>
  )
}
```

- [ ] **Step 4: Ajustar layout para ScrollControls**

En `src/app/layout.tsx`, el scroll virtual de drei gestiona su propio contenedor. Verificar que no haya `overflow` conflictivo. Si `globals.css` define `html { scroll-behavior: smooth }`, no afecta a ScrollControls (usa su propio scroller), dejar como está. No se requieren cambios salvo que aparezca doble scrollbar; si aparece, añadir `overflow-hidden` al `<body>` SOLO cuando el canvas esté activo — gestionarlo en `JourneyCanvas` con un efecto:
```tsx
// dentro de JourneyCanvas, antes del return:
import { useEffect } from 'react'
useEffect(() => {
  document.body.style.overflow = 'hidden'
  return () => { document.body.style.overflow = '' }
}, [])
```
(Añadir `useEffect` al import de react existente en JourneyCanvas.)

- [ ] **Step 5: Verificar reduced-motion en componentes 3D**

Confirmar (leyendo el código) que `CameraRig`, `Snow` y `Wildlife` ya cortan su animación con `useReducedMotion`. BiomeController interpola según scroll (no por tiempo), así que es aceptable bajo reduced-motion (responde al scroll del usuario, no auto-anima). No requiere cambio. Documentar en el reporte esta verificación.

- [ ] **Step 6: Verificar build**

Run: `pnpm build`
Expected: compila sin errores.

- [ ] **Step 7: Checkpoint visual (humano)**

Run: `pnpm dev`.
- Normal: experiencia 3D completa.
- Reduced-motion (DevTools → Rendering → Emulate prefers-reduced-motion: reduce): sin nieve animada, cóndor quieto, cámara salta por scroll sin lerp; contenido legible.
- Sin WebGL (DevTools → desactivar WebGL, o probar `webgl===false`): se ve `WebGLFallback` con degradado y secciones. Ningún canvas roto.
PEDIR confirmación de los 3 estados.

- [ ] **Step 8: Commit (NO ejecutar)**

```bash
git add src/components/journey/WebGLFallback.tsx src/components/journey/JourneyExperience.tsx src/app/page.tsx src/app/layout.tsx src/components/journey/JourneyCanvas.tsx
git commit -m "feat: fallback WebGL, reduced-motion y accesibilidad"
```

---

### Task 9 (follow-up documentado): Sustituir geometría procedural por modelos GLB curados

**Files:**
- Create: `public/models/CREDITS.md`
- Modify: `src/components/journey/Vegetation.tsx`, `src/components/journey/Wildlife.tsx`

**Interfaces:**
- Consumes: modelos GLB en `public/models/` (provistos por el humano).

NOTA: esta tarea REQUIERE intervención humana (curar y descargar modelos GLB de
licencia permisiva). No es autónoma. Se documenta para ejecutarse cuando el
usuario aporte los assets. No bloquea las Tasks 1-8.

- [ ] **Step 1: Curar y colocar modelos**

El usuario coloca en `public/models/`: `pine.glb`, `frailejon.glb`, `condor.glb`, `deer.glb` (CC0 / licencia permisiva), optimizados con `npx @gltf-transform/cli optimize in.glb out.glb --compress draco`. Registrar fuente+licencia de cada uno en `public/models/CREDITS.md`.

- [ ] **Step 2: Cargar GLB con useGLTF e instanciar**

En `Vegetation.tsx`, reemplazar las geometrías procedurales por los modelos:
```tsx
import { useGLTF, Merged } from '@react-three/drei'
// useGLTF('/models/pine.glb') → usar su geometría/material en los InstancedGroup
```
Mantener el mismo patrón de `scatter()`/instancia. Añadir `useGLTF.preload('/models/pine.glb')` etc.

- [ ] **Step 3: Verificar build + checkpoint visual (humano)**

Run: `pnpm build` y `pnpm dev`. Los pinos/frailejones/cóndor/venado ahora son modelos realistas. PEDIR confirmación.

- [ ] **Step 4: Commit (NO ejecutar)**

```bash
git add public/models src/components/journey/Vegetation.tsx src/components/journey/Wildlife.tsx
git commit -m "feat: modelos GLB curados para flora y fauna"
```

---

## Criterios de éxito (verificación final)

1. `pnpm build` pasa limpio tras cada tarea.
2. Scroll desciende la cámara por los 5 biomas con contenido sincronizado y legible.
3. Transiciones de niebla/luz sin cortes; nieve en cumbre, frailejones/cóndor en páramo, pinos/luciérnagas en bosque.
4. Pantalla de carga aparece y se va al 100%.
5. Autoescalado reduce efectos/nieve bajo carga (CPU throttling).
6. Reduced-motion: sin animación continua, todo legible y navegable.
7. Sin WebGL: `WebGLFallback` con degradado + secciones, nunca canvas roto.
8. Contenido textual, datos y ARIA conservados.
9. Task 9 (GLB) pendiente de assets del usuario; el sitio funciona sin ella.
