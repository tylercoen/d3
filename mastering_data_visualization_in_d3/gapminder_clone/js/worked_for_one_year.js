/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    Project 2 - Gapminder Clone
 */

const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 130 };
const WIDTH = 1000 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 600 - MARGIN.TOP - MARGIN.BOTTOM;

const svg = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM);

const g = svg
  .append("g")
  .attr("transform", `translate(${MARGIN.LEFT},${MARGIN.TOP})`);

d3.json("data/data.json").then(function (data) {
  //console.log(data[0]);
  //console.log(data[0].countries[0]);
  //console.log(data[0].countries[0].income);

  //clean data
  const formattedData = data.map((year) => {
    return year["countries"]
      .filter((country) => {
        const dataExists = country.income && country.life_exp;
        return dataExists;
      })
      .map((country) => {
        country.income = Number(country.income);
        country.life_exp = Number(country.life_exp);
        country.population = Number(country.population);
        return country;
      });
  });

  const incomeExtent = d3.extent(formattedData.flat(), (d) => d.income);

  const x = d3.scaleLog().domain(incomeExtent).range([0, WIDTH]);

  const xAxisScale = d3
    .axisBottom(x)
    .tickValues([400, 4000, 40000])
    .tickFormat(d3.format(",d"));

  g.append("g").call(xAxisScale).attr("transform", `translate(0, ${HEIGHT})`);

  const y = d3.scaleLinear().domain([0, 90]).range([HEIGHT, 0]);

  const yAxisScale = d3.axisLeft(y);

  g.append("g").call(yAxisScale);

  const radiusScale = d3
    .scaleSqrt()
    .domain([0, d3.max(formattedData[0], (d) => d.population)])
    .range([0, 40]);

  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  g.selectAll("circle")
    .data(formattedData[0])
    .enter()
    .append("circle")
    .attr("cx", (d) => x(d.income))
    .attr("cy", (d) => y(d.life_exp))
    .attr("r", (d) => radiusScale(d.population))
    .attr("fill", (d) => colorScale(d.country))
    .attr("fill-opacity", 0.6);

  console.log(formattedData[0]);
});
