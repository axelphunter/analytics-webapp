'use strict';

((base, document) => {
  const componentName = 'pie-user-crud';
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
    uid: {
      get: function get() {
        return this.getAttribute('data-uid') || '';
      },
      set: function set(uid) {
        this.setAttribute('data-uid', uid || '');
      }
    },
    username: {
      get: function get() {
        return this.getAttribute('data-username') || '';
      },
      set: function set(username) {
        this.setAttribute('data-username', username || '');
      }
    }
  });

  proto.createdCallback = function createdCallback() {
    const self = this;
    helpers.createEl(self, 'div', {
      class: 'panel'
    }, null, `<div class="panel-header"><h4 class="title">User - ${self.type}</h4></div>`);
    panelContainer = helpers.createEl(self, 'div', {class: 'panel-container'});
    self.render();
  };

  proto.render = function render() {
    const self = this;
    helpers.clearEl(panelContainer);
    form = helpers.createEl(panelContainer, 'form', null, null, `
    <div class="row">
      <div class="six columns">
        <label for="emailInput">Email address
          <input class="u-full-width" type="email" placeholder="We will send your login details to this address" id="emailInput" name="email" required="true">
        </label>
      </div>
      <div class="six columns">
        <label for="phoneNumberInput">Phone number
          <input class="u-full-width" type="tel" id="phoneNumberInput" name="phone" required="true">
        </label>
      </div>
    </div>
    <div class="row">
      <div class="six columns">
        <label for="firstNameInput">First name
          <input class="u-full-width" type="text" id="firstNameInput" name="firstName" required="true">
        </label>
      </div>
      <div class="six columns">
        <label for="lastNameInput">Last name
          <input class="u-full-width" type="text" id="lastNameInput" name="lastName" required="true">
        </label>
      </div>
    </div>
    `);
    if (self.type === 'create') {
      helpers.createEl(form, 'div', null, null, `
      <label for="usernameInput">Username
        <input class="u-full-width" type="email" placeholder="Your PIE username (this can be changed later)" id="usernameInput" name="username" required="true">
      </label>
      <label for="exampleRecipientInput">Role
        <select class="u-full-width" id="exampleRecipientInput" name="role" required="true">
          <option selected disabled value="">Select a role</option>
          <option value="Administrator">Administrator</option>
          <option value="Editor">Editor</option>
          <option value="Viewer">Viewer</option>
        </select>
      </label>
      `)
    }
    if (self.uid && self.username) {
      self.populateForm();
      // helpers.createEl(form, 'button', {
      //   class: 'error'
      // }, 'Delete').onclick = () => {
      //   self.deleteUser();
      // };
    }
    helpers.createEl(form, 'a', {
      href: '/user/list',
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
    const url = `${window.location.origin}/api/user/${self.uid}/${self.username}`;
    promise
      .get(url)
      .then((err, result) => {
        result = JSON.parse(result);
        console.log(result);
        if (err || result.statusCode === 404) {
          notifier.setAttribute('data-type', 'error');
          notifier.setAttribute('value', 'There was a problem finding this user. Please try again.');
          app
            .pieApp
            .setAttribute('data-view', '/user/list');
          history.pushState(null, null, '/user/list');
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
    const y = confirm('Are you sure you want to delete this user? This action cannot be undone.');
    if (!y) {
      return;
    }
    const url = `${window.location.origin}/api/user/delete/${self.uid}/${self.username}`;
    promise
      .get(url)
      .then((err) => {
        if (err) {
          console.log(err);
          notifier.setAttribute('data-type', 'error');
          notifier.setAttribute('value', 'There was an issue when deleting this user. Please try again.');
          return;
        }
        notifier.setAttribute('data-type', 'success');
        notifier.setAttribute('value', 'User has been deleted successfully.');
        app
          .pieApp
          .setAttribute('data-view', '/user/list');
        history.pushState(null, null, '/user/list');
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
      case 'data-username':
        self.username = newVal || '';
        break;
      case 'data-uid':
        self.uid = newVal || '';
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
