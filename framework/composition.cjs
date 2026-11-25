const escape = v => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const title = t => `<h1 class="slide-title">${escape(t)}</h1>`;
const blocks = list => list.map((b,i)=>`<div class="content-block"><span class="block-index">${String(i+1).padStart(2,'0')}</span><p>${escape(b.text)}</p></div>`).join('');
const layouts = {
 'opening-context': (s,asset) => `<div class="opening">${title(s.title)}<div class="opening-copy">${blocks(s.blocks)}</div></div>${asset?`<img class="hero-asset" src="${asset}" alt="Abstract blue glass loops">`:''}`,
 'key-statement': s => `${title(s.title)}<div class="statement">${blocks(s.blocks)}</div>`,
 'structured-explanation': s => `${title(s.title)}<div class="rows">${blocks(s.blocks)}</div>`,
 'comparison-evaluation': s => `${title(s.title)}<div class="compare">${blocks(s.blocks)}</div>`,
 'process-evidence': s => `${title(s.title)}<div class="process">${blocks(s.blocks)}</div>`,
 'synthesis-conclusion': s => `${title(s.title)}<div class="conclusion">${blocks(s.blocks)}</div>`
};
function compose(slide,{asset=''}={}){const layout=slide.layout||slide.purpose;if(!layouts[layout])throw new Error('Unknown layout: '+layout);return `<main class="slide layout-${layout}">${layouts[layout](slide,asset)}</main>`}
module.exports={compose,title,blocks,layouts,escape};
