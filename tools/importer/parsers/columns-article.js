/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-article. Base: columns.
 * Source: https://wknd-trendsetters.site/
 * Selectors from captured DOM: main > section:nth-of-type(1) .grid-layout
 * Columns block: each row has N cells (one per column)
 */
export default function parse(element, { document }) {
  // Column 1: Image (found: img.cover-image.utility-aspect-3x2)
  const image = element.querySelector('img.cover-image, picture');

  // Column 2: Article metadata
  // Breadcrumbs (found: .breadcrumbs)
  const breadcrumbs = element.querySelector('.breadcrumbs');
  // Heading (found: h2.h2-heading)
  const heading = element.querySelector('h2, .h2-heading');
  // Byline info (found: .flex-horizontal spans)
  const bylineElements = element.querySelectorAll('.flex-horizontal');

  const col2Content = document.createElement('div');
  if (breadcrumbs) col2Content.append(breadcrumbs);
  if (heading) col2Content.append(heading);
  bylineElements.forEach((el) => col2Content.append(el));

  const cells = [];
  // Single row with 2 columns: image | text content
  cells.push([image || '', col2Content]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-article', cells });
  element.replaceWith(block);
}
