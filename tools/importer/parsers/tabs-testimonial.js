/* eslint-disable */
/* global WebImporter */

/**
 * Parser for tabs-testimonial. Base: tabs.
 * Source: https://wknd-trendsetters.site/
 * Selectors from captured DOM: .tabs-wrapper
 * Tabs block: each row = [tab label | tab content]
 */
export default function parse(element, { document }) {
  // Extract tab panes (found: .tab-pane with content)
  const tabPanes = Array.from(element.querySelectorAll('.tab-pane'));
  // Extract tab menu buttons for labels (found: .tab-menu-link)
  const tabButtons = Array.from(element.querySelectorAll('.tab-menu-link'));

  const cells = [];

  tabPanes.forEach((pane, i) => {
    // Tab label: person name from tab button or pane content
    const button = tabButtons[i];
    let labelText = '';
    if (button) {
      const nameEl = button.querySelector('strong');
      labelText = nameEl ? nameEl.textContent.trim() : button.textContent.trim();
    }

    // Tab content: image + name + title + quote
    const contentDiv = document.createElement('div');

    const img = pane.querySelector('img.cover-image');
    if (img) contentDiv.append(img);

    const nameEl = pane.querySelector('.paragraph-xl.utility-margin-bottom-0 strong, .paragraph-xl strong');
    if (nameEl) {
      const nameP = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = nameEl.textContent.trim();
      nameP.append(strong);
      contentDiv.append(nameP);
    }

    // Title/role (found: div after the name, not inside .paragraph-xl)
    const nameWrapper = pane.querySelector('.paragraph-xl.utility-margin-bottom-0');
    if (nameWrapper) {
      const titleEl = nameWrapper.parentElement.querySelector('div:not(.paragraph-xl)');
      if (titleEl && titleEl.textContent.trim()) {
        const titleP = document.createElement('p');
        titleP.textContent = titleEl.textContent.trim();
        contentDiv.append(titleP);
      }
    }

    // Quote (found: p.paragraph-xl - the quote text)
    const quote = pane.querySelector('p.paragraph-xl');
    if (quote) contentDiv.append(quote);

    cells.push([labelText, contentDiv]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-testimonial', cells });
  element.replaceWith(block);
}
