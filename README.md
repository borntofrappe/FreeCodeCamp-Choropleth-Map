<!-- Link to the work-in-progress pen right [here](). -->

## Preface

For the fourth and penultimate project necessary to earn the 'Data Visualization Projects' certification @freeCodeCamp, the task is to visualize arbitrary data through a choropleth map, and with the D3.js library.

## Design

The design of the project replicates the structure included for the previous three efforts: a light card on a dark background, a bold header, short description followed with the very visualization.

## User Stories

For the project to fulfill the testing suite set up by the freeCodeCamp team, the visualization needs to fulfill a few user stories:

- [ ] there exist a title, with `id="title"`;

- [ ] there exist a description, with `id="description`;

- [ ] the choropleth should display counties with `class="county` representing the data;

- [ ] there should be at least 4 different fill colors;

- [ ] counties should have two attributes, `data-fips` and `data-education`, relaying information regarding the corresponding data values;

- [ ] there exist one county for each data point;

- [ ] there exist a legend with `id="legend"`;

- [ ] in the legend, there exist at least 4 fill colors;

- [ ] upon hovering on each area, a tooltip with `id="tooltip"` shows additional information;

- [ ] the tooltip should have a `data-education` attribute matching the value of the active data-

All this making use of the following datasets:

- US Education Data:

  ```code
  https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json
  ```

- US County Data:

  ```code
  https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json
  ```
