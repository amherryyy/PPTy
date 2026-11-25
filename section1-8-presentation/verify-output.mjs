import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { inflateRawSync } from 'node:zlib';
import { chromium } from 'playwright';
const root=path.dirname(fileURLToPath(import.meta.url));
const output=path.join(root,'output');
const pngDir=path.join(output,'png');
const pptxPath=path.join(output,'Duno-System-Fundamentals-18-Slides.pptx');
const crcTable=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=(c&1)?(0xEDB88320^(c>>>1)):(c>>>1);crcTable[n]=c>>>0;}
const crc32=b=>{let c=0xFFFFFFFF;for(const v of b)c=crcTable[(c^v)&255]^(c>>>8);return(c^0xFFFFFFFF)>>>0;};
const zip=fs.readFileSync(pptxPath);let eocd=-1;for(let i=zip.length-22;i>=Math.max(0,zip.length-65558);i--)if(zip.readUInt32LE(i)===0x06054b50){eocd=i;break;}
if(eocd<0)throw new Error('PPTX ZIP directory not found');
const total=zip.readUInt16LE(eocd+10);let at=zip.readUInt32LE(eocd+16);const extracted=new Map();
for(let i=0;i<total;i++){if(zip.readUInt32LE(at)!==0x02014b50)throw new Error(`Invalid ZIP directory entry ${i}`);const method=zip.readUInt16LE(at+10),crc=zip.readUInt32LE(at+16),compressedSize=zip.readUInt32LE(at+20),size=zip.readUInt32LE(at+24),nl=zip.readUInt16LE(at+28),el=zip.readUInt16LE(at+30),cl=zip.readUInt16LE(at+32),localOffset=zip.readUInt32LE(at+42),name=zip.subarray(at+46,at+46+nl).toString('utf8');const localName=zip.readUInt16LE(localOffset+26),localExtra=zip.readUInt16LE(localOffset+28),start=localOffset+30+localName+localExtra,compressed=zip.subarray(start,start+compressedSize);const data=method===8?inflateRawSync(compressed):compressed;if(data.length!==size||crc32(data)!==crc)throw new Error(`PPTX entry checksum failed: ${name}`);extracted.set(name,data);at+=46+nl+el+cl;}
const pngFiles=fs.readdirSync(pngDir).filter(n=>n.endsWith('.png'));
const wrongPng=pngFiles.filter(n=>{const b=fs.readFileSync(path.join(pngDir,n));return b.readUInt32BE(16)!==1920||b.readUInt32BE(20)!==1080;});
const embedded=[...extracted.keys()].filter(n=>/^ppt\/media\/image\d+\.png$/.test(n));
const xmlFiles=[...extracted].filter(([n])=>n.endsWith('.xml')||n.endsWith('.rels')).map(([,b])=>b.toString('utf8'));
const browser=await chromium.launch({headless:true});const page=await browser.newPage();const badXml=await page.evaluate(items=>items.map((s,i)=>new DOMParser().parseFromString(s,'application/xml').querySelector('parsererror')?i:-1).filter(i=>i>=0),xmlFiles);await browser.close();
const result={slides:pngFiles.length,pngDimensions:'1920x1080',pptxParts:total,embeddedSlideImages:embedded.length,xmlParts:xmlFiles.length,wrongPng,invalidXmlPartIndexes:badXml,pptxBytes:zip.length};
console.log(JSON.stringify(result,null,2));
if(pngFiles.length!==18||wrongPng.length||embedded.length!==18||badXml.length)process.exitCode=1;
