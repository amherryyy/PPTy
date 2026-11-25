# Editable-text PPTX prototype

This optional exporter preserves the existing HTML/CSS composition and adds native PowerPoint text boxes for the slide title, copy blocks, and numbered block markers. It reads the canonical YAML model through `validate.cjs`; it does not add another authoring format or change the existing image-based assembler.

## Run

```powershell
node framework/export-editable-pptx.cjs framework/duno-content.yaml framework/editable-pptx-prototype/My-Deck.pptx
```

Choose an output filename that does not already exist.

## Automated structural check

The exporter runs `check-hybrid-pptx.cjs` before publishing. To check an existing deck manually, run `node framework/check-hybrid-pptx.cjs path/to/output.pptx [expected-slide-count]`. It checks ZIP CRCs, required parts and content types, internal relationships, slide count, 16:9 page ratio, 3840 × 2160 PNG backgrounds, editable text, the 12pt minimum, and XML well-formedness. It does not prove that PowerPoint opens the file or that PowerPoint typography matches Chromium, so keep the manual open and visual review. The script renders at 3840 × 2160 and stops if meaningful text is below the workspace minimum of 24 CSS px or a referenced visual asset fails to load.

## What remains editable

- Slide title text.
- Paragraph text from content blocks.
- Numeric block markers.

## What remains rasterized

- Backgrounds, CSS shapes, borders, diagrams, illustrations, and image assets.
- Layout decoration and any text not represented by the canonical model's title or content blocks.

This is a hybrid output, not a fully editable reconstruction of HTML/CSS. PowerPoint font substitution and text-box line wrapping can differ from Chromium. Treat the generated deck as experimental until reviewed in PowerPoint.

## Review before delivery

1. Open the PPTX in PowerPoint and check for repair prompts.
2. Compare all slides against the HTML/PNG render at presentation size.
3. Check title and paragraph wrapping, spacing, font substitution, and text position.
4. Confirm every text box remains inside its intended visual area and no text appears twice.
5. Keep the image-only PPTX as the fallback if the editable layer changes the appearance.

The first hand-built OOXML export triggered a PowerPoint repair prompt. The PptxGenJS replacement opened successfully in PowerPoint and the user confirmed the text is editable. Automated structural checks passed for 10 slides, 10 PNG backgrounds at 3840 by 2160, 52 editable text shapes, and 56 well-formed XML/relationship parts.
