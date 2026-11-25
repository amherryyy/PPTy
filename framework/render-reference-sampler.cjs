const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');
const { parse } = require('./validate.cjs');
const { escape: esc } = require('./composition.cjs');

const samples = [
  { id: 'portrait-opening', slide: 'intro', pattern: 'portraitOpening', direction: 'creator' },
  { id: 'portrait-evidence', slide: 'findings', pattern: 'portraitEvidence', direction: 'creator' },
  { id: 'pastel-opening', slide: 'intro', pattern: 'pastelOpening', direction: 'portfolio' },
  { id: 'pastel-explanation', slide: 'objectives', pattern: 'pastelExplanation', direction: 'portfolio' },
  { id: 'editorial-question', slide: 'problem', pattern: 'editorialQuestion', direction: 'editorial' },
  { id: 'editorial-conclusion', slide: 'conclusion', pattern: 'editorialConclusion', direction: 'editorial' },
  { id: 'science-process', slide: 'workflow', pattern: 'scienceProcess', direction: 'science' },
  { id: 'science-comparison', slide: 'access', pattern: 'scienceComparison', direction: 'science' }
];

const text = (tag, cls, value) => `<${tag} class="${cls}" data-qa="text">${esc(value)}</${tag}>`;
const renderers = {
  portraitOpening: s => `<main class="slide creator creator-opening">
    <div class="creator-halo"></div><div class="creator-frame"></div>
    ${text('h1','creator-title',s.title)}
    ${text('p','creator-deckline',s.blocks[0].text)}
    <img class="creator-person" src="creator-portrait.png" alt="Original illustrative portrait">
    <div class="creator-circles" aria-hidden="true"></div>
  </main>`,
  portraitEvidence: s => `<main class="slide creator creator-evidence">
    <div class="creator-evidence-stripe"></div>
    ${text('h1','evidence-title',s.title)}
    <div class="evidence-grid">${s.blocks.map((b,i)=>`<section class="evidence-item evidence-item-${i+1}"><span class="evidence-number">${String(i+1).padStart(2,'0')}</span>${text('p','evidence-copy',b.text)}</section>`).join('')}</div>
    <div class="creator-disc" aria-hidden="true"></div>
  </main>`,
  pastelOpening: s => `<main class="slide pastel pastel-opening">
    <div class="pastel-sun" aria-hidden="true"></div>
    <img class="pastel-still" src="portfolio-still-life.png" alt="Original abstract still life">
    ${text('h1','pastel-title',s.title)}
    ${text('p','pastel-deckline',s.blocks[0].text)}
    <div class="pastel-line" aria-hidden="true"></div>
  </main>`,
  pastelExplanation: s => `<main class="slide pastel pastel-explanation">
    ${text('h1','pastel-section-title',s.title)}
    <div class="pastel-rail">${s.blocks.map((b,i)=>`<section class="pastel-step"><span class="pastel-index">${String(i+1).padStart(2,'0')}</span>${text('p','pastel-step-copy',b.text)}</section>`).join('')}</div>
    <div class="pastel-shape-one" aria-hidden="true"></div><div class="pastel-shape-two" aria-hidden="true"></div>
  </main>`,
  editorialQuestion: s => `<main class="slide editorial editorial-question">
    <div class="editorial-blue-field"></div>
    ${text('h1','editorial-title',s.title)}
    <img class="editorial-image" src="editorial-crossroads.png" alt="Original conceptual image of a person at diverging paths">
    ${text('p','editorial-question-copy',s.blocks[0].text)}
    <div class="editorial-rule" aria-hidden="true"></div>
  </main>`,
  editorialConclusion: s => `<main class="slide editorial editorial-conclusion">
    <div class="editorial-sideband"></div>
    ${text('h1','editorial-conclusion-title',s.title)}
    <div class="editorial-conclusion-copy">${s.blocks.map((b,i)=>`<section class="editorial-conclusion-item"><span class="editorial-index">${String(i+1).padStart(2,'0')}</span>${text('p','editorial-paragraph',b.text)}</section>`).join('')}</div>
    <div class="editorial-arc" aria-hidden="true"></div>
  </main>`,
  scienceProcess: s => `<main class="slide science science-process">
    <div class="science-mesh" aria-hidden="true"></div>
    ${text('h1','science-title',s.title)}
    <div class="science-sequence">${s.blocks.map((b,i)=>`<section class="science-stage"><span class="science-stage-number">${String(i+1).padStart(2,'0')}</span><div class="science-stage-orb" aria-hidden="true"></div>${text('p','science-stage-copy',b.text)}</section>`).join('')}</div>
  </main>`,
  scienceComparison: s => `<main class="slide science science-comparison">
    <div class="science-mesh" aria-hidden="true"></div>
    ${text('h1','science-title',s.title)}
    <div class="science-rows">${s.blocks.map((b,i)=>`<section class="science-row"><span class="science-row-number">${String(i+1).padStart(2,'0')}</span>${text('p','science-row-copy',b.text)}</section>`).join('')}</div>
    <div class="science-poly" aria-hidden="true"></div>
  </main>`
};

