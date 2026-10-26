# ORBITA Assistant 1.3 Workspace UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign ORBITA Assistant 1.2 into a responsive, Workspace-inspired tool where a user selects an answer and copies it with minimal navigation.

**Architecture:** Keep the static React/TypeScript/Vite app, domain logic, template catalog, local storage and hash routes. Build one adaptive master-detail shell that can render a quick-answer, library or scenario selection alongside its existing composer on desktop, while the same selection remains sequential on mobile. Express the visual system through CSS tokens and semantic list/composer components without adding runtime dependencies.

**Tech Stack:** React, TypeScript, Vite, CSS, Vitest, Testing Library, Playwright, axe-core and existing static build/service-worker scripts.

**Spec:** `docs/design-system-1.3.md`; user brief in `/Users/Yaroslav/.codex/attachments/95c00c05-b433-430e-8404-ee123cce4926/Вставленный текст.txt`; preserved business rules in `docs/acceptance-1.2.md`.

## Global Constraints

- Preserve the three navigation destinations, the 118-template catalog, search, favorites, recent answers, edit behavior, direct hash routes and browser Back/Forward.
- Preserve ORBITA 1.2 safety logic: independent stages, safe alternatives, private contact permission, internal audience boundaries and rejection of unresolved `{{...}}` placeholders.
- Keep the application static and deployable to GitHub Pages; retain PWA/offline cache and manual service-worker updates.
- Do not add MUI, another heavy UI library, external fonts, server, database, auth, trackers or third-party services.
- Use the ORBITA palette with primary `#A3472B`; do not use Google branding or Google Blue as the application accent.
- Avoid gradient, glass, glow, 3D, fake metrics, hero banners, nested decorative cards, broad pill lists, repetitive labels and motion for decoration.
- Verify widths 320, 390, 768, 1280 and 1728 CSS px, plus a short viewport and an open mobile keyboard.
- Keep accessible keyboard focus, touch targets around 44 × 44 CSS px, safe areas and no horizontal scrolling.
- Save Playwright before/after screenshots for home, answers, delivery and pickup; keep production changes inside the feature branch until CI-backed publication.

## Review Focus

- A direct `#/template/<id>` URL must still open the exact template and survive reload/back even if desktop selection becomes an inline detail panel — Task 3 and Task 4.
- Switching list selection or query must not copy stale text or lose the catalog's favorite/recent state — Task 3 and Task 4.
- Internal pickup messages must remain clearly internal while buyer messages retain neutral fallback and private-contact protection — Task 4.
- Short mobile heights, browser keyboard and safe-area insets must not cover the copy action or create horizontal overflow — Task 5.
- Missing/empty catalog results and offline state must remain understandable and actionable — Task 2 and Task 3.

## File Map

- `src/styles/app.css`: design tokens, workspace shell, list/detail layouts, responsive breakpoints and state styling.
- `src/app/App.tsx`: persistent shell, navigation/search placement, route-synchronized selection state and composition of responsive feature views.
- `src/app/routes.ts` and route tests: preserve canonical stable hashes while inline desktop selection changes.
- `src/features/HomeScreen.tsx`: compact action list, actual recent/favorite content and non-banner continuation.
- `src/features/QuickAnswers.tsx`: selectable compact list and selected answer preview/detail.
- `src/features/TemplateLibrary.tsx`: 118-item compact list, filters, selection, preview and existing quick-copy rules.
- `src/components/CopyComposer.tsx`: normal text preview, explicit editor, primary copy action and existing safety controls/details.
- `src/features/FlowScreen.tsx`: selectable situation list and direct matching composer without changing flow-domain rules.
- `src/features/*.test.tsx`, `src/app/routes.test.ts`, `e2e/orbita.spec.ts`, `e2e/platform.spec.ts`: regression contracts for view and routing.
- `docs/screenshots/1.3-before/`, `docs/screenshots/1.3-after/`: paired visual evidence at requested viewport widths.
- `docs/ux-audit-1.3.md`, `docs/design-system-1.3.md`: research/audit and accepted visual contract.

## Task 1: Establish responsive visual tokens and workspace shell

**Files:**
- Modify: `src/styles/app.css`
- Modify: `src/app/App.tsx`
- Test: `e2e/orbita.spec.ts`
- Test: `e2e/platform.spec.ts`

**Interfaces:**
- Consumes: current `AppRoute`, three `navItems`, existing `searchTemplates` and mobile-search overlay behavior.
- Produces: `.app-frame`, `.sidebar`, `.workspace`, `.topbar`, `.main-content`, `.primary-nav` responsive layout classes; sidebar 216 px at >=1024 px, topbar 60 px, mobile three-item bottom navigation below 760 px.

