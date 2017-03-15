'use strict';

((base, document) => {
  const componentName = 'pie-user-listing';
  const notifier = document.querySelector('pie-notification-bar');
  let tableBody;

  const proto = Object.create(base);

  proto.createdCallback = function createdCallback() {
    const self = this;
    helpers.createEl(self, 'button', {
      class: 'button-primary',
      href: '/user/create'
    }, 'Add new');
    helpers.createEl(self, 'h4', {
      class: 'title'
    }, 'User listing');
    const table = helpers.createEl(self, 'table', {class: 'data-table'});
    const thead = helpers.createEl(table, 'thead')
    const theadtr = helpers.createEl(thead, 'tr');
    helpers.createEl(theadtr, 'th', null, 'Username');
    helpers.createEl(theadtr, 'th', null, 'Name');
    helpers.createEl(theadtr, 'th', null, 'Last Activity');
    helpers.createEl(theadtr, 'th', null, 'Role');
    helpers.createEl(theadtr, 'th', null, 'Status');
    helpers.createEl(theadtr, 'th', null, 'Enabled');
    helpers.createEl(theadtr, 'th', null, 'Online');
    helpers.createEl(theadtr, 'th', {class: 'buttons'});
    tableBody = helpers.createEl(table, 'tbody');
    self.render();
  };

  proto.render = function render() {
    const self = this;
    helpers.clearEl(tableBody);
    const url = `${window.location.origin}/api/user/list`;
    promise
      .get(url)
      .then((err, result) => {
        if (err) {
          const tr = helpers.createEl(tableBody, 'tr');
          return helpers.createEl(tr, 'td', {
            colspan: 8
          }, 'There is no data available');
        }
        JSON
          .parse(result)
          .forEach((user) => {
            const tr = helpers.createEl(tableBody, 'tr');
            helpers.createEl(tr, 'td', null, user.username);
            helpers.createEl(tr, 'td', null, `${user.firstName} ${user.lastName}`);
            helpers.createEl(tr, 'td', null, user.lastLogonUtc);
            helpers.createEl(tr, 'td', null, user.role);
            if (user.hardLocked) {
              helpers.createEl(tr, 'td', null, null, '<i class="fa fa-lock" aria-hidden="true"></i>');
            } else if (user.softLocked) {
              helpers.createEl(tr, 'td', null, null, '<i class="fa fa-lock" aria-hidden="true"></i>');
            } else {
              helpers.createEl(tr, 'td', null, null, '<i class="fa fa-unlock" aria-hidden="true"></i>');
            }
            if (user.enabled) {
              helpers.createEl(tr, 'td', null, null, '<i class="fa fa-toggle-on" aria-hidden="true"></i>');
            } else {
              helpers.createEl(tr, 'td', null, null, '<i class="fa fa-toggle-off" aria-hidden="true"></i>');
            }
            helpers.createEl(tr, 'td', null, null, '<i class="fa fa-toggle-on" aria-hidden="true"></i>');
            const actionButtons = helpers.createEl(tr, 'td');
            helpers.createEl(actionButtons, 'a', {
              class: 'button',
              href: `/user/edit/${user.id}/${user.username}`
            }, 'View');
            helpers.createEl(actionButtons, 'button', {
              class: 'error'
            }, 'Delete').onclick = () => {
              self.deleteUser(user.id, user.username);
            };
          })
      });
  };

  proto.deleteUser = function deleteUser(id, username) {
    const self = this;
    const y = confirm('Are you sure you want to delete this user? This action cannot be undone.');
    if (!y) {
      return;
    }
    const url = `${window.location.origin}/api/user/delete/${id}/${username}`;
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
        self.render();
      });
  };

  document.registerElement(componentName, {prototype: proto});
})(typeof HTMLElement !== 'undefined'
  ? HTMLElement.prototype
  : Element.prototype, document);
