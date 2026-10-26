# ORBITA Assistant 1.2 — Fast Scenario Messages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make any delivery or pickup situation directly selectable and make safe, factual, and private message content available without process checklists.

**Architecture:** Keep the existing 118-template catalog and static PWA. Scenario step selection becomes the user's explicit intent for that situation; transition guards validate only that a stage belongs to its scenario. The composer handles factual wording with neutral alternatives, keeps handover messages visibly internal, and requires both permission and a separate include action before adding a handover contact.

**Tech Stack:** Existing React, TypeScript, Vite, Vitest, Testing Library, Playwright, axe, GitHub Pages CI.

**Spec:** User request in the current conversation, “ORBITA Assistant 1.2 — Упростить воронки и убрать лишние подтверждения”.

## Global Constraints

- Preserve the three navigation destinations, all 118 source template IDs, local search/favorites/recents, editing, offline PWA, manual service-worker updates, GitHub Pages, responsive behavior, and performance budget.
- Do not invent stock, delivery, order, location, address, date, time, or contact facts.
- A selected factual scenario is intentional; it must not require a second confirmation.
- Never include a handover contact without a permission confirmation and separate explicit include action.
- Never copy unresolved `{{placeholder}}` text or private data into public build files.
- No server, database, accounts, trackers, external fonts, or paid services.
- Run focused tests after each task and full unit, Playwright Chromium/WebKit, accessibility, build, public-data, bundle, Lighthouse, responsive, and production checks before publishing.

## Review Focus

- Opening a late delivery or pickup stage from a fresh install must work without state from earlier stages.
- Clicking a factual template inside its explicitly selected situation must not require a second confirmation; outside that situation it must fall back to neutral copy. Internal-only content must stay labeled and audience-aware.
- Missing fields must show a relevant neutral message without technical placeholders; a user cannot force-copy stale rendered text after editing.
- A phone/name must stay absent from the buyer message unless permission is confirmed and a second explicit include action is selected.
- After-purchase review access must be independent of a deal's prior state, while the issue-first route remains obvious.
- A short mobile viewport with focused editing must keep the message and copy action reachable, without horizontal overflow.

---

### Task 1: Intent-based domain stages and guard separation

**Files:** `src/domain/flow.ts`, `src/domain/flow.test.ts`, `src/domain/types.ts`.

- [x] Add failing tests that all ten delivery IDs `D0`–`D9` and nine pickup IDs `P0`–`P8` are immediately enterable from a fresh state.
- [x] Add failing tests that factual status flags do not block a selected template, while `handoverContext` still blocks an internal template in buyer mode.
- [x] Run focused tests and confirm the expected guard/navigation failures.
- [x] Implement stage membership validation only, permit direct selection, and set pickup audience to internal only for its explicit coordination stage.
- [x] Run domain tests; commit `refactor: make ORBITA scenario stages intent-based`.

### Task 2: Neutral composer and explicit contact handling

**Files:** `src/components/CopyComposer.tsx`, `src/components/CopyComposer.test.tsx`, `src/domain/types.ts`, `src/domain/templates.test.ts`. Category defaults live beside the composer until scenario-specific wording moves into `src/data/scenario-stages.ts` in Task 3.

- [x] Add failing tests for a missing-date neutral alternative that copies without placeholders, and a handover contact absent by default.
- [x] Add failing tests requiring both permission and a separate include action before phone/name enter copied text.
- [x] Run composer tests and confirm expected failures.
- [x] Implement category/stage-specific neutral alternatives, hidden optional details, safe text preview, edit toggle, and two-step contact inclusion. Keep internal message labeling and audience checks.
- [x] Run composer/unit tests; commit `feat: make ORBITA copy safe without confirmation checklists`.

### Task 3: Directly selectable delivery, pickup, and after-purchase screens

**Files:** `src/data/scenario-stages.ts`, `src/data/scenario-stages.test.ts`, `src/features/FlowScreen.tsx`, `src/styles/app.css`, `src/app/App.tsx`, `src/app/App.test.tsx`, `e2e/orbita.spec.ts`.

- [x] Add failing Playwright tests for all delivery and pickup situations, direct late-stage selection, immediate copy, neutral meeting fallback, review-from-home, issue-first review guidance, and fast in-place switching.
- [x] Implement compact stage choices above the ready message and keep optional details below it; remove mandatory checklists and sent-message confirmations from scenario progression.
- [x] Make contact permission and inclusion explicit, separate, and local to the current tab; keep optional “already requested review” non-blocking.
- [x] Run focused Playwright and axe checks; inspect short mobile heights and focused edit layout.
- [x] Run unit tests; commit `feat: simplify ORBITA delivery and pickup flows`.

### Task 4: Full acceptance, performance, and publication

**Files:** `README.md`, `docs/acceptance.md`, `docs/performance.md`, package version, acceptance tests.

- [x] Run lint, TypeScript, all Vitest, Chromium Playwright, production build, public-data audit, bundle budget, Lighthouse, and screenshot review at mobile/desktop widths.
- [ ] Verify the WebKit desktop and iPhone profiles in GitHub CI; local WebKit startup was blocked by the bundled process exiting with SIGSEGV.
- [ ] Fix any regression and rerun the affected tests.
- [x] Update 1.2 acceptance evidence and commit `docs: record ORBITA Assistant 1.2 acceptance`.
- [ ] Push the verified branch and publish via the existing `main` GitHub Actions Pages workflow; verify the production route and offline reload.
