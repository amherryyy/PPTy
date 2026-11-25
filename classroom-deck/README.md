# Duno Classroom Presentation

This folder contains a 14-slide HTML-to-PNG presentation designed for a 10 to 15 minute App Development project talk.

## Files

- `slides/`: editable HTML slide text and the Duno-inspired stylesheet
- `output/png/`: 14 Playwright exports at 1920 by 1080 pixels
- `export.js`: repeatable PNG export script
- `speaker-notes.md`: short spoken guide with suggested timing

Run `node export.js` from this folder to render the slides again. The script requires the workspace Playwright dependency.

## Content notes

- The 18-table count is based on current source schema definitions and migrations. The ERD drawing is explicitly simplified to the six core study-flow tables.
- The hosted demo slide is a checklist for a live walkthrough, not evidence that signed-in flows have been verified on hosted r25.
- The registration consent checkbox issue is disclosed. Registration is not shown as verified.
- The overview and browser frames are conceptual UI illustrations, not application screenshots.
- Slide 12 contains eight empty frames for the user's real project photos. No photos were inserted.
- The official Duno logo is used on the opening and closing slides. Its source pixels are unchanged.

The previously reviewed deck remains in the parent workspace's `output/final/` folder.
