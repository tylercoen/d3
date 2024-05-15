/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    Project 2 - Gapminder Clone
 */

const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 130 };
const WIDTH = 1000 - MARGIN.LEFT - MARGIN.LEFT;
const HEIGHT = 600 - MARGIN.TOP - MARGIN.BOTTOM;

const svg = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM);

/*	
svg
  .append("rect")
  .attr("height", "100%")
  .attr("width", "100%")
  .attr("fill", "red");
*/

const g = svg
  .append("g")
  .attr("transform", `translate(${MARGIN.LEFT},${MARGIN.TOP})`);

d3.json("data/data.json").then(function (data) {
  console.log(data[0]);
  console.log(data[0].countries[0]);
  console.log(data[0].countries[0].income);

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
        return country;
      });
  });

  const x = d3.scaleLog().domain([100, 150000]).range([0, WIDTH]);

  const xAxisScale = d3.axisBottom(x).tickValues([400, 4000, 40000]);

  g.append("g").call(xAxisScale).attr("transform", `translate(0, ${HEIGHT})`);

  const y = d3.scaleLinear().domain([0, 90]).range([HEIGHT, 0]);

  const yAxisScale = d3.axisLeft(y);

  g.append("g").call(yAxisScale);

  console.log(formattedData[0][0]);
});

/*
	const formattedData = data.map(year => {
		return year["countries"].filter(country => {
			const dataExists = (country.income && country.life_exp)
			return dataExists
		}).map(country => {
			country.income = Number(country.income)
			country.life_exp = Number(country.life_exp)
			return country
		})
	})


*/