- [ ] **Step 1: Write failing layout tests** asserting sidebar width 216 ± 4 px at 1280 px, topbar height 56–64 px, three mobile nav items at 390 px, and no horizontal overflow at 320/390/768/1280/1728 px.
- [ ] **Step 2: Run the focused Playwright tests** with `npx playwright test e2e/orbita.spec.ts --project=chromium --grep "primary navigation|responsive"`; expected: new layout assertions fail against 232 px sidebar and current content sizing.
- [ ] **Step 3: Implement the shell and tokens** in `src/styles/app.css` and `src/app/App.tsx`, retaining the global search shortcut and three destinations.
- [ ] **Step 4: Run focused Playwright tests**; expected: all layout assertions pass and existing mobile search/navigation remains functional.
- [ ] **Step 5: Run `npm run typecheck && npm run lint`**; expected: exit 0.
- [ ] **Step 6: Commit** as `feat: establish ORBITA 1.3 workspace shell`.

## Task 2: Replace the home dashboard with a working home surface

**Files:**
- Modify: `src/features/HomeScreen.tsx`
- Modify: `src/styles/app.css`
- Test: `src/features/HomeScreen.test.tsx` (create if absent)
- Test: `e2e/orbita.spec.ts`

**Interfaces:**
- Consumes: `onOpen`, `onUseTemplate`, `favorites`, `recentIds`, `lastScenario`, and existing `templateCatalog`.
- Produces: compact primary actions, recent/favorite answers only when present, and a normal “Продолжить” row when a saved scenario exists.

- [ ] **Step 1: Write failing render tests** for four compact actions, removed repeated eyebrow/hero treatment, recent answer selection, empty-state omission, and a non-banner continuation row.
- [ ] **Step 2: Run `npm test -- src/features/HomeScreen.test.tsx`**; expected: tests fail because the current 2×2 card home still renders its repeated brand eyebrow and lacks tested content layout.
- [ ] **Step 3: Implement the compact workspace home** using real catalog content and existing handlers; omit empty sections rather than rendering placeholders.
- [ ] **Step 4: Run `npm test -- src/features/HomeScreen.test.tsx`**; expected: all new home behavior tests pass.
- [ ] **Step 5: Run the focused home Playwright test and axe check**; expected: visible actions work and no WCAG A/AA violations.
- [ ] **Step 6: Commit** as `feat: simplify ORBITA home workspace`.

## Task 3: Implement master-detail for quick answers and the template library

**Files:**
- Modify: `src/app/App.tsx`
- Modify: `src/app/routes.ts`
- Modify: `src/features/QuickAnswers.tsx`
- Modify: `src/features/TemplateLibrary.tsx`
- Modify: `src/styles/app.css`
- Test: `src/app/routes.test.ts`
- Test: `src/features/QuickAnswers.test.tsx` (create if absent)
- Test: `src/features/TemplateLibrary.test.tsx`
- Test: `e2e/orbita.spec.ts`

**Interfaces:**
- Consumes: current `AppRoute`, stable template IDs, `searchTemplates`, favorite/recent handlers and `CopyComposer` props.
- Produces: selected item state synchronized with `#/quick`, `#/answers`, and `#/template/<id>`; desktop list-detail selection without full-page navigation; sequential mobile detail with return-to-list behavior.

- [ ] **Step 1: Write failing tests** for selecting quick answer updates detail, selecting a library row reveals preview beside list at desktop widths, mobile detail provides a back action, all 118 templates remain present, and direct template hashes survive reload/Back.
- [ ] **Step 2: Run `npm test -- src/app/routes.test.ts src/features/QuickAnswers.test.tsx src/features/TemplateLibrary.test.tsx`**; expected: new desktop-selection/mobile-return assertions fail because each current selection is a full route change.
- [ ] **Step 3: Implement route-synchronized selection** while retaining canonical template routes and browser history; keep filters and query state when returning to the list.
- [ ] **Step 4: Run focused unit tests**; expected: selection, filter, favorites, recent, direct-link and browser-history contracts pass.
- [ ] **Step 5: Run focused Playwright tests at 390 and 1280 px**; expected: desktop shows list/detail together; mobile shows a sequential flow and no horizontal overflow.
- [ ] **Step 6: Commit** as `feat: add answer master detail views`.

## Task 4: Simplify composer and scenario navigation without changing domain safety

**Files:**
- Modify: `src/components/CopyComposer.tsx`
- Modify: `src/features/FlowScreen.tsx`
- Modify: `src/styles/app.css`
- Test: `src/components/CopyComposer.test.tsx`
- Test: `src/features/FlowScreen.test.tsx`
- Test: `e2e/orbita.spec.ts`

**Interfaces:**
- Consumes: `canUseTemplate`, `renderTemplate`, existing neutral alternatives, flow stage data, direct stage selection and confirmation callbacks.
- Produces: read-only message preview by default with explicit edit action; immediately visible copy action; desktop scenario master-detail and mobile sequential stage/composer; existing private/internal copy protections.

