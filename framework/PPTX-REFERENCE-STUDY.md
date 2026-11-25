# PPTX reference study and reusable library notes

## Scope and method

The four source files live in `framework/ppt ins`. Each contains 10 widescreen slides. I exported all 40 to review PNGs with PowerPoint and inspected the contact sheets and representative/full-size slides. Extracted slide text, embedded assets, recurring colors, fonts, and slide size (18,288,000 x 10,287,000 EMU, approximately 16:9) support the visual review.

Source images, words, brand marks, proprietary font files, and exact slide geometry are reference-only. New samples use original project imagery, shared CSS conventions, and the Duno canonical YAML. The rendered PPTX is raster-slide output; its text is editable in the companion HTML, not as native PowerPoint text.

## Slide-by-slide observations

### Black White and Purple Modern Content Creator Presentation

| Slide | Observed composition | Reusable lesson |
|---|---|---|
| 1 | Split text and portrait cover; portfolio label, oversized heading, two proof metrics | Use an image cutout and one or two sourced measures to establish identity and proof. |
| 2 | Bio column paired with portrait contact sheet | A short introduction can share a spread with a purposeful, varied image sequence. |
| 3 | Four service blocks on a single color field | Group related offers with strong hierarchy; keep cards for categories that truly compare. |
| 4 | Three package tiers with different emphasis | Use columns when the reader needs to compare explicit options. State inclusions and pricing only when approved. |
| 5 | Text principles beside a compact product/style image mosaic | Pair a concise visual description with a curated evidence strip. |
| 6 | Case narrative paired with product collage and outcome measures | Separate actions from outcomes; source and contextualize each metric. |
| 7 | Offset product image gallery | Alternate image heights to create rhythm while preserving a clear crop grid. |
| 8 | Portrait/contact sheet of a photo session | Treat a gallery as the main story when images are the evidence. |
| 9 | Two feedback rows with image, quotation, and service labels | Make quotation attribution and source review visible; give the quote visual priority. |
| 10 | Large closing title and portrait/contact panel | Close with a clear invitation or contact route tied to the deck purpose. |

### Blue and Pastel Modern Portfolio Presentation

| Slide | Observed composition | Reusable lesson |
|---|---|---|
| 1 | Oversized condensed title overlaps a cutout portrait on cream | Controlled type-image overlap creates a strong cover; reserve text-safe zones and verify contrast. |
| 2 | Bio copy on left, full-height portrait on right, dot pattern accents | A simple asymmetric split is effective when the image carries the visual weight. |
| 3 | Six skills in staggered numbered ribbons above a six-image strip | Sequential lists can become a wide horizontal rhythm; control spacing and line length. |
| 4 | Three equal, strongly cropped images beneath a large title | Use a triptych to communicate a coherent set or visual range. |
| 5 | Text-led project brief paired with one large image | Keep the image dominant and the description short enough to scan. |
| 6 | Offset group of three project crops paired with right-column copy | Use uneven image sizes to show process, detail, and result without a rigid grid. |
| 7 | Large photo on a dark side panel beside a light text field | A dark image field can anchor an otherwise light project spread. |
| 8 | Three-stage serpentine timeline with alternating alignment | A timeline can take over the slide as a single line drawing; avoid repeated chrome around it. |
| 9 | Portrait beside a large collaboration heading and contact block | Give the next action clear space; keep contact details concise and purposeful. |
| 10 | Oversized condensed thank-you message with geometric marks | A one-message closing can be a complete slide, without a footer or extra copy. |

### Blue Black and White Existentialism Academic Presentation

The reference has compelling conceptual images, large type, blue/white contrast, and question-led storytelling. Many source slides also contain **visible clipping, text collisions, and incomplete words**. Their artistic energy can inform our editorial mode; those defects are not a quality target.

| Slide | Observed composition | Reusable lesson |
|---|---|---|
| 1 | Huge title, central monochrome statue cutout, blue field, brief side descriptors | One symbolic hero image can carry an academic title when it leaves a clear title and subtitle zone. |
| 2 | Question left, two black-and-white image blocks, oversized title near lower edge | Use the question as the reading path; avoid the source's title/body collisions. |
| 3 | Blue field, centered photograph and short text columns | A three-zone editorial spread can stage context, image, and implication. |
| 4 | Large claim beside a wide landscape image, paired takeaway below | Match one strong claim to one piece of visual evidence. |
| 5 | Several large text fragments and two images compete in one field | Reject this crowded treatment; choose one title, one supporting image, and a clear text grid. |
| 6 | Tall monochrome image paired with claim and body copy | A tall evidence crop can anchor a clean two-column explanation. |
| 7 | Oversized segmented words, two image blocks, and central paragraph | Scale contrast is useful; prevent headline fragments from competing with the main point. |
| 8 | Large quotation, central image, two small interpretation blocks | Quotations need an exact approved source and room to breathe. |
| 9 | Image and three ideas under oversized type | The three ideas can become a stepped sequence, but keep all copy in distinct lanes. |
| 10 | Two images flank a centered closing question | Close with an open question only when the presentation purpose supports it. |

