Link to the work-in-progress pen right [here](https://codepen.io/borntofrappe/pen/RBdrPG/).

## Preface

For the fourth and penultimate project necessary to earn the 'Data Visualization Projects' certification @freeCodeCamp, the task is to visualize arbitrary data through a choropleth map, and with the D3.js library.

## Design

The design of the project replicates the structure included for the previous three efforts: a light card on a dark background, a bold header, short description followed with the very visualization.

For reference, a choropleth map just like [this one](https://codepen.io/freeCodeCamp/full/EZKqza).

## User Stories

For the project to fulfill the testing suite set up by the freeCodeCamp team, the visualization needs to fulfill a few user stories:

- [x] there exist a title, with `id="title"`;

- [x] there exist a description, with `id="description`;

- [x] the choropleth should display counties with `class="county` representing the data;

- [x] there should be at least 4 different fill colors;

- [x] counties should have two attributes, `data-fips` and `data-education`, relaying information regarding the corresponding data values;

- [x] there exist one county for each data point;

- [x] there exist a legend with `id="legend"`;

- [x] in the legend, there exist at least 4 fill colors;

- [x] upon hovering on each area, a tooltip with `id="tooltip"` shows additional information;

- [x] the tooltip should have a `data-education` attribute matching the value of the active data point.

All this making use of the following datasets:

- US Education Data:

  ```code
  https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json
  ```

- US County Data:

  ```code
  https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json
  ```

## D3.js

Including the title, description, the svg container and the legend is achieved much alike for the previous three projects.

The tooltip as well promises to replicate the previous structure. The different section of the project, and the main feature behind the application, relates to the choropleth map.

This makes use of data from the two provided URL, which warrant a few notes.

**Data**

```code
https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json
```

The first URL references an array of objects, with one object for each county.

The objects detail the following fields:

- `fips`, which is apparently a five digit standard identifying all US counties;
- `state`, the state of the county;
- `area_name`, presumably the name of the county itself,
- `bachelorsOrHigher`, a float describing adults over 25 with a bachelor degree or higher title of education. Presumably this float references to a percentage, given the lack of additional numbers supporting a different reference (such as per 1000 habitants).

This URL has therefore the information which needs to characterize the different areas in the SVG, and mostly information which needs to be shown in the tooltip.

```code
https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json
```

The second URL, on the other hand, provides a giant object, with two fields in `topology` and `objects`.

This last field provides an object with a `county` field, itself nesting an object with a `type` and `geometries`.

This last field (json.objects.counties.geometries) refers to an array of object, which are presumably used to draw the different areas for the counties.

These objects detail the following fields:

- `type`, describing the shape of the state (such as 'Polygon');
- `id`, an identifier which is notably similar and possibly exactly like the `fips` code;
- `arcs`, an array of arrays, detailing what could be described as a sequence of integers. Given the `d3.geo` function in D3.js, these are the values used by the library to actually draw the different shapes.

While the first URL contains therefore the data behind the application, the second URL is necessary to actually draw the different counties. 

**GeoPath**

D3.js allows to obtain SVG syntax from JSON files which detail longitude and latitude coordinates, using the `d3.geoPath()` function.

The method, as mentioned in the [documentation](https://github.com/d3/d3-geo#d3-geo) makes use of GeoJSON, a JSON format used to encode geographic data structures, and specifically of an object of type `FeatureCollection`. 

The library allows to also take advantage of an extension called [TopoJSON](https://github.com/topojson/topojson). It is, apparently, an extension of the GeoJSON format which details geographical coordinates in alternative formats, generating objects of type `Topology`. The response obtained from the first URL provides exactly such an object and it is therefore necessary to use the extension, to "manipulate" the object into a format understandable by `d3.geoPath()`.

First, it is necessary to include the extension. In the `index.html` file, a script element can be included to reference the library through a CDN. 

```HTML
<script src="https://cdnjs.cloudflare.com/ajax/libs/topojson/3.0.2/topojson.min.js"></script>
```

Once included, the script file can benefit from its methods, among which `topojson.feature`.

This is a method taking as input an object of type `Topology` and returning a `FeatureCollection`, which is exactly what the project needs. Further research on the [extension](https://github.com/topojson/topojson) is warranted, but understanding the specified method is temporarily sufficient.

The method takes as input the object of type `Topology` and the subset of coordinates detailing the soon to be feature collection.

```JS
let feature = topojson.feature(data, data.objects.counties);
```

The method then returns then feature collection, which can be used in the `geoPath()` method to obtain the SVG coordinates necessary to draw the different areas.

```JS
const path = d3
  .geoPath();
// SVG syntax
console.log(path(feature));
```

This does display the US map in the SVG, but the map itself exceeds the boundaries of the container.

To show the map within the page, a `transform` property is included for all path elements, extending the width and height to better fit the container. It is a rough solution, and further research on maps, and projections, is warranted. 

```JS
svgCanvas
  .selectAll("path")
  .data(feature.features)
  .enter()
  .append("path")
  .attr("d", path)
  .attr("transform", `scale(0.82, 0.62)`)
  .attr("class", "county");
```

**Fetch URLs**

The project relies on the information found in two different URL and it is therefore necessary to include the JSON formats located in both. To achieve such a feat, the following logic is implemented:

- retrieve the data providing information on the counties. You can here find details on the area, such as the name of the county, the name of the state, the fip code, the education metric. The fip code is actually crucial, as it will be noted soon enough.

- retrieve the data providing information on the counties' shapes. Here you find the coordinates interpreted by the `d3.geoPath` function to include SVG syntax, as well as an ID property differentiating the shape. Much alike the fip code, this value is essential, as noted hereafter-

- merge the two dataset, appending the necessary values in the JSON format storing the counties' coordinates. The merge is achieved thanks to the fip code and the id identifier, as these identify the same county. The merge is completed including the educational data in the coordinates' counterpart, as the receiving format is used with the `d3.geoPath` function, to actually draw the shapes.

- draw the counties with path elements and include pertinent data, with information retrieved from the merged dataset. The coordinates, interpreted in the object of type `FeatureCollection`, are included in the `d` attribute of the path element, while the data identifying the counties is included in the data attributes demanded by the user stories, in the path and tooltip elements. Most importantly, the data describing the education metric is included with a callback function in the `fill` attribute, successfully creating the choropleth map while describing different colors.

**Color Scale**

The `fill` property visually details the education of each county, by means of describing the colors defined in the legend. The colors themselves can be included with an if/else statement, or through a _quantize_ scale. This is a scale which differentiates itself from a linear scale in having a _discrete_ output. Based on the number of values included in the output range, the domain is divided in equal sections. Once included, the input is then mapped to one of the options:

```JS
const colorScale = d3
  .scaleQuantize()
  .domain([0, 100])
  .range(["red", "blue", "white"]);
```

The described scale divides the domain in three intervals, [0-33, 33-67, 67-100], and depending on the input value, the scale is able to map one of the discrete colors:

```JS
colorScale(12); // "red"
colorScale(80); // "white"
```