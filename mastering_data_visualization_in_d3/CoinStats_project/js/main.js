/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    Project 3 - CoinStats
 */

const MARGIN = { LEFT: 20, RIGHT: 100, TOP: 50, BOTTOM: 100 };
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
const bisectDate = d3.bisector((d) => d.year).left;

// scales

async function fetchData() {
  try {
    const data = await d3.json("data/coins.json");
    return data;
  } catch (error) {
    console.log("Error fetching data: ", error);
  }
}

fetchData().then((data) => {
  const bitcoinData = data["bitcoin"];
  const bitcoinCashData = data["bitcoin_cash"];
  const litecoinData = data["litecoin"];
  const rippleData = data["ripple"];

  const cleanedBitcoinData = bitcoinData.filter(
    (item) => item.market_cap && item.price_usd
  );
  cleanedBitcoinData.map((bitcoin) => {
    bitcoin.price_usd = parseFloat(bitcoin.price_usd);
    bitcoin.market_cap = parseFloat(bitcoin.market_cap);
    bitcoin.date = parseDate(bitcoin.date).getFullYear();
  });

  //console.log(typeof cleanedBitcoinData[0].date);

  const x = d3.scaleLinear().domain([2013, 2018]).range([0, WIDTH]);

  const xAxisCall = d3
    .axisBottom(x)
    .ticks(4)
    .tickFormat((d, i, nodes) => {
      // Hide the first and last tick values
      if (i === 0 || i === nodes.length - 1) {
        return "";
      }
      return d3.format("d")(d);
    });
  const xAxis = g
    .append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${HEIGHT})`);

  xAxis.call(xAxisCall.scale(x));

  const priceExtent = d3.extent(cleanedBitcoinData, (d) => d.price_usd);
  console.log(priceExtent);

  const y = d3
    .scaleLinear()
    .domain([
      d3.min(cleanedBitcoinData, (d) => d.price_usd) / 1.005,
      d3.max(cleanedBitcoinData, (d) => d.price_usd) * 1.005,
    ])
    .range([HEIGHT, 0]);

  // axis generators
  const formatNumber = d3.format(",.2f");

  const yAxisCall = d3.axisLeft(y).ticks(12).tickFormat(d3.format("$.2f"));

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
    .text("Population)");

  // line path generator
  /*
  const line = d3
    .line()
    .x(cleanedBitcoinData, (d) => x(d.date))
    .y(cleanedBitcoinData, (d) => y(d.price_usd));*/

  // generate axes once scales have been set

  yAxis.call(yAxisCall.scale(y));

  // add line to chart
  g.append("path")
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "grey")
    .attr("stroke-width", "3px");
  // .attr("d", line(cleanedBitcoinData));

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
    const i = bisectDate(data, x0, 1);
    const d0 = data[i - 1];
    const d1 = data[i];
    //const d = x0 - d0.year > d1.year - x0 ? d1 : d0;
    focus.attr("transform", `translate(${x(d.year)}, ${y(d.value)})`);
    focus.select("text").text(d.value);
    focus.select(".x-hover-line").attr("y2", HEIGHT - y(d.value));
    focus.select(".y-hover-line").attr("x2", -x(d.year));
  }

  /******************************** Tooltip Code ********************************/
});
