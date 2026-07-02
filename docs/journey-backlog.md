# Backlog — "El Ascenso del Nevado" (experiencia 3D)

Mejoras posibles para el viaje 3D (`src/components/journey/`). No bloquean; el
sitio funciona. Ordenadas por impacto aproximado.

> **Estado v2 (2026-07-01):** casi todo el backlog aterrizó en el rework v2.
> Único pendiente real: modelos GLB curados (ver abajo).

## Visual / arte

- [x] **Laderas lejanas se ven "pintadas"** — resuelto con `SkyDome` (drei `Sky`
      por bioma) + `DistantRange` (cordillera de fondo en silueta con fog). El
      horizonte ahora da profundidad/escala.
- [x] **Bandera / mojón en la cumbre** — `SummitFlag.tsx` (mojón + asta + bandera
      ondeando) plantado en `z ≈ Z_TOP`, congela bajo reduced-motion.
- [ ] **Modelos GLB curados** (Task 22 del plan) — **DIFERIDO.** No se pudieron
      obtener y verificar assets CC0 (licencia) de forma fiable en el entorno; el
      plan prohíbe expresamente enviar assets sin licencia. Se mantienen las
      mallas procedurales (mejoradas en el rework). Abrir cuando haya assets CC0
      verificados: curar + `gltf-transform` + `public/models/CREDITS.md`.
- [x] **Cóndor** — batido de alas sutil (`wingL`/`wingR` refs, `sin(t*4)`),
      congela bajo reduced-motion.
- [x] **Variedad de árboles** — 3 variantes de pino (escala/tinte por hash
      determinista) + rocas dispersas (dodecaedro) en banda páramo/glaciar.
- [x] **Cielo** — `SkyDome` con `Sky` de drei; sol/turbidity/rayleigh por
      `scroll.offset`. Se quitó el `scene.background` de `BiomeController`.
- [x] **Agua/río** — `Water.tsx`, plano translúcido low-poly con ripple de
      vértices en el valle (congela bajo reduced-motion).

## Interacción / cámara

- [x] **Afinar el snap** — `SnapScroll` reescrito: `scrollend` nativo con fallback
      idle (140ms) + guard de settle (650ms); desactivado bajo reduced-motion.
- [x] **Indicador de progreso/altitud** — `AltitudeGauge.tsx` (portal a
      `document.body`): % de ascenso + bioma actual; oculto en móvil, decorativo.
- [x] **Micro-parallax de cámara** — sway con `state.pointer` en `CameraRig`,
      desactivado bajo reduced-motion.
- [x] **Puntos de interés clicables** — `PointsOfInterest.tsx`: carteles de
      sendero que hacen scroll a la sección vía `scrollBridge`.

## Contenido / legibilidad

- [x] **Contraste del overlay** — reskin editorial crema/bosque/sage: paneles
      `bg-parchment/85` con `ring-[var(--line)]`, texto `bark`/`muted`, acentos
      `sage`; legible sobre biomas claros.
- [x] **Animación de entrada** — `RevealPanel` (fade/scale al centrarse, re-dispara
      al re-entrar por snap, respeta reduced-motion) envuelve los 5 paneles.
- [x] **Footer** — no se renderiza en el viaje 3D; **decisión: se omite** del
      ascenso (el clímax es la cumbre + Contact). Componente queda sin uso.

## Rendimiento / robustez

- [ ] **Probar en móvil real** y equipos modestos; verificar que `PerformanceMonitor`
      degrada bien (nieve 200, sin postprocesado). *(Pendiente: check manual en
      dispositivo; el código de degradación está intacto.)*
- [x] **Lockfiles** — se eliminó `package-lock.json`; se mantiene `pnpm-lock.yaml`
      (pnpm es el gestor). `pnpm install` resuelve limpio.
- [x] **`AnimatedSection.tsx`** — confirmado sin uso; eliminado.
- [ ] **Disposición de recursos** — r3f libera geometrías/materiales al desmontar
      por defecto; sin globales manuales que persistan. *(Sin fugas evidentes;
      confirmación fina en alternancia repetida canvas↔fallback queda como check.)*
- [x] **SEO** — validado: el texto del overlay (`Scroll html`) aparece en el HTML
      servido (`Full Stack Developer`, `CAMILO ARBOLEDA`, `<title>`), indexable
      pese a `ssr:false` del canvas.

## Accesibilidad

- [ ] **Foco de teclado** entre secciones — la navegación del Header usa
      `scrollBridge`; falta confirmar visualmente el foco al saltar por offset.
      *(Check manual recomendado.)*
- [x] **reduced-motion + WebGL off** — reduced-motion hilado en snap, cámara,
      parallax, bandera, agua, cóndor, paneles; `WebGLFallback` (2D) renderiza las
      5 secciones con la paleta crema. *(Verificación visual final recomendada.)*

## Nota — dev-only

- Advertencia `createRoot` de drei `<Scroll html>` bajo React StrictMode en dev
  (doble montaje): preexistente, no afecta el build de producción. Evaluar guard
  o decisión de StrictMode si molesta en desarrollo.
