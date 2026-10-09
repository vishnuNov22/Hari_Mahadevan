# Hari Mahadevan — Portfolio (Next.js)

Editorial, multi-venture portfolio for Hari Mahadevan, built from the *Advanced Next.js Portfolio Master Specification*.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 · custom WebGL/GLSL · Lucide · Zod · next/font (Bricolage Grotesque + Inter Tight) · next/image

**Palette — "Terracotta & Ice"** (from the supplied reference render): brick backdrop `#872e32` → `#5c1a20`, floor `#9f473d`, oxblood ink `#1c0a0c` for deep sections, ice aqua `#a9d6df` signature light, magenta-mauve rim `#e0457b`/`#87517c`, warm blush porcelain `#fbf5f2` for reading sections, deep crimson `#8a1f2e` for accents on light. Venture accents: ice, rose, sand, seafoam.

## Run it

```bash
npm install
cp .env.example .env.local   # then edit values
npm run dev                  # http://localhost:3000
```

Checks before deploying:

```bash
npm run lint
npm run typecheck
npm run build && npm start
# or all three: npm run check
```

Requires Node 18.18+ (Node 20 LTS or newer recommended).

## Routes

| Route | Purpose |
|---|---|
| `/` | Hero, founder statement, venture index, capabilities, vision/mission, work preview, principles, closing CTA |
| `/about` | Biography, portrait, vision & mission, approach, principles |
| `/ventures` | Four-vertical overview with anchors |
| `/ventures/digital` | ADS Digitals & Advertisements (split composition) |
| `/ventures/events` | ADS Events (cinematic dark composition) |
| `/ventures/real-estate` | ADS Real Estate (panorama + categories, no fabricated listings) |
| `/ventures/financial-solutions` | Financial information with disclosure shown before services |
| `/work` | Showcase framework — renders real projects from `src/content/work.ts` when added |
| `/contact` | Enquiry form (+ `?topic=` preselect), email, phone |
| `/privacy` | Privacy notice for enquiry data |
| `/sitemap.xml`, `/robots.txt` | Generated |
| `/api/enquiry` | Validated POST endpoint for the form |

## Scroll-driven 3D scrollytelling (the opening)

`components/home/HeroStory.tsx` pins the first scene for ~3.4 viewports and scrubs ONE timeline from scroll — the same model as GSAP ScrollTrigger with `pin` + `scrub` (progress eases toward the scroll position, like `scrub: 1`):

| Progress | Camera (Catmull-Rom spline) | Object | HTML beat |
|---|---|---|---|
| 0 → 0.2 | establishing shot, lattice right of the name | dense lattice | Name, portrait, CTAs, ventures |
| 0.27 → 0.56 | rises and holds right | lattice opens, rotates | "Four worlds." (parallax from left) |
| 0.64 → 0.9 | swings round, holds left | keeps opening | "One entrepreneurial mindset." (from right) |
| 0.9 → 1 | flies into the hollow centre | shell expands around the camera | cross-fade to the next section |

Camera keys live in `experience/heroEngine.ts` (`CAM_POS`, `CAM_TGT`); beat windows in `HeroStory.tsx`. Below 1024px or with reduced motion the scene is not pinned (first beat only, centred orbit framing).

GSAP note: GSAP/ScrollTrigger could not be installed or tested in the environment this was built in, so the timeline is implemented with a small scroll → rAF → uniform pipeline. If you prefer GSAP, the swap is local: create a ScrollTrigger on `#hero` (`pin: ".story-stage", scrub: 1`) and call `engine.setProgress(self.progress)` + the same `--b1/--b2/--b3/--out` variables in `onUpdate`.

## 3D animated videos

`public/media/{digital,events,property,financial}.{webm,mp4}` (+ `-poster.jpg`): 5-second seamless 3D loops of the lattice, each with its own tint and openness, rendered offline from the site's own shader (camera orbit = perfect loop) and encoded H.264 + VP9 (~0.65 MB each). Used in the "Motion studies" reel and as the floating lens in the four-chapter sequence. `LoopVideo` plays them only on screen and never autoplays for reduced-motion visitors.

## Cinematic motion & 3D — what is implemented

| Effect | Where | How |
|---|---|---|
| Kinetic split-text, char-by-char, perspective entrance | Hero name | `components/motion/SplitText.tsx` + `styles/motion.css` (`kt-3d`) — CSS only, real text stays in the DOM |
| Variable-font animation, animated letter-spacing | "Hari" weight 150→620; small caps labels | `kt-weight`, `kt-track` |
| Typography parallax / layered depth | Hero name lines, portrait, 3D form | `ScrollVars` writes `--sy/--sp/--vp`; CSS transforms |
| Clip-path reveal | Hero portrait, venture panels | `ClipReveal`, `.ch-panel` |
| Magnetic buttons | Hero CTAs (desktop, fine pointer only) | `Magnetic` |
| Pinned scrollytelling, scroll scrubbing, progress rail | "Four worlds" chapters | `home/FourChapters.tsx` (desktop + motion allowed; stacked list otherwise) |
| Horizontal scroll section with depth | "How I work" | `home/MethodRail.tsx` |
| Scroll-velocity effect | Capabilities marquee skews/accelerates with scroll speed | `motion/VelocityMarquee.tsx` |
| Progressive (circular SVG-style) mask reveal + liquid displacement | Founder section | CSS `clip-path: circle()` driven by `--vp`; `LiquidImage` (feTurbulence + feDisplacementMap on hover) |
| Real-time 3D: gyroid-lattice sphere, wrap/subsurface-style lighting, soft shadows, ambient occlusion, Fresnel reflections, magenta rim, contact shadow | Pinned hero story | `experience/heroShader.ts` (documented GLSL) + `heroEngine.ts` |
| Bloom lift, ACES + split-tone grade, film grain | Same shader | `heroShader.ts` |
| Filmic photo grade | Venture photos | `VentureVisual` — desaturate/contrast, venture-colour soft-light wash, vignette, grain |

