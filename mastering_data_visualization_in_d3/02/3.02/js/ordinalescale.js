// used when you want to associate difference categories with different colors

// d3 color schemes
//d3.schemeCategory10
//d3.schemeCategory20
//d3.schemeCategory20b
//d3.schemeCategory20c

const color = d3
  .scaleOrdinal()
  .domain(["AFRICA", "N. AMERICA", "EUROPE", "S. AMERICA", "ASIA", "AUSTRALIA"])
  .range(["RED", "ORANGE", "YELLOW", "GREEN", "BLUE", "INDIGO", "GREY"]);

console.log(color("AFRICA")); // "RED"
console.log(color("ASIA")); // "BLUE"
console.log(color("ANTARTICA")); // "GREY"
console.log(color("PANGEA")); // "RED"

const color2 = d3
  .scaleOrdinal()
  .domain(["AFRICA", "N. AMERICA", "EUROPE", "S. AMERICA", "ASIA", "AUSTRALIA"])
  .range(d3.schemeCategory10);

console.log(color2("AFRICA")); // "#1f77b4"
console.log(color2("ASIA")); // "#9467bd"
console.log(color2("ANTARTICA")); // "#e377c2"
console.log(color2("PANGEA")); // "#7f7f7f"
