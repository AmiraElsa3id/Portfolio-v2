# Plan: Add 7 Route Projects to the Portfolio

Status: **Implemented**
Owner: **Amera**
Created: 2026-10-06
Implemented: 2026-10-06

## 1. Goal

Add seven new deployed projects to the Projects section:

| # | Project (proposed display name) | Live demo | Framework |
| - | ------------------------------- | --------- | --------- |
| 1 | The UX Review — Brutalist Blog | https://the-ux-review-blog.vercel.app/ | React |
| 2 | Mudabbir — Personal Finance Dashboard | https://mudabbir.vercel.app/ | React |
| 3 | Arabic Developer Portfolio | https://portfolio-route.vercel.app/ | React |
| 4 | Cosmos — Space Dashboard | https://cosmos-space-dashboard-route.vercel.app/ | React |
| 5 | QuizMaster — Quiz Game | https://quiz-master-route.vercel.app/ | React |
| 6 | Wanderlust — Travel Planner | https://city-specs-route.vercel.app/ | React |
| 7 | FreshCart — Next.js E-Commerce | https://freshcart-route.vercel.app/ | **Next.js** |

Between them they demonstrate REST/API integration, charts, dashboards, an RTL
Arabic UI, a configurable quiz engine, and a Next.js App Router storefront —
good coverage of the stack already listed in `portfolio.json`.

## 2. How the Projects section works today

- Data lives in `src/data/portfolio.json` → `projects[]`. Each item:
  ```json
  { "name": "...", "tech": "A, B, C", "description": "...",
    "links": { "code": "...", "demo": "..." }, "image": "/assets/images/x.png" }
  ```
- `src/components/Projects.jsx` paginates at `PER_PAGE = 6`. Current 11 projects
  → 2 pages. Adding 7 → **18 projects → 3 pages** (no code change needed).
- Cards show the first 3 techs; `+N` for the rest. Tech names are split on
  `", "` and icons resolved by `getSkillIcon()` in `src/data/skillIcons.js`.
  Missing icons degrade gracefully (`{Icon && ...}`), but we should add them.
- Images: `ProjectImage` derives `.webp` by stripping the extension, with the
  `.png` as fallback. Both files must exist under `public/assets/images/`.
  If `image` is absent, a "Preview" placeholder is shown.

## 3. Proposed project entries (draft metadata)

Descriptions are trimmed to fit the card's `line-clamp-2` while staying useful
in the modal. **Tech lists are best-effort and must be confirmed** (see §8).

