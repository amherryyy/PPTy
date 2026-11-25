# Framework model: first slice

Run `node framework/validate.cjs path/to/presentation.yaml` to validate YAML and print its JSON-compatible model. The model contains a title, sources with author-defined integer priorities and locations, required outline items, and slides with a semantic purpose, optional layout override, source references, outline coverage, and text blocks. Mark important claims with `highRisk: true` and provide block-level source IDs.

Validation checks references and coverage; it does not verify factual correctness, resolve source conflicts, render slides, or approve an outline. Those require subsequent work and human review. The validator does not create or overwrite export files.

Presentation preference: omit recurring slide headers, section labels, page numbers, and footers by default. Keep titles and source metadata in the authoring model and review records.

Design preference: explore diverse, expressive visual references (including Canva when available) and adapt the visual direction to each project; avoid defaulting to minimal layouts. Use original HTML/CSS compositions and retain readability and content fidelity.

Readability standard: use at least 24 CSS px for all meaningful text on a 1920 x 1080 slide canvas. See `framework/READABILITY-STANDARDS.md`; browser render reviews should fail if meaningful text falls below this floor.

Layout QA: run `node framework/check-layout.cjs path/to/deck-folder` to inspect numbered HTML slides without changing them. It reports text below the floor, text outside the slide, overflow inside clipped shapes, and likely text overlaps. Treat overlap findings as visual-review prompts because transformed shapes can create geometric false positives.

Content-fit layouts: see `framework/LAYOUT-CONTRACTS.md` for the rules and shared `.fit-stack`, `.fit-grid`, and `.fit-panel` classes. The composed renderer loads `layout-fit.css` and blocks PNG capture on measured fit errors.

Reference study: see `framework/PPTX-REFERENCE-STUDY.md` for the 40-slide visual review, composition lessons, and eight original sample slides in `framework/reference-sampler-review-05`.

Editable-text PPTX experiment: run `node framework/export-editable-pptx.cjs path/to/presentation.yaml path/to/new-output.pptx`. PptxGenJS packages each 4K image background for each slide and places titles, paragraphs, and numeric block markers in native PowerPoint text boxes. The output path must be new. The exporter runs the checker before publishing; use `node framework/check-hybrid-pptx.cjs path/to/output.pptx [expected-slide-count]` for an existing deck. This is an optional prototype, not the default export path; see `framework/EDITABLE-PPTX.md` for limitations and visual QA steps. CSS artwork remains rasterized, and text wrapping/font metrics need review in PowerPoint.

