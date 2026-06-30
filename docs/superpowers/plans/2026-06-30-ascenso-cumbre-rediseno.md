# Rediseño "Ascenso a la Cumbre" — Plan de Implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rediseñar el portafolio con tema naturaleza/hiking ("ascenso a la cumbre"): nueva paleta verde/tierra/ámbar, estilo orgánico, y animaciones de scroll (sendero animado, parallax de montañas, indicador de altitud).

**Architecture:** Se reemplazan los tokens de color en `globals.css` (Tailwind 4 `@theme inline`) y se migran todos los componentes a los nuevos tokens. Se añaden 4 componentes decorativos en `src/components/ui/` que leen el progreso de scroll global vía framer-motion `useScroll`/`useTransform`, todos gobernados por el hook `useReducedMotion` existente. `page.tsx` monta los decoradores globales e intercala divisores curvos.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS 4, framer-motion 12, lucide-react. Sin nuevas dependencias.

## Global Constraints

- Sin nuevas dependencias npm.
- Spec de referencia: `docs/superpowers/specs/2026-06-30-ascenso-cumbre-rediseno-design.md`.
- **NO ejecutar `git commit`** — regla del usuario (CLAUDE.md global: "Nunca hacer commits"). Los pasos de commit quedan documentados pero el agente NO los ejecuta; el usuario commitea manualmente.
- **NO ejecutar `eslint --fix`** sin autorización (regla del usuario).
- No hay framework de tests instalado. Verificación por tarea = `pnpm build` (o `npm run build`) sin errores de tipo/lint + checks visuales descritos. NO inventar tests unitarios.
- Nombres de archivo: PascalCase para componentes React (convención existente en `src/components/`).
- Todos los elementos decorativos llevan `aria-hidden="true"`.
- Toda animación derivada de scroll/parallax se desactiva bajo `useReducedMotion` (true).
- Paleta exacta (tokens CSS):
  ```
  --canopy #1a2e1f   --pine #2d4a35   --moss #5a8a5c   --fern #8fbf6f
  --amber  #e8a04c   --clay #c4733d   --mist #eef2e9   --stone #9aa896
  ```
- Mapeo de migración de tokens viejos → nuevos:
  `primary→amber`, `secondary→moss`, `dark(#2D1F33)→pine`, `background→canopy`, `text→mist`, `text-muted→stone`.

---

### Task 1: Nueva paleta y base global (`globals.css`)

**Files:**
- Modify: `src/app/globals.css`

**Interfaces:**
- Produces: tokens Tailwind `bg-canopy bg-pine bg-moss bg-fern bg-amber bg-clay text-mist text-stone` (y variantes `text-*`, `border-*`, `/opacity`) disponibles en todo el proyecto. Variables CSS `--canopy … --stone`.

- [ ] **Step 1: Reemplazar variables y theme**

Reemplazar el contenido completo de `src/app/globals.css` por:

```css
@import "tailwindcss";

:root {
  --canopy: #1a2e1f;
  --pine: #2d4a35;
  --moss: #5a8a5c;
  --fern: #8fbf6f;
  --amber: #e8a04c;
  --clay: #c4733d;
  --mist: #eef2e9;
  --stone: #9aa896;
}

@theme inline {
  --color-canopy: var(--canopy);
  --color-pine: var(--pine);
  --color-moss: var(--moss);
  --color-fern: var(--fern);
  --color-amber: var(--amber);
  --color-clay: var(--clay);
  --color-mist: var(--mist);
  --color-stone: var(--stone);
}

html {
  scroll-behavior: smooth;
}

body {
  background: var(--canopy);
  color: var(--mist);
  font-family: 'Inter', sans-serif;
}

::selection {
  background: var(--amber);
  color: var(--canopy);
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--canopy);
}

::-webkit-scrollbar-thumb {
  background: var(--moss);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--fern);
}
```

- [ ] **Step 2: Verificar build**

Run: `pnpm build`
Expected: build OK. (Componentes aún referencian tokens viejos como `text-text`; esos clases ya no existen pero Tailwind no falla el build por clases desconocidas — se verán sin estilo hasta migrarlos en las tareas siguientes. Confirmar que NO hay errores de compilación.)

- [ ] **Step 3: Commit (NO ejecutar — el usuario lo hace)**

