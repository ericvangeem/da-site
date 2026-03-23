/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-banner. Base: hero.
 * Source: https://wknd-trendsetters.site/
 * Selectors from captured DOM: header.section.secondary-section
 * Hero block: row1 = images, row2 = heading + subheading + CTAs
 */
export default function parse(element, { document }) {
  // Extract images from the grid (found: .grid-layout .cover-image)
  const images = element.querySelectorAll('.grid-layout.grid-gap-xs img.cover-image, .grid-layout.grid-gap-xs picture');
  const imageContainer = document.createElement('div');
  images.forEach((img) => imageContainer.append(img.cloneNode(true)));

  // Extract heading (found: h1.h1-heading)
  const heading = element.querySelector('h1, .h1-heading');

  // Extract subheading (found: p.subheading)
  const description = element.querySelector('p.subheading, p:not(.button-group p)');

  // Extract CTA buttons (found: .button-group a.button)
  const ctaLinks = Array.from(element.querySelectorAll('.button-group a.button, a.button'));

  const cells = [];

  // Row 1: images
  if (imageContainer.children.length > 0) {
    cells.push([imageContainer]);
  }

  // Row 2: heading + subheading + CTAs
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  contentCell.push(...ctaLinks);
  cells.push(contentCell);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
