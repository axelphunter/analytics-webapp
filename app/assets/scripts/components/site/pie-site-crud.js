'use strict';

((base, document) => {
  const componentName = 'pie-site-crud';
  const notifier = document.querySelector('pie-notification-bar');
  let form;
  let panelContainer;

  const proto = Object.create(base, {
    type: {
      get: function get() {
        return this.getAttribute('data-type') || '';
      },
      set: function set(type) {
        this.setAttribute('data-type', type || '');
      }
    },
    id: {
      get: function get() {
        return this.getAttribute('data-id') || '';
      },
      set: function set(id) {
        this.setAttribute('data-id', id || '');
      }
    }
  });

  proto.createdCallback = function createdCallback() {
    const self = this;
    helpers.createEl(self, 'div', {
      class: 'panel'
    }, null, `<div class="panel-header"><h4 class="title">Site - ${self.type}</h4></div>`);
    panelContainer = helpers.createEl(self, 'div', {class: 'panel-container'});
    self.render();
  };

  proto.render = function render() {
    const self = this;
    helpers.clearEl(panelContainer);
    form = helpers.createEl(panelContainer, 'form', null, null, `
    <div class="row">
      <div class="six columns">
        <label for="descriptionInput">Site Description
          <input class="u-full-width" type="text" id="descriptionInput" name="description" required="true">
        </label>
        <label for="addressLine1Input">Address 1
          <input class="u-full-width" type="text" id="addressLine1Input" name="addressLine1" required="true">
        </label>
        <label for="addressLine2Input">Address 2
          <input class="u-full-width" type="text" id="addressLine2Input" name="addressLine2" required="false">
        </label>
        <label for="cityInput">City
          <input class="u-full-width" type="text" id="cityInput" name="city" required="true">
        </label>
        <label for="countyInput">County
          <input class="u-full-width" type="text" id="countyInput" name="county" required="true">
        </label>
        <label for="postcodeInput">Postcode / ZIP code
          <input class="u-full-width" type="text" id="postcodeInput" name="postcode" required="true">
        </label>
        <label for="countryInput">Country
          <input class="u-full-width" type="text" id="countryInput" name="country" required="true">
        </label>
      </div>
      <div class="six columns">

      </div>
    </div>
    `);
    if (self.id) {
      self.populateForm();
    }
    helpers.createEl(form, 'a', {
      href: '/site/list',
      class: 'button'
    }, 'Cancel');
    helpers.createEl(form, 'button', {
      class: 'button-primary'
    }, 'Submit').onclick = function submitForm(e) {
      self.formHandler(e);
    };
  };

  proto.populateForm = function populateForm() {
    const self = this;
    const url = `${window.location.origin}/api/site/${self.id}`;
    promise
      .get(url)
      .then((err, result) => {
        result = JSON.parse(result);
        console.log(result);
        if (err || result.statusCode === 404) {
          notifier.setAttribute('data-type', 'error');
          notifier.setAttribute('value', 'There was a problem finding this site. Please try again.');
          app
            .pieApp
            .setAttribute('data-view', '/site/list');
          history.pushState(null, null, '/site/list');
          return;
        }
        for (const key in result) {
          if (form.querySelector(`[name='${key}']`))
            form.querySelector(`[name='${key}']`).value = result[key]
        }
      });
  };

  proto.deleteUser = function deleteUser() {
    const self = this;
    const y = confirm('Are you sure you want to delete this site? This action cannot be undone.');
    if (!y) {
      return;
    }
    const url = `${window.location.origin}/api/site/delete/${self.id}`;
    promise
      .get(url)
      .then((err) => {
        if (err) {
          console.log(err);
          notifier.setAttribute('data-type', 'error');
          notifier.setAttribute('value', 'There was an issue when deleting this site. Please try again.');
          return;
        }
        notifier.setAttribute('data-type', 'success');
        notifier.setAttribute('value', 'Site has been deleted successfully.');
        app
          .pieApp
          .setAttribute('data-view', '/site/list');
        history.pushState(null, null, '/site/list');
      });
  }

  proto.formHandler = function formHandler(e) {
    const self = this;
    e.preventDefault();
    let errors = false;
    const formValues = {}
    const inputs = form.querySelectorAll('input, select');
    []
      .forEach
      .call(inputs, (input) => {
        let value;
        if (input.tagName === 'SELECT') {
          value = input.options[input.selectedIndex].value;
        } else {
          value = input.value;
        }
        if (input.hasAttribute('required') && !value) {
          errors = true;
          input
            .parentElement
            .classList
            .add('required');
        } else {
          input
            .parentElement
            .classList
            .remove('required');
        }
        formValues[input.getAttribute('name')] = value;
      });

    if (errors) {
      return;
    }

    let url;
    console.log(self.type);
    switch (self.type) {
      case 'create':
        url = `${window.location.origin}/api/user/create`;
        break;
      default:
        url = `${window.location.origin}/api/user/${self.uid}/${self.username}`;
    }
    console.log(url);
    promise
      .post(url, formValues)
      .then((err, result) => {
        if (err) {
          notifier.setAttribute('data-type', 'success');
          notifier.setAttribute('value', 'There was a problem saving user details. Please try again.');
          return;
        }
        notifier.setAttribute('data-type', 'success');
        notifier.setAttribute('value', 'User details have been saved successfully.');
        if (self.type === 'create') {
          app
            .pieApp
            .setAttribute('data-view', '/user/list');
          history.pushState(null, null, '/user/list');
        }
        console.log(result);
      });
  };

  proto.attributeChangedCallback = function attributeChangedCallback(attrName, oldVal, newVal) {
    const self = this;
    switch (attrName) {
      case 'data-id':
        self.id = newVal || '';
        break;
      default:
        self.type = newVal || '';
    }
    self.render();
  };

  document.registerElement(componentName, {prototype: proto});
})(typeof HTMLElement !== 'undefined'
  ? HTMLElement.prototype
  : Element.prototype, document);
