# DevSpace 3D Professional Portfolio - Design Plan

## Core Concept
**"Depth Through Code"** - A developer portfolio that feels like stepping into a 3D terminal/workspace. Glassmorphism layers, subtle parallax, and purposeful motion create depth without gimmicks. The 3D effect serves the content: code blocks float, cards have physical thickness, the hero feels like a workspace you could reach into.

---

## Color System (6 tokens)

| Token | Hex | Role |
|-------|-----|------|
| `void` | `#080C14` | Deep background - near-black with blue undertone |
| `void-elevated` | `#0E1522` | Card surfaces, one step up |
| `glass` | `rgba(22, 33, 52, 0.72)` | Glassmorphism base |
| `glass-border` | `rgba(100, 120, 160, 0.18)` | Subtle glass edges |
| `electric-cyan` | `#00D4FF` | Primary accent - "code execution" color |
| `electric-cyan-dim` | `rgba(0, 212, 255, 0.15)` | Glows, focus rings |
| `muted-cyan` | `#6BA3BF` | Secondary text, inactive states |
| `text-primary` | `#E8F0F8` | Main headings |
| `text-secondary` | `#94A3B8` | Body copy |
| `warning-amber` | `#FBBF24` | Toast warnings |
| `success-green` | `#34D399` | Toast success |

**No warm cream, no terracotta, no acid green on black.** This palette reads "senior engineer's IDE at 2am" - deliberate, technical, trustworthy.

---

## Typography

**Primary: `JetBrains Mono`** (variable weight 400-700)
- Code-first identity. Monospace for everything - headings, body, UI. No mixing families.
- Weights: 400 (body), 500 (emphasis), 600 (subheads), 700 (hero)
- Letter-spacing: -0.02em on display sizes, 0 on body

**Display treatment:** Large mono headlines with `electric-cyan` gradient text on key words only (not single-word highlighting - full phrases: "I build", "interactive systems")

---

## Layout Concept

```
┌─────────────────────────────────────────────────────────────┐
│  NAV: Logo • [Links] • ThemeBtn • ☰ (mobile)               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  HERO (100vh min)                                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  [floating code blocks orbit slowly]                │   │
│  │                                                     │   │
│  │  "I build interactive systems"                      │   │
│  │  "that feel alive"                                  │   │
│  │                                                     │   │
│  │  [Typewriter: "Frontend Engineer • Creative Coder  │   │
│  │   • Problem Solver • Open Source Contributor"]      │   │
│  │                                                     │   │
│  │  [CTA: View Work]  [Secondary: GitHub]             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  ABOUT - Glass card with depth                              │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │  Stat Counter   │  │  Bio Text       │                  │
│  │  (animated)     │  │  + Skill Bars   │                  │
│  └─────────────────┘  └─────────────────┘                  │
├─────────────────────────────────────────────────────────────┤
│  PROJECTS - Isotope-style filter                            │
│  [All] [React] [Three.js] [CSS/Animation] [Node]           │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                        │
│  │ 3D   │ │ 3D   │ │ 3D   │ │ 3D   │  ← Cards with         │
│  │ card │ │ card │ │ card │ │ card │     physical thickness │
│  └──────┘ └──────┘ └──────┘ └──────┘                        │
├─────────────────────────────────────────────────────────────┤
│  FAQ - Accordion (smooth height animation)                  │
├─────────────────────────────────────────────────────────────┤
│  CONTACT - Form with char counter + toast on submit         │
├─────────────────────────────────────────────────────────────┤
│  FOOTER - Minimal, back-to-top button appears on scroll     │
└─────────────────────────────────────────────────────────────┘
```

**Alignment:** Left-aligned content max-width 1100px, centered container. Hero text centered. Cards in CSS Grid.

---

## 3D / Depth System

1. **Layer 0 (void):** Page background - subtle animated grid pattern
2. **Layer 1 (void-elevated):** Section backgrounds
3. **Layer 2 (glass):** Cards, modals, nav backdrop
4. **Layer 3 (electric-cyan glow):** Interactive elements on hover/focus

**Transform language:**
- Cards: `transform: translateZ(20px) rotateX(-2deg)` on hover
- Hero code blocks: `translateZ(-100px to 100px)` slow orbit
- Buttons: `translateY(-2px) translateZ(8px)` on hover
- No `perspective` on body - only on specific 3D containers

