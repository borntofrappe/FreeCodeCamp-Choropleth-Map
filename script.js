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

// include a div for the tooltip
// text is included in the two paragraphs appended to the container
const tooltip = container
  .append("div")
  .attr("id", "tooltip");
  
tooltip
  .append("p")
  .attr("class", "area");

tooltip
  .append("p")
  .attr("class", "education");

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

// create a quantize scale, a scale which allows to take as input a continuous interval and returns as output one discrete value
// the discrete value in question is attributed on the basis of the input, which is sectioned into intervals
// five values -> five intervals in which the input is divided
// the range in question: the colors chosen for the legend
const colorScale = d3
  .scaleQuantize()
  .range(legendValues.color);

/* store in two constant 
- the URL responsible for the SVG values making up the shapes of the counties
- the URL responsible for educational data of each each county

the logic is as follows:
1. fetch the data from the URL regarding eduational data
1. consider the JSON format out of the response
1. pass the JSON to a function which includes the data in the matching data point which describes the SVG values
1. call a function to draw the counties on the basis of these values
1 as these values now obtain the educational data as well, include the pertinent information in each path element
*/

const URL_DATA = "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json";
const URL_SVG = "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json";

// first off, retrieve educational data and pass the json output in a function responsible for the merge
fetch(URL_DATA)
  .then((response) => response.json())
  .then((json) => mergeData(json));

// create a function which takes as input the educational data and merges its values in the SVG values
function mergeData(data) {

  // fetch the SVG values and include the JSON format from the response
  fetch(URL_SVG)
    .then((response) => response.json())
    .then((json) => {
      // loop through the array of educational data 
      for(let i = 0; i < data.length; i++) {
        // for each educational data point, consider the .fips property
        // this provides the link with the SVG values, in the matching property of .id
        let fips = data[i].fips;

        // loop through the array of geometries for the counties (geometries then used when drawing the map)
        let geometries = json.objects.counties.geometries;
        for(let j = 0; j < geometries.length; j++) {
          // consider the id of each array item
          let id = geometries[j].id;
          // if the fips value matches the id counterpart
          if(fips === id) {
            // update the object with the SVG values with the properties of the matching object in the educational array
            geometries[j] = Object.assign({}, geometries[j], data[i]);
            // stop looping as to find the next match
            break;
          }
        }
      }
      // return the entire JSON format, now updated with the matching educational values
      return json;
    })
    // call a function to draw the map, on the basis of the updated JSON format
    .then((json) => drawMap(json));
}

// with the JSON format including SVG values _and_ educational data draw the counties and include matching data
function drawMap(data) {

  // with the obtained data, include the domain of the scale
  // this is an interval ranging between 0 and 100%
  colorScale.domain([0, d3.max(data.objects.counties.geometries, (d) => d.bachelorsOrHigher)]);
  
  // for the map itself, the data provided by the URL returns an obejct of type 'Topology'
  // console.log(data);

  // as d3.geoPath() works with GeoJSON, it is first necessary to convert the object into a type of understandable format
  // topojson.feature is a function from the topojson library which converts a topology to a feature collection
  // it accepts two arguments, the object itself and the subset to be "feature-ized"
  let feature = topojson.feature(data, data.objects.counties);
  // console.log(feature);

  // include the function which creates the SVG values from the coordinates included in the JSON file
  const path = d3
    .geoPath();  

  // the path function accepts as argument the feature collection and returns the SVG syntax required to draw the shape 
  // console.log(path(feature));

  // append a path element for each feature
  // the d attribute is dicated by the geoPath function, which gets applied to each data point
  // the educational data is then retrieved, for each data point on the basis of its index, in the properties included with the previous merge
  svgCanvas
    .selectAll("path")
    .data(feature.features)
    .enter()
    .append("path")
    // on mouseenter, display the tooltip by altering its opacity
    // include the prescribed attributes and position the element near the cursor
    .on("mouseenter", (d,i) => {
      tooltip
        .style("opacity", 1)
        .attr("data-fips", data.objects.counties.geometries[i].fips)
        .attr("data-education", data.objects.counties.geometries[i].bachelorsOrHigher)
        // position the tooltip close to the cursor, using d3.event.layerX and d3.event.layerY
        .style("left", `${d3.event.layerX + 5}px`)
        // as the y scale is offset by the margin value, include the margin value to have the tooltip close to the actual hovered cell
        .style("top", `${d3.event.layerY + 5}px`);
      // include the text in the two paragraph elements
      tooltip
        .select("p.area")
        .text(() => `${data.objects.counties.geometries[i].area_name}, ${data.objects.counties.geometries[i].state}`);
      tooltip
        .select("p.education")
        .text(() => `${data.objects.counties.geometries[i].bachelorsOrHigher}%`);
    })
    // on mouseout, hide the tooltip
    .on("mouseout", () => tooltip.style("opacity", 0))
    .attr("d", path)
    .attr("transform", `scale(0.82, 0.62)`)
    .attr("class", "county")
    // include the attributes prescribed by the user stories
    .attr("data-fips", (d, i) => data.objects.counties.geometries[i].fips)
    .attr("data-state", (d, i) => data.objects.counties.geometries[i].state)
    .attr("data-area", (d, i) => data.objects.counties.geometries[i].area_name)
    .attr("data-education", (d, i) => data.objects.counties.geometries[i].bachelorsOrHigher)
    // include a fill property dependant on the bachelorsOrHigher property and the color scale
    .attr("fill", (d, i) => colorScale(data.objects.counties.geometries[i].bachelorsOrHigher));
}