# Critique 2026-10-28, round 2: cookie banner inset (OBS-1 "Every app ships metrics, production-grade logs and alerts")

VISUAL-REVIEW-1 "Every visual change carries a design review", DESIGN-TIER-1 style-only round 2.
Builds under review (live prod): `@dloizides/legal-ui` 1.4.1, erevna-web `bea9d27`, katalogos-web `e2d9c5a`.
Round 1: `critique-2026-10-28.md` (erevna REDO: grey `#f2f2f2` band behind the banner; banner card bottom padding grew).

## Captures

| Screen | Before (old build) | After round 2 (live prod) |
|---|---|---|
| erevna public survey, 360x640 | `BaseClient/docs/Tasks/TODO/cross-cutting/OBS-1-every-app-ships-metrics-logs-alerts/sightings/erevna-public-survey-m360.png` | `after-r2/erevna-m360-after-r2.png` |
| erevna public survey, 1280x800 | `.../sightings/erevna-public-survey-d1280.png` | `after-r2/erevna-d1280-after-r2.png` |
| katalogos public menu, 360x640 | `.../sightings/katalogos-public-menu-m360.png` | `after-r2/katalogos-m360-after-r2.png` |
| katalogos public menu, 1280x800 | `.../sightings/katalogos-public-menu-d1280.png` | `after-r2/katalogos-d1280-after-r2.png` |

Same steps as round 1: Playwright Chromium, fresh context (banner up), 360x640 @2.75 isMobile/hasTouch and
1280x800 @1, routes `https://erevna.dloizides.com/public/survey/fake-id` and
`https://katalogos.dloizides.com/public/menu/fake-id`, networkidle + 3 s, full-viewport crop, no scroll.

## Hard fails (checked first)

1. **Lost item:** none. erevna 5/5 (message, Retry, "Error reference:", id, Copy), katalogos 4/4
   (message, label, id, Copy), banner 5/5 (text, Accept All, Reject All, Customize, Privacy Policy) on all four.
2. **Misaligned form row:** no form rows. N/A.
3. **Pair parity:** same route, state (error, banner up), viewport, crop, no scroll. Differences beyond the
   build: per-request trace id (server-generated) and the transient katalogos "An error occurred." toast in the
   before m360. Not the change under review. No `result.json` pair record: style-only review, not an options page.

## Measured (after round 2)

| | Banner card (x,y,w,h) | Card bg | Text inset top / bottom | Copy rect | Copy hit at centre | Page bg (top, mid) | scrollWidth |
|---|---|---|---|---|---|---|---|
| erevna m360 | 16,368,328,256 | #f7f7f7 | 17 / 17 | 165,241,30,17 | Copy | #fff, #fff | 360 |
| erevna d1280 | 320,612,640,172 | #f7f7f7 | 17 / 17 | 791,336,30,17 | Copy | #fff, #fff | 1280 |
| katalogos m360 | 16,368,328,256 | #f7f7f7 | 17 / 17 | 283,193,30,17 | Copy | #fff, #fff | 360 |
| katalogos d1280 | 320,612,640,172 | #f7f7f7 | 17 / 17 | 791,306,30,17 | Copy | #fff, #fff | 1280 |

- Grey band: gone. erevna is one white surface top to bottom at both viewports; no seam at y=338/582.
- katalogos: the whole screen moved from `#f2f2f2` to white (`#f2f2f2` = react-navigation's default
  `colors.background`, not a product colour), so it now matches erevna and the theme. Judged acceptable.
- Banner padding: top and bottom text insets now equal (17/17). The card is still taller than the old build
  (d1280 172 vs 161; m360 256 vs 242) because the buttons grew from ~40px to 44px tall: the 44x44 hit-box
  rule (mobile-first), not a padding defect. Round 1 fix 2 resolved.

## Scores

### erevna public survey: PASS (mean 4.0)

| # | Score | Evidence |
|---|---|---|
| 1 | 4 | Red message then Retry read first, centred in the space above the banner. |
| 2 | 3 | Generic consent banner and error state; unchanged by this fix. |
| 3 | 4 | One white surface; banner card `#f7f7f7` with shadow separates cleanly; padding balanced 17/17. |
| 4 | 4 | Single page value, one lighter-grey card; no meaningless second background. |
| 5 | 4 | No erevna taste ledger; "calm" (`user_design_taste.md`) now holds, the seam is gone. |
| 6 | 4 | No AI-default tells. |
| 7 | 4 | Both viewports; no h-scroll; text fits. Id + Copy still three lines at 360 (pre-existing). |
| 8 | 5 | Inventory 5/5 + banner 5/5; Copy reachable at both viewports. |

Top fix (optional, not blocking): at 360 put the Error reference id and Copy on one row like katalogos
(id 13px mono, Copy right of it), saving ~40px above the banner.

### katalogos public menu: PASS (mean 4.0)

| # | Score | Evidence |
|---|---|---|
| 1 | 4 | "Failed to load menu" first, then id + Copy, clear of the banner. |
| 2 | 3 | Generic consent banner; unchanged. |
| 3 | 4 | White surface now matches erevna; banner card reads as a raised panel. |
| 4 | 4 | One surface, one card. |
| 5 | 4 | No katalogos taste ledger; nothing contradicts `user_design_taste.md`. |
| 6 | 4 | No AI-default tells. |
| 7 | 4 | Both viewports; no h-scroll; id + Copy fit one line at 360. |
| 8 | 5 | Inventory 4/4 + banner 5/5. |

Top fix: none blocking. Sight a loaded katalogos menu with the banner up to confirm the white root does not
flatten a design that relied on the old grey behind its cards.

## Ranking

1. erevna public survey, PASS (4.0). 1. katalogos public menu, PASS (4.0). Tie; both clear the bar (all >= 3, mean >= 4).

## NOT COVERED

- Dark mode not rendered; banner dismissed (padding back to 0) not captured; Customize panel open (taller
  banner) not captured; real phone not used (Chromium emulation); a loaded katalogos menu / loaded erevna
  survey not seen (only the error state, as in round 1); other portals mounting the banner not adopted;
  visual-language.md for either app not read (row 4 from first principles); code not read (pixels only).
