import { el, rows, cells, resetBlock } from '../../scripts.js';

/* Content shape:
   Row 1 · 1 cell · h2, p=intro
   Row 2+ · 1 cell each · p (two em's: kind · access), h3=title, p=body,
            optional p > a tel:, p > strong=people, p > a=cta link
   Row 2 becomes the "primary" card (wider, with phone strip).
*/
export default function decorate(block) {
  const [headRow, ...cardRows] = rows(block);
  const headCell = cells(headRow)[0];
  const h2 = headCell.querySelector('h2')?.textContent.trim() ?? '';
  const intro = headCell.querySelector('p')?.textContent.trim() ?? '';

  const cards = cardRows.map((row, i) => {
    const cell = cells(row)[0];
    const ems = cell.querySelectorAll('em');
    const kind = ems[0]?.textContent.trim() ?? '';
    const access = ems[1]?.textContent.trim() ?? '';
    const title = cell.querySelector('h3')?.textContent.trim() ?? '';

    const bodyP = [...cell.querySelectorAll('p')].find(
      (p) => !p.querySelector('em')
        && !p.querySelector('strong')
        && !p.querySelector('a'),
    );
    const body = bodyP?.textContent.trim() ?? '';

    const telA = cell.querySelector('a[href^="tel:"]');
    const people = cell.querySelector('strong')?.textContent.trim() ?? '';
    const ctas = [...cell.querySelectorAll('a')].filter((a) => !a.getAttribute('href')?.startsWith('tel:'));
    const cta = ctas[ctas.length - 1];

    return {
      kind,
      access,
      title,
      body,
      phoneHref: telA?.getAttribute('href') ?? '',
      phoneText: telA?.textContent.trim() ?? '',
      people,
      ctaHref: cta?.getAttribute('href') ?? '#',
      ctaText: cta?.textContent.trim() ?? 'Learn more',
      primary: i === 0,
    };
  });

  resetBlock(block, 'services');
  block.id = 'get-help';
  block.dataset.section = 'services';

  const buildCard = (c) => {
    const card = el('a', {
      href: c.ctaHref,
      class: `service-card${c.primary ? ' primary' : ''}`,
    },
      el('div', { class: 'service-meta' },
        el('span', { class: 'kind' }, c.kind),
        el('span', { class: 'access' }, c.access),
      ),
      el('h3', { class: 'service-title' }, c.title),
      el('p', { class: 'service-body' }, c.body),
    );

    if (c.primary && c.phoneHref) {
      card.append(
        el('div', { class: 'phone-strip' },
          el('span', { class: 'l' }, 'Call intake  ·  24 hr Homeless Services Line'),
          el('a', { href: c.phoneHref }, c.phoneText),
        ),
      );
    }

    card.append(
      el('div', { class: 'service-foot' },
        el('span', { class: 'people' }, c.people),
        el('span', { class: 'arrow' }, `${c.ctaText} →`),
      ),
    );

    return card;
  };

  block.append(
    el('div', { class: 'services-inner' },
      el('div', { class: 'services-header' },
        el('h2', {}, h2),
        el('p', {}, intro),
      ),
      el('div', { class: 'services-grid' }, ...cards.map(buildCard)),
    ),
  );
}
