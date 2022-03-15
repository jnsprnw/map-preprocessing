const circleToPolygon = require('circle-to-polygon');
const { writeFileSync } = require('fs');

// console.log('input', process.argv[process.argv.length - 1]);

// These are the coordinates with some fine tuning by myself.
const coordinates = [11.886553903952995 + 0.4 + 0.3, 51.62319673825441 - 3.4 - 1.8]; //[lon, lat]

// This is the radius, again with some fine tuning
const radius = 2850000 + 80000; // in meters
const options = { numberOfEdges: 256 }; //optional, that defaults to { numberOfEdges: 32 }

let polygon = circleToPolygon(coordinates, radius, options);

const file = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": polygon.coordinates
      }
    }
  ]
}

try {
  writeFileSync('source/clip.geojson', JSON.stringify(file, null, 2), 'utf8');
  console.log('Data successfully saved to disk');
} catch (error) {
  console.log('An error has occurred ', error);
}