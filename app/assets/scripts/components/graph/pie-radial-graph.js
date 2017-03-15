'use strict';

((base, document) => {
  const componentName = 'pie-radial-graph';

  const proto = Object.create(base);

  proto.createdCallback = function createdCallback() {
    const self = this;

    let value = Math.random() * 100 + 1;
    value = value / 100;

    let selectedGradient = ['#2194f1', '#33c3f0'];

    // let selectedGradient = [
    //   [
    //     '#00b1ef', '#23ef7b'
    //   ],
    //   [
    //     '#0aa1d0', '#754798'
    //   ],
    //   [
    //     '#ea5499', '#e40079'
    //   ],
    //   ['#e40079', '#fc3615']
    // ];
    // selectedGradient = selectedGradient[Math.floor(Math.random() * selectedGradient.length)];
    // console.log(selectedGradient);

    self.render(self, value, selectedGradient);

    $(self)
      .bind('resize', function () {
        console.log('resize');
      });
  };

  proto.render = function render(parent, value, selectedGradient) {
    const wrapper = helpers.createEl(parent, 'div', {
      class: 'wrapper'
    });
    const parentHeight = parent.parentElement.clientHeight;
    const width = parentHeight - 40;
    const height = parentHeight - 40;
    const outerRadius = parentHeight / 2 - 25;
    const tau = 2 * Math.PI;
    const formatPercent = d3.format('.0%');

    const svg = d3
      .select(wrapper)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // filters go in defs element
    const defs = svg.append('defs');

    // Gradient def
    const gradient = defs
      .append('linearGradient')
      .attr('id', 'gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '40%')
      .attr('y2', '40%')
      .attr('x3', '41%')
      .attr('y3', '41%')
      .attr('x4', '70%')
      .attr('y4', '70%')
      .attr('x5', '71%')
      .attr('y5', '71%')
      .attr('x6', '100%')
      .attr('y6', '100%')
      .attr('spreadMethod', 'pad');

    gradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', selectedGradient[0])
      .attr('stop-opacity', 1);

    gradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', selectedGradient[1])
      .attr('stop-opacity', 1);

    d3
      .selectAll("#gradient")
      .transition()
      .attr("x1", "100%")
      .attr("y1", "0%")

    const arc = d3
      .arc()
      .startAngle(0)
      .innerRadius(outerRadius * 0.7)
      .outerRadius(outerRadius);

    const g = svg
      .append('g')
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    g
      .append('path')
      .datum({
        endAngle: tau
      })
      .style('fill', '#ddd')
      .attr('d', arc)
      .attr('stroke-width', 2);
    // .style('filter', 'url(#drop-shadow)');

    const foreground = g
      .append('path')
      .datum({
        endAngle: 0
      })
      .attr('d', arc)
      .style('fill', 'url(#gradient)')

    foreground
      .transition()
      .duration(750)
      .attrTween('d', arcTween(value * tau));

    const values = helpers.createEl(wrapper, 'div', {
      class: 'info-wrap'
    });
    helpers.createEl(values, 'h1', null, formatPercent(value));
    helpers.createEl(values, 'h2', null, 'Current Usage');

    function arcTween(newAngle) {
      return (d) => {
        const interpolate = d3.interpolate(d.endAngle, newAngle);
        return (t) => {
          d.endAngle = interpolate(t);
          return arc(d);
        };
      };
    }

    // const innerCircle = svg
    //   .append('circle')
    //   .attr("class", "innercircle")
    //   .attr("cx", '50%')
    //   .attr("cy", '50%')
    //   .attr("r", outerRadius * 0.7)
    //   .attr('stroke-width', 1)
    //   .style('filter', 'url(#drop-shadow)');
  };

  document.registerElement(componentName, {
    prototype: proto
  });
})(typeof HTMLElement !== 'undefined' ?
  HTMLElement.prototype :
  Element.prototype, document);