### Dark Green and Yellow Geometric Biodiversity Science Academic Presentation

| Slide | Observed composition | Reusable lesson |
|---|---|---|
| 1 | Dark geometric cover with lime dimensional forms and large title | Use a high-contrast hero composition; label any illustrative science artwork as conceptual. |
| 2 | Short overview with a landscape image | Keep an introductory paragraph concise and let the image show relevant context. |
| 3 | Three related environment photographs support a central topic | A triptych can explain connected settings; labels must distinguish the relationships. |
| 4 | Pyramid graphic paired with four trophic-level labels | Use a diagram only when the underlying ordering and labels are verified and readable. |
| 5 | Keystone species explanation paired with a wide nature image | A focal subject and short explanation make the concept immediately legible. |
| 6 | Large recycling motif with compact nutrient-cycle explanation | An iconic diagram can summarize a process; node relationships need accurate labels. |
| 7 | Habitat fragmentation described beside an abstract line field | Abstract visual texture can suggest patterns but must not be mistaken for measured evidence. |
| 8 | Conservation explanation paired with a dimensional form | Use 3D-looking art as emphasis; ground claims in cited text or real diagrams. |
| 9 | Restoration copy and a large dimensional center-stage visual | A single central visual can create a climax; it must support rather than obscure the evidence. |
| 10 | Closing invitation with large dimensional object | End on the practical next step and remove recurring labels that do not help the audience. |

Across this source deck, repeated site/date/title bars and corner footers appear on every slide. Our default library omits recurring headers and footers, as requested.

## Reusable HTML/CSS samples

Eight original Duno samples are in `framework/reference-sampler-review-05`. They use four directions with two compositions each:

- **Creator portrait**: portrait-led introduction and paired evidence.
- **Pastel studio**: image-led title and staggered objective list.
- **Editorial blue**: question with image and a readable conclusion spread.
- **Geometric science**: three-step process and responsibility comparison.

Fresh illustrative assets live in `framework/assets/reference-original`. The fictional portrait and conceptual photography are generated illustrations, not evidence about real Duno participants or outcomes. Duno text remains sourced through the existing YAML. The deck contains eight 3840 x 2160 PNG slides packaged as full-slide images. Companion HTML files retain text for editing.

The renderer checks text bounds, text-to-text overlap, and image loading. These checks do not prove visual quality, factual correctness, source adequacy, PowerPoint compatibility on every machine, or absence of every kind of image/text collision. Human visual and factual review remains required.

## Shared design rules learned

- Use the source deck's *visual principle*, not its slide image: portrait against oversized type; soft palette and deliberate crop; editorial question and symbolic image; geometric diagram field.
- Bind each composition to a semantic purpose. Palette selection alone does not make a layout reusable.
- Protect title-safe, body-safe, image-safe, and source-note zones. Keep main text away from low-contrast image details.
- Prefer a few distinct text groups; do not add labels merely to fill space.
- Use real source-supported metrics and quotations. Decorative circles, ribbons, polygons, and 3D forms are not evidence.
- Retain content meaning and required outline coverage. Use layout changes or author-approved splitting when content does not fit.
- Do not introduce repeating headers, slide numbers, or footers by default.
- Visually inspect all rendered slides at presentation size after any significant CSS change.

## GitHub project references

These repositories provide implementation ideas, not a requirement to replace the current YAML/HTML/CSS stack:

- [Slidev](https://github.com/slidevjs/slidev): themes and layouts as separable concerns.
- [reveal.js](https://github.com/hakimel/reveal.js): browser-native slide composition and theme patterns.
- [Marp Core](https://github.com/marp-team/marp-core): scoped CSS theme authoring.
- [PptxGenJS](https://github.com/gitbrent/PptxGenJS): future native PowerPoint text, shape, table, and chart output.
- [DeckTape](https://github.com/astefanutti/decktape): automated browser presentation capture concepts.

The current prototype retains Playwright PNG output and image-based PPTX packaging. No new runtime dependency is introduced here.