async function main() {
  const [input, out] = process.argv.slice(2);
  if (!input || !out) throw new Error('Usage: node framework/render-reference-sampler.cjs <yaml> <new-output-directory>');
  const model = parse(fs.readFileSync(input, 'utf8'));
  if (fs.existsSync(out)) throw new Error('Output directory exists; choose a new one');
  fs.mkdirSync(out, {recursive:true});
  fs.mkdirSync(path.join(out,'png'));
  fs.copyFileSync(path.join(__dirname,'reference-sampler.css'),path.join(out,'styles.css'));
  const assetDir = path.join(__dirname,'assets','reference-original');
  for (const file of ['creator-portrait.png','portfolio-still-life.png','editorial-crossroads.png']) fs.copyFileSync(path.join(assetDir,file),path.join(out,file));
  const browser = await chromium.launch({headless:true});
  const manifest = [];
  try {
    const page = await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:2});
    for (const [i,item] of samples.entries()) {
      const slide = model.slides.find(s => s.id === item.slide);
      if (!slide) throw new Error('Missing canonical slide: '+item.slide);
      const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(slide.title)}</title><link rel="stylesheet" href="styles.css"></head><body>${renderers[item.pattern](slide)}</body></html>`;
      const name = String(i+1).padStart(2,'0')+'-'+item.id;
      fs.writeFileSync(path.join(out,name+'.html'),html);
      await page.goto(pathToFileURL(path.resolve(out,name+'.html')).href);
      await page.evaluate(() => document.fonts.ready);
      const check = await page.evaluate(() => {
        const slide = document.querySelector('.slide').getBoundingClientRect();
        const nodes = [...document.querySelectorAll('[data-qa="text"]')];
        const outside = nodes.filter(n => {const range=document.createRange();range.selectNodeContents(n);const r=range.getBoundingClientRect();const clipped=getComputedStyle(n).overflow === "hidden" && (n.scrollHeight>n.clientHeight+2||n.scrollWidth>n.clientWidth+2);return r.left<slide.left||r.top<slide.top||r.right>slide.right||r.bottom>slide.bottom||clipped}).map(n=>n.textContent.slice(0,65));
        const overlaps=[];
        for(let a=0;a<nodes.length;a++)for(let b=a+1;b<nodes.length;b++){const x=nodes[a].getBoundingClientRect(),y=nodes[b].getBoundingClientRect();if(x.left<y.right-3&&x.right>y.left+3&&x.top<y.bottom-3&&x.bottom>y.top+3)overlaps.push([a,b])}
        const missing=[...document.images].filter(x=>!x.complete||!x.naturalWidth).length;
        return {outside,overlaps,missing};
      });
      if(check.outside.length||check.overlaps.length||check.missing) throw new Error(name+': '+JSON.stringify(check));
      await page.locator('.slide').screenshot({path:path.join(out,'png',name+'.png'),animations:'disabled'});
      manifest.push({number:i+1,file:name+'.html',png:'png/'+name+'.png',title:slide.title,direction:item.direction,pattern:item.pattern,sourceSlide:slide.id,sources:slide.sources});
    }
    fs.writeFileSync(path.join(out,'slides.json'),JSON.stringify(manifest,null,2));
    const gallery = `<!doctype html><html><head><meta charset="utf-8"><title>Reference sampler</title><style>body{background:#151826;color:#fff;font-family:Arial,sans-serif;margin:30px}h1{font-size:30px}main{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px}figure{margin:0}img{width:100%;display:block}figcaption{padding:10px 0 20px}</style></head><body><h1>Original reference-inspired compositions</h1><main>${manifest.map(x=>`<figure><a href="${x.file}"><img src="${x.png}" alt="${esc(x.title)}"></a><figcaption>${esc(x.direction)} — ${esc(x.pattern)}</figcaption></figure>`).join('')}</main></body></html>`;
    fs.writeFileSync(path.join(out,'index.html'),gallery);
    console.log('Rendered '+manifest.length+' original 3840x2160 slides; bounds, text overlap and assets passed.');
  } finally { await browser.close(); }
}
if(require.main===module)main().catch(e=>{console.error(e);process.exitCode=1});
module.exports={samples,renderers};