```jsonc
[
  {
    "name": "The UX Review — Brutalist Blog",
    "tech": "React, Vite, Tailwind CSS",
    "description": "Editorial blog with a bold brutalist identity — hero, trending and latest articles, author profiles, and a community/newsletter section. Built with a sharp, high-contrast visual system and reusable content components.",
    "links": { "code": null, "demo": "https://the-ux-review-blog.vercel.app/" },
    "image": "/assets/images/ux-review.png"
  },
  {
    "name": "Mudabbir — Personal Finance Dashboard",
    "tech": "React, Tailwind CSS, Chart.js",
    "description": "Arabic RTL personal-finance dashboard covering balances, income vs. expenses, recent transactions, budgets, monthly bills, savings, payment methods, and income/expense charts across weeks.",
    "links": { "code": null, "demo": "https://mudabbir.vercel.app/" },
    "image": "/assets/images/mudabbir.png"
  },
  {
    "name": "Arabic Developer Portfolio",
    "tech": "React, Tailwind CSS",
    "description": "RTL Arabic single-page portfolio with hero, about, skills, a filterable project gallery, experience timeline, testimonials, and a contact form — plus live theme and font customisation.",
    "links": { "code": null, "demo": "https://portfolio-route.vercel.app/" },
    "image": "/assets/images/portfolio-route.png"
  },
  {
    "name": "Cosmos — Space Dashboard",
    "tech": "React, Tailwind CSS, REST API",
    "description": "Space data dashboard consuming the NASA APOD and SpaceDevs APIs — astronomy picture of the day, upcoming launches, a planet explorer with orbital stats, and a planet comparison table.",
    "links": { "code": null, "demo": "https://cosmos-space-dashboard-route.vercel.app/" },
    "image": "/assets/images/cosmos-space.png"
  },
  {
    "name": "QuizMaster — Quiz Game",
    "tech": "React, Tailwind CSS, REST API",
    "description": "Configurable quiz game — player name, category, difficulty and round count — with XP-based scoring and a modern arena selection UI. Questions are fetched dynamically from a trivia API.",
    "links": { "code": null, "demo": "https://quiz-master-route.vercel.app/" },
    "image": "/assets/images/quiz-master.png"
  },
  {
    "name": "Wanderlust — Travel Planner",
    "tech": "React, Tailwind CSS, REST API",
    "description": "Travel-planning dashboard for 90+ countries: public holidays, city events, 7-day weather, a long-weekend finder, live currency conversion, sunrise/sunset times, and saved trip plans.",
    "links": { "code": null, "demo": "https://city-specs-route.vercel.app/" },
    "image": "/assets/images/city-specs.png"
  },
  {
    "name": "FreshCart — Next.js E-Commerce",
    "tech": "Next.js, TypeScript, Tailwind CSS, REST API, Stripe",
    "description": "Full e-commerce storefront built with the Next.js App Router — category and brand browsing, a large product catalogue, cart and wishlist, authentication, and a responsive checkout flow.",
    "links": { "code": null, "demo": "https://freshcart-route.vercel.app/" },
    "image": "/assets/images/freshcart-next.png"
  }
]
```

Image filenames are chosen to avoid collisions with existing assets — note the
existing `fresh-cart.png` (the older React SPA) vs. the new
`freshcart-next.png`.

## 4. Image pipeline (performance-critical)

All thumbnails must go through the existing optimiser so the card stays light.

1. Add the seven URLs to `scripts/take-screenshots.mjs`, but capture a
   **1280×800 viewport** shot (`fullPage: false`) for dashboards — full-page
   captures of these apps are very tall and get awkwardly cropped by the card's
   `h-44 object-cover`. Add a per-entry flag so existing entries keep
   `fullPage: true` and new ones use the viewport.
2. Save each as `<slug>.png` into `public/assets/images/`.
3. Run `npm run optimize-images` — it resizes to fit 1280×800, compresses the
   PNG, and emits the `.webp` sibling the component expects.

Target budget: **≤ ~150 KB WebP per thumbnail**. Also consider a deliberate
top-of-page hero shot per app (not the footer) so the first impression reads
well in the modal.

## 5. Icons (`src/data/skillIcons.js`)

Add missing keys so new techs render icons:

| Tech string | Suggested icon |
| ----------- | -------------- |
| `React Router` | `SiReactrouter` (`react-icons/si`) |
| `React Query` / `TanStack Query` | `SiReactquery` |
| `Axios` | `SiAxios` |
| `Chart.js` | `SiChartdotjs` |
| `Vite` | `SiVite` |
| `Framer Motion` | `SiFramer` (optional) |
| `Stripe` | `SiStripe` (add plain `'stripe'` key) |
| `REST API` / `Trivia API` / `NASA API` | `TbApi` |

While in this file, fix the two pre-existing lint problems: the duplicate
`django` key (line ~55) and the unused imports `SiSass`, `FaNodeJs`, `FaAws`,
`FaDocker`, `FaSass`. Keep `django → SiDjango` as the single source.

## 6. Performance considerations

- **Pagination already protects us.** Only 6 cards render per page, and card
  images use `loading="lazy" decoding="async"`. 18 projects does not mean 18
  images on first paint.
