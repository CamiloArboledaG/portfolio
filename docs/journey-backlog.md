# Backlog — "El Ascenso del Nevado" (experiencia 3D)

Mejoras posibles para el viaje 3D (`src/components/journey/`). No bloquean; el
sitio funciona. Ordenadas por impacto aproximado.

## Visual / arte

- [ ] **Laderas lejanas se ven "pintadas"** (low-poly + fog + normals suaves).
      Subir detalle del terreno o añadir textura/normal sutil; probar `flatShading`
      por zonas o un segundo plano de cordillera de fondo.
- [ ] **Bandera / mojón en la cumbre** como remate del clímax (al llegar a Contact).
      Pequeño grupo 3D en `z ≈ Z_TOP`.
- [ ] **Modelos GLB curados** (Task 9 del plan): reemplazar pinos/frailejones/
      cóndor procedurales por GLB low-poly de licencia permisiva (CC0). Requiere
      curar assets + `gltf-transform` + `public/models/CREDITS.md`.
- [ ] **Cóndor**: animar batido de alas sutil y/o mejorar la silueta.
- [ ] **Variedad de árboles**: 2-3 variantes de pino y arbustos para romper la
      repetición; rocas dispersas en glaciar/páramo.
- [ ] **Cielo**: degradado/`Sky` de drei por bioma en vez de solo color de fondo.
- [ ] **Agua/río** en el valle (plano reflejante simple) para dar vida al inicio.

## Interacción / cámara

- [ ] **Afinar el snap**: ajustar tiempos (idle 150ms / settle 700ms) si se siente
      brusco o lento; opción de snap más fuerte tipo full-page.
- [ ] **Indicador de progreso/altitud** lateral (qué bioma, % de ascenso).
- [ ] **Micro-parallax de cámara** con el mouse (sutil) para dar profundidad.
- [ ] **Puntos de interés clicables** en la escena (ej. un cartel del sendero que
      lleve a una sección).

## Contenido / legibilidad

- [ ] **Contraste del overlay**: revisar legibilidad sobre fondos claros (cumbre);
      quizá oscurecer más el glass solo en biomas claros.
- [ ] **Animación de entrada** de cada panel al centrarse (fade/scale al hacer snap).
- [ ] **Footer**: hoy no se renderiza en el viaje 3D; decidir si va al final
      (cumbre) o se omite.

## Rendimiento / robustez

- [ ] **Probar en móvil real** y equipos modestos; verificar que `PerformanceMonitor`
      degrada bien (nieve 200, sin postprocesado).
- [ ] **Lockfiles**: el repo tiene `package-lock.json` (npm) y ahora `pnpm-lock.yaml`.
      Elegir un gestor y borrar el otro lockfile para evitar instalaciones
      inconsistentes. (Las deps 3D se agregaron con pnpm.)
- [ ] **`AnimatedSection.tsx`**: quedó sin uso tras el rediseño; evaluar borrarlo.
- [ ] **Disposición de recursos**: confirmar que geometrías/materiales se liberan
      si alguna vez se alterna canvas ↔ fallback varias veces.
- [ ] **SEO**: el texto vive en overlay HTML (bien), pero validar que el contenido
      sea indexable con el canvas `ssr:false`.

## Accesibilidad

- [ ] Revisar foco de teclado al navegar entre secciones con el scroll virtual
      (el `scrollBridge` mueve por offset; confirmar `scrollIntoView` del foco).
- [ ] Verificar la experiencia completa con `prefers-reduced-motion` y con WebGL
      deshabilitado (fallback 2D).
