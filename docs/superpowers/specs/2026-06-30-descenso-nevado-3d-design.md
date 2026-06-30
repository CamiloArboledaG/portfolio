# Rediseño v2 — "El Descenso del Nevado" (viaje 3D inmersivo)

Fecha: 2026-06-30
Estado: Aprobado
Reemplaza/expande: `2026-06-30-ascenso-cumbre-rediseno-design.md` (v1 fue paleta + scroll 2D; v2 sube a experiencia 3D inmersiva).

## Resumen

Portafolio como un viaje 3D: el visitante **desciende un nevado** controlando la
cámara con el scroll, atravesando 5 pisos ecológicos (cumbre nevada → glaciar →
páramo → bosque de niebla → valle). Cada bioma corresponde a una sección de
contenido y tiene su paleta, luz, niebla, vegetación y fauna. El contenido del
portafolio (texto/links) flota sincronizado sobre la escena 3D. Una pantalla de
carga estilizada precarga los assets; la calidad se autoajusta para mantener
fluidez; hay un póster estático si el navegador no soporta WebGL. La meta es un
efecto "wow" memorable para reclutadores manteniendo accesibilidad y contenido
intactos.

Construido con react-three-fiber v9 (React 19) sobre el stack actual (Next.js 16,
Tailwind 4, framer-motion). Reusa el contenido y los datos existentes.

## Objetivos

- Experiencia inmersiva única para todos los visitantes (no dos sitios distintos).
- Sensación de viaje continuo de descenso por biomas, con dinamismo al scroll.
- Mantener todo el contenido, datos y semántica/ARIA del portafolio actual.
- Carga controlada (preloader) y rendimiento estable (escalado automático).
- Degradación segura: sin WebGL o con reduced-motion, nadie ve pantalla rota.

## No-objetivos (YAGNI)

- No bosques densos ni manadas ni PBR de alto detalle (riesgo de peso/jank).
- No editor/controles de cámara libres (la cámara sigue el sendero del scroll).
- No contenido nuevo (proyectos/experiencias se reusan tal cual).
- No internacionalización ni audio (fuera de alcance).

## Decisiones de diseño (tomadas en brainstorming)

1. Estructura: **5 biomas = 5 secciones**, scroll = descenso desde la cumbre.
2. Motor: **3D real** con react-three-fiber.
3. Estilo: **realista/pintoresco** — terreno realista procedural + pocos modelos curados.
4. Flora/fauna: **terreno realista procedural + 4-6 modelos GLB libres curados** instanciados.
5. Carga/perf: **una sola experiencia 3D + pantalla de carga estilizada + escalado
   de calidad automático e invisible + póster estático solo si no hay WebGL**.

## Stack y dependencias nuevas

- `three` (>= 0.156)
- `@react-three/fiber` (v9, pareja de React 19)
- `@react-three/drei` (v10, compatible con fiber v9)
- `@react-three/postprocessing` (bloom/vignette)
- Herramienta de build de assets (dev, opcional local): `@gltf-transform/cli` para
  optimizar/comprimir GLB (draco). No es dependencia de runtime.
- Config Next.js: añadir `transpilePackages: ['three']` en `next.config.ts`.

Compatibilidad verificada: fiber v9 `peerDependencies` react ">=19 <19.3", three
">=0.156". El proyecto usa React 19.2.3 → compatible.

## Los 5 biomas

Progreso de scroll normalizado `t ∈ [0,1]`. Las transiciones interpolan de forma
continua (sin cortes) el color de niebla, la luz y la densidad de vegetación.

| t            | Bioma            | Sección    | Paleta / luz                              | Vida / partículas                  |
|--------------|------------------|------------|-------------------------------------------|------------------------------------|
| 0.00 – 0.20  | Cumbre nevada    | Hero       | blanco-azul, sol bajo, niebla densa, viento | partículas de nieve                |
| 0.20 – 0.40  | Glaciar / roca   | About      | gris-azul, hielo, roca desnuda            | hielo brillante, destellos         |
| 0.40 – 0.60  | Páramo           | Experience | ocres + verde apagado, frailejones        | cóndor planeando, neblina baja     |
| 0.60 – 0.80  | Bosque de niebla | Projects   | verde profundo, húmedo, rayos de luz      | pinos, venado, aves, luciérnagas   |
| 0.80 – 1.00  | Valle base       | Contact    | verde cálido, atardecer, río              | mariposas, hierba al viento        |

Los colores de niebla/luz por bioma se definen como constantes en
`src/lib/journey.ts` y se interpolan según `t`.

## Paleta base de UI (overlay)

