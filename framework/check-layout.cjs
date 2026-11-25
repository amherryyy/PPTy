#!/usr/bin/env node
// Read-only browser QA for HTML slide decks. It reports likely text fit defects;
// it never edits source files or render outputs.
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');

const MIN_FONT_PX = 24;

function findSlides(dir) {
  const files = fs.readdirSync(dir);
  const numbered = files.filter(f => /^\d{2,}(?:-[\w.-]+)?\.html$/i.test(f)).sort();
  if (numbered.length) return numbered.map(f => path.join(dir, f));
  return files.filter(f => /^slide[-_].+\.html$/i.test(f)).sort().map(f => path.join(dir, f));
}

async function inspectPage(page, file) {
  await page.goto(pathToFileURL(file).href, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  return page.evaluate(({ minFont }) => {
    const slide = document.querySelector('.slide, [data-slide], main') || document.body;
    const slideRect = slide.getBoundingClientRect();
    const visible = el => {
      const s = getComputedStyle(el);
      return s.display !== 'none' && s.visibility !== 'hidden' && Number(s.opacity) !== 0 && !el.closest('[aria-hidden="true"]');
    };
    const directText = el => [...el.childNodes]
      .filter(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim())
      .map(n => n.textContent.trim()).join(' ');
    const round = n => Math.round(n * 10) / 10;
    const entries = [...slide.querySelectorAll('*')].filter(el => visible(el) && directText(el));
    const textItems = entries.map((el, index) => {
      const r = el.getBoundingClientRect();
      const range = document.createRange();
      range.selectNodeContents(el);
      const rr = range.getBoundingClientRect();
      const style = getComputedStyle(el);
      return {
        index, el, text: directText(el).replace(/\s+/g, ' ').slice(0, 100),
        size: parseFloat(style.fontSize),
        box: { left:r.left, top:r.top, right:r.right, bottom:r.bottom, width:r.width, height:r.height },
        textBox: { left:rr.left, top:rr.top, right:rr.right, bottom:rr.bottom, width:rr.width, height:rr.height },
        style
      };
    });
    const issues = [];
    const issueKeys = new Set();
    const record = (severity, code, item, detail, box) => {
      const key = code === 'text-exceeds-clipped-container'
        ? `${severity}|${code}|${detail}`
        : `${severity}|${code}|${item?.text || ''}|${detail}`;
      if (issueKeys.has(key)) return;
      issueKeys.add(key);
      issues.push({
        severity, code, element: item?.el?.tagName?.toLowerCase() || 'slide',
        selector: item?.el?.className?.toString?.() || '', text: item?.text || '',
        detail, box: box ? Object.fromEntries(Object.entries(box).map(([k,v]) => [k, round(v)])) : undefined
      });
    };

    const slideOverflow = slide.scrollWidth > slide.clientWidth + 1 || slide.scrollHeight > slide.clientHeight + 1;
    if (slideOverflow) record('error', 'slide-scroll-overflow', null,
      `slide scroll size ${slide.scrollWidth}×${slide.scrollHeight}; client size ${slide.clientWidth}×${slide.clientHeight}`);

    for (const item of textItems) {
      const b = item.textBox;
      if (item.size < minFont) record('warning', 'below-font-floor', item,
        `${round(item.size)}px computed; minimum is ${minFont}px`, item.box);
      const outsideSlide = b.left < slideRect.left - 2 || b.top < slideRect.top - 2 ||
        b.right > slideRect.right + 2 || b.bottom > slideRect.bottom + 2;
      if (outsideSlide) record('error', 'text-outside-slide', item,
        'text paint extends beyond the slide canvas', b);

      const own = item.box;
      const overOwnBox = b.left < own.left - 2 || b.top < own.top - 2 ||
        b.right > own.right + 2 || b.bottom > own.bottom + 2;
      const clipsOwn = ['hidden', 'clip', 'scroll', 'auto'].some(axis =>
        [item.style.overflow, item.style.overflowX, item.style.overflowY].includes(axis));
      if (overOwnBox && clipsOwn) record('error', 'text-overflows-clipped-element', item,
        'text paint exceeds its own clipped box', b);

      if (clipsOwn && (item.el.scrollWidth > item.el.clientWidth + 2 || item.el.scrollHeight > item.el.clientHeight + 2)) {
        record('error', 'clipped-scroll-content', item,
          `scroll ${item.el.scrollWidth}×${item.el.scrollHeight}; client ${item.el.clientWidth}×${item.el.clientHeight}`, item.box);
      }

      for (let ancestor = item.el.parentElement; ancestor && ancestor !== slide.parentElement; ancestor = ancestor.parentElement) {
        const s = getComputedStyle(ancestor);
        const contentEscapesClip = s.clipPath !== 'none' && ancestor.scrollHeight > ancestor.clientHeight + 2;
        if (contentEscapesClip) record('error', 'text-exceeds-clipped-container', item,
          `content height ${ancestor.scrollHeight}px exceeds ${ancestor.clientHeight}px inside clipped .${ancestor.className || ancestor.tagName.toLowerCase()}`, item.box);
        const clips = ['hidden', 'clip', 'scroll', 'auto'].some(axis =>
          [s.overflow, s.overflowX, s.overflowY].includes(axis)) || s.contain.includes('paint') || s.clipPath !== 'none';
        if (!clips) continue;
        const a = ancestor.getBoundingClientRect();
        const escapes = b.left < a.left - 2 || b.top < a.top - 2 || b.right > a.right + 2 || b.bottom > a.bottom + 2;
        if (escapes) record('error', 'text-escapes-clipping-ancestor', item,
          `text extends beyond clipping ancestor .${ancestor.className || ancestor.tagName.toLowerCase()}`, b);
      }
    }

    // Only compare text-owning elements, avoiding ancestor/descendant duplicates.
    for (let i = 0; i < textItems.length; i++) for (let j = i + 1; j < textItems.length; j++) {
      const a = textItems[i], b = textItems[j];
      if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
      let ancestors = new Set();
      for (let node = a.el.parentElement; node && node !== slide; node = node.parentElement) ancestors.add(node);
      let sharedTransformedContainer = false;
      for (let node = b.el.parentElement; node && node !== slide; node = node.parentElement) {
        if (!ancestors.has(node)) continue;
        const s = getComputedStyle(node);
        if (s.transform !== 'none' || s.clipPath !== 'none') { sharedTransformedContainer = true; break; }
      }
      if (sharedTransformedContainer) continue;
      const x = Math.max(0, Math.min(a.textBox.right, b.textBox.right) - Math.max(a.textBox.left, b.textBox.left));
      const y = Math.max(0, Math.min(a.textBox.bottom, b.textBox.bottom) - Math.max(a.textBox.top, b.textBox.top));
      const area = x * y;
      const smaller = Math.min(a.textBox.width * a.textBox.height, b.textBox.width * b.textBox.height);
      if (x > 24 && y > 24 && area > 12 && smaller > 0 && area / smaller > 0.12) {
        record('warning', 'text-overlap-review', a, `overlaps “${b.text}” by ${round(area)}px²`, {
          left:Math.max(a.textBox.left,b.textBox.left), top:Math.max(a.textBox.top,b.textBox.top),
          right:Math.min(a.textBox.right,b.textBox.right), bottom:Math.min(a.textBox.bottom,b.textBox.bottom)
        });
      }
    }
    return {
      canvas: { width: round(slideRect.width), height: round(slideRect.height) },
      textElements: textItems.length,
      issues
    };
  }, { minFont: MIN_FONT_PX });
}

async function main() {
  const dir = process.argv[2];
  if (!dir || !fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    console.error('Usage: node framework/check-layout.cjs <directory-of-numbered-slide-html>');
    process.exitCode = 2;
    return;
  }
  const files = findSlides(path.resolve(dir));
  if (!files.length) throw new Error('No numbered slide HTML files found. Expected 01.html, 02.html, ...');
  const browser = await chromium.launch({ headless: true });
  const results = [];
  try {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    for (const file of files) results.push({ file: path.basename(file), ...(await inspectPage(page, file)) });
  } finally { await browser.close(); }

  let errors = 0, warnings = 0;
  for (const slide of results) {
    errors += slide.issues.filter(x => x.severity === 'error').length;
    warnings += slide.issues.filter(x => x.severity === 'warning').length;
    console.log(`\n${slide.file}  ${slide.canvas.width}×${slide.canvas.height}  ${slide.textElements} text elements`);
    if (!slide.issues.length) console.log('  PASS: no measured text-fit issues');
    for (const issue of slide.issues) {
      const mark = issue.severity === 'error' ? 'ERROR' : 'REVIEW';
      console.log(`  ${mark} ${issue.code}: ${issue.text ? `“${issue.text}” — ` : ''}${issue.detail}`);
    }
  }
  console.log(`\nSummary: ${files.length} slides; ${errors} errors; ${warnings} review items; ${MIN_FONT_PX}px minimum.`);
  if (errors) process.exitCode = 1;
}

if (require.main === module) main().catch(error => { console.error(error); process.exitCode = 1; });
module.exports = { MIN_FONT_PX, findSlides, inspectPage };
