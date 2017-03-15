'use strict';

((base, document) => {
  const componentName = 'pie-login-reset';
  const notifier = document.querySelector('pie-notification-bar');
  let container;
  let newPassword;
  let passwordConfirm;

  const proto = Object.create(base);

  proto.createdCallback = function createdCallback() {
    const self = this;
    container = helpers.createEl(self, 'div', {
      class: 'animated fadeInDown inner'
    }, null, '<h4>Password reset</h4><p>In order to reset your password, please fill out the form below.</p>');
    const form = helpers.createEl(container, 'form');
    newPassword = helpers.createEl(form, 'input', {
      type: 'password',
      ref: 'password',
      placeholder: 'New password'
    });
    passwordConfirm = helpers.createEl(form, 'input', {
      type: 'password',
      ref: 'password',
      placeholder: 'Confirm password'
    });
    helpers.createEl(form, 'button', {
      class: 'button-primary'
    }, null, '<span class="loader"></span><span>Reset password</span>').onclick = function onclick(e) {
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
    if (!newPassword.value || !newPassword.value || newPassword.value !== passwordConfirm.value) {
      notifier.setAttribute('data-type', 'error');
      notifier.setAttribute('value', 'The passwords that were entered do not match.');
      return;
    }
    let el = e || window.event;
    el = el.target || el.srcElement;
    el
      .classList
      .add('loading');
    const url = `${window.location.origin}/auth/passwordReset`;
    const body = {
      password: newPassword.value,
      passwordConfirm: passwordConfirm.value
    };
    promise
      .post(url, body)
      .then((err) => {
        if (err) {
          el
            .classList
            .remove('loading');
          newPassword.value = '';
          passwordConfirm.value = '';
          notifier.setAttribute('data-type', 'error');
          notifier.setAttribute('value', err.error);
          return;
        }
        notifier.setAttribute('data-type', 'success');
        notifier.setAttribute('value', 'Your password has been reset successfully.');
        self.renderLoginForm(e);
      });
  };

  document.registerElement(componentName, {prototype: proto});
})(typeof HTMLElement !== 'undefined'
  ? HTMLElement.prototype
  : Element.prototype, document);
