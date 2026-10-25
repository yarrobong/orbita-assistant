# ORBITA Assistant — P0 acceptance

**Status:** P0 implementation and automated acceptance passed for the published static app. Physical-device smoke checks are listed separately below.

## Production

- App: <https://yarrobong.github.io/orbita-assistant/>
- Public repository: <https://github.com/yarrobong/orbita-assistant>
- Deployment and Main CI: [successful GitHub Actions run](https://github.com/yarrobong/orbita-assistant/actions/runs/40242439344)
- Published from `main` with GitHub Pages Actions; no server process is required.

## P0 criteria

- [x] Production URL opens with HTTP 200; the app loads on `/#/flow/delivery` after refresh.
- [x] Installable PWA metadata includes standalone display, the app scope/start URL, 192 px and 512 px icons, and iPhone home-screen metadata and touch icon.
- [x] After first load, production app shell, delivery flow, built-in content, and search still work with the browser offline.
- [x] Home screen presents the five requested entry points. A typical delivery or neutral pickup answer is one action from Home; a new-buyer neutral answer takes two selections.
- [x] Delivery and pickup use separate guarded flows. Product, shipment, receipt, handover, time, address, and contact checks are manual.
- [x] A pickup confirmation cannot be copied before product, slot, stock, handover, address, and contact permission checks pass. Changing date, time, product, or relevant contact data invalidates confirmations.
- [x] Review requests require verified receipt or completed handover, are hidden when an issue is open, and are recorded once per local scenario.
- [x] Internal handover messages carry an internal label and require switching the audience.
- [x] The searchable source catalog contains 118 templates across the four requested source collections. Favorites are local.
- [x] Required variables block copying until filled. Edited text is the copied text; clipboard failure leaves selectable text and does not report success.
- [x] A waiting service worker offers an update; only the explicit update action activates it, while an open page otherwise continues on its current version.
- [x] No horizontal overflow in Chromium at 320, 360, 375, 390, 430, 768, 1024, 1280, or 1440 CSS px. WebKit smoke tests also cover phone, landscape, and desktop viewports in CI.
- [x] No external fonts, trackers, or app server. Public build audit checks phone, exact pickup address, and handover name; Lighthouse accessibility score is 100.
- [x] Performance budget passes: JavaScript 89.9 KiB gzip; initial JS + CSS 93.2 KiB gzip. Lighthouse 13.5 default mobile profile: Performance 99, Accessibility 100, Best Practices 96, SEO 100; FCP 1.4 s, LCP 1.6 s, TBT 0 ms, CLS 0.

## Regression evidence

- Vitest: 36 tests pass across flow guards, graph, source catalog/search, import validation, privacy audit, interpolation, clipboard behavior, and the update prompt.
- Playwright: 9 Chromium tests pass, including delivery, positive/blocked pickup, changed pickup slot, unavailable stock, review/issue rules, search, viewport widths, accessibility, and offline behavior.
- CI additionally runs the platform smoke test in desktop Safari and iPhone Safari WebKit profiles. The full GitHub Actions job passed.
- Production verification on the published domain passed: HTTP 200, manifest fetch, hash deep-link reload, service worker control, offline reload, and offline catalog search.
- Worker uses content-hashed cache names and only calls `skipWaiting` after the user selects the update action; otherwise an open page keeps using its current version until its clients close. Buyer fields are not persisted. Favorites and the last scenario/review status are local.

## Device-test limits

The iPhone Safari and desktop Safari runs use Playwright WebKit profiles in GitHub Actions, not physical devices. The local macOS WebKit binary exited with SIGSEGV before page launch, so no local Safari run was possible. No physical iPhone home-screen installation or hands-on Windows Edge session was available; those hands-on checks remain outstanding. Chromium desktop/mobile viewport tests and the production offline test passed; the installation steps are documented in Settings.

### Physical-device smoke checklist (not yet executed)

1. On iPhone Safari, open the production URL, choose **Share → Add to Home Screen**, launch the new icon, and check that the app opens standalone with the bottom navigation clear of the home indicator.
2. After the first online load, switch on Airplane Mode. Open Home, Delivery, Pickup, and Answers; search for `белый геймпад`; confirm that the UI still works and no layout is clipped in portrait and landscape.
3. On macOS Safari and Chrome and on Windows Edge and Chrome, check the production URL at desktop and narrow widths, keyboard focus, edited-text copy, and a reload while offline after the first visit.
4. For update behavior, keep a message open while a newer deployment becomes available. Confirm that the current screen stays open, **Later** leaves it untouched, and **Update app** activates the new version only after the notice warns about unsaved text; verify that favorites remain after the reload.
