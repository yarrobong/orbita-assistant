# ORBITA Assistant 1.1 — P0 acceptance

**Status:** Published and verified. Main CI and GitHub Pages deployment succeeded for commit `540a186` on 2026-10-26.

## Production

- App: <https://yarrobong.github.io/orbita-assistant/>
- Repository: <https://github.com/yarrobong/orbita-assistant>
- Deployment: [GitHub Actions run 40248251771](https://github.com/yarrobong/orbita-assistant/actions/runs/40248251771) — verify and deploy both succeeded. The workflow publishes `dist/` from `main`; no app server is required.
- Production smoke check: app, manifest, and 192 px icon returned HTTP 200; `/#/flow/delivery` loaded directly; after the first online load and one controlled reload, the deep link reloaded successfully with the browser offline.

## P0 criteria

- [x] Candidate published to the production URL after successful `main` CI; public route and offline reload verified.
- [x] PWA manifest, standalone display, project scope/start URL, 192 px and 512 px icons, and iPhone home-screen metadata are present.
- [x] Production build's app shell, delivery flow, embedded catalog, and local search work after the first online load without a network connection (Playwright service-worker test).
- [x] Home has four primary actions: buyer quick answers, delivery, pickup, and after-purchase. Eight quick-answer intents use IDs from the existing ORBITA catalog; quick entry and recent/favorite access are available.
- [x] Delivery and pickup are distinct guarded flows. Shipment, receipt, stock, handover, slot, address, and contact checks are explicit manual confirmations.
- [x] Pickup confirmation is blocked until the named handover person confirms the exact product and time, and the address/contact checks pass. Editing product, slot, address, or handover contact invalidates dependent confirmations.
- [x] Review requests require received delivery or completed pickup handover, stay unavailable while an issue is open, and can be recorded once per local scenario.
- [x] Internal pickup messages are labeled and separated from buyer messages; the audience switch is only shown when needed.
- [x] Catalog retains all 118 templates and their stable IDs across the four source collections. Search, Russian category labels, favorites, recent IDs, and synonym matching are local.
- [x] Required placeholders block copy. Edits are copied as edited; browser clipboard failures offer a manual-selection fallback and never report false success.
- [x] Update activation remains user-controlled; a waiting service worker does not replace an open app without the explicit update action.
- [x] No horizontal overflow is verified at 320, 360, 375, 390, 430, 768, 1024, 1280, and 1440 CSS px. Screenshots at 320, 375, 390, 430, 768, 1280, and 1440 were visually inspected; short 320×560 viewport also keeps all four Home actions visible.
- [x] Static data audit passes with no detected phone, pickup address, or handover name in shipped files. No external fonts, trackers, or server were added.
- [x] Bundle budget passes: initial JavaScript 92.4 KiB gzip; JavaScript + CSS 96.2 KiB gzip (limits: 180 / 300 KiB).
- [x] Lighthouse 13.5.0 mobile: Performance 99, Accessibility 100, Best Practices 96, SEO 100; FCP 1.4 s, LCP 1.7 s, Speed Index 1.4 s, TBT 0 ms, CLS 0.

## Automated regression evidence

- Vitest: 60 tests pass.
- Lint and TypeScript checks pass.
- Chromium Playwright: 14 tests pass, including WCAG A/AA axe scans on Home, Answers, mobile search, and composer; coverage includes guarded pickup/delivery, quick answers, direct/reloaded routes, search shortcuts, responsive widths, service worker update, and offline reload.
- GitHub Actions run 40248251771 passed the full Linux CI, including Chromium plus desktop Safari and iPhone Safari WebKit profiles, Lighthouse, and Pages deployment. Local WebKit on this macOS host exits with `SIGSEGV` before page creation; the remote profiles provide the platform run.
- Public-data audit passes for source, public, and built files. Lighthouse and bundle budgets pass locally and in main CI.

## Device-test limits

No physical iPhone, macOS Safari/Chrome, or Windows Edge/Chrome session was available. The installed-PWA metadata and automated iPhone Safari profile are verified, but hands-on Add to Home Screen installation and physical-device smoke checks remain outstanding. Chromium and the Pages offline flow are automated; use the checklist below for a physical-device release smoke test.

1. On iPhone Safari, open the production URL, choose **Share → Add to Home Screen**, launch the icon, and check standalone display and bottom safe-area spacing.
2. After one online load, enable Airplane Mode. Open Home, Delivery, Pickup, and Answers; search `белый геймпад`; verify no clipping in portrait and landscape.
3. On macOS Safari/Chrome and Windows Edge/Chrome, test narrow and desktop widths, keyboard focus, edited-text copy, and offline reload after the first visit.
4. Keep a message open when an update is available. Verify that **Later** leaves it untouched and **Update app** activates only after the unsaved-text warning.