```bash
git add src/app/globals.css
git commit -m "feat: nueva paleta amanecer en montaña"
```

---

### Task 2: Migrar componentes de layout (`Header`, `Footer`)

**Files:**
- Modify: `src/components/Header.tsx`
- Modify: `src/components/Footer.tsx`

**Interfaces:**
- Consumes: tokens de Task 1.

- [ ] **Step 1: Migrar `Header.tsx`**

Aplicar reemplazos de clases (mapeo global):
- `bg-background/80` → `bg-canopy/80`
- `border-secondary/20` → `border-moss/20`
- `text-text` → `text-mist`
- `hover:text-primary` → `hover:text-amber`
- `text-text-muted` → `text-stone`
- `bg-primary` → `bg-amber`, `hover:bg-secondary` → `hover:bg-moss`
- `bg-primary` (subrayado `span`) → `bg-amber`

Además, en el logo `CA`, anteponer un ícono de montaña. Cambiar import:
```tsx
import { Menu, X, Mountain } from 'lucide-react'
```
y el contenido del enlace logo:
```tsx
<motion.a
  href="#"
  className="flex items-center gap-2 text-xl font-bold text-mist hover:text-amber transition-colors"
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  <Mountain size={20} className="text-amber" aria-hidden="true" />
  CA
</motion.a>
```
El botón "Contact" (clase `text-text` en CTA): el texto sobre `bg-amber` debe ser oscuro para contraste → usar `text-canopy`. Aplicar `text-canopy` a ambos botones Contact (desktop y móvil).

- [ ] **Step 2: Migrar `Footer.tsx`**

Reemplazos:
- `border-secondary/20` → `border-moss/20`
- `text-text-muted` → `text-stone`
- `text-primary` → `text-amber`
- `hover:text-primary` → `hover:text-amber`

- [ ] **Step 3: Verificar build**

Run: `pnpm build`
Expected: OK, sin errores.

- [ ] **Step 4: Verificación visual**

Run: `pnpm dev`, abrir `http://localhost:3000`.
Expected: header con logo montaña ámbar, links verdes, CTA ámbar con texto oscuro; footer verde coherente. Sin morado.

- [ ] **Step 5: Commit (NO ejecutar)**

```bash
git add src/components/Header.tsx src/components/Footer.tsx
git commit -m "feat: migrar header y footer a paleta naturaleza"
```

---

### Task 3: `MountainBackdrop` — parallax de montañas + sol

**Files:**
- Create: `src/components/ui/MountainBackdrop.tsx`

**Interfaces:**
- Consumes: `useReducedMotion` desde `@/hooks/useReducedMotion`.
- Produces: `export default function MountainBackdrop()` — capas SVG absolutas decorativas, pensado para montarse dentro de un contenedor `relative` (el Hero) con `-z-10`.

- [ ] **Step 1: Crear componente**

```tsx
'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export default function MountainBackdrop() {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const sunY = useTransform(scrollYProgress, [0, 1], ['0%', '40%'])
  const backY = useTransform(scrollYProgress, [0, 1], ['0%', '15%'])
  const frontY = useTransform(scrollYProgress, [0, 1], ['0%', '-10%'])

  return (
    <div
      ref={ref}
      className="absolute inset-0 -z-10 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-canopy via-canopy to-pine" />

      <motion.div
        className="absolute left-1/2 top-24 -translate-x-1/2"
        style={reducedMotion ? undefined : { y: sunY }}
      >
        <div className="w-40 h-40 rounded-full bg-amber/60 blur-2xl" />
        <div className="absolute inset-0 m-auto w-24 h-24 rounded-full bg-amber/80 blur-md" />
      </motion.div>

      <motion.svg
        className="absolute bottom-0 w-full"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        style={reducedMotion ? undefined : { y: backY }}
      >
        <path
          fill="#2d4a35"
          fillOpacity="0.6"
          d="M0,224 L240,160 L480,224 L720,128 L960,208 L1200,144 L1440,224 L1440,320 L0,320 Z"
        />
      </motion.svg>

      <motion.svg
        className="absolute bottom-0 w-full"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        style={reducedMotion ? undefined : { y: frontY }}
      >
        <path
          fill="#1a2e1f"
          d="M0,288 L180,200 L360,288 L540,224 L720,288 L900,240 L1080,288 L1260,232 L1440,288 L1440,320 L0,320 Z"
        />
      </motion.svg>
    </div>
  )
}
```