---

## Motion Principles

| Motion | Duration | Easing | Trigger |
|--------|----------|--------|---------|
| Hero orbit | 20s | linear | Auto (reduced-motion: paused) |
| Typewriter | 80ms/char | steps(1) | Auto |
| Counter | 1.2s | cubic-bezier(0.16, 1, 0.3, 1) | IntersectionObserver |
| Skill bars | 1s | cubic-bezier(0.16, 1, 0.3, 1) | IntersectionObserver |
| Card hover | 200ms | cubic-bezier(0.16, 1, 0.3, 1) | Hover/focus |
| Accordion | 300ms | cubic-bezier(0.16, 1, 0.3, 1) | Click |
| Toast slide | 300ms | cubic-bezier(0.16, 1, 0.3, 1) | Show/hide |
| Scroll reveal | 600ms | cubic-bezier(0.16, 1, 0.3, 1) | IntersectionObserver |
| Back-to-top | 500ms | cubic-bezier(0.16, 1, 0.3, 1) | Click |

**One orchestrated moment:** Hero load sequence (orbit starts → typewriter begins → CTA fades in). Everything else responds to user.

**Reduced motion:** All auto-animations pause, transitions become instant, orbit stops.

---

## Features Implementation Plan

| # | Feature | Location | Key Technical |
|---|---------|----------|---------------|
| 1 | Hamburger menu | Nav | CSS-only toggle + aria-expanded |
| 2 | Back-to-top | Fixed bottom-right | IntersectionObserver on hero |
| 3 | Toast system | Global | Queue array, auto-dismiss 4s |
| 4 | Typewriter | Hero subtitle | requestAnimationFrame, reduced-motion respect |
| 5 | Project filter | Projects | CSS Grid + data-category + JS filter |
| 6 | Skill bars | About | CSS custom property animation |
| 7 | FAQ accordion | FAQ | `<details>` + custom animation |
| 8 | Animated counters | About stats | IntersectionObserver + requestAnimationFrame |
| 9 | Char counter | Contact form | input event, updates live |
| 10 | Scroll reveal | All sections | IntersectionObserver + CSS animation |

---

## Accessibility Baseline

- Semantic HTML5 (`<nav>`, `<main>`, `<section>`, `<article>`, `<details>`)
- Focus-visible rings: `electric-cyan` 3px offset
- ARIA labels on icon-only buttons
- `prefers-reduced-motion` respected globally
- Color contrast: all text ≥ 4.5:1 on glass backgrounds
- Keyboard navigable: tab order logical, escape closes modals/toasts

---

## What Makes This Distinctive

1. **Monospace everywhere** - commits to the developer identity, no "heading font vs body font"
2. **Physical card thickness** - 3D transform on hover feels like picking up a circuit board
3. **Orbiting code blocks** - the hero shows, doesn't tell: actual code fragments floating
4. **Electric cyan as "execution"** - the accent means "this runs", not "click me"
5. **Glassmorphism with purpose** - layers represent z-index in a terminal, not decoration
6. **No gradients as decoration** - only on text gradient for "I build interactive systems"

---

## Review Against Generic Defaults

| Default | This Design |
|---------|-------------|
| Warm cream + terracotta | Void + electric cyan |
| SaaS card kit (identical rounded cards) | 3D cards with physical thickness, orbit on hover |
| ALL-CAPS eyebrow labels | None - mono headlines speak for themselves |
| Gradient washes | Only on hero headline text |
| Fade-up on every section | Single hero sequence, rest on interaction |
| Generic "View Project" buttons | "View Source" / "Live Demo" - specific actions |
| Tinted near-black (#0B0B0B) | `#080C14` - blue undertone, not neutral |

---

## Build Order

1. **HTML structure** - semantic, all sections, all feature containers
2. **CSS tokens + base** - colors, typography, grid, glass system
3. **3D system** - perspective containers, card transforms, hero orbit
4. **Features 1-3** - Nav, back-to-top, toasts (infrastructure)
5. **Features 4-6** - Hero typewriter, project filter, skill bars
6. **Features 7-10** - FAQ, counters, char counter, scroll reveal
5. **Polish** - reduced motion, focus states, mobile refinement