# Section templates

Open `section-templates/index.html` to browse nine reusable layouts: title, introduction, body, table, diagram, statistics, conclusion, thank you, and section divider. Slide content is placeholder text; replace it with approved content and source mappings. No header or footer is added.

Each HTML file uses `templates.css` and `theme.js`. Select any of the 13 palette IDs in DESIGN-LIBRARY.md by appending `?theme=pop-comic` (for example) to its URL. These options adapt the palette; they do not reproduce every composition in the existing theme library. Edit the HTML to persist changes: contenteditable changes made in the browser are only a temporary preview.

The table uses actual HTML table cells. The diagram uses editable text nodes and arrows. The statistics template has editable labels and placeholder values; to create an honest bar chart, change each bar's `--value` percentage to match the verified data, add the scale and units, and keep source information in the authoring record. Bar widths begin at 0%; no sample results are implied. For other chart or graph types, replace the chart area with a verified visualization and inspect its labels and scale.

The templates are standalone HTML/CSS examples, not yet integrated into the canonical YAML renderer or PPTX export. Review all output visually and check the slide content and sources before delivery. The automated preview check only checks basic canvas bounds and cannot establish internal overlap, factual correctness, or chart accuracy.