- [ ] **Step 2: Verificar tipos**

Run: `pnpm build`
Expected: compila sin errores de tipo. (Aún no se monta; se integra en Task 4.)

- [ ] **Step 3: Commit (NO ejecutar)**

```bash
git add src/components/ui/MountainBackdrop.tsx
git commit -m "feat: MountainBackdrop con parallax"
```

---

### Task 4: Migrar `Hero` (campamento base) e integrar backdrop

**Files:**
- Modify: `src/components/Hero.tsx`

**Interfaces:**
- Consumes: `MountainBackdrop` (Task 3), tokens de Task 1.

- [ ] **Step 1: Importar y montar backdrop**

Añadir import al inicio (junto a los demás):
```tsx
import MountainBackdrop from '@/components/ui/MountainBackdrop'
```
Convertir la `<section>` en contenedor relativo y montar el backdrop como primer hijo:
```tsx
<section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden" aria-label="Introduction">
  <MountainBackdrop />
  <div className="max-w-6xl mx-auto px-6 w-full">
```
(cerrar `</section>` igual que antes.)

- [ ] **Step 2: Migrar tokens de color del Hero**

Reemplazos en `Hero.tsx`:
- `from-primary to-secondary` → `from-amber to-moss`
- `border-secondary/30` → `border-moss/30`
- `shadow-[8px_8px_0px_#2D1F33]` → `shadow-2xl shadow-pine/40` (sombra difusa orgánica)
- `text-text-muted` → `text-stone`
- `text-text` → `text-mist`
- `text-primary` → `text-amber`
- CTA Download: `bg-primary text-text shadow-[6px_6px_0px_#2D1F33] hover:shadow-[8px_8px_0px_#2D1F33] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-none active:translate-x-1 active:translate-y-1`
  → `bg-amber text-canopy shadow-lg shadow-pine/40 hover:shadow-xl hover:shadow-amber/30 hover:-translate-y-0.5 active:translate-y-0`
- Botones sociales: `bg-secondary/20 hover:bg-primary/20 hover:text-primary` → `bg-moss/20 hover:bg-amber/20 hover:text-amber`
- Borde del avatar `rounded-2xl` se mantiene; ya es orgánico.

- [ ] **Step 3: Verificar build + visual**

Run: `pnpm build` y luego `pnpm dev`.
Expected: Hero con degradado canopy→pine, sol ámbar difuso arriba, dos crestas de montaña abajo que se mueven a distinta velocidad al scrollear; avatar y CTAs en paleta nueva. Con `prefers-reduced-motion` activo (DevTools → Rendering → Emulate CSS prefers-reduced-motion: reduce), las capas quedan estáticas.

- [ ] **Step 4: Commit (NO ejecutar)**

```bash
git add src/components/Hero.tsx
git commit -m "feat: Hero campamento base con parallax y paleta naturaleza"
```

---

### Task 5: `SectionDivider` — divisor curvo tipo cordillera

**Files:**
- Create: `src/components/ui/SectionDivider.tsx`

**Interfaces:**
- Produces: `export default function SectionDivider({ fill, flip }: { fill?: string; flip?: boolean })`. `fill` = color hex del relleno (default `#1a2e1f`). `flip` invierte verticalmente. Decorativo, `aria-hidden`.

- [ ] **Step 1: Crear componente**

```tsx
interface SectionDividerProps {
  fill?: string
  flip?: boolean
}

export default function SectionDivider({ fill = '#1a2e1f', flip = false }: SectionDividerProps) {
  return (
    <div className="w-full -my-px leading-none" aria-hidden="true">
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className={`w-full h-12 md:h-20 ${flip ? 'rotate-180' : ''}`}
      >
        <path
          fill={fill}
          d="M0,80 L240,40 L480,88 L720,32 L960,80 L1200,48 L1440,80 L1440,120 L0,120 Z"
        />
      </svg>
    </div>
  )
}
```

- [ ] **Step 2: Verificar build**

Run: `pnpm build`
Expected: compila. (Se integra en Task 9.)

- [ ] **Step 3: Commit (NO ejecutar)**

