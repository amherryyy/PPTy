# Presentation design library

The library contains 13 original HTML/CSS visual directions. The ten approved samples are in `design-sampler/index.html`; the three additional modern styles can be used through `render-library.cjs`. The CSS shapes, colors, and treatments are original project assets, not copied Canva artwork. System font availability can affect output; review on the export machine.

| Theme ID | Direction | Useful for |
|---|---|---|
| pop-comic | Pop comic | Energetic introductions and student projects |
| dreamy-gradient | Dreamy gradient | Creative concepts and reflective narratives |
| academic-scrapbook | Academic scrapbook | Research stories and classroom explanations |
| retro-pixel | Retro pixel | Games, computing and nostalgic topics |
| manga-panels | Manga panels | Sequential explanations and contrasts |
| warm-craft | Warm craft | Handmade or locally contextual projects |
| playful-classroom | Playful classroom | Learning and approachable explanations |
| digital-interface | Digital interface | Technical workflows and software concepts |
| bold-poster | Bold poster | High-impact findings and short statements |
| editorial-collage | Editorial collage | Narrative and reflective conclusions |
| modern-studio | Modern studio | Professional product and research presentations |
| bold-pop | Bold pop | Events, announcements and creative briefs |
| soft-digital | Soft digital | Modern product, health and education content |

Run `node framework/render-library.cjs framework/duno-content.yaml modern-studio framework/output-modern-studio` with a new output folder. The command uses the validated canonical content and produces HTML, CSS, and 3840 × 2160 PNGs. Choose any theme ID. It refuses an existing destination to protect earlier work. Titles and text remain editable in the generated HTML; source mappings remain in YAML.

These directions are starting points, not a guarantee that arbitrary content fits. The basic canvas-bounds check is incomplete: it does not reliably detect internal clipping, overlaps, insufficient contrast, or factual errors. Inspect every output, compare factual claims to sources, and revise the layout or split content with author approval. Automated fitting, final quality gates and PPTX packaging are not provided by this library yet. No recurring headers or footers are added.
