/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    2.5 - Activity: Adding SVGs to the screen
 */

const svg = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", 500)
  .attr("height", 400);

svg
  .append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", 50)
  .attr("height", 50)
  .attr("fill", "green");

svg
  .append("line")
  .attr("x1", 60)
  .attr("y1", 5)
  .attr("x2", 120)
  .attr("y2", 150)
  .attr("stroke-width", 3)
  .attr("stroke", "black");

svg
  .append("ellipse")
  .attr("cx", 300)
  .attr("cy", 200)
  .attr("rx", 15)
  .attr("ry", 25)
  .attr("fill", "orange");