```bash
git add src/components/ui/SectionDivider.tsx
git commit -m "feat: SectionDivider curvo"
```

---

### Task 6: Migrar `About`, `Projects`, `Contact`

**Files:**
- Modify: `src/components/About.tsx`
- Modify: `src/components/Projects.tsx`
- Modify: `src/components/Contact.tsx`

**Interfaces:**
- Consumes: tokens de Task 1.

- [ ] **Step 1: Migrar `About.tsx`**

Reemplazos:
- `text-text` → `text-mist`, `text-text-muted` → `text-stone`, `text-primary` → `text-amber`
- `bg-secondary/20` → `bg-moss/20`, `hover:text-primary` → `hover:text-amber`
- En `whileHover` del skill: `backgroundColor: 'rgba(142, 68, 173, 0.2)'` → `backgroundColor: 'rgba(143, 191, 111, 0.2)'` (fern). Cambiar también `rounded-lg` de los chips a `rounded-full` para estilo orgánico.

- [ ] **Step 2: Migrar `Projects.tsx`**

Reemplazos:
- `text-text` → `text-mist`, `text-text-muted` → `text-stone`, `text-primary` → `text-amber`
- `bg-secondary/10` → `bg-pine/30`, `bg-secondary/20` → `bg-moss/15`
- `border-secondary/20` → `border-moss/20`, `hover:border-primary/50` → `hover:border-amber/50`
- `group-hover:text-primary` → `group-hover:text-amber`
- Cards `rounded-xl` → `rounded-2xl`; añadir `shadow-lg shadow-pine/30` a la card.
- Etiqueta de altitud "cumbre": dentro del `<div className="p-6">`, antes del título, añadir:
```tsx
<div className="flex items-center gap-1.5 text-xs text-amber/80 mb-2">
  <Mountain size={14} aria-hidden="true" />
  <span>Cumbre {String(2400 + index * 300)} m</span>
</div>
```
Cambiar import: `import { ExternalLink, Mountain } from 'lucide-react'`. (Nota: `project` viene del `.map((project, index) =>`; añadir `index` al callback.)

- [ ] **Step 3: Migrar `Contact.tsx`**

Reemplazos:
- `bg-secondary/5` → `bg-pine/20`
- `text-text` → `text-mist`, `text-text-muted` → `text-stone`, `text-primary` → `text-amber`
- CTA "Say Hello": `bg-primary text-text shadow-[6px_6px_0px_#2D1F33] hover:shadow-[8px_8px_0px_#2D1F33] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-none active:translate-x-1 active:translate-y-1`
  → `bg-amber text-canopy shadow-lg shadow-pine/40 hover:shadow-xl hover:shadow-amber/30 hover:-translate-y-0.5 active:translate-y-0`
- Cambiar el encabezado a tema cima: el `<span className="text-primary">#</span> Get In Touch` → reemplazar `#` por un ícono `Flag`. Import `import { Mail, Flag } from 'lucide-react'` y:
```tsx
<span className="inline-flex items-center gap-2">
  <Flag className="text-amber" size={28} aria-hidden="true" /> Get In Touch
</span>
```

- [ ] **Step 4: Verificar build + visual**

Run: `pnpm build` y `pnpm dev`.
Expected: About con chips redondos verdes; Projects con cards orgánicas + etiqueta "Cumbre Nm" ámbar; Contact con bandera de cima y CTA ámbar. Sin morado en ninguna sección.

- [ ] **Step 5: Commit (NO ejecutar)**

```bash
git add src/components/About.tsx src/components/Projects.tsx src/components/Contact.tsx
git commit -m "feat: migrar about, projects y contact a tema cumbre"
```

---

### Task 7: Migrar `Experience` con waypoints/altitud

**Files:**
- Modify: `src/components/Experience.tsx`

**Interfaces:**
- Consumes: tokens de Task 1.

- [ ] **Step 1: Migrar tokens**

Reemplazos:
- `bg-secondary/5` → `bg-pine/20`
- `text-text` → `text-mist`, `text-text-muted` → `text-stone`, `text-primary` → `text-amber`
- `border-secondary/30` → `border-moss/30`
- Tab activo: `text-primary bg-primary/10 md:border-l-2 md:-ml-[1px] border-primary` → `text-amber bg-amber/10 md:border-l-2 md:-ml-[1px] border-amber`
- Tab inactivo hover: `hover:text-text hover:bg-secondary/10` → `hover:text-mist hover:bg-moss/10`
- Logo container `bg-secondary/20` → `bg-moss/20`
- Bullet `<span className="text-primary mt-1.5">▹` → `text-amber`

