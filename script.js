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