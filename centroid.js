const { default: centroid} = require('@turf/centroid');
const { readFileSync } = require('fs');

const feature = JSON.parse(readFileSync('source/centroid.json'));

const point = centroid(feature).geometry.coordinates;

console.log(point)
console.log('Copy these coordinates to clip.js');
console.log('You might want to tweak the numbers a bit.');