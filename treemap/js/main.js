const VIDEO_GAME_SALES_URL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";

const containerWidth = 1200;
const containerHeight = 650;
const padding = 25;
const mapWidth = containerWidth - 2 * padding;
const mapHeight = containerHeight - 2 * padding;
const margin = 100;
const tooltip = d3.select("#tooltip");

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
  console.log("root.leaves():", root.leaves());
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
    .data(root.leaves(), (d) => d.data.name)
    .enter()
    .append("g")
    .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

  // Create rectangles for each node
  cells
    .append("rect") // Rectangles (Correct target for mouseover)
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0)
    .attr("class", "tile")
    .attr("data-name", (d) => d.data.name)
    .attr("data-category", (d) => d.data.category)
    .attr("data-value", (d) => d.data.value)
    .style("fill", (d) => color(d.data.category))
    .style("opacity", (d) => opacity(d.data.value))
    .on("mouseover", function (event) {
      // Note: 'function' keyword is important here!
      const d = d3.select(this).datum(); // Get the data using d3.select(this).datum()

      console.log("Hovered element:", event.target);
      console.log("Data (d):", d);
      console.log("Type of d:", typeof d);

      if (!d || !d.data) {
        console.warn("Data is missing for this element:", d);
        return;
      }

      tooltip
        .style("opacity", 1)
        .attr("data-value", d.data.value)
        .html(
          `<strong>${d.data.name}</strong><br>
        Category: ${d.data.category}<br>
        Value: ${d.data.value}`
        )
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 30 + "px");
    })
    .on("mouseout", () => {
      // Mouseout handler added here!
      tooltip.style("opacity", 0); // Hide the tooltip
    });

  cells // Text elements (Do NOT attach mouseover here)
    .append("text")
    .attr("x", 3)
    .attr("y", 13)
    .text((d) => d.data.name)
    .style("font-size", "10px")
    .style("fill", "white");

  // LEGEND //

  const legendWidth = 15; // Smaller legend boxes
  const legendHeight = 15;
  const legendSpacing = 5;
  const legendPadding = 10;

  // Adjust legend position (to the right of the treemap)
  const legend = svg
    .append("g")
    .attr("id", "legend")
    .attr("transform", `translate(${mapWidth + margin - 80}, 50)`); // Adjust X & Y as needed

  const categories = color.domain();

  const legendItems = legend
    .selectAll("g")
    .data(categories)
    .enter()
    .append("g")
    .attr(
      "transform",
      (d, i) => `translate(0, ${i * (legendHeight + legendSpacing)})`
    );

  legendItems
    .append("rect")
    .attr("class", "legend-item") // ✅ Correct: Now applied to the rect
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .attr("fill", (d) => color(d))
    .attr("stroke", "black");

  legendItems
    .append("text")
    .attr("x", legendWidth + legendPadding)
    .attr("y", legendHeight / 2)
    .attr("dy", "0.35em")
    .style("font-size", "12px")
    .style("fill", "black")
    .text((d) => d);
});
