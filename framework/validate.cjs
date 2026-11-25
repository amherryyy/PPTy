const fs = require('node:fs');
const YAML = require('yaml');
const families = ['opening-context', 'key-statement', 'structured-explanation', 'comparison-evaluation', 'process-evidence', 'synthesis-conclusion'];
function validate(input) {
  const errors = [];
  if (!input || typeof input !== 'object' || Array.isArray(input)) return ['Presentation must be an object'];
  if (typeof input.title !== 'string' || !input.title.trim()) errors.push('title is required');
  if (!Array.isArray(input.sources)) errors.push('sources must be an array');
  if (!Array.isArray(input.outline)) errors.push('outline must be an array');
  if (!Array.isArray(input.slides) || !input.slides.length) errors.push('slides must be a nonempty array');
  const sourceIds = new Set();
  for (const [i, source] of (Array.isArray(input.sources) ? input.sources : []).entries()) {
    if (!source || typeof source.id !== 'string' || !source.id.trim() || typeof source.location !== 'string' || !source.location.trim() || !Number.isInteger(source.priority)) errors.push(`sources[${i}] requires id, location, and integer priority`);
    else if (sourceIds.has(source.id)) errors.push(`duplicate source id: ${source.id}`);
    else sourceIds.add(source.id);
  }
  const outlineIds = new Set();
  for (const [i, item] of (Array.isArray(input.outline) ? input.outline : []).entries()) {
    if (!item || typeof item.id !== 'string' || !item.id.trim() || typeof item.description !== 'string' || !item.description.trim()) errors.push(`outline[${i}] requires id and description`);
    else if (outlineIds.has(item.id)) errors.push(`duplicate outline id: ${item.id}`);
    else outlineIds.add(item.id);
  }
  const slideIds = new Set(), covered = new Set();
  for (const [i, slide] of (Array.isArray(input.slides) ? input.slides : []).entries()) {
    const at = `slides[${i}]`;
    if (!slide || typeof slide !== 'object') { errors.push(`${at} must be an object`); continue; }
    if (typeof slide.id !== 'string' || !slide.id.trim()) errors.push(`${at}.id is required`);
    else if (slideIds.has(slide.id)) errors.push(`duplicate slide id: ${slide.id}`); else slideIds.add(slide.id);
    if (typeof slide.title !== 'string' || !slide.title.trim()) errors.push(`${at}.title is required`);
    if (!families.includes(slide.purpose)) errors.push(`${at}.purpose must be an approved family`);
    if (slide.layout !== undefined && !families.includes(slide.layout)) errors.push(`${at}.layout must be an approved family`);
    for (const [key, ids, target] of [['sources', sourceIds, null], ['covers', outlineIds, covered]]) {
      if (!Array.isArray(slide[key])) { errors.push(`${at}.${key} must be an array`); continue; }
      for (const id of slide[key]) { if (!ids.has(id)) errors.push(`${at}.${key} references unknown id: ${id}`); else if (target) target.add(id); }
    }
    if (!Array.isArray(slide.blocks) || !slide.blocks.length) errors.push(`${at}.blocks must be a nonempty array`);
    else for (const [j, block] of slide.blocks.entries()) {
      if (!block || typeof block.text !== 'string' || !block.text.trim()) { errors.push(`${at}.blocks[${j}].text is required`); continue; }
      if (block.highRisk === true && (!Array.isArray(block.sources) || !block.sources.length)) errors.push(`${at}.blocks[${j}] requires claim sources`);
      if (block.sources !== undefined && !Array.isArray(block.sources)) errors.push(`${at}.blocks[${j}].sources must be an array`);
      else for (const id of (block.sources || [])) if (!sourceIds.has(id)) errors.push(`${at}.blocks[${j}] references unknown source: ${id}`);
    }
  }
  for (const id of outlineIds) if (!covered.has(id)) errors.push(`uncovered outline item: ${id}`);
  return errors;
}
function parse(text) { const value = YAML.parse(text, { uniqueKeys: true }); const errors = validate(value); if (errors.length) throw new Error(errors.join('\n')); return value; }
if (require.main === module) {
  try { if (!process.argv[2]) throw new Error('Usage: node framework/validate.cjs <presentation.yaml>'); const model = parse(fs.readFileSync(process.argv[2], 'utf8')); process.stdout.write(JSON.stringify(model, null, 2) + '\n'); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
module.exports = { parse, validate, families };
