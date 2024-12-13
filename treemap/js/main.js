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
    .attr("class", "tile")
    .attr("data-name", (d) => d.data.name)
    .attr("data-category", (d) => d.data.category)
    .attr("data-value", (d) => d.data.value)
    .style("fill", (d) => color(d.data.category))
    .style("opacity", (d) => opacity(d.data.value));

  // Add text labels to each node
  cells
    .append("text")
    .attr("x", 3)
    .attr("y", 13)
    .text((d) => d.data.name)
    .style("font-size", "10px")
    .style("fill", "white");

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

  // LEGEND //

  const lengendWidth = 200;
  const lengendHeight = 20;
  const legendSpacing = 5;
  const legendPadding = 10;

  const legend = svg
    .append("g")
    .attr("id", "legend")
    .attr("transform", `translate(${(mapWidth + margin - lengendWidth, 0)})`);

  const categories = color.domain();

  const legendItems = legend
    .selectAll(".legend-item")
    .data(categories)
    .enter()
    .append("g")
    .attr("class", "legend-item")
    .attr(
      "tranform",
      (d, i) => `translate(0, ${i * lengendHeight + legendSpacing})`
    );

  legendItems
    .append("rect")
    .attr("width", lengendWidth)
    .attr("height", lengendHeight)
    .attr("fill", (d) => color(d))
    .attr("stroke", "black");

  legendItems
    .append("text")
    .attr("x", lengendHeight + legendPadding)
    .attr("y", lengendHeight / 2)
    .attr("dy", "0.35em")
    .style("font-size", "12px")
    .style("fill", "black")
    .text((d) => d);
});
