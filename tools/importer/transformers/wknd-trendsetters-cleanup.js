/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: wknd-trendsetters cleanup.
 * Selectors from captured DOM of https://wknd-trendsetters.site/
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove skip-to-content link (found: a.skip-link)
    WebImporter.DOMUtils.remove(element, ['.skip-link']);
  }
  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable global chrome
    // Found in captured DOM: div.navbar (main navigation), footer.footer (site footer)
    WebImporter.DOMUtils.remove(element, ['.navbar', 'footer.footer', 'iframe', 'link', 'noscript']);

    // Clean data attributes
    element.querySelectorAll('[data-astro-cid-37fxchfa]').forEach((el) => {
      el.removeAttribute('data-astro-cid-37fxchfa');
    });
  }
}
