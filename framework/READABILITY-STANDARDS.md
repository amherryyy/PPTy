# Presentation readability standard

## Minimum type size

- On a 1920 x 1080 HTML/CSS slide canvas, **24 CSS px is the absolute minimum for any meaningful on-slide text**. At 3840 x 2160 export, that is 48 raster pixels.
- Use larger sizes for body copy where the amount of content allows. Treat titles, labels, captions, chart annotations, and callouts as meaningful text; the minimum applies to all of them.
- Decorative shapes and nonverbal marks do not need type sizing. Do not shrink text to preserve a dense composition.
- If text cannot fit at 24 px, simplify nonessential wording while preserving its meaning, recompose the slide, or split the content. Keep supporting references and detailed attribution in speaker notes or a companion source list; keep any necessary on-slide source marker at or above 24 px.

## Review requirement

- Check rendered slides at normal presentation size, not only zoomed in.
- Inspect the computed font size of visible text during browser-based QA and fail the review if any meaningful text is below 24 CSS px.
- Confirm contrast and line spacing remain comfortable after increasing type. The size floor is a minimum, not a target for all text.

This is the workspace default for future presentations. A user may explicitly request a different format or accessibility target for a particular deck.
