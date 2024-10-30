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
      .attr("id", "tooltip");

    // create color scale
    var minEducation = d3.min(eduData, (d) => d.bachelorsOrHigher);
    var maxEducation = d3.max(eduData, (d) => d.bachelorsOrHigher);
    var stepVariance = Math.abs(maxEducation) - Math.abs(minEducation) / 10;

    //create svg
    var svg = d3
      .select("#map")
      .append("svg")
      .attr("width", containerWidth)
      .attr("height", containerHeight);
    var targetCounty;

    //draw the counties
    svg
      .selectAll("path")
      .data(usCounties.features)
      .enter()
      .append("path")
      .style("fill", function (d) {
        targetCounty = eduData.filter(function (object) {
          return object.fips == d.id;
        });
        if (targetCounty.length > 0) {
          return d3.interpolateGreens(
            1 - targetCounty[0].bachelorsOrHigher / Math.round(maxEducation)
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
        targetCounty = eduData.filter(function (object) {
          return object.fips == d.id;
        });
        if (targetCounty.length > 0) {
          return targetCounty[0].bachelorsOrHigher;
        }
      })
      .attr("d", path)
      .on("mouseover", function (d, i) {
        d3.select(this).style("stroke", "black").style("stroke-width", 0.9);
        targetCounty = eduDataById(eduData, d.id);
        tooltip
          .html(
            targetCounty[0].area_name +
              ", " +
              targetCounty[0].state +
              "<br/>" +
              targetCounty[0].bachelorsOrHigher +
              "%"
          )
          .attr("data-education", targetCounty[0].bachelorsOrHigher)
          .style("opacity", 0.9);
        var bbox = this.getBBox(); // Get bounding box of the county path
        var x = bbox.x + bbox.width + 10; // Position tooltip 10px to the right
        var y = bbox.y + bbox.height / 2 - tooltip.node().offsetHeight / 2; // Center tooltip vertically
        tooltip.style("left", x + 500 + "px").style("top", y + 200 + "px");
      })
      .on("mouseout", function (d, i) {
        d3.select(this).style("stroke", "grey").style("stroke-width", 0.5);
        tooltip.style("opacity", 0);
      });

    svg
      .append("path")
      .datum(usStates)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-linejoin", "round")
      .attr("class", "states")
      .attr("d", path);

    // legend gradient
    var defs = svg.append("defs");
    var numStops = 2;
    var numBlocks = 10;
    var gradient = [];
    for (var n = 0; n < numBlocks; n++) {
      gradient[n] = defs
        .append("linearGradient")
        .attr("id", "svgGradient" + n)
        .attr("x1", "0%")
        .attr("x2", "100%")
        .selectAll("stop")
        .data(d3.range(numStops))
        .enter()
        .append("stop")
        .attr("offset", (d) => d / numStops)
        .attr("stop-color", function (d, i) {
          return d3.interpolateGreens(1 - (d + n) * 0.1);
        });
    }

    //legend

    // legend boxes

    //legend text
  }
);
function eduDataById(eduData, id) {
  var targetId = eduData.filter(function (object) {
    return object.fips == id;
  });
  return targetId.slice();
}
