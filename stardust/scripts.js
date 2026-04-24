/* stardust / scripts.js
   Entry + inlined DOM helpers. Pipeline (in order):
     1. hydrateChrome()    — move body-chrome HTML (+ <style>/<link>/<meta>)
                             out of the .snowflake <pre><code>, then remove
                             the snowflake block and its section wrapper.
     2. decorateSections() — tag every remaining `main > div` with class="section".
     3. loadBlocks()       — dynamic-import blocks/{name}/{name}.js, call decorate().
   Head is expected to be part of the page already (no runtime fetch).
*/

const KNOWN_BLOCKS = ['hero', 'triage', 'impact', 'services', 'story', 'help', 'trust'];

const blockURL = (name) => new URL(`./blocks/${name}/${name}.js`, import.meta.url).href;

ready(async () => {
  hydrateChrome();
  decorateSections();
  await loadBlocks();
});

function ready(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn, { once: true });
  } else {
    fn();
  }
}

/* ─── 1. Body chrome ───────────────────────────────────────────────── */

function hydrateChrome() {
  const snowflake = document.querySelector('.snowflake');
  if (!snowflake) return;

  const code = snowflake.querySelector('pre code');
  const sectionWrapper = snowflake.parentElement && snowflake.parentElement.tagName === 'DIV'
    && snowflake.parentElement.parentElement && snowflake.parentElement.parentElement.tagName === 'MAIN'
    ? snowflake.parentElement
    : null;

  if (!code) {
    snowflake.remove();
    if (sectionWrapper && sectionWrapper.children.length === 0) sectionWrapper.remove();
    return;
  }

  const tpl = document.createElement('template');
  tpl.innerHTML = code.textContent;
  const src = tpl.content;

  // Head-bound tags (styles, fonts, meta).
  src.querySelectorAll('style, link, meta').forEach((node) => {
    document.head.appendChild(node);
  });

  const main = document.querySelector('main');
  const body = document.body;

  const moveTo = (selector, position) => {
    const node = src.querySelector(selector);
    if (!node) return;
    if (position === 'body-start') body.prepend(node);
    else if (position === 'before-main' && main) main.parentNode.insertBefore(node, main);
    else if (position === 'after-main' && main) main.parentNode.insertBefore(node, main.nextSibling);
  };

  moveTo('.skip-link', 'body-start');
  moveTo('.utility', 'before-main');
  moveTo('.topnav', 'before-main');
  moveTo('.ribbon', 'before-main');
  moveTo('footer', 'after-main');

  snowflake.remove();
  if (sectionWrapper && sectionWrapper.children.length === 0) sectionWrapper.remove();
}

/* ─── 2. Sections ──────────────────────────────────────────────────── */

function decorateSections() {
  const main = document.querySelector('main');
  if (!main) return;
  Array.from(main.children).forEach((child) => {
    if (child.tagName !== 'DIV') return;
    if (child.classList.contains('snowflake')) return;
    child.classList.add('section');
  });
}

/* ─── 3. Blocks ────────────────────────────────────────────────────── */

async function loadBlocks() {
  const jobs = [];
  for (const name of KNOWN_BLOCKS) {
    document.querySelectorAll(`.${name}`).forEach((block) => {
      if (block.dataset.blockStatus === 'loaded') return;
      block.dataset.blockStatus = 'loading';
      jobs.push(decorateBlock(name, block));
    });
  }
  await Promise.allSettled(jobs);
}

async function decorateBlock(name, block) {
  try {
    const mod = await import(blockURL(name));
    if (typeof mod.default !== 'function') {
      console.warn(`[${name}] block module has no default export`);
      return;
    }
    await mod.default(block);
    block.dataset.blockStatus = 'loaded';
  } catch (err) {
    block.dataset.blockStatus = 'error';
    console.error(`[${name}] decoration failed`, err);
  }
}

/* ─── DOM helpers (rolled in from lib/dom.js) ──────────────────────── */

export function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props || {})) {
    if (value === null || value === undefined || value === false) continue;
    if (key === 'class') node.className = value;
    else if (key === 'dataset') Object.assign(node.dataset, value);
    else if (key === 'style' && typeof value === 'object') Object.assign(node.style, value);
    else if (key.startsWith('on') && typeof value === 'function') {
      node.addEventListener(key.slice(2).toLowerCase(), value);
    } else {
      node.setAttribute(key, value);
    }
  }
  appendAll(node, children);
  return node;
}

export function svg(attrs = {}, inner = '') {
  const xmlns = 'http://www.w3.org/2000/svg';
  const node = document.createElementNS(xmlns, 'svg');
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  node.innerHTML = inner;
  return node;
}

export function frag(...children) {
  const f = document.createDocumentFragment();
  appendAll(f, children);
  return f;
}

export const rows = (block) => Array.from(block.children);
export const cells = (row) => Array.from(row.children);

export function resetBlock(block, className) {
  for (const attr of Array.from(block.attributes)) {
    if (attr.name !== 'class') block.removeAttribute(attr.name);
  }
  if (className) block.className = className;
  while (block.firstChild) block.removeChild(block.firstChild);
  return block;
}

function appendAll(parent, children) {
  for (const c of children.flat(Infinity)) {
    if (c === null || c === undefined || c === false) continue;
    parent.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
}
