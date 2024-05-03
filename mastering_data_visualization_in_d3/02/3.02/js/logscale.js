const x = d3.scaleLog().domain([300, 150000]).range([0, 400]).base(10);

//Domain is the max min of the data, has to be either all positive of all negative.
//Range is the max min of the screen pixels, can also be colors for a heat map
// base it the factors so factors of 10, factors of 2. 1 is just a linear scale.

console.log(x(500)); //32.9
console.log(x(5000)); //181.1
console.log(x(50000)); //329.3

console.log(x.invert(32.9)); //500
console.log(x.invert(181.1)); //5000
console.log(x.invert(329.3)); //50000
