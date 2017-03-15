'use strict';

((base, document) => {
  const componentName = 'pie-hello';

  const proto = Object.create(base);

  proto.createdCallback = function createdCallback() {
    const self = this;
    helpers.createEl(self, 'h1', null, 'Hello, world');
  };

  document.registerElement(componentName, {prototype: proto});
})(typeof HTMLElement !== 'undefined'
  ? HTMLElement.prototype
  : Element.prototype, document);
