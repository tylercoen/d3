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
  .attr("id", "legend")
  .attr("transform", "translate(0,40)");

let usaTopo; // More descriptive name for US data
let color;

function updateChoropleth(educationValues) {
  if (!educationValues.length) return; // Early exit if no data

  const minEducation = d3.min(educationValues);
  const maxEducation = d3.max(educationValues);

  color = d3
    .scaleQuantize()
    .domain([minEducation, maxEducation])
    .range(d3.schemeSpectral[9]);

  // Refactored legend

  // legend container
  const legendWidth = 300;
  const legendHeight = 8;
  const legendXStart = 600;

  // define the x scale for the legend
  const xLegend = d3
    .scaleLinear()
    .domain([minEducation, maxEducation])
    .range([legendXStart, legendXStart + legendWidth]);

  // create the legend group
  const legendGroup = svg.append("g").attr("transform", "translate(-50, 50)"); //position the legend

  // create a set of rectangles for the legend
  legendGroup
    .selectAll("rect")
    .data(color.range().map((d) => color.invertExtent(d)))
    .join("rect")
    .attr("x", (d) => xLegend(d[0])) //position the rectangles
    .attr("y", 0) //vertical position
    .attr("width", (d) => xLegend(d[1]) - xLegend(d[0])) // ensure correct width
    .attr("height", legendHeight)
    .attr("fill", (d) => color(d[0])); // fill each box with its color

  // Add an axis for the legend
  legendGroup
    .call(
      d3
        .axisBottom(xLegend)
        .tickSize(13)
        .tickFormat((d) => `${d.toFixed(1)}%`)
        .ticks(9)
    )
    .select(".domain")
    .remove();
}

Promise.all([
  d3.json(
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
  ),
  d3.json(
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"
  ),
])
  .then(([educationData, us]) => {
    usaTopo = us; // Using the new name
    educationData.forEach((d) => {
      educationMap.set(d.fips, +d.bachelorsOrHigher);
      d.id = d.fips;
      d.education = +d.bachelorsOrHigher;
    });

    const educationValues = Array.from(educationMap.values());
    updateChoropleth(educationValues);

    ready(usaTopo);
  })
  .catch((error) => {
    console.error("Error fetching data: ", error);
  });

function ready(usaTopo) {
  const counties = svg.append("g").attr("class", "county");

  counties
    .selectAll("path")
    .data(topojson.feature(usaTopo, usaTopo.objects.counties).features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("data-fips", (d) => d.id)
    .attr("data-education", (d) => educationMap.get(d.id))
    .attr("fill", (d) => {
      const value = educationMap.get(d.id);
      return value ? color(value) : "#ccc";
    })
    .append("title")
    .text((d) => `${educationMap.get(d.id)}%`);

  svg
    .append("path")
    .datum(
      topojson.mesh(
        usaTopo,
        usaTopo.objects.states.geometries,
        (a, b) => a.id !== b.id
      )
    )
    .attr("class", "states")
    .attr("d", path);
}

//Update the title element of each county path
/*
svg
  .select(".county")
  .selectAll("path")
  .each(function (d) {
    d3.select(this)
      .append("title")
      .attr("id", "tooltip")
      .attr("data-education", educationMap.get(d.id))
      .attr("data-fips", d.id)
      .text((d) => `${educationMap.get(d.id)}%`);
  });
// Create a tooltip element

const tooltip = d3
  .select("body")
  .append("div")
  .attr("id", "tooltip")
  .style("position", "absolute")
  .style("opacity", 0)
  .style("background-color", "white")
  .style("border", "1px solid #ccc")
  .style("padding", "4px");
svg
  .selectAll("path")
  .on("mouseover", function (event, d) {
    tooltip.transition().duration(200).style("opacity", 0.9);

    tooltip
      .html(
        `
      <p><strong>Education Level:</strong> ${d.data.education}%</p>
      <p><strong>FIPS Code:</strong> ${d.data.fips}</p>`
      )
      .style("left", event.pageX + 10 + "px")
      .style("top", event.pageY + 10 + "px");
  })
  .on("mouseout", function () {
    tooltip.transition().duration(500).style("opacity", 0);
  });*/
//current choropleth map https://observablehq.com/@d3/choropleth/2?intent=fork
