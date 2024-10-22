//https://gist.github.com/mattrelph/2526cc430c195d1cad2661d503536469

const EDU_URL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
const COUNTIES_URL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

const containerWidth = 1200;
const containerHeight = 650;
const padding = 25;
const graphWidth = containerWidth - 2 * padding;
const graphHeight = containerHeight - 2 * padding;

Promise.all([d3.json(EDU_URL), d3.json(COUNTIES_URL)]).then(
  ([eduData, countyData]) => {
    //create counties, states and paths
    var usCounties = topojson.feature(countyData, countyData.objects.counties);
    var usStates = topojson.mesh(
      countyData,
      countyData.objects.states,
      function (a, b) {
        return a !== b;
      }
    );
    var path = d3.geoPath();

    //create base tooltip

    var tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .attr("id", "tooltip")
      .style("background", "#faedcd")
      .style("color", "#344e41")
      .style("opacity", "0");

    // create color scale
    var minEducation = d3.min(eduData, (d) => d.bachelorsOrHigher);
    var maxEducation = d3.max(eduData, (d) => d.bachelorsOrHigher);
    var stepVariance = Math.abs(maxEducation) - Math.abs(minEducation) / 10;

    //create svg
    var svg = d3
      .select("#container")
      .append("svg")
      .attr("width", containerWidth)
      .attr("height", containerHeight);
    var singleCounty;

    //draw the counties
    svg
      .selectAll("path")
      .data(usCounties.features)
      .enter()
      .append("path")
      .style("fill", function (d) {
        singleCounty = eduData.filter(function (object) {
          return object.fips == d.id;
        });
        if (singleCounty.length > 0) {
          return d3.interpolateGreens(
            1 - singleCounty[0].bachelorsOrHigher / Math.round(maxEducation)
          );
        } else {
          return "grey";
        }
      })
      .style("stroke", "grey")
      .attr("stroke-width", "0.5px")
      .attr("class", "county")
      .attr("data-fips", (d) => d.id)
      .attr("data-education", function (d) {
        singleCounty = eduData.filter(function (object) {
          return object.fips == d.id;
        });
        if (singleCounty.length > 0) {
          return singleCounty[0].bachelorsOrHigher;
        }
      })
      .attr("d", path);
  }
);
