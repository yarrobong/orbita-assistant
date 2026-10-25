# ORBITA Assistant Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver the P0 ORBITA Assistant MVP as an accessible, tested, offline-capable static PWA that can be published on GitHub Pages.

**Architecture:** React/Vite/strict TypeScript shell with hash navigation and custom responsive CSS. Pure TypeScript flow state and guard logic is separated from source-grounded content and UI. Local state is device-only; no server or buyer record is introduced.

**Tech Stack:** React, TypeScript, Vite, Vitest, React Testing Library, Playwright, axe-core, vite-plugin-pwa, ESLint.

**Spec:** `/Users/Yaroslav/Downloads/TZ_ORBITA_Assistant_v1.md`; design: `docs/superpowers/specs/2026-10-26-orbita-assistant-design.md`.

## Global Constraints

- No server, Avito integration, automatic sending, buyer records, analytics, external fonts, or secrets.
- `base`, manifest, service worker, and scope must work under `/orbita-assistant/`.
- Stock and all order/fulfillment statuses require explicit manual confirmation.
- Pickup confirmation requires the specific product and slot plus handover availability and permission to share contact; editing product/date/time clears confirmation.
- Review copy is unavailable before verified receipt/handover, when an issue is open, or after request was marked sent.
- Only a successful clipboard write may show “Скопировано”; retain a selectable edit surface after clipboard failure.
- Do not ship names, phone numbers, exact address, private messages, buyer data, or unverified commercial claims as unconditional facts.
- Common answer path: 2–3 actions from home; touch targets at least 44×44 CSS px; no horizontal scroll at 320 px.
- Keep P1 work out until P0 acceptance checks pass.

## Review Focus

- An edited product/slot may leave a stale stock or pickup confirmation — test state invalidation on every relevant field change.
- A pickup or review template may become visible through library/search despite a locked flow — test availability guards at both domain and UI selection boundaries.
- Source workbook rows may carry outdated prices, warranty, compatibility, timing or identifying pickup details — test source content normalization/redaction and require visible manual checks.
- Clipboard may reject without user gesture or permission — test that the UI does not report success and keeps text selectable.
- Project-base or service-worker scope may escape the GitHub Pages prefix — test built asset references, manifest scope and browser opening under `/<repo>/`.

---

### Task 1: Foundation and CI

**Stage:** A

**Files:** `package.json`, lockfile, `index.html`, `vite.config.ts`, `tsconfig*.json`, `eslint.config.js`, `.gitignore`, `.github/workflows/ci.yml`, `src/main.tsx`, `src/app/App.tsx`, `src/styles/*`, `README.md`.

**Interfaces:** Foundation exports `App` and a CSS token sheet; Vite's build output is `dist/` and uses base `/orbita-assistant/`.

- [x] Create strict React/Vite project and minimum dependencies; pin package manager lockfile.
- [x] Add lint, typecheck, test, build and e2e scripts with deterministic CI job ordering.
- [x] Add responsive semantic app shell, error boundary and hash location helper.
- [x] Add first foundation check: production assets resolve with `/orbita-assistant/` and no external font/tracker URLs.
- [x] Run `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`.
- [x] Commit as `feat: add ORBITA app foundation`.

### Task 2: Source content and guarded flow engine

**Stage:** B

**Files:** `src/domain/types.ts`, `src/domain/flow.ts`, `src/domain/templates.ts`, `src/domain/render-template.ts`, `src/data/templates.ts`, `src/data/flows.ts`, `src/lib/search.ts`, `src/lib/validate-import.ts`, `src/domain/*.test.ts`, `src/lib/*.test.ts`, `scripts/audit-public-data.mjs`.

**Interfaces:** `canUseTemplate(template, state): GuardResult`; `transition(state, event): FlowState`; `renderTemplate(template, fields): RenderResult`; `searchTemplates(templates, query, category): Template[]`; `validateImport(input): ImportResult`.

- [x] Write failing unit tests for graph reachability/terminals, pickup guards and invalidation, delivery and review guards, product reset, required placeholders, search phrases, and import rejection cases.
- [x] Confirm those tests fail for missing implementation.
- [x] Normalize and vet the workbook's 52 base answers, 22 safe replies and 29 deal steps, keeping usage/check notes; strip exact address and personal contact. Report catalog count and any deduplication.
- [x] Implement pure flow transitions, audience boundary, gates, interpolation and search; import validation rejects malformed JSON, wrong types, oversize content, duplicate ids and forbidden key patterns atomically.
- [x] Run focused tests, full `npm run test`, lint and typecheck; run public-data audit against source/catalog and `dist`.
- [x] Commit as `feat: add guarded sales flows and content library`.

