const circleToPolygon = require('circle-to-polygon');
const { writeFileSync } = require('fs');

// console.log('input', process.argv[process.argv.length - 1]);

const coordinates = [11.961833057409644 + 0.4 + 0.5, 51.212890862110186 - 3.4]; //[lon, lat]

const radius = 2850000 + 100000; // in meters
// const radius = 5850000; // in meters
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