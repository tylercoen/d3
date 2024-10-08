//https://gist.github.com/mattrelph/2526cc430c195d1cad2661d503536469

const EDU_URL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
const COUNTIES_URL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

const containerWidth = 1000;
const containerHeight = 750;
const padding = 25;
const graphWidth = containerWidth - 2 * padding;
const graphHeight = containerHeight - 2 * padding;

Promises.all([d3.json(EDU_URL), d3.json(COUNTIES_URL)]).then(
  ([eduData, countyData]) => {
    // create counties, states, and path
  }
);
