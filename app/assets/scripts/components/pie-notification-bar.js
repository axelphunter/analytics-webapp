'use strict';

((base, document) => {
  const componentName = 'pie-notification-bar';
  let notifier;

  const proto = Object.create(base, {
    type: {
      get: function get() {
        return this.getAttribute('data-type') || '';
      },
      set: function set(type) {
        this.setAttribute('data-type', type || '');
      }
    },
    message: {
      get: function get() {
        return this.getAttribute('value') || '';
      },
      set: function set(type) {
        this.setAttribute('value', type || '');
      }
    }
  });

  proto.createdCallback = function createdCallback() {
    const self = this;
    if (self.type) {
      self.render();
    }
  };

  proto.render = function render() {
    const self = this;
    helpers.clearEl(self);
    notifier = helpers.createEl(self, 'div', {
      class: `notification ${self.type} animated fadeInDown`
    }, self.message);
    self.addEventListener('click', () => {
      self.hideNotification();
    });
    setTimeout(() => {
      self.hideNotification();
    }, 3000);
  };

  proto.hideNotification = function hideNotification() {
    notifier
      .classList
      .remove('fadeInDown');
    notifier
      .classList
      .add('fadeOutUp');
  };

  proto.attributeChangedCallback = function attributeChangedCallback(attrName, oldVal, newVal) {
    const self = this;
    if (attrName !== 'value') {
      return;
    }
    self.message = newVal || '';
    this.render();
  };

  document.registerElement(componentName, {prototype: proto});
})(typeof HTMLElement !== 'undefined'
  ? HTMLElement.prototype
  : Element.prototype, document);
