import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
const fixedRoot = path.dirname(fileURLToPath(import.meta.url));
const manifest = JSON.parse(fs.readFileSync(path.join(fixedRoot,'slides.json'),'utf8'));
const out = path.join(fixedRoot,'output','png');
fs.mkdirSync(out,{recursive:true});
const browser = await chromium.launch({headless:true});
const page = await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});
const audits=[];
for (const s of manifest) {
  const file = path.join(fixedRoot,'slides',s.file);
  await page.goto(pathToFileURL(file).href,{waitUntil:'load'});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(100);
  const imageAudit = await page.locator('img').evaluateAll(imgs=>imgs.map(i=>({src:i.getAttribute('src'),loaded:i.complete&&i.naturalWidth>0,width:i.naturalWidth,height:i.naturalHeight})));
  const layout = await page.evaluate(()=>{const s=document.querySelector('.slide').getBoundingClientRect();const outside=[...document.querySelectorAll('h1,h2,h3,p,span,b,small,li')].map(e=>({tag:e.tagName,text:(e.textContent||'').trim().slice(0,50),r:e.getBoundingClientRect()})).filter(x=>x.text&&(x.r.left<s.left-1||x.r.top<s.top-1||x.r.right>s.right+1||x.r.bottom>s.bottom+1)).map(x=>({tag:x.tag,text:x.text,left:Math.round(x.r.left),top:Math.round(x.r.top),right:Math.round(x.r.right),bottom:Math.round(x.r.bottom)}));return{width:s.width,height:s.height,outsideText:outside}});
  await page.screenshot({path:path.join(out,s.file.replace('.html','.png')),type:'png'});
  audits.push({number:s.number,title:s.title,dimensions:[layout.width,layout.height],outsideText:layout.outsideText,images:imageAudit});
}
const contactHtml=`<!doctype html><html><head><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;background:#F3F1F8;font-family:Segoe UI,Arial,sans-serif;padding:22px}.grid{display:grid;grid-template-columns:repeat(6,1fr);gap:14px}.item{background:white;border:1px solid #e1deec;border-radius:12px;overflow:hidden;box-shadow:0 5px 14px #30275f12}.item img{display:block;width:100%;aspect-ratio:16/9;object-fit:cover}.item p{margin:0;padding:7px 10px;font-weight:700;color:#514878;font-size:13px}</style></head><body><div class="grid">${manifest.map(s=>`<div class="item"><img src="${pathToFileURL(path.join(out,s.file.replace('.html','.png'))).href}"><p>${String(s.number).padStart(2,'0')} · ${s.title.replaceAll('&','&amp;').replaceAll('<','&lt;')}</p></div>`).join('')}</div></body></html>`;
const contactFile=path.join(fixedRoot,'output','contact-sheet.html');fs.writeFileSync(contactFile,contactHtml);
await page.goto(pathToFileURL(contactFile).href,{waitUntil:'load'});await page.waitForTimeout(300);
await page.locator('.grid').screenshot({path:path.join(fixedRoot,'output','Duno-18-slide-contact-sheet.png'),type:'png'});
fs.writeFileSync(path.join(fixedRoot,'output','render-audit.json'),JSON.stringify(audits,null,2));
await browser.close();
console.log(`Rendered ${manifest.length} slides at 1920x1080. Contact sheet: ${path.join(fixedRoot,'output','Duno-18-slide-contact-sheet.png')}`);
