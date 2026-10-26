# ORBITA Assistant 1.2 — P0 acceptance

**Status:** Published from `main` after local and GitHub Actions acceptance.

## Acceptance criteria

- [x] All 10 delivery situations and all 9 pickup situations are independently selectable without completing earlier stages.
- [x] Selecting a factual situation is the only state signal needed to prepare its message; operational checkboxes and sent-message confirmations do not gate scenario navigation or copy.
- [x] Factual templates outside their matching situation display a neutral alternative that can be copied. Missing required values also produce neutral copy; unresolved `{{...}}` tokens are never copyable.
- [x] An unconfirmed pickup meeting stays neutral. The agreement situation can prepare a confirmation only when the user supplies its date, time, and address.
- [x] Handover contact stays out of the buyer message by default. It can be included only after the user confirms permission and takes a separate include action.
- [x] Internal handover messages are visibly labeled and remain blocked when the audience or scenario context is wrong.
- [x] Review requests open directly from After purchase with a reminder to request one after receipt; the issue-first message remains independently available.
- [x] The optional “Уже попросил отзыв” marker is available on delivery, pickup, and After purchase review situations; it never gates templates or copying.
- [x] The source catalog still contains 118 templates. Search, favorites, recents, editing, three-section navigation, PWA, offline shell, and controlled service-worker activation remain in place.
- [x] Public-data audit found no personal buyer or handover information in the 11 checked source/public/build files.
- [x] Responsive browser checks cover 320–1440 CSS px, including a 320×560 viewport and a shorter focused-edit viewport; copy remains reachable without horizontal overflow.
- [x] Local Lighthouse 13.5 mobile scores: Performance 100, Accessibility 100, Best Practices 96, SEO 100.

## Local verification

- Vitest: 91 tests pass.
- Lint, TypeScript, production build, `audit:public`, and `audit:budget` pass. Initial JS is 92.1 KiB gzip; JS + CSS is 96.2 KiB gzip.
- Chromium Playwright: 16 tests pass, including direct access to every scenario, clipboard, neutral copy, contact permission, short mobile layout, WCAG A/AA axe checks, PWA offline reload, and responsive widths.
- Chromium Lighthouse: Performance 100 and Accessibility 100; measurement details are in [performance.md](performance.md).
- Local desktop and iPhone WebKit could not start on this macOS host because the bundled WebKit process exits with `SIGSEGV` before opening a page. GitHub Actions passed desktop and iPhone WebKit profiles on Linux.

## Publication

The feature branch CI passed on GitHub Actions [run 40332667075](https://github.com/yarrobong/orbita-assistant/actions/runs/40332667075). The `main` verification and Pages deployment passed in [run 40334728181](https://github.com/yarrobong/orbita-assistant/actions/runs/40334728181). Production was checked at <https://yarrobong.github.io/orbita-assistant/>: the delivery deep link loaded, then the offline reload opened the delivery scenario and its copy action.
