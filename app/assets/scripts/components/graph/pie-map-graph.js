'use strict';

((base, document) => {
  const componentName = 'pie-map-graph';

  const proto = Object.create(base);

  proto.createdCallback = function createdCallback() {
    const self = this;

    const width = self.parentElement.clientWidth;
    const height = self.parentElement.clientHeight;

    const svg = d3
      .select(self)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    var filter = svg
        .append('defs')
        .append('filter')
        .attr('id', 'glow'),
      feGaussianBlur = filter
        .append('feGaussianBlur')
        .attr('stdDeviation', '2.5')
        .attr('result', 'coloredBlur'),
      feMerge = filter.append('feMerge'),
      feMergeNode_1 = feMerge
        .append('feMergeNode')
        .attr('in', 'coloredBlur'),
      feMergeNode_2 = feMerge
        .append('feMergeNode')
        .attr('in', 'SourceGraphic');

    const projection = d3
      .geoMercator()
      .scale(140)
      .center([0, 40])
      .translate([
        width / 2,
        height / 2
      ]);

    const path = d3
      .geoPath()
      .projection(projection);

    const g = svg.append('g');

    d3.json('/json/world-110m2.json', (error, topology) => {
      if (error) {
        return console.error(error);
      }
      g
        .selectAll('path')
        .data(topojson.feature(topology, topology.objects.countries).features)
        .enter()
        .append('path')
        .attr('d', path)
        .style('fill', '#2A4282')
        .style('stroke', '#2A4282')
        .style('fill-opacity', 0.1)
        .style('filter', 'url(#glow)');
    });

    const aa = [-122.490402, 37.786453];
    const bb = [-122.389809, 37.72728];
    //
    // console.log(projection(aa), projection(bb));
    //
    // // add circles to svg
    svg
      .selectAll("circle")
      .data([aa, bb])
      .enter()
      .append("circle")
      .attr("cx", function(d) {
        return projection(d)[0];
      })
      .attr("cy", function(d) {
        return projection(d)[1];
      })
      .attr("r", "8px")
      .attr("fill", "rgb(204, 51, 63)")
      .style('fill-opacity', 0.8)
      .style('filter', 'url(#glow)');
  };

  document.registerElement(componentName, {prototype: proto});
})(typeof HTMLElement !== 'undefined'
  ? HTMLElement.prototype
  : Element.prototype, document);
