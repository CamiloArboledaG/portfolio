# Mejoras Pendientes del Portafolio

## Alta Prioridad

- [~] Agregar 2-4 proyectos más — **decisión deliberada: mantener 1 proyecto real**
      ("Guess What"). Se prefiere calidad sobre relleno; la card se centró/agrandó
      para no verse estirada. Reabrir cuando haya proyectos reales que sumar.
- [x] Agregar métricas/logros medibles en Experience — Experience enriquecido con
      rol, empresa, periodo, ubicación y bullets del CV por puesto (v2).
- [x] Definir interfaces TypeScript para datos — `Experience`, `Project`,
      `SkillGroup`, `Education`, `Certification` en `src/lib/data.ts` (v2).

## Media Prioridad (diferido)

- [ ] Agregar sección de Blog técnico
- [ ] Agregar testimonios/recomendaciones de LinkedIn

## Baja Prioridad (diferido)

- [ ] Toggle modo claro/oscuro

## Completado

- [x] Migración a Next.js 14+ con App Router
- [x] Implementar diseño con Tailwind CSS
- [x] Botón descargar CV
- [x] Animaciones con Framer Motion
- [x] Efecto 3D en avatar
- [x] Navegación responsive
- [x] SEO metadata básico
- [x] Agregar sitemap.xml y robots.txt para SEO
- [x] Mejorar alt text de imágenes para accesibilidad
- [x] Agregar prefers-reduced-motion para usuarios sensibles al movimiento
- [x] Optimizar imágenes de logos con next/image (sizes attribute)
- [x] Integrar Vercel Analytics
- [x] Agregar página 404 personalizada
- [x] Agregar Open Graph image dinámico para compartir en redes

### v2 — Rework 3D "El Ascenso del Nevado" (2026-07-01)
- [x] Reskin editorial crema/bosque/sage (paleta CV) en todas las secciones
- [x] Modelo de datos + contenido del CV (experiencias, skills agrupados, educación, certs)
- [x] Escena 3D: SkyDome, DistantRange, Water, SummitFlag por bioma
- [x] Cámara: `getCameraFrame` con final aéreo, micro-parallax, snap robusto
- [x] AltitudeGauge, RevealPanel, PointsOfInterest clicables
- [x] Cóndor con batido de alas + variedad de vegetación/rocas
- [x] Limpieza: lockfile único (pnpm), borrado de código muerto
- [~] Modelos GLB curados — diferido (sin assets CC0 verificables)

## Archivos Creados/Modificados

### Nuevos archivos
- `src/app/sitemap.ts` - Sitemap dinámico para SEO
- `src/app/robots.ts` - Robots.txt para crawlers
- `src/app/not-found.tsx` - Página 404 personalizada
- `src/app/opengraph-image.tsx` - OG image dinámico
- `src/hooks/useReducedMotion.ts` - Hook para accesibilidad de movimiento

### Mejoras de accesibilidad
- Todos los iconos tienen `aria-hidden="true"`
- Imágenes tienen alt text descriptivo
- Secciones tienen `aria-label`
- Tabs tienen roles ARIA correctos (`tablist`, `tab`, `tabpanel`)
- Links tienen `aria-label` descriptivo
- Soporte completo para `prefers-reduced-motion`
