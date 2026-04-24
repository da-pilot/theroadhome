import { el, rows, cells, resetBlock } from '../../scripts.js';

/* Content shape:
   Row 1 · 1 cell with em=eyebrow, h2=heading
   Row 2 · N cells; each cell has em=label, p=description, p > a=phone link
*/
export default function decorate(block) {
  const [labelRow, lanesRow] = rows(block);
  const labelCell = cells(labelRow)[0];
  const eyebrow = labelCell.querySelector('em')?.textContent.trim() ?? '';
  const heading = labelCell.querySelector('h2')?.textContent.trim() ?? '';

  const lanes = cells(lanesRow).map((cell) => {
    const label = cell.querySelector('em')?.textContent.trim() ?? '';
    const desc = [...cell.querySelectorAll('p')].find((p) => !p.querySelector('em') && !p.querySelector('a'))?.textContent.trim() ?? '';
    const link = cell.querySelector('a');
    return {
      label,
      desc,
      href: link?.getAttribute('href') ?? '#',
      num: link?.textContent.trim() ?? '',
    };
  });

  resetBlock(block, 'triage');
  block.dataset.section = 'triage';

  block.append(
    el('div', { class: 'triage-inner' },
      el('div', { class: 'triage-label' },
        el('p', { class: 'eyebrow' }, eyebrow),
        el('h2', {}, heading),
      ),
      el('div', { class: 'triage-lanes' },
        ...lanes.map((l) =>
          el('a', { href: l.href, class: 'triage-lane' },
            el('span', { class: 'lane-label' }, l.label),
            el('span', { class: 'lane-title' }, l.desc),
            el('span', { class: 'lane-num' }, l.num),
          ),
        ),
      ),
    ),
  );
}
