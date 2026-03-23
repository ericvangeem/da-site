/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-article. Base: cards.
 * Source: https://wknd-trendsetters.site/
 * Selectors from captured DOM: .article-card (within .grid-layout.desktop-4-column)
 * Cards block: each row = [image | text content]
 */
export default function parse(element, { document }) {
  // Find parent grid container to collect all sibling cards
  const parent = element.closest('.grid-layout') || element.parentElement;
  // Guard: element may be detached if already processed by a sibling call
  if (!parent) return;
  const cards = Array.from(parent.querySelectorAll(':scope > .article-card, :scope > a.card-link'));

  // If no cards found (already processed), skip
  if (cards.length === 0) return;

  const cells = [];

  cards.forEach((card) => {
    // Image (found: .article-card-image img.cover-image)
    const img = card.querySelector('.article-card-image img.cover-image, img');

    // Text content
    const contentDiv = document.createElement('div');

    // Category tag (found: span.tag)
    const tag = card.querySelector('.tag');
    if (tag) {
      const tagP = document.createElement('p');
      const em = document.createElement('em');
      em.textContent = tag.textContent.trim();
      tagP.append(em);
      contentDiv.append(tagP);
    }

    // Date (found: .article-card-meta .paragraph-sm.utility-text-secondary)
    const date = card.querySelector('.article-card-meta .paragraph-sm.utility-text-secondary');
    if (date) {
      const dateP = document.createElement('p');
      dateP.textContent = date.textContent.trim();
      contentDiv.append(dateP);
    }

    // Heading with link (found: h3.h4-heading, card itself is an <a>)
    const heading = card.querySelector('h3, .h4-heading');
    if (heading) {
      const h3 = document.createElement('h3');
      const href = card.getAttribute('href') || card.closest('a')?.getAttribute('href');
      if (href) {
        const link = document.createElement('a');
        link.href = href;
        link.textContent = heading.textContent.trim();
        h3.append(link);
      } else {
        h3.textContent = heading.textContent.trim();
      }
      contentDiv.append(h3);
    }

    cells.push([img || '', contentDiv]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });

  // Remove sibling cards before replacing
  cards.forEach((card) => {
    if (card !== element) card.remove();
  });

  element.replaceWith(block);
}
