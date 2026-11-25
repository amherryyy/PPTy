// Experimental hybrid PPTX export for the canonical YAML presentation model.
// CSS artwork stays rasterized at 4K; titles and copy become native text boxes.
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { chromium } = require('playwright');
const pptxgen = require('pptxgenjs');
const { parse } = require('./validate.cjs');
const { compose } = require('./composition.cjs');

const SW = 1920;
const SH = 1080;
const SLIDE_W = 40 / 3;
const SLIDE_H = 7.5;
const INCHES_PER_CSS_PIXEL = SLIDE_W / SW;

function colorHex(css) {
  const match = css.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  return match ? match.slice(1, 4).map(value => Number(value).toString(16).padStart(2, '0')).join('').toUpperCase() : '13314D';
}

function fontFace(css) {
  return (css.split(',')[0] || 'Aptos').replace(/["']/g, '').trim();
}

function textOptions(text) {
  const cssFontSize = parseFloat(text.fontSize);
  const cssLineHeight = parseFloat(text.lineHeight);
  return {
    x: text.x * INCHES_PER_CSS_PIXEL,
    y: text.y * INCHES_PER_CSS_PIXEL,
    w: text.width * INCHES_PER_CSS_PIXEL,
    h: text.height * INCHES_PER_CSS_PIXEL,
    fontFace: fontFace(text.fontFamily),
    fontSize: cssFontSize * 0.5,
    color: colorHex(text.color),
    bold: Number(text.fontWeight) >= 600,
    align: ['left', 'center', 'right', 'justify'].includes(text.textAlign) ? text.textAlign : 'left',
    valign: 'top',
    margin: 0,
    lineSpacingMultiple: Number.isFinite(cssLineHeight) && cssFontSize ? cssLineHeight / cssFontSize : 1.2,
    fit: 'none',
    wrap: true,
  };
}

async function main() {
  const [input, output] = process.argv.slice(2);
  if (!input || !output) throw Error('Usage: node framework/export-editable-pptx.cjs <presentation.yaml> <new-output.pptx>');
  if (fs.existsSync(output)) throw Error('Output file already exists; choose a new path.');

  const model = parse(fs.readFileSync(input, 'utf8'));
  const css = fs.readFileSync(path.join(__dirname, 'composition.css'), 'utf8') + '\n' +
    fs.readFileSync(path.join(__dirname, 'layout-fit.css'), 'utf8') + '\n*{box-sizing:border-box!important}';
  const assetBytes = fs.readFileSync(path.join(__dirname, 'assets/dimensional/glass-learning-loops.png'));
  const asset = 'data:image/png;base64,' + assetBytes.toString('base64');
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = 'Duno Presentation Framework';
  pptx.subject = 'Hybrid HTML/CSS rendering with editable PowerPoint text';
  pptx.title = model.title;
  pptx.lang = 'en-PH';
  pptx.theme = { headFontFace: 'Aptos Display', bodyFontFace: 'Aptos', lang: 'en-PH' };

  let editableTextCount = 0;
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: SW, height: SH }, deviceScaleFactor: 2 });
    for (const slideModel of model.slides) {
      const html = '<!doctype html><html lang="en"><head><meta charset="utf-8"><style>' + css +
        '</style></head><body>' + compose(slideModel, { asset }) + '</body></html>';
      await page.setContent(html, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);

      const missingAssets = await page.evaluate(() => [...document.images].filter(image => !image.complete || !image.naturalWidth).length);
      if (missingAssets) throw Error(slideModel.id + ': ' + missingAssets + ' visual asset(s) did not load');

      const text = await page.evaluate(() => [...document.querySelectorAll('h1,p,.block-index')].map(element => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return {
          text: element.innerText || element.textContent,
          x: rect.x, y: rect.y, width: rect.width, height: rect.height,
          fontSize: style.fontSize, fontFamily: style.fontFamily,
          fontWeight: style.fontWeight, color: style.color,
          textAlign: style.textAlign, lineHeight: style.lineHeight,
        };
      }).filter(item => item.text.trim()));

      editableTextCount += text.length;
      const belowFloor = text.filter(item => parseFloat(item.fontSize) < 24);
      if (belowFloor.length) throw Error(slideModel.id + ': text below the 24px workspace minimum (' + belowFloor.map(item => item.text.slice(0, 30)).join(', ') + ')');

      await page.addStyleTag({ content: 'h1,p,.block-index{visibility:hidden!important}' });
      const png = await page.locator('.slide').screenshot({ animations: 'disabled' });
      const slide = pptx.addSlide();
      slide.addImage({ data: 'image/png;base64,' + png.toString('base64'), x: 0, y: 0, w: SLIDE_W, h: SLIDE_H });
      for (const item of text) slide.addText(item.text.replace(/\s+/g, ' ').trim(), textOptions(item));
    }
  } finally {
    await browser.close();
  }

  const finalPath = path.resolve(output);
  const directory = path.dirname(finalPath);
  fs.mkdirSync(directory, { recursive: true });
  const tempPath = finalPath.replace(/\.pptx$/i, '') + '.qa-pending-' + process.pid + '.pptx';
  if (fs.existsSync(tempPath)) throw Error('Temporary QA output already exists: ' + tempPath);

  try {
    await pptx.writeFile({ fileName: tempPath });
    execFileSync(process.execPath, [
      path.join(__dirname, 'check-hybrid-pptx.cjs'),
      tempPath,
      String(model.slides.length),
    ], { stdio: 'inherit' });
    fs.renameSync(tempPath, finalPath);
  } catch (error) {
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    throw error;
  }

  console.log('Published ' + finalPath + ' after PPTX QA passed.');
  console.log('Created ' + output + ': ' + model.slides.length + ' slides, 4K visual backgrounds, and ' + editableTextCount + ' editable text boxes.');
  console.log('Prototype limitation: illustrations and CSS artwork remain rasterized; verify text wrapping and font fidelity in PowerPoint before delivery.');
}

main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});