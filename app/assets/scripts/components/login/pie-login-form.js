'use strict';

((base, document) => {
  const componentName = 'pie-login-form';
  const notifier = document.querySelector('pie-notification-bar');
  let container;
  let usernameInput;
  let passwordIput;

  const proto = Object.create(base);

  proto.createdCallback = function createdCallback() {
    const self = this;
    container = helpers.createEl(self, 'div', {
      class: 'animated fadeInDown inner'
    }, null, '<h4>Sign In</h4><p>Sign in with your username and password below.</p>');
    const form = helpers.createEl(container, 'form');
    usernameInput = helpers.createEl(form, 'input', {
      type: 'text',
      ref: 'username',
      placeholder: 'Username'
    });
    passwordIput = helpers.createEl(form, 'input', {
      type: 'password',
      ref: 'username',
      placeholder: 'Password'
    });
    helpers.createEl(form, 'button', {
      class: 'button-primary'
    }, null, '<span class="loader"></span><span>Login</span>').onclick = function onclick(e) {
      self.formHandler(e);
    };
    helpers.createEl(form, 'button', {
      class: 'u-full-width'
    }, 'Forgot password?').onclick = function onclick(e) {
      self.renderLoginForgotPassword(e);
    };
  };

  proto.renderLoginForgotPassword = function renderLoginForgotPassword(e) {
    e.preventDefault();
    const self = this;
    let el = e || window.event;
    el = el.target || el.srcElement;
    container
      .classList
      .remove('fadeInDown');
    container
      .classList
      .add('fadeOutDown');
    self
      .parentNode
      .setAttribute('data-type', 'forgot');
    return false;
  };

  proto.formHandler = function formHandler(e) {
    e.preventDefault();
    let el = e || window.event;
    el = el.target || el.srcElement;
    el
      .classList
      .add('loading');
    const url = `${window.location.origin}/auth/login`;
    const body = {
      username: usernameInput.value,
      password: passwordIput.value
    };
    promise
      .post(url, body)
      .then((err) => {
        if (err) {
          el
            .classList
            .remove('loading');
          usernameInput.value = '';
          passwordIput.value = '';
          notifier.setAttribute('data-type', 'error');
          notifier.setAttribute('value', 'The username or password that was entered is incorrect.');
          return;
        }
        window.location.href = '/home';
      });
    return false;
  };

  document.registerElement(componentName, {prototype: proto});
})(typeof HTMLElement !== 'undefined'
  ? HTMLElement.prototype
  : Element.prototype, document);
