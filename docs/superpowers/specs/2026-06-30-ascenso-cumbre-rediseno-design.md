# Rediseño Portafolio — "Ascenso a la Cumbre"

Fecha: 2026-06-30
Estado: Aprobado

## Resumen

Rediseño completo del portafolio con tema naturaleza/hiking. Metáfora narrativa:
el scroll vertical es un **ascenso a la cumbre**. Cada sección representa mayor
altitud. Un sendero SVG global con un marcador (hiker) animado conecta toda la
página y se dibuja según el progreso de scroll. Paleta "amanecer en montaña"
(verdes + tierra cálida + ámbar atardecer), estilo orgánico/natural (sombras
difusas, bordes redondeados, texturas topográficas, divisores curvos).

Stack actual se mantiene: Next.js 16 (App Router), React 19, Tailwind CSS 4,
framer-motion 12. Sin nuevas dependencias.

## Objetivos

- Identidad visual memorable que represente al usuario (naturaleza, hiking, verde).
- Animaciones de scroll que demuestren creatividad sin sacrificar rendimiento ni accesibilidad.
- Conservar todo el contenido y la estructura semántica actual (Hero, About,
  Experience, Projects, Contact, Footer) y el soporte `prefers-reduced-motion`.

## No-objetivos (YAGNI)

- No agregar contenido nuevo (proyectos, blog, testimonios) — fuera de alcance.
- No toggle claro/oscuro.
- No imágenes raster pesadas: todo asset decorativo es SVG inline.

## Narrativa y mapeo de secciones

| Sección | Rol narrativo | Altitud (decorativa) |
|---|---|---|
| Hero | Campamento base | 0 m |
| About | Primer tramo del sendero | ~600 m |
| Experience | Campamentos / hitos (cada empleo = waypoint) | ~1.200–2.400 m |
| Projects | Cumbres conquistadas (cada proyecto = un pico) | ~3.000 m |
| Contact | La cima — vista panorámica | ~4.000 m |

Las altitudes son decorativas (no datos reales) y refuerzan el progreso visual.

## Paleta — "Amanecer en montaña"

Definida en `src/app/globals.css` con variables CSS y `@theme inline` (Tailwind 4).

```
--canopy   #1a2e1f   verde bosque profundo  → fondo base
--pine     #2d4a35   verde pino             → superficies / cards
--moss     #5a8a5c   musgo                  → acentos secundarios / bordes
--fern     #8fbf6f   helecho                → acento brillante / hover CTA
--amber    #e8a04c   ámbar amanecer         → acento primario / CTA
--clay     #c4733d   tierra / arcilla       → detalles cálidos
--mist     #eef2e9   niebla / crema         → texto principal
--stone    #9aa896   piedra                 → texto muted
```

Nombres de tokens Tailwind mapeados: `--color-canopy`, `--color-pine`,
`--color-moss`, `--color-fern`, `--color-amber`, `--color-clay`,
`--color-mist`, `--color-stone`. Se reemplazan los tokens viejos
(`primary`, `secondary`, `dark`, `background`, `text`, `text-muted`) en todos
los componentes que los usan.

Mapeo de reemplazo recomendado para migración:
- `primary` (morado) → `amber`
- `secondary` → `moss`
- `dark` (sombras) → `pine`
- `background` → `canopy`
- `text` → `mist`
- `text-muted` → `stone`

Fondo Hero: degradado amanecer (`canopy` → tono `amber` tenue en el horizonte
inferior). Las secciones posteriores se oscurecen ligeramente conforme sube la
"altitud".

Scrollbar y `::selection` se actualizan a la nueva paleta (thumb `moss` →
hover `fern`, selección `amber`).

## Estilo visual

- Sombras **difusas suaves** (`shadow-lg`/`shadow-xl` con color, o
  `box-shadow` con blur), reemplazando las sombras duras neobrutalistas
  (`shadow-[8px_8px_0px_...]`).
- Bordes redondeados generosos (`rounded-2xl`/`rounded-3xl`).
- **Textura topográfica** sutil: SVG de líneas de contorno como fondo de baja
  opacidad en secciones.
- **Divisores de sección curvos**: SVG tipo cresta de montaña entre secciones,
  en vez de cortes rectos.
- Iconos lucide-react ya disponibles: `Mountain`, `Tent`, `Footprints`,
  `Trees`, `MapPin`, `Flag`, `Compass`.

## Componentes nuevos

Ubicación: `src/components/ui/` para piezas reutilizables decorativas.
Convención de nombres existente: PascalCase para componentes.

