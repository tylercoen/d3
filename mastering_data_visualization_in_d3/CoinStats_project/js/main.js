/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    Project 3 - CoinStats
 */

const MARGIN = { LEFT: 60, RIGHT: 100, TOP: 50, BOTTOM: 100 };
const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM;

const svg = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM);

const g = svg
  .append("g")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

// time parser for x-scale
const parseTime = d3.timeParse("%Y");
const parseDate = d3.timeParse("%d/%m/%Y");

// for tooltip
const bisectDate = d3.bisector((d) => d.date).left;

let selectedData;
let selectedCrypto = "bitcoin";
let allData;
let cleanedData;
let selectedMeasurement = "price_usd";

// scales

$("#coin-select").on("change", function () {
  selectedCrypto = d3.select(this).property("value");
  //console.log("Selected value: " + selectedCrypto);
  updateSelectedData();
  cleanedData = cleanAndParseData(selectedData);
  updateChart();
});

$("#var-select").on("change", function () {
  selectedMeasurement = d3.select(this).property("value");
  console.log(selectedMeasurement);
  updateSelectedData();
  cleanedData = cleanAndParseData(selectedData);
  updateYValue();
  updateChart();

  //Need to figure out the y-axis changes

  //Need to fix the line creation
});

async function fetchData() {
  try {
    const data = await d3.json("data/coins.json");
    allData = data;
    return data;
  } catch (error) {
    console.log("Error fetching data: ", error);
  }
}

function updateSelectedData() {
  switch (selectedCrypto) {
    case "bitcoin":
      selectedData = allData["bitcoin"];
      break;
    case "ethereum":
      selectedData = allData["ethereum"];
      break;
    case "bitcoin_cash":
      selectedData = allData["bitcoin_cash"];
      break;
    case "litecoin":
      selectedData = allData["litecoin"];
      break;
    case "ripple":
      selectedData = allData["ripple"];
      break;
    default:
      selectedData = allData["bitcoin"];
  }
  //console.log("Selected data: ", selectedData);
  return selectedData;
}

function updateYValue() {
  // not recognizing price_usd etc...
  switch (selectedMeasurement) {
    case "price_usd":
      selectedMeasurement = "price_usd";
      break;
    case "market_cap":
      selectedMeasurement = "market_cap";
      break;
    case "24h_vol":
      selectedMeasurement = "24h_vol";
      break;
    default:
      selectedMeasurement = "price_usd";
  }
  return selectedMeasurement;
}

function cleanAndParseData(data) {
  cleanedData = data.filter((item) => item.market_cap && item.price_usd);
  cleanedData.map((item) => {
    item.price_usd = parseFloat(item.price_usd);
    item.market_cap = parseFloat(item.market_cap);
    item["24h_vol"] = parseFloat(item["24h_vol"]);
    item.date = parseDate(item.date);
  });
  //console.log("Cleaned and parsed data: ", cleanedData);
  return cleanedData;
}

function updateChart() {
  // Remove previous line and axes
  g.selectAll(".line").remove();
  g.selectAll(".x.axis").remove();
  g.selectAll(".y.axis").remove();

  // X axis

  const x = d3
    .scaleTime()
    .domain(d3.extent(cleanedData, (d) => d.date))
    .range([0, WIDTH]);

  const xAxisCall = d3.axisBottom(x).ticks(4).tickFormat(d3.timeFormat("%Y"));

  const xAxis = g
    .append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${HEIGHT})`);

  xAxis.call(xAxisCall.scale(x));

  // Y axis

  const y = d3
    .scaleLinear()
    .domain([
      //d3.min(cleanedData, (d) => d.price_usd) / 1.005,
      d3.min(cleanedData, (d) => d[selectedMeasurement]) / 1.005,
      //d3.max(cleanedData, (d) => d.price_usd) * 1.005,
      d3.max(cleanedData, (d) => d[selectedMeasurement]) * 1.005,
    ])
    .range([HEIGHT, 0]);

  // axis generators

  const yAxisCall = d3.axisLeft(y).ticks(12).tickFormat(d3.format("$,.0f"));

  // axis groups

  const yAxis = g.append("g").attr("class", "y axis");

  // y-axis label
  yAxis
    .append("text")
    .attr("class", "axis-title")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .attr("fill", "#5D6971")
    .text(selectedMeasurement.replace("-", " ").toUpperCase());

  yAxis.call(yAxisCall.scale(y));
  // line path generator

  const line = d3
    .line()
    .x((d) => x(d.date))
    .y((d) => y(d[selectedMeasurement]));

  // generate axes once scales have been set

  // add line to chart
  g.append("path")
    .datum(cleanedData)
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "grey")
    .attr("stroke-width", "3px")
    .attr("d", line);

  /******************************** Tooltip Code ********************************/

  const focus = g.append("g").attr("class", "focus").style("display", "none");

  focus
    .append("line")
    .attr("class", "x-hover-line hover-line")
    .attr("y1", 0)
    .attr("y2", HEIGHT);

  focus
    .append("line")
    .attr("class", "y-hover-line hover-line")
    .attr("x1", 0)
    .attr("x2", WIDTH);

  focus.append("circle").attr("r", 7.5);

  focus.append("text").attr("x", 15).attr("dy", ".31em");

  g.append("rect")
    .attr("class", "overlay")
    .attr("width", WIDTH)
    .attr("height", HEIGHT)
    .on("mouseover", () => focus.style("display", null))
    .on("mouseout", () => focus.style("display", "none"))
    .on("mousemove", mousemove);

  function mousemove() {
    const x0 = x.invert(d3.mouse(this)[0]);
    const i = bisectDate(cleanedData, x0, 1);
    const d0 = cleanedData[i - 1];
    const d1 = cleanedData[i];
    const d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    focus.attr(
      "transform",
      `translate(${x(d.date)}, ${y(d[selectedMeasurement])})`
    );
    focus.select("text").text(d[selectedMeasurement]);
    focus
      .select(".x-hover-line")
      .attr("y2", HEIGHT - y(d[selectedMeasurement]));
    focus.select(".y-hover-line").attr("x2", -x(d.date));
  }

  /******************************** Tooltip Code ********************************/
}

fetchData().then((data) => {
  updateSelectedData();
  cleanedData = cleanAndParseData(selectedData);
  updateChart();
});
