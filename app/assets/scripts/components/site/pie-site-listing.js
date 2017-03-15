'use strict';

((base, document) => {
  const componentName = 'pie-site-listing';
  const notifier = document.querySelector('pie-notification-bar');
  let tableBody;

  const proto = Object.create(base);

  proto.createdCallback = function createdCallback() {
    const self = this;
    helpers.createEl(self, 'button', {
      class: 'button-primary',
      href: '/site/create'
    }, 'Add new');
    helpers.createEl(self, 'h4', {
      class: 'title'
    }, 'Site listing');
    const table = helpers.createEl(self, 'table', {class: 'data-table'});
    const thead = helpers.createEl(table, 'thead')
    const theadtr = helpers.createEl(thead, 'tr');
    helpers.createEl(theadtr, 'th', null, 'Description');
    helpers.createEl(theadtr, 'th', null, 'Address');
    helpers.createEl(theadtr, 'th', null, 'City');
    helpers.createEl(theadtr, 'th', null, 'County');
    helpers.createEl(theadtr, 'th', null, 'Postcode');
    helpers.createEl(theadtr, 'th', null, 'Country');
    helpers.createEl(theadtr, 'th', {class: 'buttons'});
    tableBody = helpers.createEl(table, 'tbody');
    self.render();
  };

  proto.render = function render() {
    const self = this;
    helpers.clearEl(tableBody);
    const url = `${window.location.origin}/api/site/list`;
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
          .forEach((site) => {
            const tr = helpers.createEl(tableBody, 'tr');
            helpers.createEl(tr, 'td', null, site.description);
            helpers.createEl(tr, 'td', null, null, `${site.addressLine1}<br>${site.addressLine2}`);
            helpers.createEl(tr, 'td', null, site.city);
            helpers.createEl(tr, 'td', null, site.county);
            helpers.createEl(tr, 'td', null, site.postcode);
            helpers.createEl(tr, 'td', null, site.country);
            const actionButtons = helpers.createEl(tr, 'td');
            helpers.createEl(actionButtons, 'a', {
              class: 'button',
              href: `/site/edit/${site.id}`
            }, 'View');
            helpers.createEl(actionButtons, 'button', {
              class: 'error'
            }, 'Delete').onclick = () => {
              self.deleteSite(site.id);
            };
          })
      });
  };

  proto.deleteSite = function deleteUser(id) {
    const self = this;
    const y = confirm('Are you sure you want to delete this site? This action cannot be undone.');
    if (!y) {
      return;
    }
    const url = `${window.location.origin}/api/site/delete/${id}`;
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
        self.render();
      });
  };

  document.registerElement(componentName, {prototype: proto});
})(typeof HTMLElement !== 'undefined'
  ? HTMLElement.prototype
  : Element.prototype, document);
