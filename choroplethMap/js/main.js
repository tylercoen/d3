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

const projection = d3
  .geoAlbersUsa()
  .scale(1000)
  .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);

var createChart = (data) => {
  const color = d3.scaleQuantize([1, 10], d3.schemeBlues[9]);
  const path = d3.geoPath();
  const format = (d) => `${d}%`;
  var educationMap = new Map(data.map((d) => [d.fips, d.bacheloresOrHigher]));
  console.log("createChart ran");
  console.log(educationMap);
};

var mapCounties = (data, map) => {
  const counties = topojson.feature(data, data.counties.geometries);
  const states = topojson.feature(data, data.states.geometries);
  console.log(states);

  //const statemap = new Map(states.Feature.map((data) => [data.id, d]));
  console.log("mapCounties ran");
};

var x = d3.scaleLinear().domain([1, 10]).rangeRound([600, 860]);
var color = d3
  .scaleThreshold()
  .domain(d3.range(2, 10))
  .range(d3.schemeBlues[9]);
var g = svg
  .append("g")
  .attr("class", "key")
  .attr("transform", "translate(0,40)");

g.selectAll("rect")
  .data(
    color.range().map(function (d) {
      d = color.invertExtent(d);
      if (d[0] == null) d[0] = x.domain()[0];
      if (d[1] == null) d[1] = x.domain()[1];
      return d;
    })
  )
  .enter()
  .append("rect")
  .attr("height", 8)
  .attr("x", function (d) {
    return x(d[0]);
  })
  .attr("width", function (d) {
    return x(d[1] - x(d[0]));
  })
  .attr("fill", function (d) {
    return color(d[0]);
  });

g.append("text")
  .attr("class", "caption")
  .attr("x", x.range()[0])
  .attr("y", -6)
  .attr("fill", "#000")
  .attr("text-anchor", "start")
  .attr("font-weight", "bold")
  .text("Education Rate");

g.call(
  d3
    .axisBottom(x)
    .tickSize(13)
    .tickFormat(function (x, i) {
      return i ? x : x + "%";
    })
    .tickValues(color.domain())
)
  .select(".domain")
  .remove();

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
    //createChart(eduData);
    //mapCounties(counties);
  })
  .catch(function (error) {
    console.error("error fecthing data: ", error);
  });

//current choropleth map https://observablehq.com/@d3/choropleth/2?intent=fork
