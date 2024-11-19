//https://d3-graph-gallery.com/graph/treemap_json.html
//https://www.freecodecamp.org/learn/data-visualization/data-visualization-projects/visualize-data-with-a-treemap-diagram

const VIDEO_GAME_SALES_URL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";

const containerWidth = 1200;
const containerHeight = 650;
const padding = 25;
const mapWidth = containerWidth - 2 * padding;
const maphHeight = containerHeight - 2 * padding;

Promise.all([d3.json(VIDEO_GAME_SALES_URL)]).then(([data]) => {
  var videoGameSalesData = data.children;
  console.log(videoGameSalesData);
  console.log(videoGameSalesData[0].children[0].value);

  var root = d3.hierarchy(videoGameSalesData[1]).sum((d) => d.value);

  //create svg
  var svg = d3
    .select("#treemap")
    .append("svg")
    .attr("width", containerWidth)
    .attr("height", containerHeight);
});
