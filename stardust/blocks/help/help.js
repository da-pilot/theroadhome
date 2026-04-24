import { el, rows, cells, resetBlock } from '../../scripts.js';

/* Content shape:
   Row 1 · 1 cell · h2, p=intro
   Row 2 · 1 cell · h3=title, p=body, p > strong=metric-n + em=metric-l, p > a=cta
   Row 3+ · 1 cell each · h3=title, p=desc, p > a=cta (labelled "02", "03", …)
*/
export default function decorate(block) {
  const [headRow, giveRow, ...secondaryRows] = rows(block);

  const headCell = cells(headRow)[0];
  const h2 = headCell.querySelector('h2')?.textContent.trim() ?? '';
  const intro = headCell.querySelector('p')?.textContent.trim() ?? '';

  const giveCell = cells(giveRow)[0];
  const giveTitle = giveCell.querySelector('h3')?.textContent.trim() ?? '';
  const giveBody = [...giveCell.querySelectorAll('p')]
    .find((p) => !p.querySelector('strong') && !p.querySelector('em') && !p.querySelector('a'))
    ?.textContent.trim() ?? '';
  const metricN = giveCell.querySelector('strong')?.textContent.trim() ?? '';
  const metricL = giveCell.querySelector('em')?.textContent.trim() ?? '';
  const giveCta = giveCell.querySelector('a');

  const secondary = secondaryRows.map((row, i) => {
    const cell = cells(row)[0];
    const title = cell.querySelector('h3')?.textContent.trim() ?? '';
    const desc = [...cell.querySelectorAll('p')]
      .find((p) => !p.querySelector('a'))
      ?.textContent.trim() ?? '';
    const a = cell.querySelector('a');
    return {
      code: String(i + 2).padStart(2, '0'),
      title,
      desc,
      href: a?.getAttribute('href') ?? '#',
    };
  });

  resetBlock(block, 'help');
  block.id = 'give';
  block.dataset.section = 'help';

  block.append(
    el('div', { class: 'help-inner' },
      el('div', { class: 'help-head' },
        el('h2', {}, h2),
        el('p', {}, intro),
      ),
      el('a', {
        href: giveCta?.getAttribute('href') ?? '#',
        class: 'help-give',
      },
        el('span', { class: 'code' }, '01 · Primary'),
        el('div', { class: 'body' },
          el('h3', {}, giveTitle),
          el('p', {}, giveBody),
        ),
        el('div', { class: 'metric' },
          el('strong', {}, metricN),
          metricL,
        ),
        el('span', { class: 'cta' }, `${giveCta?.textContent.trim() ?? 'Donate'} →`),
      ),
      el('div', { class: 'help-secondary' },
        ...secondary.map((s) =>
          el('a', { href: s.href, class: 'help-row' },
            el('span', { class: 'code' }, s.code),
            el('div', { class: 'body' },
              el('div', { class: 'title' }, s.title),
              el('div', { class: 'desc' }, s.desc),
            ),
            el('span', { class: 'arrow' }, '→'),
          ),
        ),
      ),
    ),
  );
}
