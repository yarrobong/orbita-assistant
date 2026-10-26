# ORBITA Assistant 1.3 — performance verification

- Environment: local production build, Lighthouse 13.5.0 default mobile profile, Playwright Chromium, preview URL `/orbita-assistant/`.
- Reference: [1.2 report](performance.md), same tool/profile/browser description.
- 1.2 reference scores: Performance 100, Accessibility 100, Best Practices 96, SEO 100.
- 1.3 scores across three consecutive runs: Performance 99 each, Accessibility 100 each, Best Practices 96 each, SEO 100 each.
- Displayed timing metrics were identical in all reference and 1.3 runs: FCP 1.4 s, LCP 1.7 s, Speed Index 1.4 s, TBT 0 ms, CLS 0.
- Conclusion: 1.3 is one Lighthouse Performance point below the single recorded 1.2 run, with unchanged displayed timing metrics and Accessibility at 100. The score remains above the 95 acceptance target; the available measurements show no material timing regression.
- Bundle budget: JavaScript and CSS remain within the existing 180 KiB JavaScript / 300 KiB combined gzip thresholds; the final `npm run audit:budget` output is 92.5 KiB JavaScript and 97.4 KiB combined gzip.
- Limitation: local repeated runs are a comparable engineering check, not a guarantee for every device or network. CI runs the same Lighthouse audit on its Ubuntu runner.
