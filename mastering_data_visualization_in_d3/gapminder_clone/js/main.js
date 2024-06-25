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

let time = 0;
let interval;
let formattedData;

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
    formattedData = data.map((year) => {
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

    const xLabel = g
      .append("text")
      .attr("y", HEIGHT + 50)
      .attr("x", WIDTH / 2)
      .attr("font-size", "20px")
      .attr("text-anchor", "middle")
      .text("GDP Per Capita ($)");

    const yLabel = g
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -40)
      .attr("x", -170)
      .attr("font-size", "20px")
      .attr("text-anchor", "middle")
      .text("Life Expectancy (Years)");

    let year = 1800;

    const timeLabel = g
      .append("text")
      .attr("y", HEIGHT - 10)
      .attr("x", WIDTH - 40)
      .attr("font-size", "40px")
      .attr("opacity", "0.4")
      .attr("text-anchor", "middle")
      .text(year);

    const continentColor = d3.scaleOrdinal(d3.schemePastel1);

    const continents = ["europe", "asia", "americas", "africa"];

    const legend = g
      .append("g")
      .attr("transform", `translate(${WIDTH - 10}, ${HEIGHT - 125})`);

    continents.forEach((continent, i) => {
      const legendRow = legend
        .append("g")
        .attr("transform", `translate(0, ${i * 20})`);

      legendRow
        .append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", continentColor(continent));

      legendRow
        .append("text")
        .attr("x", -10)
        .attr("y", 10)
        .attr("text-anchor", "end")
        .style("text-transform", "capitalize")
        .text(continent);
    });
    //Need to figure out the tooltip, had to add the script with the d3.tip library in the html doc.

    const tip = d3
      .tip()
      .attr("class", "d3-tip")
      .html((d) => {
        let text = `<strong>Country:</strong> <span style='color:red;text-transform:capitalize'>${d.country}</span><br>`;
        text += `<strong>Continent:</strong> <span style='color:red;text-transform:capitalize'>${d.continent}</span><br>`;
        text += `<strong>Life Expectancy:</strong> <span style='color:red'>${d3.format(
          ".2f"
        )(d.life_exp)}</span><br>`;
        text += `<strong>GDP Per Capita:</strong> <span style='color:red'>${d3.format(
          "$,.0f"
        )(d.income)}</span><br>`;
        text += `<strong>Population:</strong> <span style='color:red'>${d3.format(
          ",.0f"
        )(d.population)}</span>`;
        return text;
      });

    g.call(tip);

    const radiusScale = d3
      .scaleSqrt()
      .domain([0, d3.max(formattedData[0], (d) => d.population)])
      .range([0, 40]);

    function step() {
      time = time < 214 ? time + 1 : 0;
      update(formattedData[time]);
    }
    $("#play-button").on("click", function () {
      const button = $(this);
      if (button.text() === "Play") {
        button.text("Pause");
        interval = setInterval(step, 500);
      } else {
        button.text("Play");
        clearInterval(interval);
      }
    });

    $("#reset-button").on("click", () => {
      time = 0;
      update(formattedData);
    });

    $("#continent-select").on("change", () => {
      update(formattedData[time]);
    });

    $("#date-slider").slider({
      min: 1800,
      max: 2014,
      step: 1,
      slide: (event, ui) => {
        time = ui.value - 1800;
        update(formattedData[time]);
      },
    });

    function update(data) {
      const t = d3.transition().duration(500);

      const continent = $("#continent-select").val();
      const filteredData = data.filter((d) => {
        if (continent === "all") return true;
        else {
          return d.continent == continent;
        }
      });

      // JOIN

      const circles = g
        .selectAll("circle")
        .data(filteredData, (d) => d.country);

      // EXIT

      circles.exit().transition(t).attr("r", 0).remove();

      // ENTER
      circles
        .enter()
        .append("circle")
        .attr("fill", (d) => continentColor(d.continent))
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide)
        .merge(circles)
        .transition(t)
        .attr("cx", (d) => x(d.income))
        .attr("cy", (d) => y(d.life_exp))
        .attr("r", (d) => radiusScale(d.population));

      timeLabel.text(String(time + 1800));
      //timeLabel.text(String(time + 1800));

      $("#year")[0].innerHTML = String(time + 1800);
      $("#date-slider").slider("value", Number(time + 1800));
    }
  }
});
