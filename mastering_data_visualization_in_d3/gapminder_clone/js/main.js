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

async function fetchData() {
  try {
    const data = await d3.json("data/data.json");
    return data;
  } catch (error) {
    console.log("Error fetching data: ", error);
  }
}
fetchData().then((data) => {
  if (data) {
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
    //console.log(formattedData[0]);
    //console.log(formattedData[6]);

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

    // Below are going to

    const radiusScale = d3
      .scaleSqrt()
      .domain([0, d3.max(formattedData[0], (d) => d.population)])
      .range([0, 40]);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10); //

    let index = 0;

    d3.interval(() => {
      // Increment the index and wrap around if it exceeds the length of the data
      index = (index + 1) % formattedData.length;

      // Determine the slice of data to use based on the index
      const newData = formattedData[index];

      // Update with the new data
      update(newData);
    }, 1000);

    function update(data) {
      const t = d3.transition().duration(750);
      //console.log(data[0]);

      // JOIN

      const circles = g.selectAll("circle");

      // EXIT

      circles.exit().transition(t).attr("r", 0).remove();

      // ENTER
      circles
        .data(data)
        .enter()
        .append("circle")
        .attr("fill-opacity", 0.6)
        .merge(circles)
        .transition(t)
        .attr("r", (d) => radiusScale(d.population))
        .attr("fill", (d) => colorScale(d.country))
        .attr("cx", (d) => x(d.income))
        .attr("cy", (d) => y(d.life_exp));
    }
  }
});

/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    Project 2 - Gapminder Clone
 

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

const incomeExtent = d3.extent(formattedData.flat(), (d) => d.income);

const x = d3.scaleLog().domain(incomeExtent).range([0, WIDTH]);
const xAxisGroup = g.append("g").attr("transform", `translate(0, ${HEIGHT})`);

const y = d3.scaleLinear().domain([0, 90]).range([HEIGHT, 0]);
const yAxisGroup = g.append("g");
//for the transition
d3.json("data/data.json").then((data) => {
  data.map((year) => {
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

  // create interval I need to figure out the flag values I'm guessing it should be year
  d3.interval(() => {
    flag = !flag;
    const newData = flag ? formattedData : formattedData.slice(1);
    update(newData);
  }, 1000);

  update(data);
});

function update(data) {
  const t = d3.transition().duration(750);

  const xAxisCall = d3
    .axisBottom(x)
    .tickValues([400, 4000, 40000])
    .tickFormat(d3.format(",d"));
  xAxisGroup.transition(t).call(xAxisCall);

  const yAxisCall = d3.axisLeft(y);
  yAxisGroup.transition(t).call(yAxisCall);

  const radiusScale = d3
    .scaleSqrt()
    .domain([0, d3.max(data[0], (d) => d.population)])
    .range([0, 40]);

  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  // JOIN

  const circles = g.selectAll("circle").data(data, (d) => d.countries);

  // EXIT

  circles.exit().transition(t).attr("r", 0).remove();

  // ENTER
  circles
    .enter()
    .append("circle")
    .attr("fill-opacity", 0.6)
    .merge(circles)
    .transition(t)
    .attr("r", (d) => radiusScale(d.population))
    .attr("fill", (d) => colorScale(d.country))
    .attr("cx", (d) => x(d.income))
    .attr("cy", (d) => y(d.life_exp));
}
*/
