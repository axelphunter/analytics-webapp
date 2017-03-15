'use strict';

/**
 * Converts a HTML string into DOM elements, removing script tags
 * @param {object} parent - html element to insert new elements into
 */
String.prototype.toDOM = function(parentEl) {
  const parent = parentEl || document.createDocumentFragment();
  let el = null;
  const tmp = document.createElement('div');
  // inject content into none live element
  tmp.innerHTML = this;
  // remove script tags
  const scripts = tmp.getElementsByTagName('script');
  for (let i = scripts.length - 1; i >= 0; i--) {
    scripts[i]
      .parentElement
      .removeChild(scripts[i]);
  }
  // append elements
  while (el = tmp.firstChild) {
    parent.appendChild(el);
  }
  return parent;
};

const helpers = {
  textProp: 'textContent' in document.createElement('i')
    ? 'textContent'
    : 'innerText',

  createEl(parentEl, tagName, attrs, text, html) {
    const el = document.createElement(tagName);
    let key = '';
    const customEl = tagName.indexOf('-') > 0;

    if (attrs) {
      for (key in attrs) {
        if (key === 'class') {
          el.className = attrs[key // assign className
          ];
        } else if (key === 'style') {
          el.setAttribute('style', attrs[key] // assign styles
          );
        } else if (key === 'id') {
          el.id = attrs[key // assign id
          ];
        } else if (key === 'name') {
          el.setAttribute(key, attrs[key] // assign name attribute, even for customEl
          );
        } else if (customEl || (key in el)) {
          el[key] = attrs[key // assign object properties
          ];
        } else {
          el.setAttribute(key, attrs[key]);
        } // assign regular attribute
      }
    }

    if (text) {
      el.appendChild(document.createTextNode(text));
    }
    if (html) {
      helpers.clearEl(el);
      html.toDOM(el);
    }
    if (parentEl) {
      parentEl.appendChild(el);
    }

    return el;
  },

  clearEl(el) {
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
  }
};
