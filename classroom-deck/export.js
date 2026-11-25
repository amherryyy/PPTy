const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const root = __dirname;
const slides = [
  '01-cover', '02-project-overview', '03-problem-solved', '04-core-functionalities',
  '05-student-workflow', '06-key-functionalities', '07-auth-search-reports-dashboard',
  '08-database-design', '09-hosted-demo', '10-challenges', '11-future-enhancements',
  '12-verification-photo-ops', '13-conclusion', '14-thank-you',
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const output = path.join(root, 'output', 'png');
    fs.mkdirSync(output, { recursive: true });
    for (let i = 0; i < slides.length; i++) {
      const name = slides[i];
      await page.goto('file://' + path.join(root, 'slides', `${name}.html`).replace(/\\/g, '/'), { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => [...document.images].every((img) => img.complete && img.naturalWidth > 0));
      const canvas = await page.locator('.slide').boundingBox();
      if (!canvas || canvas.width !== 1920 || canvas.height !== 1080) throw new Error(`${name}: slide canvas is not 1920x1080`);
      await page.locator('.slide').screenshot({ path: path.join(output, `${name}.png`), animations: 'disabled' });
      console.log(`Rendered ${String(i + 1).padStart(2, '0')}: ${name}.png`);
    }
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exit(1); });
