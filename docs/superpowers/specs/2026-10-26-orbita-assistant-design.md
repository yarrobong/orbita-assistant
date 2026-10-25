# ORBITA Assistant — design

## Intent

Build a compact Russian-language helper for choosing the next safe message in an Avito sale, then copying it for the user to send manually. The product is a navigator for a deal, not a CRM, bot, order tracker, or source of live stock information.

## Goals

- Fulfil all MVP P0 requirements from `TZ_ORBITA_Assistant_v1.md`.
- Put the delivery and pickup rules in a pure, testable model before polishing screens.
- Make common responses reachable from the first screen in two or three taps.
- Use the supplied ORBITA workbook as the content source, retaining its check-before-sending notes.
- Work offline after first load and publish as a static GitHub Pages project.
- Keep buyer and handover messages distinct; keep private contact details and exact pickup address out of public assets.

## Non-goals

No Avito integration, automatic sending, buyer records, accounts, analytics, server, AI generation, cloud sync, or P1 template editor/import/export unless P0 work is already complete and remains stable.

## Constraints

- React, strict TypeScript, Vite, static assets only; no external fonts or trackers.
- Hash navigation under `/orbita-assistant/` and PWA scope under the same prefix.
- Local stage/favorites only; display that local changes do not sync between devices.
- Manual verification gates for stock, order state, shipment/receipt, handover availability and consent to share a contact.
- No confirmed pickup response until product, date, time, handover person, address and contact sharing are verified. Changing product/date/time invalidates the confirmation.
- Review requests are unavailable before actual receipt/handover, when an issue is open, and after the once-per-local-scenario request has been marked sent.
- Clipboard success is announced only after the write succeeds; failed writes retain a selectable editable message.

## Approaches considered

1. **React + Vite, small dependency set, custom CSS, pure domain model (selected).** Fast static build, strict types, accessible UI without a component framework, with business guards testable independently of React.
2. **Vanilla TypeScript and DOM.** Slightly smaller initial runtime, but makes the responsive, editable, multi-screen interface and error boundaries harder to maintain.
3. **Full-stack app or hosted database.** Would ease shared state but violates the no-server/no-sync/no-buyer-data constraints and adds deployment and privacy costs.

The user has asked for implementation directly and supplied the full product specification, so the selected implementation choice is mine and work proceeds without a separate design-approval pause.

## Architecture

- `src/domain`: typed scenario state, transitions, guards, template interpolation, and testable validations.
- `src/data`: source-grounded templates and delivery/pickup state graphs, separate from view code.
- `src/lib`: local persistence, search, clipboard, and import validation.
- `src/features`: home, scenario, template library and settings screens.
- React shell with hash navigation, desktop sidebar, mobile bottom navigation, lightweight CSS tokens and no default motion.
- Vite PWA plugin with explicit project base/scope, versioned build cache, and a non-destructive update prompt.
- Vitest unit tests, Playwright flows, axe accessibility checks, lint/typecheck/build in GitHub Actions, and a documented performance budget.

## Content decisions

- Normalize the source workbook's 52 base answers, 22 safe automatic replies and 29 deal scenarios into typed catalog entries; remove duplicates only by identical content and intent.
- Preserve each item's source check/usage note and gate claims that require current product or order verification.
- Treat all stock, compatibility, prices, warranty, exact timing and alternate-color claims as conditional on an explicit manual check.
- Replace personal names, phone numbers, exact address and internal entry instructions with locally entered placeholders; do not bundle those values.
- Do not make an imported statement broader or more certain than the source. The primary system flow uses neutral language until its required check is recorded.

## Open implementation calls

- Use `vitest` for pure logic and component tests, `@playwright/test` for critical browser flows, and axe checks in Playwright.
- Use browser local storage only for small, non-sensitive scenario flags and favorites in MVP; do not persist free-form buyer messages or buyer identifiers.
- Publish only after the production artifact passes checks and is verified free of private workbook values.
- The target repository returned 404 during reconnaissance; deployment availability must be resolved during the publishing stage.
