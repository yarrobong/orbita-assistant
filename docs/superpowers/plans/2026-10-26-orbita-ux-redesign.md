# ORBITA Assistant UX Redesign 1.1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the existing ORBITA app a fast, responsive, safe message assistant with three clear sections, quick answers, guided flows, and reliable offline support.

**Architecture:** Keep React, TypeScript, Vite, the local 118-template catalog, and the guarded flow domain. Make the hash route the source of truth for navigation and direct template links; keep private in-progress deal data in memory, and persist only non-personal preferences/recent template IDs. Split pickup readiness, buyer-message preparation, and buyer notification into independent states.

**Tech Stack:** Existing React + TypeScript + Vite, Vitest, Testing Library, Playwright, axe, GitHub Actions Pages workflow.

**Spec:** `/Users/Yaroslav/.codex/attachments/e4e8da28-da6e-4f51-8da6-4332490d96ef/Вставленный текст.txt`

## Global Constraints

- Preserve all 118 source templates and their IDs; do not invent product facts, handover terms, or shipping dates.
- Keep all application content local; add no server, external fonts, trackers, or heavy UI dependencies.
- Never persist buyer contact/address data or full draft text; clear confirmations on reload and when relevant facts change.
- Do not copy a pickup confirmation before stock, point handover, slot, address, and contact-permission checks pass.
- Keep PWA offline behavior and manual service-worker update activation.
- Run focused tests after each task, then full lint, typecheck, unit/e2e, build, public-data and bundle audits, Lighthouse, and inspect required viewport screenshots before publishing.

## Review Focus

- Changing a pickup slot or product after handover approval must invalidate all dependent pickup checks and prevent stale confirmation copying.
- Direct/reloaded template routes must preserve active navigation, while unknown template IDs must fall back safely.
- A fresh deal must not inherit review, issue, audience, or confirmation state from the prior deal.
- Small viewport and open-keyboard layouts must keep fields, copy actions, and bottom navigation reachable without horizontal overflow.
- Quick-copy failures must not claim success, and recently used IDs must not include message text or personal data.

---

### Task 1: Route model, navigation, and safe in-memory work state

**Files:** `src/app/App.tsx`, `src/app/App.test.tsx`, new focused route/state module and tests if the implementation needs separation.

**Interfaces:** Route parsing returns one of home, answers, settings, quick, flow path, or template ID. Three nav items map only to home, answers, settings. Legacy `flows`, `templates`, and `use-template` hashes redirect to the equivalent supported route.

- [x] Write failing tests for three active nav states, legacy redirects, direct/reload template routes, browser back, and invalid IDs.
- [x] Run the focused tests and confirm they fail for the missing routes/nav behavior.
- [x] Implement route parsing and redirects; derive active nav from route; retain the live scenario state in the app shell across internal navigation.
- [x] Run focused tests and the full unit suite.
- [x] Commit as `feat: simplify ORBITA navigation and routing`.

### Task 2: Safe delivery and pickup state transitions

**Files:** `src/domain/types.ts`, `src/domain/flow.ts`, `src/domain/flow.test.ts`, `src/features/FlowScreen.tsx`, related Playwright tests.

**Interfaces:** Add independent pickup state for buyer message prepared and buyer notified. `pickupConfirmationReady` depends on verified stock, point confirmation, date/time/product, address, and contact permission, but not buyer notification. Keep review eligibility dependent on completed handover and no open issue.

- [x] Write failing unit/e2e tests for preparing pickup confirmation before buyer notification, blocking without point confirmation, state invalidation on product/date/time/address/contact edits, delivery neutral replies at any selected stage, and fresh-deal isolation.
- [x] Run the focused tests and confirm the expected guard failures.
- [x] Implement the minimal state/guard changes and expose only the current step’s checks and factual statuses in each flow.
- [x] Run domain tests and focused Playwright cases.
- [x] Commit as `fix: remove pickup confirmation cycles`.

### Task 3: Quick answers, composer, library, and recent/favorite access

**Files:** `src/features/HomeScreen.tsx`, `src/features/TemplateLibrary.tsx`, `src/components/CopyComposer.tsx`, `src/data/templates.ts` only for display mapping, `src/lib/search.ts`, associated tests.

**Interfaces:** Four Home actions are buyer quick answer, delivery, pickup, and after-purchase. Quick answer offers the eight named intents from the spec. Template routes are `#/template/{id}`. Safe no-check templates copy from the compact Answers list; guarded templates open one-step preparation. Category labels are user-facing Russian strings, while source IDs and template content remain unchanged.

- [x] Write failing tests for all eight quick intents, direct quick copy, required-fact guards, Russian category names, recent templates, favorites, and synonym search.
- [x] Run focused tests and confirm they fail for absent behavior.
- [x] Implement compact answer cards and one-action edit affordance; show only relevant checks and an explained blocker; track only safe template IDs in recents.
- [x] Run focused unit and Playwright tests.
- [x] Commit as `feat: add quick answers and compact response library`.

### Task 4: Responsive shell, search, accessibility, and settings

**Files:** `src/app/App.tsx`, `src/features/SettingsScreen.tsx`, `src/styles/app.css`, accessibility and responsive tests.

**Interfaces:** Mobile bottom nav has three destinations and safe-area padding; desktop uses a sidebar. Mobile search opens a focused full-screen field; Answers opens with its search field focused. Cmd/Ctrl+K opens search. Copy controls remain visible above navigation and keyboard without covering inputs.

- [x] Write failing tests for mobile search open/focus, keyboard shortcuts, nav active state, bottom copy/navigation separation, and keyboard navigation.
- [x] Run focused tests and inspect their expected failures.
- [x] Implement responsive layout with minimal inline SVG icons, reduced-motion support, install/offline/version settings, and no nested mobile scrollers.
- [x] Run unit/e2e checks and current axe home check.
- [x] Commit as `feat: refine responsive ORBITA interface`.

### Task 5: Full acceptance, visual review, and publish

**Files:** `e2e/orbita.spec.ts`, `e2e/platform.spec.ts`, `docs/acceptance.md`, screenshots under ignored test artifacts only unless they are useful review deliverables.

- [x] Add/update Playwright scenarios for home, delivery, pickup, guarded composer, answers/search, and responsive layouts; capture and inspect 320, 375, 390, 430, 768, 1280, 1440, plus a short 320×560 mobile viewport.
- [x] Run lint, typecheck, Vitest, Playwright Chromium, build, public-data audit, budget audit, and Lighthouse. The macOS Playwright WebKit process crashes before browser launch; GitHub CI runs Chromium and WebKit on Linux.
- [x] Inspect screenshots; fix desktop navigation geometry and irrelevant audience-switch display; rerun the responsive and composer tests.
- [ ] Verify offline reload, direct deep links, update prompt, and production deployment through the existing Pages workflow. Offline reload and deep links are verified locally; remote CI and publication remain pending.
- [ ] Update acceptance evidence, commit as `docs: record ORBITA 1.1 acceptance`, and publish only after checks pass.
