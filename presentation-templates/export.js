const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const templates = [
  'T01-title-content', 'T02-two-column-comparison', 'T03-three-feature-cards',
  'T04-four-card-grid', 'T05-screenshot-showcase', 'T06-screenshot-explanation',
  'T07-process-timeline', 'T08-statistics-chart', 'T09-photo-collage', 'T10-section-divider',
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const outputDir = path.join(root, 'output', 'png');
    fs.mkdirSync(outputDir, { recursive: true });
    for (const name of templates) {
      await page.goto(`file://${path.join(root, 'slides', `${name}.html`).replace(/\\/g, '/')}`, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth > 0));
      const canvas = await page.locator('.slide').boundingBox();
      if (!canvas || canvas.width !== 1920 || canvas.height !== 1080) throw new Error(`${name} is not 1920 by 1080`);
      await page.locator('.slide').screenshot({ path: path.join(outputDir, `${name}.png`), animations: 'disabled' });
      console.log(`Rendered ${name}.png`);
    }
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exit(1); });
