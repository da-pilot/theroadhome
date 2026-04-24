import { el, rows, cells, resetBlock } from '../../scripts.js';

/* Content shape:
   Row 1 · portrait-cell (<img>) | text-cell (em=eyebrow, blockquote,
           ul=attribution items, p > a=read link, p × N=body paragraphs)
*/
export default function decorate(block) {
  const [mainRow] = rows(block);
  const [portraitCell, textCell] = cells(mainRow);

  const img = portraitCell.querySelector('img');
  const imgSrc = img?.getAttribute('src') ?? '';
  const imgAlt = img?.getAttribute('alt') ?? '';

  const eyebrow = textCell.querySelector('em')?.textContent.trim() ?? '';
  const quote = textCell.querySelector('blockquote')?.textContent.trim() ?? '';
  const attrItems = [...textCell.querySelectorAll('ul li')].map((li) => li.textContent.trim());
  const [name = '', program = '', tenure = ''] = attrItems;

  const readLink = textCell.querySelector('a');
  const bodyParas = [...textCell.querySelectorAll('p')]
    .filter((p) => !p.querySelector('em') && !p.querySelector('a'))
    .map((p) => p.textContent.trim());

  resetBlock(block, 'story');
  block.dataset.section = 'story';

  block.append(
    el('div', { class: 'story-inner' },
      el('div', {
        class: 'story-portrait',
        role: 'img',
        'aria-label': imgAlt,
        style: `background-image:url('${imgSrc}');background-size:cover;background-position:center`,
      }),
      el('div', { class: 'story-text' },
        el('p', { class: 'eyebrow', style: 'color:var(--color-signal)' }, eyebrow),
        el('blockquote', {}, quote),
        el('div', { class: 'story-attr' },
          el('strong', {}, name),
          el('span', {}, program),
          el('span', {}, tenure),
          readLink
            ? el('a', {
                href: readLink.getAttribute('href'),
                class: 'read',
              }, `${readLink.textContent.trim()} →`)
            : null,
        ),
        el('div', { class: 'story-body' },
          ...bodyParas.map((t) => el('p', {}, t)),
        ),
      ),
    ),
  );
}
