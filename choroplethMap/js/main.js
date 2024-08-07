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

var svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

//var educationMap = d3.map(); this isn't working check what's going on with map

var path = d3.geoPath();

var x = d3.scaleLinear().domain([1, 10]).rangeRound([600, 860]);
var color = d3
  .scaleThreshold()
  .domain(d3.range(2, 10))
  .range(d3.schemeBlues[9]);

var g = svg
  .append("g")
  .attr("class", "key")
  .attr("transform", "translate(0,40)");

var promises = [
  d3.json(
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
  ),
  d3.json(
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"
  ),
];
Promise.all(promises)
  .then(function (allData) {
    var eduData = allData[0];
    var counties = allData[1]["objects"];
    console.log("promises returned");
    console.log(eduData[0]);
    console.log(counties);
  })
  .catch(function (error) {
    console.error("error fecthing data: ", error);
  });

//current choropleth map https://observablehq.com/@d3/choropleth/2?intent=fork
