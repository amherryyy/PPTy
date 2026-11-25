const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const root = __dirname;
const slideFiles = [
 ['01-cover.html','01-cover.png'],['02-project-overview.html','02-project-overview.png'],
 ['03-problem-context.html','03-problem-context.png'],['04-project-objectives.html','04-project-objectives.png'],
 ['05-system-architecture.html','05-system-architecture.png'],['06-authentication-and-access.html','06-authentication-and-access.png'],
 ['07-student-data-crud.html','07-student-data-crud.png'],['08-core-study-features.html','08-core-study-features.png'],
 ['09-relational-database-design.html','09-relational-database-design.png'],['10-responsive-interface.html','10-responsive-interface.png'],
 ['11-deployment.html','11-hosted-demo.png'],['12-challenges-and-next-steps.html','12-challenges-and-next-steps.png'],
 ['13-means-of-verification.html','13-photo-documentation.png'],['14-closing.html','14-closing.png']
];
(async()=>{
 const browser=await chromium.launch({headless:true});
 try {
  const page=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});
  await page.emulateMedia({reducedMotion:'reduce'});
  const out=path.join(root,'output','proposal-aligned','png');fs.mkdirSync(out,{recursive:true});
  const thumbs=[];
  for(let i=0;i<slideFiles.length;i++){
   const [html,png]=slideFiles[i],file=path.join(root,'slides',html);
   await page.goto('file://'+file.replace(/\\/g,'/'),{waitUntil:'load'});
   await page.evaluate(()=>document.fonts.ready);
   await page.locator('.slide').screenshot({path:path.join(out,png),animations:'disabled'});
   thumbs.push({name:png,data:fs.readFileSync(path.join(out,png)).toString('base64')});
   console.log('Rendered '+png);
  }
  const tiles=thumbs.map((x,i)=>'<article><img src="data:image/png;base64,'+x.data+'"><b>'+String(i+1).padStart(2,'0')+' ? '+x.name.replace(/^\\d+-|\\.png$/g,'').replace(/-/g,' ')+'</b></article>').join('');
  await page.setViewportSize({width:2680,height:1800});
  await page.setContent('<!doctype html><html><head><style>*{box-sizing:border-box}body{margin:0;padding:24px;background:#f7f6fc;font-family:Aptos,Segoe UI,system-ui,sans-serif;color:#2e2e3a}.grid{display:grid;grid-template-columns:repeat(4,640px);gap:22px}article{padding:10px;background:white;border:1px solid #e5e2f0;border-radius:15px;box-shadow:0 6px 18px #2f275f0a}img{display:block;width:100%;aspect-ratio:16/9;border-radius:9px}b{display:block;padding:10px 3px 2px;font-size:19px;text-transform:capitalize}</style></head><body><div class="grid">'+tiles+'</div></body></html>');
  await page.evaluate(()=>Promise.all([...document.images].map(i=>i.decode())));
  await page.screenshot({path:path.join(root,'output','proposal-aligned','Contact-Sheet.png'),fullPage:true});
 } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exit(1)});
