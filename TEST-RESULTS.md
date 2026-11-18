# Test results

Times are Eastern.

## Phase 1 — November 17, 2026

- 9:44 p.m. — npm registry access failed in the network sandbox. The first
  network-enabled install failed during Vitest 4 dependency resolution.
- 9:46 p.m. — `npm run format:check`, `npm run lint`, `npm run check`,
  `npm run test:unit` (1 test), and `npm run build` passed. Confirmed that
  the build contains HTML indexes for all three public routes and a
  `.nojekyll` marker.
- 9:47 p.m. — Playwright's preview server could not bind to loopback inside
  the sandbox. The browser tests did not run in that attempt.
- 9:48 p.m. — `npm run test:e2e` (4 tests) and `npm run test:a11y`
  (3 tests) passed under the repository base path with loopback access.
  The initial dependency install reported npm audit advisories, so the
  toolchain was reviewed before the final run.
- 9:50–9:52 p.m. — Upgraded to SvelteKit 3, Vite 8, Vitest 4, TypeScript 6,
  and ESLint 10. `npm ci --offline --no-audit` installed the resulting
  lockfile with npm 10. Initial type checks failed during the SvelteKit 3
  config migration. After updating the Vite config, route links, and
  TypeScript config, formatting, lint, type checks (0 errors and 0 warnings),
  unit tests (1), and the static build passed.
- 9:52–9:53 p.m. — The final project-path build contained all three HTML
  indexes and `.nojekyll`. Playwright passed 4 tests and axe passed 3
  scans. The `PAGES_BASE=/` build and its 4 Playwright tests also passed.
  Rebuilt with the default project path for local preview.
- The upgraded dependency audit still reported 15 findings traced to
  `picomatch` in development tooling. The installed version, 4.0.7, was
  the latest available in the registry metadata checked.
- Unrun — GitHub Actions, live GitHub Pages deployment, and direct-load and
  refresh checks on the live Pages URL.

## Owner review — November 17, 2026

- The owner opened the local preview in Chrome, navigated to Game and then
  Results, and confirmed that refreshing Results reopened the same view.

## GitHub Pages verification — November 17, 2026

- 10:05 p.m. — The [Pages workflow](https://github.com/shreek3724/IS218CreativeGameSlice2/actions/runs/44227689406)
  passed the check and deploy jobs for commit `fd71b8b`. GitHub ran the
  actions declaring Node 20 on Node 24 and reported a deprecation warning.
- 10:06 p.m. — Live Chromium verification passed. The sign-in, game, and
  results URLs each returned HTTP 200 on direct load and refresh.

## Phase 2 — November 17, 2026

- 10:12 p.m. — ESLint, strict TypeScript and Svelte checks, Vitest (8 tests
  including the Phase 1 baseline), and the production build passed. The
  Phase 2 tests cover Golden Valley's 36 treatments, ordered layers, rejected
  moves, scoring at positive and zero integrity, restart, the internal
  four-layer fixture, and simulated sign-out.
- The solvent total, range, and whole-number rules are covered by unit tests.
  Slider and typed-field synchronization and the playable browser journey
  await the Phase 3 interface.

- 10:14 p.m. — The [Phase 2 GitHub Actions run](https://github.com/shreek3724/IS218CreativeGameSlice2/actions/runs/44228880094) passed all checks and deployed the static site for commit `746bb60`. Browser and accessibility checks exercised the existing placeholder views.
- 10:16 p.m. — Reran `npm run test:unit` during the Phase 2 spec review.
  All 8 tests passed.

## Phase 3 — November 17, 2026

- 10:22–10:23 p.m. — Initial lint and type checks caught missing TypeScript
  handling in Svelte linting, unresolved imports, and a rune naming conflict.
  After fixes, formatting, lint, type checks, all 8 unit tests, and the
  static production build passed.
- 10:24–10:25 p.m. — The three functional Playwright tests passed. Axe found
  a mismatch between visible grid button labels and their accessible names.
  Updated the grid so the visible and accessible labels match, then rebuilt.
- 10:26–10:27 p.m. — `npm run format:check`, `npm run lint`,
  `npm run check`, `npm run test:unit` (8 passed), and
  `npx playwright test` (4 passed) passed on the updated build. The browser
  checks cover direct routes and refresh, a perfect 36-treatment restoration,
  replay, sign-out, slider and field synchronization, keyboard selection,
  invalid-move recovery, restart, and axe scans of all three playable views.
- Phase 4 checks for Canvas artwork and PNG export are pending.
