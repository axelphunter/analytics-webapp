'use strict';

((base, document) => {
  const componentName = 'pie-login';

  const proto = Object.create(base, {
    type: {
      get: function get() {
        return this.getAttribute('data-type') || '';
      },
      set: function set(type) {
        this.setAttribute('data-type', type || '');
      }
    }
  });

  proto.createdCallback = function createdCallback() {
    const self = this;
    helpers.createEl(self, 'pie-login-form');
  };

  proto.render = function render() {
    const self = this;
    helpers.clearEl(self);
    switch (self.type) {
      case 'forgot':
        helpers.createEl(self, 'pie-login-forgot');
        break;
      case 'verify':
        helpers.createEl(self, 'pie-login-verify');
        break;
      case 'passwordReset':
        helpers.createEl(self, 'pie-login-reset');
        break;
      default:
        helpers.createEl(self, 'pie-login-form');
    }
  };

  proto.attributeChangedCallback = function attributeChangedCallback(attrName, oldVal, newVal) {
    const self = this;
    self.type = newVal || '';
    this.render();
  };

  document.registerElement(componentName, {prototype: proto});
})(typeof HTMLElement !== 'undefined'
  ? HTMLElement.prototype
  : Element.prototype, document);
