'use strict';

((base, document) => {
  const componentName = 'pie-app';

  const proto = Object.create(base, {
    type: {
      get: function get() {
        return this.getAttribute('data-view') || '';
      },
      set: function set(type) {
        this.setAttribute('data-view', type || '');
      }
    }
  });

  proto.createdCallback = function createdCallback() {
    const self = this;
    self.render();
  };

  proto.render = function render() {
    const self = this;
    const type = self
      .type
      .split('/');
    type.shift();
    helpers.clearEl(self);
    switch (type[0]) {
      case 'user':
        switch (type[1]) {
          case 'list':
            helpers.createEl(self, 'pie-user-listing');
            break;
          case 'create':
            helpers
              .createEl(self, 'pie-user-crud')
              .setAttribute('data-type', 'create');
            break;
          case 'edit':
            const editForm = helpers.createEl(self, 'pie-user-crud');
            editForm.setAttribute('data-type', 'edit');
            editForm.setAttribute('data-uid', type[2]);
            editForm.setAttribute('data-username', type[3]);
            break;
          default:

        }
        break;
      case 'site':
        switch (type[1]) {
          case 'list':
            helpers.createEl(self, 'pie-site-listing');
            break;
          case 'create':
            helpers
              .createEl(self, 'pie-site-crud')
              .setAttribute('data-type', 'create');
            break;
          case 'edit':
            const editForm = helpers.createEl(self, 'pie-site-crud');
            editForm.setAttribute('data-type', 'edit');
            editForm.setAttribute('data-id', type[2]);
            break;
          default:

        }
        break;
      case 'tenant':
        switch (type[1]) {
          case 'list':
            helpers.createEl(self, 'pie-user-listing');
            break;
          case 'create':
            helpers.createEl(self, 'pie-user-create');
            break;
          default:
            helpers.createEl(self, 'pie-user-profile');
        }
        break;
      default:
        helpers.createEl(self, 'pie-layout');
    }
  };

  proto.attributeChangedCallback = function attributeChangedCallback(attrName, oldVal, newVal) {
    const self = this;
    if (attrName !== 'data-view') {
      return;
    }
    self.type = newVal || '';
    this.render();
  };

  document.registerElement(componentName, {prototype: proto});
})(typeof HTMLElement !== 'undefined'
  ? HTMLElement.prototype
  : Element.prototype, document);