- [ ] **Step 2: Añadir cota de altitud al panel**

Cambiar import: `import { Tent } from 'lucide-react'`. Dentro del bloque de cabecera del panel (junto a `<h3>{exp.role}`), añadir bajo el periodo una etiqueta de campamento:
```tsx
<p className="text-stone text-sm">
  <time>{exp.period}</time>
</p>
<span className="inline-flex items-center gap-1.5 mt-1 text-xs text-amber/80">
  <Tent size={14} aria-hidden="true" />
  Campamento {String(1200 + index * 400)} m
</span>
```
(`index` ya está disponible en el `.map((exp, index) =>`.)

- [ ] **Step 3: Verificar build + visual**

Run: `pnpm build` y `pnpm dev`.
Expected: tabs ámbar, panel con icono tienda + "Campamento Nm". Sin morado.

- [ ] **Step 4: Commit (NO ejecutar)**

```bash
git add src/components/Experience.tsx
git commit -m "feat: Experience con waypoints de altitud"
```

---

### Task 8: `AltitudeIndicator` y `TrailPath` (decoradores globales de scroll)

**Files:**
- Create: `src/components/ui/AltitudeIndicator.tsx`
- Create: `src/components/ui/TrailPath.tsx`

**Interfaces:**
- Consumes: `useReducedMotion`.
- Produces: `export default function AltitudeIndicator()` y `export default function TrailPath()`. Ambos se montan una vez en `page.tsx`, posición `fixed`, decorativos.

- [ ] **Step 1: Crear `AltitudeIndicator.tsx`**

```tsx
'use client'

import { useEffect, useState } from 'react'
import { useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import { Mountain } from 'lucide-react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export default function AltitudeIndicator() {
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const altitude = useTransform(scrollYProgress, [0, 1], [0, 4000])
  const [value, setValue] = useState(0)

  useMotionValueEvent(altitude, 'change', (v) => {
    setValue(Math.round(v / 10) * 10)
  })

  useEffect(() => {
    if (reducedMotion) setValue(0)
  }, [reducedMotion])

  return (
    <div
      className="fixed bottom-6 right-6 z-40 hidden sm:flex items-center gap-2 px-3 py-2 rounded-full bg-pine/80 backdrop-blur-md border border-moss/30 text-mist text-sm shadow-lg shadow-canopy/50"
      aria-hidden="true"
    >
      <Mountain size={16} className="text-amber" />
      <span className="tabular-nums font-medium">{value.toLocaleString()} m</span>
    </div>
  )
}
```

- [ ] **Step 2: Crear `TrailPath.tsx`**

```tsx
'use client'

import { motion, useScroll, useSpring } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export default function TrailPath() {
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const pathLength = useSpring(scrollYProgress, { stiffness: 80, damping: 20 })

  return (
    <div
      className="fixed left-3 md:left-6 top-0 h-screen w-6 z-30 pointer-events-none hidden sm:block"
      aria-hidden="true"
    >
      <svg className="w-full h-full" viewBox="0 0 24 100" preserveAspectRatio="none">
        <path
          d="M12,0 C4,20 20,35 12,50 C4,65 20,80 12,100"
          fill="none"
          stroke="#2d4a35"
          strokeWidth="2"
          strokeDasharray="3 3"
        />
        <motion.path
          d="M12,0 C4,20 20,35 12,50 C4,65 20,80 12,100"
          fill="none"
          stroke="#e8a04c"
          strokeWidth="2"
          strokeDasharray="3 3"
          style={{ pathLength: reducedMotion ? 1 : pathLength }}
        />
      </svg>
    </div>
  )
}
```

- [ ] **Step 3: Verificar build**

Run: `pnpm build`
Expected: compila sin errores de tipo. (Se montan en Task 9.)

- [ ] **Step 4: Commit (NO ejecutar)**

```bash
git add src/components/ui/AltitudeIndicator.tsx src/components/ui/TrailPath.tsx
git commit -m "feat: indicador de altitud y sendero animado"
```

