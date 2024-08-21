/*
User Story #1: My choropleth should have a title with a corresponding id="title".

User Story #2: My choropleth should have a description element with a corresponding id="description".

User Story #3: My choropleth should have counties with a corresponding class="county" that represent the data.

User Story #4: There should be at least 4 different fill colors used for the counties.

User Story #5: My counties should each have data-fips and data-education properties containing their corresponding fips and education values.

User Story #6: My choropleth should have a county for each provided data point.

User Story #7: The counties should have data-fips and data-education values that match the sample data.

User Story #8: My choropleth should have a legend with a corresponding id="legend".

User Story #9: There should be at least 4 different fill colors used for the legend.

User Story #10: I can mouse over an area and see a tooltip with a corresponding id="tooltip" which displays more information about the area.

User Story #11: My tooltip should have a data-education property that corresponds to the data-education of the active area.

Here are the datasets you will need to complete this project:

US Education Data:https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json
US County Data:https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json

eduData[0] = {fips: 1001, state: 'AL', area_name: 'Autauga County', bachelorsOrHigher: 21.9}

*/
const svg = d3.select("svg");
const width = +svg.attr("width");
const height = +svg.attr("height");

const educationMap = new Map();

const path = d3.geoPath();

const g = svg
  .append("g")
  .attr("class", "key")
  .attr("transform", "translate(0,40)");

Promise.all([
  d3.json(
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
  ),
  d3.json(
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"
  ),
])
  .then(([educationData, us]) => {
    educationData.forEach((d) => {
      educationMap.set(d.fips, +d.bachelorsOrHigher);
    });
    ready(us);
  })
  .catch((error) => {
    console.error("Error fetching data: ", error);
  });
// After loading the data and populating educationMap
const educationValues = Array.from(educationMap.values());
const minEducation = d3.min(educationValues);
const maxEducation = d3.max(educationValues);

// Update x scale to use the actual data range
const x = d3
  .scaleLinear()
  .domain([minEducation, maxEducation])
  .rangeRound([600, 860]);

// Create a more granular color scale
const color = d3
  .scaleQuantize()
  .domain([minEducation, maxEducation])
  .range(d3.schemeBlues[9]);

// Update the legend
g.selectAll("rect")
  .data(color.range().map((d) => color.invertExtent(d)))
  .join("rect")
  .attr("height", 8)
  .attr("x", (d) => x(d[0]))
  .attr("width", (d) => x(d[1]) - x(d[0]))
  .attr("fill", (d) => color(d[0]));

// Update the axis
g.call(
  d3
    .axisBottom(x)
    .tickSize(13)
    .tickFormat((d) => `${d.toFixed(1)}%`)
    .ticks(9)
)
  .select(".domain")
  .remove();

// In the ready function, update the fill attribute
svg
  .append("g")
  .attr("class", "counties")
  .selectAll("path")
  .data(topojson.feature(us, us.objects.counties).features)
  .join("path")
  .attr("fill", (d) => {
    const value = educationMap.get(d.id);
    return value ? color(value) : "#ccc"; // Use a light grey for missing data
  })
  .attr("d", path)
  .append("title")
  .text((d) => {
    const value = educationMap.get(d.id);
    return value ? `${value.toFixed(1)}%` : "No data";
  });

function ready(us) {
  svg
    .append("g")
    .attr("class", "counties")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .join("path")
    .attr("fill", (d) => color(educationMap.get(d.id)))
    .attr("d", path)
    .append("title")
    .text((d) => `${educationMap.get(d.id)}%`);

  svg
    .append("path")
    .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
    .attr("class", "states")
    .attr("d", path);
}
//current choropleth map https://observablehq.com/@d3/choropleth/2?intent=fork
