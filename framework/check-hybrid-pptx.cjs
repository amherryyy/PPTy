// Read-only structural QA for HTML/CSS hybrid PowerPoint exports.
const fs = require('node:fs');
const path = require('node:path').posix;
const { inflateRawSync } = require('node:zlib');

const SIG = { local: 0x04034b50, central: 0x02014b50, end: 0x06054b50 };
const EXPECTED_PNG = [3840, 2160];
const MIN_FONT_HUNDREDTHS_PT = 1200;

function fail(message) { throw new Error(message); }

function makeCrcTable() {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let value = n;
    for (let k = 0; k < 8; k++) value = (value & 1) ? (0xEDB88320 ^ (value >>> 1)) : (value >>> 1);
    table[n] = value >>> 0;
  }
  return table;
}
const CRC_TABLE = makeCrcTable();

function crc32(buffer) {
  let value = 0xFFFFFFFF;
  for (const byte of buffer) value = CRC_TABLE[(value ^ byte) & 255] ^ (value >>> 8);
  return (value ^ 0xFFFFFFFF) >>> 0;
}

function unzip(buffer) {
  const searchStart = Math.max(0, buffer.length - 65557);
  let end = -1;
  for (let offset = buffer.length - 22; offset >= searchStart; offset--) {
    if (buffer.readUInt32LE(offset) === SIG.end && offset + 22 + buffer.readUInt16LE(offset + 20) === buffer.length) {
      end = offset;
      break;
    }
  }
  if (end < 0) fail('ZIP end-of-central-directory record was not found');
  if (buffer.readUInt16LE(end + 4) || buffer.readUInt16LE(end + 6)) fail('Multi-disk ZIP files are unsupported');
  const count = buffer.readUInt16LE(end + 10);
  const centralSize = buffer.readUInt32LE(end + 12);
  const centralOffset = buffer.readUInt32LE(end + 16);
  if (count === 0xFFFF || centralSize === 0xFFFFFFFF || centralOffset === 0xFFFFFFFF) fail('ZIP64 packages are unsupported');
  if (centralOffset + centralSize > end) fail('Central directory extends beyond the ZIP package');

  const files = new Map();
  let cursor = centralOffset;
  for (let index = 0; index < count; index++) {
    if (buffer.readUInt32LE(cursor) !== SIG.central) fail('Invalid central-directory entry at index ' + index);
    const flags = buffer.readUInt16LE(cursor + 8);
    const method = buffer.readUInt16LE(cursor + 10);
    const expectedCrc = buffer.readUInt32LE(cursor + 16);
    const compressedSize = buffer.readUInt32LE(cursor + 20);
    const uncompressedSize = buffer.readUInt32LE(cursor + 24);
    const nameLength = buffer.readUInt16LE(cursor + 28);
    const extraLength = buffer.readUInt16LE(cursor + 30);
    const commentLength = buffer.readUInt16LE(cursor + 32);
    const localOffset = buffer.readUInt32LE(cursor + 42);
    const name = buffer.toString('utf8', cursor + 46, cursor + 46 + nameLength);
    cursor += 46 + nameLength + extraLength + commentLength;

    if (flags & 1) fail('Encrypted ZIP entry is unsupported: ' + name);
    if (buffer.readUInt32LE(localOffset) !== SIG.local) fail('Invalid local file header: ' + name);
    if (buffer.readUInt16LE(localOffset + 8) !== method) fail('ZIP compression method mismatch: ' + name);
    const localNameLength = buffer.readUInt16LE(localOffset + 26);
    const localExtraLength = buffer.readUInt16LE(localOffset + 28);
    const dataStart = localOffset + 30 + localNameLength + localExtraLength;
    const compressed = buffer.subarray(dataStart, dataStart + compressedSize);
    let data;
    if (method === 0) data = Buffer.from(compressed);
    else if (method === 8) data = inflateRawSync(compressed);
    else fail('Unsupported ZIP compression method ' + method + ' in ' + name);
    if (data.length !== uncompressedSize) fail('Uncompressed size mismatch: ' + name);
    if (crc32(data) !== expectedCrc) fail('CRC mismatch: ' + name);
    if (!name.endsWith('/')) files.set(name, data);
  }
  if (cursor !== centralOffset + centralSize) fail('Central-directory size does not match its entries');
  return files;
}