Se conserva la paleta "amanecer en montaña" de v1 para el overlay HTML (texto,
botones), ya migrada en el código:
`canopy #1a2e1f, pine #2d4a35, moss #5a8a5c, fern #8fbf6f, amber #e8a04c,
clay #c4733d, mist #eef2e9, stone #9aa896`. El overlay usa fondos
translúcidos/glass para legibilidad sobre la escena 3D (los biomas aportan el
color de fondo; el overlay aporta contraste local para el texto).

## Arquitectura técnica

- **Canvas raíz** (`JourneyCanvas`): `<Canvas>` con `dpr` dinámico,
  `<ScrollControls pages={~5} damping=...>` (≈1 página por bioma, ajustable en
  tuning) envolviendo la escena y el overlay,
  `<PerformanceMonitor>` para autoescalado, fog de escena, y
  `<EffectComposer>` (bloom suave + vignette) desactivable bajo carga.
- **Sendero y cámara**: una `THREE.CatmullRomCurve3` definida en
  `src/lib/journey.ts` describe la ruta de descenso. `CameraRig` lee
  `useScroll().offset` (0→1) cada frame y posiciona la cámara en
  `curve.getPointAt(offset)`, orientándola hacia `curve.getPointAt(offset + ε)`.
- **Terreno**: `Terrain` genera un `PlaneGeometry` deformado por ruido
  (heightmap) para formar la montaña; el material sombrea por altitud
  (nieve arriba → roca → pasto abajo) usando vertex colors o un shader simple.
- **Biomas**: `BiomeController` interpola color de fog, intensidad/temperatura de
  luz y parámetros ambientales según `t`, leyendo las constantes de bioma.
- **Vegetación/fauna**: `Vegetation` y `Wildlife` colocan modelos GLB curados
  con `InstancedMesh`, mostrando/atenuando cada grupo según el bioma activo.
  Partículas (nieve, luciérnagas, mariposas) son `Points` procedurales.
- **Overlay de contenido**: `ContentOverlay` usa `<Scroll html>` de drei para
  renderizar las secciones HTML existentes (Hero, About, Experience, Projects,
  Contact) sincronizadas con el scroll, con estilos legibles sobre 3D.
- **Carga**: `<Suspense>` envuelve la escena; `LoadingScreen` usa `useProgress`
  de drei y cubre la pantalla hasta el 100%, luego hace fade-out. Modelos
  precargados con `useGLTF.preload`.
- **Fallback**: detección de WebGL al montar; si falla, se renderiza
  `WebGLFallback` (póster estático + secciones HTML normales sin canvas).

### Flujo de datos

- Fuente única de progreso: `useScroll()` de drei (dentro de `ScrollControls`).
  `CameraRig`, `BiomeController`, `Vegetation`, `Wildlife` y el overlay leen ese
  offset. Sin estado global adicional.
- `useReducedMotion` (hook existente) gobierna animación continua: con
  reduced-motion, la cámara se posiciona por bioma sin interpolación de
  movimiento por frame y las partículas/loops se congelan.
- Datos de contenido siguen viniendo de `src/lib/data.ts` y `src/lib/constants.ts`.

## Estructura de archivos

Nuevo directorio `src/components/journey/`:

- `JourneyCanvas.tsx` — `<Canvas>`, `ScrollControls`, `PerformanceMonitor`, fog, postprocesado, `<Suspense>`.
- `CameraRig.tsx` — mueve la cámara por la curva según el offset de scroll.
- `Terrain.tsx` — malla del nevado procedural + sombreado por altitud.
- `BiomeController.tsx` — interpola fog/luz/ambiente por `t`.
- `Vegetation.tsx` — instancia pinos/frailejones por bioma.
- `Wildlife.tsx` — cóndor/venado + sistemas de partículas (nieve, luciérnagas, mariposas).
- `TrailMarker.tsx` — sendero 3D visible (línea/huellas) a lo largo de la curva.
- `ContentOverlay.tsx` — `<Scroll html>` con las 5 secciones, restyled para legibilidad.
- `LoadingScreen.tsx` — preloader estilizado con `useProgress`.
- `WebGLFallback.tsx` — póster + secciones HTML si no hay WebGL.

Soporte:
- `src/lib/journey.ts` — curva de cámara, puntos/constantes de bioma (colores fog, luz, rangos `t`), número de páginas de scroll.
- `src/hooks/useWebGLSupport.ts` — detecta soporte WebGL.

Modificados:
- `next.config.ts` — `transpilePackages: ['three']`.
- `src/app/page.tsx` — monta `JourneyCanvas` vía `next/dynamic` con `ssr: false`; conserva `Header`; usa `WebGLFallback` cuando aplique.
- `src/app/layout.tsx` — ajustes mínimos si hace falta (p. ej. evitar scroll-behavior nativo que choque con ScrollControls).
- Componentes de sección existentes (`Hero`, `About`, `Experience`, `Projects`,
  `Contact`): adaptar estilos para vivir sobre el canvas (fondos glass/translúcidos)
  manteniendo contenido y ARIA. Se reusan, no se reescriben.

