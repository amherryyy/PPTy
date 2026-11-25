# Reusable components and layout guidance

Source paths are repository-relative to `C:\xampp\htdocs\Talas`. Keep all component styling inside the current Duno palette, typography, radii, and shadow behavior described in `design-system.md`; do not substitute a new theme.

## Page frame and navigation

- **Student workspace:** `app/Views/student/subjects/layout.php` wraps content in a centered `.shell` (max 76rem), sticky top header, text brand lockup, five primary destinations, More menu, `<main>`, notifications, and shared footer. CSS: `public/assets/css/duno-ui.css` and `student-navigation.css`.
- **Phone navigation:** at 52rem and below, use the fixed five-destination bottom bar, safe-area inset, white translucent surface, subtle top shadow, 44px targets. Keep Guide accessible from the More menu/dashboard; don't add a sixth cramped tab.
- **Auth:** `app/Views/auth_layout.php` has a separate header and two-part branded introduction/form shell; mascot is decorative/interactive, with reduced motion handled. It has no student footer.
- **Public shell:** `app/Views/home.php` plus `app/Views/partials/app_footer.php`; keep the centered max-width and low-density brand/footer treatment.

## Dashboard and feature panels

- **Dashboard intro/hero:** `app/Views/student/dashboard.php`, `.workspace-hero` styles in `duno-ui.css`. Wide layout pairs copy/actions with layered mascot artwork, glow/orbits and soft gradient. At phone width, reduce art and stack content; retain a clear single primary action. Mascot is decoration; text carries meaning.
- **Feature/tool cards:** Dashboard `Duno Focus`, `Duno Plan`, `Duno Timer`, `Duno Guide`, and `Aralytics` cards are compact links with a colored icon tile, title, short explanation, and action cue. Use local Solar icons where available and card-specific calm color accents. Don't add invented KPIs.
- **Progression/stat card:** `app/Views/student/partials/progression_card.php`; use a single visual hierarchy for level/streak/XP and restrained progress indicators. Values are based on real provided data. Avoid promising outcomes.
- **Subject panels and rows:** dashboard and `app/Views/student/subjects/index.php`. The current consistency audit favors lightweight aligned rows/separators for short lists; detail pages use a larger rounded hero and topic list. Reserve elevated surfaces for meaningful groups, not every row.
- **Topic priority cards/list:** `app/Views/student/topics/priority.php`, `index.php`, `all.php`; show rank and short reason chips/labels tied to inputs (difficulty, importance, date, progress). Ranking is rule-based and explainable.
- **Plan:** `app/Views/student/plans/show.php`; phone-first week/date agenda and time blocks, remaining capacity, topic status controls. Keep scheduled blocks chronological and never imply unavailable minutes are assigned.
- **Timer:** `app/Views/student/sessions/index.php`; large tabular timer within a highlighted soft-purple focus card, clear run/pause/stop/save actions, supportive mint rhythm panel. Make the save/discard choice explicit.
- **Aralytics:** `app/Views/student/aralytics/index.php`; period selector, summary-stat cards, real session-minute visualization with a numeric equivalent/table, collapsible details, print view. Optional check-in patterns remain private and excluded from print/admin.

## Forms and controls

- **Field controls:** `duno-ui.css`; labels above controls, dark text, white field surfaces, thin lavender-gray borders, .75rem radius, 2.9rem minimum control height, clear purple/blue focus ring. Keep helper/error text adjacent to its field.
- **Segmented choices:** `app/Views/student/partials/segmented_choice.php`; three equal responsive choices for Low/Medium/High or progress. Selection uses visible fill/border and native accessible inputs.
- **Buttons:** primary filled purple with white label, 44px height, .8rem radius, subtle purple shadow. Secondary is white/ink with line border and no shadow. Danger is dark red. Hover deepens purple; active shifts down 1px. Preserve visible focus and disabled state.
- **Disclosure:** native `<details>`/`<summary>` for More menu and report details; keep keyboard operation and clear open/current state.
- **Notifications/errors:** shared `app_notifications` and `.errors` surface; messages stay authoritative. Mascot mood is secondary decoration only.

## Icons, illustrations, and backgrounds

Use the local Solar Icons Linear SVG subset in `assets/icons/solar/`, with attribution files retained. In app CSS, `.solar-icon` masks are colorable and usually 1.1-1.35rem. Label controls with text; icons beside labels are decorative. The contour SVG and gradient mesh are a subtle page texture, not a card fill. Use mascot poses only for welcome/info/warning/support/reward moments listed in `asset-manifest.md`.

## Charts and data visuals

Use the actual Aralytics chart structure and supplied numbers, not sample growth metrics or made-up data. Keep a readable numeric equivalent for the visual, use lavender/purple bars and restrained contrast, and respect reduced motion. Do not include private check-in values in printed output.
