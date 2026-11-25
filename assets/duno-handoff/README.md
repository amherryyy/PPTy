# Duno UI handoff

This folder documents the existing Duno application's visual language for reproducing it in an AppDev presentation. It is an extraction, not a redesign. Start with `design-system.md`, use `tokens.json` for values, `components.md` for page/component behavior, and `asset-manifest.md` for copied art and icon attribution.

## Fidelity rules

- Match the source's Aptos / Segoe UI / system UI font stack. There are no bundled fonts. The running app's wordmark is live lowercase text `duno.` with its tagline; its shape is styled by CSS. The generated `assets/images/duno-logo.png` is an optional image asset and is not integrated into the app.
- Keep the calm lavender canvas and contour texture, dark ink, deep purple actions, mint support surfaces, and small gold accents. Use the exact values in `tokens.json`.
- Recreate actual app component hierarchy: centered shell, sticky desktop navigation, five-item mobile bottom nav, rounded translucent panels, compact rows, restrained shadows, 44px controls and visible focus.
- Use the local mascot and Solar SVG assets from `assets/`; preserve icon licenses and attribution.
- Reproduce responsive differences and reduced-motion behavior. Don't scale a desktop-only frame into a phone mockup.
- Use only verified application screenshots as screenshots. `screenshots/` has no app captures; all entries in `screenshot-manifest.md` are pending. Capture locally with synthetic content using its checklist.
- The six-table ERD in `erd.md` is intentionally simplified. It reflects core study-flow tables and migration relationships; it is not the complete schema nor proof of current hosted schema.

## Source snapshot and limitations

Inspected local `main` at `4b34485`, marker `duno-full-release-20261103-r25`, on 2026-11-03. The working tree had an existing untracked `.worktrees/` entry, which was left untouched. This package does not modify or certify the application or hosted release. No application screenshots were available; live host behavior and hosted schema were not inspected.
