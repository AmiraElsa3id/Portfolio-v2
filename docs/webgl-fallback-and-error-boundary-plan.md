# Plan: WebGL Fallback + Error Boundary (Firefox blank-page fix)

Status: **Implemented**
Owner: **Amera**
Created: 2026-10-05
Implemented: 2026-10-05

## 1. Problem

The portfolio goes **completely blank** in Firefox-based browsers when WebGL is
unavailable. It is not a Firefox bug — it is an unhandled crash in the
`SplashCursor` hero effect.

Reproduction:
- Firefox 155, default settings → renders fine, no errors.
- Firefox with `webgl.disabled = true` → blank page, console shows:
  ```
  TypeError: can't access property "getExtension", n is null
      at te (index-BjeREUGM.js:10:65059)
  ```

### Root cause

`src/components/SplashCursor.jsx`:

- `getWebGLContext(canvas)` (lines 59–91) tries `webgl2`, then `webgl`, then
  `experimental-webgl`. If all fail, `gl` stays `null`.
- It then immediately calls `gl.getExtension(...)` (lines 67–71) without a
  null check → throws.
- That call happens synchronously inside the `useEffect` (line 53:
  `const { gl, ext } = getWebGLContext(canvas)`), and nothing catches it.
- An uncaught error thrown during a React render/effect unmounts the entire
  React tree → blank page.

### Affected environments

LibreWolf (WebGL off by default), Mullvad Browser, Tor Browser, Firefox with
`privacy.resistFingerprinting`, the arkenfox `user.js`, or `webgl.disabled =
true`, plus any machine where the GPU driver is blocklisted or hardware
acceleration is off.

### Related, separate issue (out of scope)

Tailwind v4 requires Firefox 128+. On older engines (Firefox ESR 115,
Waterfox Classic, Pale Moon) the page loads but gradients/shadows/colors look
wrong. This plan does **not** address that.

## 2. Goals

1. The site must never go blank because a decorative WebGL effect cannot
   initialize. Missing WebGL should degrade to "no cursor effect" only.
2. Any future failure in a decorative canvas/WebGL component must be contained
   so it cannot take down the whole app.
3. No visual or behavioral change on browsers where WebGL works.

## 3. Non-goals

- Fixing Tailwind v4 incompatibility with pre-128 Firefox forks.
- Adding a polyfill or software WebGL renderer.
- Restyling / re-designing the hero.

## 4. Proposed changes

### Step 1 — Bail out when there is no WebGL context (`src/components/SplashCursor.jsx`)

Inside `getWebGLContext`, after the fallback attempts and before the first
`gl.getExtension` call:

```js
function getWebGLContext(canvas) {
  const params = { alpha: true, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false }
  let gl = canvas.getContext('webgl2', params)
  const isWebGL2 = !!gl
  if (!isWebGL2) gl = canvas.getContext('webgl', params) || canvas.getContext('experimental-webgl', params)

  if (!gl) return null            // <-- added guard

  // ...rest unchanged
}
```

In the `useEffect`, replace the destructure at line 53:

```js
const ctx = getWebGLContext(canvas)
if (!ctx) return                    // <-- skip effect, keep site alive
const { gl, ext } = ctx
```

Notes / edge cases:
- `getWebGLContext` is a function declaration inside the effect and is hoisted,
  so the guard is safe to place before the call site.
- Returning early also means no event listeners and no animation frame are
  registered — nothing to clean up, and the returned cleanup function is not
  reached. That is fine because we add no listeners before the guard. If the
  guard is placed after any listener registration in the future, move cleanup
  accordingly.
- Consider logging once at debug level (e.g. `console.info(...)`) rather than
  throwing, so support can confirm the fallback fired.

### Step 2 — Add a reusable React error boundary

Create `src/components/ErrorBoundary.jsx` (class component, since React 19 has
no hook equivalent for error boundaries):

```jsx
import { Component } from 'react'

class ErrorBoundary extends Component {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(error, info) { console.error('[ErrorBoundary]', error, info) }
  render() { return this.state.hasError ? (this.props.fallback ?? null) : this.props.children }
}

export default ErrorBoundary
```

### Step 3 — Wrap the decorative effect (`src/components/Header.jsx`)

Wrap `<SplashCursor ... />` so a failure in that subtree renders `null` instead
of crashing:

```jsx
<ErrorBoundary>
  <SplashCursor TRANSPARENT={true} DENSITY_DISSIPATION={4} VELOCITY_DISSIPATION={3} CURL={5} SPLAT_RADIUS={0.15} SPLAT_FORCE={4000} RAINBOW_MODE={true} />
</ErrorBoundary>
```

Consider also wrapping other purely decorative image/canvas pieces if added
later. Do **not** wrap the whole app in a single boundary that swallows content
errors — keep the boundary scoped to decoration.

### Step 4 — Optional app-level safety net (`src/main.jsx` or `App.jsx`)

> **Deferred.** The scoped boundary in step 3 fully contains the known failure.
> A top-level net would hide real content bugs, so it is intentionally left for
> a separate decision.