- [ ] **Step 1: Write failing component tests** for preview-first rendering, edit-on-request, primary copy visibility, neutral alternative copyability, unresolved placeholder rejection, missing pickup data neutral fallback, contact excluded without explicit consent, and internal audience label.
- [ ] **Step 2: Run `npm test -- src/components/CopyComposer.test.tsx src/features/FlowScreen.test.tsx`**; expected: preview/edit behavior assertions fail against default textarea and repeated badges/disclaimers.
- [ ] **Step 3: Implement the compact composer and scenario list**; preserve all stage labels, stage independence, internal-message separation and optional detail fields.
- [ ] **Step 4: Run component tests and existing flow unit tests**; expected: all business-safety and rendering contracts pass.
- [ ] **Step 5: Run the focused flow Playwright tests**; expected: all ten delivery and nine pickup stages remain available, selection immediately updates copyable text, and private contact remains opt-in.
- [ ] **Step 6: Commit** as `feat: streamline scenario composer and stage selection`.

## Task 5: Finish adaptive layouts and verify keyboard, touch and visual states

**Files:**
- Modify: `src/styles/app.css`
- Modify: affected screen/component files based on screenshot findings
- Modify: `e2e/orbita.spec.ts`
- Modify: `e2e/platform.spec.ts`
- Create: `docs/screenshots/1.3-after/`

**Interfaces:**
- Consumes: shell, home, master-detail and composer layouts from Tasks 1–4.
- Produces: complete empty/offline/error/focus/hover/active/disabled styling and verified breakpoints at 320, 390, 768, 1280 and 1728 px; keyboard-open mobile viewport coverage.

- [ ] **Step 1: Add failing interaction checks** for 320 px no-overflow, 320 × 360 short screen copy visibility, 390 px bottom safe-area content, keyboard-open editor layout, focus-visible styling, and empty search results.
- [ ] **Step 2: Run the targeted Playwright tests**; expected: any remaining overlap, hidden action, focus or empty-state defect fails with a specific assertion.
- [ ] **Step 3: Correct the smallest affected layout/component rules** without adding a UI library or decorative motion.
- [ ] **Step 4: Run the 5-width Playwright matrix and axe checks**; expected: no horizontal scroll, all primary actions reachable, and no A/AA violations in home, answers, scenarios and composer.
- [ ] **Step 5: Save after screenshots** for home, answers, delivery and pickup at all five widths; expected: files pair with `docs/screenshots/1.3-before/` and show equivalent states.
- [ ] **Step 6: Commit** as `fix: polish ORBITA responsive workspace layouts`.

## Task 6: Full regression, bundle/data audits and CI publication

**Files:**
- Modify only defects found by verification.
- Create/update: `docs/performance-1.3.md` with before/after asset budget and comparable Lighthouse results, if existing audit outputs support a reliable comparison.

**Interfaces:**
- Consumes: completed UI and regression suites.
- Produces: buildable static app, passing unit/E2E/PWA/privacy/budget checks, comparable Lighthouse evidence and CI-deployed Pages update from this feature branch.

- [ ] **Step 1: Run `npm test`, `npm run typecheck`, `npm run lint`**; expected: exit 0 with all unit tests passing.
- [ ] **Step 2: Run `npm run test:e2e`**; expected: Chromium plus configured CI browser/device coverage verifies routes, PWA offline, search, copying, private contact, 118 templates and responsive layouts.
- [ ] **Step 3: Run `npm run audit:public && npm run audit:budget`**; expected: no private-data leakage and no bundle/CSS budget regression beyond the documented existing threshold.
- [ ] **Step 4: Run `npm run audit:lighthouse` and compare repeatable runs to 1.2 baseline**; expected: Accessibility >=95 and no systematic Performance regression under comparable conditions; report environment and variance.
- [ ] **Step 5: Review screenshots and `git diff --check`**; expected: accepted design hierarchy, all requested viewports covered, no malformed whitespace.
- [ ] **Step 6: Commit any fixes** with the finding they address; rerun the affected test and full suite.
- [ ] **Step 7: Push feature branch and open/update the repository's CI path**; expected: existing GitHub Actions workflow passes and deploys the feature release to GitHub Pages. Confirm the published artifact contains no personal or buyer data.

## Completion Checklist

- [ ] Home is a compact workspace, not a landing/dashboard.
- [ ] Answers, library and scenarios use desktop master-detail and sequential mobile selection.
- [ ] User can read then copy in one screen with no unnecessary modal or checklist.
- [ ] Stable hashes, Back/Forward, favorites, recents, search, all 118 templates and settings work.
- [ ] All 1.2 privacy, audience, neutral-fallback and placeholder controls pass.
- [ ] PWA, offline use, service-worker updates and GitHub Pages remain functional.
- [ ] Visual snapshots exist before/after at 320, 390, 768, 1280 and 1728 px.
- [ ] Accessibility is at least 95; performance does not regress systematically in comparable measurements.
- [ ] Public-data and budget audits pass; existing CI publishes successfully.
