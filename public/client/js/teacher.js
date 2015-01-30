var dataset = [
{name: 'Shu', confused: 60},
{name: 'Shin', confused: 80},
{name: 'Alice', confused: 70},
{name: 'Fred', confused: 5},
{name: 'Phillip', confused: 30},
{name: 'Marcus', confused: 50},
{name: 'Tony', confused: 20},
{name: 'Pamela', confused: 60},
{name: 'Dan', confused: 8},
{name: 'Tessa', confused: 17},
{name: 'Scott', confused: 32},
{name: 'Adrian', confused: 54},
{name: 'Pira', confused: 49},
{name: 'Josh', confused: 33}
];

var w = 1024;
var h = 612;
var bgColor = "#FFFFE6"
var barW = 25;
var margin = 25;
var scale = 6;

var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h)
            .style("background-color", bgColor);

svg.selectAll("rect")
  .data(dataset)
  .enter()
  .append("rect")
  .attr("x", function(d, i) {
    return margin + i * (w / dataset.length);
  })
  .attr("y", function(d) {
    return h - (d.confused * scale);
  })
  .attr("width", barW)
  .attr("height", function(d) {
    return d.confused * scale;
  })
  .attr("fill", "lightgreen");

svg.selectAll(".name")
  .data(dataset)
  .enter()
  .append("text")
  .attr("class", "name")
  .text(function(d) {
    return d.name
  })
  .attr("x", function(d, i) {
    return margin + i * (w / dataset.length) + barW / 2;
  })
  .attr("y", function(d) {
    return h - (d.confused * scale) - 10;
  })
  .attr("text-anchor", "middle");

svg.selectAll(".num")
  .data(dataset)
  .enter()
  .append("text")
  .attr("class", "num")
  .text(function(d) {
    return d.confused;
  })
  .attr("x", function(d, i) {
    return margin + i * (w / dataset.length) + barW / 2;
  })
  .attr("y", function(d) {
    return h - (d.confused * scale) + 20;
  })
  .attr("text-anchor", "middle");
