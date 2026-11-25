const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const root = __dirname;
const slideFiles = [
  ['01-cover.html', '01-cover.png'],
  ['02-project-overview.html', '02-project-overview.png'],
  ['03-problem-context.html', '03-problem-context.png'],
  ['04-project-objectives.html', '04-project-objectives.png'],
  ['05-system-architecture.html', '05-system-architecture.png'],
  ['06-authentication-and-access.html', '06-authentication-and-access.png'],
  ['07-student-data-crud.html', '07-student-data-crud.png'],
  ['08-core-study-features.html', '08-core-study-features.png'],
  ['09-relational-database-design.html', '09-relational-database-design.png'],
  ['10-responsive-interface.html', '10-responsive-interface.png'],
  ['11-deployment.html', '11-deployment.png'],
  ['12-challenges-and-next-steps.html', '12-challenges-and-next-steps.png'],
  ['13-means-of-verification.html', '13-means-of-verification.png'],
  ['14-closing.html', '14-closing.png'],
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const outDir = path.join(root, 'output', 'final', 'png');
    fs.mkdirSync(outDir, { recursive: true });
    for (const [html, png] of slideFiles) {
      const input = path.join(root, 'slides', html);
      await page.goto('file://' + input.replace(/\\/g, '/'), { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      await page.locator('.slide').screenshot({ path: path.join(outDir, png), animations: 'disabled' });
      console.log(`Rendered ${png}`);
    }
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exit(1); });
