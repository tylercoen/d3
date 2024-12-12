//https://d3-graph-gallery.com/graph/treemap_custom.html
//https://www.freecodecamp.org/learn/data-visualization/data-visualization-projects/visualize-data-with-a-treemap-diagram

const VIDEO_GAME_SALES_URL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";

const containerWidth = 1200;
const containerHeight = 650;
const padding = 25;
const mapWidth = containerWidth - 2 * padding;
const mapHeight = containerHeight - 2 * padding;
const margin = 100;
var svg = d3
  .select("#treemap")
  .append("svg")
  .attr("width", mapWidth + 2 * margin)
  .attr("height", mapHeight + 2 * margin)
  .append("g")
  .attr("transform", "translate(" + margin + "," + margin + ")");

Promise.all([d3.json(VIDEO_GAME_SALES_URL)]).then(([data]) => {
  var videoGameSalesData = data.children;
  console.log(videoGameSalesData);
  ///console.log(videoGameSalesData[0].children[0].value);

  const root = d3
    .hierarchy(data)
    .sum((d) => d.value)
    .sort((a, b) => b.value - a.value);

  //create svg
  // Create the treemap layout
  var treemap = d3.treemap().size([mapWidth, mapHeight]).padding(1);

  // Apply the treemap layout to the hierarchy
  treemap(root);

  const color = d3
    .scaleOrdinal()
    .domain([
      "2600",
      "Wii",
      "NES",
      "GB",
      "DS",
      "X360",
      "PS3",
      "PS2",
      "SNES",
      "GBA",
      "PS4",
      "3DS",
      "N64",
      "PS",
      "XB",
      "PC",
      "PSP",
      "XOne",
    ])
    .range(d3.schemeCategory10);

  var opacity = d3.scaleLinear().domain([10, 30]).range([0.5, 1]);
  ///////////////////////////////////////////////////////////////

  // Create a group for each node
  const cells = svg
    .selectAll("g")
    .data(root.leaves())
    .enter()
    .append("g")
    .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

  // Create rectangles for each node
  cells
    .append("rect")
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0)
    .style("fill", "steelblue");

  // Add text labels to each node
  cells
    .append("text")
    .attr("x", 3)
    .attr("y", 13)
    .text((d) => d.data.name)
    .style("font-size", "10px")
    .style("fill", "white");

  ///////////////////////////////////////////////
  // use this information to add rectangles:
  svg
    .selectAll("rect")
    .data(root.leaves())
    .enter()
    .append("rect")
    .attr("x", (d) => d.x0)
    .attr("y", (d) => d.y0)
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0)
    .style("stroke", "black");
  //.style("fill", (d) => color(d.parent.data.name)) remove the use of color and create a function that fills by category
  //.style("opacity", (d) => opacity(d.data.value));
});