Assets:
- `public/models/` — GLB curados optimizados (pino, frailejón, cóndor, venado, roca).
- `public/images/nevado-poster.*` — póster de fallback.

## Modelos 3D (curaduría)

- 4-6 modelos GLB de licencia permisiva (CC0 / Poly Pizza / Sketchfab CC0):
  pino, frailejón, cóndor, venado, roca (y opcional arbusto).
- Optimizados con `gltf-transform` (compresión draco, decimación) para mantener
  el peso total de modelos bajo (objetivo < ~1.5 MB combinado tras compresión).
- Instanciados con `InstancedMesh`; nunca cientos de draw calls.
- Registrar la fuente y licencia de cada modelo en un `public/models/CREDITS.md`.

## Rendimiento

- `dpr` dinámico (p. ej. `[1, 2]`) ajustado por `PerformanceMonitor`: baja a 1 y
  desactiva postprocesado si los FPS caen bajo un umbral.
- `InstancedMesh` para toda vegetación/fauna repetida.
- Fog limita la distancia de dibujo (draw distance) y refuerza la atmósfera.
- Carga diferida de modelos por bioma cuando sea posible; `useGLTF.preload` en
  la pantalla de carga para los esenciales.
- Objetivo: 60 FPS en desktop moderno; degradación fluida (sin congelarse) en
  equipos modestos.

## Accesibilidad

- El `<Canvas>` y todo lo 3D es decorativo: `aria-hidden="true"`.
- Todo el contenido textual y los enlaces viven en el overlay HTML con la
  semántica y ARIA actuales (roles de tabs en Experience, alt text, aria-labels).
- `prefers-reduced-motion: reduce` → sin movimiento continuo de cámara ni
  partículas; el contenido permanece navegable y legible; el scroll funciona.
- Navegación por teclado y lectores de pantalla operan sobre el overlay,
  independientemente del estado del 3D.

## Pantalla de carga y fallback

- `LoadingScreen`: cubre el viewport, muestra progreso real (`useProgress`) con
  tratamiento estilizado (p. ej. sendero/altímetro/copo animado en la paleta de
  la marca), y hace fade-out al 100% revelando la escena.
- `WebGLFallback`: si `useWebGLSupport` indica que no hay WebGL, se omite el
  canvas y se renderiza un póster del nevado más las secciones HTML normales
  (experiencia 2D legible, sin pantalla en blanco).

## Criterios de éxito

1. El scroll mueve la cámara descendiendo el nevado de forma continua a través de
   los 5 biomas, con contenido sincronizado.
2. Las transiciones de bioma (fog/luz/vegetación) interpolan sin cortes.
3. La pantalla de carga aparece primero y revela la escena solo al 100%.
4. En equipos modestos la experiencia se mantiene fluida (autoescalado actúa).
5. Con `prefers-reduced-motion`, no hay movimiento continuo y todo es legible.
6. Sin WebGL, se ve el póster + contenido, nunca un canvas roto.
7. Contenido textual, datos y ARIA conservados respecto al portafolio actual.
8. `next build` pasa sin errores de tipo ni lint.

## Riesgos

- **Curaduría de modelos**: encontrar GLB libres coherentes y livianos toma
  iteración; mitigar con pocos modelos bien elegidos e instanciados.
- **Tuning visual iterativo**: cámara, luz, fog y posición de vegetación
  requieren ajuste fino con feedback visual humano (el agente no ve el render).
- **SSR/hidratación**: el canvas debe montarse client-side (`ssr: false`);
  cuidar que el overlay HTML siga siendo SSR-friendly para SEO del texto.
- **Peso del bundle**: three + drei + postprocessing son pesados; mitigar con
  carga diferida del canvas y modelos comprimidos.
- **Sincronía scroll/overlay**: alinear secciones HTML con los rangos de bioma
  puede requerir ajuste de `pages`/posiciones.

## Plan de entrega sugerido (para la fase de planificación)

Construir incrementalmente y verificar visualmente en checkpoints:
1. Andamiaje: deps, config, canvas vacío con `ScrollControls` + cámara por curva.
2. Terreno procedural + cámara descendiendo.
3. Biomas (fog/luz interpolados) + partículas de nieve.
4. Vegetación/fauna instanciada por bioma.
5. Overlay de contenido sincronizado + restyle glass de secciones.
6. Pantalla de carga + autoescalado de calidad.
7. Fallback WebGL + reduced-motion + pase de accesibilidad.
