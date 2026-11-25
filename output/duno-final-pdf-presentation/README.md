# Duno final PDF presentation

An updated version of the previous Duno presentation, based on `Duno Final PDF.pdf` and using the established Duno lavender, purple, mint, Aptos, logo, and application screenshots. It removes recurring slide headers and footers. The primary output is a hybrid PowerPoint: 4K HTML/CSS visual backgrounds with native editable title and paragraph text. Open in PowerPoint and inspect text wrapping before presenting.

## Build

From the workspace root run:

```powershell
node output/duno-final-pdf-presentation/build.mjs
```

This creates 3840 × 2160 PNG previews in `output/png/` and the hybrid deck in `output/pptx/`. Each PowerPoint slide includes a source note pointing to the final PDF pages. The original template and previous deck remain unchanged.