### `TrailPath` (`src/components/ui/TrailPath.tsx`)
Sendero SVG global posicionado de forma fija/absoluta que recorre verticalmente
la página. Usa framer-motion `useScroll` (progreso de toda la página) +
`useTransform` para animar `pathLength` del trazo punteado. Un marcador
(ícono hiker/`Footprints` o un punto con halo) sigue el avance del scroll a lo
largo del path. Si `useReducedMotion` es true: el path se muestra completo y
estático, sin marcador en movimiento.

Dependencias: `framer-motion`, `useReducedMotion` hook existente.

### `AltitudeIndicator` (`src/components/ui/AltitudeIndicator.tsx`)
Indicador sticky (esquina) que muestra una cota de altitud que aumenta con el
scroll (interpolada de 0 a ~4.000 m vía `useScroll`/`useTransform`). Oculto o
estático bajo `prefers-reduced-motion`. Oculto en pantallas muy pequeñas si
estorba.

### `MountainBackdrop` (`src/components/ui/MountainBackdrop.tsx`)
Capas SVG de siluetas de montañas + sol detrás del Hero, con parallax: cada
capa se traslada a distinta velocidad usando `useScroll` + `useTransform` sobre
`y`. Sin parallax bajo `prefers-reduced-motion` (capas estáticas). Solo
`transform` (GPU-friendly).

### `SectionDivider` (`src/components/ui/SectionDivider.tsx`)
Divisor curvo SVG tipo cordillera/cresta entre secciones. Prop para
orientación/color de relleno para encajar con el degradado de altitud. Puramente
decorativo, `aria-hidden`.

## Cambios por componente existente

- `src/app/globals.css`: nueva paleta, variables, `@theme inline`, scrollbar,
  selección, posible textura/gradiente base.
- `src/components/Hero.tsx`: "Campamento base". Integra `MountainBackdrop`
  (parallax), degradado amanecer, conserva avatar (efecto 3D existente) y CTAs.
  Migra tokens de color.
- `src/components/About.tsx`: tramo de sendero, textura topográfica, tokens.
- `src/components/Experience.tsx`: cada empleo como waypoint/campamento con cota
  de altitud y marcador (`Tent`/`MapPin`). Migra tokens.
- `src/components/Projects.tsx`: cards "cumbres" con etiqueta de altura, estilo
  orgánico (sombras difusas, redondeo). Migra tokens.
- `src/components/Contact.tsx`: "La cima" + tratamiento panorámico. Migra tokens.
- `src/components/Header.tsx` y `src/components/Footer.tsx`: nueva paleta,
  micro-detalles de naturaleza (ícono `Mountain`/`Compass` en logo, etc.).
- `src/app/page.tsx`: monta `TrailPath` y `AltitudeIndicator` a nivel global;
  intercala `SectionDivider` entre secciones.
- `src/app/opengraph-image.tsx`: actualizar colores para reflejar nueva paleta
  (coherencia al compartir).

## Flujo de datos

- Progreso de scroll global: un único `useScroll()` por componente que lo
  necesite (`TrailPath`, `AltitudeIndicator`, `MountainBackdrop`), derivando
  valores con `useTransform`. No se requiere estado compartido ni context: cada
  componente lee el scroll del viewport de forma independiente.
- `useReducedMotion` (hook existente, `src/hooks/useReducedMotion.ts`) gobierna
  si las animaciones derivadas del scroll se activan.

## Accesibilidad y rendimiento

- Todos los elementos decorativos: `aria-hidden="true"`.
- `prefers-reduced-motion`: sendero estático completo, sin parallax, altitud
  estática, sin marcador en movimiento. Reutiliza el hook existente.
- Animaciones solo sobre `transform`/`opacity`/`pathLength` (sin reflow).
- Assets decorativos como SVG inline (sin descargas extra, sin LCP penalizado).
- Mantener roles ARIA y alt text existentes intactos.

## Criterios de éxito

1. La paleta morada desaparece por completo; ningún token viejo queda referenciado.
2. Al scrollear, el sendero se dibuja progresivamente y el indicador de altitud sube.
3. Hero muestra parallax de montañas/sol; las secciones se separan con divisores curvos.
4. Con `prefers-reduced-motion: reduce`, no hay movimiento por scroll y todo
   permanece legible y completo.
5. `next build` pasa sin errores de tipo ni de lint.
6. Contenido textual y estructura semántica/ARIA sin pérdidas respecto al actual.

## Riesgos

- Posicionar un `TrailPath` global que se alinee con todas las secciones en
  distintos viewports puede requerir ajuste fino (porcentajes/viewport units en
  vez de coordenadas fijas).
- Parallax en móvil puede sentirse pesado: limitar capas y desactivar en
  pantallas pequeñas si hace falta.
