import { el, svg, rows, cells, resetBlock } from '../../scripts.js';

const STAR_PATH = 'M12 2.5l2.92 6.07 6.58.68-4.9 4.62 1.36 6.6L12 17.35l-5.96 3.12 1.36-6.6L2.5 9.25l6.58-.68L12 2.5z';

/* Content shape:
   Row 1 · 1 cell · em=eyebrow, h2, p=body, p > a=cta
   Row 2+ · N cells · em=eyebrow, strong=n (★★★★ for stars), p=label, p > small=sublabel
*/
export default function decorate(block) {
  const [headRow, ...tileRows] = rows(block);
  const headCell = cells(headRow)[0];

  const eyebrow = headCell.querySelector('em')?.textContent.trim() ?? '';
  const h2 = headCell.querySelector('h2')?.textContent.trim() ?? '';
  const body = [...headCell.querySelectorAll('p')]
    .find((p) => !p.querySelector('em') && !p.querySelector('a'))
    ?.textContent.trim() ?? '';
  const cta = headCell.querySelector('a');

  const tiles = tileRows.flatMap(cells).map((c) => {
    const eb = c.querySelector('em')?.textContent.trim() ?? '';
    const n = c.querySelector('strong')?.textContent.trim() ?? '';
    const s = c.querySelector('small')?.textContent.trim() ?? '';
    const l = [...c.querySelectorAll('p')]
      .map((p) => p.textContent.trim())
      .find((t) => t && t !== eb && t !== n && t !== s) ?? '';
    return { eb, n, l, s, stars: /★/.test(n) };
  });

  resetBlock(block, 'trust');
  block.id = 'about';

  const buildTile = (t) => {
    const children = [el('p', { class: 'eyebrow' }, t.eb)];
    if (t.stars) {
      const starCount = (t.n.match(/★/g) ?? []).length || 4;
      const starEls = [];
      for (let i = 0; i < starCount; i += 1) {
        starEls.push(svg({ viewBox: '0 0 24 24', 'aria-hidden': 'true' }, `<path d="${STAR_PATH}"/>`));
      }
      children.push(el('div', { class: 'stars', role: 'img', 'aria-label': `${starCount} stars` }, ...starEls));
    } else {
      children.push(el('div', { class: 'n' }, t.n));
    }
    children.push(el('div', { class: 'l' }, t.l));
    children.push(el('div', { class: 's' }, t.s));
    return el('div', { class: 'trust-tile' }, ...children);
  };

  block.append(
    el('div', { class: 'trust-inner' },
      el('div', {},
        el('p', { class: 'eyebrow' }, eyebrow),
        el('h2', {}, h2),
        el('p', {}, body),
        cta
          ? el('a', {
              href: cta.getAttribute('href'),
              class: 'btn-ghost',
            }, `${cta.textContent.trim()} →`)
          : null,
      ),
      el('div', { class: 'trust-grid' }, ...tiles.map(buildTile)),
    ),
  );
}