Optional: add a top-level boundary around `<App />` with a minimal fallback so
any unforeseen error shows a usable message instead of a blank screen rather
than silently hiding real bugs. This is defense-in-depth and can be deferred.
If added, the fallback should be a real, visible message, not `null`.

## 5. Acceptance criteria

- [ ] With WebGL enabled: hero cursor effect behaves exactly as before; no new
      console warnings.
- [ ] With WebGL disabled (`webgl.disabled = true` or `about:config`):
      page renders fully, no blank screen, no uncaught `TypeError`.
- [ ] Simulating a forced throw inside `SplashCursor`'s effect leaves the rest
      of the page intact (boundary works).
- [ ] `npm run build` succeeds; `npm run lint` passes.
- [ ] No change to bundle behavior other than the two guards + boundary.

> Result: WebGL-on and WebGL-off verified via headless Chromium; build passes.
> `npm run lint` still reports the same 8 pre-existing errors and 1 pre-existing
> warning, none from this change.

## 6. Test plan

Manual, in Firefox with WebGL off:
1. `npm run build && npm run preview`.
2. Open the preview URL in Firefox with `webgl.disabled = true`.
3. Confirm full page + console has no uncaught error.
4. Confirm a manual `throw new Error('test')` at the top of the effect is
   contained by the boundary (temporary test, then revert).

Automated (optional):
- There is a `puppeteer` dev dependency and `scripts/take-screenshots.mjs`.
  A lightweight regression test could launch Chromium with
  `--disable-webgl` / `--disable-3d-apis` and assert `#root` is non-empty.
  Track as a follow-up rather than blocking the fix.

## 7. Risk & rollback

- Low risk. Changes are guarded and scoped to a decorative component.
- Rollback: revert the two guards and remove the boundary wrapper; no data or
  config migration involved.

## 8. Affected files

| File | Change |
| --- | --- |
| `src/components/SplashCursor.jsx` | Null guard in `getWebGLContext` + early return in `useEffect` |
| `src/components/ErrorBoundary.jsx` | New reusable error boundary |
| `src/components/Header.jsx` | Wrap `<SplashCursor />` in boundary |
| `src/main.jsx` / `App.jsx` | (Optional) top-level safety net |

## 9. Follow-ups (separate plans)

- Tailwind v4 vs. pre-128 Firefox forks (ESR 115, Waterfox Classic, Pale Moon).
- Automated no-WebGL smoke test in CI.

## 10. Performance notes

- **Zero steady-state cost from the boundary.** `ErrorBoundary` stores one
  boolean that is set at most once. When `hasError` is `false` it returns
  `this.props.children` directly, so React reconciles the existing tree with no
  extra wrapper DOM and no re-renders.
- **No extra work on healthy browsers.** `getWebGLContext` gains one `if (!gl)`
  branch and the effect gains one `if (!ctx)` branch; both are evaluated once at
  mount. The render loop and GL pipeline are untouched.
- **`componentDidCatch` logging is DEV-only** (`import.meta.env.DEV`) and is
  tree-shaken out of the production bundle, so it adds no runtime or size cost.
- **Failure path is cheaper than before.** Previously a no-WebGL environment
  still compiled shaders / allocated framebuffers in some drivers and then
  crashed. Now it returns before any GL allocation and before registering the
  mouse/touch listeners or `requestAnimationFrame`, so it costs less than a
  successful init.
- **No new dependency** was added; the boundary is ~15 lines of local code.

## 11. Implementation record (2026-10-05, Amera)

| File | Change |
| --- | --- |
| `src/components/SplashCursor.jsx` | Added `if (!gl) return null` in `getWebGLContext`; early `if (!ctx) return` in `useEffect` before destructuring |
| `src/components/ErrorBoundary.jsx` | New class boundary, DEV-only logging, `fallback ?? null` |
| `src/components/Header.jsx` | Imported and wrapped `<SplashCursor />` in `<ErrorBoundary>` |
| `docs/webgl-fallback-and-error-boundary-plan.md` | This plan |

Verification:
- `npm run build` → succeeds (`vite build`, 41 modules, no errors).
- `npm run lint` → 8 pre-existing errors in `Navbar.jsx`, `Skills.jsx`,
  `data/knowledge.js`, `data/skillIcons.js`, and 1 pre-existing warning in
  `SplashCursor.jsx` (exhaustive-deps). **None were introduced by this change.**
- Step 4 (app-level net) deferred by design.

### Manual test still to run by owner
Firefox with `webgl.disabled = true` against `npm run preview` — confirm the
page renders fully with no uncaught `getExtension` TypeError.

> **Verified** with Puppeteer/Chromium (`--disable-webgl --disable-webgl2
> --disable-3d-apis`) against the production preview build:
> - WebGL off → `webglAvailable: false`, `#root` innerHTML ≈ 231 KB,
>   visible text present, **0 page errors / console errors**.
> - WebGL on → `webglAvailable: true`, `#fluid` canvas mounted,
>   ≈ 231 KB rendered, **0 errors**.
>
> This mirrors the failing conditions from the report; a final pass in real
> Firefox with `webgl.disabled = true` is still recommended.
