'use strict';

((base, document) => {
  const componentName = 'pie-radar-chart';

  const proto = Object.create(base);

  proto.createdCallback = function createdCallback() {
    const self = this;
    const margin = {
      top: 60,
      right: 60,
      bottom: 60,
      left: 60
    };
    const width = Math.min(700, self.parentElement.clientWidth - 10) - margin.left - margin.right;
    const height = Math.min(width, self.parentElement.clientHeight - margin.top - margin.bottom - 20);

    const data = [
      [
        {
          axis: 'Battery Life',
          value: Math.random()
        }, {
          axis: 'Brand',
          value: Math.random()
        }, {
          axis: 'Contract Cost',
          value: Math.random()
        }, {
          axis: 'Design And Quality',
          value: Math.random()
        }, {
          axis: 'Have Internet Connectivity',
          value: Math.random()
        }, {
          axis: 'Large Screen',
          value: Math.random()
        }, {
          axis: 'Price Of Device',
          value: Math.random()
        }, {
          axis: 'To Be A Smartphone',
          value: Math.random()
        }
      ],
      [
        {
          axis: 'Battery Life',
          value: Math.random()
        }, {
          axis: 'Brand',
          value: Math.random()
        }, {
          axis: 'Contract Cost',
          value: Math.random()
        }, {
          axis: 'Design And Quality',
          value: Math.random()
        }, {
          axis: 'Have Internet Connectivity',
          value: Math.random()
        }, {
          axis: 'Large Screen',
          value: Math.random()
        }, {
          axis: 'Price Of Device',
          value: Math.random()
        }, {
          axis: 'To Be A Smartphone',
          value: Math.random()
        }
      ],
      [
        {
          axis: 'Battery Life',
          value: Math.random()
        }, {
          axis: 'Brand',
          value: Math.random()
        }, {
          axis: 'Contract Cost',
          value: Math.random()
        }, {
          axis: 'Design And Quality',
          value: Math.random()
        }, {
          axis: 'Have Internet Connectivity',
          value: Math.random()
        }, {
          axis: 'Large Screen',
          value: Math.random()
        }, {
          axis: 'Price Of Device',
          value: Math.random()
        }, {
          axis: 'To Be A Smartphone',
          value: Math.random()
        }
      ]
    ];

    const color = d3
      .scale
      .ordinal()
      .range(['#EDC951', '#CC333F', '#00A0B0']);

    const radarChartOptions = {
      w: width,
      h: height,
      margin,
      maxValue: 0.5,
      levels: 5,
      roundStrokes: true,
      color
    };
    // Call function to draw the Radar
    charts.radarChart(self, data, radarChartOptions);
  };
  document.registerElement(componentName, {prototype: proto});
})(typeof HTMLElement !== 'undefined'
  ? HTMLElement.prototype
  : Element.prototype, document);
