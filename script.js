// SETUP

// select the container in which to include the data visualization and begin by appending a title and a description
const container = d3.select("div.container");

container
  .append("h1")
  .attr("id", "title")
  .text("US Educational Attainment");

container
  .append("h3")
  .attr("id", "description")
  .text("Bachelor's degree or higher 2010-2014");

// for the SVG, define an object with the margins, used to nest the SVG content safe inside the SVG boundaries
// as there is no need for axis, the margin is used to safely draw the legend and the overall visualization
const margin = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 20
}
// define and append an SVG element
const width = 800 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

const svgContainer = container
  .append("svg")
  .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`);

// define the group element nested inside the SVG, in which to actually plot the map
const svgCanvas = svgContainer
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);



// create an object for the values of the legend
// defining the percentages and the matching color for the fill of the rectangle elements
const legendValues = {
  percentage: [3, 12, 21, 30, 39, 48, 57, 66],
  color: ["#E5F5E0", "#C7E9C0", "#A1D99B", "#74C476", "#41AB5D", "#238B45", "#006D2C", "#00441B"],
  height: 15,
  width: 30
}

// create and append a legend at the top of the SVG
const legend = svgCanvas
  .append("g")
  .attr("id", "legend")
  // translate the legend as to have the last rectangle on the very edge of the container
  .attr("transform", `translate(${width - legendValues.percentage.length * legendValues.width}, 0)`);

// in the group referencing the legend, append one rectangle each for the defined values
legend
  .selectAll("rect")
  .data(legendValues.percentage)
  .enter()
  .append("rect")
  .attr("width", legendValues.width)
  .attr("height", legendValues.height)
  // include the rectangle elements on the basis of their width, one after the other
  .attr("x", (d, i) => i*legendValues.width)
  // include the rectangle elements at the top of the canvas
  .attr("y", 0)
  .attr("fill", (d, i) => legendValues.color[i]);

// beside the rectangles, include text elements as labels for the rectangle elements themselves
legend
  .selectAll("text")
  .data(legendValues.percentage)
  .enter()
  .append("text")
  .attr("x", (d,i) => i*legendValues.width)
  // position the labels below the rectangle elements
  .attr("y", legendValues.height*2)
  .style("font-size", "0.6rem")
  .text((d) => `${d}%`);


// fetch the JSON object responsible for the SVG shapes
// when retrieving the object, call a function to draw the map, based on the data
const URL_SVG = "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json";

fetch(URL_SVG)
  .then((response) => response.json())
  .then((json) => drawMap(json));

// include a one element for each county, drawing the shape with a path element
function drawMap(data) {
  console.log(data);
  let topology = topojson.feature(data, data.objects.counties);


  const path = d3
    .geoPath();

  console.log(topology);
  // console.log(path(topology));
  
  svgCanvas
    .selectAll("path")
    .data(topology.features)
    .enter()
    .append("path")
    .attr("d", path);
}