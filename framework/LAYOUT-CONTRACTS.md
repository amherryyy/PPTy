# Content-first layout contracts

These rules govern text-bearing HTML/CSS slide components. They are meant to let the composition change when copy changes, while preserving the 24 CSS px text floor.

## Required behavior

- Text determines the height of its panel. Use `height: auto`, `min-height: 0`, `max-height: none`, and natural document flow for text containers.
- Let grid content tracks shrink horizontally and grow vertically: use `minmax(0, 1fr)` columns and `grid-auto-rows: auto`.
- Put `min-width: 0` on grid/flex children and text blocks. Use normal wrapping plus `overflow-wrap: break-word`; don't use `white-space: nowrap` for prose.
- Keep clip paths and angular edges on a decorative pseudo-element behind the text. Never put `clip-path`, `overflow: hidden`, or a fixed height on the text-bearing element to preserve a silhouette.
- Fixed dimensions are appropriate for the slide canvas and non-text artwork. They are not appropriate for paragraphs, labels, or cards whose height depends on copy.
- If a composition no longer fits on the slide at the minimum font size, change the composition or split content with author approval. Don't shrink text, clip it, or drop required meaning.

## Shared CSS primitives

Load `layout-fit.css` after `composition.css` when building a framework composition.

- `.fit-stack` stacks content in automatic-height rows.
- `.fit-grid` creates responsive columns with automatic-height rows.
- `.fit-panel` creates a content-sized text panel with its background on a pseudo-element.
- `.fit-panel--angled` adds a shallow clipped background shape while leaving the text box unclipped.
- `.fit-panel__title`, `.fit-panel__body`, and `.fit-copy` apply wrapping and minimum type behavior to text.

Example:

```html
<section class="fit-grid">
  <article class="fit-panel fit-panel--angled">
    <h2 class="fit-panel__title">Local capability</h2>
    <p class="fit-panel__body">Training and supplier participation tied to production.</p>
  </article>
</section>
```

## Rendering gate

`render-composed.cjs` loads these primitives and runs `check-layout.cjs` before each PNG capture. It stops on text below 24 CSS px, slide-edge overflow, and measured text overflow inside clipped shapes. Geometry-based overlap findings are review warnings and require a human look at the rendered slide.
