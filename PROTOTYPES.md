# Duno presentation prototypes

Three 16:9 HTML slide prototypes are in `slides/`. The shared presentation CSS derives its color, font, spacing, radius, shadow, contour texture, and icon choices from `assets/duno-handoff/`. It uses the Aptos, Segoe UI, system UI stack and the supplied Duno brand art. The cover uses the solid paper token to match the official logo image's white background, with the logo as its primary visual.

## Preview files

- `output/png/01-cover.png`
- `output/png/08-core-study-features.png`
- `output/png/09-relational-database-design.png`

Recreate the previews from the workspace root with `node export.js`. The script uses the installed Playwright Chromium dependency and writes 1920 × 1080 PNG files to `output/png/`.

## Design fidelity and limitations

- The handoff provides all requested design documents and local brand assets. It includes no bundled font files, so Chromium uses the documented system font fallback available on the render host.
- `assets/branding/duno-official-logo.png` is an exact byte copy of the supplied official image. The source is JPEG data with a white background and no alpha channel, despite its `.jpe` extension. The slide uses the full image without cropping, recoloring, or distortion.
- `screenshots/` contains only its README. The screenshot manifest marks every application capture pending. Slide 08 therefore uses explicitly labeled conceptual UI illustrations, not application screenshots or evidence.
- Slide 09 follows the handoff's six-table simplified ERD, adds connector/cardinality marks, and explains owner-scoped composite references. Nullable topic links remain optional. The ERD is not the full schema and does not assert the live database state.
- The handoff identifies local source marker `duno-full-release-20261103-r25`. The hosted release marker is owner-verified, while full hosted functionality remains unverified.
- No application code, database, credentials, private student records, or hosted system were accessed.

The prototypes stop at Slides 01, 08, and 09, pending design approval.
