'use strict';

((base, document) => {
  const componentName = 'pie-bar-graph';

  const proto = Object.create(base);

  proto.createdCallback = function createdCallback() {
    const self = this;
    helpers.createEl(self, 'div', {
      class: 'chart'
    }, null, `
    <div class="chart">
      <div style="width: 40px;">4</div>
      <div style="width: 80px;">8</div>
      <div style="width: 150px;">15</div>
      <div style="width: 160px;">16</div>
      <div style="width: 230px;">23</div>
      <div style="width: 420px;">42</div>
    </div>
    `);
  };

  document.registerElement(componentName, {prototype: proto});
})(typeof HTMLElement !== 'undefined'
  ? HTMLElement.prototype
  : Element.prototype, document);
