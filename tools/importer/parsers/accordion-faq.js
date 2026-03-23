/* eslint-disable */
/* global WebImporter */

/**
 * Parser for accordion-faq. Base: accordion.
 * Source: https://wknd-trendsetters.site/
 * Selectors from captured DOM: .faq-list
 * Accordion block: each row = [question | answer]
 */
export default function parse(element, { document }) {
  // Extract FAQ items (found: details.faq-item)
  const faqItems = Array.from(element.querySelectorAll('details.faq-item, .faq-item'));

  const cells = [];

  faqItems.forEach((item) => {
    // Question text (found: summary.faq-question > span)
    const questionSpan = item.querySelector('summary.faq-question span, summary span');
    const questionText = questionSpan ? questionSpan.textContent.trim() : '';

    // Answer content (found: .faq-answer p)
    const answerDiv = item.querySelector('.faq-answer');
    const answerContent = document.createElement('div');
    if (answerDiv) {
      const paragraphs = answerDiv.querySelectorAll('p');
      paragraphs.forEach((p) => answerContent.append(p));
    }

    cells.push([questionText, answerContent]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
