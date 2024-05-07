/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    Project 1 - Star Break Coffee
 */

// Add an svg element, group, and margins

const MARGIN = { LEFT: 50, RIGHT: 50, TOP: 50, BOTTOM: 50 };
const WIDTH = 600 - MARGIN.LEFT - MARGIN.LEFT;
const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM;

const svg = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", WIDTH)
  .attr("height", HEIGHT);

// Use to check svg area
/*svg
  .append("rect")
  .attr("height", "100%")
  .attr("width", "100%")
  .attr("fill", "red");*/

const g = svg
  .append("g")
  .attr("transform", `translate(${MARGIN.LEFT},${MARGIN.TOP})`)
  .style("fill", "grey");

// Load the data
d3.csv("./data/revenues.csv").then((data) => {
  data.forEach((d) => {
    d.revenue = Number(d.revenue);
    d.profit = Number(d.profit);
  });

  // create scales band scales for x-axis and linear scale for y-axis

  const x = d3
    .scaleBand()
    .domain(data.map((d) => d.month))
    .range([0, WIDTH]);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.revenue)])
    .range([HEIGHT, 0]);
});

// add rectangles for each month

//  scale the rectangles and move to bottom

// add axes and labels
