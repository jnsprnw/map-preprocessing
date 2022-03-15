const { default: centroid} = require('@turf/centroid');
const { readFileSync } = require('fs');

const feature = JSON.parse(readFileSync('source/ne_50m_admin_0_countries_filtered.json'));

const point = centroid(feature).geometry.coordinates;

console.log(point)
console.log('Copy these coordinates to clip.js');
console.log('You might want to tweak the numbers a bit.');