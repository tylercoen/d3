const y = d3.scaleLinear().domain([0, 828]).range([0, 400]);

console.log(y(100)); //48.3
console.log(y(414)); //200
console.log(y(700)); //338.2

console.log(y.invert(48.3)); //100
console.log(y.invert(200)); //414
console.log(y.invert(338.2)); // 700
