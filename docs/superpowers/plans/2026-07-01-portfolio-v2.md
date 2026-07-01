# Portfolio v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rework the 3D mountain-climb portfolio to match the new CV (content + cream/forest/sage palette), fix section scroll-snapping, resolve the ending with an aerial pullback, and land the full `journey-backlog.md`.

**Architecture:** Next.js App Router. HTML sections live in a drei `Scroll html` overlay above an r3f `Canvas`; `ScrollControls` drives `scroll.offset` (0→1) which a `CameraRig` maps to a camera frame along a valley→summit path. Palette is Tailwind v4 tokens in `globals.css`; the 3D scene uses raw hex (untouched by the reskin). Work is phased: content/palette → scroll/finale → scene visuals → cleanup.

**Tech Stack:** Next 16, React 19, Tailwind v4, Framer Motion 12, three 0.171, @react-three/fiber 9, @react-three/drei 10, @react-three/postprocessing 3, lucide-react. Package manager: **pnpm**.

## Global Constraints

- **No test framework exists and none is added.** Per-task gate = `pnpm build` (typecheck + compile) passes, `pnpm lint` passes (NEVER `--fix`), and manual browser verification via `pnpm dev`.
- **Never run `git commit`.** The user controls git. Each task ends with a **Checkpoint** step: stage nothing automatically, summarize the diff, and let the user commit.
- **Never run `pnpm lint --fix` / `eslint --fix`.**
- File naming: components in `PascalCase.tsx` (match existing `src/components/journey/`).
- 3D scene hex colors (`journey.ts`, biome `fog`/`sun`) are NOT part of the palette reskin.
- Respect `prefers-reduced-motion` (hook: `src/hooks/useReducedMotion.ts`) in every animation/camera/snap addition.
- CV PDF (`public/files/CamiloArboleda.pdf`) and profile photo are already replaced by the user — do not touch those files.

---

## Palette reference (used across Phase 1)

Add to `src/app/globals.css`:

```css
:root {
  /* existing forest tokens kept for the 3D-adjacent bits */
  --canopy: #1a2e1f;
  --pine: #2d4a35;
  --moss: #5a8a5c;
  --fern: #8fbf6f;
  --amber: #e8a04c;
  --clay: #c4733d;
  --mist: #eef2e9;
  --stone: #9aa896;
  /* NEW — CV editorial palette */
  --parchment: #f4efe3;
  --bark: #33432e;
  --sage: #6b8a52;
  --sage-deep: #566f42;
  --muted: #6f7566;
  --line: rgba(51, 67, 46, 0.15);
}
```

Class sweep mapping (apply everywhere in Phase 1 unless a task says otherwise):

| Old | New |
| --- | --- |
| `bg-canopy/72 ... ring-moss/25` (panel) | `bg-parchment/85 ring-1 ring-[var(--line)]` |
| `bg-canopy/80` (header) | `bg-parchment/85` |
| `text-mist` | `text-bark` |
| `text-stone` | `text-muted` |
| `text-amber` / accent color | `text-sage` |
| `bg-amber text-canopy` (button) | `bg-sage text-parchment` |
| `hover:bg-moss` (button hover) | `hover:bg-[var(--sage-deep)]` |
| `bg-moss/20 text-stone` (chip) | `bg-sage/12 text-bark ring-1 ring-[var(--line)]` |
| `bg-moss/15` / `bg-moss/10` | `bg-sage/10` |
| `border-moss/20` / `border-moss/30` | `border-[var(--line)]` |
| `shadow-pine/40` | `shadow-[rgba(51,67,46,0.18)]` |

---

# PHASE 1 — Content + palette

## Task 1: Data model, interfaces, CV content

**Files:**
- Modify: `src/lib/data.ts` (full rewrite)
- Modify: `src/lib/constants.ts` (add phone/location)

**Interfaces:**
- Produces: `Experience`, `Project`, `SkillGroup`, `Education`, `Certification` interfaces; exports `experiences: Experience[]`, `projects: Project[]`, `skillGroups: SkillGroup[]`, `education: Education`, `certifications: Certification[]`. Removes flat `skills` export.
- Consumes: nothing.

- [ ] **Step 1: Rewrite `src/lib/data.ts`**

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

export interface SkillGroup {
  label: string
  items: string[]
}

export interface Education {
  degree: string
  school: string
  period: string
  location: string
}

export interface Certification {
  name: string
}

export const experiences: Experience[] = [
  {
    company: 'Simón Movilidad',
    role: 'Full Stack Developer',
    period: 'Sep 2025 — Present',
    location: 'Bogotá, Colombia',
    description: [
      'Build and maintain urban-mobility web apps with React and Go, taking features from design to production and improving system performance.',
      'Lead full projects as sole developer using C#, React, Vite and Next.js, owning frontend and backend end to end.',
      'Adopted React Native to extend products to mobile platforms.',
      'Deploy from the command line across servers, orchestrating environments with Docker.',
      'Boost productivity and code quality leveraging AI tools like Claude Code.',
    ],
    logo: '/images/simon.png',
  },
  {
    company: 'Globe Software',
    role: 'Full Stack Developer',
    period: 'Jun 2022 — Sep 2025',
    location: 'Montevideo, Uruguay (remote)',
    description: [
      'Developed and maintained web and mobile products alongside cross-functional teams, covering the full stack.',
      'Delivered interfaces in React and Angular, and cross-platform apps with Flutter.',
      'Implemented backend services in Node.js and Java, ensuring reliable APIs and maintainable, tested code.',
      'Took part in code reviews and agile ceremonies, contributing to clean architecture and consistent quality standards.',
    ],
    logo: '/images/globe-software.svg',
  },
  {
    company: 'DomicilioExpress.com',
    role: 'Full Stack Developer',
    period: 'Oct 2021 — Jun 2022',
    location: 'Cali, Colombia',
    description: [
      'Built features for e-commerce and delivery platforms, improving the end-to-end user experience.',
      'Optimized system efficiency and view performance, reducing load times under real traffic.',
      'Collaborated on frontend and backend tasks to ship customer-facing features.',
    ],
    logo: '/images/botmeni.svg',
  },
]

export const projects: Project[] = [
  {
    title: 'Guess What',
    description:
      'An interactive guessing game built with modern web technologies. Features real-time gameplay and an engaging, responsive interface.',
    image: '/images/guess-what.svg',
    link: 'https://guess-what-henna.vercel.app/',
    tags: ['React', 'Vercel', 'Game'],
  },
]

