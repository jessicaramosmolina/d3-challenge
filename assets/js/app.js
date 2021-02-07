// @TODO: YOUR CODE HERE!
// Define SVG area dimensions
var svgWidth = 1200;
var svgHeight = 900;

// Define the chart's margins as an object
var chartMargin = {
  top: 20,
  right: 20,
  bottom: 30,
  left: 40
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area, and set the dimensions
var svg = d3
  .select("body")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append group element
var chartGroup = svg
  .append("g")
  .attr("transform", "translate(" + chartMargin.left + "," + chartMargin.top + ")")
  .attr("class","main");

// Read CSV
d3.csv("assets/data/data.csv").then(function(data) {
    console.log(data);
});