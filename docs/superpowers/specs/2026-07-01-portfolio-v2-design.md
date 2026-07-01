# Portfolio v2 — Design Spec

Date: 2026-07-01
Owner: Camilo Arboleda

## Goal

Rework the 3D "mountain climb" portfolio so its content matches the new CV,
its palette reads like the CV (cream + forest green + sage), scroll snapping
centers each section cleanly, and the ending (Get In Touch) resolves with an
aerial pullback that reveals the whole mountain instead of a downward tilt.

Stack (existing, unchanged): Next.js App Router, Tailwind v4, Framer Motion,
react-three-fiber + drei (`ScrollControls`, `Scroll html`), postprocessing.

## Decisions (locked with user)

- Palette: **cream reskin** — cream panels, forest-green text, sage accent.
- Projects: **keep only "Guess What"** (improve its card). No invented projects.
- Finale: **aerial pullback / vista** revealing the full massif.
- CV PDF + profile photo: **user already replaced the files**; code only points at them.
- Education + Certifications: **live inside About** (no new section, no scroll remap).

## Workstreams

### 1. Data model + TypeScript (`src/lib/data.ts`)

Add exported interfaces and retype the data:

```ts
export interface Experience {
  company: string
  role: string
  period: string
  location: string
  description: string[]
  logo: string
}
export interface Project {
  title: string
  description: string
  image: string
  link: string
  tags: string[]
}
export interface SkillGroup { label: string; items: string[] }
export interface Education {
  degree: string
  school: string
  period: string
  location: string
}
export interface Certification { name: string }
```

Rewrite `experiences` from the CV (order newest → oldest):

1. **Simón Movilidad** — Full Stack Developer — `Sep 2025 — Present` — Bogotá, Colombia
   - Build/maintain urban-mobility web apps with React and Go, taking features
     from design to production and improving system performance.
   - Lead full projects as sole developer using C#, React, Vite and Next.js,
     owning frontend and backend end to end.
   - Adopt React Native to extend products to mobile.
   - Deploy from the command line across servers, orchestrating environments with Docker.
   - Boost productivity and code quality leveraging AI tools like Claude Code.
2. **Globe Software** — Full Stack Developer — `Jun 2022 — Sep 2025` — Montevideo, Uruguay (remote)
   - Develop/maintain web and mobile products with cross-functional teams, full stack.
   - Deliver interfaces in React and Angular, and cross-platform apps with Flutter.
   - Implement backend services in Node.js and Java with reliable, tested APIs.
   - Contribute to code reviews and agile ceremonies with consistent quality standards.
3. **DomicilioExpress.com** — Full Stack Developer — `Oct 2021 — Jun 2022` — Cali, Colombia
   - Build features for e-commerce and delivery platforms, improving end-to-end UX.
   - Optimize system efficiency and view performance, reducing load times under real traffic.
   - Collaborate on frontend and backend tasks to ship customer-facing features.

(Removes the old "Botmeni" entry.) Keep the "Campamento X m" altitude tag —
compute from index as today.

Add:

```ts
export const skillGroups: SkillGroup[] = [
  { label: 'Frontend', items: ['React','Next.js','Vite','Angular','TypeScript','HTML / CSS'] },
  { label: 'Backend', items: ['Node.js','Go','C#','Java','Python'] },
  { label: 'Mobile · Design · Tools', items: ['Flutter','React Native','Figma','Docker','Git / GitHub','Linux'] },
]

export const education: Education = {
  degree: 'Multimedia Engineering',
  school: 'Universidad Autónoma de Occidente',
  period: '2018 — 2023',
  location: 'Cali, Colombia',
}

export const certifications: Certification[] = [
  { name: 'Docker' },
  { name: 'Go (Golang)' },
]
```

Keep `projects` as the single "Guess What" entry (improved card, workstream 3).

`SOCIAL_LINKS` / contact (`src/lib/constants.ts`): add
`phone: '+57 312 680 9951'` and `location: 'Cali, Valle del Cauca, Colombia'`.

Update the CV profile copy in Hero/About to the CV's Profile paragraph.

### 2. Cream reskin (palette)

Tailwind v4 tokens live in `src/app/globals.css` under `@theme inline`. The 3D
scene colors are raw hex in `journey.ts` / biomes and are **not** touched — the
mountain stays green; only the HTML overlay reskins.

Target palette (CSS vars):

```
--parchment: #f4efe3;  /* panel background (cream) */
--bark:      #33432e;  /* headings + primary text (forest) */
--sage:      #6b8a52;  /* accent (replaces amber) */
--muted:     #6f7566;  /* secondary text */
--line:      rgba(51,67,46,0.15); /* hairlines / rings */
--forest-dk: #26331f;  /* deep forest for on-sage button text contrast */
```

