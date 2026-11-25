# Duno UI design system handoff

**Snapshot:** local repository `main`, HEAD `4b34485` (`Merge r25 release provenance record`), inspected 2026-11-03. App files were read only. Current source release marker: `duno-full-release-20261103-r25`. This identifies the local source snapshot; it does not prove the hosted site matches it.

## Identity

- Product wordmark: **duno.** (lowercase, with period); tagline: **Your Little Study Buddy.**
- Mascot: friendly yellow Eureka lightbulb in a traditional Filipino salakot, with purple study accessories.
- Product areas: Duno Focus, Duno Plan, Duno Guide, Duno Timer; analytics is named **Aralytics**.
- The running UI outputs the wordmark as text in the shared views. `assets/images/duno-logo.png` is a generated lockup from a prior request, not currently referenced by app views and not an exported vector master. Use it as a supplied presentation asset only; for faithful app wordmark rendering, set the wordmark in text using the CSS values below.
- Primary brand rules and six approved color tokens: `docs/brand-identity.md`.

## Frontend source of truth

The app is server-rendered CodeIgniter 4 with HTML views, plain CSS, and small plain JavaScript modules. No Tailwind config, design-token build pipeline, frontend framework, or remote font import was found. Global CSS root tokens are in `public/assets/css/duno-ui.css` (`:root`, lines 1-29). Student navigation and icon masks are in `public/assets/css/student-navigation.css`; responsive error shell is in `public/assets/css/duno-errors.css`. Shared signed-in layout is `app/Views/student/subjects/layout.php`; auth shell is `app/Views/auth_layout.php`.

## Colors (source-exact)

| Token | Value | Typical use |
|---|---|---|
| Canvas | `#F7F6FC` | page surface |
| Paper | `#FFFFFF` | cards and controls |
| Ink | `#2E2E3A` | main text |
| Muted | `#615D78` | secondary text |
| Line | `#E5E2F0` | separators and borders |
| Purple | `#7465D8` | primary actions, links, brand |
| Deep purple | `#5949BD` | hover, selected links, high contrast |
| Lavender | `#EDE9FE` | active navigation, soft panels |
| Mint | `#B9E8D1` | supportive accents |
| Soft mint | `#E4F5EC` | calm success surfaces |
| Gold | `#FFDA92` | warm accent and mascot details |
| Danger | `#9B302A` | destructive actions |
| Keyboard focus | `#315CBD` outline, 3px with 3px offset in common app controls | visible keyboard focus |

The canvas texture combines `duno-contour-texture.svg` with low-opacity lavender, mint, purple, and gold radial gradients. Glass panels use translucent white. Keep text dark and contrast high; do not recolor muted text or primary purple casually.

## Typography

- Font stack: `Aptos`, then `Segoe UI`, then system UI, sans-serif. No webfont files or remote font provider were found. Use the same stack; preserve natural platform fallback.
- Body defaults to browser 16px and line-height 1.55; workspace main content uses 1.6.
- H1: `clamp(2rem, 4.2vw, 3.25rem)`, weight 760, letter spacing `-.065em`, line-height 1.06 (some feature headings have their own clamps).
- H2: `clamp(1.2rem, 2.4vw, 1.55rem)`, weight 710, letter spacing `-.04em`, line-height 1.2.
- H3 uses tight tracking `-.025em`; body copy usually 1rem; field labels .9rem / weight 680; navigation .88rem / weight 680; meta labels commonly .65-.85rem.
- Wordmark text is 1.85rem, weight 850, tracking `-.075em`, line-height .95 in workspace header. Auth wordmark has a separate selector; consult `duno-ui.css` before reproducing that shell.
- Use tabular numerals for timer/stat values where the source does (`font-variant-numeric: tabular-nums`).

## Geometry, spacing, and effects