---

### Task 9: Ensamblar en `page.tsx` (decoradores + divisores)

**Files:**
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `TrailPath`, `AltitudeIndicator` (Task 8), `SectionDivider` (Task 5).

- [ ] **Step 1: Montar decoradores globales e intercalar divisores**

Reemplazar el contenido de `src/app/page.tsx` por:

```tsx
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Experience from '@/components/Experience'
import Projects from '@/components/Projects'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import TrailPath from '@/components/ui/TrailPath'
import AltitudeIndicator from '@/components/ui/AltitudeIndicator'
import SectionDivider from '@/components/ui/SectionDivider'

export default function Home() {
  return (
    <>
      <Header />
      <TrailPath />
      <AltitudeIndicator />
      <main>
        <Hero />
        <SectionDivider fill="#1a2e1f" />
        <About />
        <SectionDivider fill="#2d4a35" />
        <Experience />
        <SectionDivider fill="#1a2e1f" />
        <Projects />
        <SectionDivider fill="#2d4a35" />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
```
Nota: los `fill` deben coincidir con el `bg-*` de la sección que sigue (About es transparente→canopy `#1a2e1f`; Experience usa `bg-pine/20`; Projects transparente→canopy; Contact `bg-pine/20`). Ajustar si hay desajuste visible.

- [ ] **Step 2: Verificar build + visual completo**

Run: `pnpm build` y `pnpm dev`.
Expected:
- Sendero punteado fijo a la izquierda que se "pinta" en ámbar al scrollear.
- Indicador de altitud abajo-derecha que sube de 0 a ~4.000 m.
- Divisores curvos entre secciones.
- Sin morado en toda la página.

- [ ] **Step 3: Verificar accesibilidad / reduced-motion**

En DevTools → Rendering → "Emulate CSS prefers-reduced-motion: reduce", recargar.
Expected: sendero completo estático en ámbar, altitud en 0 m, sin parallax, contenido legible y completo. Todos los decoradores con `aria-hidden`.

- [ ] **Step 4: Commit (NO ejecutar)**

```bash
git add src/app/page.tsx
git commit -m "feat: ensamblar decoradores de scroll y divisores"
```

---

### Task 10: Coherencia OG image + limpieza

**Files:**
- Modify: `src/app/opengraph-image.tsx`

**Interfaces:**
- Consumes: paleta nueva (valores hex literales, ya que OG image no usa Tailwind).

- [ ] **Step 1: Revisar y actualizar colores OG**

Abrir `src/app/opengraph-image.tsx`. Reemplazar cualquier color morado/antiguo (`#8E44AD`, `#6B487A`, `#2D1F33`, `#0f0a14`, `#ECF0F1`) por los equivalentes de la nueva paleta:
- fondo `#0f0a14`/`#2D1F33` → `#1a2e1f` (canopy)
- acento `#8E44AD` → `#e8a04c` (amber)
- texto `#ECF0F1` → `#eef2e9` (mist)
- secundario `#6B487A` → `#5a8a5c` (moss)

(Si el archivo no contiene colores morados, no hay cambios; verificar igualmente.)

- [ ] **Step 2: Buscar tokens morados residuales en todo `src`**

Run: `grep -rniE "8e44ad|6b487a|2d1f33|0f0a14|ecf0f1|text-primary|text-secondary|bg-background|text-text|text-text-muted|primary/|secondary/" src/`
Expected: sin coincidencias (salvo nuevos tokens). Si aparece algún residuo, migrarlo según el mapeo de Global Constraints.

- [ ] **Step 3: Verificar build final**

Run: `pnpm build`
Expected: build OK, sin errores de tipo ni lint.

- [ ] **Step 4: Commit (NO ejecutar)**

```bash
git add src/app/opengraph-image.tsx
git commit -m "feat: actualizar OG image a paleta naturaleza"
```

---

## Criterios de éxito (verificación final)

1. `grep` del Task 10 Step 2 → sin tokens morados residuales.
2. `pnpm build` pasa limpio.
3. Scroll: sendero se dibuja, altitud sube, parallax de montañas activo, divisores curvos visibles.
4. `prefers-reduced-motion: reduce` → sin movimiento, todo legible.
5. Contenido textual y estructura ARIA intactos respecto al original.