Approach: keep the existing token names where they still make sense, but the
component sweep targets the semantic roles. Concretely, across all 7 components
(`Hero`, `About`, `Experience`, `Projects`, `Contact`, `Header`, `Footer`) plus
`WebGLFallback`:

- Panel `bg-canopy/72 ... ring-moss/25` → cream glass: `bg-parchment/85
  backdrop-blur-md ring-1 ring-[--line]` (keep rounded-3xl, shadow tuned warm).
- `text-mist` (headings) → `text-bark`.
- `text-stone` (body/muted) → `text-muted`.
- `text-amber` / accent → `text-sage`; `#`/`▹`/icons accent → sage.
- Chips `bg-moss/20 text-stone` → `bg-sage/12 text-bark ring-1 ring-[--line]`.
- Primary buttons `bg-amber text-canopy` → `bg-sage text-parchment`
  (hover deepen sage). Social buttons retuned to sage-on-cream.
- Header bar `bg-canopy/80` → `bg-parchment/85`, hairline border sage.
- `::selection` and scrollbar in globals → sage/parchment.

Add `sage`, `parchment`, `bark`, `muted` as `--color-*` in `@theme inline` so
Tailwind utility classes (`bg-sage`, `text-bark`, etc.) resolve.

### 3. Enriched About (`src/components/About.tsx`)

Two-column editorial layout echoing the CV:

- Left: CV Profile paragraph (real copy).
- Right/blocks: grouped skill chips from `skillGroups` (labeled groups
  Frontend / Backend / Mobile·Design·Tools), then an **Education** block and a
  **Certifications** block (icons: cap / badge).
- Stays a single `#about` section — no change to section count or camera.

### 4. Experience + Contact enrichment

- `Experience.tsx`: render `location` under company/period; use the rewritten
  CV bullets. Keep tab UI, altitude "Campamento" tag, ARIA roles.
- `Contact.tsx`: add phone and location rows beside email + "Say Hello" button.

### 5. Scroll snap fix (`JourneyCanvas.tsx` + sections)

Root cause: sections use `min-h-screen` + `py-20`, making them taller than the
viewport, so `ScrollControls` page boundaries (each = `clientHeight`) drift out
of alignment with section centers → the current "raro" snapping.

Fix:

- Each of the 5 sections becomes exactly `h-screen` with content vertically
  centered (`flex items-center`, internal scroll only if content overflows on
  small screens — panels are sized to fit). Remove the `py-20`+`min-h-screen`
  overflow. Total scroll height becomes exactly `pages * clientHeight`, so page
  index ↔ section is 1:1.
- Rewrite `SnapScroll`: on scroll-end (native `scrollend` where supported, with
  a `wheel`/`touchend` + idle-timer fallback for Safari), snap to the nearest
  page via `scrollTo({ behavior: 'smooth' })`; guard with a `snapping` flag and
  a settle timeout so it doesn't fight `ScrollControls` damping. Skip entirely
  under `prefers-reduced-motion` (unchanged behavior).

### 6. Aerial pullback finale (`journey.ts` + `CameraRig.tsx`)

Add a single source of truth for the camera frame:

```ts
export const FINALE_START = 0.85
export function getCameraFrame(offset: number, pos: THREE.Vector3, target: THREE.Vector3): void
```

- For `offset ∈ [0, FINALE_START]`: existing climb, remapped so the summit is
  reached at `FINALE_START` (i.e., climb uses `offset / FINALE_START`).
- For `offset ∈ [FINALE_START, 1]`: ease (smoothstep) from the summit-arrival
  frame to an **aerial vantage** — camera lifts up and pulls back to positive Z
  above/behind the summit, `target` set to the mid-mountain so the view looks
  down over the whole massif (the climbed valley visible below). No downward
  nose-tilt; it's a rising wide reveal.
- `CameraRig` calls `getCameraFrame` (replacing separate `cameraPosition` /
  `cameraTarget` calls), keeps the `lerp(0.1)` smoothing and reduced-motion
  snap. `cameraPosition`/`cameraTarget` may remain as thin wrappers used
  elsewhere (Header uses none; safe to refactor).

Verify the Contact panel is still readable during the reveal (cream panel over
a brighter summit sky) — adjust panel opacity/shadow if needed.

### 7. 3D journey enhancements (`docs/journey-backlog.md`)

All backlog items are in scope. `src/components/journey/`.

7a. **Cumbre flag / mojón** — small low-poly 3D group (cairn + flag on a pole,
    gentle cloth wave) placed at `z ≈ Z_TOP`, x = `pathX(Z_TOP)`, on the terrain.
    Becomes the focal point of the aerial finale (workstream 6).

7b. **Sky per biome** — replace the flat background color with drei `<Sky>` (or a
    gradient sky dome) whose sun position / turbidity is driven by scroll offset
    and blended per biome in `BiomeController`. Fixes the "painted" far slopes by
    giving the horizon real depth. Keep fog color blend as today.

