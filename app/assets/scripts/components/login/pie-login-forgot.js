'use strict';

((base, document) => {
  const componentName = 'pie-login-forgot';
  const notifier = document.querySelector('pie-notification-bar');
  let container;
  let usernameInput;

  const proto = Object.create(base);

  proto.createdCallback = function createdCallback() {
    const self = this;
    container = helpers.createEl(self, 'div', {
      class: 'animated fadeInDown inner'
    }, null, '<h4>Forgot password?</h4><p>Enter your username below and follow the steps to reset your password.</p>');
    const form = helpers.createEl(container, 'form');
    usernameInput = helpers.createEl(form, 'input', {
      type: 'text',
      ref: 'username',
      placeholder: 'Username'
    });
    helpers.createEl(form, 'button', {
      class: 'button-primary'
    }, null, '<span class="loader"></span><span>Forgot password</span>').onclick = function onclick(e) {
      self.formHandler(e);
    };
    helpers.createEl(form, 'button', {
      class: 'u-full-width'
    }, 'Login').onclick = function onclick(e) {
      self.renderLoginForm(e);
    };
  };

  proto.renderLoginForm = function renderLoginForgotPassword(e) {
    e.preventDefault();
    const self = this;
    container
      .classList
      .remove('fadeInDown');
    container
      .classList
      .add('fadeOutDown');
    self
      .parentNode
      .setAttribute('data-type', 'login');
    return false;
  };

  proto.formHandler = function formHandler(e) {
    e.preventDefault();
    const self = this;
    let el = e || window.event;
    el = el.target || el.srcElement;
    el
      .classList
      .add('loading');

    const url = `${window.location.origin}/auth/forgot`;
    const body = {
      username: usernameInput.value
    };
    promise
      .post(url, body)
      .then((err) => {
        if (err) {
          el
            .classList
            .remove('loading');
          usernameInput.value = '';
          notifier.setAttribute('data-type', 'error');
          notifier.setAttribute('value', err.error);
          return;
        }
        self.renderLoginVerify();
      });
  };

  proto.renderLoginVerify = function renderLoginVerify() {
    const self = this;
    container
      .classList
      .remove('fadeInDown');
    container
      .classList
      .add('fadeOutDown');
    self
      .parentNode
      .setAttribute('data-type', 'verify');
    return false;
  };

  document.registerElement(componentName, {prototype: proto});
})(typeof HTMLElement !== 'undefined'
  ? HTMLElement.prototype
  : Element.prototype, document);
