/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroBannerParser from './parsers/hero-banner.js';
import columnsArticleParser from './parsers/columns-article.js';
import columnsGalleryParser from './parsers/columns-gallery.js';
import tabsTestimonialParser from './parsers/tabs-testimonial.js';
import cardsArticleParser from './parsers/cards-article.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import heroCtaParser from './parsers/hero-cta.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-trendsetters-cleanup.js';
import sectionsTransformer from './transformers/wknd-trendsetters-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-banner': heroBannerParser,
  'columns-article': columnsArticleParser,
  'columns-gallery': columnsGalleryParser,
  'tabs-testimonial': tabsTestimonialParser,
  'cards-article': cardsArticleParser,
  'accordion-faq': accordionFaqParser,
  'hero-cta': heroCtaParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  urls: [
    'https://wknd-trendsetters.site/'
  ],
  description: 'WKND Trendsetters homepage with hero, featured content, and promotional sections',
  blocks: [
    {
      name: 'hero-banner',
      instances: ['header.section.secondary-section']
    },
    {
      name: 'columns-article',
      instances: ['main > section:nth-of-type(1) .grid-layout']
    },
    {
      name: 'columns-gallery',
      instances: ['main > section:nth-of-type(2) .grid-layout.desktop-4-column']
    },
    {
      name: 'tabs-testimonial',
      instances: ['main > section:nth-of-type(3) .tabs-wrapper']
    },
    {
      name: 'cards-article',
      instances: ['main > section:nth-of-type(4) .article-card']
    },
    {
      name: 'accordion-faq',
      instances: ['main > section:nth-of-type(5) .faq-list']
    },
    {
      name: 'hero-cta',
      instances: ['section.inverse-section']
    }
  ],
  sections: [
    {
      id: 'section-1-hero',
      name: 'Hero',
      selector: 'header.section.secondary-section',
      style: 'light',
      blocks: ['hero-banner'],
      defaultContent: []
    },
    {
      id: 'section-2-featured-article',
      name: 'Featured Article',
      selector: 'main > section:nth-of-type(1)',
      style: null,
      blocks: ['columns-article'],
      defaultContent: []
    },
    {
      id: 'section-3-gallery',
      name: 'Photo Gallery',
      selector: 'main > section:nth-of-type(2)',
      style: 'light',
      blocks: ['columns-gallery'],
      defaultContent: [
        'main > section:nth-of-type(2) .utility-text-align-center h2',
        'main > section:nth-of-type(2) .utility-text-align-center p'
      ]
    },
    {
      id: 'section-4-testimonials',
      name: 'Testimonials',
      selector: 'main > section:nth-of-type(3)',
      style: null,
      blocks: ['tabs-testimonial'],
      defaultContent: []
    },
    {
      id: 'section-5-latest-articles',
      name: 'Latest Articles',
      selector: 'main > section:nth-of-type(4)',
      style: 'light',
      blocks: ['cards-article'],
      defaultContent: [
        'main > section:nth-of-type(4) .utility-text-align-center h2',
        'main > section:nth-of-type(4) .utility-text-align-center p'
      ]
    },
    {
      id: 'section-6-faq',
      name: 'FAQ',
      selector: 'main > section:nth-of-type(5)',
      style: null,
      blocks: ['accordion-faq'],
      defaultContent: [
        'main > section:nth-of-type(5) h2',
        'main > section:nth-of-type(5) p.subheading'
      ]
    },
    {
      id: 'section-7-cta-banner',
      name: 'CTA Banner',
      selector: 'section.inverse-section',
      style: 'dark',
      blocks: ['hero-cta'],
      defaultContent: []
    }
  ]
};

// Include section transformer since template has 7 sections
const allTransformers = [
  ...transformers,
  sectionsTransformer,
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  allTransformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
