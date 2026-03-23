var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-banner.js
  function parse(element, { document }) {
    const images = element.querySelectorAll(".grid-layout.grid-gap-xs img.cover-image, .grid-layout.grid-gap-xs picture");
    const imageContainer = document.createElement("div");
    images.forEach((img) => imageContainer.append(img.cloneNode(true)));
    const heading = element.querySelector("h1, .h1-heading");
    const description = element.querySelector("p.subheading, p:not(.button-group p)");
    const ctaLinks = Array.from(element.querySelectorAll(".button-group a.button, a.button"));
    const cells = [];
    if (imageContainer.children.length > 0) {
      cells.push([imageContainer]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    contentCell.push(...ctaLinks);
    cells.push(contentCell);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-article.js
  function parse2(element, { document }) {
    const image = element.querySelector("img.cover-image, picture");
    const breadcrumbs = element.querySelector(".breadcrumbs");
    const heading = element.querySelector("h2, .h2-heading");
    const bylineElements = element.querySelectorAll(".flex-horizontal");
    const col2Content = document.createElement("div");
    if (breadcrumbs) col2Content.append(breadcrumbs);
    if (heading) col2Content.append(heading);
    bylineElements.forEach((el) => col2Content.append(el));
    const cells = [];
    cells.push([image || "", col2Content]);
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-gallery.js
  function parse3(element, { document }) {
    const imageWrappers = Array.from(element.querySelectorAll(".utility-aspect-1x1"));
    const cells = [];
    for (let i = 0; i < imageWrappers.length; i += 4) {
      const row = [];
      for (let j = i; j < Math.min(i + 4, imageWrappers.length); j++) {
        const img = imageWrappers[j].querySelector("img");
        row.push(img || "");
      }
      cells.push(row);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-testimonial.js
  function parse4(element, { document }) {
    const tabPanes = Array.from(element.querySelectorAll(".tab-pane"));
    const tabButtons = Array.from(element.querySelectorAll(".tab-menu-link"));
    const cells = [];
    tabPanes.forEach((pane, i) => {
      const button = tabButtons[i];
      let labelText = "";
      if (button) {
        const nameEl2 = button.querySelector("strong");
        labelText = nameEl2 ? nameEl2.textContent.trim() : button.textContent.trim();
      }
      const contentDiv = document.createElement("div");
      const img = pane.querySelector("img.cover-image");
      if (img) contentDiv.append(img);
      const nameEl = pane.querySelector(".paragraph-xl.utility-margin-bottom-0 strong, .paragraph-xl strong");
      if (nameEl) {
        const nameP = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = nameEl.textContent.trim();
        nameP.append(strong);
        contentDiv.append(nameP);
      }
      const nameWrapper = pane.querySelector(".paragraph-xl.utility-margin-bottom-0");
      if (nameWrapper) {
        const titleEl = nameWrapper.parentElement.querySelector("div:not(.paragraph-xl)");
        if (titleEl && titleEl.textContent.trim()) {
          const titleP = document.createElement("p");
          titleP.textContent = titleEl.textContent.trim();
          contentDiv.append(titleP);
        }
      }
      const quote = pane.querySelector("p.paragraph-xl");
      if (quote) contentDiv.append(quote);
      cells.push([labelText, contentDiv]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse5(element, { document }) {
    const parent = element.closest(".grid-layout") || element.parentElement;
    const cards = Array.from(parent.querySelectorAll(":scope > .article-card, :scope > a.card-link"));
    if (cards.length === 0) return;
    const cells = [];
    cards.forEach((card) => {
      var _a;
      const img = card.querySelector(".article-card-image img.cover-image, img");
      const contentDiv = document.createElement("div");
      const tag = card.querySelector(".tag");
      if (tag) {
        const tagP = document.createElement("p");
        const em = document.createElement("em");
        em.textContent = tag.textContent.trim();
        tagP.append(em);
        contentDiv.append(tagP);
      }
      const date = card.querySelector(".article-card-meta .paragraph-sm.utility-text-secondary");
      if (date) {
        const dateP = document.createElement("p");
        dateP.textContent = date.textContent.trim();
        contentDiv.append(dateP);
      }
      const heading = card.querySelector("h3, .h4-heading");
      if (heading) {
        const h3 = document.createElement("h3");
        const href = card.getAttribute("href") || ((_a = card.closest("a")) == null ? void 0 : _a.getAttribute("href"));
        if (href) {
          const link = document.createElement("a");
          link.href = href;
          link.textContent = heading.textContent.trim();
          h3.append(link);
        } else {
          h3.textContent = heading.textContent.trim();
        }
        contentDiv.append(h3);
      }
      cells.push([img || "", contentDiv]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-article", cells });
    cards.forEach((card) => {
      if (card !== element) card.remove();
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse6(element, { document }) {
    const faqItems = Array.from(element.querySelectorAll("details.faq-item, .faq-item"));
    const cells = [];
    faqItems.forEach((item) => {
      const questionSpan = item.querySelector("summary.faq-question span, summary span");
      const questionText = questionSpan ? questionSpan.textContent.trim() : "";
      const answerDiv = item.querySelector(".faq-answer");
      const answerContent = document.createElement("div");
      if (answerDiv) {
        const paragraphs = answerDiv.querySelectorAll("p");
        paragraphs.forEach((p) => answerContent.append(p));
      }
      cells.push([questionText, answerContent]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-cta.js
  function parse7(element, { document }) {
    const bgImage = element.querySelector("img.cover-image, .utility-position-relative > img");
    const heading = element.querySelector(".card-body h2, .utility-text-on-overlay h2, h2");
    const description = element.querySelector(".card-body p.subheading, .utility-text-on-overlay p.subheading, p.subheading");
    const ctaLinks = Array.from(element.querySelectorAll(".button-group a.button, .button-group a"));
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    contentCell.push(...ctaLinks);
    cells.push(contentCell);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-cta", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [".skip-link"]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [".navbar", "footer.footer", "iframe", "link", "noscript"]);
      element.querySelectorAll("[data-astro-cid-37fxchfa]").forEach((el) => {
        el.removeAttribute("data-astro-cid-37fxchfa");
      });
    }
  }

  // tools/importer/transformers/wknd-trendsetters-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { document } = payload;
      const template = payload.template;
      if (!template || !template.sections || template.sections.length < 2) return;
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const selector = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selector) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.append(sectionMetadata);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-banner": parse,
    "columns-article": parse2,
    "columns-gallery": parse3,
    "tabs-testimonial": parse4,
    "cards-article": parse5,
    "accordion-faq": parse6,
    "hero-cta": parse7
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "homepage",
    urls: [
      "https://wknd-trendsetters.site/"
    ],
    description: "WKND Trendsetters homepage with hero, featured content, and promotional sections",
    blocks: [
      {
        name: "hero-banner",
        instances: ["header.section.secondary-section"]
      },
      {
        name: "columns-article",
        instances: ["main > section:nth-of-type(1) .grid-layout"]
      },
      {
        name: "columns-gallery",
        instances: ["main > section:nth-of-type(2) .grid-layout.desktop-4-column"]
      },
      {
        name: "tabs-testimonial",
        instances: ["main > section:nth-of-type(3) .tabs-wrapper"]
      },
      {
        name: "cards-article",
        instances: ["main > section:nth-of-type(4) .article-card"]
      },
      {
        name: "accordion-faq",
        instances: ["main > section:nth-of-type(5) .faq-list"]
      },
      {
        name: "hero-cta",
        instances: ["section.inverse-section"]
      }
    ],
    sections: [
      {
        id: "section-1-hero",
        name: "Hero",
        selector: "header.section.secondary-section",
        style: "light",
        blocks: ["hero-banner"],
        defaultContent: []
      },
      {
        id: "section-2-featured-article",
        name: "Featured Article",
        selector: "main > section:nth-of-type(1)",
        style: null,
        blocks: ["columns-article"],
        defaultContent: []
      },
      {
        id: "section-3-gallery",
        name: "Photo Gallery",
        selector: "main > section:nth-of-type(2)",
        style: "light",
        blocks: ["columns-gallery"],
        defaultContent: [
          "main > section:nth-of-type(2) .utility-text-align-center h2",
          "main > section:nth-of-type(2) .utility-text-align-center p"
        ]
      },
      {
        id: "section-4-testimonials",
        name: "Testimonials",
        selector: "main > section:nth-of-type(3)",
        style: null,
        blocks: ["tabs-testimonial"],
        defaultContent: []
      },
      {
        id: "section-5-latest-articles",
        name: "Latest Articles",
        selector: "main > section:nth-of-type(4)",
        style: "light",
        blocks: ["cards-article"],
        defaultContent: [
          "main > section:nth-of-type(4) .utility-text-align-center h2",
          "main > section:nth-of-type(4) .utility-text-align-center p"
        ]
      },
      {
        id: "section-6-faq",
        name: "FAQ",
        selector: "main > section:nth-of-type(5)",
        style: null,
        blocks: ["accordion-faq"],
        defaultContent: [
          "main > section:nth-of-type(5) h2",
          "main > section:nth-of-type(5) p.subheading"
        ]
      },
      {
        id: "section-7-cta-banner",
        name: "CTA Banner",
        selector: "section.inverse-section",
        style: "dark",
        blocks: ["hero-cta"],
        defaultContent: []
      }
    ]
  };
  var allTransformers = [
    ...transformers,
    transform2
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    allTransformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            element
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
