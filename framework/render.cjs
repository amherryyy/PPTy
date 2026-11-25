const fs = require('node:fs');
const path = require('node:path');
const { parse } = require('./validate.cjs');
const { chromium } = require('playwright');
const escape = s => String(s).replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const renderers = {
  'opening-context': (s, b) => `<section class="opening"><h1>${escape(s.title)}</h1><div class="rule"></div>${b}</section>`,
  'key-statement': (s, b) => `<div class="slide-title"><h1>${escape(s.title)}</h1></div><section class="statement">${b}</section>`,
  'structured-explanation': (s, b) => `<div class="slide-title"><h1>${escape(s.title)}</h1></div><section class="structured">${b}</section>`,
  'comparison-evaluation': (s, b) => `<div class="slide-title"><h1>${escape(s.title)}</h1></div><section class="comparison">${b}</section>`,
  'process-evidence': (s, b) => `<div class="slide-title"><h1>${escape(s.title)}</h1></div><section class="process">${b}</section>`,
  'synthesis-conclusion': (s, b) => `<div class="slide-title"><h1>${escape(s.title)}</h1></div><section class="conclusion">${b}</section>`
};
async function main() {
  const file = process.argv[2], out = process.argv[3];
  if (!file || !out) throw Error('Usage: node framework/render.cjs <presentation.yaml> <new-output-directory>');
  const model = parse(fs.readFileSync(file, 'utf8'));
  if (fs.existsSync(out)) throw Error('Output directory already exists; choose a new directory.');
  fs.mkdirSync(out, { recursive: true });
  const css = fs.readFileSync(path.join(__dirname, 'design.css'), 'utf8').replace(/^\uFEFF/, '');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 });
  let failed = false;
  try {
    for (const [index, s] of model.slides.entries()) {
      const blocks = s.blocks.map((b, i) => `<div class="block"><span class="number">${String(i + 1).padStart(2, '0')}</span><p>${escape(b.text)}</p></div>`).join('');
      const family = s.layout || s.purpose;
      const body = renderers[family](s, blocks);
      await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body><main class="slide">${body}</main></body></html>`, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      const audit = await page.evaluate(() => {
        const slide = document.querySelector('.slide').getBoundingClientRect();
        return [...document.querySelectorAll('h1,p,footer,.eyebrow')].filter(e => { const r=e.getBoundingClientRect(); return r.left<slide.left || r.top<slide.top || r.right>slide.right || r.bottom>slide.bottom; }).map(e=>e.textContent.slice(0,80));
      });
      if (audit.length) { failed = true; console.error(`${s.id}: overflow detected: ${audit.join('; ')}`); continue; }
      await page.locator('.slide').screenshot({ path: path.join(out, `${String(index+1).padStart(2,'0')}-${s.id}.png`), animations: 'disabled' });
    }
  } finally { await browser.close(); }
  if (failed) throw Error('Critical overflow detected; render incomplete.');
  console.log(`Rendered ${model.slides.length} slides. Human visual and factual review is still required.`);
}
main().catch(e => { console.error(e.message); process.exitCode = 1; });


