# Performance verification

- Tool: Lighthouse 13.5.0, default mobile profile
- Browser: Playwright Chromium installed with `npx playwright install chromium`
- URL: local production preview at `/orbita-assistant/`
- Scores: Performance 100, Accessibility 100, Best Practices 96, SEO 100
- Metrics: FCP 1.4 s, LCP 1.5 s, Speed Index 1.4 s, TBT 0 ms, CLS 0
- Initial JS/CSS gzip: separately checked by `npm run audit:budget` (JavaScript <=180 KiB; JS + CSS <=300 KiB).
- Limitation: one local run is an engineering check, not a guarantee for every device or network.
