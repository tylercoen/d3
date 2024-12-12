// Add rectangles for each node in the hierarchy
svg
  .selectAll("rect")
  .data(root.leaves())
  .enter()
  .append("rect")
  .attr("x", function (d) {
    return d.x0;
  })
  .attr("y", function (d) {
    return d.y0;
  })
  .attr("width", function (d) {
    return d.x1 - d.x0;
  })
  .attr("height", function (d) {
    return d.y1 - d.y0;
  })
  .attr("fill", function (d) {
    return color(d.parent.data.name);
  }); // Color based on parent

svg
  .selectAll("text")
  .data(root.leaves())
  .enter()
  .append("text")
  .attr("x", function (d) {
    return d.x0 + 10;
  })
  .attr("y", function (d) {
    return d.y0 + 20;
  })
  .text(function (d) {
    return d.data.name;
  });