- **Keep thumbnails small** (WebP ~75 quality, resized) — this is the single
  biggest lever. The section is a grid of images; unoptimised PNGs would
  dominate the page weight.
- **JSON growth is negligible.** Seven text entries add a few KB to the bundled
  `portfolio.json`; far below the JS budget already in place (78 KB gzip).
- **Fixed card media height (`h-44`)** means the new images introduce no layout
  shift; the modal uses `object-contain`, so tall dashboard shots are fine.
- **No component changes** are required — the existing grid, modal, pagination,
  and icon fallbacks handle the new data. This keeps the change surface purely
  content + assets.
- Optional (defer): add explicit `width`/`height` on the `<img>` elements to
  fully eliminate CLS, and/or virtualise the grid if the list grows well past
  ~30 projects. Not needed at 18.

## 7. Implementation steps

1. Fix `skillIcons.js` lint issues and add the new icon keys (§5).
2. Extend `scripts/take-screenshots.mjs` with the seven URLs and the
   viewport/full-page flag.
3. Run `npm run screenshots`, then `npm run optimize-images`; verify each slug
   has both `.png` and `.webp` and is within the size budget.
4. Append the seven entries to `projects` in `src/data/portfolio.json`,
   ordering newest/most impressive first (suggest putting the Next.js
   FreshCart and the API-driven dashboards near the top).
5. `npm run build`; smoke-test `npm run preview` — check all 3 pages, each card
   opens its modal, images load as WebP, and external demo links open correctly.
6. Commit.

## 8. Decisions needed before/at implementation

Resolved at implementation:
1. **`code` links** — none supplied, so all seven use `code: null`; cards show
   only the "Demo →" link.
2. **Tech per project** — set from the live UIs (see §3); refresh if repos say
   otherwise.
3. **Duplicate FreshCart** — kept **both**. The older React SPA remains
   (`Fresh Cart — E-Commerce SPA`) and the new Next.js build is named
   `FreshCart — Next.js E-Commerce`, with a distinct `freshcart-next` image.
4. **Attribution / weekly sessions** — recorded via a new optional
   `context` field on each project:
   *"Built live in front of students during Route Academy's weekly mentoring
   sessions."* It renders as a "Taught live" badge on the card and a note in
   the modal. `Projects.jsx` handles it optionally, so other projects are
   unaffected.
5. **RTL thumbnails** — captured at a 1280×800 viewport; spot-check Mudabbir and
   the Arabic portfolio to confirm the direction reads correctly.

> Note: `context` is additive/optional. If the wording should differ per
> project, edit the strings in `portfolio.json` — no code change needed.

## 9. Acceptance criteria

- [ ] All seven projects appear in Projects; pagination shows 3 pages with 6 per
      page.
- [ ] Each card opens a modal with correct name, tech tags (with icons), and
      description.
- [ ] Each project's **Live Demo** link opens the correct Vercel URL in a new
      tab; no broken/`null`-rendered links.
- [ ] Every project has an optimized `.png` **and** `.webp`; cards load the WebP.
- [ ] No new console errors; `npm run build` succeeds.
- [ ] Page weight/Lighthouse for the Projects section does not regress vs. the
      current baseline.
- [ ] Pre-existing icon-map lint errors fixed (no new lint errors introduced).

## 10. Risks & rollback

- **Low risk** — content and assets only, plus additive icon-map keys.
- Main risk is oversized unoptimised images; mitigated by §4. Rollback is
  reverting `portfolio.json`, the new image files, and the optional icon/script
  additions.

## 11. Affected files

| File | Change |
| ---- | ------ |
| `src/data/portfolio.json` | Add 7 project entries |
| `public/assets/images/*` | 7 thumbnails × (PNG + WebP) |
| `scripts/take-screenshots.mjs` | Add URLs + viewport/full-page flag |
| `src/data/skillIcons.js` | Add new tech icons; fix existing lint errors |

No changes expected in `src/components/Projects.jsx`.