The source uses rem values and page-specific spacing, not a formal 4px/8px token scale. Treat the values in `tokens.json` as extracted common values, not a claim that every view is on a rigid scale. At default 16px: workspace side gutter 1.25rem (20px); max signed-in shell 76rem (1216px); header min-height 5.4rem; header content gap 1rem; main bottom padding 2.5rem. Common panel padding is 1-1.5rem, responsive via `clamp()`; common grid gaps .55-.9rem.

- Radius range: .45rem angular accent to 1.5rem large hero/cards; common controls .75-.8rem; panels .9-1.2rem; pills 999rem; circular marks 50%.
- Main shadow: `0 18px 44px rgb(47 39 95 / 8%)`.
- Soft card shadow examples: `0 6px 18px rgb(47 39 95 / 4%)`; raised panels: `0 12px 30px rgb(64 51 130 / 6%)`.
- Glass: white 80% (`--duno-glass`), soft white 72%, border white 88%; shadow `0 14px 34px rgb(62 53 116 / 8%), inset 0 1px 0 rgb(255 255 255 / 84%)`.
- Typical button height is 2.75rem (44px), input height 2.9rem (46.4px). Frequently used coarse-pointer navigation targets are at least 44px.
- Motion is short and restrained (often 150-260ms); `prefers-reduced-motion: reduce` is implemented and should be preserved.

## Responsive behavior

- Base mobile layout supports 320px minimum width.
- Student navigation switches at `52rem` (832px): wider screens use the top nav; compact screens get a fixed bottom navigation with safe-area padding. The mobile student bar has five labeled destinations: Home, Focus, Plan, Timer, Aralytics. Guide and secondary destinations are in the More menu or dashboard.
- Additional design breakpoints appear in `duno-ui.css` at 32rem, 40rem, 52rem and feature-specific 56/58/62/64/68rem values. Use the component's local media rules rather than inventing a new breakpoint system.
- Dashboard/tool grids collapse, panels stack, and dense multi-column forms/Guide/agenda layouts simplify on smaller widths. Many small screens use full-width controls. Coarse-pointer controls enlarge; safe-area insets are honored.
- Print CSS is present for reports and Aralytics. Do not infer app screenshots from paper wireframes.

## Implemented vs. legacy/experimental

- `public/assets/css/duno-ui.css` and `student-navigation.css` are linked by current layouts and are the active app visual source; `duno-errors.css` is the branded error-page source. `pwa.css` is for install/offline affordances, not a separate visual theme.
- `.worktrees/` exists as an untracked Git item at snapshot. No styles from that folder were used. The inspected source tree's `public/assets/images/duno-logo.png` is untracked and generated; it is not used by current layouts. Treat it as optional concept art, not as evidence of the shipped header.
- `app/Views/welcome_message.php` and CodeIgniter vendor/system styles are framework artifacts, not Duno design references. The `docs/system-design-paper-pack.md` text wireframes explicitly say they are design references, not screenshots.
- No Tailwind configuration or local font asset was found. No existing verified app screenshots were found/copied.

## Key source references

- `public/assets/css/duno-ui.css`: root tokens lines 1-29; shared workspace/layout/components and breakpoints throughout.
- `public/assets/css/student-navigation.css`: icon masks and mobile student/admin/guest navigation.
- `public/assets/css/duno-errors.css`: error shell only.
- `app/Views/student/subjects/layout.php`: actual shared student header/nav and CSS links.
- `app/Views/student/dashboard.php`: dashboard hero, subject panel, tool cards, progression and Guide sections.
- `app/Views/student/topics/form.php`: reusable topic form and segmented fields.
- `app/Views/student/aralytics/index.php`: period summary, chart, disclosures, printable report.
- `app/Views/student/plans/show.php`: week agenda, plan blocks and capacity UI.
- `app/Views/student/sessions/index.php`: Timer panel and rhythm card.
- `docs/brand-identity.md`, `docs/solar-icons.md`, `docs/mascot-assets-integration.md`: approved names, mascot usage, icon source/license.
