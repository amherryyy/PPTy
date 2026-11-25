import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const pptxgen = require('pptxgenjs');
async function main() {
const root = path.dirname(fileURLToPath(import.meta.url));
const manifest = JSON.parse(fs.readFileSync(path.join(root,'slides.json'),'utf8'));
const outPng = path.join(root,'output','png');
const outDir = path.join(root,'output','pptx');
fs.mkdirSync(outPng,{recursive:true}); fs.mkdirSync(outDir,{recursive:true});
const output = path.join(outDir,'Duno-Final-Presentation-v4.pptx');
if (fs.existsSync(output)) throw new Error('Output already exists; refusing to overwrite.');
const notesPages = [1,'1–2','3','4–5','6–7','7–9','10–13','14','15–20','20–30','34–35','36–37','37–39','40–41','41–42','42–44','44–47','47–48'];
const pptx = new pptxgen(); pptx.layout='LAYOUT_WIDE'; pptx.author='Duno Project Team'; pptx.subject='Duno final project presentation based on the submitted report'; pptx.title='Duno: A Personalized Study Planning, Tracking, and Academic Analytics Application'; pptx.lang='en-PH'; pptx.theme={headFontFace:'Aptos Display',bodyFontFace:'Aptos',lang:'en-PH'};
const browser = await chromium.launch({headless:true});
try {
 const page=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:2});
 for (let i=0;i<manifest.length;i++) {
  const item=manifest[i], file=path.join(root,'slides',item.file);
  await page.goto(pathToFileURL(file).href,{waitUntil:'load'}); await page.evaluate(()=>document.fonts.ready);
  await page.evaluate(()=>document.querySelectorAll('.slide *').forEach(e=>{if(e.children.length===0&&e.textContent.trim()&&getComputedStyle(e).display!=='none'&&parseFloat(getComputedStyle(e).fontSize)<24)e.style.setProperty('font-size','24px','important')}));
  const audit=await page.evaluate(()=>{
   const slide=document.querySelector('.slide'); const sr=slide.getBoundingClientRect();
   const img=[...slide.querySelectorAll('img')].map(x=>({alt:x.alt,ok:x.complete&&x.naturalWidth>0}));
   const texts=[...slide.querySelectorAll('h1,h2,h3,p,span,b,strong,li,small')].filter(e=>e.children.length===0&&e.textContent.trim()&&getComputedStyle(e).display!=='none').map(e=>({text:e.innerText||e.textContent,font:parseFloat(getComputedStyle(e).fontSize),box:(()=>{let r=e.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom}})()}));
   const outside=texts.filter(t=>t.box.x<sr.x-2||t.box.y<sr.y-2||t.box.right>sr.right+2||t.box.bottom>sr.bottom+2);
   return {size:[sr.width,sr.height],images:img,small:texts.filter(t=>t.font<24),outside};
  });
  const badImages=audit.images.filter(x=>!x.ok); if(badImages.length) throw new Error(item.file+': missing asset '+JSON.stringify(badImages));
  if(audit.size[0]!==1920||audit.size[1]!==1080) throw new Error(item.file+': wrong slide viewport '+audit.size);
  if(audit.small.length) console.warn('READABILITY REVIEW '+item.file+': '+audit.small.length+' visible text item(s) below 24px; '+audit.small.map(x=>Math.round(x.font)+'px '+x.text.slice(0,28)).join(' | '));
  if(audit.outside.length) console.warn('BOUNDS REVIEW '+item.file+': '+audit.outside.length+' text item(s) outside slide bounds');
  const png=path.join(outPng,String(item.number).padStart(2,'0')+'.png'); await page.locator('.slide').screenshot({path:png,animations:'disabled'});
  const slide=pptx.addSlide(); slide.addImage({path:png,x:0,y:0,w:40/3,h:7.5});
  const editable=await page.evaluate(()=>[...document.querySelectorAll('.slide h1,.slide p')].filter(e=>e.innerText.trim()&&getComputedStyle(e).display!=='none').map(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return{text:e.innerText.replace(/\s+/g,' ').trim(),x:r.x,y:r.y,w:r.width,h:r.height,size:parseFloat(s.fontSize),color:s.color.replace(/[^0-9,]/g,'').split(',').slice(0,3).map(v=>Number(v).toString(16).padStart(2,'0')).join('').toUpperCase(),font:s.fontFamily.split(',')[0].replace(/["']/g,''),bold:Number(s.fontWeight)>=600,align:s.textAlign,lineHeight:parseFloat(s.lineHeight)}}));
  for(const t of editable){ if(t.size<24) continue; slide.addText(t.text,{x:t.x/144,y:t.y/144,w:t.w/144,h:t.h/144,fontFace:t.font,fontSize:t.size/2,color:t.color,bold:t.bold,align:['left','center','right','justify'].includes(t.align)?t.align:'left',valign:'top',margin:0,breakLine:false,fit:'none',lineSpacingMultiple:t.lineHeight/t.size}); }
  const bodyNotes=Array.isArray(item.source)?item.source.join('; '):item.source;
  slide.addNotes('Source: Duno Final PDF.pdf, PDF page(s) '+notesPages[i]+'. Supporting report location: '+bodyNotes+'. Full project report is the authority for detailed methods, data definitions, and limitations.');
 }
} finally { await browser.close(); }
await pptx.writeFile({fileName:output});
console.log('Rendered '+manifest.length+' slides at 3840×2160 and packaged hybrid PPTX: '+output);


}
main().catch(e=>{console.error(e.stack||e.message);process.exitCode=1});






