import { el, rows, cells, resetBlock } from '../../scripts.js';

/* Content shape:
   Row 1 · photo-cell (em=tag, <img>) | copy-cell (em=eyebrow, h1 with <br>, p=sub)
   Row 2 · since-cell (strong=n, p=label) | programs-cell (strong=title, p=list) | housed-cell (strong=n, p=label)
*/
export default function decorate(block) {
  const [photoRow, metaRow] = rows(block);
  const [photoCell, copyCell] = cells(photoRow);

  const img = photoCell.querySelector('img');
  const photoTag = photoCell.querySelector('em')?.textContent.trim() ?? '';

  const eyebrow = copyCell.querySelector('em')?.textContent.trim() ?? '';
  const h1El = copyCell.querySelector('h1');
  const h1Lines = h1El
    ? h1El.innerHTML.split(/<br\s*\/?>/i).map((s) => s.replace(/<[^>]+>/g, '').trim()).filter(Boolean)
    : [];
  const subEl = [...copyCell.querySelectorAll('p')].find((p) => !p.querySelector('em'));
  const sub = subEl?.textContent.trim() ?? '';

  const [sinceCell, programsCell, housedCell] = cells(metaRow);
  const readPair = (cell) => {
    const n = cell.querySelector('strong')?.textContent.trim() ?? '';
    const paras = [...cell.querySelectorAll('p')].map((p) => p.textContent.trim());
    const l = paras.find((t) => t && t !== n) ?? '';
    return { n, l };
  };
  const since = readPair(sinceCell);
  const programs = readPair(programsCell);
  const housed = readPair(housedCell);

  const imgSrc = img?.getAttribute('src') ?? '';
  const imgAlt = img?.getAttribute('alt') ?? '';

  resetBlock(block, 'hero');
  block.dataset.section = 'hero';

  block.append(
    el('div', {
      class: 'hero-photo',
      role: 'img',
      'aria-label': imgAlt,
      style: `background-image:linear-gradient(180deg,rgba(0,0,0,.05),rgba(0,20,25,.25)),url('${imgSrc}');background-size:cover;background-position:center;background-repeat:no-repeat;position:relative`,
    },
      el('span', { class: 'photo-tag' }, photoTag),
    ),
    el('div', { class: 'hero-copy' },
      el('div', {},
        el('p', { class: 'eyebrow' }, eyebrow),
        el('h1', {}, ...h1Lines.map((line) => el('span', {}, line))),
        el('p', { class: 'hero-sub' }, sub),
      ),
      el('div', { class: 'hero-meta' },
        el('span', { class: 'since' }, since.n, el('br'), since.l),
        el('div', {},
          el('strong', {}, programs.n),
          el('span', {}, programs.l),
        ),
        el('div', {},
          el('strong', {}, housed.n),
          el('span', { style: 'font-size:12px' }, housed.l),
        ),
      ),
    ),
  );
}
