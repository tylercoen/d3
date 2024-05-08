/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    Project 1 - Star Break Coffee
 */

// Add an svg element, group, and margins

const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 130 };
const WIDTH = 800 - MARGIN.LEFT - MARGIN.LEFT;
const HEIGHT = 600 - MARGIN.TOP - MARGIN.BOTTOM;

const svg = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM);

// Use to check svg area
/*svg
  .append("rect")
  .attr("height", "100%")
  .attr("width", "100%")
  .attr("fill", "red");*/

const g = svg.append("g").style("fill", "grey");
//  .attr("transform", `translate(${MARGIN.LEFT},${MARGIN.TOP})`)
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
    .range([0, WIDTH])
    .paddingInner(0.3)
    .paddingOuter(0.2);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.revenue)])
    .range([HEIGHT, 0]);

  // add rectangles for each month

  const rects = g.selectAll("rect").data(data);
  //  scale the rectangles and move to bottom

  rects
    .enter()
    .append("rect")
    .attr("y", (d) => y(d.revenue))
    .attr("x", (d) => x(d.month))
    .attr("width", x.bandwidth)
    .attr("height", (d) => HEIGHT - y(d.revenue));

  // add axes and labels
  const xAxisScale = d3.axisBottom(x);

  g.append("g").call(xAxisScale).attr("transform", `translate(0, ${HEIGHT})`);

  const yAxisScale = d3.axisLeft(y);

  g.append("g").call(yAxisScale);
});
