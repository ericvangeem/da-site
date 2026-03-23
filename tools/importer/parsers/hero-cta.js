/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-cta. Base: hero.
 * Source: https://wknd-trendsetters.site/
 * Selectors from captured DOM: section.inverse-section
 * Hero block: row1 = background image, row2 = heading + subheading + CTA
 */
export default function parse(element, { document }) {
  // Background image (found: img.cover-image.utility-overlay)
  const bgImage = element.querySelector('img.cover-image, .utility-position-relative > img');

  // Heading (found: h2.h1-heading inside .card-body)
  const heading = element.querySelector('.card-body h2, .utility-text-on-overlay h2, h2');

  // Subheading (found: p.subheading inside .card-body)
  const description = element.querySelector('.card-body p.subheading, .utility-text-on-overlay p.subheading, p.subheading');

  // CTA button (found: .button-group a.button)
  const ctaLinks = Array.from(element.querySelectorAll('.button-group a.button, .button-group a'));

  const cells = [];

  // Row 1: background image
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: heading + subheading + CTAs
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  contentCell.push(...ctaLinks);
  cells.push(contentCell);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-cta', cells });
  element.replaceWith(block);
}