function parseAttributes(fragment) {
  const result = {};
  for (const match of fragment.matchAll(/([A-Za-z][A-Za-z0-9:_-]*)="([^"]*)"/g)) {
    result[match[1]] = match[2].replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&apos;/g, "'");
  }
  return result;
}

function xmlTags(xml, tagName) {
  return [...xml.matchAll(new RegExp('<' + tagName + '\\b([^>]*)/?>', 'g'))].map(match => parseAttributes(match[1]));
}

function resolveRelationshipTarget(ownerPart, target) {
  const cleanTarget = target.split('#')[0].split('?')[0];
  return cleanTarget.startsWith('/') ? path.normalize(cleanTarget.slice(1)) : path.normalize(path.join(path.dirname(ownerPart || '.'), cleanTarget));
}

function validateContentTypes(files) {
  const data = files.get('[Content_Types].xml');
  if (!data) fail('Missing [Content_Types].xml');
  const text = data.toString('utf8');
  const defaults = new Set(xmlTags(text, 'Default').map(item => (item.Extension || '').toLowerCase()));
  const overrides = new Set(xmlTags(text, 'Override').map(item => (item.PartName || '').replace(/^\//, '')));
  for (const name of files.keys()) {
    if (name === '[Content_Types].xml') continue;
    const ext = name.includes('.') ? name.split('.').pop().toLowerCase() : '';
    if (!overrides.has(name) && !defaults.has(ext)) fail('No content type declared for package part: ' + name);
  }
}

function validateRelationships(files) {
  let partsChecked = 0;
  for (const [name, data] of files) {
    if (!name.endsWith('.rels')) continue;
    partsChecked++;
    const owner = name === '_rels/.rels' ? '' : name.replace('/_rels/', '/').replace(/\.rels$/, '');
    for (const attrs of xmlTags(data.toString('utf8'), 'Relationship')) {
      if (!attrs.Target) fail('Relationship without Target in ' + name);
      if (attrs.TargetMode === 'External') continue;
      const target = resolveRelationshipTarget(owner, attrs.Target);
      if (!files.has(target)) fail('Unresolved relationship from ' + name + ' to ' + attrs.Target);
    }
  }
  return partsChecked;
}

function imageSize(buffer, name) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  if (buffer.length < 24 || !buffer.subarray(0, 8).equals(signature) || buffer.toString('ascii', 12, 16) !== 'IHDR') {
    fail('Invalid PNG image part: ' + name);
  }
  return [buffer.readUInt32BE(16), buffer.readUInt32BE(20)];
}

async function validateXmlParts(files) {
  const { chromium } = require('playwright');
  const xmlParts = [...files.keys()].filter(name => name.endsWith('.xml') || name.endsWith('.rels'));
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    for (const name of xmlParts) {
      const xml = files.get(name).toString('utf8');
      const error = await page.evaluate(value => new DOMParser().parseFromString(value, 'application/xml').querySelector('parsererror')?.textContent || '', xml);
      if (error) fail('Malformed XML in ' + name + ': ' + error);
    }
  } finally {
    await browser.close();
  }
  return xmlParts.length;
}
async function main() {
  const input = process.argv[2];
  const expectedSlides = process.argv[3] ? Number(process.argv[3]) : null;
  if (!input) fail('Usage: node framework/check-hybrid-pptx.cjs <presentation.pptx> [expected-slide-count]');
  if (expectedSlides !== null && (!Number.isInteger(expectedSlides) || expectedSlides < 1)) fail('Expected slide count must be a positive integer');
  const files = unzip(fs.readFileSync(input));
  for (const required of ['[Content_Types].xml', '_rels/.rels', 'ppt/presentation.xml', 'ppt/_rels/presentation.xml.rels']) {
    if (!files.has(required)) fail('Missing required package part: ' + required);
  }
  validateContentTypes(files);
  const relationshipParts = validateRelationships(files);
  const xmlPartCount = await validateXmlParts(files);

  const slidePaths = [...files.keys()].filter(name => /^ppt\/slides\/slide\d+\.xml$/.test(name)).sort((a, b) => {
    const left = Number(a.match(/slide(\d+)/)[1]), right = Number(b.match(/slide(\d+)/)[1]);
    return left - right;
  });
  if (!slidePaths.length) fail('No slide XML parts found');
  if (expectedSlides !== null && slidePaths.length !== expectedSlides) fail('Expected ' + expectedSlides + ' slides, found ' + slidePaths.length);

  const presentation = files.get('ppt/presentation.xml').toString('utf8');
  if (xmlTags(presentation, 'p:sldId').length !== slidePaths.length) fail('Presentation slide list does not match slide part count');
  const size = xmlTags(presentation, 'p:sldSz')[0];
  if (!size || !Number(size.cx) || !Number(size.cy)) fail('Presentation slide dimensions are missing');
  if (Math.abs(Number(size.cx) / Number(size.cy) - 16 / 9) > 0.002) fail('Presentation page is not 16:9');

  let textShapes = 0;
  let minFont = Infinity;
  const backgroundImages = [];
  for (const slidePath of slidePaths) {
    const slideXml = files.get(slidePath).toString('utf8');
    const shapes = [...slideXml.matchAll(/<p:sp\b[\s\S]*?<\/p:sp>/g)].map(match => match[0]);
    for (const shape of shapes) {
      if (!/<p:txBody\b/.test(shape) || !/<a:t\b[^>]*>\s*[^<\s]/.test(shape)) continue;
      textShapes++;
      for (const match of shape.matchAll(/<a:rPr\b[^>]*\bsz="(\d+)"/g)) minFont = Math.min(minFont, Number(match[1]));
    }

    const relPath = path.join(path.dirname(slidePath), '_rels', path.basename(slidePath) + '.rels');
    const relData = files.get(relPath);
    if (!relData) fail('Missing slide relationships: ' + relPath);
    const imageTargets = xmlTags(relData.toString('utf8'), 'Relationship')
      .filter(item => (item.Type || '').endsWith('/image') && item.TargetMode !== 'External');
    if (!imageTargets.length) fail('No embedded image background relationship for ' + slidePath);
    for (const relation of imageTargets) {
      const imagePath = resolveRelationshipTarget(slidePath, relation.Target);
      const image = files.get(imagePath);
      if (!image) fail('Missing slide image part: ' + imagePath);
      const dimensions = imageSize(image, imagePath);
      if (dimensions[0] !== EXPECTED_PNG[0] || dimensions[1] !== EXPECTED_PNG[1]) {
        fail('Expected 3840x2160 PNG for ' + slidePath + ', found ' + dimensions.join('x'));
      }
      backgroundImages.push(imagePath);
    }
  }

  if (!textShapes) fail('No editable text shapes found');
  if (minFont === Infinity) fail('Could not find explicit font sizes in editable text');
  if (minFont < MIN_FONT_HUNDREDTHS_PT) fail('Editable text below 12pt (24 CSS px equivalent): ' + (minFont / 100) + 'pt');

  console.log('PPTX structure: PASS');
  console.log('Well-formed XML parts: ' + xmlPartCount);
  console.log('Slides: ' + slidePaths.length + (expectedSlides ? ' (expected ' + expectedSlides + ')' : ''));
  console.log('Embedded 4K PNG backgrounds: ' + backgroundImages.length + ' at 3840x2160');
  console.log('Editable text shapes: ' + textShapes);
  console.log('Minimum explicit text size: ' + (minFont / 100) + 'pt');
  console.log('Internal relationships resolved: ' + relationshipParts + ' relationship parts checked');
}

main().catch(error => {
  console.error('PPTX QA: FAIL - ' + error.message);
  process.exitCode = 1;
});
