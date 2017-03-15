'use strict';

((base, document) => {
  const componentName = 'pie-login-verify';
  const notifier = document.querySelector('pie-notification-bar');
  let container;
  let authCodeInput;

  const proto = Object.create(base);

  proto.createdCallback = function createdCallback() {
    const self = this;
    container = helpers.createEl(self, 'div', {
      class: 'animated fadeInDown inner'
    }, null, '<h4>Verify</h4><p>We just sent you a message via SMS with your authentication code. Enter the code in the form below to verify your identity</p>');
    const form = helpers.createEl(container, 'form');
    authCodeInput = helpers.createEl(form, 'input', {
      type: 'text',
      ref: 'authCode',
      placeholder: 'Authentication code'
    });
    helpers.createEl(form, 'button', {
      class: 'button-primary'
    }, null, '<span class="loader"></span><span>Verify</span>').onclick = function onclick(e) {
      self.formHandler(e);
    };
    helpers.createEl(form, 'button', {
      class: 'u-full-width'
    }, 'Login').onclick = function onclick(e) {
      self.renderLoginForm(e);
    };
    helpers
      .createEl(form, 'p', null, null, '<a>Resend verification code</a>')
      .onclick = function onClick(e) {
      self.resendVerificationCode(e, 'default');
    };
    helpers.createEl(container, 'h5', null, 'Dont have your phone?');
    helpers
      .createEl(container, 'p', null, null, '<p><a>Send the code to my email address</a></p>')
      .onclick = function onClick(e) {
      self.resendVerificationCode(e, 'email');
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

  proto.resendVerification = function resendVerification(e, method) {
    e.preventDefault();
    const url = `${window.location.origin}/auth/forgot`;
    const body = {
      method,
      resend: true
    };
    promise
      .post(url, body)
      .then((err) => {
        if (err) {
          notifier.setAttribute('data-type', 'error');
          notifier.setAttribute('value', 'Something went wrong with your request.');
          return;
        }
        notifier.setAttribute('data-type', 'success');
        notifier.setAttribute('value', 'The authorisation has been resent successfully.');
      });
  };

  proto.formHandler = function formHandler(e) {
    e.preventDefault();
    const self = this;
    let el = e || window.event;
    el = el.target || el.srcElement;
    el
      .classList
      .add('loading');
    const url = `${window.location.origin}/auth/verify`;
    const body = {
      authCode: authCodeInput.value
    };
    promise
      .post(url, body)
      .then((err) => {
        if (err) {
          el
            .classList
            .remove('loading');
          authCodeInput.value = '';
          notifier.setAttribute('data-type', 'error');
          notifier.setAttribute('value', err.error);
          return;
        }
        self.renderLoginPasswordReset();
      });
  };

  proto.renderLoginPasswordReset = function renderLoginPasswordReset() {
    const self = this;
    container
      .classList
      .remove('fadeInDown');
    container
      .classList
      .add('fadeOutDown');
    self
      .parentNode
      .setAttribute('data-type', 'passwordReset');
    return false;
  };

  document.registerElement(componentName, {prototype: proto});
})(typeof HTMLElement !== 'undefined'
  ? HTMLElement.prototype
  : Element.prototype, document);
