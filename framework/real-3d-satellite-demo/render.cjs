const path = require("node:path");
const { pathToFileURL } = require("node:url");
const fs = require("node:fs");
const { chromium } = require("playwright");

(async () => {
  const dir = __dirname;
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 2
    });
    await page.goto(pathToFileURL(path.join(dir, "index.html")).href, { waitUntil: "load" });
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map(image => image.decode()));
    });
    const audit = await page.evaluate(() => {
      const slide = document.querySelector(".slide").getBoundingClientRect();
      const out = [...document.querySelectorAll(".critical")].filter(element => {
        const r = element.getBoundingClientRect();
        return r.left < slide.left || r.top < slide.top || r.right > slide.right || r.bottom > slide.bottom;
      }).map(element => element.textContent.trim());
      const image = document.querySelector(".art");
      return { out, imageLoaded: image.complete && image.naturalWidth > 0, canvas: [slide.width, slide.height] };
    });
    if (audit.out.length || !audit.imageLoaded || audit.canvas[0] !== 1920 || audit.canvas[1] !== 1080) {
      throw new Error("Slide preflight failed: " + JSON.stringify(audit));
    }
    const output = path.join(dir, "satellite-slide-4k.png");
    const bytes = await page.screenshot({ path: output, animations: "disabled", scale: "device" });
    const width = bytes.readUInt32BE(16);
    const height = bytes.readUInt32BE(20);
    if (width !== 3840 || height !== 2160) throw new Error("Expected 3840x2160; got " + width + "x" + height);
    console.log("Rendered " + output + " at " + width + "x" + height);
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