export const skillGroups: SkillGroup[] = [
  { label: 'Frontend', items: ['React', 'Next.js', 'Vite', 'Angular', 'TypeScript', 'HTML / CSS'] },
  { label: 'Backend', items: ['Node.js', 'Go', 'C#', 'Java', 'Python'] },
  { label: 'Mobile · Design · Tools', items: ['Flutter', 'React Native', 'Figma', 'Docker', 'Git / GitHub', 'Linux'] },
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

Note: `DomicilioExpress.com` reuses the existing `/images/botmeni.svg` logo asset (a delivery/box glyph fits). If the user later supplies a real logo, swap the path.

- [ ] **Step 2: Add contact fields in `src/lib/constants.ts`**

Change the `SOCIAL_LINKS` object to include:

```ts
export const SOCIAL_LINKS = {
  github: 'https://github.com/CamiloArboledaG',
  linkedin: 'https://www.linkedin.com/in/camiloarboledag/',
  twitter: 'https://x.com/camilo_arbga',
  email: 'camiloarboleda2000@gmail.com',
  phone: '+57 312 680 9951',
  location: 'Cali, Valle del Cauca, Colombia',
}
```

- [ ] **Step 3: Build + lint**

Run: `pnpm build && pnpm lint`
Expected: PASS. (Build will fail if any component still imports the removed `skills` export — that's fixed in Task 4; if it fails only on `skills`, proceed to Task 4 before re-running.)

- [ ] **Step 4: Checkpoint** — summarize diff; user commits.

---

## Task 2: Palette tokens

**Files:**
- Modify: `src/app/globals.css`

**Interfaces:**
- Produces: CSS vars `--parchment --bark --sage --sage-deep --muted --line` and Tailwind color tokens `parchment bark sage muted` for utility classes.
- Consumes: nothing.

- [ ] **Step 1: Add the new `:root` vars** (from the Palette reference block above) alongside the existing ones.

- [ ] **Step 2: Register Tailwind color tokens** inside `@theme inline`, appended after the existing `--color-*`:

```css
  --color-parchment: var(--parchment);
  --color-bark: var(--bark);
  --color-sage: var(--sage);
  --color-muted: var(--muted);
```

- [ ] **Step 3: Retune selection + scrollbar** — replace the `::selection`, scrollbar-thumb rules:

```css
::selection {
  background: var(--sage);
  color: var(--parchment);
}
::-webkit-scrollbar-thumb {
  background: var(--sage);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--sage-deep);
}
```

Leave `body { background: var(--canopy) }` — the canvas covers it; the flash-before-canvas stays dark and neutral.

- [ ] **Step 4: Build + lint** → `pnpm build && pnpm lint` → PASS.
- [ ] **Step 5: Checkpoint.**

---

## Task 3: Reskin Hero + Header + Footer

**Files:**
- Modify: `src/components/Hero.tsx`, `src/components/Header.tsx`, `src/components/Footer.tsx`

**Interfaces:**
- Consumes: palette tokens (Task 2), `SOCIAL_LINKS` (Task 1).

- [ ] **Step 1: Hero panel + text.** In `src/components/Hero.tsx`:
  - Panel wrapper: `bg-canopy/72 backdrop-blur-md ring-1 ring-moss/25` → `bg-parchment/85 backdrop-blur-md ring-1 ring-[var(--line)]`.
  - Gradient glow `from-amber to-moss` → `from-sage to-[var(--sage-deep)]`.
  - Photo frame `border-moss/30 shadow-2xl shadow-pine/40` → `border-[var(--line)] shadow-2xl shadow-[rgba(51,67,46,0.18)]`.
  - `text-mist` → `text-bark`; `text-stone` → `text-muted`; `text-amber` → `text-sage`.
  - Download button `bg-amber text-canopy ... shadow-pine/40 hover:shadow-amber/30` → `bg-sage text-parchment ... shadow-[rgba(51,67,46,0.18)] hover:shadow-[rgba(107,138,82,0.35)]`.
  - Social buttons `bg-moss/20 ... hover:bg-amber/20 hover:text-amber` → `bg-sage/12 ring-1 ring-[var(--line)] ... hover:bg-sage/20 hover:text-sage`.
  - Replace the intro paragraph text with the CV Profile copy:

```tsx
              I&apos;m a Full Stack Developer focused on building scalable,
              high-performance, user-centered applications, with solid experience
              across frontend and backend. I work with JavaScript, TypeScript,
              React, Next.js, Angular, Node.js, Java, C#, Python, Go and Flutter,
              committed to clean architecture, code quality and continuous
              improvement — leveraging AI tools such as Claude Code to solve real
              problems and build products with impact.
```

- [ ] **Step 2: Header.** In `src/components/Header.tsx`:
  - `bg-canopy/80 ... border-moss/20` → `bg-parchment/85 ... border-b border-[var(--line)]`.
  - Logo `text-mist hover:text-amber`, `Mountain ... text-amber` → `text-bark hover:text-sage`, icon `text-sage`.
  - Nav links `text-stone hover:text-amber`, underline `bg-amber` → `text-muted hover:text-sage`, underline `bg-sage`.
  - Contact button `bg-amber text-canopy hover:bg-moss` → `bg-sage text-parchment hover:bg-[var(--sage-deep)]`.
  - Mobile toggle `text-mist` → `text-bark`; mobile links `text-stone hover:text-amber` → `text-muted hover:text-sage`.

- [ ] **Step 3: Footer.** In `src/components/Footer.tsx`:
  - `border-moss/20` → `border-[var(--line)]`; `text-stone` → `text-muted`; link `text-amber` → `text-sage`; social `text-stone hover:text-amber` → `text-muted hover:text-sage`.

- [ ] **Step 4: Build + lint** → PASS.
- [ ] **Step 5: Manual** — `pnpm dev`, open `/`: Hero panel is cream, text forest-green, sage accents/buttons; header cream. No amber remains in Hero/Header/Footer.
- [ ] **Step 6: Checkpoint.**

---

## Task 4: Enriched About (profile + grouped skills + education + certifications)

**Files:**
- Modify: `src/components/About.tsx` (rewrite body)

**Interfaces:**
- Consumes: `skillGroups`, `education`, `certifications` (Task 1); palette tokens.
- Produces: nothing.

- [ ] **Step 1: Rewrite `src/components/About.tsx`.** Replace the flat `skills` import/usage with grouped skills + education + certifications, cream editorial two-column layout:

```tsx
'use client'

import { motion } from 'framer-motion'
import { GraduationCap, BadgeCheck } from 'lucide-react'
import { skillGroups, education, certifications } from '@/lib/data'

export default function About() {
  return (
    <section id="about" className="h-screen flex items-center">
      <div className="max-w-6xl mx-auto px-6 rounded-3xl bg-parchment/85 backdrop-blur-md ring-1 ring-[var(--line)] py-10 max-h-[88vh] overflow-y-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-bark mb-10"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sage">#</span> About Me
        </motion.h2>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <p className="text-muted leading-relaxed">
              Full Stack Developer focused on building scalable, high-performance,
              user-centered applications, with solid experience across frontend and
              backend. Committed to clean architecture, code quality and continuous
              improvement, leveraging AI tools such as Claude Code to solve real
              problems and build products with impact.
            </p>

            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-bark mb-3">
                <GraduationCap size={18} className="text-sage" aria-hidden="true" /> Education
              </h3>
              <p className="text-bark font-medium">{education.degree}</p>
              <p className="text-muted text-sm">{education.school}</p>
              <p className="text-muted text-sm">{education.period} · {education.location}</p>
            </div>

            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-bark mb-3">
                <BadgeCheck size={18} className="text-sage" aria-hidden="true" /> Certifications
              </h3>
              <ul className="flex flex-wrap gap-2">
                {certifications.map((c) => (
                  <li key={c.name} className="px-3 py-1 bg-sage/12 text-bark ring-1 ring-[var(--line)] rounded-full text-sm">
                    {c.name}
                  </li>
                ))}
              </ul>
              <p className="text-muted text-xs mt-2">Public credentials on LinkedIn</p>
            </div>
          </motion.div>

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <h3 className="text-xl font-semibold text-bark">Technologies I work with</h3>
            {skillGroups.map((group) => (
              <div key={group.label}>
                <p className="text-xs font-semibold tracking-widest uppercase text-sage mb-2">
                  {group.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1.5 bg-sage/12 text-bark ring-1 ring-[var(--line)] rounded-full text-sm hover:bg-sage/20 transition-colors cursor-default"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Build + lint** → PASS (this also clears any leftover `skills` import error from Task 1).
- [ ] **Step 3: Manual** — About shows profile + Education + Certifications on the left, grouped skill chips on the right, all cream/sage. Panel fits within one screen (internal scroll only if very short viewport).
- [ ] **Step 4: Checkpoint.**

---

## Task 5: Experience enrichment + reskin

**Files:**
- Modify: `src/components/Experience.tsx`

**Interfaces:**
- Consumes: `experiences` (now includes `location`), palette tokens.

- [ ] **Step 1: Section height + panel.** Change `className="py-20 min-h-screen flex items-center"` → `className="h-screen flex items-center"`. Panel wrapper → `bg-parchment/85 backdrop-blur-md ring-1 ring-[var(--line)] py-10 max-h-[88vh] overflow-y-auto`.

- [ ] **Step 2: Palette sweep** in this file: `text-mist`→`text-bark`, `text-stone`→`text-muted`, `text-amber`→`text-sage`, `bg-amber/10 border-amber`→`bg-sage/10 border-sage`, `hover:bg-moss/10`→`hover:bg-sage/10`, `border-moss/30`→`border-[var(--line)]`, `bg-moss/20`→`bg-sage/12`, `text-amber/80`→`text-sage/80`.

- [ ] **Step 3: Render `location`.** After the `<time>{exp.period}</time>` paragraph, add:

```tsx
                          <p className="text-muted text-sm">{exp.location}</p>
```

- [ ] **Step 4: Build + lint** → PASS.
- [ ] **Step 5: Manual** — three tabs (Simón Movilidad / Globe Software / DomicilioExpress.com), each shows role, company, period, location, "Campamento" tag, CV bullets; cream/sage styling.
- [ ] **Step 6: Checkpoint.**

---

## Task 6: Projects reskin + improved card

**Files:**
- Modify: `src/components/Projects.tsx`

- [ ] **Step 1: Section height + panel.** `py-20 min-h-screen flex items-center` → `h-screen flex items-center`. Panel → `bg-parchment/85 backdrop-blur-md ring-1 ring-[var(--line)] py-10`.

- [ ] **Step 2: Palette sweep.** `text-mist`→`text-bark`, `text-stone`→`text-muted`, `text-amber`→`text-sage`, `text-amber/80`→`text-sage/80`, card `bg-pine/30 border-moss/20 hover:border-amber/50 shadow-pine/30` → `bg-white/60 border-[var(--line)] hover:border-sage/50 shadow-[rgba(51,67,46,0.12)]`, image bg `bg-moss/15`→`bg-sage/10`, tag chip `bg-moss/15 text-stone`→`bg-sage/12 text-bark ring-1 ring-[var(--line)]`, hover heading `group-hover:text-amber`→`group-hover:text-sage`, icon hover `group-hover:text-amber`→`group-hover:text-sage`.

- [ ] **Step 3: Center the single card.** Change grid to center one card nicely: `grid md:grid-cols-2 lg:grid-cols-3 gap-6` → `grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl`. (One real project; keep the card larger and left-aligned rather than stretched.)

- [ ] **Step 4: Build + lint** → PASS.
- [ ] **Step 5: Manual** — Guess What card renders cream, sage accents, "Cumbre" tag, tags chips.
- [ ] **Step 6: Checkpoint.**

---

## Task 7: Contact enrichment + reskin

**Files:**
- Modify: `src/components/Contact.tsx`

**Interfaces:**
- Consumes: `SOCIAL_LINKS.phone`, `SOCIAL_LINKS.location`, palette tokens.

- [ ] **Step 1: Section height + panel.** `py-20 min-h-screen flex items-center` → `h-screen flex items-center`. Panel → `bg-parchment/85 backdrop-blur-md ring-1 ring-[var(--line)] py-10`.

- [ ] **Step 2: Palette sweep.** `text-mist`→`text-bark`, `text-stone`→`text-muted`, `Flag className="text-amber"`→`text-sage`, button `bg-amber text-canopy ... shadow-pine/40 hover:shadow-amber/30`→`bg-sage text-parchment ... shadow-[rgba(51,67,46,0.18)] hover:shadow-[rgba(107,138,82,0.35)]`.

- [ ] **Step 3: Add phone + location rows.** After the email paragraph (`{SOCIAL_LINKS.email}`), add:

```tsx
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-x-8 gap-y-2 text-muted text-sm">
          <a href={`tel:${SOCIAL_LINKS.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-2 hover:text-sage transition-colors">
            <Phone size={16} aria-hidden="true" /> {SOCIAL_LINKS.phone}
          </a>
          <span className="inline-flex items-center gap-2">
            <MapPin size={16} aria-hidden="true" /> {SOCIAL_LINKS.location}
          </span>
        </div>
```

Update the import: `import { Mail, Flag, Phone, MapPin } from 'lucide-react'`.

- [ ] **Step 4: Build + lint** → PASS.
- [ ] **Step 5: Manual** — Contact shows Say Hello button, email, phone (tel link), location; cream/sage.
- [ ] **Step 6: Checkpoint.**

---

## Task 8: WebGLFallback palette

**Files:**
- Modify: `src/components/journey/WebGLFallback.tsx`

- [ ] **Step 1: Warm the fallback gradient** so cream panels read against it: change `bg-gradient-to-b from-[#dfe9f2] via-[#8a8275] to-[#5f7d3a]` → `bg-gradient-to-b from-[#dfe9f2] via-[#b9c3a4] to-[#5f7d3a]`. (Sections already reskinned; nothing else here.)

- [ ] **Step 2: Build + lint** → PASS.
- [ ] **Step 3: Manual (optional)** — force fallback by temporarily returning `<WebGLFallback />` from `JourneyExperience`, confirm cream panels legible, then revert.
- [ ] **Step 4: Checkpoint.**

---

# PHASE 2 — Scroll snap + section sizing

## Task 9: Verify section sizing is exactly one viewport

**Files:**
- Modify (only if any remain): section components from Phase 1.

**Interfaces:**
- Produces: every section root is `h-screen` (not `min-h-screen`+`py-20`), so total scroll height = `SCROLL_PAGES * clientHeight`.

- [ ] **Step 1: Grep for stragglers.** Run: `grep -rn "min-h-screen\|py-20" src/components/Hero.tsx src/components/About.tsx src/components/Experience.tsx src/components/Projects.tsx src/components/Contact.tsx`
  Expected: no `min-h-screen`; Hero may still use `min-h-screen` — fix it now.

- [ ] **Step 2: Fix Hero height.** In `src/components/Hero.tsx`, change `className="min-h-screen flex items-center pt-20 pb-16"` → `className="h-screen flex items-center pt-20 pb-16"`.

- [ ] **Step 3: Build + lint** → PASS.
- [ ] **Step 4: Manual** — scroll top→bottom: exactly 5 screens, no extra tail scroll past Contact.
- [ ] **Step 5: Checkpoint.**

---

## Task 10: Robust snap-to-section

**Files:**
- Modify: `src/components/journey/JourneyCanvas.tsx` (the `SnapScroll` component)

**Interfaces:**
- Consumes: `useScroll().el`, `useReducedMotion()`.

- [ ] **Step 1: Replace the `SnapScroll` function** with an implementation that snaps on interaction-end using native `scrollend` when available, with a wheel/touch idle fallback, guarded against fighting `ScrollControls` damping:

```tsx
function SnapScroll() {
  const data = useScroll()
  const reducedMotion = useReducedMotion()
  useEffect(() => {
    if (reducedMotion) return
    const el = data.el
    let snapping = false
    let idle: ReturnType<typeof setTimeout>
    let release: ReturnType<typeof setTimeout>

    const snap = () => {
      if (snapping) return
      const page = Math.round(el.scrollTop / el.clientHeight)
      const target = page * el.clientHeight
      if (Math.abs(target - el.scrollTop) < 2) return
      snapping = true
      el.scrollTo({ top: target, behavior: 'smooth' })
      clearTimeout(release)
      release = setTimeout(() => { snapping = false }, 650)
    }

    const supportsScrollEnd = 'onscrollend' in el
    const onScrollEnd = () => { if (!snapping) snap() }
    const onScroll = () => {
      if (snapping) return
      clearTimeout(idle)
      idle = setTimeout(snap, 140)
    }

    if (supportsScrollEnd) el.addEventListener('scrollend', onScrollEnd, { passive: true })
    else el.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      el.removeEventListener('scrollend', onScrollEnd)
      el.removeEventListener('scroll', onScroll)
      clearTimeout(idle)
      clearTimeout(release)
    }
  }, [data, reducedMotion])
  return null
}
```

- [ ] **Step 2: Build + lint** → PASS.
- [ ] **Step 3: Manual** — scroll a little then release: view eases to the nearest section, centered, without ping-pong. Test wheel, trackpad, and touch (devtools mobile). Fast flick still settles on a section.
- [ ] **Step 4: Manual reduced-motion** — enable `prefers-reduced-motion`; snapping is disabled (free scroll).
- [ ] **Step 5: Checkpoint.**

---

# PHASE 3 — Camera finale + parallax + summit flag

## Task 11: `getCameraFrame` with aerial finale

**Files:**
- Modify: `src/lib/journey.ts`

**Interfaces:**
- Produces: `export const FINALE_START = 0.85`; `export function getCameraFrame(offset: number, pos: THREE.Vector3, target: THREE.Vector3): void`. Existing `cameraPosition` / `cameraTarget` kept for internal reuse.

- [ ] **Step 1: Add finale constants + helper** at the end of `src/lib/journey.ts`:

```ts
export const FINALE_START = 0.85

function smoothstep(t: number): number {
  const x = THREE.MathUtils.clamp(t, 0, 1)
  return x * x * (3 - 2 * x)
}

const _climbPos = new THREE.Vector3()
const _climbLook = new THREE.Vector3()
const _aerialPos = new THREE.Vector3()
const _aerialLook = new THREE.Vector3()

// Frame de cámara unificado. offset 0..FINALE_START = ascenso (comprimido);
// FINALE_START..1 = revelado aéreo: la cámara sube y retrocede para ver todo el macizo.
export function getCameraFrame(offset: number, pos: THREE.Vector3, target: THREE.Vector3): void {
  const t = THREE.MathUtils.clamp(offset, 0, 1)
  if (t <= FINALE_START) {
    const climb = t / FINALE_START
    cameraPosition(climb, pos)
    cameraTarget(climb, target)
    return
  }
  // Punto de llegada a la cumbre (climb = 1).
  cameraPosition(1, _climbPos)
  cameraTarget(1, _climbLook)
  // Mirador aéreo: alto y detrás/encima de la cumbre, mirando hacia el valle recorrido.
  const summitX = pathX(Z_TOP)
  const summitH = terrainHeight(summitX, Z_TOP)
  _aerialPos.set(summitX, summitH + 130, Z_TOP + 90)
  _aerialLook.set(0, summitH - 40, -110)
  const k = smoothstep((t - FINALE_START) / (1 - FINALE_START))
  pos.copy(_climbPos).lerp(_aerialPos, k)
  target.copy(_climbLook).lerp(_aerialLook, k)
}
```

- [ ] **Step 2: Build + lint** → PASS (unit-testable pure math; verified visually in Task 12).
- [ ] **Step 3: Checkpoint.**

---

## Task 12: CameraRig uses `getCameraFrame`

**Files:**
- Modify: `src/components/journey/CameraRig.tsx`

**Interfaces:**
- Consumes: `getCameraFrame` (Task 11).

- [ ] **Step 1: Rewrite `useFrame` body** to use the unified frame:

```tsx
import { getCameraFrame } from '@/lib/journey'
// ...
  useFrame(() => {
    getCameraFrame(scroll.offset, _pos, _look)
    if (reducedMotion) camera.position.copy(_pos)
    else camera.position.lerp(_pos, 0.1)
    camera.lookAt(_look)
  })
```

Remove the now-unused `cameraPosition`/`cameraTarget` imports (keep `_pos`/`_look`).

- [ ] **Step 2: Build + lint** → PASS.
- [ ] **Step 3: Manual** — scroll to the very bottom (Contact): camera rises and pulls back to reveal the whole mountain; NO downward nose-tilt. The climb still feels continuous up to ~85% scroll.
- [ ] **Step 4: Checkpoint.**

---

## Task 13: Micro-parallax on mouse

**Files:**
- Modify: `src/components/journey/CameraRig.tsx`

- [ ] **Step 1: Add pointer-driven sway** layered on the frame. Use r3f's `state.pointer` (normalized −1..1) in `useFrame`, skip under reduced-motion:

```tsx
  useFrame((state) => {
    getCameraFrame(scroll.offset, _pos, _look)
    if (!reducedMotion) {
      _pos.x += state.pointer.x * 1.5
      _pos.y += state.pointer.y * 0.8
    }
    if (reducedMotion) camera.position.copy(_pos)
    else camera.position.lerp(_pos, 0.1)
    camera.lookAt(_look)
  })
```

(`state` is the first `useFrame` arg; update the callback signature.)

- [ ] **Step 2: Build + lint** → PASS.
- [ ] **Step 3: Manual** — moving the mouse adds a subtle depth sway; disabled under reduced-motion; doesn't break the finale.
- [ ] **Step 4: Checkpoint.**

---

## Task 14: Summit flag / cairn

**Files:**
- Create: `src/components/journey/SummitFlag.tsx`
- Modify: `src/components/journey/JourneyCanvas.tsx` (mount it)

**Interfaces:**
- Consumes: `pathX`, `terrainHeight`, `Z_TOP` from `journey.ts`.

- [ ] **Step 1: Create `src/components/journey/SummitFlag.tsx`** — a low-poly cairn + pole + gently waving flag at the summit:

```tsx
'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { pathX, terrainHeight, Z_TOP } from '@/lib/journey'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export default function SummitFlag() {
  const flagRef = useRef<THREE.Mesh>(null)
  const reducedMotion = useReducedMotion()
  const x = pathX(Z_TOP)
  const y = terrainHeight(x, Z_TOP)

  useFrame((state) => {
    if (reducedMotion || !flagRef.current) return
    const t = state.clock.elapsedTime
    flagRef.current.rotation.y = Math.sin(t * 2) * 0.15
    flagRef.current.scale.x = 1 + Math.sin(t * 3) * 0.06
  })

  return (
    <group position={[x, y, Z_TOP]}>
      {/* cairn */}
      <mesh position={[0.8, 0.5, 0]} castShadow>
        <dodecahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial color="#6b6257" flatShading />
      </mesh>
      {/* pole */}
      <mesh position={[0, 2.4, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 5, 6]} />
        <meshStandardMaterial color="#8a7a63" />
      </mesh>
      {/* flag */}
      <mesh ref={flagRef} position={[0.75, 4.2, 0]}>
        <planeGeometry args={[1.5, 0.9]} />
        <meshStandardMaterial color="#6b8a52" side={THREE.DoubleSide} flatShading />
      </mesh>
    </group>
  )
}
```

- [ ] **Step 2: Mount it** in `JourneyCanvas.tsx` inside `<ScrollControls>`, after `<TrailMarker />`: `<SummitFlag />` (add the import).

- [ ] **Step 3: Build + lint** → PASS.
- [ ] **Step 4: Manual** — at the summit / during the finale reveal a small flag+cairn is visible planted on the peak, flag gently waving (still under reduced-motion).
- [ ] **Step 5: Checkpoint.**

---

# PHASE 4 — Scene visuals

## Task 15: Sky dome per biome

**Files:**
- Create: `src/components/journey/SkyDome.tsx`
- Modify: `src/components/journey/JourneyCanvas.tsx`

**Interfaces:**
- Consumes: `scroll.offset`; drei `Sky`.

- [ ] **Step 1: Create `src/components/journey/SkyDome.tsx`** — drei `<Sky>` with sun elevation/turbidity driven by scroll so the horizon gains depth (fixes "painted" slopes):

```tsx
'use client'

import { useRef } from 'react'
import { Sky } from '@react-three/drei'
import { useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function SkyDome() {
  const scroll = useScroll()
  const ref = useRef<any>(null)
  const sun = new THREE.Vector3()

  useFrame(() => {
    const t = THREE.MathUtils.clamp(scroll.offset, 0, 1)
    // Sol sube al ascender: elevación de bajo (valle) a alto (cumbre).
    const elevation = THREE.MathUtils.lerp(4, 32, t) * (Math.PI / 180)
    const azimuth = THREE.MathUtils.lerp(150, 180, t) * (Math.PI / 180)
    const r = 450
    sun.set(
      r * Math.cos(elevation) * Math.cos(azimuth),
      r * Math.sin(elevation),
      r * Math.cos(elevation) * Math.sin(azimuth),
    )
    if (ref.current) {
      ref.current.material.uniforms.sunPosition.value.copy(sun)
      ref.current.material.uniforms.turbidity.value = THREE.MathUtils.lerp(8, 2.5, t)
      ref.current.material.uniforms.rayleigh.value = THREE.MathUtils.lerp(2.5, 1.2, t)
    }
  })

  return <Sky ref={ref} distance={450} sunPosition={[0, 20, -100]} />
}
```

- [ ] **Step 2: Mount** in `JourneyCanvas.tsx` inside `<ScrollControls>`, before `<Terrain />`: `<SkyDome />` (add import). Note: `BiomeController` still sets `scene.background` each frame — remove that background assignment so the Sky shows. In `BiomeController.tsx`, delete the two lines that set `scene.background`. Keep the fog color blend.

- [ ] **Step 3: Build + lint** → PASS.
- [ ] **Step 4: Manual** — sky gradient visible behind the ridges; sun sits low at the valley and higher near the summit; fog still tints the far terrain. Slopes read less flat.
- [ ] **Step 5: Checkpoint.**

---

## Task 16: River / water in the valley

**Files:**
- Create: `src/components/journey/Water.tsx`
- Modify: `src/components/journey/JourneyCanvas.tsx`

**Interfaces:**
- Consumes: `pathX`, `terrainHeight`, `Z_BOTTOM` from `journey.ts`.

- [ ] **Step 1: Create `src/components/journey/Water.tsx`** — a low-poly translucent plane near the valley floor with a subtle vertex ripple:

```tsx
'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { pathX, terrainHeight, Z_BOTTOM } from '@/lib/journey'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export default function Water() {
  const meshRef = useRef<THREE.Mesh>(null)
  const reducedMotion = useReducedMotion()
  const geo = useMemo(() => new THREE.PlaneGeometry(60, 90, 24, 24), [])
  const base = useMemo(() => geo.attributes.position.array.slice(0), [geo])

  const x = pathX(Z_BOTTOM)
  const y = terrainHeight(x, Z_BOTTOM) - 2.5
  const z = Z_BOTTOM + 30

  useFrame((state) => {
    if (reducedMotion || !meshRef.current) return
    const t = state.clock.elapsedTime
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const bx = base[i * 3]
      const bz = base[i * 3 + 1]
      pos.setZ(i, Math.sin(bx * 0.3 + t) * 0.4 + Math.cos(bz * 0.2 + t * 0.7) * 0.3)
    }
    pos.needsUpdate = true
  })

  return (
    <mesh ref={meshRef} geometry={geo} position={[x, y, z]} rotation={[-Math.PI / 2, 0, 0]}>
      <meshStandardMaterial color="#3f6f7a" transparent opacity={0.72} flatShading metalness={0.3} roughness={0.4} />
    </mesh>
  )
}
```

- [ ] **Step 2: Mount** in `JourneyCanvas.tsx` inside `<ScrollControls>`, after `<Terrain />`: `<Water />` (add import).

- [ ] **Step 3: Build + lint** → PASS.
- [ ] **Step 4: Manual** — at the very start (valley, Hero) a rippling water plane sits on the valley floor. No z-fighting with terrain (adjust the `- 2.5` offset if it clips).
- [ ] **Step 5: Checkpoint.**

---

## Task 17: Distant mountain range backdrop

**Files:**
- Create: `src/components/journey/DistantRange.tsx`
- Modify: `src/components/journey/JourneyCanvas.tsx`

- [ ] **Step 1: Create `src/components/journey/DistantRange.tsx`** — a large, low-detail silhouette ridge far beyond the valley, fogged into the horizon for scale:

```tsx
'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { Z_TOP } from '@/lib/journey'

function ridge(width: number, depth: number, seed: number, height: number) {
  const seg = 40
  const geo = new THREE.PlaneGeometry(width, depth, seg, 4)
  const pos = geo.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const peak =
      Math.sin(x * 0.02 + seed) * height +
      Math.sin(x * 0.06 + seed * 2) * height * 0.4 +
      Math.abs(Math.sin(x * 0.11 + seed)) * height * 0.3
    pos.setZ(i, Math.max(0, peak) * (pos.getY(i) > 0 ? 1 : 0.2))
  }
  geo.rotateX(-Math.PI / 2)
  geo.computeVertexNormals()
  return geo
}

export default function DistantRange() {
  const near = useMemo(() => ridge(600, 40, 1.3, 80), [])
  const far = useMemo(() => ridge(800, 40, 4.1, 120), [])
  return (
    <group>
      <mesh geometry={far} position={[0, -20, Z_TOP + 260]}>
        <meshStandardMaterial color="#aebfcf" flatShading fog />
      </mesh>
      <mesh geometry={near} position={[0, -10, Z_TOP + 190]}>
        <meshStandardMaterial color="#93a9a0" flatShading fog />
      </mesh>
    </group>
  )
}
```

- [ ] **Step 2: Mount** in `JourneyCanvas.tsx` inside `<ScrollControls>`, before `<Terrain />` (after `<SkyDome />`): `<DistantRange />` (add import). If ranges exceed the camera `far` plane (360), bump the `Canvas camera` `far` to `700`.

- [ ] **Step 3: Build + lint** → PASS.
- [ ] **Step 4: Manual** — layered mountains sit on the horizon beyond the valley, fading into fog; scene reads with real depth/scale. No pop-in at the camera far plane.
- [ ] **Step 5: Checkpoint.**

---

## Task 18: Condor wing-flap + vegetation variety

**Files:**
- Modify: `src/components/journey/Wildlife.tsx`, `src/components/journey/Vegetation.tsx`

**Interfaces:**
- Read both files first to match their existing structure before editing.

- [ ] **Step 1: Read** `src/components/journey/Wildlife.tsx` and `src/components/journey/Vegetation.tsx` fully.

- [ ] **Step 2: Condor flap.** In `Wildlife.tsx`, give the condor's wing meshes a `useRef` and animate `rotation.z` (or `rotation.x`) with `Math.sin(clock.elapsedTime * 4)` in a `useFrame`, disabled under `useReducedMotion`. Follow the file's existing mesh layout (wings are the two angled planes/triangles). If wings aren't separable, add a small group `position.y` bob + slight `rotation.z` oscillation on the whole bird as a fallback.

- [ ] **Step 3: Vegetation variety.** In `Vegetation.tsx`, add 2–3 pine variants (vary cone height/radius/tint per instance using a deterministic index-based pseudo-random) and scatter a handful of low-poly rocks (`dodecahedronGeometry`, grey `flatShading`) in the páramo/glaciar offset band. Keep instancing/counts consistent with the current approach; don't blow up the draw count (reuse `InstancedMesh` if the file already uses it).

- [ ] **Step 4: Build + lint** → PASS.
- [ ] **Step 5: Manual** — condor wings flap subtly (mid climb); trees vary in size/tint; scattered rocks appear higher up. Reduced-motion freezes the flap.
- [ ] **Step 6: Checkpoint.**

---

## Task 19: Altitude / progress gauge

**Files:**
- Create: `src/components/journey/AltitudeGauge.tsx`
- Modify: `src/components/journey/ContentOverlay.tsx`

**Interfaces:**
- Consumes: `scroll.offset`, `BIOMES` from `journey.ts`. Rendered inside the `Scroll html` overlay so it's DOM (fixed position), not 3D.

- [ ] **Step 1: Create `src/components/journey/AltitudeGauge.tsx`**:

```tsx
'use client'

import { useEffect, useState } from 'react'
import { useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { BIOMES } from '@/lib/journey'

export default function AltitudeGauge() {
  const scroll = useScroll()
  const [pct, setPct] = useState(0)
  const [biome, setBiome] = useState(BIOMES[0].name)

  useFrame(() => {
    const t = Math.min(Math.max(scroll.offset, 0), 1)
    setPct(Math.round(t * 100))
    const b = BIOMES.find((bi) => t <= bi.range[1]) ?? BIOMES[BIOMES.length - 1]
    if (b.name !== biome) setBiome(b.name)
  })

  return (
    <div
      className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-2 pointer-events-none"
      aria-hidden="true"
    >
      <span className="text-xs font-semibold text-bark/80 capitalize">{biome}</span>
      <div className="h-40 w-1.5 rounded-full bg-bark/15 overflow-hidden flex flex-col-reverse">
        <div className="w-full bg-sage rounded-full transition-[height] duration-150" style={{ height: `${pct}%` }} />
      </div>
      <span className="text-xs font-semibold text-sage">{pct}%</span>
    </div>
  )
}
```

Note: this uses `useFrame` so it must render inside the Canvas tree. Since it also renders DOM, place it inside the existing `Scroll html` in `ContentOverlay` — but `useFrame` requires being in the Canvas. Resolution: render `AltitudeGauge` as a sibling inside `<ScrollControls>` in `JourneyCanvas` (NOT inside `Scroll html`), and have it portal its fixed-position div to `document.body`. Simpler: split into a tiny `useFrame` reader that writes to a ref/state and a portaled DOM node. **Implement it by rendering `<AltitudeGauge />` inside `<ScrollControls>` in `JourneyCanvas` and wrapping the returned JSX in `createPortal(..., document.body)`** (import `createPortal` from `react-dom`).

- [ ] **Step 2: Wrap in portal.** Update the component to `return createPortal(<div ...>...</div>, document.body)` guarded by a mounted check (avoid SSR `document` access — component is already client-only inside the `ssr:false` canvas, so `document` is safe, but guard with `typeof document !== 'undefined'`).

- [ ] **Step 3: Mount** `<AltitudeGauge />` in `JourneyCanvas.tsx` inside `<ScrollControls>`.

- [ ] **Step 4: Build + lint** → PASS.
- [ ] **Step 5: Manual** — a slim vertical gauge on the right shows ascent % and current biome, filling as you climb; hidden on mobile widths; decorative (aria-hidden).
- [ ] **Step 6: Checkpoint.**

---

## Task 20: Panel entrance animation on snap

**Files:**
- Create: `src/components/ui/RevealPanel.tsx`
- Modify: each section to wrap its panel (Hero/About/Experience/Projects/Contact) OR add a shared in-view wrapper.

**Interfaces:**
- Produces: `RevealPanel` — a Framer Motion wrapper that fades/scales its children in when scrolled into view (re-triggers on re-entry, respects reduced-motion).

- [ ] **Step 1: Create `src/components/ui/RevealPanel.tsx`**:

```tsx
'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export default function RevealPanel({ children, className }: { children: ReactNode; className?: string }) {
  const reducedMotion = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, scale: 0.97, y: 24 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ amount: 0.5 }}
      transition={{ duration: reducedMotion ? 0 : 0.5, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
```

`viewport` without `once: true` re-fires each time the panel re-enters (on snap). `amount: 0.5` triggers when centered.

- [ ] **Step 2: Wrap panels.** In each of Hero/About/Experience/Projects/Contact, wrap the panel `<div className="... rounded-3xl bg-parchment/85 ...">` with `<RevealPanel>`. To avoid double-motion conflicts, keep it lightweight: only Projects/Contact/About/Experience/Hero panel wrappers get `RevealPanel`; inner element-level `whileInView` stays. If nesting causes jank, move the `bg-parchment` classes onto `RevealPanel` via its `className` prop and drop the inner wrapper div.

- [ ] **Step 3: Build + lint** → PASS.
- [ ] **Step 4: Manual** — snapping to a section fades/scales the panel in; scrolling away and back re-triggers it; reduced-motion shows panels statically.
- [ ] **Step 5: Checkpoint.**

---

## Task 21: Clickable points of interest

**Files:**
- Create: `src/components/journey/PointsOfInterest.tsx`
- Modify: `src/components/journey/JourneyCanvas.tsx`

**Interfaces:**
- Consumes: `pathX`, `terrainHeight`, `Z_BOTTOM`, `Z_TOP`, `SCROLL_PAGES` from `journey.ts`; `scrollBridge` from `@/lib/scrollBridge`.

- [ ] **Step 1: Create `src/components/journey/PointsOfInterest.tsx`** — a few trail-sign meshes placed along the path that scroll the overlay to a section on click:

```tsx
'use client'

import { useState } from 'react'
import * as THREE from 'three'
import { ThreeEvent } from '@react-three/fiber'
import { pathX, terrainHeight, Z_TOP, Z_BOTTOM, SCROLL_PAGES } from '@/lib/journey'
import { scrollBridge } from '@/lib/scrollBridge'

const SIGNS = [
  { page: 1, offset: 0.22 }, // About
  { page: 2, offset: 0.45 }, // Experience
  { page: 3, offset: 0.68 }, // Projects
]

function Sign({ page, offset }: { page: number; offset: number }) {
  const [hover, setHover] = useState(false)
  const z = THREE.MathUtils.lerp(Z_BOTTOM, Z_TOP, offset / 0.85)
  const x = pathX(z) + 9
  const y = terrainHeight(x, z)

  const go = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    const el = scrollBridge.el
    if (el) el.scrollTo({ top: page * el.clientHeight, behavior: 'smooth' })
  }

  return (
    <group
      position={[x, y, z]}
      onClick={go}
      onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { setHover(false); document.body.style.cursor = '' }}
      scale={hover ? 1.12 : 1}
    >
      <mesh position={[0, 1.4, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 3, 6]} />
        <meshStandardMaterial color="#8a7a63" />
      </mesh>
      <mesh position={[0, 2.6, 0]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[1.6, 0.5, 0.08]} />
        <meshStandardMaterial color={hover ? '#6b8a52' : '#566f42'} flatShading />
      </mesh>
    </group>
  )
}

export default function PointsOfInterest() {
  void SCROLL_PAGES
  return (
    <group>
      {SIGNS.map((s) => (
        <Sign key={s.page} page={s.page} offset={s.offset} />
      ))}
    </group>
  )
}
```

- [ ] **Step 2: Mount** `<PointsOfInterest />` in `JourneyCanvas.tsx` inside `<ScrollControls>`.

- [ ] **Step 3: Build + lint** → PASS.
- [ ] **Step 4: Manual** — trail signs stand beside the path; hovering shows a pointer + scale + color change; clicking scrolls to the matching section. Keyboard nav via Header still works (no regression).
- [ ] **Step 5: Checkpoint.**

---

## Task 22: Curated GLB models (best-effort)

**Files:**
- Create (if assets sourced): `public/models/*.glb`, `public/models/CREDITS.md`
- Modify: `Vegetation.tsx` / `Wildlife.tsx` to load GLB via drei `useGLTF`

**Interfaces:**
- Consumes: CC0 low-poly GLB assets. **Gate: only proceed if clean CC0 assets are obtained and licenses recorded.**

- [ ] **Step 1: Source CC0 assets.** Attempt to obtain low-poly CC0 GLB for pine tree, shrub/frailejón, and a bird from a permissive source (e.g. Poly Pizza / Quaternius). If network/asset access is unavailable or license can't be verified CC0, **STOP this task**, leave procedural meshes (already improved in Task 18), and record in the backlog that GLB remains open. Do NOT ship unlicensed assets.

- [ ] **Step 2 (only if assets obtained): Optimize** each GLB with `npx @gltf-transform/cli optimize in.glb out.glb` and place under `public/models/`.

- [ ] **Step 3 (only if assets obtained): Write `public/models/CREDITS.md`** listing each asset, author, source URL, and CC0 license.

- [ ] **Step 4 (only if assets obtained): Load via `useGLTF`** in `Vegetation`/`Wildlife`, replacing the procedural geometry for those instances; use `<Preload>`/`useGLTF.preload`. Keep instancing.

- [ ] **Step 5: Build + lint** → PASS.
- [ ] **Step 6: Manual** — GLB models render in place of procedural ones (or, if skipped, confirm procedural still looks good and note the skip).
- [ ] **Step 7: Checkpoint** — note in the summary whether GLB landed or was deferred.

---

# PHASE 5 — Cleanup / robustness / a11y

## Task 23: Lockfile, dead code, footer decision

**Files:**
- Delete: `package-lock.json`, `src/components/ui/AnimatedSection.tsx`
- Modify: `docs/journey-backlog.md` (footer note)

- [ ] **Step 1: Confirm `AnimatedSection` is unused.** Run: `grep -rn "AnimatedSection" src`
  Expected: only its own definition. If any import exists, do NOT delete — resolve the import first.

- [ ] **Step 2: Delete dead file.** Run: `rm src/components/ui/AnimatedSection.tsx`

- [ ] **Step 3: Lockfile.** Run: `rm package-lock.json` (keep `pnpm-lock.yaml`). Then verify a clean resolve: `pnpm install`.

- [ ] **Step 4: Footer decision.** Confirm `Footer` isn't referenced in the journey path. Run: `grep -rn "Footer" src` — if only its definition + an unused import, remove the dead import. Document the choice (footer omitted from the 3D journey) in `docs/journey-backlog.md`.

- [ ] **Step 5: Build + lint** → PASS.
- [ ] **Step 6: Checkpoint.**

---

## Task 24: Verification pass (SEO / focus / reduced-motion / mobile / disposal)

**Files:** none (verification + small fixes only).

- [ ] **Step 1: SEO indexability.** Run `pnpm build && pnpm start`, then `curl -s localhost:3000 | grep -o "Full Stack Developer"` — overlay text must appear in the served HTML (the `Scroll html` content is real DOM). If empty, note it; the canvas is `ssr:false` but the overlay hydrates client-side — confirm metadata (`layout.tsx`) is intact regardless.

- [ ] **Step 2: Keyboard focus.** With the app running, Tab through Header nav; confirm links focus visibly and activating them scrolls (via `scrollBridge`). Confirm no focus is trapped in the canvas.

- [ ] **Step 3: Reduced-motion.** Toggle OS/devtools `prefers-reduced-motion: reduce`: snap disabled, camera snaps (no lerp/parallax), flag/water/condor static, panels static.

- [ ] **Step 4: WebGL-off fallback.** Force `useWebGLSupport` false (temporarily) → `WebGLFallback` renders all sections with cream palette; revert.

- [ ] **Step 5: Mobile / perf.** Devtools device emulation + CPU throttle: confirm `PerformanceMonitor` `onDecline` degrades (snow 200, postprocessing off) and the layout is usable. Gauge hidden on mobile.

- [ ] **Step 6: Resource disposal.** Spot-check: toggling canvas↔fallback doesn't leak (r3f disposes on unmount by default; confirm no manual global geometries persist). Note findings.

- [ ] **Step 7: Fix any issues found** inline (small scope only). Build + lint → PASS.
- [ ] **Step 8: Checkpoint.**

---

## Task 25: Update backlog + IMPROVEMENTS docs

**Files:**
- Modify: `docs/journey-backlog.md`, `IMPROVEMENTS.md`

- [ ] **Step 1: Tick completed backlog items** in `docs/journey-backlog.md` (sky, flag, condor, variety, snap, parallax, altitude indicator, panel entrance, contrast, water, distant range, POIs, lockfile, AnimatedSection, footer, verification items). Leave GLB (Task 22) checked only if it actually landed; otherwise note it remains open with reasoning.

- [ ] **Step 2: Update `IMPROVEMENTS.md`** — mark "TypeScript interfaces" and "metrics/depth in Experience" done; note "more projects" is a deliberate keep-one decision; leave blog/testimonials/dark-toggle deferred.

- [ ] **Step 3: Checkpoint** — final summary of everything shipped vs deferred.

---

## Self-review notes

- **Spec coverage:** WS1→T1; WS2→T2,T3,T5,T6,T7,T8; WS3→T4; WS4(exp/contact)→T5,T7; WS5(snap)→T9,T10; WS6(finale)→T11,T12; WS7 (7a→T14, 7b→T15, 7c→T13, 7d→T19, 7e→T20, 7f→T18, 7g→T16, 7h→T17, 7i→T22, 7j→T21); WS8→T23,T24,T25. All spec sections mapped.
- **Reduced-motion** threaded through T10,T12,T13,T14,T16,T18,T20,T24.
- **No auto-commits** — every task ends in a Checkpoint per the global git constraint.
