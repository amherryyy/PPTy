# Duno 18-slide presentation QA

## Deliverables

- PowerPoint: `Duno-System-Fundamentals-18-Slides.pptx`
- 18 individual PNG exports in `png/`
- Contact sheet: `Duno-18-slide-contact-sheet.png`
- Editable HTML slide sources in `../slides/`, with shared `../styles.css`
- Rebuild scripts: `../build-deck.mjs`, `../export.mjs`, and `../assemble-pptx.mjs`

## Source and accuracy

The presentation follows the finalized `Duno section 1-6.docx` as the primary source. Figures and sample sizes use its tables, including 38 requirements respondents, 20 student evaluators, 3 IT professional evaluators, 123 PHPUnit tests with 1,393 assertions, 3 Playwright tests, and the latest 12 of 22 manual test cases. The 95 CodeIgniter feature tests are identified as part of the PHPUnit suite, not additional tests.

StudyGuide is described as curated guidance with selected program-outcome links. The slides do not claim it provides personalized or CHED-validated recommendations. The evaluation ratings are presented as respondent perceptions, not proof of complete security or reliability. Duno is not credited with improving academic performance.

The slide 10 schema diagram follows the document's eight core academic tables. An older six-table diagram in the prior presentation workspace was superseded by the finalized document.

## Visual review and export checks

- All 18 slides rendered through Playwright at 1920 × 1080.
- Verified all PNG dimensions, image loading, and text bounds against the slide canvas. No missing images or text outside slide boundaries were detected.
- Reviewed the full contact sheet and individual full-resolution renders, with closer review of Slides 1, 4, and 10–18.
- Checked the PowerPoint package: 18 embedded slide images, 63 package parts, valid XML parts, and verified archive checksums.
- The PowerPoint uses full-slide PNGs. The HTML and CSS remain the editable design source.

## Visual assets

The official logo and actual Duno screens from the finalized document are used. Screenshots include Focus, Plan, Timer, and Aralytics. A profile screenshot containing a test email was excluded. No stock or generated photographs were added.