Performance & fallbacks: the WebGL bundle is code-split (`next/dynamic`, `ssr:false`) and never blocks the headline/CTAs; renders below native resolution with a DPR cap; pauses off-screen and in hidden tabs; one still frame under reduced motion; a static CSS orb shows if WebGL is missing, fails to compile or the context is lost. Pinned/horizontal sequences become plain stacked sections on narrow screens and with reduced motion.

Intentionally omitted (would add cost without improving the story): fluid simulation, route/shared-element transitions (not stable in the App Router), 3D text extrusion, image sequences.

**Note on the brief's library choice:** the brief suggests React Three Fiber/Drei and Motion. This build uses a dependency-free WebGL renderer and CSS/IntersectionObserver motion instead, so every effect could be rendered and checked here; it also keeps the JS bundle small. R3F can be swapped in later behind the same `HeroScene` interface if needed.

## Photography

- `public/images/hari-portrait-studio.jpg` — Hari's studio photo; **the sweater colour was retouched from olive to navy** to match the palette (face, skin and hair untouched). Replace with an original if preferred.
- `public/images/hari-portrait-full.jpg` — supplied event photo (About + Founder section).
- Venture photography is from Unsplash (free under the Unsplash License), loaded from `images.unsplash.com` and credited in the footer as illustrative. Sources are listed per venture in `src/content/ventures.ts` (`photo.credit`). Replace with Hari's real work when available — and ideally download them into `/public` so the site doesn't depend on a third-party CDN.

## Where to edit content

All copy lives in typed files under `src/content/`:

- `site.ts` — name, contact, nav, social links (empty until verified), WhatsApp (null until confirmed)
- `about.ts` — approved bio, vision, mission, principles
- `ventures.ts` — venture copy, services, process, financial disclaimer
- `work.ts` — **approved projects only**; the Work page and home preview switch automatically when you add entries

## Environment variables

| Name | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes, in production | Canonical URLs, sitemap, Open Graph. e.g. `https://yourdomain.com` |
| `RESEND_API_KEY` | Optional | Enables real email delivery of enquiries |
| `ENQUIRY_FROM_EMAIL` | With Resend | A verified sender on your Resend domain |
| `ENQUIRY_TO_EMAIL` | With Resend | Inbox that receives enquiries |

**Contact form behaviour:** without the Resend variables the form never claims success. It tells the visitor their message has *not* been sent and offers a pre-filled email to `harimahadevan2002@gmail.com`. With them, it sends via Resend's HTTP API (`src/lib/enquiry-delivery.ts` — swap that adapter to use another provider). Server-side Zod validation and a honeypot field are included. For high traffic, add rate limiting at the host (e.g. Vercel firewall).

## Decisions taken from the spec (please confirm)

- **"Mahadev Creator"** is not shown publicly (`site.showAltContactLabel = false`).
- **Financial label:** the site shows "Financial Solutions". The supplied label "SBI Life Insurance & Financial Solutions" is stored in `ventures.ts` with `approvedForDisplay: false` until Hari confirms the exact relationship and wording. No returns, approvals or official affiliation are claimed.
- **WhatsApp** and **social links** are not rendered until confirmed.
- No testimonials, client logos, counts, ratings or fabricated projects/listings appear anywhere. Structured data covers only Person, WebSite and breadcrumbs.

## Assets still needed

- Higher-resolution portrait(s) — the current one is 854×1280 from the supplied photo (cropped versions in `public/images/`)
- Venture logos / brand colours, if they exist
- Hari's own photography per venture to replace the Unsplash images
- Approved projects, galleries and property listings
- Domain and hosting target; Resend (or other) credentials

## Accessibility & motion

Skip link, semantic landmarks, one `h1` per page, visible focus styles, labelled form fields with linked errors, focus moves to the first invalid field and to the result panel, mobile menu with focus trap, Escape to close and focus restore. `prefers-reduced-motion` turns off movement (CSS + `MotionConfig reducedMotion="user"`); content is visible without JavaScript.

## Deploying (Vercel)

Import the repo, set `NEXT_PUBLIC_SITE_URL` (and Resend vars if used), deploy. Any Node host that runs `next start` also works.
