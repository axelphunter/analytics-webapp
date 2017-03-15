'use strict';

((base, document) => {
  const componentName = 'pie-logger';

  const proto = Object.create(base);

  proto.createdCallback = function createdCallback() {
    const self = this;
    helpers.createEl(self, 'div', null, 'Console online - awaiting response.');
  };

  proto.attributeChangedCallback = function attributeChangedCallback(attrName, oldVal, newVal) {
    const self = this;
    if (attrName !== 'value') {
      return;
    }
    helpers.createEl(self, 'div', null, newVal || '');
  };

  document.registerElement(componentName, {
    prototype: proto
  });
})(typeof HTMLElement !== 'undefined' ?
  HTMLElement.prototype :
  Element.prototype, document);
