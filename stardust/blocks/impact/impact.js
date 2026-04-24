import { el, rows, cells, resetBlock } from '../../scripts.js';

/* Content shape:
   Row 1 · 1 cell · h2, p=intro
   Row 2 · 2 cells · big-cell (strong=n, p=caption) | side-cell (N paragraphs)
   Row 3 · 4 cells · each: strong=n, p=label, p > em=sublabel
*/
export default function decorate(block) {
  const [headRow, heroRow, statsRow] = rows(block);

  const headCell = cells(headRow)[0];
  const h2 = headCell.querySelector('h2')?.textContent.trim() ?? '';
  const intro = headCell.querySelector('p')?.textContent.trim() ?? '';

  const [bigCell, sideCell] = cells(heroRow);
  const bigN = bigCell.querySelector('strong')?.textContent.trim() ?? '';
  const bigL = [...bigCell.querySelectorAll('p')]
    .map((p) => p.textContent.trim())
    .find((t) => t && t !== bigN) ?? '';
  const sideParas = [...sideCell.querySelectorAll('p')].map((p) => p.textContent.trim()).filter(Boolean);

  const stats = cells(statsRow).map((c) => {
    const n = c.querySelector('strong')?.textContent.trim() ?? '';
    const s = c.querySelector('em')?.textContent.trim() ?? '';
    const l = [...c.querySelectorAll('p')]
      .map((p) => p.textContent.trim())
      .find((t) => t && t !== n && t !== s) ?? '';
    return { n, l, s };
  });

  resetBlock(block, 'impact');
  block.id = 'impact';
  block.dataset.section = 'impact';

  block.append(
    el('div', { class: 'impact-inner' },
      el('div', { class: 'impact-head' },
        el('h2', {}, h2),
        el('p', {}, intro),
      ),
      el('div', { class: 'impact-hero' },
        el('div', { class: 'impact-big' },
          bigN,
          el('small', {}, bigL),
        ),
        el('div', { class: 'impact-side' },
          ...sideParas.map((t) => el('p', {}, t)),
        ),
      ),
      el('div', { class: 'impact-stats' },
        ...stats.map((s) =>
          el('div', { class: 'impact-stat' },
            el('div', { class: 'n' }, s.n),
            el('div', { class: 'l' }, s.l),
            el('div', { class: 's' }, s.s),
          ),
        ),
      ),
    ),
  );
}