### Task 3: P0 user screens

**Stage:** C

**Files:** `src/app/*`, `src/features/home/*`, `src/features/flows/*`, `src/features/templates/*`, `src/features/settings/*`, `src/components/*`, `src/styles/*`, `tests/e2e/core-flows.spec.ts`, `tests/e2e/mobile.spec.ts`.

**Interfaces:** Screens consume typed catalog and domain methods; `CopyComposer` takes template, initial fields and `onCopied`/`onFailure` callbacks. Handover copy has an explicit internal audience heading and styling.

- [x] Write failing component/e2e checks for new buyer neutral status, 2–3 tap common path, delivery and pickup flows, handover audience warning, unavailable pickup confirmation, issue/review state, editable copy and clipboard rejection.
- [x] Implement home, delivery, pickup and after-purchase flows; branch navigation and back preserve only still-valid fields.
- [x] Implement searchable/filterable library of source-grounded answers, instant preview/editing, favorites and copy feedback.
- [x] Implement device-only storage notice, clear-local-data action, keyboard/screen-reader support and responsive nav.
- [x] Run unit/component tests (34 passed), Playwright E2E (7 passed, including 320–1440 widths), lint, typecheck and production build.
- [ ] Commit as `feat: build responsive sales assistant screens`.

### Task 4: PWA/offline, update behavior and performance gates

**Stage:** D

**Files:** `vite.config.ts`, `public/manifest.webmanifest`, `public/icons/*`, `src/lib/pwa.ts`, `src/features/settings/*`, `tests/e2e/offline.spec.ts`, `.github/workflows/deploy.yml`, `.github/workflows/ci.yml`, `scripts/check-bundle.mjs`, `docs/performance.md`.

**Interfaces:** PWA assets share one `/orbita-assistant/` base; the app observes update-ready state and only activates a waiting worker after user confirmation.

- [ ] Write failing browser tests for installability metadata, app shell and search after cache/offline, waiting-update preservation, and project-subpath navigation.
- [ ] Configure service worker with versioned local static assets and scoped navigation fallback; never cache external/Avito data, and never call immediate `skipWaiting` on the active app.
- [ ] Add install guidance for iPhone/macOS/Windows, manual update UI, bundle-budget checker (initial gzip JS <=180 KB; critical gzip <=300 KB), and fixed-profile Lighthouse configuration or reproducible script.
- [ ] Add Pages workflow that runs CI then publishes `dist/` from `main`; do not push the built output to a branch.
- [ ] Run unit/e2e/offline checks, lint, typecheck, build, bundle gate, axe, and fixed-profile Lighthouse; document measured performance and test environment.
- [ ] Commit as `feat: add offline PWA and Pages deployment`.

### Task 5: Acceptance and publication

**Stage:** D acceptance (P0 closeout)

**Files:** `README.md`, `docs/acceptance.md`, all relevant domain/e2e tests.

- [ ] Run all 12 P0 regression scenarios in the source specification, including invalid import and update preservation.
- [ ] Review production output for private contact/address, names, buyer content, tokens, external network resources, and unsafe unconditional claims; fix and rerun audit on every change.
- [ ] Run production build locally and verify Pages prefix and hash deep links with a local static server.
- [ ] Check GitHub repository availability/permissions; publish only to the specified repository if available and configure GitHub Pages Actions. Verify the completed deployment URL by loading it and exercising the app shell.
- [ ] Record unmet platform tests (physical iPhone, macOS and Windows) honestly if no devices are available; provide browser test evidence and a reproducible manual checklist.
- [ ] Commit as `docs: record ORBITA P0 acceptance` after checks; ensure clean working tree.

## Completion Contract

All P0 acceptance items from section 13 of the source spec are checked with recorded evidence. Do not claim production publication until GitHub deployment completes and the actual URL is verified. If repository creation, permissions, or physical-device access block a criterion, report the exact unresolved item and evidence without presenting the project as complete.
