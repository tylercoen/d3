/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    2.8 - Activity: Your first visualization!
 */

d3.json("./data/buildings.json")
  .then((data) => {
    //insert code here
    const svg = d3
      .select("#chart-area")
      .append("svg")
      .attr("height", 350)
      .attr("width", 600);

    const buildings = svg.selectAll("rect").data(data);

    buildings
      .enter()
      .append("rect")
      .attr("width", 50)
      .attr("height", (d) => d.height)
      .attr("fill", "grey")
      .attr("x", (d, i) => i * 75)
      .attr("y", 0);
  })
  .catch((error) => {
    console.log(error);
  });
