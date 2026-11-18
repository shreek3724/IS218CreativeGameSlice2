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
