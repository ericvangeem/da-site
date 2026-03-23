/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-gallery. Base: columns.
 * Source: https://wknd-trendsetters.site/
 * Selectors from captured DOM: main > section:nth-of-type(2) .grid-layout.desktop-4-column
 * Columns block: 4 columns x 2 rows of square images
 */
export default function parse(element, { document }) {
  // Extract all images from the grid (found: .utility-aspect-1x1 img.cover-image)
  const imageWrappers = Array.from(element.querySelectorAll('.utility-aspect-1x1'));

  const cells = [];

  // Build rows of 4 columns each
  for (let i = 0; i < imageWrappers.length; i += 4) {
    const row = [];
    for (let j = i; j < Math.min(i + 4, imageWrappers.length); j++) {
      const img = imageWrappers[j].querySelector('img');
      row.push(img || '');
    }
    cells.push(row);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-gallery', cells });
  element.replaceWith(block);
}