7c. **Micro-parallax camera** — subtle mouse-driven offset added on top of the
    scroll camera frame in `CameraRig` (small XY sway, eased, disabled under
    reduced-motion). Must not fight `getCameraFrame`.

7d. **Altitude / progress indicator** — a thin vertical HTML gauge (in the
    `Scroll html` overlay, fixed side) showing current biome name and ascent %
    derived from `scroll.offset`. Sage/parchment styled, hidden on reduced-motion
    optional. Small, accessible (aria-hidden decorative or labeled).

7e. **Panel entrance animation on snap** — each section panel fades/scales in as
    it becomes centered. Use an in-view / offset-proximity trigger so it fires on
    snap-to-center, not just first mount. Respect reduced-motion.

7f. **Wildlife + vegetation variety** — condor gets a subtle wing-flap
    (vertex/bone or group rotation over time in `Wildlife`); `Vegetation` gets
    2–3 pine variants + shrubs and scattered rocks in páramo/glaciar.

7g. **River / water in valley** — simple reflective/animated plane near
    `Z_BOTTOM` following `pathX`, low-poly, subtle normal ripple. Adds life to
    the start. Procedural, no external assets.

7h. **Distant mountain range backdrop** — a far, low-detail silhouette ridge
    (large procedural mesh or billboarded ranges) beyond the valley walls to add
    scale and stop the slopes reading flat. Fogged into the horizon.

7i. **Curated GLB models** — replace procedural pines / frailejones / condor with
    permissively-licensed **CC0** low-poly GLB (e.g. Poly Pizza / Quaternius),
    optimized via `gltf-transform`, stored in `public/models/` with a
    `public/models/CREDITS.md`. **Best-effort**: if clean CC0 assets can't be
    sourced/verified during implementation, keep the current procedural meshes
    (already improved by 7f) and leave this item open in the backlog — do not
    ship unlicensed assets.

7j. **Clickable POIs** — a few trail signs/markers in the scene that, on click
    (raycast via r3f pointer events), scroll the overlay to the matching section
    (`scrollBridge.el.scrollTo`). Hover cursor + affordance. Keyboard-reachable
    equivalent already exists via Header nav (no regression).

### 8. Cleanup / robustness / a11y (`docs/journey-backlog.md`)

- **Lockfile**: keep `pnpm-lock.yaml`, delete `package-lock.json` (3D deps were
  added with pnpm). Confirm install still resolves.
- **Delete `src/components/ui/AnimatedSection.tsx`** — unused after redesign
  (grep to confirm zero imports first).
- **Footer decision**: it isn't rendered in the 3D journey; keep it out of the
  journey (omit) and document the choice. Remove dead import if any.
- **Resource disposal**: confirm geometries/materials dispose on canvas↔fallback
  toggles (spot-check; r3f disposes on unmount by default).
- **SEO**: verify overlay text is indexable despite `ssr:false` canvas (the
  `Scroll html` content is real DOM — confirm it renders in view-source/hydration
  and that metadata is intact).
- **Keyboard focus**: navigating sections via the virtual scroll should move
  focus sensibly; confirm `scrollBridge`-driven jumps don't strand focus.
- **Manual**: real mobile + modest hardware — verify `PerformanceMonitor`
  degrades (snow 200, no postprocessing) and reduced-motion / WebGL-off fallback.

## Non-goals / deferred

- Additional projects (2–4), technical blog, LinkedIn testimonials, light/dark
  toggle (from `IMPROVEMENTS.md`). "More projects" is a deliberate "keep one"
  decision. All `journey-backlog.md` items are **in scope** for this spec.

## Testing / verification

- `npm run build` + `npm run lint` (no `--fix`) pass.
- Manual (browser): scroll through all 5 sections — each snaps centered; nav
  links jump correctly; finale reveals the mountain (no downward tilt); cream
  panels legible over every biome; reduced-motion disables snap + camera lerp.
- WebGL fallback page renders with the cream palette.

## Files touched

- `src/lib/data.ts` (rewrite + interfaces)
- `src/lib/constants.ts` (phone/location)
- `src/lib/journey.ts` (`getCameraFrame`, `FINALE_START`)
- `src/app/globals.css` (palette tokens, selection, scrollbar)
- `src/components/{Hero,About,Experience,Projects,Contact,Header,Footer}.tsx`
- `src/components/journey/{JourneyCanvas,CameraRig,BiomeController,Terrain,Vegetation,Wildlife,ContentOverlay,WebGLFallback}.tsx`
- New: `src/components/journey/{SummitFlag,SkyDome,Water,DistantRange,AltitudeGauge,PointsOfInterest}.tsx` (names indicative)
- `public/models/` + `public/models/CREDITS.md` (if 7i lands)
- Delete: `src/components/ui/AnimatedSection.tsx`, `package-lock.json`
- `IMPROVEMENTS.md` + `docs/journey-backlog.md` (status updates)
