'use strict';

((base, document) => {
  const componentName = 'pie-layout';
  let layoutId;
  let grid;
  const notifier = document.querySelector('pie-notification-bar');
  const proto = Object.create(base);

  proto.createdCallback = function createdCallback() {
    const self = this;
    const layoutControls = helpers.createEl(self, 'div');
    const gridstackContainer = helpers.createEl(self, 'div', {
      class: 'grid-stack'
    });
    const layoutManager = document.getElementById('layoutManager');
    const layout = JSON.parse(document.getElementById('layoutManager')
      .innerHTML.replace(/&quot;/g, '"'));

    layoutId = layout._id;
    self.renderGrid(layout, gridstackContainer);

    const options = {
      cellHeight: 80,
      verticalMargin: 10,
      enableMove: false,
      enableResize: false
    };
    $('.grid-stack')
      .gridstack(options);
    grid = $('.grid-stack')
      .data('gridstack');
    grid.movable('.grid-stack-item', false);
    grid.resizable('.grid-stack-item', false);

    helpers.createEl(layoutControls, 'button', {
        id: 'addWidget'
      }, 'Add')
      .onclick = function () {
        grid.addWidget($('<div><div class="grid-stack-item-content" /></div>'),
          0, 0, 2, 2);
      }
    $('#addWidget')
      .hide();

    let edit = 1;
    helpers.createEl(layoutControls, 'button', null, 'Edit')
      .onclick = function () {
        $('#addWidget')
          .toggle();
        if (edit === 1) {
          grid.movable('.grid-stack-item', true);
          grid.resizable('.grid-stack-item', true);
          this.innerText = 'Save';
          edit = 2;
        } else {
          grid.movable('.grid-stack-item', false);
          grid.resizable('.grid-stack-item', false);
          self.saveGrid();
          this.innerText = 'Edit';
          edit = 1;
        }
      };

    layoutManager.parentNode.removeChild(layoutManager);
  };

  proto.saveGrid = function saveGrid() {
    const self = this;
    const gridObj = [];
    const els = document.querySelectorAll('.grid-stack-item');

    [].forEach.call(els, function (el) {
      const component = el.querySelector('.grid-stack-item-content')
        .childNodes.length ? el.querySelector('.grid-stack-item-content')
        .childNodes[1].tagName.toLowerCase() : null;

      gridObj.push({
        x: parseInt(el.getAttribute('data-gs-x'), 10),
        y: parseInt(el.getAttribute('data-gs-y'), 10),
        width: parseInt(el.getAttribute('data-gs-width'), 10),
        height: parseInt(el.getAttribute('data-gs-height'), 10),
        component: {
          el: component
        }
      });
    });

    const url = `${window.location.origin}/api/layout/update`;
    const body = {
      layoutId,
      gridObj: JSON.stringify(gridObj)
    };
    promise
      .post(url, body)
      .then((err, res) => {
        console.log(res);
        if (err) {
          notifier.setAttribute('data-type', 'error');
          notifier.setAttribute('value', 'Something went wrong with when updating the layout. Please try again.');
          return;
        }
        notifier.setAttribute('data-type', 'success');
        notifier.setAttribute('value', 'Layout saved successfully');
      });
  }

  proto.renderGrid = function createdCallback(obj, parent) {
    obj.layout.forEach((el) => {
      const stackItem = helpers.createEl(parent, 'div', {
        class: 'grid-stack-item',
        'data-gs-x': el.x,
        'data-gs-y': el.y,
        'data-gs-width': el.width,
        'data-gs-height': el.height
      }, null, `
        <div class="grid-stack-item-content">
          <${el.component.el}></${el.component.el}>
        </div>`);
      helpers.createEl(stackItem, 'button', {
          class: 'remove-widget'
        }, null, '<i class="fa fa-ban" aria-hidden="true"></i>')
        .onclick = function onclick() {
          var r = confirm('Are you sure you wish to remove this widget? Changed to layout will only be made once the layout has been saved.');
          if (r == true) {
            return grid.removeWidget(this.parentNode);
          }
        };
    });
  };

  document.registerElement(componentName, {
    prototype: proto
  });
})(typeof HTMLElement !== 'undefined' ?
  HTMLElement.prototype :
  Element.prototype, document);
