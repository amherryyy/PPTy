# Duno Reusable Slide Layout Library

This supplementary library contains ten layouts that follow the Duno presentation identity. These templates are optional additions and are not part of the 14-slide main talk.

## Contents

- `index.html`: template catalog with PNG thumbnails and intended use
- `slides/`: ten editable HTML source templates
- `styles.css`: shared Duno color, typography, spacing, and component system
- `output/png/`: 1920 by 1080 visual previews
- `output/pptx/Duno-Reusable-Templates.pptx`: editable PowerPoint shapes and text boxes
- `assets/`: copied Solar icons and the unchanged official Duno logo
- `export.js`: repeatable Playwright preview exporter
- `build-editable-pptx.mjs`: repeatable native PowerPoint builder and validator

Run `node export.js` inside this directory to refresh all ten PNGs. Run `node build-editable-pptx.mjs` to produce a new editable PPTX revision. Both scripts use the workspace Playwright and bundled Artifact Tool dependencies.

Placeholder titles, descriptions, metric values, image frames, and captions are meant to be replaced. The statistic layout contains no sample values. Screenshot and photo layouts contain empty image placeholders only.

The original 14-slide presentation and its previews remain separate and unchanged.
